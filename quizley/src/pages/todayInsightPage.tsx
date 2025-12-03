// src/pages/todayInsightPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import TabBar from "../component/tabbar";
import Header from "../component/header";
import BtnLong from "../component/btnLong";
import PostCompletePop from "../component/postCompletePop";
import ShareCommunityPop from "../component/shareCommunityPop";
import { getChatSummary } from "../api/chatSummary";
import { completeChatComment } from "../api/chat";
import { shareTodayInsightComment } from "../api/communityApi";
import { useLevel } from "../context/LevelCotext";
import AlertPop from "../component/alertPop";

export default function TodayInsightPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { category, id } = useParams();
  const { state } = useLocation();
  const [completedCategories, setCompletedCategories] = useState<Record<string, boolean>>({
  mystery: false,
  science: false,
  literature: false,
  art: false,
  history: false,
  psychology: false,
});
  const [showPopup, setShowPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const chatId = state?.chatId;
  const [quizId, setQuizId] = useState<number | null>(null);

  const categoryNames: Record<string, string> = {
    mystery: "🕵🏻‍♂️ 미스터리",
    science: "🧬 과학",
    literature: "📚 문학",
    art: "🎨 예술",
    history: "⏳ 역사",
    psychology: "❤️‍🔥 심리",
  };

  const defaultSummary = "";

  const categoryLabel = categoryNames[category ?? ""] || "카테고리";

  const [summary, setSummary] = useState("");
  const [feedback, setFeedback] = useState("");
  const [topComments, setTopComments] = useState<
    { commentId: number; comment: string }[]
  >([]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const isCompleted = category ? completedCategories[category] : false;
  const { updateLevel } = useLevel();

  // 요약 수정 후 뒤로 돌아올 때 반영
  useEffect(() => {
    if (state?.editedSummary) {
      setSummary(state.editedSummary);
    }
  }, [state]);

  // API 연결: chatId 있을 때 요약, 피드백, 탑3 댓글 가져오기
  useEffect(() => {
  if (!chatId) return;

  const fetchSummary = async () => {
    try {
      const res = await getChatSummary(chatId);

      if (Array.isArray(res) && res.length > 0) {
        const first = res[0];
        setSummary(first.summary);
        setFeedback(first.feedback);
        setTopComments(first.topCommentDtoList || []);
        setQuizId(first.quizId);
      } else if (res) {
        setSummary(res.summary);
        setFeedback(res.feedback);
        setTopComments(res.topCommentDtoList || []);
        setQuizId(res.quizId);
      }
    } catch (err) {
      console.error("요약 불러오기 실패:", err);
    }
  };

  fetchSummary();
}, [chatId]);


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

            <div className="relative mx-auto mt-3 py-5 bg-white flex flex-col">
              {/* 요약 */}
              <div className="px-5 flex justify-between items-center">
                <p className="typ-b6 text-neutral-650">퀴즐리봇 요약</p>
                {!isCompleted && (
                  <p
                    className="typ-b4 text-neutral-400"
                    onClick={() =>
                      navigate(`/analyze/${category}/edit`, {
                        state: { summary, chatId },
                      })
                    }
                  >
                    수정
                  </p>
                )}
              </div>

              {/* 회색 박스 */}
              <div className="mt-2 px-5">
                <div
                  className="w-full rounded-xl bg-neutral-50 py-[20px] px-[20px] text-neutral-650 font-pretendard text-[16px]"
                  style={{ fontWeight: 400 }}
                >
                  {summary || "요약을 불러오는 중입니다..."}
                </div>
              </div>

              {/* 피드백 */}
              <div className="mt-5 px-5 flex justify-between items-center">
                <p className="typ-b6 text-neutral-650">퀴즐리봇 피드백</p>
              </div>

              <div className="mt-2 px-5">
                <div className="w-full rounded-xl bg-neutral-50 py-[20px] px-[20px] text-neutral-650 font-pretendard text-[16px]">
                  {feedback || "피드백을 불러오는 중입니다..."}
                </div>
              </div>
            </div>
          </div>

          {/* 유저의 생각 TOP3 */}
          <div className="mt-5 px-5 flex justify-between items-center">
            <p className="typ-b6 text-neutral-650">다른 유저의 생각 TOP3</p>
            <p className="typ-b4 text-neutral-400" onClick={() => navigate(`/community/today/${quizId}`)}>
              더보기
            </p>
          </div>

          {/* API에서 반환된 topCommentDtoList 3개 렌더링 */}
          {topComments.slice(0, 3).map((c) => (
            <div key={c.commentId} className="mt-2 px-5">
              <div className="w-full rounded-xl bg-white py-[19px] px-[20px] text-neutral-650 font-pretendard text-[16px]">
                {c.comment}
              </div>
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div className="fixed inset-x-0 bottom-[110px] mx-auto w-full max-w-[393px] px-5">
          <BtnLong
            label={isCompleted ? "내 답변 커뮤니티에 공유하기" : "답변 완료하기"}
            onClick={() => {
              if (!isCompleted) {
                setShowPopup(true); // 팝업만 띄움
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
          onConfirm={async () => {
            if (!chatId) return;
            try {
              const res = await completeChatComment(chatId); 
            
              setCompletedCategories(prev => ({ ...prev, [category!]: true })); // 카테고리별 완료 처리
              setShowPopup(false);

              if (res.levelUp) {
                updateLevel(res.levelUp.currentLevel); // LevelContext 업데이트 -> 팝업 자동 등장
              }
            } catch (err) {
              console.error("답변 등록 실패:", err);
              setAlertMessage("답변 등록에 실패했습니다. 다시 시도해주세요.");
              setAlertOpen(true);
            }
          }}
        />

        <ShareCommunityPop
        open={showSharePopup}
        onCancel={() => setShowSharePopup(false)}
        onConfirm={async (anonymous) => {
          if (!chatId) return;
          try {
            await shareTodayInsightComment({
              chatId,
              commentAnonymous: true, // 공개 여부
              writerAnonymous: anonymous, // 팝업에서 체크한 값
              });
              setAlertMessage("커뮤니티에 공유되었습니다!");
              setAlertOpen(true);
              setShowSharePopup(false);
            } catch (err) {
              console.error(err);
              setAlertMessage("공유에 실패했습니다. 다시 시도해주세요.");
              setAlertOpen(true);
            }
            }}
            />
      </div>
      <AlertPop
        open={alertOpen}
        title={alertMessage}
        onConfirm={() => setAlertOpen(false)}
      />
    </div>
  );
}