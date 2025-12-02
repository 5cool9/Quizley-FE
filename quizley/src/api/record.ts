// src/api/record.ts
import { getAccessToken, refreshTokenApi, clearTokens } from "./auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function authRequest(path: string, options: RequestInit = {}) {
  let accessToken = getAccessToken();
  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    await refreshTokenApi();
    accessToken = getAccessToken();

    const retryHeaders: HeadersInit = {
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers: retryHeaders });
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const err: any = new Error(json?.message || "요청에 실패했습니다.");
    err.status = res.status;
    err.code = json?.code;
    throw err;
  }
  return json;
}

// 캘린더 화면 응답
export type AnswerHistory = {
  userId: number;
  consecutiveDays: number;
  answeredDates: string[];
};

export async function getMyAnswerHistory(): Promise<AnswerHistory> {
  const json = await authRequest("/api/calendar", { method: "GET" });
  const data = (json as any).data ?? json;
  return data as AnswerHistory;
}

// 리포트 분석 및 결과 응답
export type ReportSummary = {
  streakDays: number;              // 연속 응답일
  topPercent: number;              // 상위 퍼센트
  dominantCategory: string;        // 대표 카테고리 (예: "심리학")
  scores: Record<string, number>;  // 카테고리별 점수
  feedback: string;                // AI 피드백 문장
}

export async function getReportSummary(): Promise<ReportSummary> {
  const json = await authRequest("/api/report/summary", { method: "GET" });
  const data = (json as any).data ?? json;
  return data as ReportSummary;
}
