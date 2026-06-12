import api from "./api";
import type { Farm, Crop, FarmTask, FinanceRecord } from "@/types";

export async function getFarms(): Promise<Farm[]> {
  const { data } = await api.get("/farms");
  return data;
}

export async function createFarm(
  payload: Partial<Farm>
): Promise<Farm> {
  const { data } = await api.post("/farms", payload);
  return data;
}

export async function getFarmCrops(farmId: string): Promise<Crop[]> {
  const { data } = await api.get(`/farms/${farmId}/crops`);
  return data;
}

export async function getFarmTasks(farmId: string): Promise<FarmTask[]> {
  const { data } = await api.get(`/farms/${farmId}/tasks`);
  return data;
}

export async function updateTaskStatus(
  taskId: string,
  status: string
): Promise<FarmTask> {
  const { data } = await api.patch(`/tasks/${taskId}`, { status });
  return data;
}

export async function getFarmFinance(
  farmId: string
): Promise<FinanceRecord[]> {
  const { data } = await api.get(`/farms/${farmId}/finance`);
  return data;
}
