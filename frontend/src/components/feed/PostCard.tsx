"use client";

import { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Loader2,
  MoreHorizontal,
  Trash2,
  Edit2,
  Flag,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { likePost, getComments, createComment, deletePost, updatePost } from "@/services/social";
import { formatDate, getInitials } from "@/lib/utils";
import type { Post, Comment } from "@/types";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

interface PostCardProps {
  post: Post;
  onDeleted?: (id: string) => void;
}

export function PostCard({ post, onDeleted }: PostCardProps) {
  const user = useAuthStore((s) => s.user);
  const isOwner = user && post.author?.id === user.id;

  // Interactions
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [saved, setSaved] = useState(post.isSaved);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? 0);

  // Menu
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Edit
  const [showEdit, setShowEdit] = useState(false);
  const [editContent, setEditContent] = useState(post.content ?? "");
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((c) => (wasLiked ? c - 1 : c + 1));
    try {
      const result = await likePost(post.id);
      setLiked(result.isLiked);
      setLikesCount(result.likesCount);
    } catch {
      setLiked(wasLiked);
      setLikesCount((c) => (wasLiked ? c + 1 : c - 1));
    }
  };

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setCommentsLoading(true);
      try {
        const data = await getComments(post.id);
        setComments(Array.isArray(data) ? data : []);
      } catch {
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    }
    setShowComments((v) => !v);
    if (!showComments) setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const newComment = await createComment(post.id, commentText.trim());
      setComments((prev) => [...prev, newComment]);
      setCommentsCount((c) => c + 1);
      setCommentText("");
    } catch {
      toast.error("មិនអាចបញ្ចូនមតិយោបល់បាន");
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/feed/post/${post.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: "FarmJumnoy", url }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("បានចម្លងតំណភ្ជាប់!");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePost(post.id);
      toast.success("បានលុបអត្ថបទដោយជោគជ័យ");
      onDeleted?.(post.id);
    } catch {
      toast.error("លុបមិនបានជោគជ័យ");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
      setShowMenu(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim() || editSubmitting) return;
    setEditSubmitting(true);
    try {
      await updatePost(post.id, { content: editContent.trim() });
      toast.success("បានកែប្រែអត្ថបទដោយជោគជ័យ");
      setShowEdit(false);
    } catch {
      toast.error("កែប្រែមិនបានជោគជ័យ");
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header */}
        <CardHeader className="flex-row items-center gap-3 pb-2 pt-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author?.avatar} />
            <AvatarFallback>{getInitials(post.author?.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight truncate">
              {post.author?.name ?? "មិនស្គាល់"}
            </p>
            <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
          </div>

          {/* ••• menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-9 z-50 min-w-[180px] rounded-xl border bg-background shadow-lg overflow-hidden">
                {/* Save */}
                <button
                  onClick={() => { setSaved((v) => !v); setShowMenu(false); toast.success(saved ? "បានដកចេញ" : "បានរក្សាទុក"); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                >
                  <Bookmark className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} />
                  {saved ? "ដកចេញពីបញ្ជីរក្សាទុក" : "រក្សាទុកអត្ថបទ"}
                </button>

                {isOwner && (
                  <>
                    <div className="h-px bg-border mx-3" />
                    {/* Edit */}
                    <button
                      onClick={() => { setShowEdit(true); setShowMenu(false); }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      កែប្រែអត្ថបទ
                    </button>
                    <div className="h-px bg-border mx-3" />
                    {/* Delete */}
                    <button
                      onClick={() => { setConfirmDelete(true); setShowMenu(false); }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      លុបអត្ថបទ
                    </button>
                  </>
                )}

                {!isOwner && (
                  <>
                    <div className="h-px bg-border mx-3" />
                    <button
                      onClick={() => { setShowMenu(false); toast("បានរាយការណ៍", { icon: "🚩" }); }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Flag className="h-4 w-4" />
                      រាយការណ៍អត្ថបទ
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-2 pt-0">
          {/* Edit inline */}
          {showEdit ? (
            <div className="mb-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border bg-muted/30 p-3 text-sm outline-none focus:ring-1 focus:ring-primary/30"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowEdit(false)}
                  className="rounded-lg px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted"
                >
                  បោះបង់
                </button>
                <button
                  onClick={handleEdit}
                  disabled={editSubmitting}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm text-primary-foreground disabled:opacity-50"
                >
                  {editSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  រក្សាទុក
                </button>
              </div>
            </div>
          ) : (
            post.content && (
              <p className="mb-3 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
            )
          )}

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className={`mb-3 grid gap-0.5 overflow-hidden rounded-xl ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
              {post.images.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className={`relative bg-muted ${post.images!.length === 3 && i === 0 ? "col-span-2" : ""} aspect-square`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  {i === 3 && post.images!.length > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-bold text-white">
                      +{post.images!.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Videos */}
          {post.videos && post.videos.length > 0 && (
            <div className="mb-3 overflow-hidden rounded-xl">
              <video src={post.videos[0]} controls className="w-full max-h-72 object-cover" />
            </div>
          )}
        </CardContent>

        {/* Counts row */}
        {(likesCount > 0 || commentsCount > 0) && (
          <div className="flex items-center justify-between px-4 py-1 text-xs text-muted-foreground border-t">
            {likesCount > 0 && (
              <span className="flex items-center gap-1">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">❤</span>
                {likesCount}
              </span>
            )}
            {commentsCount > 0 && (
              <button onClick={handleToggleComments} className="hover:underline ml-auto">
                {commentsCount} មតិ
              </button>
            )}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center border-t px-2 py-0.5">
          <button
            onClick={handleLike}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors hover:bg-muted ${liked ? "text-red-500" : "text-muted-foreground"}`}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-red-500" : ""}`} />
            ចូលចិត្ត
          </button>

          <button
            onClick={handleToggleComments}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <MessageCircle className="h-5 w-5" />
            មតិ
          </button>

          <button
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <Share2 className="h-5 w-5" />
            ចែករំលែក
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="border-t bg-muted/20 px-4 pb-3 pt-2">
            <div className="mb-3 flex items-center gap-2">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-xs">{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 items-center overflow-hidden rounded-full bg-muted px-3 py-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="សរសេរមតិ..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {commentText.trim() && (
                  <button onClick={handleSubmitComment} disabled={submitting} className="ml-2 text-primary">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>

            {commentsLoading ? (
              <div className="flex justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground">មិនទាន់មានមតិទេ។ សូមចែករំលែកមតិដំបូង!</p>
            ) : (
              <div className="space-y-2.5">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-2">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarImage src={c.author?.avatar} />
                      <AvatarFallback className="text-[10px]">{getInitials(c.author?.name)}</AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl bg-muted px-3 py-1.5">
                      <p className="text-xs font-semibold leading-tight">{c.author?.name}</p>
                      <p className="text-sm leading-snug">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8">
          <div className="w-full max-w-sm rounded-2xl bg-background p-5 shadow-xl">
            <h3 className="text-base font-bold">លុបអត្ថបទ?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              អត្ថបទនឹងត្រូវបានលុបចោលជាអចិន្ត្រៃយ៍ ហើយមិនអាចយកមកវិញបានទេ។
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl border py-2.5 text-sm font-medium hover:bg-muted"
              >
                បោះបង់
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-destructive py-2.5 text-sm font-medium text-destructive-foreground disabled:opacity-60"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                លុបចោល
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
