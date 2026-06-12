"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/feed");
    } else {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <span className="text-6xl">🌾</span>
        <p className="mt-4 text-sm text-muted-foreground">កំពុងផ្ទុក...</p>
      </div>
    </div>
  );
}
