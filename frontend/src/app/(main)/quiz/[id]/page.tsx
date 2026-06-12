"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Question } from "@/types";

const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "តើស្រូវត្រូវការទឹកប៉ុន្មានក្នុងមួយរដូវ?",
    options: [
      "៥០០-៨០០ ម.ម",
      "៨០០-១២០០ ម.ម",
      "១២០០-១៦០០ ម.ម",
      "១៦០០-២០០០ ម.ម",
    ],
    correctAnswer: 2,
    explanation:
      "ស្រូវត្រូវការទឹកប្រមាណ ១២០០-១៦០០ ម.ម ក្នុងមួយរដូវដាំដុះ",
  },
  {
    id: "q2",
    text: "តើជីណាដែលល្អសម្រាប់ដំណាំសរីរាង្គ?",
    options: [
      "ជីគីមី",
      "ជីកំប៉ុស្ត",
      "ជីអ៊ុយរ៉េ",
      "ជីNPK",
    ],
    correctAnswer: 1,
    explanation:
      "ជីកំប៉ុស្តជាជីសរីរាង្គដែលល្អសម្រាប់ដំណាំសរីរាង្គ",
  },
  {
    id: "q3",
    text: "តើពេលណាដែលសមស្របក្នុងការស្ទូងស្រូវ?",
    options: [
      "១០-១៥ ថ្ងៃ",
      "២០-៣០ ថ្ងៃ",
      "៣៥-៤៥ ថ្ងៃ",
      "៥០-៦០ ថ្ងៃ",
    ],
    correctAnswer: 1,
    explanation:
      "ពេលវេលាសមស្របក្នុងការស្ទូងស្រូវគឺ ២០-៣០ ថ្ងៃ ក្រោយពីបណ្តុះ",
  },
];

export default function QuizPage() {
  const params = useParams();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (showResult || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setShowResult(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult, timeLeft]);

  const question = MOCK_QUESTIONS[currentQ];
  const score = MOCK_QUESTIONS.reduce(
    (acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0),
    0
  );
  const passed = score >= Math.ceil(MOCK_QUESTIONS.length * 0.7);

  const handleAnswer = (optionIndex: number) => {
    if (answers[currentQ] !== undefined) return;
    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIndex;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ < MOCK_QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div
          className={`mb-6 rounded-full p-6 ${
            passed ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {passed ? (
            <CheckCircle className="h-12 w-12 text-green-600" />
          ) : (
            <XCircle className="h-12 w-12 text-red-600" />
          )}
        </div>
        <h2 className="text-2xl font-bold">
          {passed ? "ជាប់!" : "សូមព្យាយាមម្តងទៀត"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          អ្នកទទួលបាន {score}/{MOCK_QUESTIONS.length} ពិន្ទុ
        </p>
        <div className="mt-4 h-2 w-48 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${
              passed ? "bg-green-500" : "bg-red-500"
            }`}
            style={{
              width: `${(score / MOCK_QUESTIONS.length) * 100}%`,
            }}
          />
        </div>
        <div className="mt-6 space-y-3 w-full max-w-md">
          {MOCK_QUESTIONS.map((q, i) => (
            <Card key={q.id}>
              <CardContent className="p-4">
                <p className="text-sm font-medium">{q.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  ចម្លើយរបស់អ្នក: {q.options[answers[i]] || "មិនបានឆ្លើយ"}
                </p>
                {answers[i] !== q.correctAnswer && (
                  <p className="mt-1 text-xs text-green-600">
                    ចម្លើយត្រឹមត្រូវ: {q.options[q.correctAnswer]}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <Link href="/courses">
          <Button className="mt-6">ត្រលប់ទៅវគ្គសិក្សា</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/courses">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">តេស្ត</h1>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className={timeLeft < 60 ? "text-destructive font-bold" : ""}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            សំណួរ {currentQ + 1}/{MOCK_QUESTIONS.length}
          </span>
        </div>
        <Progress
          value={((currentQ + 1) / MOCK_QUESTIONS.length) * 100}
          className="mt-2"
        />
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">{question.text}</h2>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect = question.correctAnswer === i;
          const showFeedback = answers[currentQ] !== undefined;

          let variant = "outline" as "outline" | "default" | "destructive";
          if (showFeedback && isCorrect) variant = "default";
          else if (showFeedback && isSelected && !isCorrect)
            variant = "destructive";

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answers[currentQ] !== undefined}
              className={`w-full rounded-xl border-2 p-4 text-left text-sm font-medium transition-all ${
                selectedAnswer === i
                  ? showFeedback && isCorrect
                    ? "border-green-500 bg-green-50"
                    : showFeedback && !isCorrect
                      ? "border-red-500 bg-red-50"
                      : "border-primary bg-primary/5"
                  : "border-input hover:border-muted-foreground/30"
              } ${
                showFeedback && isCorrect && selectedAnswer !== i
                  ? "border-green-500 bg-green-50/50"
                  : ""
              }`}
            >
              <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
