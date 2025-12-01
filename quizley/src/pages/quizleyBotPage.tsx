// src/pages/quizleyBotPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import LeftIcon from "../assets/icon/icon_left.svg";
import ChatBubble from "../component/chatBubble";
import InputAnswer from "../component/inputAnswer";
import CommuniAnalyzePop from "../component/communiAnalyzePop";
import { sendMessage, getMessages } from "../api/chat";

export default function QuizleyBotPage() {
  const navigate = useNavigate();
  const { category } = useParams();
  const location = useLocation();

  const question = location.state?.question || "질문이 없습니다.";
  const answer = location.state?.answer || "";
  const quizId = location.state?.quizId;
  const chatId = location.state?.chatId;

  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string; timeText?: string }[]
  >([]);
  const [openAnalyzePop, setOpenAnalyzePop] = useState(false);

  const categoryNames: Record<string, string> = {
    mystery: "🕵🏻‍♂️ 미스터리",
    science: "🧬 과학",
    literature: "📚 문학",
    art: "🎨 예술",
    history: "⏳ 역사",
    psychology: "❤️‍🔥 심리",
  };

  const categoryLabel = categoryNames[category ?? ""] || "카테고리";

  // 현재 시간을 한국 시간 기준으로 "오전/오후 hh:mm" 반환
const getCurrentTimeText = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Seoul",
  });
  return formatter.format(now); // 예: "오후 9:27"
};

const formatToKoreanTime = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);

  // 날짜가 Invalid일 경우
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Seoul", // 한국 시간 적용
  }).format(date);
};


  useEffect(() => {
    if (!chatId) return;

    async function loadMessages() {
      try {
        const data = await getMessages(chatId);

        const loaded = data.messages.map((m: any) => ({
          role: m.origin === "USER" ? "user" : "ai",
          text: m.message,
          timeText: m.date,
        }));

        setMessages(loaded);
      } catch (err) {
        console.error("채팅 불러오기 실패:", err);
      }
    }

    loadMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    if (!chatId) {
      console.error("chatId가 없습니다.");
      return;
    }

    const text = userInput;
    setUserInput("");

    // 사용자 메시지 반영 + 현재 시간 적용
    setMessages((prev) => [
      ...prev,
      { role: "user", text, timeText: getCurrentTimeText() },
    ]);

    try {
      const res = await sendMessage({ chatId, message: text });

      // AI 답변 추가 (서버에서 받은 시간 그대로)
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res.aiMessage.message, timeText: formatToKoreanTime(res.aiMessage.date), },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto w-full max-w-[394px] bg-neutral-50 pb-[86px] relative">
        <div className="bg-white pb-5">
          <div className="pt-9">
            <div className="relative w-full px-5 flex items-center py-3">
              <button onClick={() => navigate(-1)} className="absolute left-5">
                <img src={LeftIcon} alt="뒤로가기" className="w-6 h-6" />
              </button>

              <div className="absolute left-1/2 -translate-x-1/2 typ-h3 text-neutral-900 font-medium">
                퀴즐리봇
              </div>

              <div className="absolute right-5">
                <button
                  onClick={() => setOpenAnalyzePop(true)}
                  className="typ-b4 text-neutral-400"
                >
                  대화 분석
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="px-5 mt-7">
          <div className="typ-b7 text-primary-700">{categoryLabel}</div>

          <p
            className="font-pretendard font-bold text-[28px] leading-[100%] mt-2"
            style={{ fontWeight: 700 }}
          >
            Today's Quiz
          </p>

          <p
            className="font-pretendard text-[16px] leading-[100%] text-neutral-650 mt-2"
            style={{ fontWeight: 400 }}
          >
            {(() => {
              const today = new Date();
              const year = today.getFullYear();
              const month = String(today.getMonth() + 1).padStart(2, "0");
              const date = String(today.getDate()).padStart(2, "0");
              const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
              const day = weekdays[today.getDay()];
              return `${year}. ${month}. ${date}. (${day})`;
            })()}
          </p>
        </div>

        {/* 채팅 버블 */}
        <div className="px-5 mt-6 flex flex-col gap-6 ">
          {messages.map((msg, idx) => (
            <ChatBubble
              key={idx}
              role={msg.role}
              text={msg.text}
              timeText={msg.timeText}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
        <div className="fixed inset-x-0 bottom-0 bg-white border-t border-neutral-200 px-5 pt-3 pb-6">
          <InputAnswer
            value={userInput}
            onChange={setUserInput}
            onSend={handleSend}
            placeholder="계속 생각을 이어가볼까요?"
          />
        </div>

        <CommuniAnalyzePop
          open={openAnalyzePop}
          onCancel={() => setOpenAnalyzePop(false)}
          onConfirm={() => {
            navigate(`/analyze/${category}`, {
              state: { messages: messages, category: category, chatId },
            });
            setOpenAnalyzePop(false);
          }}
        />
      </div>
    </div>
  );
}
