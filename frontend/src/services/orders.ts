import api from "./api";
import type { Order, CartItem } from "@/types";

export async function createOrder(payload: {
  items: CartItem[];
  address: string;
  paymentMethod: string;
}) {
  const body = {
    items: payload.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
    address: payload.address,
    paymentMethod: payload.paymentMethod,
  };
  const { data } = await api.post("/orders", body);
  return data as Order;
}

export async function getOrders() {
  const { data } = await api.get("/orders");
  return data as Order[];
}

export async function getOrderById(id: string) {
  const { data } = await api.get(`/orders/${id}`);
  return data as Order;
}
