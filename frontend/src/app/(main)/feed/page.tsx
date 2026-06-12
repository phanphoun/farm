"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { PostCard } from "@/components/feed/PostCard";
import { PostCreator } from "@/components/feed/PostCreator";
import { getFeed } from "@/services/social";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { Post } from "@/types";
import toast from "react-hot-toast";

const MOCK_POSTS: Post[] = [
  {
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
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "2",
    content: "បងប្អូនកសិករទាំងអស់! តើមាននរណាដឹងពីវិធីកំចាត់សត្វល្អិតចង្រិតស្រូវដែរទេ? សូមចែករំលែកបទពិសោធន៍ផង! 🙏",
    author: {
      id: "u2",
      name: "រិទ្ធ សុភា",
      avatar: "",
      role: "farmer",
      email: "rith@example.com",
      isVerified: false,
      createdAt: "2024-02-01",
    },
    likesCount: 8,
    commentsCount: 12,
    sharesCount: 1,
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "3",
    content: "🌱 មកស្វែងយល់ពីបច្ចេកទេសដាំបន្លែសរីរាង្គជាមួយពួកយើង! ចុះឈ្មោះឥឡូវនេះដើម្បីទទួលបានវគ្គសិក្សាឥតគិតថ្លៃ! 🥬",
    images: [
      "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400",
    ],
    author: {
      id: "u3",
      name: "អង្គការ GRET",
      avatar: "",
      role: "ngo",
      email: "gret@example.com",
      isVerified: true,
      createdAt: "2023-06-01",
    },
    likesCount: 45,
    commentsCount: 8,
    sharesCount: 15,
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

export default function FeedPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: ({ pageParam }) => getFeed(pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total ? lastPage.page + 1 : undefined,
      enabled: false, // Use mock data for now
    });

  const { lastElementRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: hasNextPage ?? false,
    isLoading: isFetchingNextPage,
  });

  const handleCreatePost = useCallback(
    (content: string, files?: File[]) => {
      toast.success("បានបង្ហោះជោគជ័យ!");
    },
    []
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const posts = data?.pages.flatMap((p) => p.data) || MOCK_POSTS;

  return (
    <div className="space-y-4 px-4 pb-4">
      <PostCreator onSubmit={handleCreatePost} />

      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastElementRef : undefined}
        >
          <PostCard post={post} />
        </div>
      ))}

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
