import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

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

// ------------------ 타입 & 더미 데이터 ------------------

// CommentList에서 타입을 재사용
type CommentItem = CommentListItem;

type CommentModalType =
  | "comment-report"
  | "block-user"
  | "delete-comment"
  | null;

// 오늘의 질문 더미
const dailyPostDemo: DetailDailyPost = {
  id: 100,
  kind: "daily",
  title:
    "하루 동안 모든 동물과 대화할 수 있다면 가장 먼저 어떤 질문을 할까?",
  dateText: "2025.10.05",
  commentCount: 3,
};

// 댓글 더미
const initialComments: CommentItem[] = [
  {
    id: 1,
    nickname: "JUJU",
    dateText: "2025.10.05",
    content: "우리집 고양이한테 어디 아픈데는 없냐고 물어볼래 😭",
    likeCount: 920,
    myComments: false,
    liked: false,
  },
  {
    id: 2,
    nickname: "익명1",
    dateText: "2025.10.08",
    content: "사람이 되면 제일 해보고 싶은 게 뭐야?",
    likeCount: 364,
    myComments: false,
    liked: false,
  },
  {
    id: 3,
    nickname: "익명2",
    dateText: "2025.10.07",
    content: "지구에서 살아가는 데 인간이 꼭 바꿔야 할 건 뭐라고 생각해?",
    likeCount: 73,
    myComments: true,
    liked: false,
  },
];

// 날짜 파싱 (최신순 정렬용)
const parseDate = (dateText: string) => {
  const [y, m, d] = dateText.split(".").map((v) => Number(v));
  return new Date(y, m - 1, d);
};

const TodayQDetailPage = () => {
  const navigate = useNavigate();

  // 오늘의 질문 (필요하면 상태로 관리)
  const [detailPost] = useState<DetailDailyPost>(dailyPostDemo);

  // 댓글 목록
  const [commentItems, setCommentItems] =
    useState<CommentItem[]>(initialComments);

  // 정렬 기준
  const [sortType, setSortType] =
    useState<"latest" | "popular">("popular");

  // 어떤 댓글 기준으로 모달이 열려 있는지
  const [commentModal, setCommentModal] =
    useState<CommentModalType>(null);
  const [targetComment, setTargetComment] =
    useState<CommentItem | null>(null);

  // 토스트
  const [toastMessage, setToastMessage] = useState<string | null>(
    null
  );
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const closeCommentModal = () => setCommentModal(null);

  // ------------ 댓글 좋아요 토글 ------------
  const handleCommentLike = (id: number) => {
    setCommentItems((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const nextLiked = !c.liked;
        const nextCount = nextLiked ? c.likeCount + 1 : c.likeCount - 1;

        console.log("comment like:", {
          commentId: id,
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

  // ------------ 댓글 정렬 ------------
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
            // 오늘의 질문은 좋아요 기능 없으면 비워두기
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

          {/* 댓글 유무에 따라 분기 */}
          {commentCount > 0 ? (
            <CommentList
              items={sortedComments}
              onClickLike={(id) =>
                handleCommentLike(id as number)
              }
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
                나만의 생각을 공유해 보세요.
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
