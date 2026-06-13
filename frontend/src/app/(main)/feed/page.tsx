"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { PostCard } from "@/components/feed/PostCard";
import { PostCreator } from "@/components/feed/PostCreator";
import { getFeed, createPost as createPostApi } from "@/services/social";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import api from "@/services/api";
import toast from "react-hot-toast";

async function uploadFile(file: File): Promise<{ url: string; type: string }> {
  const form = new FormData();
  form.append("file", file);
  const folder = file.type.startsWith("video/") ? "posts-video" : "posts";
  const { data } = await api.post(`/media/upload?folder=${folder}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return { url: data.url, type: data.type ?? "image" };
}

export default function FeedPage() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: ({ pageParam }) => getFeed(pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < Math.ceil(lastPage.total / 10)
          ? lastPage.page + 1
          : undefined,
    });

  const { lastElementRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: hasNextPage ?? false,
    isLoading: isFetchingNextPage,
  });

  const posts = data?.pages.flatMap((p) => p.data) ?? [];

  const handleCreatePost = useCallback(
    async (content: string, files?: File[]) => {
      setIsSubmitting(true);
      try {
        // 1. Upload files first, collect media objects
        const media: { url: string; type: string }[] = [];
        if (files?.length) {
          await Promise.all(
            files.map(async (file) => {
              const result = await uploadFile(file);
              media.push(result);
            })
          );
        }

        // 2. Create post with JSON payload
        await createPostApi({ content: content || "", media });
        toast.success("អត្ថបទត្រូវបានបង្ហោះដោយជោគជ័យ!");
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      } catch {
        toast.error("មិនអាចបង្ហោះអត្ថបទបាន");
      } finally {
        setIsSubmitting(false);
      }
    },
    [queryClient]
  );

  const handleDeleted = useCallback(
    (id: string) => {
      queryClient.setQueryData(["feed"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((post: any) => post.id !== id),
          })),
        };
      });
    },
    [queryClient]
  );

  return (
    <div className="space-y-3 px-4 pb-24 pt-2">
      <PostCreator onSubmit={handleCreatePost} isSubmitting={isSubmitting} />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-sm text-muted-foreground">
          <p className="text-2xl">🌾</p>
          <p>មិនទាន់មានអត្ថបទទេ។ សូមចែករំលែកដំបូង!</p>
        </div>
      ) : (
        <>
          {posts.map((post, index) => (
            <div
              key={post.id}
              ref={index === posts.length - 1 ? lastElementRef : undefined}
            >
              <PostCard post={post} onDeleted={handleDeleted} />
            </div>
          ))}

          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
