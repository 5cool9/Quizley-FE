// src/api/insightRecord.ts
import { apiRequest } from "./request";

/** 오늘의 인사이트(기록) 한 건 */
export interface InsightRecordItem {
  quizId: number | null;
  category: string | null;  
  date: string;            
  question: string | null;
  summary: string | null;
  feedback: string | null;
  topComments: string[];    
}

/** 같은 질문에 다시 답해보기 – 답변 한 건 */
export interface SameQuestionAnswerItem {
  answerId: number;
  answer: string;
  createdAt: string;         
}

/** 오늘의 인사이트 조회 */
export async function getInsightRecord(
  date: string
): Promise<InsightRecordItem[]> {
  const json = await apiRequest(`/api/insight/record/${date}`, {
    method: "GET",
  });

  const raw = (json as any).data ?? json;

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map(
    (item: any): InsightRecordItem => ({
      quizId: item.quizId ?? null,
      category: item.category ?? null,
      date: item.date ?? date,
      question: item.question ?? null,
      summary: item.summary ?? null,
      feedback: item.feedback ?? null,
      topComments: Array.isArray(item.topComments) ? item.topComments : [],
    })
  );
}

/** 오늘의 인사이트 삭제 */
export async function deleteInsightRecord(
  date: string
): Promise<InsightRecordItem[]> {
  const json = await apiRequest(`/api/insight/record/${date}`, {
    method: "DELETE",
  });
  const raw = (json as any).data ?? json;
  return raw as InsightRecordItem[];
}

/** 같은 질문에 다시 답해보기(등록) */
export async function postSameQuestionAnswer(
  quizId: number,
  answer: string
): Promise<SameQuestionAnswerItem> {
  const json = await apiRequest(`/api/insight/record/${quizId}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  });
  const data = (json as any).data ?? json;
  return data as SameQuestionAnswerItem;
}

/** 같은 질문에 다시 답해보기(목록 조회) */
export async function getSameQuestionAnswers(
  quizId: number
): Promise<SameQuestionAnswerItem[]> {
  const json = await apiRequest(`/api/insight/record/${quizId}/answers`, {
    method: "GET",
  });
  const data = (json as any).data ?? json;
  return data as SameQuestionAnswerItem[];
}
