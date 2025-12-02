// src/pages/community/WeekendQDetailPage.tsx

import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "@/component/header";
import WeekendGameResult from "@/component/weekendGameResult";
import CommentInput from "@/component/commentInput";
import CommentList, {
  CommentItem as CommentListItem,
} from "@/component/commentList";

import CommentReportPop from "@/component/commentReportPop";
import BlockUserPop from "@/component/blockUserPop";
import DeleteCommentPop from "@/component/deleteCommentPop";

import {
  fetchWeekendQuizDetail,
  createQuizComment,
  toggleCommentLike,
  reportComment,
  blockUser,
  deleteComment,
} from "@/api/communityApi";

/* ---------------- 타입 정의 ---------------- */

// CommentListItem에 백엔드 필드(userId, isMine)를 추가해서 내부에서만 쓸 확장 타입
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

type WeekendOption = {
  label: string;
  percent: number;
  variant: "primary" | "gray";
};

const parseYMD = (iso: string) => iso.split("T")[0].replace(/-/g, ".");

/* ---------------- 컴포넌트 ---------------- */

const WeekendQDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const quizId = Number(id);
  const navigate = useNavigate();

  /* --- 상태 --- */
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);

  const [commentItems, setCommentItems] = useState<CommentItem[]>([]);
  const [sortType, setSortType] =
    useState<"latest" | "popular">("latest");

  const [commentModal, setCommentModal] = useState<CommentModalType>(
    null
  );
  const [targetComment, setTargetComment] =
    useState<CommentItem | null>(null);

  const [toast, setToast] = useState<{ open: boolean; msg: string }>({
    open: false,
    msg: "",
  });

  const showToast = (msg: string) => {
    setToast({ open: true, msg });
    setTimeout(() => setToast({ open: false, msg: "" }), 2000);
  };

  const closeCommentModal = () => setCommentModal(null);

  /* --- 상세 데이터 로드 --- */
  const loadDetail = async () => {
    if (!quizId) return;

    setLoading(true);
    try {
      const res: any = await fetchWeekendQuizDetail({
        quizId,
        sort: sortType,
      });

      const data = res.data;
      setDetail(data);

      // 댓글 매핑 (백엔드 필드 -> CommentList용 필드로 변환)
      const mapped: CommentItem[] = (data.comments ?? []).map(
        (c: any) => ({
          id: c.commentId,
          nickname: c.nickname,
          dateText: c.createdAt,
          content: c.content,
          likeCount: c.likeCount,
          liked: c.isLiked,
          myComments: c.isMine ?? false, // 내 댓글인지 여부 → 메뉴 분기용
          userId: c.userId,               // 차단 시 필요
          isMine: c.isMine,
        })
      );

      setCommentItems(mapped);
    } catch (e: any) {
      console.error("주말 상세 조회 실패:", e);

      if (e.status === 404) {
        alert("존재하지 않는 페이지입니다.");
        navigate("/community", { replace: true });
      } else if (e.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, sortType]);

  /* --- 댓글 좋아요 (API + 낙관적 업데이트 + 실패 롤백) --- */
  const handleCommentLike = async (commentId: number) => {
    // 1) UI 먼저 토글
    setCommentItems((prev) =>
      prev.map((c) =>
        Number(c.id) === commentId
          ? {
              ...c,
              liked: !c.liked,
              likeCount: c.liked ? c.likeCount - 1 : c.likeCount + 1,
            }
          : c
      )
    );

    try {
      await toggleCommentLike(commentId);
    } catch (e: any) {
      console.error("댓글 좋아요 실패:", e);

      if (e.status === 401 || (e.message ?? "").includes("로그인")) {
        alert("로그인이 필요합니다. 다시 로그인해주세요.");
        navigate("/login");
        return;
      }

      showToast("좋아요 처리 중 오류가 발생했습니다.");

      // 2) 실패 시 롤백
      setCommentItems((prev) =>
        prev.map((c) =>
          Number(c.id) === commentId
            ? {
                ...c,
                liked: !c.liked,
                likeCount: c.liked
                  ? c.likeCount - 1
                  : c.likeCount + 1,
              }
            : c
        )
      );
    }
  };

  /* --- 댓글 메뉴 열기 --- */
  const openReportModal = (cid: number | string) => {
    const found = commentItems.find((c) => c.id === cid) ?? null;
    if (!found) return;
    setTargetComment(found);
    setCommentModal("comment-report");
  };

  const openBlockModal = (cid: number | string) => {
    const found = commentItems.find((c) => c.id === cid) ?? null;
    if (!found) return;
    setTargetComment(found);
    setCommentModal("block-user");
  };

  const openDeleteModal = (cid: number | string) => {
    const found = commentItems.find((c) => c.id === cid) ?? null;
    if (!found) return;
    setTargetComment(found);
    setCommentModal("delete-comment");
  };

  /* --- 댓글 작성 --- */
  const handleSubmitComment = async (text: string, isAnon: boolean) => {
    const content = text.trim();
    if (!content) return;

    try {
      await createQuizComment({
        quizId,
        content,
        isAnonymous: isAnon,
      });

      // 새 댓글 포함된 최신 리스트 다시 로드
      await loadDetail();
      showToast("댓글이 등록되었습니다.");
    } catch (e: any) {
      console.error("댓글 작성 실패:", e);

      if (e.status === 401 || (e.message ?? "").includes("로그인")) {
        alert("로그인이 필요합니다. 다시 로그인해주세요.");
        navigate("/login");
        return;
      }

      showToast(
        e.message ?? "댓글 작성 중 오류가 발생했습니다."
      );
    }
  };

  /* --- 댓글 삭제 --- */
  const deleteTargetComment = async () => {
    if (!targetComment) return;
    try {
      await deleteComment(Number(targetComment.id));
      await loadDetail();
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
      showToast(
        e.message ?? "댓글 삭제 중 오류가 발생했습니다."
      );
    }
  };

  /* --- 정렬된 댓글 --- */
  const commentCount = commentItems.length;

  const sortedComments = useMemo(() => {
    const list = [...commentItems];
    if (sortType === "popular") {
      return list.sort((a, b) => b.likeCount - a.likeCount);
    }
    // latest: API에서 최신순으로 내려준다고 가정 → 그대로 사용
    return list;
  }, [commentItems, sortType]);

  /* --- 로딩 처리 --- */
  if (loading || !detail) {
    return (
      <div className="w-full max-w-[393px] mx-auto min-h-screen flex items-center justify-center">
        <span className="typ-b2 text-neutral-500">불러오는 중...</span>
      </div>
    );
  }

  /* --- WeekendGameResult용 데이터 준비 --- */
  const voteResult = detail.voteResult ?? null;

  let weekendOptions: [WeekendOption, WeekendOption] | null = null;
  let weekendImageUrl: string | undefined;

  if (voteResult) {
    weekendOptions = [
      {
        label: voteResult.sideALabel,
        percent: voteResult.sideAPercentage,
        variant:
          voteResult.sideAPercentage >= voteResult.sideBPercentage
            ? "primary"
            : "gray",
      },
      {
        label: voteResult.sideBLabel,
        percent: voteResult.sideBPercentage,
        variant:
          voteResult.sideBPercentage > voteResult.sideAPercentage
            ? "primary"
            : "gray",
      },
    ];

    const aWin =
      voteResult.sideAPercentage >= voteResult.sideBPercentage;
    weekendImageUrl = aWin
      ? voteResult.sideAImageUrl
      : voteResult.sideBImageUrl;
  }

  /* ---------------- 렌더 ---------------- */
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

        {/* Weekend Game Result */}
        <div className="bg-neutral-50 w-full h-auto px-5 flex pb-6 flex-col items-center">
          <div className="w-full mt-5 content-start mb-3">
            <p className="typ-b7 text-primary-700">
              Today&apos;s Quiz
              <span className="typ-b4 text-neutral-400 ml-3">
                {parseYMD(detail.publishedDate)}
              </span>
            </p>
          </div>

          <div className="w-full">
            {voteResult && weekendOptions ? (
              <WeekendGameResult
                title={detail.content}
                imageUrl={weekendImageUrl}
                options={weekendOptions}
              />
            ) : (
              <div className="w-full rounded-[10px] px-5 py-4 bg-neutral-50 text-neutral-500 typ-b2">
                투표 결과가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 경계선 */}
        <div className="w-full h-4 bg-neutral-50" />

        {/* 댓글 영역 */}
        <div className="comments-wrapper pb-[80px]">
          {/* 정렬 버튼 */}
          <div className="px-5 w-full h-[75px] flex flex-row items-center gap-3">
            <button
              onClick={() => setSortType("popular")}
              className="flex items-center gap-1"
            >
              <span
                className={`w-2 h-2 rounded-full ${
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
            >
              <span
                className={`w-2 h-2 rounded-full ${
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

          {/* 댓글 목록 */}
          {commentCount > 0 ? (
            <CommentList
              items={sortedComments}
              onClickLike={(id) => handleCommentLike(Number(id))}
              onClickReport={openReportModal}
              onClickBlock={openBlockModal}
              onClickDelete={openDeleteModal}
            />
          ) : (
            <div className="w-full py-16 text-center">
              <p className="typ-b1 text-neutral-400">
                아직 댓글이 없습니다.
              </p>
              <p className="typ-b1 text-neutral-300 mt-1">
                나만의 생각을 공유해 보세요.
              </p>
            </div>
          )}
        </div>

        {/* 댓글 입력창 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[393px]">
          <CommentInput onSubmit={handleSubmitComment} />
        </div>
      </div>

      {/* --- 댓글 신고 모달 --- */}
      <CommentReportPop
        open={commentModal === "comment-report"}
        onCancel={closeCommentModal}
        onConfirm={async () => {
          if (!targetComment) return;
          try {
            await reportComment(Number(targetComment.id));
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

            showToast(
              e.message ?? "댓글 신고 중 오류가 발생했습니다."
            );
          }
          closeCommentModal();
        }}
      />

      {/* --- 사용자 차단 모달 --- */}
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
            showToast("사용자가 차단되었습니다.");
            closeCommentModal();

            //차단 후 뒤로 가기
            navigate(-1);
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

            showToast(
              e.message ?? "사용자 차단 중 오류가 발생했습니다."
            );
          } finally {
            closeCommentModal();
          }
        }}
      />

      {/* --- 댓글 삭제 모달 --- */}
      <DeleteCommentPop
        open={commentModal === "delete-comment"}
        onCancel={closeCommentModal}
        onConfirm={async () => {
          await deleteTargetComment();
          closeCommentModal();
        }}
      />

      {/* --- 토스트 --- */}
      {toast.open && (
        <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-2 rounded-full bg-neutral-800/60">
            <span className="typ-b4 text-white">{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekendQDetailPage;
