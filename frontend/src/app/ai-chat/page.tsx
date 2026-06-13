"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Send,
  ImagePlus,
  Bot,
  User,
  Sparkles,
  Mic,
  MicOff,
  History,
  Plus,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import type { AIChatMessage } from "@/types";
import {
  sendChatMessage,
  analyzeImage,
  getAIConversations,
  getAIConversation,
} from "@/services/ai";
import toast from "react-hot-toast";

const WELCOME: AIChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "សួស្តី! ខ្ញុំជាជំនួយការ AI របស់ FarmJumnoy។\n\nខ្ញុំអាចជួយអ្នកក្នុងការ\n- វិនិច្ឆ័យជំងឺដំណាំ\n- ផ្តល់យោបល់ស្រោចស្រព និងជី\n- បច្ចេកទេសការពារសត្វល្អិត\n- អាកាសធាតុ និងប្រតិទិនដាំដុះ\n\nតើអ្នកចង់សួរអ្វី?",
  createdAt: new Date().toISOString(),
};

const SUGGESTIONS = [
  "តើខ្ញុំត្រូវការពារសត្វល្អិតក្នុងស្រូវដោយរបៀបណា?",
  "ស្រូវត្រូវការទឹកប៉ុន្មាន?",
  "បច្ចេកទេសដាំបន្លែសរីរាង្គ",
  "ព័ត៌មានអាកាសធាតុសម្រាប់កសិករ",
];

export default function AIChatPage() {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<AIChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<
    { id: string; title: string; updatedAt: string }[]
  >([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const list = await getAIConversations();
      setConversations(list);
    } catch {
      // ignore
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const openConversation = async (id: string) => {
    try {
      const conv = await getAIConversation(id);
      const mapped: AIChatMessage[] = conv.messages.map((m) => ({
        id: m.id,
        role: m.role === "USER" ? "user" : "assistant",
        content: m.content,
        createdAt: m.createdAt,
      }));
      setMessages(mapped.length ? mapped : [WELCOME]);
      setConversationId(id);
      setShowHistory(false);
      setShowSuggestions(false);
    } catch {
      toast.error("មិនអាចផ្ទុកការសន្ទនាបាន");
    }
  };

  const newConversation = () => {
    setMessages([WELCOME]);
    setConversationId(undefined);
    setShowSuggestions(true);
    setShowHistory(false);
  };

  const startVoice = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) { toast.error("កម្មវិធីរុករកមិនគាំទ្រការស្គាល់សំឡេងទេ"); return; }
    const recognition = new SR();
    recognition.lang = "km-KH";
    recognition.interimResults = true;
    recognition.continuous = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results as ArrayLike<{ 0: { transcript: string } }>)
        .map((r) => r[0].transcript).join("");
      setInput(transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const handleSend = async (text?: string) => {
    const messageText = text ?? input;
    if (!messageText.trim() || isLoading) return;

    setShowSuggestions(false);
    const userMsg: AIChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: messageText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await sendChatMessage({ message: messageText, conversationId });
      if (result.conversationId) setConversationId(result.conversationId);

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: result.reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      if (result.escalatesToExpert) {
        toast("សូមពិចារណាពិគ្រោះជាមួយអ្នកជំនាញដែលបានផ្ទៀងផ្ទាត់សម្រាប់ប្រធានបទនេះ។", { icon: "👨‍🔬" });
      }
    } catch {
      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content:
          "សូមទោស ខ្ញុំមិនអាចឆ្លើយបានឥឡូវនេះ។ សូមព្យាយាមម្តងទៀត ឬពិគ្រោះជាមួយអ្នកជំនាញ។",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const { recommendation } = await analyzeImage(file);
      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: recommendation || "Image analysis complete. No issues detected.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      toast.error("មិនអាចវិភាគរូបភាពបាន");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b bg-background px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-semibold">FarmJumnoy AI</h1>
          <p className="text-xs text-green-600">Online</p>
        </div>
        <button
          onClick={() => { setShowHistory(true); loadHistory(); }}
          className="rounded-full p-2 text-muted-foreground hover:bg-muted"
          title="ប្រវត្តិ"
        >
          <History className="h-5 w-5" />
        </button>
        <button
          onClick={newConversation}
          className="rounded-full p-2 text-muted-foreground hover:bg-muted"
          title="ការសន្ទនាថ្មី"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* History panel */}
      {showHistory && (
        <div className="absolute inset-0 z-20 flex flex-col bg-background">
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <button onClick={() => setShowHistory(false)} className="rounded-full p-1 hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-semibold">Chat History</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {historyLoading ? (
              <p className="text-center text-sm text-muted-foreground py-8">Loading...</p>
            ) : conversations.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No saved conversations yet.</p>
            ) : (
              <div className="space-y-2">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => openConversation(c.id)}
                    className="w-full rounded-xl border bg-card p-3 text-left hover:bg-muted transition-colors"
                  >
                    <p className="text-sm font-medium truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[85%] gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="rounded-2xl bg-muted px-4 py-3">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.2s" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.4s" }} />
                  </span>
                </div>
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" /> សំណួរដែលគេសួរញឹកញាប់
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="rounded-full border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-background p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
          >
            <ImagePlus className="h-5 w-5" />
          </button>
          <button
            onClick={isRecording ? stopVoice : startVoice}
            className={`rounded-full p-2 transition-colors ${
              isRecording ? "bg-red-500 text-white" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <input
            type="text"
            placeholder="សួរសំណួរអំពីកសិកម្ម..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>
    </div>
  );
}
