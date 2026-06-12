"use client";

import { useState } from "react";
import {
  Sprout,
  MapPin,
  ListChecks,
  Wallet,
  TrendingUp,
  Droplets,
  Sun,
  Thermometer,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const STATS = [
  { label: "ដំណាំ", value: "៣", icon: Sprout, color: "text-green-600", bg: "bg-green-100" },
  { label: "ផ្ទៃដី", value: "២.៥ ហិកតា", icon: MapPin, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "កិច្ចការ", value: "៥", icon: ListChecks, color: "text-orange-600", bg: "bg-orange-100" },
  { label: "ចំណូល", value: "៣.៥ លាន", icon: Wallet, color: "text-purple-600", bg: "bg-purple-100" },
];

const CROPS = [
  { name: "ស្រូវ", area: "១.៥ ហិកតា", status: "កំពុងលូតលាស់", health: "good" as const },
  { name: "បន្លែ", area: "០.៥ ហិកតា", status: "ប្រមូលផល", health: "fair" as const },
  { name: "ស្វាយ", area: "០.៥ ហិកតា", status: "រង់ចាំ", health: "good" as const },
];

const TASKS = [
  { title: "ស្រោចទឹកបន្លែ", priority: "high" as const, due: "ថ្ងៃនេះ" },
  { title: "ដាក់ជីស្រូវ", priority: "medium" as const, due: "ថ្ងៃស្អែក" },
  { title: "ពិនិត្យសត្វល្អិត", priority: "low" as const, due: "៣ ថ្ងៃ" },
];

export default function FarmDashboardPage() {
  return (
    <div className="space-y-4 px-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dashboard កសិដ្ឋាន</h1>
          <p className="text-sm text-muted-foreground">
            កសិដ្ឋានរបស់ខ្ញុំ
          </p>
        </div>
        <div className="flex gap-1">
          <Badge className="bg-green-100 text-green-800">កំពុងដំណើរការ</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`rounded-xl ${stat.bg} p-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Link href="/farm/map" className="flex-1">
          <Button variant="outline" className="w-full">
            <MapPin className="mr-2 h-4 w-4" />
            ផែនទី
          </Button>
        </Link>
        <Link href="/farm/tasks" className="flex-1">
          <Button variant="outline" className="w-full">
            <ListChecks className="mr-2 h-4 w-4" />
            កិច្ចការ
          </Button>
        </Link>
        <Link href="/farm/finance" className="flex-1">
          <Button variant="outline" className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            ហិរញ្ញវត្ថុ
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 text-sm font-semibold">អាកាសធាតុថ្ងៃនេះ</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-center">
              <Sun className="mx-auto mb-1 h-5 w-5 text-yellow-500" />
              <p className="text-lg font-bold">៣២°C</p>
              <p className="text-xs text-muted-foreground">សីតុណ្ហភាព</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-center">
              <Droplets className="mx-auto mb-1 h-5 w-5 text-blue-500" />
              <p className="text-lg font-bold">៧០%</p>
              <p className="text-xs text-muted-foreground">សំណើម</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-center">
              <Thermometer className="mx-auto mb-1 h-5 w-5 text-red-500" />
              <p className="text-lg font-bold">២៤°C</p>
              <p className="text-xs text-muted-foreground">ពេលយប់</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">ដំណាំរបស់ខ្ញុំ</h3>
            <Badge variant="secondary" className="text-xs">
              + បន្ថែម
            </Badge>
          </div>
          <div className="space-y-3">
            {CROPS.map((crop) => (
              <div
                key={crop.name}
                className="flex items-center justify-between rounded-xl bg-muted/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <Sprout className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{crop.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {crop.area}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      crop.health === "good"
                        ? "success"
                        : crop.health === "fair"
                          ? "warning"
                          : "destructive"
                    }
                    className="text-[10px]"
                  >
                    {crop.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">កិច្ចការបន្ទាន់</h3>
            <Link href="/farm/tasks">
              <Badge variant="secondary" className="text-xs">
                មើលទាំងអស់
              </Badge>
            </Link>
          </div>
          <div className="space-y-2">
            {TASKS.map((task) => (
              <div
                key={task.title}
                className="flex items-center justify-between rounded-xl bg-muted/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      task.priority === "high"
                        ? "bg-red-500"
                        : task.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  />
                  <span className="text-sm">{task.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {task.due}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
