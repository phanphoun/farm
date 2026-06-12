"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 pt-20">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="text-lg font-semibold">កន្ត្រកទទេ</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          សូមបន្ថែមផលិតផលទៅកន្ត្រករបស់អ្នក
        </p>
        <Link href="/marketplace">
          <Button className="mt-4">
            ត្រលប់ទៅទីផ្សារ
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/marketplace">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">កន្ត្រក</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={clearCart}
        >
          លុបទាំងអស់
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex gap-3 p-4">
              <Link
                href={`/marketplace/product/${item.product.id}`}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                  <Link
                    href={`/marketplace/product/${item.product.id}`}
                  >
                    <h3 className="text-sm font-medium line-clamp-1">
                      {item.product.name}
                    </h3>
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm font-bold text-primary">
                  {formatPrice(
                    item.product.price * item.quantity,
                    item.product.currency
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="mx-auto max-w-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">សរុប</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(totalPrice(), "KHR")}
            </span>
          </div>
          <Link href="/checkout">
            <Button className="w-full" size="lg">
              ទិញឥឡូវនេះ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
