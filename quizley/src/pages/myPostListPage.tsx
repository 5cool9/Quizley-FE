// src/pages/myPostListPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/header";
import PostList, { type PostUser } from "../component/postList";
import { getMyPosts } from "../api/mypage";

export default function MyPostListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<PostUser[]>([]);

  // 내가 작성한 게시물 목록 조회
  useEffect(() => {
    getMyPosts<PostUser>()
      .then((list) => {
        setItems(list);
      })
      .catch((error) => {
        console.error("작성한 게시물 목록 조회 실패:", error);
      });
  }, []);

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
            items={items}
            iconSize="sm"
          />
        </main>
      </div>
    </div>
  );
}
