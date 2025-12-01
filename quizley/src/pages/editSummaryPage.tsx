// src/pages/editSummaryPage.tsx
import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import EditInput from "../component/answerQInput";
import Header from "../component/header";
import BtnLong from "../component/btnLong";
import { updateChatSummary } from "../api/chat";

export default function EditSummaryPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { category } = useParams();

    // 넘겨받은 요약 텍스트와 chatId
    const originalSummary = state?.summary || "";
    const chatId = state?.chatId;
    const [summary, setSummary] = useState(originalSummary);
    const isEdited = summary !== originalSummary;

    return (
        <div className="min-h-screen bg-white">
            <div className="relative mx-auto w-full max-w-[393px] min-h-screen flex flex-col">
        
                <div className="flex-1">
                    <div className="relative mx-auto pt-8 bg-white flex flex-col">
                        <Header
                            title="퀴즐리봇 요약 수정"
                            onBack={() => navigate(-1)}
                            showMenu={false}
                            className="pt-1 pb-5"
                        />
                    </div>
                  
                    {/* 수정 박스 */}
                    <div className="px-5 mt-5">
                        <EditInput
                            value={summary}          
                            onChange={(v: string) => setSummary(v)}
                            className={`${!isEdited ? "text-neutral-400" : "text-neutral-900"}`}
                        />
                    </div>
                </div>
                
                {/* 버튼*/}
                <div className="fixed inset-x-0 bottom-[40px] mx-auto w-full max-w-[393px] px-5">
                    <BtnLong
                        label="수정하기"
                        onClick={async () => {
                            if (!chatId) return;
                            try {
                                await updateChatSummary(chatId, summary); // API 호출
                                navigate(`/analyze/${category}`, {
                                    state: { editedSummary: summary, chatId: state?.chatId  },
                                });
                            } catch (err) {
                                console.error("요약 수정 실패:", err);
                                alert("요약 수정 중 오류가 발생했습니다.");
                            }
                        }}
                        className={isEdited ? "bg-primary-600" : "bg-neutral-300"}
                        disabled={!isEdited}
                    />
                </div>
            </div>
        </div>
    );
}
