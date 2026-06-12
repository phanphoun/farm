"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Video, Phone, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import toast from "react-hot-toast";

const MOCK_EXPERT = {
  id: "e1",
  name: "បណ្ឌិត សុខា",
  specialization: "ដំណាំស្រូវ និងគ្រាប់ធញ្ញជាតិ",
  rating: 4.9,
  reviewsCount: 128,
  hourlyRate: 50000,
  bio: "អ្នកជំនាញផ្នែកដំណាំស្រូវ មានបទពិសោធន៍ ១៥ឆ្នាំ ក្នុងការស្រាវជ្រាវ និងអភិវឌ្ឍន៍ពូជស្រូវ",
};

const TIME_SLOTS = [
  "០៨:០០ - ០៩:០០",
  "០៩:០០ - ១០:០០",
  "១០:០០ - ១១:០០",
  "១៣:០០ - ១៤:០០",
  "១៤:០០ - ១៥:០០",
  "១៥:០០ - ១៦:០០",
];

const BOOKING_TYPES = [
  { id: "video", label: "Video Call", icon: Video },
  { id: "phone", label: "ទូរស័ព្ទ", icon: Phone },
  { id: "in_person", label: "ជួបផ្ទាល់", icon: MapPin },
];

const NEXT_7_DAYS = ["១៣ មិថុនា", "១៤ មិថុនា", "១៥ មិថុនា", "១៦ មិថុនា", "១៧ មិថុនា", "១៨ មិថុនា", "១៩ មិថុនា"];

export default function BookingPage() {
  const params = useParams();
  const [selectedDate, setSelectedDate] = useState(NEXT_7_DAYS[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingType, setBookingType] = useState("video");
  const [notes, setNotes] = useState("");

  const handleBook = () => {
    if (!selectedTime) {
      toast.error("សូមជ្រើសរើសម៉ោង");
      return;
    }
    toast.success("ការណាត់ជួបត្រូវបានដាក់ស្នើ! សូមរង់ចាំការបញ្ជាក់");
  };

  return (
    <div className="space-y-4 px-4 pb-8">
      <div className="flex items-center gap-2">
        <Link href="/experts">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold">កក់ការណាត់ជួប</h1>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback>{getInitials(MOCK_EXPERT.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">{MOCK_EXPERT.name}</h3>
            <p className="text-xs text-muted-foreground">
              {MOCK_EXPERT.specialization}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {MOCK_EXPERT.rating}
              </span>
              <span>
                {MOCK_EXPERT.hourlyRate.toLocaleString()} ៛/ម៉ោង
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 text-sm font-semibold">
            <Calendar className="mr-1 inline h-4 w-4" />
            ជ្រើសរើសកាលបរិច្ឆេទ
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {NEXT_7_DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  selectedDate === day
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 text-sm font-semibold">
            <Clock className="mr-1 inline h-4 w-4" />
            ជ្រើសរើសម៉ោង
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`rounded-xl border-2 p-2 text-xs font-medium transition-all ${
                  selectedTime === slot
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-input text-muted-foreground hover:border-muted-foreground/30"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 text-sm font-semibold">របៀបពិគ្រោះ</h3>
          <div className="grid grid-cols-3 gap-2">
            {BOOKING_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setBookingType(type.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                    bookingType === type.id
                      ? "border-primary bg-primary/5"
                      : "border-input"
                  }`}
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-2 text-sm font-semibold">កំណត់ចំណាំ</h3>
          <textarea
            placeholder="ពិពណ៌នាអំពីបញ្ហាដែលអ្នកចង់ពិគ្រោះ..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full resize-none rounded-xl border bg-background p-3 text-sm outline-none focus:ring-1 focus:ring-primary/30 min-h-[80px]"
            rows={3}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">ថ្លៃសេវា (១ ម៉ោង)</span>
              <span className="font-medium">
                {MOCK_EXPERT.hourlyRate.toLocaleString()} ៛
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">ថ្លៃសេវាកម្មវេទិកា</span>
              <span className="font-medium">ឥតគិតថ្លៃ</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2 text-sm font-bold">
              <span>សរុប</span>
              <span className="text-primary">
                {MOCK_EXPERT.hourlyRate.toLocaleString()} ៛
              </span>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleBook}>
            បញ្ជាក់ការកក់
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
