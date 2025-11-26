// src/pages/NotificationPage.tsx
import React, { useEffect, useState } from "react";
import Header from "../component/header";
import NotificationItem from "../component/NotificationItem";
import { useNavigate } from "react-router-dom";

type Notification = {
  notificationId: number;
  type: "STORY" | "EVENING" | "MORNING" | "COMMENT";
  message: string;
  createdAt: string;
  isRead: boolean;
};

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 실제로는 API 호출
    const fetchedNotifications: Notification[] = [
      {
        notificationId: 5,
        message: "좀비 아포칼립스가 오면... 난 모르겠다!!!!!!!!!!!!!!!!!!!!!!!! 너무 어려운 질문이에요",
        type: "COMMENT",
        isRead: false,
        createdAt: "5분 전",
      },
      {
        notificationId: 4,
        message: "2024년 11월 01일에 '꿈속에서 자유롭게 살 수 있다면 현실로 돌아오고 싶을까?에 대답했었어요!",
        type: "STORY",
        isRead: false,
        createdAt: "5분 전",
      },
      {
        notificationId: 3,
        message: "기록 유지를 위해 딱 하나의 질문에 답을 입력해보세요!",
        type: "MORNING",
        isRead: false,
        createdAt: "1시간 전",
      },
      {
        notificationId: 2,
        message: "우리는 우리가 반복적으로 하는 일을 통해 정의된다. 그러므로 탁월함은 하나의 행위가 아니라 습관을 통해 빗어진다. -Aristotle",
        type: "EVENING",
        isRead: false,
        createdAt: "12시간 전",
      },
      {
        notificationId: 1,
        message: "좀비 아포칼립스가 오면... 난 모르겠다!!!!!!!!!!!!!!!!!!!!!!!! 너무 어려운 질문이에요",
        type: "COMMENT",
        isRead: false,
        createdAt: "어제",
      },
    ];
    setNotifications(fetchedNotifications);
  }, []);

  const handleClick = (id: number) => {
    // 클릭 시 읽음 처리 등 API 호출 가능
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative mx-auto pt-8 bg-white flex flex-col">
                  <Header
                    title="알림"
                    onBack={() => navigate(-1)}
                    showMenu={false}
                    className="pt-1 pb-5"
                  />
       </div>
      <div className="flex flex-col">
        {notifications.map((n) => (
          <NotificationItem
            key={n.notificationId}
            notificationId={n.notificationId}
            type={n.type}
            message={n.message}
            createdAt={n.createdAt}
            isRead={n.isRead}
            onClick={() => handleClick(n.notificationId)}
          />
        ))}
      </div>
    </div>
  );
}
