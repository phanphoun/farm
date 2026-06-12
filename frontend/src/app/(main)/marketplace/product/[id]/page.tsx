"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, MapPin, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, getInitials } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

const MOCK_PRODUCT = {
  id: "p1",
  name: "គ្រាប់ពូជស្រូវ IR-504",
  description:
    "គ្រាប់ពូជស្រូវដែលមានគុណភាពខ្ពស់ ធន់នឹងជំងឺ និងសត្វល្អិត។ សាកសមសម្រាប់ការដាំដុះនៅកម្ពុជា។\n\nលក្ខណៈពិសេស:\n- ធន់នឹងគ្រោះរាំងស្ងួត\n- ទិន្នផលខ្ពស់ ៥-៦ តោន/ហិកតា\n- អាយុកាល ១០០-១១០ ថ្ងៃ",
  price: 25000,
  originalPrice: 30000,
  currency: "KHR",
  images: [
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400",
    "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400",
  ],
  category: "គ្រាប់ពូជ",
  condition: "new" as const,
  location: "ខេត្តបាត់ដំបង",
  seller: {
    id: "s1",
    name: "ហាងសុខា",
    email: "",
    role: "vendor" as const,
    avatar: "",
    isVerified: true,
    createdAt: "",
    bio: "លក់គ្រាប់ពូជ និងសម្ភារៈកសិកម្មមានគុណភាព",
  },
  stock: 100,
  rating: 4.5,
  reviewsCount: 23,
  isOrganic: true,
  createdAt: new Date().toISOString(),
};

export default function ProductDetailPage() {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(MOCK_PRODUCT, quantity);
    toast.success("បានបន្ថែមទៅកន្ត្រក!");
  };

  return (
    <div className="pb-24">
      <div className="relative">
        <Link
          href="/marketplace"
          className="absolute left-3 top-3 z-10 rounded-full bg-background/80 p-2 backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <button className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-2 backdrop-blur">
          <Heart className="h-5 w-5" />
        </button>
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={MOCK_PRODUCT.images[selectedImage]}
            alt={MOCK_PRODUCT.name}
            className="h-full w-full object-cover"
          />
        </div>
        {MOCK_PRODUCT.images.length > 1 && (
          <div className="mt-2 flex gap-2 px-4">
            {MOCK_PRODUCT.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                  selectedImage === i
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-4 px-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {MOCK_PRODUCT.isOrganic && (
                <Badge variant="success">សរីរាង្គ</Badge>
              )}
              <Badge>{MOCK_PRODUCT.category}</Badge>
            </div>
            <h1 className="mt-2 text-xl font-bold">{MOCK_PRODUCT.name}</h1>
            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {MOCK_PRODUCT.rating} ({MOCK_PRODUCT.reviewsCount})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {MOCK_PRODUCT.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(MOCK_PRODUCT.price, MOCK_PRODUCT.currency)}
          </span>
          {MOCK_PRODUCT.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(MOCK_PRODUCT.originalPrice, MOCK_PRODUCT.currency)}
            </span>
          )}
        </div>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Avatar>
              <AvatarImage src={MOCK_PRODUCT.seller.avatar} />
              <AvatarFallback>
                {getInitials(MOCK_PRODUCT.seller.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {MOCK_PRODUCT.seller.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {MOCK_PRODUCT.seller.bio}
              </p>
            </div>
            <Button variant="outline" size="sm">
              មើលហាង
            </Button>
          </CardContent>
        </Card>

        <div>
          <h3 className="mb-2 text-sm font-semibold">ពិពណ៌នា</h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {MOCK_PRODUCT.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">បរិមាណ:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                setQuantity(Math.min(MOCK_PRODUCT.stock, quantity + 1))
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            {MOCK_PRODUCT.stock} នៅសល់
          </span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              addItem(MOCK_PRODUCT, quantity);
              toast.success("បានបន្ថែមទៅកន្ត្រក!");
            }}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Link href="/checkout" className="flex-1">
            <Button className="w-full" size="lg" onClick={handleAddToCart}>
              ទិញឥឡូវនេះ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
