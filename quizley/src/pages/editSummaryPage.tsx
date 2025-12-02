// src/pages/editSummaryPage.tsx
import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import EditInput from "../component/answerQInput";
import Header from "../component/header";
import BtnLong from "../component/btnLong";
import { updateChatSummary } from "../api/chat";
import { postSameQuestionAnswer } from "../api/insightRecord";


export default function EditSummaryPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { category } = useParams();

  // 어디서 들어왔는지
  const from = state?.from as string | undefined; 
  const quizId = state?.quizId as number | undefined;

  // 넘겨받은 요약 텍스트와 chatId
  const originalSummary = state?.summary || "";
  const chatId = state?.chatId as number | undefined;
  const [summary, setSummary] = useState(originalSummary);
  const isEdited = summary !== originalSummary;

  // 헤더 타이틀/버튼 라벨 분기
  const headerTitle =
    from === "reportTodayInsight" ? "같은 질문에 다시 답해보기" : "퀴즐리봇 요약 수정";
  const buttonLabel =
    from === "reportTodayInsight" ? "등록하기" : "수정하기";

  // 공통 제출 핸들러
  const handleSubmit = async () => {
    if (!summary.trim()) {
      alert("내용을 입력해 주세요.");
      return;
    }

    try {
      if (from === "reportTodayInsight") {
        // 같은 질문에 다시 답해보기 플로우
        if (!quizId) {
          alert("퀴즈 정보를 찾을 수 없습니다.");
          return;
        }

        await postSameQuestionAnswer(quizId, summary); // 새 답변 저장 API

        navigate(-1);
      } else {
        // 기존 요약 수정 플로우
        if (!chatId) {
          alert("수정할 채팅 정보를 찾을 수 없습니다.");
          return;
        }

        await updateChatSummary(chatId, summary); // API 호출
        navigate(`/analyze/${category}`, {
          state: { editedSummary: summary, chatId: state?.chatId },
        });
      }
    } catch (err) {
      console.error("요청 처리 실패:", err);
      alert("요청 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[393px] flex-col">
        <div className="flex-1">
          <div className="relative mx-auto flex flex-col bg-white pt-8">
            <Header
              title={headerTitle}
              onBack={() => navigate(-1)}
              showMenu={false}
              className="pt-1 pb-5"
            />
          </div>

          {/* 수정 박스 */}
          <div className="mt-5 px-5">
            <EditInput
              value={summary}
              onChange={(v: string) => setSummary(v)}
              className={!isEdited ? "text-neutral-400" : "text-neutral-900"}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="fixed inset-x-0 bottom-[40px] mx-auto w-full max-w-[393px] px-5">
          <BtnLong
            label={buttonLabel}
            onClick={handleSubmit}
            className={isEdited ? "bg-primary-600" : "bg-neutral-300"}
            disabled={!isEdited}
          />
        </div>
      </div>
    </div>
  );
}
