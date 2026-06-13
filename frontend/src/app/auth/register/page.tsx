"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { UserPlus, Eye, EyeOff, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@/lib/utils";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [usePhone, setUsePhone] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<string>("FARMER");
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const registerMutation = useMutation({
    mutationFn: () =>
      register({
        name,
        email: usePhone ? "" : identifier,
        phone: usePhone ? identifier : undefined,
        password,
        role,
      }),
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken);
      toast.success("ចុះឈ្មោះជោគជ័យ! សូមស្វាគមន៍! 🌾");
      router.push("/feed");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string | string[] } } };
      const msg = err?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg ?? "ការចុះឈ្មោះបរាជ័យ"));
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
      {/* Brand */}
      <div className="mb-6 text-center">
        <span className="text-5xl">🌾</span>
        <h1 className="mt-3 text-2xl font-bold text-primary">ចុះឈ្មោះ FarmJumnoy</h1>
        <p className="mt-1 text-sm text-muted-foreground">ភ្ជាប់ទំនាក់ទំនងកសិកម្មឌីជីថល</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); registerMutation.mutate(); }}
        className="w-full max-w-sm space-y-4"
      >
        {/* Role picker */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">តួនាទីរបស់អ្នក</label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value.toUpperCase())}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                  role === r.value.toUpperCase()
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

        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">ឈ្មោះពេញ</label>
          <Input
            placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email / Phone toggle */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium">
              {usePhone ? "លេខទូរស័ព្ទ" : "អ៊ីមែល"}
            </label>
            <button
              type="button"
              onClick={() => { setUsePhone(!usePhone); setIdentifier(""); }}
              className="flex items-center gap-1 rounded-full border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {usePhone
                ? <><Mail className="h-3 w-3" /> ប្រើអ៊ីមែល</>
                : <><Phone className="h-3 w-3" /> ប្រើទូរស័ព្ទ</>
              }
            </button>
          </div>
          <Input
            type={usePhone ? "tel" : "email"}
            placeholder={usePhone ? "+855 12 345 678" : "you@example.com"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">ពាក្យសម្ងាត់</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="យ៉ាងហោចណាស់ 6 តួអក្សរ"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={registerMutation.isPending}>
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
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            ចូលប្រព័ន្ធ
          </Link>
        </p>
      </div>
    </div>
  );
}
