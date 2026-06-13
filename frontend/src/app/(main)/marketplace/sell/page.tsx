"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/services/api";
import toast from "react-hot-toast";

const CATEGORIES = [
  { value: "seeds",           label: "គ្រាប់ពូជ",          icon: "🌱" },
  { value: "fertilizer",      label: "ជី",                 icon: "🧪" },
  { value: "crop-protection", label: "ថ្នាំការពារដំណាំ",    icon: "🛡️" },
  { value: "equipment",       label: "ឧបករណ៍",             icon: "🔧" },
  { value: "irrigation",      label: "ប្រព័ន្ធស្រោចស្រព",  icon: "💧" },
  { value: "services",        label: "សេវាកម្ម",            icon: "🤝" },
];

const UNITS = ["គីឡូ", "ថូប", "ដំបូ", "ក្បាល", "ឈុត", "បាវ", "លីត្រ"];

export default function SellPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<"KHR" | "USD">("KHR");
  const [unit, setUnit] = useState("គីឡូ");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("seeds");
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImages((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return toast.error("សូមបញ្ចូលព័ត៌មានចាំបាច់");

    setIsSubmitting(true);
    try {
      await api.post("/products", {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        currency,
        unit,
        stockQuantity: Number(stock) || undefined,
        ...(categoryId ? { categoryId } : {}),
        images: [],
        tags: [],
        minOrderQty: 1,
      });
      toast.success("ផលិតផលត្រូវបានបង្ហោះដោយជោគជ័យ! 🎉");
      router.push("/marketplace");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg ?? "បរាជ័យក្នុងការបង្ហោះ"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background px-4 py-3">
        <button onClick={() => router.back()} className="text-muted-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold">ដាក់លក់ផលិតផល</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 px-4 pt-4">
        {/* Images */}
        <Card>
          <CardContent className="p-4">
            <p className="mb-3 text-sm font-medium">រូបថត</p>
            <div className="flex flex-wrap gap-2">
              {images.map((src, i) => (
                <div key={i} className="relative h-20 w-20">
                  <img src={src} alt="" className="h-full w-full rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
                >
                  <Camera className="h-6 w-6" />
                  <span className="text-[10px]">បន្ថែម</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImagePick} className="hidden" />
          </CardContent>
        </Card>

        {/* Basic info */}
        <Card>
          <CardContent className="space-y-4 p-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">ឈ្មោះផលិតផល <span className="text-destructive">*</span></label>
              <Input placeholder="ឧ. ដំណាំស្រូវវៀតណាម OM5451" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">ការពិពណ៌នា</label>
              <textarea
                placeholder="ពិពណ៌នាអំពីផលិតផលរបស់អ្នក..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">តម្លៃ <span className="text-destructive">*</span></label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="flex-1"
                  min="0"
                  required
                />
                <div className="flex overflow-hidden rounded-xl border">
                  {(["KHR", "USD"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${currency === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Unit + Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">ឯកតា</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">ចំនួន</label>
                <Input type="number" placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} min="0" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category */}
        <Card>
          <CardContent className="p-4">
            <p className="mb-3 text-sm font-medium">ប្រភេទ</p>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategoryId(cat.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 text-xs font-medium transition-all ${
                    categoryId === cat.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-input text-muted-foreground hover:border-muted-foreground/40"
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> កំពុងបង្ហោះ...</>
          ) : (
            <><Plus className="mr-2 h-5 w-5" /> ដាក់លក់ផលិតផល</>
          )}
        </Button>
      </form>
    </div>
  );
}
