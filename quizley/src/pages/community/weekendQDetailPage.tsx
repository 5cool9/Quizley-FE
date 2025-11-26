import { useState, useMemo } from "react";
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

/* ---------------- 타입 & 더미 데이터 ---------------- */

type CommentItem = CommentListItem;

type CommentModalType =
  | "comment-report"
  | "block-user"
  | "delete-comment"
  | null;

const initialComments: CommentItem[] = [
  {
    id: 1,
    nickname: "익명3",
    dateText: "2025.01.11",
    content: "무조건 짜장이죠!! 원래 짜장이 근본이에요",
    likeCount: 110,
    liked: true,
    myComments: true,
  },
  {
    id: 111,
    nickname: "익명4",
    dateText: "2025.11.11",
    content: "무조건 짜장이죠!! 원래 짜장이 근본이에요",
    likeCount: 1,
    liked: false,
    myComments: false,
  },
];

/* ---------------- 유틸 함수 ---------------- */

const parseDate = (dateText: string) => {
  // "2025.01.11" -> Date
  const [y, m, d] = dateText.split(".").map((v) => Number(v));
  return new Date(y, m - 1, d);
};

const getTodayText = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
};

/* ---------------- 컴포넌트 ---------------- */

const WeekendQDetailPage = () => {
  const { id } = useParams<{ id: string }>(); // 주말 퀴즈 id(지금은 더미)
  const navigate = useNavigate();

  const [sortType, setSortType] =
    useState<"latest" | "popular">("latest");

  const [commentItems, setCommentItems] =
    useState<CommentItem[]>(initialComments);

  const [commentModal, setCommentModal] =
    useState<CommentModalType>(null);
  const [targetComment, setTargetComment] =
    useState<CommentItem | null>(null);

  // 토스트 상태
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastOpen(true);
    setTimeout(() => {
      setToastOpen(false);
    }, 2000);
  };

  const closeCommentModal = () => setCommentModal(null);

  /* ------ 댓글 좋아요 토글 ------ */
  const handleCommentLike = (cid: CommentItem["id"]) => {
    const numericId = Number(cid);
    setCommentItems((prev) =>
      prev.map((c) => {
        if (Number(c.id) !== numericId) return c;

        const nextLiked = !c.liked;
        const nextCount = nextLiked
          ? c.likeCount + 1
          : c.likeCount - 1;

        console.log("comment like:", {
          commentId: c.id,
          liked: nextLiked,
          likeCount: nextCount,
        });

        return {
          ...c,
          liked: nextLiked,
          likeCount: nextCount,
        };
      })
    );
  };

  /* ------ 댓글 정렬 ------ */
  const sortedComments = useMemo(() => {
    const list = [...commentItems];
    if (sortType === "popular") {
      return list.sort((a, b) => b.likeCount - a.likeCount);
    }
    return list.sort(
      (a, b) =>
        parseDate(b.dateText).getTime() -
        parseDate(a.dateText).getTime()
    );
  }, [commentItems, sortType]);

  const commentCount = commentItems.length;

  /* ------ 댓글 메뉴 콜백들 (신고/차단/삭제) ------ */

  const openReportModal = (cid: CommentItem["id"]) => {
    const found =
      commentItems.find((c) => c.id === cid) ?? null;
    if (!found) return;
    setTargetComment(found);
    setCommentModal("comment-report");
  };

  const openBlockModal = (cid: CommentItem["id"]) => {
    const found =
      commentItems.find((c) => c.id === cid) ?? null;
    if (!found) return;
    setTargetComment(found);
    setCommentModal("block-user");
  };

  const openDeleteModal = (cid: CommentItem["id"]) => {
    const found =
      commentItems.find((c) => c.id === cid) ?? null;
    if (!found) return;
    setTargetComment(found);
    setCommentModal("delete-comment");
  };

  /* ------ 댓글 작성 ------ */

  const handleSubmitComment = (text: string, isAnon: boolean) => {
    console.log("댓글 submit:", text, isAnon);

    const nicknameBase = isAnon ? "익명" : "닉네임";
    const nickname = `${nicknameBase}${commentItems.length + 1}`;

    const newComment: CommentItem = {
      id: Date.now(),
      nickname,
      dateText: getTodayText(),
      content: text,
      likeCount: 0,
      liked: false,
      myComments: true,
    };

    setCommentItems((prev) => [newComment, ...prev]);
  };

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

        {/* Today’s Quiz + WeekendGameResult 카드 */}
        <div className="bg-neutral-50 w-full h-auto px-5 flex pb-6 flex-col items-center">
          <div className="w-full mt-5 content-start mb-3">
            <p className="typ-b7 text-primary-700">
              Today&apos;s Quiz
              <span className="typ-b4 text-neutral-400 ml-3">
                2025.01.11
              </span>
            </p>
          </div>

          <div className="w-full">
            <WeekendGameResult />
          </div>
        </div>

        {/* 회색 경계선 */}
        <div className="w-full h-4 bg-neutral-50" />

        {/* 댓글 영역 */}
        <div className="comments-wrapper pb-[80px]">
          {/* 정렬 버튼 */}
          <div className="px-5 w-full h-[75px] flex flex-row items-center gap-3">
            {/* 인기순 */}
            <button
              onClick={() => setSortType("popular")}
              className="flex items-center gap-1"
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

            {/* 최신순 */}
            <button
              onClick={() => setSortType("latest")}
              className="flex items-center gap-1"
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

          {/* 댓글 리스트 / 비어있을 때 안내문구 */}
          {commentCount > 0 ? (
            <CommentList
              items={sortedComments}
              onClickLike={handleCommentLike}
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

      {/* -------- 모달들 -------- */}

      {/* 댓글 신고 */}
      <CommentReportPop
        open={commentModal === "comment-report"}
        onCancel={closeCommentModal}
        onConfirm={() => {
          if (!targetComment) return;
          console.log("댓글 신고:", targetComment.id);
          closeCommentModal();
          showToast("댓글이 신고되었습니다.");
        }}
      />

      {/* 사용자 차단 */}
      <BlockUserPop
        open={commentModal === "block-user"}
        onCancel={closeCommentModal}
        onConfirm={() => {
          if (!targetComment) return;
          console.log("사용자 차단:", targetComment.nickname);
          closeCommentModal();
          showToast("사용자가 차단되었습니다.");
        }}
      />

      {/* 댓글 삭제 */}
      <DeleteCommentPop
        open={commentModal === "delete-comment"}
        onCancel={closeCommentModal}
        onConfirm={() => {
          if (!targetComment) return;
          console.log("댓글 삭제:", targetComment.id);
          setCommentItems((prev) =>
            prev.filter((c) => c.id !== targetComment.id)
          );
          closeCommentModal();
          showToast("댓글이 삭제되었습니다.");
        }}
      />

      {/* -------- 토스트 -------- */}
      {toastOpen && (
        <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-2 rounded-full bg-neutral-800/60">
            <span className="typ-b4 text-white">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekendQDetailPage;
