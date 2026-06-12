import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch } from 'meilisearch';

export type SearchIndex = 'posts' | 'products' | 'courses' | 'ai_documents';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly client: MeiliSearch;

  constructor(config: ConfigService) {
    this.client = new MeiliSearch({
      host: config.get<string>('MEILI_HOST', 'http://localhost:7700'),
      apiKey: config.get<string>('MEILI_MASTER_KEY') || undefined
    });
  }

  async indexDocument(indexName: SearchIndex, document: Record<string, unknown>) {
    try {
      return await this.client.index(indexName).addDocuments([document]);
    } catch (error) {
      this.logger.warn(`Unable to index ${indexName}: ${(error as Error).message}`);
      return null;
    }
  }

  async search<T = unknown>(indexName: SearchIndex, query: string, options?: Record<string, unknown>) {
    return this.client.index(indexName).search<T>(query, options);
  }
}
