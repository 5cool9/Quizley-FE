// src/component/weekendGameResult.tsx
import React from "react";

type Option = {
  label: string;
  percent: number;      // 0~100
  variant: "gray" | "primary";
};

type Props = {
  title?: string; // 예: '짜장 vs 짬뽕'
  imageUrl?: string; // 없으면 회색 박스
  options?: [Option, Option]; // 위/아래 2개 고정
  className?: string;
};

export default function WeekendGameResult({
  title = "짜장 vs 짬뽕",
  imageUrl,
  options = [
    { label: "짬뽕", percent: 30, variant: "gray" },
    { label: "짜장", percent: 70, variant: "primary" },
  ],
  className = "",
}: Props) {
  return (
    <div
      className={`w-full max-w-[360px] mx-auto rounded-[20px] bg-white overflow-hidden shadow-[0_0_4px_rgba(0,0,0,0.20)] ${className}`}
    >
      {/* 제목 */}
      <div className="pt-6 text-center">
        <h2 className="text-[22px] font-bold text-neutral-700">{title}</h2>
      </div>

      {/* 이미지 (없으면 회색 박스 대체) */}
      <div className="mt-4 flex justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="w-[132px] h-[132px] rounded-[10px] object-cover"
          />
        ) : (
          <div className="w-[132px] h-[132px] rounded-[10px] bg-neutral-300" />
        )}
      </div>

      {/* 결과 바 2개 */}
      <div className="mt-6 mb-6 space-y-4 px-6">
        {options.map((opt, idx) => (
          <BarRow key={idx} {...opt} />
        ))}
      </div>
    </div>
  );
}

function BarRow({ label, percent, variant }: Option) {
  const clBase =
    "relative h-[46px] w-full rounded-[10px] bg-neutral-50 overflow-hidden";
  const isPrimary = variant === "primary";

  // 채워지는 진행 영역
  const fillCls = isPrimary
    ? "bg-primary-300" 
    : "bg-neutral-300";

  // 좌측 라벨 색/굵기
  const labelCls = isPrimary
    ? "text-primary-700 font-medium"
    : "text-neutral-650 font-medium";

  // 우측 퍼센트 색
  const pctCls = isPrimary ? "text-primary-700" : "text-neutral-650";

  return (
    <div className={clBase} aria-label={`${label} ${percent}%`}>
      <div
        className={`${fillCls} absolute inset-y-0 left-0 rounded-[10px]`}
        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
      />
      <div className="relative z-[1] flex items-center justify-between px-6 h-full">
        <span className={`text-[16px] ${labelCls}`}>{label}</span>
        <span className={`text-[16px] ${pctCls}`}>{percent}%</span>
      </div>
    </div>
  );
}
