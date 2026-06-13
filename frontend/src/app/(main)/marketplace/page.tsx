"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProducts } from "@/services/marketplace";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const CATEGORIES = [
  "ទាំងអស់",
  "គ្រាប់ពូជ",
  "ជី",
  "ឧបករណ៍កសិកម្ម",
  "បន្លែផ្លែឈើ",
  "សត្វ",
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ទាំងអស់");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const { data } = await getProducts({
          search: activeCategory === "ទាំងអស់" ? search : undefined,
          category: activeCategory === "ទាំងអស់" ? undefined : activeCategory,
          sort: "newest",
        });
        if (!cancelled) setProducts(data);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [activeCategory, search]);

  return (
    <div className="px-4 pb-4">
      <h1 className="mb-4 text-xl font-bold">ទីផ្សារ</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ស្វែងរកផលិតផល..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-sm text-muted-foreground">កំពុងផ្ទុក...</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Link key={product.id} href={`/marketplace/product/${product.id}`}>
              <Card
                className="overflow-hidden"
                onDoubleClick={(event) => {
                  event.preventDefault();
                  addItem(product, 1);
                }}
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.images?.[0] ?? "/placeholder.png"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-3">
                  {product.isOrganic && (
                    <Badge variant="success" className="mb-1 text-[10px]">
                      សរីរាង្គ
                    </Badge>
                  )}
                  <h3 className="line-clamp-2 text-sm font-medium leading-tight">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(product.price, product.currency ?? "KHR")}
                    </span>
                    {product.originalPrice ? (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.originalPrice, product.currency ?? "KHR")}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{product.location ?? ""}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
