"use client";

import { useState } from "react";
import { Search, Users, Lock, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import type { Group } from "@/types";

const MOCK_GROUPS: Group[] = [
  {
    id: "g1",
    name: "កសិករកម្ពុជា",
    description: "ក្រុមសម្រាប់កសិករខ្មែរទាំងអស់ ចែករំលែកបទពិសោធន៍កសិកម្ម",
    coverImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400",
    membersCount: 1234,
    isJoined: true,
    category: "កសិកម្មទូទៅ",
    createdAt: new Date().toISOString(),
  },
  {
    id: "g2",
    name: "ដាំបន្លែសរីរាង្គ",
    description: "ចែករំលែកចំណេះដឹងអំពីការដាំបន្លែសរីរាង្គ",
    coverImage: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400",
    membersCount: 856,
    isJoined: false,
    category: "បន្លែ",
    createdAt: new Date().toISOString(),
  },
  {
    id: "g3",
    name: "អ្នកចិញ្ចឹមសត្វ",
    description: "ក្រុមសម្រាប់អ្នកចិញ្ចឹមសត្វក្នុងស្រុក",
    coverImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
    membersCount: 567,
    isJoined: false,
    category: "សត្វ",
    createdAt: new Date().toISOString(),
  },
];

export default function GroupsPage() {
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState(MOCK_GROUPS);

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleJoin = (id: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, isJoined: !g.isJoined } : g
      )
    );
  };

  return (
    <div className="space-y-4 px-4 pb-4">
      <h1 className="text-xl font-bold">ក្រុម</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ស្វែងរកក្រុម..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((group) => (
          <Card key={group.id} className="overflow-hidden">
            <div className="h-24 overflow-hidden bg-muted">
              {group.coverImage && (
                <img
                  src={group.coverImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-background">
                    <AvatarImage src={group.coverImage} />
                    <AvatarFallback>
                      {getInitials(group.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-semibold">{group.name}</h3>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {group.membersCount.toLocaleString()} នាក់
                    </p>
                  </div>
                </div>
                <Button
                  variant={group.isJoined ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleJoin(group.id)}
                >
                  {group.isJoined ? "ចាកចេញ" : "ចូលរួម"}
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {group.description}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {group.category}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {group.isJoined ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <Globe className="h-3 w-3" />
                  )}
                  {group.isJoined ? "ឯកជន" : "សាធារណៈ"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
