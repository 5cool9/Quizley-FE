// src/pages/weekendHomePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TabBar from "../component/tabbar";
import Logo from "../assets/img/Quizley.svg";
import BellIcon from "../assets/icon/icon_bell.svg";
import VsIcon from "../assets/icon/icon_vs.svg";
import CompleteImg from "../assets/img/completeIMG.svg";
import BtnLong from "../component/btnLong";

export default function WeekendHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<"left" | "right" | null>(null);
  const [answer, setAnswer] = useState("");
  const isSelected = selected !== null;

  // 완료 상태 확인 (location.state로 전달)
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (location.state?.selected) {
      setSelected(location.state.selected);
      setCompleted(true);
    }
  }, [location.state]);

  const [gameData, setGameData] = useState({
    left: {
      imageUrl: "/images/sample1.jpg",
      label: "짜장"
    },
    right: {
      imageUrl: "/images/sample2.jpg",
      label: "짬뽕"
    }
  });

  const handleSend = () => {
    if (!isSelected) return;
    navigate("/weekend", { state: { selected } });
  };

  return (
    <div className="min-h-screen bg-white relative pb-[86px]">

      {/* 헤더 */}
      <div className="bg-white pt-6 px-5">
        <div className="flex items-center justify-between">
          <img src={Logo} alt="logo" className="w-[85px] h-[29px]" />
          <button onClick={() => setMenuOpen((v) => !v)}>
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
        {completed ? (
          <>
            <img src={CompleteImg} alt="답변 완료" className="w-[220px] h-auto mb-10" />
            <BtnLong
              label="유저가 만든 퀴즈 보러 가기"
              onClick={() => navigate("/community")}
              className="w-full max-w-[393px]"
            />
          </>
        ) : (
          <div className="mt-[60px] flex items-start justify-center gap-4">
            {/* 왼쪽 이미지 + 텍스트 */}
            <div className="cursor-pointer flex flex-col items-center" onClick={() => setSelected("left")}>
              <div className="w-[132px] h-[132px] bg-neutral-200 rounded-[10px] overflow-hidden">
                <img
                  src={gameData.left.imageUrl}
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
                  src={gameData.right.imageUrl}
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
        )}
      </div>

      {/* 버튼 */}
      {!completed && (
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
