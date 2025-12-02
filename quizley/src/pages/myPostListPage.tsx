// src/pages/myPostListPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/header";
import PostList, { type PostUser } from "../component/postList";
import { getMyPosts } from "../api/mypage";

export default function MyPostListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<PostUser[]>([]);

  // 게시글 클릭 시 상세로 이동
  const handleClickItem = (id: number | string) => {
    navigate(`/community/user/${id}`);
  };

  // 내가 작성한 게시물 목록 조회
  useEffect(() => {
    getMyPosts<any>()
      .then((list) => {
        console.log("내 게시글 API 응답:", list);

        // SearchListPage 에서 user 글 매핑하는 모양과 동일하게 맞추기
        const mapped: PostUser[] = list.map((item: any) => ({
          id: item.quizId,                       // 게시글 id
          kind: "user",                          
          nickname: item.isAnonymous ? "익명" : "나", 
          title: item.content,                  
          timeText: item.createdAt || "",        
          likeCount: 0,                          
          commentCount: 0,                       
          liked: false,                         
        }));

        setItems(mapped);
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
            onClickItem={handleClickItem}
            onClickComment={handleClickItem}
          />
        </main>
      </div>
    </div>
  );
}
