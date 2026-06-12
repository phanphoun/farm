"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/feed/PostCard";
import { formatDate, getInitials } from "@/lib/utils";
import type { Post, Comment } from "@/types";

const MOCK_POST: Post = {
  id: "1",
  content: "សួស្តី! ថ្ងៃនេះខ្ញុំបានប្រមូលផលស្រូវរួចរាល់ហើយ ទិន្នផលល្អណាស់! 🌾 អរគុណ FarmJumnoy សម្រាប់ដំបូន្មានក្នុងការដាំដុះ។",
  images: [
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
  ],
  author: {
    id: "u1",
    name: "សុខា ម៉ៅ",
    avatar: "",
    role: "farmer",
    email: "sokha@example.com",
    isVerified: true,
    createdAt: "2024-01-01",
  },
  likesCount: 24,
  commentsCount: 5,
  sharesCount: 3,
  isLiked: false,
  isSaved: false,
  createdAt: new Date().toISOString(),
};

const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    content: "ល្អណាស់! សូមអបអរសាទរផង!",
    author: {
      id: "u2",
      name: "រិទ្ធ សុភា",
      avatar: "",
      role: "farmer",
      email: "rith@example.com",
      isVerified: false,
      createdAt: "2024-01-01",
    },
    postId: "1",
    createdAt: new Date(Date.now() - 600000).toISOString(),
    likesCount: 2,
  },
  {
    id: "c2",
    content: "តើអ្នកប្រើជីអ្វីខ្លះ? ខ្ញុំចង់ដឹងវិធីសាស្ត្ររបស់អ្នក",
    author: {
      id: "u3",
      name: "ម៉ាលី ច័ន្ទ",
      avatar: "",
      role: "farmer",
      email: "mali@example.com",
      isVerified: false,
      createdAt: "2024-02-01",
    },
    postId: "1",
    createdAt: new Date(Date.now() - 900000).toISOString(),
    likesCount: 0,
  },
];

export default function PostDetailPage() {
  const params = useParams();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(MOCK_COMMENTS);

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    const newComment: Comment = {
      id: `c${Date.now()}`,
      content: comment,
      author: {
        id: "me",
        name: "ខ្ញុំ",
        avatar: "",
        role: "farmer",
        email: "",
        isVerified: false,
        createdAt: "",
      },
      postId: params.id as string,
      createdAt: new Date().toISOString(),
      likesCount: 0,
    };
    setComments([newComment, ...comments]);
    setComment("");
  };

  return (
    <div className="px-4 pb-4">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/feed">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">ប្រកាស</h1>
      </div>

      <PostCard post={MOCK_POST} />

      <div className="mt-4 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">
          មតិយោបល់ ({comments.length})
        </h2>

        {comments.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex gap-3 p-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={c.author.avatar} />
                <AvatarFallback className="text-xs">
                  {getInitials(c.author.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {c.author.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm">{c.content}</p>
                <button className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                  <Heart className="h-3.5 w-3.5" />
                  <span>{c.likesCount}</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-20 left-0 right-0 border-t bg-background p-3">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <Input
            placeholder="សរសេរមតិយោបល់..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmitComment();
            }}
          />
          <Button size="icon" onClick={handleSubmitComment}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
