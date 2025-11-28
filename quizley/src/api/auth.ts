// src/api/auth.ts
const BASE_URL = "https://www.quizley.shop";

export const ACCESS_TOKEN_KEY = "quizley_accessToken";
export const REFRESH_TOKEN_KEY = "quizley_refreshToken";

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

/** 회원가입 API */
export async function signupApi(payload: {
  userId: string;
  password: string;
  nickname: string;
}) {
  const res = await fetch(`${BASE_URL}/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {
    // body가 없을 수도 있으니 무시
  }

  if (!res.ok) {
    const error: any = new Error(data?.message || "회원가입에 실패했습니다.");
    error.status = res.status;
    error.code = data?.code;
    throw error;
  }

  // 성공 예시: { status: 201, message: "성공적으로 처리되었습니다." }
  return data;
}

/** 로그인 API */
export async function loginApi(payload: {
  userId: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error: any = new Error(data?.message || "로그인에 실패했습니다.");
    error.status = res.status;
    error.code = data?.code;
    throw error;
  }

  // 성공 예시:
  // { status: 200, message: "로그인 성공", accessToken: "...", refreshToken: "..." }
  return data as {
    status: number;
    message: string;
    accessToken: string;
    refreshToken: string;
  };
}

/** refreshToken으로 토큰 재발급 API (필요 시 사용) */
export async function refreshTokenApi() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    const error: any = new Error("저장된 refreshToken이 없습니다.");
    error.code = "NO_REFRESH_TOKEN";
    throw error;
  }

  const res = await fetch(`${BASE_URL}/api/users/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error: any = new Error(
      data?.message || "토큰 재발급에 실패했습니다."
    );
    error.status = res.status;
    error.code = data?.code;
    throw error;
  }

  // { status, message, accessToken, refreshToken }
  saveTokens(data.accessToken, data.refreshToken);
  return data as {
    status: number;
    message: string;
    accessToken: string;
    refreshToken: string;
  };
}

/** 로그아웃 API */
export async function logoutApi() {
  const accessToken = getAccessToken();

  // 토큰이 없어도 클라이언트 단에서는 그냥 정리해 버림
  if (!accessToken) {
    clearTokens();
    return;
  }

  const res = await fetch(`${BASE_URL}/api/users/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // 서버 결과와 상관 없이 클라이언트 쪽 토큰은 제거
  clearTokens();

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    console.warn("Logout failed on server:", res.status, data);
  }
}
