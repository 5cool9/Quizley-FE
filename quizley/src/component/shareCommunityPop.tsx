// src/component/shareCommunityPop.tsx
import React, { useEffect, useState } from "react";
import BtnShort from "./btnShort";
import IconChecked from "../assets/icon/icon_checkbox.svg";
import IconUnchecked from "../assets/icon/icon_none_checkbox.svg";

type ShareCommunityPopProps = {
  open: boolean;                          // 팝업 표시 여부
  defaultAnonymous?: boolean;             // 초기 체크 상태 (기본 true)
  onConfirm?: (anonymous: boolean) => void;
  onCancel?: () => void;
};

export default function ShareCommunityPop({
  open,
  defaultAnonymous = true,
  onConfirm,
  onCancel,
}: ShareCommunityPopProps) {
  const [anonymous, setAnonymous] = useState(defaultAnonymous);

  // 외부에서 열 때마다 초기값 반영
  useEffect(() => {
    if (open) setAnonymous(defaultAnonymous);
  }, [open, defaultAnonymous]);

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
        className="w-[320px] bg-white rounded-[10px] p-5 inline-flex flex-col gap-5 shadow-[0_10px_60px_rgba(0,0,0,0.10)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 타이틀 */}
        <h2 className="text-[20px] font-bold text-neutral-900 text-center">
          커뮤니티에 공유하시겠습니까?
        </h2>

        {/* 익명 체크 */}
        <button
          type="button"
          className="w-[294px] mx-auto inline-flex items-center justify-center gap-2 select-none"
          onClick={() => setAnonymous((v) => !v)}
          aria-pressed={anonymous}
        >
          <img
            src={anonymous ? IconChecked : IconUnchecked}
            alt={anonymous ? "checked" : "unchecked"}
            className="w-6 h-6"
            draggable={false}
          />
          <span
            className={`text-[16px] font-semibold ${
              anonymous ? "text-primary-700" : "text-neutral-650"
            }`}
          >
            익명
          </span>
        </button>

        {/* 하단 버튼 */}
        <div className="grid grid-cols-2 gap-2">
          <BtnShort label="취소" variant="cancel" onClick={onCancel} />
          <BtnShort
            label="확인"
            variant="confirm"
            onClick={() => onConfirm?.(anonymous)}
          />
        </div>
      </div>
    </div>
  );
}
