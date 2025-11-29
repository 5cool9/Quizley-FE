// src/api/balance.ts
import { apiRequest } from "./request";

export async function voteTodayQuiz(quizId: number, side: "A" | "B") {
  return apiRequest("/api/today/vote", {
    method: "POST",
    body: JSON.stringify({
      quizId,
      side
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
}
