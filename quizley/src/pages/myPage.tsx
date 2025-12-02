// src/pages/myPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TabBar from "../component/tabbar";
import ProfileImg from "../assets/img/profileIMG.svg";
import Badge from "../assets/img/badge.svg";
import LogoutPop from "../component/logoutPop";
import { logoutApi } from "../api/auth";
import { getMyProfile } from "../api/mypage";

export default function MyPage() {
  const navigate = useNavigate();

  // 프로필 정보 (API 연동)
  const [nickname, setNickname] = useState("김슈니");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentExp, setCurrentExp] = useState(0);
  const [nextExp, setNextExp] = useState(1);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const progress = nextExp > 0 ? (currentExp / nextExp) * 100 : 0;

  // 로그아웃 팝업 open 상태
  const [logoutOpen, setLogoutOpen] = useState(false);

  // 마이페이지 프로필 정보 불러오기
  useEffect(() => {
    (async () => {
      try {
        const data = await getMyProfile();

        setNickname(data.nickname);
        if (typeof data.level === "number") {
          setCurrentLevel(data.level);
        }
        // 명세서에 따라 currentExp/nextExp 또는 exp/nextLevelExp 등일 수 있어 여유 있게 처리
        if (typeof (data as any).currentExp === "number") {
          setCurrentExp((data as any).currentExp);
        } else if (typeof (data as any).exp === "number") {
          setCurrentExp((data as any).exp);
        }
        if (typeof (data as any).nextExp === "number") {
          setNextExp((data as any).nextExp);
        } else if (typeof (data as any).nextLevelExp === "number") {
          setNextExp((data as any).nextLevelExp);
        }
        if ("profileImageUrl" in data) {
          setProfileImageUrl((data as any).profileImageUrl ?? null);
        }
      } catch (error) {
        console.error("마이페이지 프로필 조회 실패:", error);
      }
    })();
  }, []);

  // 메뉴 아이템 + 클릭 시 행동
  const menuItems: { label: string; onClick?: () => void }[] = [
    {
      label: "프로필 수정",
      onClick: () => navigate("/edit-profile"),
    },
    {
      label: "작성한 게시물",
      onClick: () => navigate("/post-list"),
    },
    {
      label: "작성한 댓글",
      onClick: () => navigate("/comment-list"),
    },
    {
      label: "좋아요 누른 게시물",
      onClick: () => navigate("/like-list"),
    },
    {
      label: "로그아웃",
      onClick: () => setLogoutOpen(true),
    },
  ];

  // 실제 로그아웃 로직: 토큰 삭제 + 로그인 페이지 이동
  const handleConfirmLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error(e);
    } finally {
      setLogoutOpen(false);
      navigate("/login");
    }
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
              src={profileImageUrl ?? ProfileImg}
              alt="프로필 이미지"
              className="w-[100px] h-[100px] object-cover"
            />
          </div>

          {/* 이름 + 레벨 배지 */}
          <div className="flex items-center gap-1">
            <span className="text-[20px] font-bold text-neutral-900">
              {nickname}
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
