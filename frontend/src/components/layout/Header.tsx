"use client";

import Link from "next/link";
import { Bell, ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useCartStore } from "@/store/cartStore";
import { getInitials } from "@/lib/utils";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const cartCount = useCartStore((s) => s.totalItems());

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg safe-top">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href="/feed" className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="text-lg font-bold text-primary">FarmJumnoy</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/notifications">
            <Button variant="ghost" size="icon-sm" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon-sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Button>
          </Link>

          <Link href={user ? "/farm/dashboard" : "/auth/login"}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-xs">
                {user ? getInitials(user.displayName) : "?"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
