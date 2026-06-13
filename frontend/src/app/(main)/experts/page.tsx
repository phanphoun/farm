"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star, MapPin, Award, Clock, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import type { Expert } from "@/types";

const MOCK_EXPERTS: Expert[] = [
  {
    id: "e1",
    user: {
      id: "u1",
      name: "បណ្ឌិត សុខា",
      email: "",
      role: "expert",
      avatar: "",
      isVerified: true,
      createdAt: "",
      bio: "អ្នកជំនាញដំណាំស្រូវ",
    },
    specialization: "ដំណាំស្រូវ និងគ្រាប់ធញ្ញជាតិ",
    experience: 15,
    rating: 4.9,
    reviewsCount: 128,
    hourlyRate: 50000,
    availability: ["ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍"],
    bio: "អ្នកជំនាញផ្នែកដំណាំស្រូវ មានបទពិសោធន៍ ១៥ឆ្នាំ",
    isAvailable: true,
  },
  {
    id: "e2",
    user: {
      id: "u2",
      name: "វិទ្យាស្ថានកសិកម្ម",
      email: "",
      role: "expert",
      avatar: "",
      isVerified: true,
      createdAt: "",
      bio: "អ្នកជំនាញកសិកម្មសរីរាង្គ",
    },
    specialization: "កសិកម្មសរីរាង្គ",
    experience: 10,
    rating: 4.7,
    reviewsCount: 95,
    hourlyRate: 40000,
    availability: ["ច័ន្ទ", "ពុធ", "សុក្រ"],
    bio: "ជំនាញផ្នែកកសិកម្មសរីរាង្គ និងបរិស្ថាន",
    isAvailable: true,
  },
  {
    id: "e3",
    user: {
      id: "u3",
      name: "អ្នកជំនាញ រិទ្ធ",
      email: "",
      role: "expert",
      avatar: "",
      isVerified: true,
      createdAt: "",
      bio: "ពេទ្យសត្វ",
    },
    specialization: "ចិញ្ចឹមសត្វ និងពេទ្យសត្វ",
    experience: 8,
    rating: 4.5,
    reviewsCount: 67,
    hourlyRate: 35000,
    availability: ["អង្គារ", "ព្រហស្បតិ៍", "សៅរ៍"],
    bio: "ពេទ្យសត្វ មានបទពិសោធន៍ក្នុងការព្យាបាល និងថែទាំសត្វ",
    isAvailable: false,
  },
];

const SPECIALIZATIONS = ["ទាំងអស់", "ដំណាំស្រូវ", "សរីរាង្គ", "សត្វ", "បន្លែ"];

export default function ExpertsPage() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("ទាំងអស់");

  const filtered = MOCK_EXPERTS.filter((e) => {
    const matchSpec =
      specialization === "ទាំងអស់" ||
      e.specialization.includes(specialization);
    const matchSearch = e.user.name
      ?.toLowerCase()
      .includes(search.toLowerCase()) ?? false;
    return matchSpec && matchSearch;
  });

  return (
    <div className="space-y-4 px-4 pb-4">
      <h1 className="text-xl font-bold">អ្នកជំនាញ</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ស្វែងរកអ្នកជំនាញ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {SPECIALIZATIONS.map((s) => (
          <button
            key={s}
            onClick={() => setSpecialization(s)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium ${
              specialization === s
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((expert) => (
          <Card key={expert.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={expert.user.avatar} />
                  <AvatarFallback>
                    {getInitials(expert.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">
                        {expert.user.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Award className="h-3 w-3" />
                        {expert.experience} ឆ្នាំ
                      </div>
                    </div>
                    <Badge
                      variant={expert.isAvailable ? "success" : "secondary"}
                      className="text-[10px]"
                    >
                      {expert.isAvailable ? "ទំនេរ" : "រវល់"}
                    </Badge>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {expert.specialization}
                  </p>

                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {expert.rating} ({expert.reviewsCount})
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {expert.hourlyRate.toLocaleString()} ៛/ម៉ោង
                    </span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Link href={`/booking/${expert.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        កក់ការណាត់ជួប
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      ទំនាក់ទំនង
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
