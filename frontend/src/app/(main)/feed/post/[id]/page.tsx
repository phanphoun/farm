"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard } from "@/components/feed/PostCard";
import { getPost, getComments, createComment } from "@/services/social";
import { formatDate, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import type { Comment } from "@/types";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    enabled: !!id,
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: ["comments", id],
    queryFn: () => getComments(id),
    enabled: !!id,
  });

  const { mutate: submitComment, isPending: submitting } = useMutation({
    mutationFn: (text: string) => createComment(id, text),
    onSuccess: (newComment) => {
      queryClient.setQueryData(["comments", id], (old: Comment[]) => [
        ...(old ?? []),
        newComment,
      ]);
      setCommentText("");
    },
    onError: () => toast.error("មិនអាចបញ្ចូនមតិយោបល់បាន"),
  });

  if (postLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        រកមិនឃើញអត្ថបទ។
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-24">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background px-4 py-3">
        <button onClick={() => router.back()} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold">អត្ថបទ</span>
      </div>

      <div className="px-4 pt-3">
        <PostCard post={post} />
      </div>

      <div className="mt-3 px-4">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          {comments.length} មតិ
        </h2>

        {commentsLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            មិនទាន់មានមតិទេ។ សូមចែករំលែកមតិដំបូង!
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={c.author?.avatar} />
                  <AvatarFallback className="text-xs">{getInitials(c.author?.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="inline-block rounded-2xl bg-muted px-3 py-2">
                    <p className="text-xs font-semibold">{c.author?.name}</p>
                    <p className="text-sm">{c.content}</p>
                  </div>
                  <p className="mt-0.5 pl-1 text-[11px] text-muted-foreground">
                    {formatDate(c.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-16 left-0 right-0 border-t bg-background px-4 py-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-xs">{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 items-center gap-2 rounded-full bg-muted px-3 py-2">
            <input
              type="text"
              placeholder="សរសេរមតិ..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && commentText.trim() && submitComment(commentText.trim())
              }
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={() => commentText.trim() && submitComment(commentText.trim())}
              disabled={submitting || !commentText.trim()}
              className="text-primary disabled:opacity-40"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
