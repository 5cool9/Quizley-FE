// src/pages/myCommentPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/header";
import IconLike from "../assets/icon/icon_like_none.svg";
import IconLikeOn from "../assets/icon/icon_like_activation.svg";
import { getMyComments } from "../api/mypage";

type MyCommentItem = {
  commentId: number | string;
  quizAuthor: string;   // 익명 / 단무지 등
  quizKind: string;     // Quiz / 질문
  quizTitle: string;    // 질문 제목
  commentText: string;  // 내가 쓴 댓글 내용
  dateText: string;     // YYYY.MM.DD
  likeCount: number;
  liked?: boolean;
};

export default function MyCommentPage() {
  const navigate = useNavigate();

  const [comments, setComments] = useState<MyCommentItem[]>([]);

  // 내 댓글 목록 조회
  useEffect(() => {
    getMyComments<MyCommentItem>()
      .then((list) => {
        setComments(list);
      })
      .catch((error) => {
        console.error("작성한 댓글 목록 조회 실패:", error);
      });
  }, []);

  const handleToggleLike = (id: number | string) => {
    setComments((prev) =>
      prev.map((item) =>
        item.commentId === id
          ? {
              ...item,
              liked: !item.liked,
              likeCount: item.liked
                ? item.likeCount - 1
                : item.likeCount + 1,
            }
          : item
      )
    );
  };

  return (
    <div className="min-h-max bg-neutral-50">
      {/* iPhone 프레임 */}
      <div className="relative mx-auto w-full max-w-[393px] min-h-screen bg-white">
        {/* 상단 헤더 */}
        <div className="pt-8">
          <Header
            title="작성한 댓글"
            onBack={() => navigate(-1)}
            showMenu={false}
            className="pt-1 pb-5"
          />
        </div>

        {/* 목록 영역 */}
        <main className="pt-1 pb-[140px]">
          <div>
            {comments.map((item) => (
              <article
                key={item.commentId}
                className="w-full bg-white px-5 py-5 border-b border-neutral-200"
              >
                <div className="flex flex-col gap-5">
                  {/* 질문 / 댓글 텍스트 부분 */}
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                      <p className="typ-b1 text-neutral-400">
                        {item.quizAuthor}님이 만든 {item.quizKind}
                      </p>
                      <p className="typ-b2 text-neutral-500">
                        {item.quizTitle}
                      </p>
                    </div>
                    <p className="typ-b2 text-neutral-900 font-medium whitespace-pre-line">
                      {item.commentText}
                    </p>
                  </div>

                  {/* 날짜 + 좋아요 */}
                  <div className="flex items-center justify-between">
                    <span className="typ-b1 text-neutral-400">
                      {item.dateText}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleLike(item.commentId)}
                      className="flex items-center gap-1"
                      aria-label="좋아요"
                    >
                      <img
                        src={item.liked ? IconLikeOn : IconLike}
                        alt=""
                        className="w-5 h-5"
                      />
                      <span
                        className={`typ-b1 ${
                          item.liked
                            ? "text-primary-700"
                            : "text-neutral-400"
                        }`}
                      >
                        {item.likeCount}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
