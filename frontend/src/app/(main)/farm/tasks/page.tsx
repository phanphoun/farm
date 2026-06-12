"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Check, Circle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed";
  dueDate: string;
}

const MOCK_TASKS: Task[] = [
  { id: "t1", title: "ស្រោចទឹកបន្លែ", priority: "high", status: "pending", dueDate: "ថ្ងៃនេះ" },
  { id: "t2", title: "ដាក់ជីស្រូវ", priority: "medium", status: "in_progress", dueDate: "ថ្ងៃស្អែក" },
  { id: "t3", title: "ពិនិត្យសត្វល្អិត", priority: "low", status: "completed", dueDate: "៣ ថ្ងៃ" },
  { id: "t4", title: "កាត់ស្មៅ", priority: "medium", status: "pending", dueDate: "៥ ថ្ងៃ" },
  { id: "t5", title: "ជួសជុលរបង", priority: "low", status: "pending", dueDate: "១ សប្តាហ៍" },
];

export default function FarmTasksPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return t.status !== "completed";
    if (filter === "completed") return t.status === "completed";
    return true;
  });

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "completed" ? "pending" : "completed" }
          : t
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="space-y-4 px-4 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/farm/dashboard">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">កិច្ចការ</h1>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          បន្ថែម
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">សរុប</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-yellow-600">
              {total - completed}
            </p>
            <p className="text-xs text-muted-foreground">នៅសល់</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-green-600">{completed}</p>
            <p className="text-xs text-muted-foreground">រួចរាល់</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        {(["all" as const, "pending" as const, "completed" as const]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            {f === "all" ? "ទាំងអស់" : f === "pending" ? "កំពុងរង់ចាំ" : "រួចរាល់"}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="flex items-center gap-3 p-4">
              <button
                onClick={() => toggleTask(task.id)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  task.status === "completed"
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-muted-foreground/30"
                }`}
              >
                {task.status === "completed" && <Check className="h-3 w-3" />}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                  <p className={`text-sm ${task.status === "completed" ? "text-muted-foreground line-through" : ""}`}>
                    {task.title}
                  </p>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  ផុតកំណត់: {task.dueDate}
                </p>
              </div>
              <Badge
                variant={
                  task.priority === "high"
                    ? "destructive"
                    : task.priority === "medium"
                      ? "warning"
                      : "outline"
                }
                className="text-[10px]"
              >
                {task.priority === "high"
                  ? "បន្ទាន់"
                  : task.priority === "medium"
                    ? "មធ្យម"
                    : "ធម្មតា"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
