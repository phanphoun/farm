import { create } from "zustand";
import type { ChatMessage, Conversation } from "@/types";

interface ChatStore {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, ChatMessage[]>;
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  setMessages: (conversationId: string, messages: ChatMessage[]) => void;
  updateUnreadCount: (conversationId: string, count: number) => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  conversations: [],
  activeConversation: null,
  messages: {},
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (conversation) =>
    set({ activeConversation: conversation }),
  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] || []),
          message,
        ],
      },
    })),
  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),
  updateUnreadCount: (conversationId, count) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: count } : c
      ),
    })),
}));
