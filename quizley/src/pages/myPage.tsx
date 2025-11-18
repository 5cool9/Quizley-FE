// src/pages/myPage.tsx
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import TabBar from "../component/tabbar";
import ProfileImg from "../assets/img/profileIMG.svg";
import Badge from "../assets/img/badge.svg";
import LogoutPop from "../component/logoutPop";

export default function MyPage() {
  const navigate = useNavigate();

  const currentLevel = 20;
  const currentExp = 983;
  const nextExp = 1200;
  const progress = (currentExp / nextExp) * 100;

  // 로그아웃 팝업 open 상태
  const [logoutOpen, setLogoutOpen] = useState(false);

  // 메뉴 아이템 + 클릭 시 행동
  const menuItems: { label: string; onClick?: () => void }[] = [
    {
      label: "프로필 수정",
      onClick: () => navigate("/edit-profile"),
    },
    { label: "작성한 게시물", 
      onClick: () => navigate("/post-list"),
    },
    { label: "작성한 댓글",
      onClick: () => navigate("/comment-list"),
     },
    { label: "좋아요 누른 게시물",
      onClick: () => navigate("/like-list"),
     },
    { label: "로그아웃",
      onClick: () => setLogoutOpen(true), 
     },
  ];

  // 실제 로그아웃 로직은 나중에 토큰 삭제 + 로그인 페이지 이동 등으로 교체
  const handleConfirmLogout = () => {
    setLogoutOpen(false);
    // 예시:
    // localStorage.removeItem("accessToken");
    // navigate("/login");
  };

  return (
    <div className="min-h-max bg-neutral-50">
      {/* iPhone 프레임 */}
      <div className="mx-auto w-full max-w-[393px] pt-5 bg-white pb-[120px]">
        {/* 상단 타이틀 */}
        <div className="px-5">
          <h1 className="text-[24px] font-bold text-neutral-900">MY</h1>
        </div>

        {/* 프로필 영역 */}
        <section className="mt-8 flex flex-col items-center gap-3">
          {/* 프로필 이미지 */}
          <div className="w-[100px] h-[100px] rounded-full border border-neutral-100 flex items-center justify-center overflow-hidden">
            <img
              src={ProfileImg}
              alt="프로필 이미지"
              className="w-[100px] h-[100px]"
            />
          </div>

          {/* 이름 + 레벨 배지 */}
          <div className="flex items-center gap-1">
            <span className="text-[20px] font-bold text-neutral-900">
              김슈니
            </span>
            <div className="relative inline-flex items-center">
              <img src={Badge} alt="레벨 배지" className="h-[24px]" />
              <span className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-white">
                {currentLevel}
              </span>
            </div>
          </div>
        </section>

        {/* 레벨 진행도 바 */}
        <section className="mt-8 px-5">
          <div className="w-full h-[12px] rounded-[20px] bg-[#D2D2D2] overflow-hidden">
            <div
              className="h-full rounded-[20px] bg-gradient-to-r from-[#777BF9] to-[#DBB6E1]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-primary-500">
              Lv.{currentLevel} ({currentExp}/{nextExp})
            </span>
            <span className="text-[12px] font-semibold text-neutral-400">
              Lv.{currentLevel + 1}
            </span>
          </div>
        </section>

        {/* 메뉴 리스트 */}
        <section className="mt-8 border-y border-neutral-200 divide-y divide-neutral-200">
          {menuItems.map(({ label, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="w-full flex items-center px-5 py-4 text-left"
            >
              <span className="text-[16px] font-medium text-neutral-900">
                {label}
              </span>
            </button>
          ))}
        </section>
      </div>

      {/* 로그아웃 팝업 */}
      <LogoutPop
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />

      {/* 하단 탭바 (MY 활성) */}
      <TabBar active="my" />
    </div>
  );
}
