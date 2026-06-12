"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, Users, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Course } from "@/types";

const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    title: "បច្ចេកទេសដាំស្រូវបែបទំនើប",
    description: "រៀនពីបច្ចេកទេសដាំស្រូវបែបទំនើប ចាប់ពីការរៀបចំដី រហូតដល់ការប្រមូលផល",
    thumbnail: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400",
    instructor: {
      id: "i1",
      name: "វិទ្យាស្ថានកសិកម្ម",
      email: "",
      role: "expert",
      isVerified: true,
      createdAt: "",
    },
    category: "ដំណាំស្រូវ",
    difficulty: "beginner",
    duration: "2 ម៉ោង",
    lessonsCount: 8,
    studentsCount: 234,
    rating: 4.8,
    isFree: true,
    language: "km",
  },
  {
    id: "c2",
    title: "ការចិញ្ចឹមមាន់បែបសរីរាង្គ",
    description: "រៀនពីរបៀបចិញ្ចឹមមាន់បែបសរីរាង្គ",
    thumbnail: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
    instructor: {
      id: "i2",
      name: "អ្នកជំនាញ សុខា",
      email: "",
      role: "expert",
      isVerified: true,
      createdAt: "",
    },
    category: "សត្វ",
    difficulty: "beginner",
    duration: "1.5 ម៉ោង",
    lessonsCount: 6,
    studentsCount: 189,
    rating: 4.6,
    isFree: true,
    language: "km",
  },
  {
    id: "c3",
    title: "ការប្រើប្រាស់ជីសរីរាង្គ",
    description: "យល់ដឹងពីរបៀបប្រើប្រាស់ជីសរីរាង្គឱ្យមានប្រសិទ្ធភាព",
    thumbnail: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400",
    instructor: {
      id: "i3",
      name: "អង្គការ GRET",
      email: "",
      role: "ngo",
      isVerified: true,
      createdAt: "",
    },
    category: "ជី",
    difficulty: "intermediate",
    duration: "3 ម៉ោង",
    lessonsCount: 10,
    studentsCount: 156,
    rating: 4.7,
    isFree: false,
    price: 15000,
    language: "km",
  },
];

const CATEGORIES = ["ទាំងអស់", "ដំណាំស្រូវ", "សត្វ", "ជី", "បន្លែ"];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ទាំងអស់");

  const filtered = MOCK_COURSES.filter((c) => {
    const matchCat = activeCategory === "ទាំងអស់" || c.category === activeCategory;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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

      <div className="space-y-3">
        {filtered.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`}>
            <Card className="overflow-hidden">
              <div className="flex gap-3 p-3">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <img
                    src={course.thumbnail}
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
                      {course.instructor.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.studentsCount}
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
    </div>
  );
}
