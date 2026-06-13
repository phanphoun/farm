import api from "./api";
import type { User } from "@/types";

export async function login(
  identifier: string,
  password: string
): Promise<{ user: User; token: string; refreshToken: string }> {
  const { data } = await api.post("/auth/login", { identifier, password });
  return { user: data.user, token: data.accessToken, refreshToken: data.refreshToken };
}

export async function register(payload: {
  name: string;
  email?: string;
  password: string;
  phone?: string;
  role: string;
}): Promise<{ user: User; token: string; refreshToken: string }> {
  const { data } = await api.post("/auth/register", {
    displayName: payload.name,
    email: payload.email || undefined,
    password: payload.password,
    phone: payload.phone || undefined,
    role: payload.role.toUpperCase(),
  });
  return { user: data.user, token: data.accessToken, refreshToken: data.refreshToken };
}

export async function getMe(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function updateProfile(payload: Partial<User>): Promise<User> {
  const { data } = await api.patch("/users/me", payload);
  return data;
}
