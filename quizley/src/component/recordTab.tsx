// src/component/recordTab.tsx
import React from "react";

type TabType = "calendar" | "report";

type Props = {
  tab: TabType;
  onChange: (tab: TabType) => void;
};

export default function RecordTab({ tab, onChange }: Props) {
  return (
    // 기존과 동일하게: mt-4 + bg-white 래퍼 유지
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

        {/* 탭 버튼 – 레이아웃 그대로 */}
        <div className="flex justify-center gap-40 px-5">
          <button
            type="button"
            onClick={() => onChange("calendar")}
            className={`pb-2 text-[18px] font-semibold ${
              tab === "calendar" ? "text-neutral-900" : "text-neutral-400"
            }`}
          >
            캘린더
          </button>
          <button
            type="button"
            onClick={() => onChange("report")}
            className={`pb-2 text-[18px] font-semibold ${
              tab === "report" ? "text-neutral-900" : "text-neutral-400"
            }`}
          >
            리포트
          </button>
        </div>
      </div>
    </div>
  );
}
