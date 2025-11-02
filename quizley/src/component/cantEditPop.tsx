// src/component/deleteInsightPop.tsx
import React from "react";
import IconCaution from "../assets/icon/icon_caution.svg";

type DeleteInsightPopProps = {
  open: boolean;
  title?: string;              // 기본: "댓글을 신고하시겠습니끼?"
  message?: string; 
  confirmText?: string;        // 기본: "확인"
  cancelText?: string;         // 기본: "취소"
  onConfirm?: () => void;
};

export default function DeleteInsightPop({
  open,
  title = "게시물을 수정할 수 없습니다.",
  message = "댓글이 달린 후에는 내용을 수정할 수 없어요.",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
}: DeleteInsightPopProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center bg-black/30"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-[320px] bg-white rounded-[10px] p-5 inline-flex flex-col items-center gap-4 shadow-[0_10px_60px_rgba(0,0,0,0.10)]"
      >
        {/* 아이콘 */}
        <img src={IconCaution} alt="caution" className="w-[60px] h-[60px] select-none" />

        {/* 텍스트 */}
        <div className="w-full flex flex-col items-center gap-7">
          <div className="w-[267px] flex flex-col items-center gap-1">
            <h2 className="text-[20px] font-bold text-neutral-900 text-center">
                {title}
            </h2>
            <div className="text-[14px] text-neutral-650 text-center">
                {message}
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
