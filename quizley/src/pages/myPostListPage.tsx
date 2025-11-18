// src/pages/myPostListPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

import Header from "../component/header";
import PostList, { type PostUser } from "../component/postList";

const MY_POSTS: PostUser[] = [
  {
    id: 1,
    kind: "user",
    nickname: "김슈니",
    title: "좀비 아포칼립스가 온다면, 어디에 숨는 게 제일 안전할까?",
    timeText: "3시간 전",
    likeCount: 2,
    commentCount: 14,
    liked: false,
  },
  {
    id: 2,
    kind: "user",
    nickname: "익명",
    title: "하루 동안 투명인간이 된다면 가장 먼저 뭘 할 거야?",
    timeText: "2025.04.12",
    likeCount: 20,
    commentCount: 4,
    liked: false,
  },
  {
    id: 3,
    kind: "user",
    nickname: "익명",
    title: "고양이가 대통령이 된다면 첫 번째 공약은 뭐일까? 🐱",
    timeText: "2024.12.04",
    likeCount: 24,
    commentCount: 48,
    liked: false,
  },
  {
    id: 4,
    kind: "user",
    nickname: "김슈니",
    title: "100년 뒤의 인간은 지금 우리를 보고 뭐라고 평가할까?",
    timeText: "2024.07.09",
    likeCount: 94,
    commentCount: 184,
    liked: false,
  },
];

export default function MyPostListPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-max bg-neutral-50">
      <div className="relative mx-auto w-full max-w-[393px] min-h-screen bg-white">
        <div className="pt-8">
          <Header
            title="작성한 게시물"
            onBack={() => navigate(-1)}
            showMenu={false}
            className="pt-1 pb-5"
          />
        </div>

        <main className="pb-[80px]">
          <PostList
            items={MY_POSTS}
            iconSize="sm"   // ← 아이콘 크기 w-5 h-5
          />
        </main>
      </div>
    </div>
  );
}
