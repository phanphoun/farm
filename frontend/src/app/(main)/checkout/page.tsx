"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Landmark, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/services/orders";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { id: "cash", label: "សាច់ប្រាក់", icon: Wallet },
  { id: "aba", label: "ABA Pay", icon: Landmark },
  { id: "wing", label: "Wing", icon: Landmark },
  { id: "acleda", label: "ACLEDA", icon: CreditCard },
];

export default function CheckoutPage() {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const handleCheckout = async () => {
    if (!address) {
      toast.error("សូមបញ្ចូលអាសយដ្ឋាន");
      return;
    }
    setIsProcessing(true);
    try {
      await createOrder({ items, address, paymentMethod });
      clearCart();
      toast.success("ការបញ្ជាទិញបានជោគជ័យ!");
      router.push("/feed");
    } catch {
      toast.error("បរាជ័យក្នុងការបញ្ជាទិញ");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 pt-20">
        <p className="text-muted-foreground">កន្ត្រកទទេ</p>
        <Link href="/cart">
          <Button variant="outline" className="mt-4">
            ត្រលប់ទៅកន្ត្រក
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/cart">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold">បញ្ជាទិញ</h1>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold">
              ព័ត៌មានដឹកជញ្ជូន
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 text-xs text-muted-foreground">
                  អាសយដ្ឋាន
                </label>
                <Input
                  placeholder="បញ្ចូលអាសយដ្ឋានរបស់អ្នក"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 text-xs text-muted-foreground">
                  លេខទូរស័ព្ទ
                </label>
                <Input
                  placeholder="+855 12 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold">វិធីបង់ប្រាក់</h3>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm transition-all ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-input"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    {method.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold">ទំនិញ</h3>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.product.images?.[0] ?? "/placeholder.png"}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      x{item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium">
                  {formatPrice(
                    item.product.price * item.quantity,
                    item.product.currency ?? "KHR"
                  )}
                </span>
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <span className="font-semibold">សរុប</span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(totalPrice(), "KHR")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="mx-auto max-w-lg">
          <Button
            className="w-full"
            size="lg"
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing
              ? "កំពុងដំណើរការ..."
              : `បញ្ជាការទិញ - ${formatPrice(totalPrice(), "KHR")}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
