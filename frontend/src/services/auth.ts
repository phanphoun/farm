import api from "./api";
import type { User, AuthState } from "@/types";

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function register(
  payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
  }
): Promise<{ user: User; token: string }> {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function updateProfile(
  payload: Partial<User>
): Promise<User> {
  const { data } = await api.patch("/auth/profile", payload);
  return data;
}
