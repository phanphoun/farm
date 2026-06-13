import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "ឥឡូវនេះ";
  if (mins < 60) return `${mins} នាទីមុន`;
  if (hours < 24) return `${hours} ម៉ោងមុន`;
  if (days < 7) return `${days} ថ្ងៃមុន`;
  return d.toLocaleDateString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatPrice(
  amount: number,
  currency: string = "KHR"
): string {
  if (currency === "KHR") {
    return `${amount.toLocaleString("km-KH")} ៛`;
  }
  return `$${amount.toFixed(2)}`;
}

export function truncate(str: string, length: number = 100): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function getInitials(name?: string): string {
  const text = String(name ?? "").trim();
  if (!text) return "?";
  return text
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getRoleBadgeColor(role: string): string {
  const colors: Record<string, string> = {
    farmer: "bg-green-100 text-green-800",
    vendor: "bg-blue-100 text-blue-800",
    expert: "bg-purple-100 text-purple-800",
    teacher: "bg-yellow-100 text-yellow-800",
    ngo: "bg-orange-100 text-orange-800",
    admin: "bg-red-100 text-red-800",
  };
  return colors[role] || "bg-gray-100 text-gray-800";
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    farmer: "កសិករ",
    vendor: "អ្នកលក់",
    expert: "អ្នកជំនាញ",
    ngo: "អង្គការ",
    admin: "អ្នកគ្រប់គ្រង",
  };
  return labels[role] || role;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const ROLES = [
  { value: "farmer", label: "កសិករ (Farmer)", icon: "👨‍🌾" },
  { value: "vendor", label: "អ្នកលក់ (Vendor)", icon: "🛒" },
  { value: "expert", label: "អ្នកជំនាញ (Expert)", icon: "👨‍🔬" },
  { value: "teacher", label: "គ្រូ (Teacher)", icon: "🧑‍🏫" },
  { value: "ngo", label: "អង្គការ (NGO)", icon: "🤝" },
] as const;

export const API_BASE_URL = (() => {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4001";

  const clean = base.replace(/\/+$/, "");

  return clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`;
})();

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4001";
