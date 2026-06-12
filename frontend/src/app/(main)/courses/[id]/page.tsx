"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Check,
  Clock,
  BookOpen,
  Users,
  Star,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import toast from "react-hot-toast";

const MOCK_COURSE = {
  id: "c1",
  title: "បច្ចេកទេសដាំស្រូវបែបទំនើប",
  description:
    "វគ្គសិក្សានេះនឹងបង្រៀនអ្នកពីបច្ចេកទេសដាំស្រូវបែបទំនើប ចាប់ពីការរៀបចំដី ការជ្រើសរើសពូជ ការថែទាំ រហូតដល់ការប្រមូលផល និងទីផ្សារ។\n\nអ្វីដែលអ្នកនឹងរៀន:\n- បច្ចេកទេសរៀបចំដី\n- ការជ្រើសរើសពូជស្រូវ\n- ការគ្រប់គ្រងទឹក\n- ការកំចាត់សត្វល្អិត\n- ការប្រមូលផល និងទីផ្សារ",
  thumbnail: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400",
  instructor: {
    id: "i1",
    name: "វិទ្យាស្ថានកសិកម្ម",
    email: "",
    role: "expert",
    isVerified: true,
    createdAt: "",
    avatar: "",
  },
  category: "ដំណាំស្រូវ",
  difficulty: "beginner",
  duration: "2 ម៉ោង",
  lessonsCount: 8,
  studentsCount: 234,
  rating: 4.8,
  isFree: true,
  language: "km",
  progress: 35,
};

const LESSONS = [
  { id: "l1", title: "សេចក្តីផ្តើម", duration: "10 នាទី", isFree: true, isCompleted: true },
  { id: "l2", title: "ការរៀបចំដី", duration: "15 នាទី", isFree: true, isCompleted: true },
  { id: "l3", title: "ការជ្រើសរើសពូជ", duration: "20 នាទី", isFree: true, isCompleted: false },
  { id: "l4", title: "ការដាំដុះ", duration: "25 នាទី", isFree: false, isCompleted: false },
  { id: "l5", title: "ការគ្រប់គ្រងទឹក", duration: "15 នាទី", isFree: false, isCompleted: false },
  { id: "l6", title: "ជី និងជីជាតិ", duration: "20 នាទី", isFree: false, isCompleted: false },
  { id: "l7", title: "ការកំចាត់សត្វល្អិត", duration: "20 នាទី", isFree: false, isCompleted: false },
  { id: "l8", title: "ការប្រមូលផល និងទីផ្សារ", duration: "15 នាទី", isFree: false, isCompleted: false },
];

export default function CourseDetailPage() {
  const params = useParams();
  const [expandedLessons, setExpandedLessons] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(true);

  return (
    <div className="pb-8">
      <div className="relative">
        <Link
          href="/courses"
          className="absolute left-3 top-3 z-10 rounded-full bg-background/80 p-2 backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={MOCK_COURSE.thumbnail}
            alt={MOCK_COURSE.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge>ថ្នាក់ដំបូង</Badge>
            {MOCK_COURSE.isFree && (
              <Badge variant="secondary">ឥតគិតថ្លៃ</Badge>
            )}
          </div>
          <h1 className="mt-2 text-xl font-bold">{MOCK_COURSE.title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {MOCK_COURSE.rating}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {MOCK_COURSE.studentsCount} នាក់
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {MOCK_COURSE.lessonsCount} មេរៀន
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {MOCK_COURSE.duration}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={MOCK_COURSE.instructor.avatar} />
            <AvatarFallback>
              {getInitials(MOCK_COURSE.instructor.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">
              {MOCK_COURSE.instructor.name}
            </p>
            <p className="text-xs text-muted-foreground">គ្រូបង្រៀន</p>
          </div>
        </div>

        {isEnrolled && (
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">វឌ្ឍនភាព</span>
              <span className="text-muted-foreground">
                {MOCK_COURSE.progress}%
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${MOCK_COURSE.progress}%` }}
              />
            </div>
          </div>
        )}

        <Card>
          <CardContent className="p-4">
            <h3 className="mb-2 text-sm font-semibold">អំពីវគ្គសិក្សា</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {MOCK_COURSE.description}
            </p>
          </CardContent>
        </Card>

        <div>
          <button
            onClick={() => setExpandedLessons(!expandedLessons)}
            className="flex w-full items-center justify-between py-2"
          >
            <h3 className="text-sm font-semibold">
              មេរៀន ({LESSONS.length})
            </h3>
            {expandedLessons ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>

          {expandedLessons && (
            <div className="space-y-1">
              {LESSONS.map((lesson, i) => (
                <button
                  key={lesson.id}
                  className="flex w-full items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                      lesson.isCompleted
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {lesson.isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {lesson.duration}
                      {!lesson.isFree && isEnrolled && " • ឥតគិតថ្លៃ"}
                    </p>
                  </div>
                  {!lesson.isCompleted && (
                    <Play className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {!isEnrolled && (
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              setIsEnrolled(true);
              toast.success("បានចុះឈ្មោះចូលរៀនជោគជ័យ!");
            }}
          >
            ចុះឈ្មោះរៀន
          </Button>
        )}
      </div>
    </div>
  );
}
