// src/pages/RecordTodayInsightPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../component/header";
import TabBar from "../component/tabbar";
import TrashIcon from "../assets/icon/icon_trash.svg";
import {
  getInsightRecord,
  deleteInsightRecord,
  getSameQuestionAnswers,
  InsightRecordItem,
  SameQuestionAnswerItem,
} from "../api/insightRecord";
import DeleteInsightPop from "../component/deleteInsightPop";

type LocationState = {
  date?: string; 
};

const categoryLabelMap: Record<string, string> = {
  mystery: "🕵🏻‍♂️ 미스터리",
  science: "🧬 과학",
  literature: "📚 문학",
  art: "🎨 예술",
  history: "⏳ 역사",
  psychology: "❤️‍🔥 심리",
};

// 기록에 들어있는 한글 카테고리 → 라우트용 영문 key 매핑
const categoryKeyMap: Record<string, string> = {
  미스터리: "mystery",
  과학: "science",
  문학: "literature",
  예술: "art",
  역사: "history",
  심리: "psychology",
};

export default function ReportTodayInsightPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { date: initialDate } = (state || {}) as LocationState;

  const [record, setRecord] = useState<InsightRecordItem | null>(null);
  const [answers, setAnswers] = useState<SameQuestionAnswerItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const targetDate = record?.date ?? initialDate ?? "";

  // 날짜 포맷팅
  const formattedDate = useMemo(() => {
    if (!targetDate) return "";
    const d = new Date(targetDate);
    if (Number.isNaN(d.getTime())) return targetDate;

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const day = weekdays[d.getDay()];
    return `${y}. ${m}. ${dd}. (${day})`;
  }, [targetDate]);

  // 상단 카테고리 라벨
  const categoryLabel = useMemo(() => {
    const cat = record?.category;
    if (!cat) return "카테고리";

    const engKey = categoryKeyMap[cat] ?? cat.toLowerCase();
    return categoryLabelMap[engKey] ?? cat;
  }, [record?.category]);

  // 오늘의 인사이트 기록 조회
  useEffect(() => {
    if (!initialDate) return;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const list = await getInsightRecord(initialDate);
        setRecord(list[0] ?? null);
      } catch (err: any) {
        console.error("오늘의 인사이트 조회 실패:", err);
        setErrorMsg(err?.message ?? "오늘의 인사이트를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [initialDate]);

  // 같은 질문에 다시 답해보기 목록 조회 (quizId 필요)
  useEffect(() => {
    const quizId = record?.quizId;
    if (quizId == null) return;

    (async () => {
      try {
        const data = await getSameQuestionAnswers(quizId);
        setAnswers(data);
      } catch (err) {
        console.error("같은 질문 답변 목록 조회 실패:", err);
      }
    })();
  }, [record?.quizId]);

  // 같은 질문에 다시 답해보기 (+ 버튼) → editSummaryPage.tsx로 이동
  const handleGoSameQuestionEdit = () => {
    if (!record) {
      alert("인사이트 정보를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    const rawCategory = record.category ?? "";
    const categoryKey =
      categoryKeyMap[rawCategory] || rawCategory.toLowerCase() || "mystery";

    navigate(`/analyze/${categoryKey}/edit`, {
      state: {
        summary: "",
        chatId: null,
        quizId: record.quizId,
        question: record.question,
        from: "reportTodayInsight",
      },
    });
  };

  // 다른 유저의 생각 더보기 → 해당 커뮤니티 게시글(댓글)로 이동
  const handleGoComments = () => {
    const quizId = record?.quizId;
    if (!quizId) {
      alert("퀴즈 정보를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    navigate(`/community/user/${quizId}`, {
      state: {
        from: "recordTodayInsight",
        focus: "comments",
      },
    });
  };

  // 기록 삭제 확정
  const handleConfirmDelete = async () => {
    if (!targetDate) return;
    try {
      await deleteInsightRecord(targetDate);
      alert("기록이 삭제되었습니다.");
      setShowDeleteConfirm(false);
      navigate(-1);
    } catch (err: any) {
      console.error("기록 삭제 실패:", err);
      alert(err?.message ?? "기록 삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 같은 질문 답변 카드 날짜 포맷
  const formatAnswerDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${dd}`;
  };

  // topComments 정규화 (string 배열이 와도 안전하게)
  const topComments = useMemo(() => {
    const raw = record?.topComments ?? [];
    return raw.map((c, idx) =>
      typeof c === "string"
        ? { commentId: idx, comment: c }
        : (c as { commentId: number; comment: string })
    );
  }, [record?.topComments]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[393px] flex-col bg-neutral-50">
        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto pb-[110px]">
          {/* 상단 헤더 */}
          <div className="bg-white">
            <div className="pt-8 pb-3">
              <Header
                title="오늘의 인사이트"
                onBack={() => navigate(-1)}
                showMenu
                onMenu={() => setMenuOpen((v) => !v)}
              />
            </div>
          </div>

          {/* 메뉴 팝업 */}
          {menuOpen && (
            <div className="absolute right-5 top-[104px] z-20">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setShowDeleteConfirm(true);
                }}
                className="flex items-center gap-3 rounded-[4px] bg-white px-4 py-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
              >
                <span className="text-[14px] text-neutral-700">기록 삭제</span>
                <img src={TrashIcon} alt="" className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* 상단 정보 영역 (카테고리 / 제목 / 날짜) */}
          <section className="px-5 pt-4 pb-1">
            <p className="text-[16px] font-semibold text-primary-700">
              {categoryLabel}
            </p>
            <h2 className="mt-1 text-[22px] font-bold text-neutral-900">
              Today&apos;s Quiz
            </h2>
            <p className="mt-1 text-[16px] text-neutral-650">
              {formattedDate || "날짜 정보 없음"}
            </p>
          </section>

          {/* 질문 카드 */}
          <section className="px-5 pt-4">
            <div className="rounded-[10px] border-b border-neutral-100 bg-white px-5 py-5">
              <p className="whitespace-pre-line text-[16px] text-neutral-650">
                {record?.question || "질문을 불러오는 중입니다..."}
              </p>
            </div>
          </section>

          {/* 로딩 / 에러 */}
          {loading && (
            <p className="px-5 pt-4 text-[14px] text-neutral-500">
              인사이트를 불러오는 중입니다...
            </p>
          )}
          {errorMsg && !loading && (
            <p className="px-5 pt-4 text-[14px] text-red-500">{errorMsg}</p>
          )}

          {/* 퀴즐리봇 요약 */}
          <section className="bg-white mt-5 px-5 py-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[16px] font-medium text-neutral-650">
                퀴즐리봇 요약
              </p>
            </div>
            <div className="rounded-[10px] border-b border-neutral-100 bg-neutral-50 px-5 py-5">
              <p className="whitespace-pre-line text-[16px] text-neutral-650">
                {record?.summary || "요약을 불러오는 중입니다..."}
              </p>
            </div>
          </section>

          {/* 퀴즐리봇 피드백 */}
          <section className="bg-white px-5 pb-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[16px] font-medium text-neutral-650">
                퀴즐리봇 피드백
              </p>
            </div>
            <div className="rounded-[10px] border-b border-neutral-100 bg-neutral-50 px-5 py-5">
              <p className="whitespace-pre-line text-[16px] text-neutral-650">
                {record?.feedback || "피드백을 불러오는 중입니다..."}
              </p>
            </div>
          </section>

          {/* 다른 유저의 생각 TOP3 */}
          <section className="mt-8 px-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[16px] font-medium text-neutral-650">
                다른 유저의 생각 TOP3
              </p>
              <button
                type="button"
                className="text-[14px] font-medium text-neutral-400"
                onClick={handleGoComments}
              >
                더보기
              </button>
            </div>

            {topComments.length === 0 ? (
              <p className="mt-2 text-[14px] text-neutral-400">
                아직 다른 유저의 생각이 없습니다. 첫 번째 댓글을 남겨보세요!
              </p>
            ) : (
              <div className="space-y-2">
                {topComments.slice(0, 3).map((c) => (
                  <div
                    key={c.commentId}
                    className="rounded-[10px] border-b border-neutral-100 bg-white px-5 py-4 text-[16px] text-neutral-650"
                  >
                    {c.comment}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 같은 질문에 다시 답해보기 리스트 */}
          <section className="mt-8 px-5 pb-10">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[16px] font-medium text-neutral-650">
                같은 질문에 다시 답해보기
              </p>
              <button
                type="button"
                className="text-[20px] font-bold leading-none text-neutral-400"
                onClick={handleGoSameQuestionEdit}
              >
                +
              </button>
            </div>

            {answers.length === 0 ? (
              <p className="mt-2 text-[14px] text-neutral-400">
                아직 다시 답한 기록이 없습니다. 나중에 한 번 더 답해보세요!
              </p>
            ) : (
              <div className="space-y-2">
                {answers.map((item) => (
                  <div
                    key={item.answerId}
                    className="flex flex-col gap-3 rounded-[10px] border-b border-neutral-100 bg-white px-5 py-5"
                  >
                    <p className="text-[12px] font-medium text-neutral-400">
                      {formatAnswerDate(item.createdAt)}
                    </p>
                    <p className="whitespace-pre-line text-[16px] text-neutral-650">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* 탭바 – 기록 활성 */}
        <div className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
          <div className="mx-auto w-full max-w-[393px]">
            <TabBar active="history" />
          </div>
        </div>

        {/* 삭제 확인 팝업 컴포넌트 사용 */}
        <DeleteInsightPop
          open={showDeleteConfirm}
          title="기록을 삭제하시겠습니까?"
          message="삭제된 기록은 복구할 수 없습니다."
          confirmText="삭제"
          cancelText="취소"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </div>
    </div>
  );
}
