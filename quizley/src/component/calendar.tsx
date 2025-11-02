// src/component/calender.tsx
import React, { useMemo, useState } from "react";
import CheckIcon from "../assets/icon/calendar_check.png";

/** 고정 좌표(피그마 기준) */
const GRID_LEFT_BASE = 35;            // 그리드의 좌측 시작(px)
const COL_GAP = 47.5;                  // 열 간격
const ROW_TOPS = [87, 133, 179, 225, 271]; // 각 주(행)의 top
// 아이콘 박스의 좌표는 숫자 셀보다 살짝 왼쪽/아래(피그마와 동일)
const ICON_LEFT_OFFSET = -1;           // 숫자 셀 좌표 대비 보정
const ICON_TOP_OFFSET = 2;

// ✅ 아이콘 내부(전구 도형) 사이즈/오프셋 — 여기만 바꾸면 크기/위치 미세조정 가능
const ICON_BOX_W = 50;
const ICON_BOX_H = 50;
const ICON_INNER_W = 33.33;
const ICON_INNER_H = 41.67;
const ICON_INNER_LEFT = 4.11;
const ICON_INNER_TOP = 0.94;

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

export default function CalenderExact() {
  // 시작: 2025-06 (피그마 동일)
  const [view, setView] = useState(() => new Date(2025, 5, 1));
  const year = view.getFullYear();
  const month = view.getMonth(); // 0-11

  // 예시: 전구 표시할 날짜(숫자 위 아이콘)
  const markedDays = useMemo<number[]>(() => [5, 6, 7, 8, 9, 10, 11, 12], [month, year]);
  const highlightDay = 13; // 보라색 숫자 강조

  const totalDays = daysInMonth(year, month);
  const firstW = firstDayWeek(year, month);

  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(year, month, 1)
  );

  const goPrev = () => setView(new Date(year, month - 1, 1));
  const goNext = () => setView(new Date(year, month + 1, 1));

  /** 셀 좌표 계산 */
  const getCellLeft = (col: number) => GRID_LEFT_BASE + COL_GAP * col;
  const getCellTop = (row: number) => ROW_TOPS[row];

  /** 날짜 n의 row/col 계산 */
  const getRC = (n: number) => {
    const idx = firstW + (n - 1); // 0-based index in grid
    const row = Math.floor(idx / 7);
    const col = idx % 7;
    return { row, col };
  };

  return (
    <div className="relative w-[394px] h-[345px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.20)] overflow-hidden rounded-none">
      {/* 헤더 */}
      <div className="absolute left-[35px] top-[18px] h-[44px] w-[325px]">
        <div className="absolute left-0 top-[11px] flex items-center gap-2">
          {/* Prev */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="previous month"
            className="grid place-items-center w-5 h-5"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" className="text-primary-700">
              <path
                d="M8.5 1.5 L3.5 6 L8.5 10.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

                {/* 제목 */}
          <span className="text-black text-[17px] leading-[22px] font-semibold">
            {monthName} {year}
          </span>

          {/* Next */}
          <button
            type="button"
            onClick={goNext}
            aria-label="next month"
            className="grid place-items-center w-5 h-5"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" className="text-primary-700">
              <path
                d="M3.5 1.5 L8.5 6 L3.5 10.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="absolute left-[35px] top-[64px] inline-flex w-[325px] justify-between">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <div
            key={d}
            className="w-[32px] text-center text-[13px] leading-[18px] font-semibold text-[rgba(60,60,67,0.30)]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 숫자 렌더 (정확 좌표) */}
      {Array.from({ length: totalDays }, (_, k) => k + 1).map((n) => {
        const { row, col } = getRC(n);
        if (row > 4) return null; // 해당 뷰 높이에 맞춰 5주까지만 노출

        const left = getCellLeft(col);
        const top = getCellTop(row);

        const isHL = n === highlightDay;

        return (
          <div key={n} className="absolute w-10 h-10" style={{ left, top }}>
            <div
              className={`absolute left-[0px] top-[8px] w-10 text-center flex justify-center ${
                isHL
                  ? "text-primary-700 font-semibold text-[22px]"
                  : "text-neutral-700 text-[20px]"
              } leading-[25px] tracking-[0.38px]`}
            >
              {n}
            </div>
          </div>
        );
      })}

      {/* 전구 아이콘(숫자 위 정확 겹침) */}
      {markedDays.map((n) => {
        if (n < 1 || n > totalDays) return null;
        const { row, col } = getRC(n);
        if (row > 4) return null;

        const left = getCellLeft(col) + ICON_LEFT_OFFSET;
        const top = getCellTop(row) + ICON_TOP_OFFSET;

        return (
          <div
            key={`ic-${n}`}
            className="absolute overflow-hidden"
            style={{ left, top, width: ICON_BOX_W, height: ICON_BOX_H }}
          >
            <div
              className="absolute"
              style={{
                left: ICON_INNER_LEFT,
                top: ICON_INNER_TOP,
                width: ICON_INNER_W,
                height: ICON_INNER_H,
                backgroundImage: `url(${CheckIcon})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "top center",
                backgroundSize: "contain",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
