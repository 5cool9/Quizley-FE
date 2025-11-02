// src/component/deleteInsightPop.tsx
import React from "react";
import BtnShort from "./btnShort";
import IconCaution from "../assets/icon/icon_caution.svg";

type DeleteInsightPopProps = {
  open: boolean;
  title?: string;              // 기본: "기록을 삭제하시겠습니까?"
  message?: string;            // 기본: "삭제된 기록은 복구할 수 없습니다."
  confirmText?: string;        // 기본: "확인"
  cancelText?: string;         // 기본: "취소"
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function DeleteInsightPop({
  open,
  title = "게시물을 삭제하시겠습니까?",
  message = "삭제된 게시글은 복구할 수 없습니다.",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: DeleteInsightPopProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center bg-black/30"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="w-[320px] bg-white rounded-[10px] p-5 inline-flex flex-col items-center gap-5 shadow-[0_10px_60px_rgba(0,0,0,0.10)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 아이콘 */}
        <img src={IconCaution} alt="caution" className="w-[60px] h-[60px] select-none" />

        {/* 텍스트 */}
        <div className="w-full flex flex-col items-center gap-5">
          <div className="w-[267px] flex flex-col items-center gap-1">
            <h2 className="text-[20px] font-bold text-neutral-900 text-center">
              {/* '삭제'만 강조 색상 */}
              {title.split("삭제").length === 2 ? (
                <>
                  {title.split("삭제")[0]}
                  <span className="text-[#FF4F4F]">삭제</span>
                  {title.split("삭제")[1]}
                </>
              ) : (
                title
              )}
            </h2>
            <p className="text-[14px] text-neutral-650 text-center">{message}</p>
          </div>

          {/* 버튼 */}
          <div className="grid grid-cols-2 gap-2 w-full">
            <BtnShort label={cancelText} variant="cancel" onClick={onCancel} />
            <BtnShort label={confirmText} variant="confirm" onClick={onConfirm} />
          </div>
        </div>
      </div>
    </div>
  );
}
