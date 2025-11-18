// src/pages/myCommentPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/header";
import IconLike from "../assets/icon/icon_like_none.svg";
import IconLikeOn from "../assets/icon/icon_like_activation.svg";

type MyCommentItem = {
  id: number | string;
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

  const [comments, setComments] = useState<MyCommentItem[]>([
    {
      id: 1,
      quizAuthor: "익명",
      quizKind: "Quiz",
      quizTitle:
        "시간여행이 가능하다면, 과거와 미래 중 어디로 가고 싶어?",
      commentText:
        "미래도 과거도 안 갈거야. 미래로 갔다가 이미 내가 죽은 뒤로 가서 그냥 미래가 없거나 과거로 갔는데 내가 노비면 어떡해",
      dateText: "2025.08.12",
      likeCount: 41,
    },
    {
      id: 2,
      quizAuthor: "단무지",
      quizKind: "질문",
      quizTitle: "외계인 진짜 있다고 생각해?",
      commentText:
        "우주가 이렇게 넓은데 과연 지구에만 생명체가 있을까? 그게 더 어렵겠다",
      dateText: "2025.05.10",
      likeCount: 3,
    },
    {
      id: 3,
      quizAuthor: "익명",
      quizKind: "Quiz",
      quizTitle:
        "만약 동물이 말을 할 수 있다면, 제일 시끄러운 동물은 뭐일까?",
      commentText:
        "우리집 앵무새 ㅠㅠ 이미 시끄러워서 그런 일은 일어나지 않았으면 조켄네...",
      dateText: "2025.04.12",
      likeCount: 244,
    },
    {
      id: 4,
      quizAuthor: "익명",
      quizKind: "Quiz",
      quizTitle:
        "외계인 친구가 한국에 놀러오면 어떤 코스로 놀꺼야?",
      commentText:
        "놀이공원 가서 불꽃놀이까지 다 보고 집으로 순간이동",
      dateText: "2025.04.01",
      likeCount: 24,
    },
    {
      id: 5,
      quizAuthor: "익명",
      quizKind: "Quiz",
      quizTitle:
        "꿈속에서 자유롭게 살 수 있다면 현실로 돌아오고 싶을까?",
      commentText:
        "수원오면 갈비랑 화이트롤 먹이고 화성행궁 산책하면서 우주전쟁나면 나만큼은 안 죽이겠다는 서약서를 꼭 받아낼거야",
      dateText: "2025.04.01",
      likeCount: 24,
    },
  ]);

  const handleToggleLike = (id: number | string) => {
    setComments((prev) =>
      prev.map((item) =>
        item.id === id
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
                key={item.id}
                className="w-full bg-white px-5 py-5 border-b border-neutral-200"
              >
                <div className="flex flex-col gap-5">
                  {/* 질문 / 댓글 텍스트 부분 */}
                  <div className="flex flex-col gap-5">
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
                  </div>

                  {/* 날짜 + 좋아요 */}
                  <div className="flex items-center justify-between">
                    <span className="typ-b1 text-neutral-400">
                      {item.dateText}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleLike(item.id)}
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
