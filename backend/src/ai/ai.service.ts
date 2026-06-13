import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { QdrantClient } from '@qdrant/js-client-rest';
import { randomUUID } from 'node:crypto';
import { AiProvider, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from '../search/search.service';
import { AiChatDto } from './dto/ai-chat.dto';
import { AiIngestDto } from './dto/ai-ingest.dto';
import { ImageAnalysisDto } from './dto/image-analysis.dto';

interface RetrievedChunk {
  id: string | number;
  score: number;
  content: string;
  source?: string;
  title?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai?: OpenAI;
  private readonly anthropic?: Anthropic;
  private readonly gemini?: GoogleGenerativeAI;
  private readonly qdrant: QdrantClient;
  private readonly collection: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly search: SearchService
  ) {
    const openAiKey = config.get<string>('OPENAI_API_KEY');
    const anthropicKey = config.get<string>('ANTHROPIC_API_KEY');
    const geminiKey = config.get<string>('GOOGLE_GENERATIVE_AI_API_KEY');
    if (openAiKey) this.openai = new OpenAI({ apiKey: openAiKey });
    if (anthropicKey) this.anthropic = new Anthropic({ apiKey: anthropicKey });
    if (geminiKey) this.gemini = new GoogleGenerativeAI(geminiKey);

    this.collection = config.get<string>('QDRANT_COLLECTION', 'farmjumnoy_knowledge');
    this.qdrant = new QdrantClient({
      url: config.get<string>('QDRANT_URL', 'http://localhost:6333'),
      apiKey: config.get<string>('QDRANT_API_KEY') || undefined
    });
  }

  async chat(userId: string, dto: AiChatDto) {
    const language = dto.language ?? 'km-KH';
    const conversation = dto.conversationId
      ? await this.prisma.aiConversation.findFirst({
          where: { id: dto.conversationId, userId }
        })
      : await this.prisma.aiConversation.create({
          data: {
            userId,
            language,
            title: dto.message.slice(0, 80),
            farmContext: (dto.farmContext ?? {}) as Prisma.InputJsonValue,
          }
        });

    if (!conversation) throw new NotFoundException('Conversation not found');

    await this.prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        userId,
        role: 'USER',
        content: dto.message
      }
    });

    const context = await this.retrieve(dto.message, language);
    let answer: { content: string; provider: AiProvider; model: string };
    try {
      answer = await this.generateAnswer({
        question: dto.message,
        language,
        context,
        farmContext: dto.farmContext ?? (conversation.farmContext as Record<string, unknown>)
      });
    } catch (err) {
      this.logger.error(`AI generateAnswer failed: ${(err as Error).message}`);
      answer = {
        content: 'សូមទោស ខ្ញុំមិនអាចឆ្លើយបានឥឡូវនេះ។ សូមពិនិត្យការកំណត់ AI API key ហើយព្យាយាមម្តងទៀត។',
        provider: AiProvider.OPENAI,
        model: 'fallback'
      };
    }

    const assistantMessage = await this.prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: answer.content,
        citations: context.map((item) => ({
          id: item.id,
          title: item.title,
          source: item.source,
          score: item.score
        })),
        provider: answer.provider,
        model: answer.model
      }
    });

    return {
      conversationId: conversation.id,
      message: assistantMessage,
      citations: assistantMessage.citations,
      escalatesToExpert: context.length === 0 || context[0].score < this.config.get<number>('AI_LOW_CONFIDENCE_THRESHOLD', 0.55)
    };
  }

  async ingestDocument(uploadedById: string, dto: AiIngestDto) {
    const document = await this.prisma.aiDocument.create({
      data: {
        uploadedById,
        title: dto.title,
        source: dto.source,
        language: dto.language ?? 'km-KH',
        cropTags: dto.cropTags ?? [],
        provinceTags: dto.provinceTags ?? [],
        text: dto.text,
        status: 'PROCESSING'
      }
    });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 900,
      chunkOverlap: 120
    });
    const chunks = await splitter.splitText(dto.text);

    try {
      await this.ensureCollection();
      const points = await Promise.all(
        chunks.map(async (content, chunkIndex) => {
          const pointId = randomUUID();
          return {
            id: pointId,
            vector: await this.embed(content),
            payload: {
              documentId: document.id,
              title: document.title,
              source: document.source,
              language: document.language,
              cropTags: document.cropTags,
              provinceTags: document.provinceTags,
              chunkIndex,
              content
            }
          };
        })
      );
      await this.qdrant.upsert(this.collection, { points });

      await this.prisma.aiKnowledgeChunk.createMany({
        data: points.map((point) => ({
          documentId: document.id,
          qdrantPointId: String(point.id),
          chunkIndex: Number(point.payload.chunkIndex),
          content: String(point.payload.content),
          metadata: point.payload as Prisma.InputJsonValue
        }))
      });

      await this.search.indexDocument('ai_documents', {
        id: document.id,
        title: document.title,
        source: document.source,
        language: document.language,
        cropTags: document.cropTags,
        provinceTags: document.provinceTags
      });

      return this.prisma.aiDocument.update({
        where: { id: document.id },
        data: { status: 'READY' },
        include: { chunks: true }
      });
    } catch (error) {
      this.logger.error(`AI ingestion failed: ${(error as Error).message}`);
      return this.prisma.aiDocument.update({
        where: { id: document.id },
        data: { status: 'FAILED', metadata: { error: (error as Error).message } }
      });
    }
  }

  async analyzeImage(userId: string, dto: ImageAnalysisDto) {
    const analysis = await this.prisma.cropDiseaseAnalysis.create({
      data: {
        userId,
        farmId: dto.farmId,
        plotId: dto.plotId,
        conversationId: dto.conversationId,
        imageUrl: dto.imageUrl,
        cropName: dto.cropName,
        status: 'PROCESSING'
      }
    });

    const prompt = `Analyze this crop image for disease, pest, or nutrient issues. Crop: ${
      dto.cropName ?? 'unknown'
    }. Return practical advice for Cambodian farmers.`;

    const result = this.openai
      ? await this.openai.chat.completions.create({
          model: this.config.get<string>('OPENAI_CHAT_MODEL', 'gpt-4.1-mini'),
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: dto.imageUrl } }
              ] as never
            }
          ]
        })
      : undefined;

    const recommendation =
      result?.choices[0]?.message?.content ??
      'Image analysis is queued. Configure OPENAI_API_KEY for cloud disease detection.';

    return this.prisma.cropDiseaseAnalysis.update({
      where: { id: analysis.id },
      data: {
        status: 'COMPLETED',
        diagnosis: {
          provider: this.openai ? 'openai' : 'fallback',
          raw: recommendation
        },
        confidence: this.openai ? 0.7 : 0.3,
        recommendation
      }
    });
  }

  listConversations(userId: string) {
    return this.prisma.aiConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } }
    });
  }

  async getConversation(userId: string, id: string) {
    const conversation = await this.prisma.aiConversation.findFirst({
      where: { id, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } }, analyses: true }
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  private async retrieve(query: string, language: string): Promise<RetrievedChunk[]> {
    try {
      await this.ensureCollection();
      const vector = await this.embed(query);
      const result = await this.qdrant.search(this.collection, {
        vector,
        limit: this.config.get<number>('AI_MAX_CONTEXT_CHUNKS', 6),
        filter: {
          must: [{ key: 'language', match: { value: language } }]
        }
      });

      return result.map((point) => {
        const payload = point.payload ?? {};
        return {
          id: point.id,
          score: point.score ?? 0,
          content: String(payload.content ?? ''),
          source: String(payload.source ?? ''),
          title: String(payload.title ?? ''),
          metadata: payload
        };
      });
    } catch (error) {
      this.logger.warn(`RAG retrieval unavailable: ${(error as Error).message}`);
      return [];
    }
  }

  private async generateAnswer(input: {
    question: string;
    language: string;
    context: RetrievedChunk[];
    farmContext: Record<string, unknown>;
  }) {
    const contextText = input.context
      .map((item, index) => `[${index + 1}] ${item.title ?? 'Source'}\n${item.content}`)
      .join('\n\n');
    const system = [
      'You are FarmJumnoy, a Khmer-first agricultural assistant for Cambodian farmers.',
      'Use the provided context when possible. Be practical, safe, and cite source numbers.',
      'If confidence is low, recommend talking with a verified expert.',
      `Language: ${input.language}`,
      `Farm context: ${JSON.stringify(input.farmContext)}`
    ].join('\n');
    const prompt = `${system}\n\nContext:\n${contextText || 'No retrieved context.'}\n\nQuestion:\n${input.question}`;

    const provider = this.config.get<string>('AI_PROVIDER', 'openai');
    if (provider === 'anthropic' && this.anthropic) {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 900,
        messages: [{ role: 'user', content: prompt }]
      });
      const content = response.content.map((part) => ('text' in part ? part.text : '')).join('\n');
      return { content, provider: AiProvider.ANTHROPIC, model: response.model };
    }

    if (provider === 'gemini' && this.gemini) {
      try {
        const model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(prompt);
        return { content: response.response.text(), provider: AiProvider.GEMINI, model: 'gemini-1.5-flash' };
      } catch (err) {
        this.logger.warn(`Gemini failed: ${(err as Error).message}. Falling back.`);
      }
    }

    if (this.openai) {
      const model = this.config.get<string>('OPENAI_CHAT_MODEL', 'gpt-4.1-mini');
      const response = await this.openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: `Context:\n${contextText}\n\nQuestion:\n${input.question}` }
        ],
        temperature: 0.2
      });
      return {
        content: response.choices[0]?.message?.content ?? '',
        provider: AiProvider.OPENAI,
        model
      };
    }

    return {
      content:
        'AI provider is not configured yet. Based on the available context, please check crop symptoms, irrigation, fertilizer history, and local weather, then consult an expert if the crop is worsening.',
      provider: AiProvider.OPENAI,
      model: 'fallback'
    };
  }

  private async embed(text: string): Promise<number[]> {
    if (this.openai) {
      const response = await this.openai.embeddings.create({
        model: this.config.get<string>('OPENAI_EMBEDDING_MODEL', 'text-embedding-3-small'),
        input: text
      });
      return response.data[0].embedding;
    }

    return this.fallbackEmbedding(text, 1536);
  }

  private async ensureCollection() {
    const collections = await this.qdrant.getCollections();
    const exists = collections.collections.some((collection) => collection.name === this.collection);
    if (exists) return;
    await this.qdrant.createCollection(this.collection, {
      vectors: { size: 1536, distance: 'Cosine' }
    });
  }

  private fallbackEmbedding(text: string, size: number) {
    const vector = new Array<number>(size).fill(0);
    for (let i = 0; i < text.length; i += 1) {
      vector[i % size] += text.charCodeAt(i) / 255;
    }
    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
    return vector.map((value) => value / norm);
  }
}
