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

export async function createPost(payload: {
  content?: string;
  media?: { url: string; type: string }[];
}): Promise<Post> {
  const { data } = await api.post("/posts", payload);
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

export async function deletePost(postId: string): Promise<void> {
  await api.delete(`/posts/${postId}`);
}

export async function updatePost(
  postId: string,
  payload: { content?: string }
): Promise<Post> {
  const { data } = await api.patch(`/posts/${postId}`, payload);
  return data;
}
