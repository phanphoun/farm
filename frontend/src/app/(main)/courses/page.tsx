"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Clock, Users, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCourses } from "@/services/learning";
import type { Course } from "@/types";

const CATEGORIES = ["ទាំងអស់", "ដំណាំស្រូវ", "សត្វ", "ជី", "បន្លែ"];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ទាំងអស់");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const { data } = await getCourses({
          category: activeCategory === "ទាំងអស់" ? undefined : activeCategory,
        });
        if (!cancelled) setCourses(data);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pb-4">
      <h1 className="mb-4 text-xl font-bold">វគ្គសិក្សា</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ស្វែងរកវគ្គសិក្សា..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">កំពុងផ្ទុក...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="overflow-hidden">
                <div className="flex gap-3 p-3">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <img
                      src={course.thumbnail ?? "/placeholder.png"}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="line-clamp-2 text-sm font-medium leading-tight">
                        {course.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {course.instructor?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.studentsCount ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant={
                          course.difficulty === "beginner"
                            ? "success"
                            : course.difficulty === "intermediate"
                              ? "warning"
                              : "destructive"
                        }
                        className="text-[10px]"
                      >
                        {course.difficulty === "beginner"
                          ? "ថ្នាក់ដំបូង"
                          : course.difficulty === "intermediate"
                            ? "មធ្យម"
                            : "កម្រិតខ្ពស់"}
                      </Badge>
                      {course.isFree ? (
                        <Badge variant="secondary" className="text-[10px]">
                          ឥតគិតថ្លៃ
                        </Badge>
                      ) : (
                        <span className="text-xs font-bold text-primary">
                          {course.price?.toLocaleString()} ៛
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
