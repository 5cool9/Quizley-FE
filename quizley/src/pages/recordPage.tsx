// src/pages/recordPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TabBar from "../component/tabbar";
import Calender from "../component/calender";
import ReportMap from "../component/reportMap";
import AiIcon from "../assets/icon/ai_profile.svg";
import { getMyAnswerHistory, getReportSummary, type AnswerHistory, type ReportSummary } from "../api/record";
import { getMyProfile } from "../api/mypage";

// 리포트 레이더 차트용 카테고리 고정 순서
const CATEGORY_ORDER: [string, string, string, string, string, string] = [
  "미스테리",
  "예술",
  "문학",
  "자연과학",
  "심리학",
  "역사",
];

export default function RecordPage() {
  const [tab, setTab] = useState<"calendar" | "report">("calendar");
  const navigate = useNavigate();

  // 캘린더용 기록
  const [history, setHistory] = useState<AnswerHistory | null>(null);
  // 리포트 요약
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  // 닉네임 불러오기
  const [nickname, setNickname] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 첫 진입 시 캘린더 + 리포트 기록 동시 조회
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const [historyData, summaryData, profileData] = await Promise.all([
          getMyAnswerHistory(),
          getReportSummary(),
          getMyProfile(),
        ]);

        setHistory(historyData);
        setSummary(summaryData);
        setNickname(profileData.nickname ?? "");
      } catch (err: any) {
        console.error("기록/리포트 조회 실패:", err);
        setErrorMsg(err?.message ?? "기록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const displayName = nickname || "사용자";

  // 캘린더 탭에 쓸 데이터
  const consecutiveDays = history?.consecutiveDays ?? summary?.streakDays ?? 0;
  const answeredDates = history?.answeredDates ?? [];

  // 리포트 탭에 쓸 데이터
  const streakDays = summary?.streakDays ?? consecutiveDays;
  const topPercent = summary?.topPercent ?? 0;
  const dominantCategory = summary?.dominantCategory ?? "심리학";
  const feedback =
    summary?.feedback ??
    "분야별 답변율 편차가 있네요. 다음에는 적은 분야에도 도전해보는 건 어떨까요?";

    // 레이더 차트에 쓸 값 (0~1 범위라 가정)
  const radarValues = CATEGORY_ORDER.map(
    (cat) => summary?.scores?.[cat] ?? 0
  );

  // 어떤 축을 강조할지 (dominantCategory 기준)
  const radarHighlightIndex = Math.max(
    0,
    CATEGORY_ORDER.findIndex((cat) => cat === dominantCategory)
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 페이지 컨테이너: iPhone 프레임 393px */}
      <div className="mx-auto w-full max-w-[393px] pb-[86px]">
        {/* 상단 헤더 영역 (화이트 배경) */}
        <div className="bg-white">
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
                {consecutiveDays}일
              </span>
            </div>

            {/* 달력 카드 */}
            <div className="flex justify-center">
              <div className="w-[394px]">
                <Calender
                  answeredDates={answeredDates}
                  onMarkedDayClick={(dateStr, _dateObj, { isWeekend }) => {
                    if (isWeekend) {
                      //주말에 도장이 찍힌 날 → weekendInsightPage
                      navigate("/weekend", {
                        state: { date: dateStr },
                      });
                    } else {
                      //평일에 도장이 찍힌 날 → 평일 인사이트 페이지
                      navigate("/weekday", {
                        state: { date: dateStr },
                      });
                    }
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
                {displayName}님의 연속 답변일은 {streakDays}일!
              </p>
              <p className="typ-b5">
                <span className="font-semibold text-neutral-900">
                  상위 {topPercent}%
                </span>
                <span className="text-neutral-650">예요</span>
              </p>
            </section>

            {/* 타입 + 레이더 차트 카드 */}
            <section className="bg-white rounded-[10px] border-b border-neutral-50 px-5 pt-5 pb-6">
              <p className="typ-b5 text-neutral-650">
                <span>{displayName}님은 </span>
                <span className="font-semibold text-neutral-900">{dominantCategory}</span>
                <span> 타입!</span>
                <br />
                <span>이번 달 {dominantCategory} 질문에 가장 많은 답변을 했어요</span>
              </p>

              <div className="mt-6 flex justify-center">
                <ReportMap 
                  className="-mt-2"
                  values={radarValues}
                  labels={CATEGORY_ORDER}
                  highlightIndex={radarHighlightIndex} 
                />
              </div>
            </section>

            {/* AI 피드백 */}
            <section className="space-y-2 pb-4">
              <h2 className="typ-b5 font-medium text-neutral-700">AI 피드백</h2>
              <div className="bg-white rounded-[10px] border-b border-neutral-50 px-5 py-4">
                <p className="typ-b5 text-neutral-650">
                 {feedback}
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
