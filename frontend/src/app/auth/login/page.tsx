"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login as loginApi } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const loginMutation = useMutation({
    mutationFn: () => loginApi(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("ចូលប្រព័ន្ធជោគជ័យ!");
      router.push("/feed");
    },
    onError: () => {
      toast.error("អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ");
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <span className="text-6xl">🌾</span>
        <h1 className="mt-4 text-2xl font-bold text-primary">FarmJumnoy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          ភ្ជាប់ទំនាក់ទំនងកសិកម្មឌីជីថល
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          loginMutation.mutate();
        }}
        className="w-full max-w-sm space-y-4"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            អ៊ីមែល / លេខទូរស័ព្ទ
          </label>
          <Input
            type="email"
            placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នក"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            ពាក្យសម្ងាត់
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="បញ្ចូលពាក្យសម្ងាត់"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              កំពុងចូល...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              ចូលប្រព័ន្ធ
            </span>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          មិនទាន់មានគណនីទេ?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            ចុះឈ្មោះ
          </Link>
        </p>
      </div>
    </div>
  );
}
