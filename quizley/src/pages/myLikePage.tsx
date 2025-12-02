// src/pages/myLikePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../component/header";
import PostList, { type PostUser } from "../component/postList";
import { getMyLikedPosts } from "../api/mypage";

export default function MyLikePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<PostUser[]>([]);

  // 좋아요 누른 게시물 목록 조회
  useEffect(() => {
    getMyLikedPosts<PostUser>()
      .then((list) => {
        setItems(list);
      })
      .catch((error) => {
        console.error("좋아요 누른 게시물 목록 조회 실패:", error);
      });
  }, []);

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
      <div className="relative mx-auto w_full max-w-[393px] min-h-screen bg-white">
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
