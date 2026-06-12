"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  ShoppingBag,
  Calendar,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotificationStore } from "@/store/notificationStore";
import { formatDate, getInitials } from "@/lib/utils";
import type { Notification } from "@/types";

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "like",
    title: "ចូលចិត្តប្រកាសរបស់អ្នក",
    description: "បានចូលចិត្តប្រកាសរបស់អ្នក",
    userId: "u1",
    fromUser: { id: "u1", name: "សុខា ម៉ៅ", email: "", role: "farmer", isVerified: true, createdAt: "" },
    link: "/feed/post/1",
    isRead: false,
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "n2",
    type: "comment",
    title: "មតិយោបល់ថ្មី",
    description: "បានផ្ដល់មតិលើប្រកាសរបស់អ្នក",
    userId: "u2",
    fromUser: { id: "u2", name: "ម៉ាលី ច័ន្ទ", email: "", role: "farmer", isVerified: false, createdAt: "" },
    link: "/feed/post/1",
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "n3",
    type: "follow",
    title: "អ្នកតាមដានថ្មី",
    description: "បានតាមដានអ្នក",
    userId: "u3",
    fromUser: { id: "u3", name: "រិទ្ធ សុភា", email: "", role: "farmer", isVerified: false, createdAt: "" },
    link: "/profile/u3",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "n4",
    type: "order",
    title: "ការបញ្ជាទិញថ្មី",
    description: "មានការបញ្ជាទិញថ្មី #ORD-001",
    userId: "u4",
    link: "/orders/1",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "n5",
    type: "booking",
    title: "ការណាត់ជួបត្រូវបានបញ្ជាក់",
    description: "ការណាត់ជួបរបស់អ្នកត្រូវបានបញ្ជាក់",
    userId: "u5",
    fromUser: { id: "u5", name: "អ្នកជំនាញ សុខា", email: "", role: "expert", isVerified: true, createdAt: "" },
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  order: ShoppingBag,
  booking: Calendar,
  system: Bell,
};

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [local, setLocal] = useState(MOCK_NOTIFICATIONS);

  const handleMarkAll = () => {
    setLocal((prev) => prev.map((n) => ({ ...n, isRead: true })));
    markAllAsRead();
  };

  const handleRead = (id: string) => {
    setLocal((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    markAsRead(id);
  };

  const unreadCount = local.filter((n) => !n.isRead).length;

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
          <span className="text-sm text-muted-foreground">
            សារដែលមិនទាន់អាន
          </span>
        </div>
      )}

      <div className="space-y-2">
        {local.map((notification) => {
          const Icon =
            NOTIFICATION_ICONS[notification.type] || Bell;

          return (
            <Link
              key={notification.id}
              href={notification.link || "#"}
              onClick={() => handleRead(notification.id)}
              className={`flex items-start gap-3 rounded-xl p-4 transition-colors ${
                notification.isRead
                  ? "bg-background"
                  : "bg-primary/5"
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
                    <p className="text-sm font-medium">
                      {notification.title}
                    </p>
                    {notification.fromUser && (
                      <p className="text-sm text-muted-foreground">
                        {notification.fromUser.name}{" "}
                        {notification.description}
                      </p>
                    )}
                    {!notification.fromUser && (
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                    )}
                  </div>
                  {!notification.isRead && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(notification.createdAt)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
