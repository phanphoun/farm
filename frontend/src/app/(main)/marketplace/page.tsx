"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "គ្រាប់ពូជស្រូវ IR-504",
    description: "គ្រាប់ពូជស្រូវដែលមានគុណភាពខ្ពស់",
    price: 25000,
    currency: "KHR",
    images: [
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300",
    ],
    category: "គ្រាប់ពូជ",
    condition: "new",
    location: "ខេត្តបាត់ដំបង",
    seller: {
      id: "s1",
      name: "ហាងសុខា",
      email: "",
      role: "vendor",
      isVerified: true,
      createdAt: "",
    },
    stock: 100,
    rating: 4.5,
    reviewsCount: 23,
    isOrganic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "ជីកំប៉ុស្តសរីរាង្គ ៥០គីឡូ",
    description: "ជីសរីរាង្គគុណភាពខ្ពស់",
    price: 45000,
    originalPrice: 55000,
    currency: "KHR",
    images: [
      "https://images.unsplash.com/photo-1559847844-5315695dadae?w=300",
    ],
    category: "ជី",
    condition: "new",
    location: "ភ្នំពេញ",
    seller: {
      id: "s2",
      name: "អង្គការ GRET",
      email: "",
      role: "ngo",
      isVerified: true,
      createdAt: "",
    },
    stock: 50,
    rating: 4.8,
    reviewsCount: 45,
    isOrganic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p3",
    name: "ម៉ាស៊ីនបាញ់ថ្នាំសត្វល្អិត",
    description: "ម៉ាស៊ីនបាញ់ថ្នាំងាយស្រួលប្រើ",
    price: 180000,
    currency: "KHR",
    images: [
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300",
    ],
    category: "ឧបករណ៍កសិកម្ម",
    condition: "new",
    location: "ខេត្តសៀមរាប",
    seller: {
      id: "s3",
      name: "ហាងសុវណ្ណា",
      email: "",
      role: "vendor",
      isVerified: true,
      createdAt: "",
    },
    stock: 15,
    rating: 4.2,
    reviewsCount: 12,
    isOrganic: false,
    createdAt: new Date().toISOString(),
  },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ទាំងអស់");

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchesCategory =
      activeCategory === "ទាំងអស់" || p.category === activeCategory;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

      <div className="grid grid-cols-2 gap-3">
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/marketplace/product/${product.id}`}>
            <Card className="overflow-hidden">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={product.images[0]}
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
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.originalPrice, product.currency)}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{product.location}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
