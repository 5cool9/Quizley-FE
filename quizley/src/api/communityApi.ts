import { apiRequest } from "./request";

// 타입 정의 --------------------------------------------------

export type CategoryCode =
  | "미스터리"
  | "과학"
  | "문학"
  | "예술"
  | "역사"
  | "심리";

export type TodayQuizVoteResult = {
  sideALabel: string;
  sideAImageUrl: string;
  sideAPercentage: number;
  sideBLabel: string;
  sideBImageUrl: string;
  sideBPercentage: number;
  userSelectedSide: "A" | "B" | null;
};

export type TodayQuizApi = {
  quizId: number;
  content: string;
  category: CategoryCode;
  publishedDate: string; // "2025-11-22"
  isLiked: boolean;
  quizType: string | null; // 주말 퀴즈 타입
  voteResult?: TodayQuizVoteResult | null; // 투표 결과
  commentCount: number;
};

export type QuizSummaryApi = {
  quizId: number;
  content: string;
  category: CategoryCode;
  likeCount: number;
  nickname: string;
  commentCount: number;
  createdAt: string; // "2025.11.22" (서버 포맷)
  publishedDate?: string; // "2025-11-22"
  isLiked?: boolean;
};

export type CommunityHomeApi = {
  date: string;
  category: CategoryCode;
  hotQuiz: QuizSummaryApi[];
  quizzes: QuizSummaryApi[];
  todayQuiz: TodayQuizApi | null;
};

// 검색 응답
export type CommunitySearchResultApi = {
  keyword: string;
  totalCount: number;
  quizzes: QuizSummaryApi[];
};

// 상세 조회용
export type QuizDetailQuizApi = {
  quizId: number;
  content: string;
  nickname: string;
  likeCount: number;
  commentCount: number;
  createdAt: string; // 2025.11.04
  isLiked: boolean;
  origin: "USER" | "SYSTEM";
  canLike: boolean;
  canComment: boolean;
  isMine: boolean;
  userId?: number;
  category: CategoryCode;
  isAnonymous: boolean;
}

export type QuizDetailCommentApi = {
  commentId: number;
  content: string;
  nickname: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  userId?: number; 
  isMine: boolean;
};

export type QuizDetailApi = {
  quiz: QuizDetailQuizApi;
  comments: QuizDetailCommentApi[];
};
// 주말 오늘의 퀴즈 상세
export type WeekendQuizDetailApi = {
  quizId: number;
  content: string;
  category: CategoryCode;
  publishedDate: string;
  isLiked: boolean;
  quizType: string | null;
  voteResult: TodayQuizVoteResult;
};

// 주말 weekendQuiz 원본 타입
type WeekendQuizRaw = {
  quizId: number;
  content: string;
  publishedDate: string;
  voteResult: TodayQuizVoteResult | null;
  commentCount?: number;
};

// 주말 홈 응답 raw 타입
type WeekendHomeRaw = {
  date: string;
  category: CategoryCode;
  weekendQuiz: WeekendQuizRaw | null;
  hotQuiz: QuizSummaryApi[];
  quizzes: QuizSummaryApi[];
};
// -------------------------------------------------------------
// 1) 커뮤니티 홈 조회
// -------------------------------------------------------------
export async function fetchCommunityHome(params: {
  date: string;
  category: CategoryCode;
}): Promise<CommunityHomeApi> {
  const { date, category } = params;

  const query = `?date=${encodeURIComponent(date)}&category=${encodeURIComponent(
    category
  )}`;

  try {
    const res = await apiRequest<{
      status: number;
      message: string;
      data: CommunityHomeApi;
    }>(`/api/community/home${query}`, {
      method: "GET",
    });

    if (res.status !== 200) {
      const error: any = new Error(res.message ?? "커뮤니티 홈 조회 실패");
      error.status = res.status;
      throw error;
    }

    return res.data;
  } catch (e: any) {
    // 날짜/카테고리 데이터 없음 → 빈 데이터로 처리
    if (e.status === 404) {
      return {
        date,
        category,
        todayQuiz: null,
        hotQuiz: [],
        quizzes: [],
      };
    }
    throw e;
  }
}

// 주말 홈 API
export async function fetchCommunityWeekendHome(params: {
  date: string;
  category: CategoryCode;
}): Promise<CommunityHomeApi> {
  const { date, category } = params;

  const query = `?date=${encodeURIComponent(date)}&category=${encodeURIComponent(
    category
  )}`;

  const res = await apiRequest<{
    status: number;
    message: string;
    data: WeekendHomeRaw;
  }>(`/api/community/weekend/home${query}`, {
    method: "GET",
  });

  if (res.status === 404) {
    return {
      date,
      category,
      todayQuiz: null,
      hotQuiz: [],
      quizzes: [],
    };
  }

  if (res.status !== 200) {
    const error: any = new Error(res.message ?? "주말 홈 조회 실패");
    error.status = res.status;
    throw error;
  }

  const raw = res.data;

  const weekend = raw.weekendQuiz;

  const todayQuiz: TodayQuizApi | null = weekend
    ? {
        quizId: weekend.quizId,
        content: weekend.content,
        category: raw.category,
        publishedDate: weekend.publishedDate,
        isLiked: false,
        quizType: "WEEKEND",
        voteResult: weekend.voteResult ?? null,
        commentCount: weekend.commentCount ?? 0,
      }
    : null;

  return {
    date: raw.date,
    category: raw.category,
    todayQuiz,
    hotQuiz: raw.hotQuiz,
    quizzes: raw.quizzes,
  };
}


// -------------------------------------------------------------
// 2) 좋아요 토글
// -------------------------------------------------------------
export async function toggleQuizLike(quizId: number): Promise<void> {
  const res = await apiRequest<{
    status: number;
    message: string;
  }>(`/api/community/quiz/${quizId}/like`, {
    method: "POST",
  });

  if (res.status !== 200) {
    const error: any = new Error(res.message ?? "좋아요 처리 실패");
    error.status = res.status;
    throw error;
  }
}

// -------------------------------------------------------------
// 3) 커뮤니티 검색
// -------------------------------------------------------------
export async function fetchCommunitySearch(params: {
  keyword: string;
  sortBy?: "latest" | "popular";
  category?: CategoryCode;
}): Promise<CommunitySearchResultApi> {
  const { keyword, sortBy, category } = params;

  const qs = new URLSearchParams();
  qs.set("keyword", keyword);
  if (sortBy) qs.set("sortBy", sortBy);
  if (category) qs.set("category", category);

  const res = await apiRequest<{
    status: number;
    message: string;
    data: CommunitySearchResultApi;
  }>(`/api/community/search?${qs.toString()}`, {
    method: "GET",
  });

  if (res.status !== 200) {
    const error: any = new Error(res.message ?? "퀴즈 검색 실패");
    error.status = res.status;
    throw error;
  }

  return res.data;
}

// -------------------------------------------------------------
// 4) 질문 생성
// -------------------------------------------------------------
export async function createCommunityQuiz(params: {
  content: string;
  category: CategoryCode;
  isAnonymous?: boolean;
}): Promise<number> {
  const { content, category, isAnonymous = false } = params;

  const res = await apiRequest(`/api/community/quiz`, {
    method: "POST",
    body: JSON.stringify({
      content,
      category,
      isAnonymous,
    }),
  });

  const body = res.data ?? res;

  if (body.status !== 201) {
    throw new Error(body.message ?? `게시글 작성 실패 (status: ${body.status})`);
  }

  if (typeof body.quizId !== "number") {
    throw new Error("게시글 작성 실패 (quizId 없음)");
  }

  return body.quizId;
}


// 게시글 수정
export async function updateCommunityQuiz(params: {
  quizId: number;
  content: string;
  category: CategoryCode;
  isAnonymous?: boolean;
}): Promise<void> {
  const { quizId, content, category, isAnonymous = false } = params;

  const json = await apiRequest<{
    status: number;
    message: string;
    code?: string;
  }>(`/api/community/quiz/${quizId}`, {
    method: "PUT",
    body: JSON.stringify({
      content,
      category,
      isAnonymous,
    }),
  });
 if (json.status !== 200) {
    const err: any = new Error(json.message ?? "게시물 수정 실패");
    err.status = json.status;
    err.code = json.code;
    throw err;
  }
}
// -------------------------------------------------------------
// 5) 퀴즈 상세 조회
// -------------------------------------------------------------
// 상세 조회
export async function fetchQuizDetail(params: {
  quizId: number;
  sort?: "latest" | "popular";
}): Promise<QuizDetailApi> {
  const { quizId, sort = "latest" } = params;

  const qs = new URLSearchParams();
  if (sort) qs.set("sort", sort);

  const res = await apiRequest<{
    status: number;
    message: string;
    data: QuizDetailApi;
  }>(`/api/community/quiz/${quizId}?${qs.toString()}`, {
    method: "GET",
  });

  if (res.status === 404) {
    const error: any = new Error("QUIZ_NOT_FOUND");
    error.status = 404;
    error.code = "QUIZ_NOT_FOUND";
    throw error;
  }

  if (res.status !== 200) {
    const error: any = new Error(res.message ?? `HTTP 오류: ${res.status}`);
    error.status = res.status;
    error.code = (res as any).code;
    throw error;
  }

  return res.data;
}

// 댓글 작성
export async function createQuizComment(params: {
  quizId: number;
  content: string;
  isAnonymous: boolean;
}): Promise<number> {
  const { quizId, content, isAnonymous } = params;

  const res = await apiRequest<{
    status: number;
    message: string;
    code?: string;
    commentId?: number;
  }>(`/api/community/quiz/${quizId}/comment`, {
    method: "POST",
    body: JSON.stringify({ content, isAnonymous }),
  });

  if (res.status !== 201 || typeof res.commentId !== "number") {
    const err: any = new Error(res.message ?? "댓글 작성 실패");
    err.status = res.status;
    err.code = res.code;
    throw err;
  }

  return res.commentId;
}

// 게시글 신고
export async function reportQuiz(quizId: number): Promise<void> {
  const res = await apiRequest<{
    status: number;
    message: string;
    code?: string;
  }>(`/api/community/quiz/${quizId}/report`, {
    method: "POST",
  });

  if (res.status !== 200) {
    const err: any = new Error(res.message ?? "게시물 신고 실패");
    err.status = res.status;
    err.code = res.code;
    throw err;
  }
}

// 댓글 좋아요
export async function toggleCommentLike(commentId: number): Promise<void> {
  const res = await apiRequest<{
    status: number;
    message: string;
    code?: string;
  }>(`/api/community/comment/${commentId}/like`, {
    method: "POST",
  });

  if (res.status !== 200) {
    const err: any = new Error(res.message ?? "댓글 좋아요 처리 실패");
    err.status = res.status;
    err.code = res.code;
    throw err;
  }
}

// 댓글 신고
export async function reportComment(commentId: number): Promise<void> {
  const res = await apiRequest<{
    status: number;
    message: string;
    code?: string;
  }>(`/api/community/comment/${commentId}/report`, {
    method: "POST",
  });

  if (res.status !== 200) {
    const err: any = new Error(res.message ?? "댓글 신고 실패");
    err.status = res.status;
    err.code = res.code;
    throw err;
  }
}

// 사용자 차단
export async function blockUser(userId: number): Promise<void> {
  const res = await apiRequest<{
    status: number;
    message: string;
    code?: string;
  }>(`/api/community/user/${userId}/block`, {
    method: "POST",
  });

  if (res.status !== 200) {
    const err: any = new Error(res.message ?? "사용자 차단 실패");
    err.status = res.status;
    err.code = res.code;
    throw err;
  }
}

// 게시글 삭제
export async function deleteQuiz(quizId: number): Promise<void> {
  const res = await apiRequest<{
    status: number;
    message: string;
    code?: string;
  }>(`/api/community/quiz/${quizId}`, {
    method: "DELETE",
  });

  if (res.status !== 200) {
    const err: any = new Error(res.message ?? "게시물 삭제 실패");
    err.status = res.status;
    err.code = res.code;
    throw err;
  }
}

// 댓글 삭제
export async function deleteComment(commentId: number): Promise<void> {
  const res = await apiRequest<{
    status?: number;
    message?: string;
    code?: string;
    data?: {
      status: number;
      message: string;
    };
    levelUp?: any;
  }>(`/api/community/comment/${commentId}`, {
    method: "DELETE",
  });

  const status = res.status ?? res.data?.status;
  const message = res.message ?? res.data?.message;

  if (status !== 200) {
    const err: any = new Error(message ?? "댓글 삭제 실패");
    err.status = status;
    err.code = res.code;
    throw err;
  }
}

// 주말 퀴즈 상세 조회
export async function fetchWeekendQuizDetail({
  quizId,
  sort = "latest",
}: {
  quizId: number;
  sort?: "latest" | "popular";
}) {
  return apiRequest(`/api/community/weekend/quiz/${quizId}?sort=${sort}`);
}

// 인사이트 커뮤니티 공유
export async function shareTodayInsightComment(params: {
  chatId: number;
  commentAnonymous: boolean; // 공개 여부
  writerAnonymous: boolean;  // 익명 여부
}): Promise<void> {
  const { chatId, commentAnonymous, writerAnonymous } = params;

  const res = await apiRequest<{
    status: number;
    message: string;
  }>(`/api/today/${chatId}/share`, {
    method: "PATCH",
    body: JSON.stringify({
      comment_anonymous: commentAnonymous,
      writer_anonymous: writerAnonymous,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    const err: any = new Error(res.message ?? "커뮤니티 공유 실패");
    err.status = res.status;
    throw err;
  }
}
