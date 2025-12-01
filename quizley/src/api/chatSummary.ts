import { apiRequest } from "./request";

export interface SummaryResponse {
  chatId: number;
  quizId: number;
  category: string;
  date: string;
  quizName: string;
  summary: string;
  feedback: string;
  topCommentDtoList: {
    commentId: number;
    comment: string;
  }[];
}

export function getChatSummary(chatId: number) {
  return apiRequest<SummaryResponse>(`/api/today/${chatId}/summary`);
}
