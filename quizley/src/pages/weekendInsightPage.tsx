// src/pages/weekendInsightPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../component/header";
import WeekendGameResult from "../component/weekendGameResult";
import TabBar from "../component/tabbar";
import TrashIcon from "../assets/icon/icon_trash.svg";
import {
  getInsightRecord,
  deleteInsightRecord,
  type InsightRecordItem,
} from "../api/insightRecord";

type LocationState = {
  date: string; // "YYYY-MM-DD"
};

export default function WeekendInsightPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { date } = (state || {}) as LocationState;

  const [menuOpen, setMenuOpen] = useState(false);
  const [record, setRecord] = useState<InsightRecordItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 날짜 없으면 바로 뒤로
  useEffect(() => {
    if (!date) {
      alert("날짜 정보가 없습니다. 다시 시도해 주세요.");
      navigate(-1);
    }
  }, [date, navigate]);

  // 인사이트 조회
  useEffect(() => {
    if (!date) return;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const data = await getInsightRecord(date);
        // 하루에 하나라고 가정하고 첫 번째만 사용
        setRecord(data[0] ?? null);
      } catch (err: any) {
        console.error("오늘의 인사이트 조회 실패:", err);
        setErrorMsg(err?.message ?? "인사이트를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [date]);

  // 삭제
  const handleDeleteClick = async () => {
    if (!date) return;
    const ok = window.confirm("이 날의 인사이트 기록을 삭제할까요?");
    if (!ok) return;

    try {
      await deleteInsightRecord(date);
      alert("기록이 삭제되었습니다.");
      setMenuOpen(false);
      navigate(-1);
    } catch (err: any) {
      console.error("인사이트 삭제 실패:", err);
      alert(err?.message ?? "삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // "2025-01-11" → "2025. 01. 11. (토)"
  const formattedDate = useMemo(() => {
    if (!date) return "";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return date;

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const day = weekdays[d.getDay()];
    return `${y}. ${m}. ${dd}. (${day})`;
  }, [date]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* iPhone 프레임 */}
      <div className="mx-auto w-full max-w-[394px] bg-neutral-50 pb-[86px] relative">
        {/* 상단 헤더 */}
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

        {/* 메뉴 팝업 */}
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
          <p className="text-[16px] text-neutral-650">{formattedDate}</p>
        </section>

        {/* 로딩 / 에러 */}
        {loading && (
          <p className="px-5 mt-4 text-[14px] text-neutral-500">
            인사이트를 불러오는 중입니다...
          </p>
        )}
        {errorMsg && !loading && (
          <p className="px-5 mt-4 text-[14px] text-red-500">{errorMsg}</p>
        )}

        {/* 밸런스 게임 결과 카드 */}
        <div className="mt-5 px-5">
          <WeekendGameResult />
        </div>

        {/* 내 투표 / 생각 카드 */}
        <section className="mt-6 px-5">
          <div className="bg-white rounded-[10px] px-5 py-4">
            <div className="bg-neutral-50 rounded-[10px] px-5 py-4">
              <p className="text-[16px] text-neutral-650 whitespace-pre-line">
                {record
                  ? `투표 : (API 붙이면 실제 값)\n생각 : ${
                      record.summary ?? "요약이 없습니다."
                    }`
                  : "기록을 불러오는 중입니다."}
              </p>
            </div>
          </div>
        </section>

        {/* 다른 유저의 생각 TOP3 – 지금은 더미 데이터 */}
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
