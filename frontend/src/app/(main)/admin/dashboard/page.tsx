"use client";

import {
  Users,
  ShoppingBag,
  BookOpen,
  DollarSign,
  Activity,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATS = [
  { label: "អ្នកប្រើប្រាស់", value: "១,២៣៤", icon: Users, change: "+១២%", color: "text-blue-600", bg: "bg-blue-100" },
  { label: "ការបញ្ជាទិញ", value: "៥៦", icon: ShoppingBag, change: "+៨%", color: "text-purple-600", bg: "bg-purple-100" },
  { label: "វគ្គសិក្សា", value: "១២", icon: BookOpen, change: "+៣", color: "text-green-600", bg: "bg-green-100" },
  { label: "ចំណូល", value: "៣.៥ លាន", icon: DollarSign, change: "+១៥%", color: "text-orange-600", bg: "bg-orange-100" },
];

const RECENT_ACTIVITY = [
  { action: "អ្នកប្រើប្រាស់ថ្មី", detail: "សុខា ម៉ៅ បានចុះឈ្មោះ", time: "៥ នាទីមុន" },
  { action: "ការបញ្ជាទិញថ្មី", detail: "ការបញ្ជាទិញ #ORD-001", time: "១០ នាទីមុន" },
  { action: "ប្រកាសថ្មី", detail: "ម៉ាលី ច័ន្ទ បានបង្ហោះប្រកាសថ្មី", time: "៣០ នាទីមុន" },
  { action: "ការកក់", detail: "ការណាត់ជួបជាមួយអ្នកជំនាញ", time: "១ ម៉ោងមុន" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4 px-4 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">គ្រប់គ្រងប្រព័ន្ធ</p>
        </div>
        <Badge>អ្នកគ្រប់គ្រង</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl ${stat.bg} p-2`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-medium text-green-600">
                    {stat.change}
                  </span>
                </div>
                <p className="mt-3 text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 text-sm font-semibold">សកម្មភាពថ្មីៗ</h3>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="cursor-pointer hover:bg-muted/50">
          <CardContent className="flex flex-col items-center p-6">
            <Users className="mb-2 h-8 w-8 text-primary" />
            <span className="text-sm font-medium">អ្នកប្រើប្រាស់</span>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50">
          <CardContent className="flex flex-col items-center p-6">
            <ShoppingBag className="mb-2 h-8 w-8 text-primary" />
            <span className="text-sm font-medium">ការបញ្ជាទិញ</span>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50">
          <CardContent className="flex flex-col items-center p-6">
            <BookOpen className="mb-2 h-8 w-8 text-primary" />
            <span className="text-sm font-medium">មាតិកា</span>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50">
          <CardContent className="flex flex-col items-center p-6">
            <Settings className="mb-2 h-8 w-8 text-primary" />
            <span className="text-sm font-medium">ការកំណត់</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
