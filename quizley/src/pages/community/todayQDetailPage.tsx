// src/pages/community/TodayQDetailPage.tsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "@/component/header";
import CommentList, {
  CommentItem as CommentListItem,
} from "@/component/commentList";

import CommentReportPop from "@/component/commentReportPop";
import BlockUserPop from "@/component/blockUserPop";
import DeleteCommentPop from "@/component/deleteCommentPop";

import PostDetailCard, {
  DetailDailyPost,
} from "@/component/postDetailCards";

import {
  fetchQuizDetail,
  toggleCommentLike,
  reportComment,
  blockUser,
  deleteComment,
  type QuizDetailApi,
} from "@/api/communityApi";

// ------------------ 타입 ------------------

// 백엔드에서 받아오는 userId / isMine 같이
// CommentListItem에 없는 필드도 쓰고 싶으니까 확장 타입 하나 정의
type ExtendedCommentItem = CommentListItem & {
  userId?: number;
  isMine?: boolean;
};

type CommentItem = ExtendedCommentItem;

type CommentModalType =
  | "comment-report"
  | "block-user"
  | "delete-comment"
  | null;

// 날짜 파싱 (최신순 정렬용) - "2025.11.18" 형식 기준
const parseDate = (dateText: string) => {
  const [y, m, d] = dateText.split(".").map((v) => Number(v));
  return new Date(y, m - 1, d);
};

const TodayQDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // API에서 받은 전체 상세 데이터
  const [quizDetail, setQuizDetail] = useState<QuizDetailApi | null>(null);

  // 오늘의 질문 카드용 데이터
  const [detailPost, setDetailPost] = useState<DetailDailyPost | null>(null);

  // 댓글 목록
  const [commentItems, setCommentItems] = useState<CommentItem[]>([]);

  // 정렬 기준
  const [sortType, setSortType] =
    useState<"latest" | "popular">("popular");

  // 모달 상태
  const [commentModal, setCommentModal] =
    useState<CommentModalType>(null);
  const [targetComment, setTargetComment] =
    useState<CommentItem | null>(null);

  // 토스트
  const [toastMessage, setToastMessage] = useState<string | null>(
    null
  );

  // 로딩/에러
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const closeCommentModal = () => setCommentModal(null);

  // ------------ 상세 조회 API 연동 ------------

  useEffect(() => {
    if (!id) return;

    const quizId = Number(id);
    if (Number.isNaN(quizId)) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchQuizDetail({
          quizId,
          sort: "latest", // 기본은 최신순으로 받아오고, 화면에서 정렬 다시 적용
        });

        setQuizDetail(data);

        // 오늘의 질문 카드용 데이터 매핑
        const q = data.quiz;
        const daily: DetailDailyPost = {
          id: q.quizId,
          kind: "daily",
          title: q.content,
          dateText: q.createdAt, // "2025.11.18"
          commentCount: q.commentCount,
        };
        setDetailPost(daily);

        // 댓글 목록 매핑
        const mappedComments: CommentItem[] = (data.comments ?? []).map(
          (c: any) => ({
            id: c.commentId,
            nickname: c.nickname,
            dateText: c.createdAt, // 오늘날짜일 때 "몇분 전, 방금 전" 등
            content: c.content,
            likeCount: c.likeCount,
            liked: c.isLiked,
            myComments: c.isMine ?? false, // 내 댓글인지 여부 (메뉴에서 삭제/신고용)
            userId: c.userId,              // 차단할 때 필요
          })
        );
        setCommentItems(mappedComments);
      } catch (e: any) {
        console.error("퀴즈 상세 조회 실패:", e);
        if (e.status === 404 || e.code === "QUIZ_NOT_FOUND") {
          setError("존재하지 않는 게시글입니다.");
        } else if (e.status === 401 || (e.message ?? "").includes("로그인")) {
          alert("로그인이 필요합니다. 다시 로그인해주세요.");
          navigate("/login");
          return;
        } else {
          setError(e.message ?? "게시글을 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  // ------------ 댓글 좋아요 토글 (API 연동 + 낙관적 업데이트) ------------

  const handleCommentLike = async (commentId: number) => {
    // 1) UI 먼저 토글
    setCommentItems((prev) =>
      prev.map((c) => {
        if (Number(c.id) !== commentId) return c;
        const nextLiked = !c.liked;
        const nextCount = nextLiked ? c.likeCount + 1 : c.likeCount - 1;
        return { ...c, liked: nextLiked, likeCount: nextCount };
      })
    );

    try {
      await toggleCommentLike(commentId);
    } catch (e: any) {
      console.error("댓글 좋아요 실패:", e);

      if (e.status === 401 || (e.message ?? "").includes("로그인")) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
        return;
      }

      showToast("댓글 좋아요 처리 중 오류가 발생했습니다.");

      // 2) 실패 시 롤백
      setCommentItems((prev) =>
        prev.map((c) => {
          if (Number(c.id) !== commentId) return c;
          const nextLiked = !c.liked;
          const nextCount = nextLiked ? c.likeCount + 1 : c.likeCount - 1;
          return { ...c, liked: nextLiked, likeCount: nextCount };
        })
      );
    }
  };

  // ------------ 댓글 정렬 ------------

  const sortedComments = useMemo(() => {
    const list = [...commentItems];

    if (sortType === "popular") {
      return list.sort((a, b) => b.likeCount - a.likeCount);
    }

    return list.sort(
      (a, b) =>
        parseDate(a.dateText).getTime() -
        parseDate(b.dateText).getTime()
    );
  }, [commentItems, sortType]);

  const commentCount = commentItems.length;

  // ------------ CommentList에서 오는 메뉴 콜백들 ------------

  const handleReport = (id: CommentItem["id"]) => {
    const target = commentItems.find((c) => c.id === id);
    if (!target) return;
    setTargetComment(target);
    setCommentModal("comment-report");
  };

  const handleBlock = (id: CommentItem["id"]) => {
    const target = commentItems.find((c) => c.id === id);
    if (!target) return;
    setTargetComment(target);
    setCommentModal("block-user");
  };

  const handleDelete = (id: CommentItem["id"]) => {
    const target = commentItems.find((c) => c.id === id);
    if (!target) return;
    setTargetComment(target);
    setCommentModal("delete-comment");
  };

  // ------------ 로딩/에러 처리 ------------

  if (loading && !detailPost) {
    return (
      <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
        <div className="flex h-full items-center justify-center">
          로딩 중입니다...
        </div>
      </div>
    );
  }

  if (error && !detailPost) {
    return (
      <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
        <div className="flex h-full items-center justify-center text-neutral-500">
          {error}
        </div>
      </div>
    );
  }

  if (!detailPost || !quizDetail) {
    return null;
  }

  const { quiz } = quizDetail;
  const canComment = quiz.canComment;

  // ------------ 렌더링 ------------

  return (
    <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
      <div className="flex h-full scrollbar-hide flex-col overflow-y-scroll overflow-x-hidden min-h-[calc(100vh-86px)] pb-[100px]">
        {/* 헤더 */}
        <div className="pt-[15px] pb-5 w-full">
          <Header
            title="커뮤니티"
            showMenu={false}
            onBack={() => navigate(-1)}
          />
        </div>

        {/* 오늘의 질문 카드 */}
        <PostDetailCard
          post={detailPost}
          onToggleLike={() => {
            // 오늘의 질문 좋아요 기능 생기면 여기에서 처리 (quiz.canLike 참고)
            console.log("오늘의 질문 상세 카드 클릭");
          }}
          onClickComment={(id) =>
            console.log("댓글 영역으로 스크롤 예정:", id)
          }
        />

        {/* 회색 경계 */}
        <div className="w-full h-4 bg-neutral-50" />

        {/* 댓글 리스트 & 정렬 */}
        <div className="comments-wrapper">
          {/* 정렬 버튼 (댓글이 있을 때만 의미 있음) */}
          <div className="px-5 w-full h-[75px] flex flex-row items-center gap-3">
            <button
              onClick={() => setSortType("popular")}
              className="flex items-center gap-1"
              disabled={commentCount === 0}
            >
              <span
                className={`w-[8px] h-[8px] rounded-full ${
                  sortType === "popular"
                    ? "bg-primary-700"
                    : "bg-neutral-300"
                }`}
              />
              <span
                className={`typ-b6 ${
                  sortType === "popular"
                    ? "text-neutral-650"
                    : "text-neutral-400"
                }`}
              >
                인기순
              </span>
            </button>

            <button
              onClick={() => setSortType("latest")}
              className="flex items-center gap-1"
              disabled={commentCount === 0}
            >
              <span
                className={`w-[8px] h-[8px] rounded-full ${
                  sortType === "latest"
                    ? "bg-primary-700"
                    : "bg-neutral-300"
                }`}
              />
              <span
                className={`typ-b6 ${
                  sortType === "latest"
                    ? "text-neutral-650"
                    : "text-neutral-400"
                }`}
              >
                최신순
              </span>
            </button>
          </div>

          {/* 댓글 유무에 따라 분기 */}
          {commentCount > 0 ? (
            <CommentList
              items={sortedComments}
              onClickLike={(id) => handleCommentLike(Number(id))}
              onClickReport={handleReport}
              onClickBlock={handleBlock}
              onClickDelete={handleDelete}
            />
          ) : (
            <div className="w-full bg-white px-5 py-16 text-center border-t border-neutral-200">
              <p className="typ-b4 text-neutral-300">
                아직 댓글이 없습니다.
              </p>
              <p className="typ-b1 text-neutral-300 mt-1">
                {canComment
                  ? "나만의 생각을 공유해 보세요."
                  : "이 질문에는 댓글 작성이 불가능합니다."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --------- 댓글 관련 모달들 --------- */}

      {/* 댓글 신고 */}
      <CommentReportPop
        open={commentModal === "comment-report"}
        onCancel={closeCommentModal}
        onConfirm={async () => {
          if (!targetComment) return;

          try {
            await reportComment(Number(targetComment.id));
            closeCommentModal();
            showToast("신고가 접수되었습니다.");
          } catch (e: any) {
            console.error("댓글 신고 실패:", e);

            if (e.status === 401 || (e.message ?? "").includes("로그인")) {
              alert("로그인이 필요합니다. 다시 로그인해주세요.");
              navigate("/login");
              return;
            }

            if (e.code === "ALREADY_REPORTED") {
              showToast("이미 신고한 댓글입니다.");
              closeCommentModal();
              return;
            }

            showToast(e.message ?? "댓글 신고 중 오류가 발생했습니다.");
          }
        }}
      />

      {/* 사용자 차단 */}
      <BlockUserPop
        open={commentModal === "block-user"}
        onCancel={closeCommentModal}
        onConfirm={async () => {
          if (!targetComment) return;

          const userId = (targetComment as any).userId;
          if (!userId) {
            showToast("차단할 사용자를 찾을 수 없습니다.");
            closeCommentModal();
            return;
          }

          try {
            await blockUser(userId);

            // UI에서 해당 유저의 모든 댓글 제거
            setCommentItems((prev) =>
              prev.filter((c) => (c as any).userId !== userId)
            );

            closeCommentModal();
            showToast("사용자가 차단되었습니다.");
          } catch (e: any) {
            console.error("사용자 차단 실패:", e);

            if (e.status === 401 || (e.message ?? "").includes("로그인")) {
              alert("로그인이 필요합니다. 다시 로그인해주세요.");
              navigate("/login");
              return;
            }

            if (e.code === "ALREADY_BLOCKED") {
              showToast("이미 차단한 사용자입니다.");
              closeCommentModal();
              return;
            }

            if (e.code === "CANNOT_BLOCK_YOURSELF") {
              showToast("자기 자신은 차단할 수 없습니다.");
              closeCommentModal();
              return;
            }

            showToast(e.message ?? "사용자 차단 중 오류가 발생했습니다.");
          }
        }}
      />

      {/* 댓글 삭제 */}
      <DeleteCommentPop
        open={commentModal === "delete-comment"}
        onCancel={closeCommentModal}
        onConfirm={async () => {
          if (!targetComment) return;

          try {
            await deleteComment(Number(targetComment.id));

            setCommentItems((prev) =>
              prev.filter((c) => c.id !== targetComment.id)
            );
            closeCommentModal();
            showToast("댓글이 삭제되었습니다.");
          } catch (e: any) {
            console.error("댓글 삭제 실패:", e);

            if (e.status === 401 || (e.message ?? "").includes("로그인")) {
              alert("로그인이 필요합니다. 다시 로그인해주세요.");
              navigate("/login");
              return;
            }

            if (e.status === 403 || e.code === "FORBIDDEN") {
              showToast("댓글을 삭제할 권한이 없습니다.");
              return;
            }

            showToast(e.message ?? "댓글 삭제 중 오류가 발생했습니다.");
          }
        }}
      />

      {/* --------- 하단 토스트 --------- */}
      {toastMessage && (
        <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full bg-black/60">
          <span className="typ-b4 text-white">
            {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
};

export default TodayQDetailPage;
