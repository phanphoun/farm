import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  language: "km" | "en";
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  setLanguage: (lang: "km" | "en") => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      language: "km",
      sidebarOpen: false,
      theme: "light",
      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "farmjumnoy-ui" }
  )
);
