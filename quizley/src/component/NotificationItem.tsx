// src/component/NotificationItem.tsx
import React from "react";

type NotificationItemProps = {
  notificationId: number;
  type: "STORY" | "EVENING" | "MORNING" | "COMMENT";
  message: string;
  createdAt: string;
  isRead: boolean;
  onClick?: () => void;
};

export default function NotificationItem({
  type,
  message,
  createdAt,
  isRead,
  onClick,
}: NotificationItemProps) {
  const iconMap: Record<string, string> = {
    STORY: "⏰",
    EVENING: "✍️",
    MORNING: "🔥",
    COMMENT: "✏️",
  };

  const titleMap: Record<string, string> = {
    STORY: "[1년 전 퀴즈] 새로운 답을 고민해볼까요?",
    MORNING: "[연속학습 8일차] 오늘의 동기부여",
    EVENING: "[연속학습 8일차] 기록이 깨질 수도 있어요!",
    COMMENT: "[김슈니님이 만든 질문] 새로운 댓글이 달렸어요",
  };

  const title = titleMap[type];
  const isComment = type === "COMMENT";

  return (
    <div>
      {/* 알림 본문 */}
      <div
        className="flex items-start gap-2 p-4 cursor-pointer hover:bg-gray-50"
        style={{ backgroundColor: isRead ? "#FFFFFF" : "#F5F4FF" }}
        onClick={onClick}
      >
        <span
          className={`w-8 h-8 flex items-center justify-center text-xl flex-shrink-0 ${
            isComment ? "scale-x-[-1]" : ""
          }`}
        >
          {iconMap[type]}
        </span>

        <div className="flex-1">
          <p className="typ-b7" style={{ color: "#000000" }}>{title}</p>
          <p className="mt-1" style={{ color: "#4A4A4A", fontSize: "14px", fontWeight: 400 }}>{message}</p>
          <p className="typ-b1 mt-2" style={{ color: "#B8B8B8" }}>{createdAt}</p>
        </div>
      </div>

      {/* 커스텀 분리선 */}
      <div className="mx-10" style={{ height: "0.5px", backgroundColor: "#DDDDDD" }} />
    </div>
  );
}
