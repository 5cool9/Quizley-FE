// src/api/mypage.ts
import { getAccessToken, refreshTokenApi, clearTokens } from "./auth";

const BASE_URL = "https://www.quizley.shop";

// 공통 인증 요청 헬퍼 (만료 시 refreshToken 재발급 → 한 번 재시도)
async function doFetch(
  path: string,
  options: RequestInit = {},
  accessToken?: string | null
) {
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (accessToken) {
    (headers as any).Authorization = `Bearer ${accessToken}`;
  }

  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
}

async function authRequest(path: string, options: RequestInit = {}): Promise<any> {
  let accessToken = getAccessToken();
  let res = await doFetch(path, options, accessToken);

  // accessToken 만료 등으로 401일 때 refreshToken으로 재발급 후 한 번 더 시도
  if (res.status === 401) {
    try {
      await refreshTokenApi(); // ← 새로운 accessToken/refreshToken 저장
      accessToken = getAccessToken();
      res = await doFetch(path, options, accessToken);
    } catch (error) {
      // refresh 실패 시 토큰 제거
      clearTokens();
      throw error;
    }
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

// 마이페이지 프로필 응답 타입
export type MyProfile = {
  nickname: string;
  userId?: string;
  level: number;
  currentExp: number;
  nextExp: number;
  profileImageUrl?: string | null;
};


// 내 프로필 조회
export async function getMyProfile(): Promise<MyProfile> {
  const json = await authRequest("/api/profile/me", { method: "GET" });
  const raw = (json as any).data ?? json;
  return {
    nickname: raw.nickname,
    userId: raw.userId,
    level: raw.level,
    currentExp: raw.currentExp,
    nextExp: raw.requiredExp,
    profileImageUrl: raw.profile ?? null,
  };
}

// 내가 작성한 게시물 목록
export async function getMyPosts<T = any>(): Promise<T[]> {
  const json = await authRequest("/api/profile/me/posts", { method: "GET" });
  const data = (json as any).data ?? json;
  return data as T[];
}

// 내가 좋아요 누른 게시물 목록
export async function getMyLikedPosts<T = any>(): Promise<T[]> {
  const json = await authRequest("/api/profile/me/likes", { method: "GET" });
  const data = (json as any).data ?? json;
  return data as T[];
}

// 내가 작성한 댓글 목록
export async function getMyComments<T = any>(): Promise<T[]> {
  const json = await authRequest("/api/profile/me/comments", { method: "GET" });
  const data = (json as any).data ?? json;
  return data as T[];
}

// 프로필 수정 (닉네임 + 프로필 이미지)
export async function updateMyProfile(formData: FormData): Promise<any> {
  const json = await authRequest("/api/profile/me", {
    method: "PATCH",
    body: formData,
  });
  return json;
}
