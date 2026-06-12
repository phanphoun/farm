"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate, getInitials } from "@/lib/utils";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
    onLike?.(post.id);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center gap-3 pb-3">
        <Link href={`/profile/${post.author.id}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link
            href={`/profile/${post.author.id}`}
            className="text-sm font-semibold hover:underline"
          >
            {post.author.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            {formatDate(post.createdAt)}
          </p>
        </div>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent>
        <Link href={`/feed/post/${post.id}`}>
          <p className="mb-3 text-sm leading-relaxed">{post.content}</p>
        </Link>

        {post.images && post.images.length > 0 && (
          <div
            className={`mb-3 grid gap-1 overflow-hidden rounded-xl ${
              post.images.length === 1
                ? "grid-cols-1"
                : post.images.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2"
            }`}
          >
            {post.images.slice(0, 4).map((img, i) => (
              <div key={i} className="relative aspect-square">
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {i === 3 && post.images.length > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-bold text-white">
                    +{post.images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <div className="flex items-center justify-between border-t px-5 py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-red-500"
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
            />
            <span>{likesCount}</span>
          </button>

          <Link
            href={`/feed/post/${post.id}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.commentsCount}</span>
          </Link>

          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        <button className="text-muted-foreground hover:text-primary">
          <Bookmark className={`h-5 w-5 ${post.isSaved ? "fill-primary text-primary" : ""}`} />
        </button>
      </div>
    </Card>
  );
}
