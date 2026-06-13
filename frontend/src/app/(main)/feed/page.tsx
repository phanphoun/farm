"use client";

import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { PostCard } from "@/components/feed/PostCard";
import { PostCreator } from "@/components/feed/PostCreator";
import { getFeed, getComments, createPost as createPostApi, likePost } from "@/services/social";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import toast from "react-hot-toast";

export default function FeedPage() {
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: ({ pageParam }) => getFeed(pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total ? lastPage.page + 1 : undefined,
    });

  const { lastElementRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: hasNextPage ?? false,
    isLoading: isFetchingNextPage,
  });

  const posts = data?.pages.flatMap((p) => p.data) ?? [];

  const handleCreatePost = useCallback(
    async (content: string, files?: File[]) => {
      try {
        const payload = files?.length
          ? new FormData()
          : { content };
        if (files?.length) {
          const formData = new FormData();
          formData.append("content", content);
          for (const file of files) {
            formData.append("files", file);
          }
          await createPostApi(formData);
        } else {
          await createPostApi({ content });
        }
        toast.success("បានបង្ហោះជោគជ័យ!");
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      } catch {
        toast.error("បរាជ័យក្នុងការបង្ហោះ");
      }
    },
    [queryClient]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <p>មិនមានប្រកាសនៅឡើយទេ</p>
      </div>
    );
  }

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
