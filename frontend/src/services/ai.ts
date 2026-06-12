import api from "./api";
import type { AIChatMessage } from "@/types";

export async function sendChatMessage(payload: {
  message: string;
  conversationId?: string;
  images?: string[];
}): Promise<{ reply: string; conversationId: string }> {
  const { data } = await api.post("/ai/chat", payload);
  return data;
}

export async function analyzeImage(
  image: File
): Promise<{ disease: string; confidence: number; recommendation: string }> {
  const formData = new FormData();
  formData.append("image", image);
  const { data } = await api.post("/ai/image-analysis", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getAIConversations(): Promise<
  { id: string; title: string; updatedAt: string }[]
> {
  const { data } = await api.get("/ai/conversations");
  return data;
}

export async function getAIConversation(
  id: string
): Promise<{ id: string; messages: AIChatMessage[] }> {
  const { data } = await api.get(`/ai/conversations/${id}`);
  return data;
}
