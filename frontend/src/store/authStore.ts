import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

function normalizeUser(u: User): User {
  return { ...u, name: u.name || u.displayName || "" };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        try {
          if (typeof document !== "undefined") {
            document.cookie = `token=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
          }
        } catch {
          // ignore cookie write failures
        }
        set({ user: normalizeUser(user), token, isAuthenticated: true });
      },
      setUser: (user) => set({ user: normalizeUser(user) }),
      logout: () => {
        localStorage.removeItem("token");
        try {
          if (typeof document !== "undefined") {
            document.cookie =
              "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
          }
        } catch {
          // ignore cookie write failures
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: "farmjumnoy-auth" }
  )
);
