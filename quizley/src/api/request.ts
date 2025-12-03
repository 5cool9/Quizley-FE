import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  let token = getAccessToken();

  let headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 1차 요청
  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // accessToken 만료 → 401
  if (res.status === 401) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      throw new Error("로그인이 필요합니다.");
    }

    // 🔥 refreshToken 재발급
    const refreshRes = await fetch(`${BASE_URL}/api/users/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const refreshData = await refreshRes.json();

    if (!refreshRes.ok) {
      clearTokens();
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }

    // 새 토큰 저장
    saveTokens(refreshData.accessToken, refreshData.refreshToken);

    // 🔥 retry 요청 (두 번째 요청)
    token = refreshData.accessToken;

    headers["Authorization"] = `Bearer ${token}`;
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
  throw {
    status: res.status,
    message: data?.message ?? "API 요청 실패",
    code: data?.code,
  };
}


  return data as T;
}
