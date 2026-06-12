"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useChatStore } from "@/store/chatStore";
import type { Notification, ChatMessage } from "@/types";

export function useSocket() {
  const socket = useRef<Socket | null>(null);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const addMessage = useChatStore((s) => s.addMessage);

  useEffect(() => {
    if (!token || !user) return;

    socket.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.current.on("connect", () => {
      console.log("Socket connected");
      socket.current?.emit("join", { userId: user.id });
    });

    socket.current.on(
      "notification",
      (notification: Notification) => {
        addNotification(notification);
      }
    );

    socket.current.on(
      "chat:message",
      (message: ChatMessage) => {
        addMessage(message.receiverId, message);
      }
    );

    return () => {
      socket.current?.disconnect();
    };
  }, [token, user?.id]);

  const emit = useCallback(
    (event: string, data: unknown) => {
      socket.current?.emit(event, data);
    },
    []
  );

  return { socket: socket.current, emit };
}
