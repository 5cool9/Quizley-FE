// src/api/insightRecord.ts
import { apiRequest } from "./request";

/** 오늘의 인사이트(기록) 한 건 */
export interface InsightRecordItem {
  quizId: number | null;
  category: string | null;   // "심리", "미스터리" 등
  date: string;              // "YYYY-MM-DD"
  question: string | null;
  summary: string | null;
  feedback: string | null;
}

/** 같은 질문에 다시 답해보기 – 답변 한 건 */
export interface SameQuestionAnswerItem {
  answerId: number;
  answer: string;
  createdAt: string;         // ISO 문자열
}

// 오늘의 인사이트 조회
export async function getInsightRecord(
  date: string
): Promise<InsightRecordItem[]> {
  const data = await apiRequest(`/api/insight/record/${date}`);
  return data as InsightRecordItem[];
}

// 오늘의 인사이트 삭제
export async function deleteInsightRecord(
  date: string
): Promise<InsightRecordItem[]> {
  const data = await apiRequest(`/api/insight/record/${date}`, {
    method: "DELETE",
  });
  return data as InsightRecordItem[];
}


// 같은 질문에 다시 답해보기(등록)
export async function postSameQuestionAnswer(
  quizId: number,
  answer: string
): Promise<SameQuestionAnswerItem> {
  const data = await apiRequest(`/api/insight/record/${quizId}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  });
  return data as SameQuestionAnswerItem;
}

// 같은 질문에 다시 답해보기(목록 조회)
export async function getSameQuestionAnswers(
  quizId: number
): Promise<SameQuestionAnswerItem[]> {
  const data = await apiRequest(`/api/insight/record/${quizId}/answers`);
  return data as SameQuestionAnswerItem[];
}