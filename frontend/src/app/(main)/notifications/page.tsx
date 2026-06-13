"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Heart, MessageCircle, UserPlus, ShoppingBag, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotificationStore } from "@/store/notificationStore";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/services/notifications";
import { formatDate, getInitials } from "@/lib/utils";
import type { Notification } from "@/types";

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  order: ShoppingBag,
  booking: Calendar,
  system: Bell,
};

export default function NotificationsPage() {
  const { markAsRead, markAllAsRead } = useNotificationStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getNotifications();
        if (!cancelled) setNotifications(data);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4 px-4 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">សារជូនដំណឹង</h1>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAll}>
            អានទាំងអស់
          </Button>
        )}
      </div>

      {unreadCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {unreadCount}
          </span>
          <span className="text-sm text-muted-foreground">សារដែលមិនទាន់អាន</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">កំពុងផ្ទុក...</div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
            return (
              <Link
                key={notification.id}
                href={notification.link || "#"}
                onClick={() => handleRead(notification.id)}
                className={`flex items-start gap-3 rounded-xl p-4 transition-colors ${
                  notification.isRead ? "bg-background" : "bg-primary/5"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    notification.type === "like"
                      ? "bg-red-100 text-red-600"
                      : notification.type === "comment"
                        ? "bg-blue-100 text-blue-600"
                        : notification.type === "follow"
                          ? "bg-green-100 text-green-600"
                          : notification.type === "order"
                            ? "bg-purple-100 text-purple-600"
                            : notification.type === "booking"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{notification.title}</p>
                      {notification.fromUser ? (
                        <p className="text-sm text-muted-foreground">
                          {notification.fromUser.name} {notification.description}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                      )}
                    </div>
                    {!notification.isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
