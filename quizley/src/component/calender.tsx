// src/component/calender.tsx
import React, { useMemo, useState } from "react";
import CheckIcon from "../assets/icon/calendar_check.png";

const GRID_LEFT_BASE = 35;
const COL_GAP = 47.5;
const ROW_TOPS = [87, 133, 179, 225, 271];

const ICON_LEFT_OFFSET = -1;
const ICON_TOP_OFFSET = 2;

const ICON_BOX_W = 50;
const ICON_BOX_H = 50;
const ICON_INNER_W = 33.33;
const ICON_INNER_H = 41.67;
const ICON_INNER_LEFT = 4.11;
const ICON_INNER_TOP = 0.94;

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function firstDayWeek(y: number, m: number) {
  return new Date(y, m, 1).getDay();
}

// "YYYY-MM-DD" → {year, month(0-base), day}
function parseYMD(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}

type CalenderProps = {
  answeredDates?: string[];          // API에서 받은 날짜 배열
  onWeekendClick?: (date: Date) => void;
  onMarkedDayClick?: (
    dateStr: string,
    dateObj: Date,
    meta: { isWeekend: boolean }
  ) => void;
};

export default function Calender({
  answeredDates = [],
  onWeekendClick,
  onMarkedDayClick, 
}: CalenderProps) {
  const [view, setView] = useState(() => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
});
  const year = view.getFullYear();
  const month = view.getMonth();

  // 연/월에 해당하는 '응답한 날짜들(day 숫자)'
  const markedDays = useMemo(() => {
    return answeredDates
      .map(parseYMD)
      .filter((d) => d.year === year && d.month === month)
      .map((d) => d.day);
  }, [answeredDates, year, month]);

  const markedSet = useMemo(() => new Set(markedDays), [markedDays]);

  // 가장 최근에 응답한 날짜를 강조(없으면 undefined)
  const highlightDay = useMemo(
    () => (markedDays.length ? Math.max(...markedDays) : undefined),
    [markedDays]
  );

  const totalDays = daysInMonth(year, month);
  const firstW = firstDayWeek(year, month);

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date(year, month, 1));

  const goPrev = () => setView(new Date(year, month - 1, 1));
  const goNext = () => setView(new Date(year, month + 1, 1));

  const getCellLeft = (col: number) => GRID_LEFT_BASE + COL_GAP * col;
  const getCellTop = (row: number) => ROW_TOPS[row];
  const getRC = (n: number) => {
    const idx = firstW + (n - 1);
    return { row: Math.floor(idx / 7), col: idx % 7 };
  };

  return (
    <div className="relative w-[393px] h-[345px] bg-white overflow-hidden">
      {/* 헤더 */}
      <div className="absolute left-[35px] top-[18px] h-[44px] w-[325px]">
        <div className="absolute left-0 top-[11px] flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="previous month"
            className="grid place-items-center w-5 h-5"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className="text-primary-700"
            >
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
          <span className="text-black text-[17px] leading-[22px] font-semibold">
            {monthName} {year}
          </span>
          <button
            type="button"
            onClick={goNext}
            aria-label="next month"
            className="grid place-items-center w-5 h-5"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className="text-primary-700"
            >
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

      {/* 요일 */}
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

      {/* 날짜 */}
      {Array.from({ length: totalDays }, (_, k) => k + 1).map((n) => {
        const { row, col } = getRC(n);
        if (row > 4) return null;

        const left = getCellLeft(col);
        const top = getCellTop(row);
        const isHL = highlightDay === n;

        const dateObj = new Date(year, month, n);
        const day = dateObj.getDay();
        const isWeekend = day === 0 || day === 6;

        const isMarked = markedSet.has(n);

        const handleClick = () => {
          if (isMarked && onMarkedDayClick) {
            const mm = String(month + 1).padStart(2, "0");
            const dd = String(n).padStart(2, "0");
            const ymd = `${year}-${mm}-${dd}`;
            onMarkedDayClick(ymd, dateObj, { isWeekend });
            return;
          }
        };

        return (
          <div
            key={n}
            className={`absolute w-10 h-10 ${
              isWeekend ? "cursor-pointer" : ""
            }`}
            style={{ left, top }}
            onClick={handleClick}
          >
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

      {/* 전구 아이콘 (응답한 날짜들) */}
      {markedDays.map((n) => {
        if (n < 1 || n > totalDays) return null;
        const { row, col } = getRC(n);
        if (row > 4) return null;

        const left = getCellLeft(col) + ICON_LEFT_OFFSET;
        const top = getCellTop(row) + ICON_TOP_OFFSET;

        return (
          <div
            key={`ic-${n}`}
            className="absolute overflow-hidden pointer-events-none"
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
