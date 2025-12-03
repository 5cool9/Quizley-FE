// src/pages/weekdayHomePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TabBar from "../component/tabbar";
import Category from "../component/category";
import InputAnswer from "../component/inputAnswer";
import BtnLong from "../component/btnLong";
import Logo from "../assets/img/Quizley.svg";
import BellIcon from "../assets/icon/icon_bell.svg";
import CompleteImg from "../assets/img/completeIMG.svg";
import { getTodayQuiz, QuizData } from "../api/quiz";
import { createChatRoom } from "../api/chat";
import AlertPop from "../component/alertPop";

export default function WeekdayHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // 선택된 카테고리 상태
  const [activeCategory, setActiveCategory] = useState("mystery");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const categoryMap: Record<string, string> = {
    mystery: "미스터리",
    science: "과학",
    literature: "문학",
    art: "예술",
    history: "역사",
    psychology: "심리",
  };

  // 카테고리별 답변 완료 상태
  const [completedCategories, setCompletedCategories] = useState<Record<string, boolean>>({
    mystery: false,
    science: false,
    literature: false,
    art: false,
    history: false,
    psychology: false,
  });

  // useEffect: location.state로 완료된 카테고리 체크
useEffect(() => {
  const completedCategory = location.state?.completedCategory;
  if (completedCategory && typeof completedCategory === "string") {
    setCompletedCategories(prev => ({
      ...prev,
      [completedCategory]: true, // 기존 상태는 유지하고, 단일 카테고리만 true
    }));
  }
}, [location.state]);

// useEffect: 카테고리 변경 시 퀴즈 데이터 가져오기
useEffect(() => {
  async function fetchQuiz() {
    try {
      setLoading(true);
      const res = await getTodayQuiz(categoryMap[activeCategory]); 
      setQuizData(res.data);

      console.log(`카테고리: ${activeCategory}, 서버 completed 값:`, res.data.completed);


      // 기존 상태를 그대로 유지하고, 현재 카테고리만 서버 completed 값으로 덮어쓰기
      setCompletedCategories(prev => ({
        ...prev,
        [activeCategory]: Boolean(res.data.completed),
      }));
    } finally {
      setLoading(false);
    }
  }
  fetchQuiz();
}, [activeCategory]);


  const handleSend = async () => {
    if (!quizData) return;

    try {
      // 이미 서버에서 오늘의 카테고리 답변 완료 상태라면 새 방 만들지 않도록
      if (quizData.chatId) {
        console.log("새로운 채팅방 생성 생략");
        navigate(`/chat/${activeCategory}`, {
          state: {
            question: quizData.content,
            answer: answer,
            quizId: quizData.quizId,
            chatId: quizData.chatId,
          },
        });
        setCompletedCategories(prev => ({
        ...prev,
        [activeCategory]: true,
      }));
      return;
    }
      

      // 채팅방 생성 API 호출
      const res = await createChatRoom({
        quizId: quizData.quizId,
        content: answer,
      });

      // chatId 받으면 QuizleyBotPage로 이동
      navigate(`/chat/${activeCategory}`, {
        state: {
          question: quizData.content,
          answer: answer,
          quizId: quizData.quizId,
          chatId: res.chatId,
        },
      });

    } catch (error: any) {
      console.error("채팅방 생성 실패:", error);
      setAlertMessage(error.message || "채팅방 생성 실패");
      setAlertOpen(true);
    }
  };

  const community = () => {
    navigate("/community");
  };

  return (
    <div className="min-h-screen bg-white relative pb-[86px]">
      {/* 헤더 */}
      <div className="bg-white pt-6 px-5">
        <div className="flex items-center justify-between">
          <img src={Logo} alt="logo" className="w-[85px] h-[29px]" />
          <button onClick={() => navigate("/noti")}>
            <img src={BellIcon} alt="alarm" className="w-[28px] h-[28px]" />
          </button>
        </div>
      </div>

      {/* 카테고리 영역 */}
      <div className="px-5 mt-6 overflow-x-auto whitespace-nowrap no-scrollbar">
        <Category
          activeId={activeCategory}
          onChange={(id) => setActiveCategory(id)}
        />
      </div>

      {/* Today’s Quiz + 날짜 */}
      <div className="px-5 mt-10">
        <p
          className="font-pretendard font-bold text-[28px] leading-[100%]"
          style={{ fontWeight: 700 }}
        >
          Today's Quiz
        </p>

        <p
          className="font-pretendard text-[16px] leading-[100%] mt-3 text-neutral-400"
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

      {/* 선택한 카테고리의 질문 또는 완료 이미지 + 버튼 */}
      <div className="px-5 mt-6">
        {completedCategories[activeCategory] ? (
          <div className="flex flex-col items-center">
            <img src={CompleteImg} alt="답변 완료" className="w-[220px] h-auto mb-5" />
            <BtnLong
              label="유저가 만든 퀴즈 보러 가기"
              onClick={community}
              className="w-full"
            />
          </div>
        ) : (
          <div
            style={{
              padding: "2px",
              borderRadius: "16px",
              background: "linear-gradient(90deg, #777BF9 0%, #DBB6E1 100%)",
            }}
          >
            <div className="bg-white p-[20px] rounded-[14px]">
              <p className="text-neutral-900 typ-b6">{quizData?.content}</p>
              <InputAnswer
                value={answer}
                onChange={setAnswer}
                onSend={handleSend}
                className="mt-5"
                placeholder="생각의 불을 켜볼까요? 💡"
              />
            </div>
          </div>
        )}
      </div>

      {/* 하단 탭바 */}
      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <div className="mx-auto w-full max-w-[393px]">
          <TabBar active="home" />
        </div>
      </div>
      <AlertPop
        open={alertOpen}
        title={alertMessage}
        onConfirm={() => setAlertOpen(false)}
      />
    </div>
  );
}
