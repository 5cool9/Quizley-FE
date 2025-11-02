// src/component/calenderPop.tsx
import React, { useMemo } from "react";

/** 달력 유틸 */
function getMonthMatrix(year: number, monthZeroBase: number) {
  // monthZeroBase: 0=Jan
  const firstDay = new Date(year, monthZeroBase, 1);
  const firstWeekday = firstDay.getDay(); // 0=Sun
  const lastDate = new Date(year, monthZeroBase + 1, 0).getDate();

  const cells: (number | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= lastDate; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // 2D(주 단위)로 변환
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

type CalendarPopProps = {
  year?: number;          // 기본 2025
  monthZeroBase?: number; // 기본 5 (June)
  selected?: number;      // 선택 일자 (기본 6)
  onPrev?: () => void;
  onNext?: () => void;
  onSelect?: (day: number) => void;
};

export default function CalendarPop({
  year = 2025,
  monthZeroBase = 5,
  selected = 6,
  onPrev,
  onNext,
  onSelect,
}: CalendarPopProps) {
  const monthName = useMemo(
    () =>
      new Date(year, monthZeroBase, 1).toLocaleString("en-US", {
        month: "long",
      }),
    [year, monthZeroBase]
  );

  const weeks = useMemo(
    () => getMonthMatrix(year, monthZeroBase),
    [year, monthZeroBase]
  );

  return (
    <div
      className="relative w-[357px] h-[364px] bg-white rounded-[13px] shadow-[0_10px_60px_rgba(0,0,0,0.10)]"
      data-dark-mode="False"
    >
      {/* Header */}
      <div className="absolute left-4 top-4 w-[325px] h-[44px] px-0 py-[7px] inline-flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-black text-[17px] leading-[22px] font-semibold">
            {monthName} {year}
          </span>
          {/* 제목 우측 작은 화살표 */}
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-primary-700">
            <path d="M3.5 1.5 L8.5 6 L3.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* 우측 prev/next (정사각형 아이콘) */}
        <div className="w-[51px] flex items-center justify-between">
        <button aria-label="prev" onClick={onPrev} className="grid place-items-center w-[18px] h-[18px]">
            <svg width="20" height="20" viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet" className="text-primary-700">
            <path d="M12 4 L7 10 L12 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
        <button aria-label="next" onClick={onNext} className="grid place-items-center w-[18px] h-[18px]">
            <svg width="20" height="20" viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet" className="text-primary-700">
            <path d="M8 4 L13 10 L8 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
        </div>
      </div>

      {/* Days of week */}
      <div
        className="absolute left-4 top-[62px] inline-flex w-[325px] justify-between"
        data-type="Days of Week"
      >
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <div
            key={d}
            className="w-[32px] text-center text-[13px] leading-[18px] font-semibold"
            style={{ color: "rgba(60,60,67,0.30)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="absolute left-4 top-[85px] w-[325px]">
        <div className="flex flex-col gap-[10px]">
          {weeks.map((wk, wi) => (
            <div key={wi} className="flex justify-between">
              {wk.map((day, di) => {
                const isSelected = day !== null && day === selected;
                return (
                  <button
                    key={`${wi}-${di}`}
                    className="relative w-10 h-10"
                    disabled={day === null}
                    onClick={() => day && onSelect?.(day)}
                  >
                    {/* 선택 원 */}
                    {isSelected && (
                      <span className="absolute inset-0 rounded-full bg-primary-700/90 pointer-events-none" />
                    )}
                    <span
                      className={`absolute left-0 top-[8px] w-10 text-center flex justify-center ${
                        isSelected
                          ? "text-white font-semibold"
                          : "text-black"
                      } text-[20px] leading-[25px] tracking-[0.38px]`}
                    >
                      {day ?? ""}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
