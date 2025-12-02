import { apiRequest } from "./request";

export const ACCESS_TOKEN_KEY = "quizley_accessToken";
export const REFRESH_TOKEN_KEY = "quizley_refreshToken";

/* TOKEN 관리 */
export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/* 회원가입 */
export async function signupApi(payload: {
  userId: string;
  password: string;
  nickname: string;
}) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const res = await fetch(`${BASE_URL}/api/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error: any = new Error(data?.message || "회원가입에 실패했습니다.");
    error.status = res.status;
    error.code = data?.code;
    throw error;
  }

  return data;
}

/* 로그인 (토큰 받는 곳) */
export async function loginApi(payload: {
  userId: string;
  password: string;
}) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error: any = new Error(data?.message || "로그인에 실패했습니다.");
    error.status = res.status;
    error.code = data?.code;
    throw error;
  }

  saveTokens(data.accessToken, data.refreshToken);

  return data as {
    status: number;
    message: string;
    accessToken: string;
    refreshToken: string;
  };
}

/* refreshToken 재발급 */
export async function refreshTokenApi() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    const error: any = new Error("저장된 refreshToken이 없습니다.");
    error.code = "NO_REFRESH_TOKEN";
    throw error;
  }

  const res = await fetch(`${BASE_URL}/api/users/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error: any = new Error(data?.message || "토큰 재발급 실패");
    error.status = res.status;
    error.code = data?.code;
    throw error;
  }

  saveTokens(data.accessToken, data.refreshToken);
  return data;
}

/* 로그아웃 (apiRequest 사용) */
export async function logoutApi() {
  try {
    await apiRequest("/api/users/logout", {
      method: "POST",
    });
  } catch (e) {
    console.warn("Logout failed:", e);
  } finally {
    clearTokens();
  }
}
