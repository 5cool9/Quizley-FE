// src/pages/recordPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TabBar from "../component/tabbar";
import Calender from "../component/calender";
import ReportMap from "../component/reportMap";
import AiIcon from "../assets/icon/ai_profile.svg";

export default function RecordPage() {
  const [tab, setTab] = useState<"calendar" | "report">("calendar");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 페이지 컨테이너: iPhone 프레임 393px */}
      <div className="mx-auto w-full max-w-[394px] pb-[86px]">
        {/* 상단 헤더 영역 (화이트 배경) */}
        <div className="bg-white">
          {/* 제목 */}
          <div className="px-5 pt-6">
            <h1 className="text-[24px] font-bold text-neutral-900">기록</h1>
          </div>

          {/* 탭 + 하단 라인 */}
          <div className="mt-4 bg-white">
            <div className="relative w-full">
              {/* 회색 전체 라인 (헤더 폭 그대로) */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-300" />

              {/* 검은 라인: 헤더 폭을 1/2씩, 활성 탭으로 슬라이드 */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                <div
                  className={`
                    h-full w-1/2 bg-neutral-900
                    transform transition-transform duration-200 ease-out
                    ${tab === "calendar" ? "translate-x-0" : "translate-x-full"}
                  `}
                />
              </div>

              {/* 탭 버튼 – 기존 위치/간격 유지 */}
              <div className="flex justify-center gap-40 px-5">
                <button
                  type="button"
                  onClick={() => setTab("calendar")}
                  className={`pb-2 text-[18px] font-semibold ${
                    tab === "calendar" ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  캘린더
                </button>
                <button
                  type="button"
                  onClick={() => setTab("report")}
                  className={`pb-2 text-[18px] font-semibold ${
                    tab === "report" ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  리포트
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- 캘린더 탭 --- */}
        {tab === "calendar" && (
          <>
            {/* 우측 ‘8일’ */}
            <div className="px-5 h-[60px] flex items-center justify-end">
              <img src={AiIcon} alt="" className="w-6 h-6 mr-2" />
              <span className="text-[18px] font-semibold text-neutral-900">
                8일
              </span>
            </div>

            {/* 달력 카드 */}
            <div className="flex justify-center">
              <div className="w-[394px]">
                <Calender
                  onWeekendClick={(date) => {
                    // 주말 날짜 클릭 시 인사이트 페이지로 이동
                    // date 필요하면 여기서 사용
                    navigate("/weekend");
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* --- 리포트 탭 --- */}
        {tab === "report" && (
          <div className="px-6 pt-6 space-y-6">
            {/* 연속 답변일 카드 */}
            <section className="bg-white rounded-[10px] border-b border-neutral-50 px-5 py-4">
              <p className="typ-b5 text-neutral-650">
                김슈니님의 연속 답변일은 8일!
              </p>
              <p className="typ-b5">
                <span className="font-semibold text-neutral-900">
                  상위 30%
                </span>
                <span className="text-neutral-650">예요</span>
              </p>
            </section>

            {/* 타입 + 레이더 차트 카드 */}
            <section className="bg-white rounded-[10px] border-b border-neutral-50 px-5 pt-5 pb-6">
              <p className="typ-b5 text-neutral-650">
                <span>김슈니님은 </span>
                <span className="font-semibold text-neutral-900">심리학자</span>
                <span> 타입!</span>
                <br />
                <span>이번 달 심리학 질문에 가장 많은 답변을 했어요</span>
              </p>

              <div className="mt-6 flex justify-center">
                <ReportMap className="-mt-2" />
              </div>
            </section>

            {/* AI 피드백 */}
            <section className="space-y-2 pb-4">
              <h2 className="typ-b5 font-medium text-neutral-700">AI 피드백</h2>
              <div className="bg-white rounded-[10px] border-b border-neutral-50 px-5 py-4">
                <p className="typ-b5 text-neutral-650">
                  김슈니님은 분야별 답변율 편차가 있네요
                  <br />
                  다음부터는 (가장 적은분야)에 도전해보는건
                  <br />
                  어떤가요? 더 재미있을지도 몰라요
                </p>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* 하단 탭바(기록 활성) */}
      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <div className="mx-auto w-full max-w-[393px]">
          <TabBar active="history" />
        </div>
      </div>
    </div>
  );
}
