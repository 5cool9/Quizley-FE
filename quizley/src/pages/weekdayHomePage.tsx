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

export default function WeekdayHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // 선택된 카테고리 상태
  const [activeCategory, setActiveCategory] = useState("mystery");

  // 카테고리별 더미 질문 텍스트
  const dummyQuestion: Record<string, string> = {
    mystery: "휴대폰이 사라진 세상에서 사람들은 어떤 도구를 발명할까? ",
    science: "🧬 과학 질문",
    literature: "📚 문학 질문",
    art: "🎨 예술 질문",
    history: "⏳ 역사 질문",
    psychology: "❤️‍🔥 심리 질문",
  };

  const [answer, setAnswer] = useState("");

  // 카테고리별 답변 완료 상태
  const [completedCategories, setCompletedCategories] = useState<Record<string, boolean>>({
    mystery: false,
    science: false,
    literature: false,
    art: false,
    history: false,
    psychology: false,
  });

  // location.state로 완료된 카테고리 체크
  useEffect(() => {
    if (location.state?.completedCategory) {
      setCompletedCategories((prev) => ({
        ...prev,
        [location.state.completedCategory]: true,
      }));
    }
  }, [location.state]);

  const handleSend = () => {
    navigate(`/chat/${activeCategory}`, {
      state: {
        question: dummyQuestion[activeCategory],
        answer: answer,
      },
    });
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
              <p className="text-neutral-900 typ-b6">{dummyQuestion[activeCategory]}</p>
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
    </div>
  );
}
