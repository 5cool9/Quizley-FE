// src/pages/myLikePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../component/header";
import PostList, { type PostUser } from "../component/postList";
import { getMyLikedPosts } from "../api/mypage";
import { toggleQuizLike } from "../api/communityApi";
import AlertPop from "../component/alertPop";

export default function MyLikePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<PostUser[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 좋아요 누른 게시물 목록 조회
  useEffect(() => {
    getMyLikedPosts<any>()
      .then((list) => {
        console.log("내 좋아요 게시글 API 응답:", list);

        const mapped: PostUser[] = list.map((item: any) => ({
          id: item.quizId,
          kind: "user",
          nickname: "익명",
          title: item.content,
          timeText: item.createdAt,
          likeCount: 1,
          commentCount: 0,
          liked: true,
        }));

        setItems(mapped);
      })
      .catch((error) => {
        console.error("좋아요 누른 게시물 목록 조회 실패:", error);
      });
  }, []);

  // 좋아요 해지 시 목록에서 바로 제거
  const handleToggleLike = async (id: PostUser["id"]) => {
    const quizId = Number(id);
    const prevItems = items; // 되돌리기용 스냅샷

    // 1) UI에서 먼저 제거
    setItems((prev) => prev.filter((it) => it.id !== quizId));

    try {
      // 2) 서버에 좋아요 토글 요청(해지)
      await toggleQuizLike(quizId);
    } catch (err: any) {
      console.error("좋아요 취소 실패:", err);
      setAlertMessage("좋아요 취소 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setAlertOpen(true);

      // 3) 실패하면 목록 원상복구
      setItems(prevItems);
    }
  };

  // 게시글 클릭 시 상세로 이동
  const handleClickItem = (id: PostUser["id"]) => {
    navigate(`/community/user/${id}`);
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
            onClickItem={handleClickItem}
            onClickComment={handleClickItem}
            iconSize="sm"
          />
        </main>
      </div>
      <AlertPop
            open={alertOpen}
            title={alertMessage}
            onConfirm={() => setAlertOpen(false)}
      />
    </div>
  );
}
