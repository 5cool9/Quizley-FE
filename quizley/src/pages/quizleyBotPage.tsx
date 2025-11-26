// src/pages/quizleyBotPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import LeftIcon from "../assets/icon/icon_left.svg";
import ChatBubble from "../component/chatBubble";
import InputAnswer from "../component/inputAnswer";
import CommuniAnalyzePop from "../component/communiAnalyzePop";

export default function QuizleyBotPage() {
  const navigate = useNavigate();
  const { category } = useParams();
  const location = useLocation();

  const question = location.state?.question || "질문이 없습니다.";
  const answer = location.state?.answer || "";
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; timeText?: string }[]>([]);
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

  const handleSend = () => {
    if (!userInput.trim()) return;
    const newMessage = { text: userInput, timeText: "오전 10:03" };
    setMessages([...messages, newMessage]);
    setUserInput("");
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
      {/* iPhone 프레임 */}
      <div className="mx-auto w-full max-w-[394px] bg-neutral-50 pb-[86px] relative">

        {/* 상단 헤더 */}
        <div className="bg-white pb-5">
          <div className="pt-9">
            {/* 헤더 */}
            <div className="relative w-full px-5 flex items-center py-3">

              {/* 왼쪽: 뒤로가기 아이콘 */}
              <button onClick={() => navigate(-1)} className="absolute left-5">
                <img src={LeftIcon} alt="뒤로가기" className="w-6 h-6" />
              </button>

              {/* 중앙 타이틀 */}
              <div className="absolute left-1/2 -translate-x-1/2 typ-h3 text-neutral-900 font-medium">
                퀴즐리봇
              </div>

              {/* 오른쪽: 대화 분석 버튼 */}
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
          {/* 선택한 카테고리 */}
          <div className="typ-b7 text-primary-700">
            {categoryLabel}
          </div>

          {/* Today’s Quiz */}
          <p
            className="font-pretendard font-bold text-[28px] leading-[100%] mt-2"
            style={{ fontWeight: 700 }}
          >
            Today's Quiz
          </p>

          {/* 날짜 자동 생성 */}
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
          {/* AI 버블 - 첫 질문 */}
          <ChatBubble 
            role="ai" 
            text={question} 
            timeText="오전 10:01"
          />

          {/* 사용자 버블 - 홈에서 넘어온 답변 */}
          {answer && (
            <ChatBubble 
              role="user" 
              text={answer} 
              timeText="오전 10:02"
            />
          )}

          {/* 사용자가 입력한 메시지 */}
          {messages.map((msg, idx) => (
            <ChatBubble
              key={idx}
              role="user"
              text={msg.text}
              timeText={msg.timeText}
            />
          ))}
          <div ref={messagesEndRef} />

        </div>

        {/* 하단 입력창 */}
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
            state: {
                messages: messages,
                category: category,
            }
          })
          setOpenAnalyzePop(false);
        }}
      />

      </div>
    </div>
  );
}
