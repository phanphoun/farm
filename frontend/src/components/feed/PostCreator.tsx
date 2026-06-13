"use client";

import { useState, useRef } from "react";
import { ImageIcon, Video, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/lib/utils";

interface PostCreatorProps {
  onSubmit: (content: string, files?: File[]) => void;
  isSubmitting?: boolean;
}

export function PostCreator({ onSubmit, isSubmitting }: PostCreatorProps) {
  const [content, setContent] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useAuthStore((s) => s.user);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!content.trim() && files.length === 0) return;
    onSubmit(content, files);
    setContent("");
    setPreviews([]);
    setFiles([]);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>
              {user ? getInitials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              placeholder="តើអ្នកកំពុងគិតពីអ្វី? ចែករំលែកបទពិសោធន៍កសិកម្មរបស់អ្នក..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none rounded-xl border-0 bg-muted/50 p-3 text-sm outline-none focus:ring-1 focus:ring-primary/30 min-h-[80px]"
              rows={3}
            />

            {previews.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {previews.map((preview, i) => (
                  <div key={i} className="relative">
                    <img
                      src={preview}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <button
                      onClick={() => removePreview(i)}
                      className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Video className="h-5 w-5 text-blue-600" />
                </Button>
              </div>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting || (!content.trim() && files.length === 0)}
              >
                {isSubmitting ? "កំពុងបង្ហោះ..." : "បង្ហោះ"}
              </Button>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
