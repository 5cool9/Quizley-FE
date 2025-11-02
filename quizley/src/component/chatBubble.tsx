// src/component/chatBubble.tsx
import React from "react";
import AiProfile from "../assets/icon/ai_profile.svg";

type Props = {
  role: "ai" | "user";
  text: string;
  timeText?: string;
  className?: string;
};

export default function ChatBubble({ role, text, timeText, className = "" }: Props) {
  const isAI = role === "ai";

  // === AI 버블 (피그마 그대로) ===
  if (isAI) {
    return (
      <div className={`inline-flex flex-col items-start gap-2 ${className}`}>
        {/* 아바타 + 시간 (오른쪽에 시간) */}
        <div className="inline-flex items-end gap-2">
          <img src={AiProfile} alt="AI" className="w-6 h-[28.15px]" />
          {timeText && <span className="typ-b1 text-neutral-400">{timeText}</span>}
        </div>

        {/* 버블: top-right만 뾰족하지 않게 하고, 하단 보더 1px */}
        <div className="flex flex-col gap-3 p-4 bg-white rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px] border-b border-neutral-50">
          <p className="typ-b6 text-neutral-900 whitespace-pre-line">
            {text}
          </p>
        </div>
      </div>
    );
  }

  // === 사용자 버블 (우측, 다크) ===
  return (
    <div className={`w-full flex justify-end ${className}`}>
      <div className="inline-flex items-end gap-1">
        {timeText && <span className="typ-b1 text-neutral-400">{timeText}</span>}

        <div className="inline-flex p-4 bg-neutral-650 rounded-tl-[10px] rounded-br-[10px] rounded-bl-[10px] border-b border-neutral-50 items-center justify-center">
          <div className="flex flex-col items-end gap-3">
            <p className="typ-b6 text-neutral-white whitespace-pre-line">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}