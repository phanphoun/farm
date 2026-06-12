"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface Transaction {
  id: string;
  description: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "f1", description: "លក់ស្រូវ", type: "income", category: "ការលក់", amount: 1500000, date: "១២ មិថុនា" },
  { id: "f2", description: "ទិញជី", type: "expense", category: "ការចំណាយ", amount: 200000, date: "១០ មិថុនា" },
  { id: "f3", description: "លក់បន្លែ", type: "income", category: "ការលក់", amount: 500000, date: "០៨ មិថុនា" },
  { id: "f4", description: "ទិញគ្រាប់ពូជ", type: "expense", category: "ការចំណាយ", amount: 150000, date: "០៥ មិថុនា" },
  { id: "f5", description: "ថ្លៃដឹកជញ្ជូន", type: "expense", category: "ការចំណាយ", amount: 80000, date: "០៣ មិថុនា" },
];

export default function FarmFinancePage() {
  const [period, setPeriod] = useState<"month" | "year">("month");

  const totalIncome = MOCK_TRANSACTIONS
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = MOCK_TRANSACTIONS
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-4 px-4 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/farm/dashboard">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">ហិរញ្ញវត្ថុ</h1>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          បន្ថែម
        </Button>
      </div>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <p className="text-sm opacity-80">សមតុល្យបច្ចុប្បន្ន</p>
          <p className="mt-1 text-3xl font-bold">
            {formatPrice(balance, "KHR")}
          </p>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <div>
                <p className="text-xs opacity-80">ចំណូល</p>
                <p className="text-sm font-semibold">
                  {formatPrice(totalIncome, "KHR")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              <div>
                <p className="text-xs opacity-80">ចំណាយ</p>
                <p className="text-sm font-semibold">
                  {formatPrice(totalExpense, "KHR")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {(["month" as const, "year" as const]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
              period === p
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            {p === "month" ? "ខែនេះ" : "ឆ្នាំនេះ"}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 text-sm font-semibold">ប្រតិបត្តិការថ្មីៗ</h3>
          <div className="space-y-2">
            {MOCK_TRANSACTIONS.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl bg-muted/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-xl p-2 ${
                      t.type === "income" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {t.type === "income" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.category} • {t.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatPrice(t.amount, "KHR")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
