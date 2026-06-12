import api from "./api";
import type { Post, Comment } from "@/types";

export async function getFeed(
  page: number = 1,
  limit: number = 10
): Promise<{ data: Post[]; total: number; page: number }> {
  const { data } = await api.get("/feed", { params: { page, limit } });
  return data;
}

export async function getPost(id: string): Promise<Post> {
  const { data } = await api.get(`/posts/${id}`);
  return data;
}

export async function createPost(
  payload: FormData | { content: string; images?: string[] }
): Promise<Post> {
  const { data } = await api.post("/posts", payload, {
    headers:
      payload instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
  });
  return data;
}

export async function likePost(
  postId: string
): Promise<{ isLiked: boolean; likesCount: number }> {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data;
}

export async function getComments(
  postId: string
): Promise<Comment[]> {
  const { data } = await api.get(`/posts/${postId}/comments`);
  return data;
}

export async function createComment(
  postId: string,
  content: string,
  parentId?: string
): Promise<Comment> {
  const { data } = await api.post(`/posts/${postId}/comments`, {
    content,
    parentId,
  });
  return data;
}

export async function followUser(
  userId: string
): Promise<{ isFollowing: boolean }> {
  const { data } = await api.post(`/users/${userId}/follow`);
  return data;
}
