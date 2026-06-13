"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  ImagePlus,
  Bot,
  User,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import type { AIChatMessage } from "@/types";
import { sendChatMessage, analyzeImage } from "@/services/ai";
import toast from "react-hot-toast";

const WELCOME_MESSAGE: AIChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "សួស្តី! ខ្ញុំជាជំនួយការ AI របស់ FarmJumnoy 🌾\n\nខ្ញុំអាចជួយអ្នកក្នុងការ:\n• ឆ្លើយសំណួរកសិកម្ម\n• ធ្វើរោគវិនិច្ឆ័យជំងឺដំណាំ\n• ផ្តល់ដំបូន្មានបច្ចេកទេស\n• ព័ត៌មានអាកាសធាតុ\n\nតើអ្នកចង់សួរអ្វី?",
  createdAt: new Date().toISOString(),
};

const SUGGESTIONS = [
  "តើធ្វើដូចម្តេចដើម្បីកំចាត់សត្វល្អិត?",
  "តើស្រូវត្រូវការទឹកប៉ុន្មាន?",
  "បច្ចេកទេសដាំបន្លែសរីរាង្គ",
  "ការព្យាករអាកាសធាតុសម្រាប់កសិកម្ម",
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<AIChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    setShowSuggestions(false);
    const userMessage: AIChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: messageText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { reply } = await sendChatMessage({ message: messageText });
      const aiMessage: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const aiMessage: AIChatMessage = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      content: `សូមអរគុណចំពោះសំណួររបស់អ្នក! 🙏\n\nខ្ញុំសូមឆ្លើយតបថា៖ នេះជាចម្លើយសម្រាប់ "${messageText}"\n\n• ចំណុចទី១៖ អ្នកអាចប្រើបច្ចេកទេសកសិកម្មបែបទំនើប\n• ចំណុចទី២៖ សូមពិគ្រោះជាមួយអ្នកជំនាញបន្ថែម\n• ចំណុចទី៣៖ ទស្សនាវគ្គសិក្សារបស់យើង\n\nតើអ្នកមានសំណួរផ្សេងទៀតទេ?`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const { disease, recommendation } = await analyzeImage(file);
      const aiMessage: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: `ខ្ញុំបានវិភាគរូបភាពរបស់អ្នករួចរាល់! 🌱\n\nលទ្ធផល៖\n• ដំណាំ៖ ស្រូវ\n• បញ្ហា៖ ${disease}\n• កម្រិតគ្រោះថ្នាក់៖ មធ្យម\n\nដំណោះស្រាយ៖\n1. ប្រើប្រាស់ថ្នាំសម្លាប់សត្វល្អិតធម្មជាតិ\n2. គ្រប់គ្រងទឹកក្នុងស្រែ\n3. ពិគ្រោះជាមួយអ្នកជំនាញក្នុងកម្មវិធី`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      toast.error("បរាជ័យក្នុងការវិភាគរូបភាព");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="border-b bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">ជំនួយការ AI</h1>
            <p className="text-xs text-green-600">កំពុងដំណើរការ</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[85%] gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.content}
                  </div>
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
                  <span className="flex items-center gap-1 text-sm">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-primary"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-primary"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </span>
                </div>
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                សំណួរដែលអ្នកអាចសួរ
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

      <div className="border-t bg-background p-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-5 w-5" />
          </Button>
          <Input
            placeholder="សួរសំណួរកសិកម្មរបស់អ្នក..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button
            size="icon"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
