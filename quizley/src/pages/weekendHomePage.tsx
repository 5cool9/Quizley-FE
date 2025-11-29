// src/pages/weekendHomePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TabBar from "../component/tabbar";
import Logo from "../assets/img/Quizley.svg";
import BellIcon from "../assets/icon/icon_bell.svg";
import VsIcon from "../assets/icon/icon_vs.svg";
import CompleteImg from "../assets/img/completeIMG.svg";
import BtnLong from "../component/btnLong";
import { voteTodayQuiz } from "../api/balance"; 
import { getTodayQuiz, QuizOption } from "../api/quiz";

export default function WeekendHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<"left" | "right" | null>(null);
  const [answer, setAnswer] = useState("");
  const [quizId, setQuizId] = useState<number | null>(null);
  const isSelected = selected !== null;
  const [quizLoaded, setQuizLoaded] = useState(false); // 퀴즈 로딩 상태

  // 완료 상태 확인 (location.state로 전달)
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (location.state?.selected) {
      setSelected(location.state.selected);
      setCompleted(true);
    }
  }, [location.state]);

  const [gameData, setGameData] = useState<{ left: QuizOption; right: QuizOption } | null>(null);

  // 오늘의 퀴즈 조회
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getTodayQuiz("");
        const quiz = res.data;

        setQuizId(quiz.quizId);
        setCompleted(quiz.completed);

        if (quiz.options && quiz.options.length === 2) {
          const leftOption = quiz.options.find((o) => o.side === "A");
          const rightOption = quiz.options.find((o) => o.side === "B");

          if (leftOption && rightOption) {
            setGameData({ left: leftOption, right: rightOption });
          }
        }
      } catch (err) {
        console.error("오늘의 퀴즈 불러오기 실패:", err);
      } finally {
        setQuizLoaded(true); // 로딩 완료 표시
      }
    };

    fetchQuiz();
  }, []);

  const handleSend = async () => {
    if (!isSelected || !quizId) return;

    const side = selected === "left" ? "A" : "B";

    try {
      const res = await voteTodayQuiz(quizId, side);
      console.log("투표 성공", res);
      setCompleted(true);
      navigate(`/community/weekend/${quizId}`, {
      state: {
        quizId,
        selectedSide: side,
        left: gameData?.left,
        right: gameData?.right,
      },
    });
    } catch (error) {
      console.error("투표 실패:", error);
    }
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
        <div className="mt-6">
          <div className="h-[35px] px-4 py-2 rounded-[30px] inline-flex 
            items-center justify-center whitespace-nowrap
            bg-primary-700 text-white typ-b7">
            ⚡️ 주말 한정 밸런스 게임
          </div>
        </div>
      </div>

      {/* Today’s Quiz + 날짜 */}
      <div className="px-5 mt-10">
        <p className="font-pretendard font-bold text-[28px] leading-[100%]" style={{ fontWeight: 700 }}>
          Today's Quiz
        </p>
        <p className="font-pretendard text-[16px] leading-[100%] mt-3 text-neutral-400" style={{ fontWeight: 400 }}>
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

      {/* 선택 완료 시 이미지 + 버튼, 아니면 기존 선택지 */}
      <div className="px-5 mt-6 flex flex-col items-center">
        {!quizLoaded ? (
          <p></p> // 로딩 표시
        ) : completed ? (
          <>
            <img src={CompleteImg} alt="답변 완료" className="w-[220px] h-auto mb-10" />
            <BtnLong
              label="유저가 만든 퀴즈 보러 가기"
              onClick={() => navigate("/community")}
              className="w-full max-w-[393px]"
            />
          </>
        ) : gameData ? (
          <div className="mt-[60px] flex items-start justify-center gap-4">
            {/* 왼쪽 이미지 + 텍스트 */}
            <div className="cursor-pointer flex flex-col items-center" onClick={() => setSelected("left")}>
              <div className="w-[132px] h-[132px] bg-neutral-200 rounded-[10px] overflow-hidden">
                <img
                  src={gameData.left.imgUrl}
                  alt={gameData.left.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="w-[48px] h-[30px] rounded-[10px] flex items-center justify-center typ-b7 cursor-pointer text-white mt-4"
                style={{
                  background:
                    selected === "left"
                      ? "linear-gradient(90deg, #777BF9 0%, #DBB6E1 100%)"
                      : "#B3B3B3",
                }}
              >
                {gameData.left.label}
              </div>
            </div>

            {/* VS 아이콘 */}
            <div className="flex items-center justify-center h-[132px]">
              <img src={VsIcon} alt="vs" className="w-[30px] h-[32px]" />
            </div>

            {/* 오른쪽 이미지 + 텍스트 */}
            <div className="cursor-pointer flex flex-col items-center" onClick={() => setSelected("right")}>
              <div className="w-[132px] h-[132px] bg-neutral-200 rounded-[10px] overflow-hidden">
                <img
                  src={gameData.right.imgUrl}
                  alt={gameData.right.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="w-[48px] h-[30px] rounded-[10px] flex items-center justify-center typ-b7 cursor-pointer text-white mt-4"
                style={{
                  background:
                    selected === "right"
                      ? "linear-gradient(90deg, #777BF9 0%, #DBB6E1 100%)"
                      : "#B3B3B3",
                }}
              >
                {gameData.right.label}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* 버튼 */}
      {!completed && quizLoaded && (
        <div className="fixed inset-x-0 bottom-[110px] mx-auto w-full max-w-[393px] px-5">
          <button
            onClick={handleSend}
            disabled={!isSelected}
            className={`
              w-full rounded-[10px] py-[15px] flex items-center justify-center typ-b7
              transition-all duration-200
              ${isSelected
                ? "bg-[linear-gradient(90deg,#777BF9_0%,#DBB6E1_100%)] text-white"
                : "bg-neutral-400 text-white cursor-not-allowed"
              }
            `}
          >
            투표하기
          </button>
        </div>
      )}

      {/* 하단 탭바 */}
      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <div className="mx-auto w-full max-w-[393px]">
          <TabBar active="home" />
        </div>
      </div>
    </div>
  );
}
