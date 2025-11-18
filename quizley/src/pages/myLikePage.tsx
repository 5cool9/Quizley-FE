// src/pages/myLikePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../component/header";
import PostList, { type PostUser } from "../component/postList";

const LIKE_POSTS_INITIAL: PostUser[] = [
  {
    id: 1,
    kind: "user",
    nickname: "김슈니",
    title: "좀비 아포칼립스가 온다면, 어디에 숨는 게 제일 안전할까?",
    timeText: "3시간 전",
    likeCount: 46,
    commentCount: 71,
    liked: true,
  },
  {
    id: 2,
    kind: "user",
    nickname: "익명",
    title: "하루 동안 투명인간이 된다면 가장 먼저 뭘 할 거야?",
    timeText: "2025.04.12",
    likeCount: 2,
    commentCount: 1,
    liked: true,
  },
  {
    id: 3,
    kind: "user",
    nickname: "익명",
    title: "고양이가 대통령이 된다면 첫 번째 공약은 뭐일까? 🐱",
    timeText: "2024.12.04",
    likeCount: 240,
    commentCount: 44,
    liked: true,
  },
  {
    id: 4,
    kind: "user",
    nickname: "김슈니",
    title: "100년 뒤의 인간은 지금 우리를 보고 뭐라고 평가할까?",
    timeText: "2024.07.09",
    likeCount: 214,
    commentCount: 34,
    liked: true,
  },
];

export default function MyLikePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<PostUser[]>(LIKE_POSTS_INITIAL);

  // 좋아요 토글 (원하면 좋아요 취소도 가능)
  const handleToggleLike = (id: PostUser["id"]) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              liked: !it.liked,
              likeCount: it.liked ? it.likeCount - 1 : it.likeCount + 1,
            }
          : it
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
            title="좋아요 누른 게시물"
            onBack={() => navigate(-1)}
            showMenu={false}
            className="pt-1 pb-5"
          />
        </div>

        {/* 목록 */}
        <main className="pb-[80px]">
          <PostList
            items={items}
            onToggleLike={handleToggleLike}
            iconSize="sm"
          />
        </main>
      </div>
    </div>
  );
}
