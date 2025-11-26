// src/pages/todayInsightPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import TabBar from "../component/tabbar";
import Header from "../component/header";
import BtnLong from "../component/btnLong";
import PostCompletePop from "../component/postCompletePop";
import ShareCommunityPop from "../component/shareCommunityPop";

export default function TodayInsightPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { category, id } = useParams();
  const { state } = useLocation();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const categoryNames: Record<string, string> = {
    mystery: "🕵🏻‍♂️ 미스터리",
    science: "🧬 과학",
    literature: "📚 문학",
    art: "🎨 예술",
    history: "⏳ 역사",
    psychology: "❤️‍🔥 심리",
  };

  // 더미 데이터 (API 연결 전까지 사용)
  const defaultSummary =
    "공중에 떠다니는 스크린은 사람들이 손에 들지 않아도 되기 때문에 편리함을 높일 수 있다고 생각했습니다.";


  const categoryLabel = categoryNames[category ?? ""] || "카테고리";
  const [summary, setSummary] = useState(
    state?.summary || state?.editedSummary || defaultSummary
  );

  useEffect(() => {
    if (state?.editedSummary) {
      setSummary(state.editedSummary);
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="relative mx-auto w-full max-w-[393px] min-h-screen bg-neutral-50 flex flex-col">

        <div className="flex-1 overflow-y-auto pb-[180px]">
         <div className="bg-white">
          <div className="relative mx-auto pt-8 bg-white flex flex-col">
            <Header
              title="오늘의 인사이트"
              onBack={() => navigate(-1)}
              showMenu={false}
              className="pt-1 pb-5"
            />
          </div>

          <div className="px-5 mt-5 ">
            {/* 선택한 카테고리 */}
            <div className="typ-b7 text-primary-700">{categoryLabel}</div>

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

          <div className="relative mx-auto mt-3 py-5 bg-white flex flex-col">
              {/* 요약 */}
              <div className="px-5 flex justify-between items-center">
                <p className="typ-b6 text-neutral-650">퀴즐리봇 요약</p>
                {!isCompleted && (
                    <p
                    className="typ-b4 text-neutral-400"
                    onClick={() =>
                        navigate(`/analyze/${category}/edit`, {
                            state: { summary },
                        })
                    }
                    >
                        수정
                    </p>
                )}
              </div>

              {/* 회색 박스 */}
              <div className="mt-2 px-5">
                <div className="w-full rounded-xl bg-neutral-50 py-[20px] pr-[50px] pl-[20px] text-neutral-650 font-pretendard text-[16px]"
                style={{ fontWeight: 400 }}>
                  {summary}
                </div>
              </div>


            {/* 피드백 */}
              <div className="mt-5 px-5 flex justify-between items-center">
                <p className="typ-b6 text-neutral-650">퀴즐리봇 피드백</p>
              </div>

              {/* 회색 박스 */}
              <div className="mt-2 px-5">
                <div className="w-full rounded-xl bg-neutral-50 py-[20px] pr-[50px] pl-[20px] text-neutral-650 font-pretendard text-[16px]">
                  번뜩이는 아이디어네요!💡 <br></br>
                  반대로 생각해본다면 '접근성이 높아질수록 정보가 쉽게 노출될 수 있다'는 점도 고려해볼 수 있겠어요.<br></br>
                  (균형 잡힌 사고 패턴👍)
                </div>
              </div>
            </div>
           </div>

              
                {/* 유저의 생각 */}
                <div className="mt-5 px-5 flex justify-between items-center">
                    <p className="typ-b6 text-neutral-650">다른 유저의 생각 TOP3</p>
                    <p className="typ-b4 text-neutral-400" onClick={() => navigate(`/today/${id}`)}>더보기</p>
                </div>

                {/* 흰색 박스 */}
                <div className="mt-2 px-5">
                <div className="w-full rounded-xl bg-white py-[19px] px-[20px] text-neutral-650 font-pretendard text-[16px]">
                  손짓으로 조작하는 홀로그램이 생길 것 같아요.
                </div>
              </div>

              <div className="mt-2 px-5">
                <div className="w-full rounded-xl bg-white py-[19px] px-[20px] text-neutral-650 font-pretendard text-[16px]">
                  귀에 착용하는 미니 스크린이 나올지도?
                </div>
              </div>

              <div className="mt-2 px-5">
                <div className="w-full rounded-xl bg-white py-[19px] px-[20px] text-neutral-650 font-pretendard text-[16px]">
                  기술이 줄어드는 대신 '아날로그 복귀'가 유행할 것 같아요.
                </div>
              </div>

              </div>
            </div>

        {/* 버튼*/}
        <div className="fixed inset-x-0 bottom-[110px] mx-auto w-full max-w-[393px] px-5">
            <BtnLong
            label={isCompleted ? "내 답변 커뮤니티에 공유하기" : "답변 완료하기"}
            onClick={() => {
                if (!isCompleted) {
                    setShowPopup(true); 
                } else {
                    setShowSharePopup(true); 
                }
            }}
            />

        </div>

        {/* 탭바 */}
        <div className="fixed inset-x-0 bottom-0 bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
          <div className="mx-auto w-full max-w-[393px]">
            <TabBar active="home" />
          </div>
        </div>

        <PostCompletePop
        open={showPopup}
        onCancel={() => setShowPopup(false)}
        onConfirm={() => {
            setIsCompleted(true);
            setShowPopup(false);

            // 완료페이지 보기 위한 임시 ( 커뮤니티로 공유하기 연결 전에는 지워야함 )
            navigate("/home", {
                state: { completedCategory: category } 
            });
        }}
        />
        <ShareCommunityPop
        open={showSharePopup}
        onCancel={() => setShowSharePopup(false)}
        onConfirm={() => {
            setShowSharePopup(false);
            // 커뮤니티 공유 연결
            }}
            />
    </div>
  );
}
