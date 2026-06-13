import api from "./api";
import type { AIChatMessage } from "@/types";

export async function sendChatMessage(payload: {
  message: string;
  conversationId?: string;
}): Promise<{ reply: string; conversationId: string; escalatesToExpert?: boolean }> {
  const { data } = await api.post("/ai/chat", {
    message: payload.message,
    conversationId: payload.conversationId,
    language: "km-KH",
  });
  // Backend returns { conversationId, message: { content, ... }, citations, escalatesToExpert }
  return {
    reply: data.message?.content ?? data.reply ?? "",
    conversationId: data.conversationId ?? "",
    escalatesToExpert: data.escalatesToExpert ?? false,
  };
}

export async function analyzeImage(
  image: File
): Promise<{ disease: string; confidence: number; recommendation: string }> {
  const formData = new FormData();
  formData.append("image", image);
  const { data } = await api.post("/ai/image-analysis", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return {
    disease: data.diagnosis?.disease ?? data.disease ?? "Unknown",
    confidence: data.confidence ?? 0.5,
    recommendation: data.recommendation ?? "",
  };
}

export async function getAIConversations(): Promise<
  { id: string; title: string; updatedAt: string }[]
> {
  const { data } = await api.get("/ai/conversations");
  return Array.isArray(data) ? data : [];
}

export interface BackendAIMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

export async function getAIConversation(
  id: string
): Promise<{ id: string; title: string; messages: BackendAIMessage[] }> {
  const { data } = await api.get(`/ai/conversations/${id}`);
  return data;
}
