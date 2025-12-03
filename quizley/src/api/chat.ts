// src/api/chat.ts
import { apiRequest } from "./request";

export interface CreateChatRoomRequest {
  quizId: number;
  content?: string;
}

export interface CreateChatRoomResponse {
  chatId: number;
}

export function createChatRoom(data: CreateChatRoomRequest) {
  return apiRequest<CreateChatRoomResponse>("/api/today/chatroom", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface SendMessageRequest {
  chatId: number;
  message: string;
}

export interface SendMessageResponse {
  chatId: number;
  userMessage: {
    origin: string;
    message: string;
    date: string;
  };
  aiMessage: {
    origin: string;
    message: string;
    date: string;
  };
  summary?: string;
}

export function sendMessage({ chatId, message }: SendMessageRequest) {
  return apiRequest<SendMessageResponse>(`/api/today/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export interface ChatMessage {
  origin: "USER" | "AI";
  message: string;
  date: string;
}

export interface GetMessagesResponse {
  chatId: number;
  category: string;
  date: string;
  messages: ChatMessage[];
  totalPages: number;
  maxPages: number;
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export function getMessages(chatId: number, page = -1, size = 20) {
  return apiRequest(`/api/today/${chatId}?page=${page}&size=${size}`, {
    method: "GET",
  });
}

export interface UpdateSummaryResponse {
  status: number;
  message: string;
}

export function updateChatSummary(chatId: number, summary: string) {
  return apiRequest<UpdateSummaryResponse>(`/api/today/${chatId}/summary`, {
    method: "PATCH",
    body: JSON.stringify({ summary }),
  });
}

export interface CompleteCommentResponse {
  status: number;
  message: string;
  levelUp?: {
    currentLevel: number;
    remainingPoint: number;
  } | null;
}

export function completeChatComment(chatId: number) {
  return apiRequest<CompleteCommentResponse>(`/api/today/${chatId}/comment`, {
    method: "PATCH",
  });
}