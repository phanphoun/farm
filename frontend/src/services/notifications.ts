import api from "./api";
import type { Notification } from "@/types";

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await api.get("/notifications");
  return (data.data ?? data) as Notification[];
}

export async function markNotificationRead(id: string) {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
}

export async function markAllNotificationsRead() {
  const { data } = await api.post("/notifications/read-all");
  return data;
}
