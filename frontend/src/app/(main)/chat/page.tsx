"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Phone, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import type { Conversation } from "@/types";

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    participants: [
      { id: "u1", name: "សុខា ម៉ៅ", email: "", role: "farmer", isVerified: true, createdAt: "" },
    ],
    lastMessage: {
      id: "m1",
      senderId: "u1",
      receiverId: "me",
      content: "សូមអរគុណច្រើន! ខ្ញុំទទួលបានព័ត៌មានល្អណាស់",
      type: "text",
      createdAt: new Date(Date.now() - 300000).toISOString(),
    },
    unreadCount: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "conv2",
    participants: [
      { id: "u2", name: "អ្នកជំនាញ រិទ្ធ", email: "", role: "expert", isVerified: true, createdAt: "" },
    ],
    lastMessage: {
      id: "m2",
      senderId: "u2",
      receiverId: "me",
      content: "សូមជម្រាបថា ការណាត់ជួបថ្ងៃស្អែកត្រូវបានបញ្ជាក់រួចរាល់",
      type: "text",
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    unreadCount: 0,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "conv3",
    participants: [
      { id: "u3", name: "ម៉ាលី ច័ន្ទ", email: "", role: "farmer", isVerified: false, createdAt: "" },
    ],
    lastMessage: {
      id: "m3",
      senderId: "me",
      receiverId: "u3",
      content: "បាទ ខ្ញុំអាចជួយអ្នកបាន",
      type: "text",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    unreadCount: 0,
    updatedAt: new Date().toISOString(),
  },
];

export default function ChatPage() {
  const [search, setSearch] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    c.participants[0]?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (activeChat) {
    const conversation = MOCK_CONVERSATIONS.find((c) => c.id === activeChat)!;
    return (
      <ChatView
        conversation={conversation}
        onBack={() => setActiveChat(null)}
      />
    );
  }

  return (
    <div className="space-y-4 px-4 pb-4">
      <h1 className="text-xl font-bold">សារ</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ស្វែងរកការសន្ទនា..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-1">
        {filtered.map((conv) => {
          const participant = conv.participants[0];
          return (
            <button
              key={conv.id}
              onClick={() => setActiveChat(conv.id)}
              className="flex w-full items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback>
                    {getInitials(participant.name)}
                  </AvatarFallback>
                </Avatar>
                {conv.unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{participant.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {conv.lastMessage
                      ? new Date(
                          conv.lastMessage.createdAt
                        ).toLocaleTimeString("km-KH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  {conv.lastMessage?.content}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChatView({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const [message, setMessage] = useState("");
  const participant = conversation.participants[0];
  const messages = [
    { id: "m1", content: "សួស្តី! តើអ្នកសុខសប្បាយទេ?", isMe: false, time: "០៩:០០" },
    { id: "m2", content: "បាទ ខ្ញុំសុខសប្បាយទេ អរគុណ!", isMe: true, time: "០៩:០២" },
    { id: "m3", content: "សូមអរគុណច្រើន! ខ្ញុំទទួលបានព័ត៌មានល្អណាស់", isMe: false, time: "០៩:០៥" },
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="border-b bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <Avatar className="h-9 w-9">
            <AvatarImage src={participant.avatar} />
            <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-semibold">{participant.name}</p>
            <p className="text-xs text-green-600">កំពុងនៅលើប្រព័ន្ធ</p>
          </div>
          <div className="flex gap-1">
            <button className="rounded-lg p-2 hover:bg-muted">
              <Phone className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 hover:bg-muted">
              <Video className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.isMe
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p>{msg.content}</p>
                <p
                  className={`mt-1 text-right text-[10px] ${
                    msg.isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t bg-background p-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="វាយសារ..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setMessage("");
              }
            }}
          />
          <Button size="icon">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
