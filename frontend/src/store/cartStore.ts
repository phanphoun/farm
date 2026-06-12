import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { id: crypto.randomUUID(), product, quantity },
            ],
          };
        });
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
    }),
    { name: "farmjumnoy-cart" }
  )
);
