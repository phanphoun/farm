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
  const normalizedRole = String(payload.role || "").trim().toUpperCase();
  const { data } = await api.post("/auth/register", {
    displayName: payload.name,
    email: payload.email,
    password: payload.password,
    phone: payload.phone,
    role: normalizedRole,
  });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function updateProfile(
  payload: Partial<User>
): Promise<User> {
  const { data } = await api.patch("/users/me", payload);
  return data;
}
