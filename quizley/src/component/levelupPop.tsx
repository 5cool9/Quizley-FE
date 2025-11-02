// src/component/levelupPop.tsx
import React from "react";
import CompleteIMG from "../assets/img/levelupIMG.svg"; // completeIMG.svg 사용

type LevelUpPopProps = {
  open: boolean;
  level?: number | string;           // 표시할 레벨 (기본 21)
  title?: string;                    // 상단 타이틀 (기본 "Level Up!")
  message?: string;                  // 본문 문구 커스텀
  confirmText?: string;              // 버튼 문구 (기본 "확인")
  onConfirm?: () => void;            // 확인 클릭
};

export default function LevelUpPop({
  open,
  level = 21,
  title = "Level Up!",
  message,
  confirmText = "확인",
  onConfirm,
}: LevelUpPopProps) {
  if (!open) return null;

  const body = message ?? `축하합니다!  ${level}레벨으로 레벨업 했어요.`;

  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center bg-black/30"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-[320px] bg-white rounded-[10px] p-5 inline-flex flex-col gap-2 shadow-[0_10px_60px_rgba(0,0,0,0.10)]">
        {/* 일러스트 */}
        <div className="flex flex-col items-center">
          {/* completeIMG.svg 삽입 (정사각형 기준 88px) */}
          <img
            src={CompleteIMG}
            alt="complete"
            className="w-[87px] h-[88px] select-none"
            draggable={false}
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex flex-col items-center gap-[21px] w-full">
          <div className="w-[267px] flex flex-col items-center gap-2">
            <div className="w-full text-center text-primary-700 text-[20px] font-bold">
              {title}
            </div>
            <div className="w-full text-center text-neutral-650 text-[14px]">
              {body}
            </div>
          </div>

          {/* 확인 버튼 */}
          <div className="w-full inline-flex justify-center">
            <button
              data-type="btn_확인"
              className="flex-1 py-2 bg-primary-700 text-white text-[14px] font-medium rounded-[5px] active:opacity-90"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
