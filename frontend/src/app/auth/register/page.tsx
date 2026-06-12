"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@/lib/utils";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("farmer");
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const registerMutation = useMutation({
    mutationFn: () => register({ name, email, password, phone, role }),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("ចុះឈ្មោះជោគជ័យ! សូមស្វាគមន៍!");
      router.push("/feed");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "ការចុះឈ្មោះបរាជ័យ"
      );
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
      <div className="mb-6 text-center">
        <span className="text-5xl">🌾</span>
        <h1 className="mt-3 text-2xl font-bold text-primary">
          ចុះឈ្មោះប្រើប្រាស់
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ជ្រើសរើសតួនាទីរបស់អ្នក
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          registerMutation.mutate();
        }}
        className="w-full max-w-sm space-y-4"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            តួនាទីរបស់អ្នក
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                  role === r.value
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-muted-foreground/30"
                }`}
              >
                <span className="text-2xl">{r.icon}</span>
                <span className="text-xs font-medium">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            ឈ្មោះពេញ
          </label>
          <Input
            placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            អ៊ីមែល
          </label>
          <Input
            type="email"
            placeholder="បញ្ចូលអ៊ីមែល"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            លេខទូរស័ព្ទ (ស្រេចចិត្ត)
          </label>
          <Input
            type="tel"
            placeholder="+855 12 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            ពាក្យសម្ងាត់
          </label>
          <Input
            type="password"
            placeholder="យ៉ាងហោចណាស់ 6 តួអក្សរ"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              កំពុងចុះឈ្មោះ...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              ចុះឈ្មោះ
            </span>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          មានគណនីរួចហើយ?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            ចូលប្រព័ន្ធ
          </Link>
        </p>
      </div>
    </div>
  );
}
