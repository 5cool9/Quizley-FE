// src/component/communiAnalyzePop.tsx
import React from "react";
import BtnShort from "./btnShort";

type CommuniAnalyzePopProps = {
  open: boolean;                          // 팝업 표시
  title?: string;                         // 타이틀
  description?: React.ReactNode;          // 설명(줄바꿈 허용)
  confirmText?: string;                   // 확인 버튼 라벨
  cancelText?: string;                    // 취소 버튼 라벨
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function CommuniAnalyzePop({
  open,
  title = "대화를 분석하시겠습니까?",
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: CommuniAnalyzePopProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center bg-black/30"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      {/* 카드 */}
      <div
        className="w-[320px] bg-white rounded-[10px] p-5 inline-flex flex-col gap-7 shadow-[0_10px_60px_rgba(0,0,0,0.10)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 타이틀 & 설명 */}
        <div className="w-full flex flex-col items-center gap-2">
          <h2 className="text-[20px] font-bold text-neutral-900 text-center">
            {title}
          </h2>

          <div className="w-[267px] text-center text-[14px] text-neutral-650">
            {description ?? (
              <p>
                입력하신 대화 내용을 기반으로 <br />
                사고 요약과 피드백을 제공합니다.
              </p>
            )}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="grid grid-cols-2 gap-2">
          <BtnShort label={cancelText} variant="cancel" onClick={onCancel} />
          <BtnShort label={confirmText} variant="confirm" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}
