import api from "./api";
import type { Product } from "@/types";

export async function getProducts(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}): Promise<{ data: Product[]; total: number; page: number }> {
  const { data } = await api.get("/products", { params });
  return data;
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function createOrder(payload: {
  items: { productId: string; quantity: number }[];
  address: string;
  paymentMethod: string;
}): Promise<{ orderId: string; status: string }> {
  const { data } = await api.post("/orders", payload);
  return data;
}
