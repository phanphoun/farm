import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

function normalizeUser(u: User): User {
  const roles = (u as unknown as { roles?: string[] }).roles;
  return {
    ...u,
    name: u.name || (u as unknown as { displayName?: string }).displayName || "",
    avatar: u.avatar || (u as unknown as { avatarUrl?: string }).avatarUrl,
    role: u.role || (roles?.[0] as User["role"]) || "FARMER",
  };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, token, refreshToken) => {
        localStorage.setItem("token", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        try {
          if (typeof document !== "undefined") {
            document.cookie = `token=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
          }
        } catch {
          // ignore
        }
        set({ user: normalizeUser(user), token, refreshToken: refreshToken ?? null, isAuthenticated: true });
      },
      setUser: (user) => set({ user: normalizeUser(user) }),
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        try {
          if (typeof document !== "undefined") {
            document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
          }
        } catch {
          // ignore
        }
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    { name: "farmjumnoy-auth" }
  )
);
