import api from "./api";
import type { Course, Quiz, QuizResult } from "@/types";

export async function getCourses(params?: {
  page?: number;
  category?: string;
  difficulty?: string;
}): Promise<{ data: Course[]; total: number }> {
  const { data } = await api.get("/courses", { params });
  return data;
}

export async function getCourse(id: string): Promise<Course> {
  const { data } = await api.get(`/courses/${id}`);
  return data;
}

export async function enrollCourse(courseId: string): Promise<void> {
  await api.post(`/courses/${courseId}/enroll`);
}

export async function getQuiz(id: string): Promise<Quiz> {
  const { data } = await api.get(`/quiz/${id}`);
  return data;
}

export async function submitQuiz(
  quizId: string,
  answers: number[]
): Promise<{ score: number; passed: boolean; result: QuizResult }> {
  const { data } = await api.post(`/quiz/${quizId}/submit`, { answers });
  return data;
}
