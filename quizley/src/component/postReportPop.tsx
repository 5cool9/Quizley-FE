// src/component/deleteInsightPop.tsx
import React from "react";
import BtnShort from "./btnShort";
import IconCaution from "../assets/icon/icon_caution.svg";

type DeleteInsightPopProps = {
  open: boolean;
  title?: string;              // 기본: "댓글을 신고하시겠습니끼?"
  description?: React.ReactNode; 
  confirmText?: string;        // 기본: "확인"
  cancelText?: string;         // 기본: "취소"
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function DeleteInsightPop({
  open,
  title = "게시물을 신고하시겠습니까?",
  description,
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
        className="w-[320px] bg-white rounded-[10px] p-5 inline-flex flex-col items-center gap-4 shadow-[0_10px_60px_rgba(0,0,0,0.10)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 아이콘 */}
        <img src={IconCaution} alt="caution" className="w-[60px] h-[60px] select-none" />

        {/* 텍스트 */}
        <div className="w-full flex flex-col items-center gap-7">
          <div className="w-[267px] flex flex-col items-center gap-2">
            <h2 className="text-[20px] font-bold text-neutral-900 text-center">
              {/* '삭제'만 강조 색상 */}
              {title.split("신고").length === 2 ? (
                <>
                  {title.split("신고")[0]}
                  <span className="text-[#FF4F4F]">신고</span>
                  {title.split("신고")[1]}
                </>
              ) : (
                title
              )}
            </h2>
            <div className="text-[14px] text-neutral-650 text-center">
                {description ?? (
                <p>
                    신고가 접수되면 운영팀이 검토 후 조치합니다.<br/>
                    허위 신고 시 서비스 이용이 제한될 수 있습니다.
                </p>
                )}
            </div>
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
