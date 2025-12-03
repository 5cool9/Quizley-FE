import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "@/component/header";
import AnswerQInput from "@/component/answerQInput";
import BtnLong from "@/component/btnLong";
import Category from "@/component/category";

import IconChecked from "@/assets/icon/icon_checkbox.svg";
import IconUnchecked from "@/assets/icon/icon_none_checkbox_v2.svg";

import {
  createCommunityQuiz,
  updateCommunityQuiz,
  fetchQuizDetail,
  type CategoryCode,
  type QuizDetailApi,
} from "@/api/communityApi";


const CATEGORY_ID_TO_CODE: Record<string, CategoryCode> = {
  science: "과학",
  literature: "문학",
  history: "역사",
  art: "예술",
  mystery: "미스터리",
  psychology: "심리",
};

// localStorage key
const CATEGORY_STORAGE_KEY = "communityCategory";


const CreateQPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [anonymous, setAnonymous] = useState(false);
  const [content, setContent] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const [initialLoading, setInitialLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);


useEffect(() => {
    if (!isEdit || !id) return;

    const quizId = Number(id);
    if (Number.isNaN(quizId)) return;

    const load = async () => {
      try {
        setInitialLoading(true);

        const data: QuizDetailApi = await fetchQuizDetail({
          quizId,
          sort: "latest",
        });

        const q = data.quiz;

        // 질문 내용
        setContent(q.content);
  const isAnon = q.nickname === "익명";
        setAnonymous(isAnon);

        console.log("수정모드 - nickname:", q.nickname);
        console.log("수정모드 - 익명 여부:", isAnon);

         const savedCatId = localStorage.getItem(CATEGORY_STORAGE_KEY);
        console.log("수정모드 - localStorage 카테고리 ID:", savedCatId);

        if (savedCatId) {
          setSelectedCategoryId(savedCatId);
        } else {
          console.warn("⚠ localStorage에 카테고리 없음 → 기본 science 적용");
          setSelectedCategoryId("science");
        }
      } catch (e) {
        console.error("수정 모드 초기값 불러오기 실패:", e);
        alert("게시글 정보를 불러오지 못했습니다.");
      } finally {
        setInitialLoading(false);
      }
    };

    load();
  }, [isEdit, id]);


  const isValid = content.trim().length > 0 && selectedCategoryId !== null;

 const handleSubmit = async () => {
    if (!isValid || !selectedCategoryId) return;

    const category: CategoryCode = CATEGORY_ID_TO_CODE[selectedCategoryId];
    setSubmitting(true);

    try {
      // ---------------- 수정 모드 ----------------
      if (isEdit) {
        await updateCommunityQuiz({
          quizId: Number(id),
          content,
          category,
          isAnonymous: anonymous,
        });

        alert("게시물이 수정되었습니다.");
        navigate(`/community/user/${id}`, { replace: true });
        return;
      }

      // ---------------- 생성 모드 ----------------
      const quizId = await createCommunityQuiz({
        content,
        category,
        isAnonymous: anonymous,
      });

      navigate(`/community/user/${quizId}`);
    } catch (e: any) {
      console.error(e);
      alert(e.message ?? "오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

 if (isEdit && initialLoading) {
    return (
      <div className="relative w-full max-w-[393px] mx-auto min-h-screen flex items-center justify-center">
        <span className="text-neutral-500">게시글 불러오는 중...</span>
      </div>
    );
  }


 return (
    <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
      <div className="flex flex-col h-full overflow-y-scroll scrollbar-hide pb-[100px]">

        <Header
          title={isEdit ? "게시물 수정" : "게시물 작성"}
          onBack={() => navigate(-1)}
          showMenu={false}
        />

        {/* 내용 입력 */}
        <div className="mt-6 px-5">
          <AnswerQInput
            className="w-full h-[150px] mb-2"
            placeholder="질문을 입력해주세요."
            value={content}
            onChange={(v) => setContent(v)}
          />

          {/* 익명 체크 */}
          <button
            className="inline-flex items-center gap-1 mb-[60px]"
            onClick={() => setAnonymous((prev) => !prev)}
          >
            <img
              src={anonymous ? IconChecked : IconUnchecked}
              className="w-5 h-5"
            />
            <span className={anonymous ? "text-primary-700" : "text-neutral-400"}>
              익명
            </span>
          </button>
        </div>

        {/* 카테고리 */}
        <div className="px-5">
          <h2 className="typ-h5 mb-1">카테고리 선택</h2>

          <Category
            activeId={selectedCategoryId ?? ""}
            onChange={(id) => {
              console.log("카테고리 변경:", id);
              setSelectedCategoryId(id);
            }}
          />
        </div>

        {/* 저장 버튼 */}
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full px-5 max-w-[393px]">
          <BtnLong
            label={isEdit ? "수정하기" : "등록하기"}
            disabled={!isValid || submitting}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateQPage;
