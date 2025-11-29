import React, { useEffect, useState } from "react";
import Header from "../component/header";
import NotificationItem from "../component/NotificationItem";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../api/notifications"; 
import type { Notification } from "../api/notifications";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  // 로컬스토리지에서 읽음 상태 불러오기
  const getReadList = () => {
    const saved = localStorage.getItem("readNotifications");
    return saved ? JSON.parse(saved) : [];
  };

  const saveReadList = (list: number[]) => {
    localStorage.setItem("readNotifications", JSON.stringify(list));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getNotifications();

        const readList = getReadList();

        // ✅ 백엔드 데이터 + 로컬 읽음 상태 결합
        const merged = data.map((n) => ({
          ...n,
          isRead: n.isRead || readList.includes(n.notificationId),
        }));

        setNotifications(merged);
      } catch (err) {
        console.error("알림 불러오기 실패:", err);
      }
    }

    fetchData();
  }, []);

  const handleClick = (id: number) => {
    // 화면에서 읽음 표시
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === id ? { ...n, isRead: true } : n
      )
    );

    // 로컬에 읽음 저장
    const readList = getReadList();
    if (!readList.includes(id)) {
      saveReadList([...readList, id]);
    }
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
