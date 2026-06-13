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

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
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
    return `${amount.toLocaleString("km-KH")} R`;
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
    FARMER:      "bg-green-100 text-green-800",
    VENDOR:      "bg-blue-100 text-blue-800",
    EXPERT:      "bg-purple-100 text-purple-800",
    TEACHER:     "bg-yellow-100 text-yellow-800",
    NGO:         "bg-orange-100 text-orange-800",
    GOV:         "bg-red-100 text-red-800",
    ADMIN:       "bg-gray-100 text-gray-800",
    SUPER_ADMIN: "bg-gray-100 text-gray-800",
  };
  return colors[role.toUpperCase()] ?? "bg-gray-100 text-gray-800";
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    FARMER:      "Farmer",
    VENDOR:      "Vendor",
    EXPERT:      "Expert",
    TEACHER:     "Teacher",
    NGO:         "NGO",
    GOV:         "Government",
    ADMIN:       "Admin",
    SUPER_ADMIN: "Super Admin",
  };
  return labels[role.toUpperCase()] ?? role;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Matches backend RoleName enum (ADMIN / SUPER_ADMIN are assigned manually)
export const ROLES = [
  { value: "FARMER",  label: "Farmer",     icon: "🌾", desc: "Farmer" },
  { value: "VENDOR",  label: "Vendor",     icon: "🏪", desc: "Vendor" },
  { value: "EXPERT",  label: "Expert",     icon: "🔬", desc: "Expert" },
  { value: "TEACHER", label: "Teacher",    icon: "📚", desc: "Teacher" },
  { value: "NGO",     label: "NGO",        icon: "🤝", desc: "NGO" },
  { value: "GOV",     label: "Government", icon: "🏛", desc: "Government" },
] as const;

export type RoleValue = typeof ROLES[number]["value"];

export const API_BASE_URL = (() => {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";

  const   clean = base.replace(/\/+$/, "");

  return clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`;
})();

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4001";
