// src/api/quiz.ts
import { apiRequest } from "./request";

export interface QuizOption {
  side: "A" | "B";
  label: string;
  imgUrl: string;
}

export interface QuizData {
  quizId: number;
  content: string;
  publishedDate: string;
  completed: boolean;
  quizType: "WEEKDAY" | "WEEKEND";
  options?: QuizOption[];
}

export interface QuizResponse {
  data: QuizData;
  levelUp: {
    currentLevel: number;
    remainingPoint: number;
  } | null;
}

export async function getTodayQuiz(category?: string) {
  const query = category ? `?category=${category}` : "";
  return apiRequest<QuizResponse>(`/api/today${query}`);
}
