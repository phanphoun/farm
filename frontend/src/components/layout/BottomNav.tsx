"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/notificationStore";
import { Home, ShoppingBag, BookOpen, Bot, User } from "lucide-react";

const navItems = [
  { href: "/feed",        label: "ព័ត៌មាន", icon: Home },
  { href: "/marketplace", label: "ទីផ្សារ", icon: ShoppingBag },
  { href: "/ai-chat",     label: "AI",      icon: Bot },
  { href: "/courses",     label: "រៀន",     icon: BookOpen },
  { href: "/profile",     label: "ប្រវត្តិ", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          const isProfile = item.href === "/profile";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {isProfile && unreadCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
