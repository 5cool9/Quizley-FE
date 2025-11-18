// src/pages/weekendInsightPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/header";
import WeekendGameResult from "../component/weekendGameResult";
import TabBar from "../component/tabbar";
import TrashIcon from "../assets/icon/icon_trash.svg";

export default function WeekendInsightPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDeleteClick = () => {
    // TODO: 삭제 API 붙이면 여기서 호출
    alert("기록 삭제 눌림 (나중에 API 연결)");
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* iPhone 프레임 */}
      <div className="mx-auto w-full max-w-[394px] bg-neutral-50 pb-[86px] relative">
        {/* 상단 헤더 영역 (화이트 배경) */}
        <div className="bg-white pb-10">
          <div className="pt-6">
            <Header
              title="오늘의 인사이트"
              onBack={() => navigate(-1)}
              showMenu={true}
              onMenu={() => setMenuOpen((v) => !v)}
            />
          </div>
        </div>

        {/* 👉 메뉴 버튼 눌렀을 때 뜨는 팝업 */}
        {menuOpen && (
          <div className="absolute right-5 top-[72px] z-20">
            <button
              type="button"
              onClick={handleDeleteClick}
              className="flex items-center gap-3 px-4 py-2 bg-white rounded-[4px] shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
            >
              <span className="text-[14px] text-neutral-700">기록 삭제</span>
              <img src={TrashIcon} alt="" className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 상단 설명 영역 */}
        <section className="px-5 pt-4 space-y-1">
          <p className="text-[16px] font-semibold text-primary-700">
            ⚡ 주말 한정 밸런스 게임
          </p>
          <h2 className="text-[22px] font-bold text-neutral-900">
            Today’s Quiz
          </h2>
          <p className="text-[16px] text-neutral-650">2025. 01. 11. (토)</p>
        </section>

        {/* 밸런스 게임 결과 카드 */}
        <div className="mt-5 px-5">
          <WeekendGameResult />
        </div>

        {/* 내 투표 / 생각 카드 */}
        <section className="mt-6 px-5">
          <div className="bg-white rounded-[10px] px-5 py-4">
            <div className="bg-neutral-50 rounded-[10px] px-5 py-4">
              <p className="text-[16px] text-neutral-650 whitespace-pre-line">
                투표 : 짜장
                {"\n"}
                생각 : 무조건 짜장이지!! 원래 짜장이 근본이에요
              </p>
            </div>
          </div>
        </section>

        {/* 다른 유저의 생각 TOP3 */}
        <section className="mt-6 px-5 pb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[16px] font-medium text-neutral-700">
              다른 유저의 생각 TOP3
            </p>
            <button
              type="button"
              className="text-[14px] font-medium text-neutral-400"
            >
              더보기
            </button>
          </div>

          <div className="space-y-2">
            <div className="bg-white rounded-[10px] px-5 py-3">
              <p className="text-[16px] text-neutral-650">
                짜장이 최고지만 난 탕수육이 최애..
              </p>
            </div>
            <div className="bg-white rounded-[10px] px-5 py-3">
              <p className="text-[16px] text-neutral-650">
                오랜만에 짜장면 먹고싶다~~~
              </p>
            </div>
            <div className="bg-white rounded-[10px] px-5 py-3">
              <p className="text-[16px] text-neutral-650">
                요즘같이 쌀쌀한 날에는 국물을 먹어야함
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 하단 탭바 – 기록 활성 */}
      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <div className="mx-auto w-full max-w-[393px]">
          <TabBar active="history" />
        </div>
      </div>
    </div>
  );
}
