"use client";

import type { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

export function MainLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="mx-auto max-w-lg min-h-screen bg-background">
      {isAuthenticated && <Header />}
      <main className={isAuthenticated ? "pb-20 pt-2" : ""}>
        {children}
      </main>
      {isAuthenticated && <BottomNav />}
    </div>
  );
}
