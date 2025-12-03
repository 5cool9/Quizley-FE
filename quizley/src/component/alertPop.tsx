// src/component/alertPop.tsx
import React from "react";
import BtnShort from "./btnShort";

type SimpleAlertPopProps = {
  open: boolean;               // 팝업 표시
  title: string;               // 타이틀
  confirmText?: string;        // 확인 버튼 라벨
  onConfirm?: () => void;
};

export default function SimpleAlertPop({
  open,
  title,
  confirmText = "확인",
  onConfirm,
}: SimpleAlertPopProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center bg-black/70"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-[310px] bg-white rounded-[10px] p-5 inline-flex flex-col gap-7 shadow-[0_10px_60px_rgba(0,0,0,0.10)]"
      >
        {/* 타이틀 */}
        <h2 className="text-[15px] font-semibold text-neutral-800 text-center whitespace-pre-line">
          {title}
        </h2>

        {/* 확인 버튼 */}
        <div className="grid gap-2">
          <BtnShort label={confirmText} variant="confirm" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}
