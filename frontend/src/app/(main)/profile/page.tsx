"use client";

import { useRouter } from "next/navigation";
import {
  LogOut, User, Phone, Mail, Shield, Settings,
  ChevronRight, Bell, HelpCircle, FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/lib/utils";
import toast from "react-hot-toast";

const ROLE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  FARMER:     { label: "កសិករ",          color: "bg-green-100 text-green-700",  icon: "🌾" },
  VENDOR:     { label: "អ្នកលក់",         color: "bg-blue-100 text-blue-700",    icon: "🏪" },
  EXPERT:     { label: "អ្នកជំនាញ",       color: "bg-purple-100 text-purple-700",icon: "👨‍🔬" },
  TEACHER:    { label: "គ្រូ",            color: "bg-yellow-100 text-yellow-700",icon: "👨‍🏫" },
  NGO:        { label: "អង្គការ NGO",     color: "bg-orange-100 text-orange-700",icon: "🤝" },
  GOV:        { label: "រដ្ឋាភិបាល",      color: "bg-red-100 text-red-700",      icon: "🏛️" },
  ADMIN:      { label: "អ្នកគ្រប់គ្រង",   color: "bg-gray-100 text-gray-700",    icon: "⚙️" },
  SUPER_ADMIN:{ label: "Super Admin",     color: "bg-gray-100 text-gray-700",    icon: "🔑" },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("បានចាកចេញដោយជោគជ័យ");
    router.replace("/auth/login");
  };

  if (!user) {
    router.replace("/auth/login");
    return null;
  }

  const roleKey = (user.roles?.[0] ?? "FARMER").toUpperCase();
  const role = ROLE_LABELS[roleKey] ?? ROLE_LABELS.FARMER;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-primary/5 px-4 pb-6 pt-8">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-20 w-20 border-4 border-background shadow-md">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-2xl font-bold">
              {getInitials(user.displayName || user.name || "?")}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h1 className="text-xl font-bold">{user.displayName || user.name}</h1>
            {user.email && (
              <p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>
            )}
            <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${role.color}`}>
              <span>{role.icon}</span>
              {role.label}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mx-4 mt-4 overflow-hidden rounded-2xl border bg-background">
        {user.email && (
          <div className="flex items-center gap-3 px-4 py-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user.email}</span>
          </div>
        )}
        {user.phone && (
          <>
            <div className="mx-4 h-px bg-border" />
            <div className="flex items-center gap-3 px-4 py-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.phone}</span>
            </div>
          </>
        )}
        {user.roles?.length && (
          <>
            <div className="mx-4 h-px bg-border" />
            <div className="flex items-center gap-3 px-4 py-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{role.label}</span>
            </div>
          </>
        )}
      </div>

      {/* Menu */}
      <div className="mx-4 mt-4 overflow-hidden rounded-2xl border bg-background">
        {[
          { icon: Bell,       label: "សារជូនដំណឹង",   href: "/notifications" },
          { icon: Settings,   label: "ការកំណត់",        href: "#" },
          { icon: HelpCircle, label: "ជំនួយ",          href: "#" },
          { icon: FileText,   label: "លក្ខខណ្ឌប្រើប្រាស់", href: "#" },
        ].map(({ icon: Icon, label, href }, i, arr) => (
          <div key={label}>
            <button
              onClick={() => href !== "#" && router.push(href)}
              className="flex w-full items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            {i < arr.length - 1 && <div className="mx-4 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-4 mt-4">
        <Button
          variant="destructive"
          className="w-full"
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          ចាកចេញ
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        FarmJumnoy v1.0 · ជំនួយកសិករខ្មែរ 🌾
      </p>
    </div>
  );
}
