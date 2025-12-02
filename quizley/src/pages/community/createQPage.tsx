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
  type CategoryCode,
  updateCommunityQuiz,
} from "@/api/communityApi";

// Category 컴포넌트의 id → 백엔드 카테고리 코드 매핑
const CATEGORY_ID_TO_CODE: Record<string, CategoryCode> = {
  science: "과학",
  literature: "문학",
  history: "역사",
  art: "예술",
  mystery: "미스터리",
  psychology: "심리",
};

// 수정 모드에서 사용할 더미 데이터 (나중에 상세 조회 API로 대체 예정)
const EDIT_DEMO: Record<
  number,
  {
    content: string;
    anonymous: boolean;
    categoryId: string;
  }
> = {
  111: {
    content:
      "왜 우리는 공포 컨텐츠를 즐길까? 무서운데도 왜 계속 보게 되는걸까?",
    anonymous: true,
    categoryId: "psychology",
  },
};

const CreateQPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const base = isEdit && id ? EDIT_DEMO[Number(id)] : null;

  const [anonymous, setAnonymous] = useState<boolean>(
    base?.anonymous ?? false
  );
  const [content, setContent] = useState<string>(base?.content ?? "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    base?.categoryId ?? null
  );
  const [submitting, setSubmitting] = useState(false);

  const isValid = content.trim().length > 0 && selectedCategoryId !== null;

  const handleSubmit = async () => {
    if (!isValid || !selectedCategoryId) return;

    //카테고리 한 번 변환
    const category = CATEGORY_ID_TO_CODE[selectedCategoryId];
    if (!category) {
      alert("카테고리를 다시 선택해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      // 수정 모드
      if (isEdit) {
        const quizId = Number(id);
        if (Number.isNaN(quizId)) {
          alert("잘못된 접근입니다.");
          return;
        }

        try {
          await updateCommunityQuiz({
            quizId,
            content,
            category,
            isAnonymous: anonymous,
          });

          alert("게시물이 수정되었습니다.");
          // 수정 후 해당 게시글 상세로 보내거나, 커뮤니티 홈으로 이동
          navigate(`/community/user/${quizId}`, { replace: true });
        } catch (e: any) {
          console.error(e);

          if (e.code === "CANNOT_EDIT_QUIZ_WITH_COMMENTS") {
            alert("댓글이 달린 게시물은 수정할 수 없습니다.");
          } else if (e.code === "FORBIDDEN") {
            alert("본인이 작성한 게시물만 수정할 수 있습니다.");
          } else if (e.status === 401 || (e.message ?? "").includes("로그인")) {
            alert("로그인이 필요합니다. 다시 로그인해주세요.");
            navigate("/login");
            return;
          } else {
            alert(e.message ?? "게시물 수정 중 오류가 발생했습니다.");
          }
        } finally {
          setSubmitting(false);
        }

        return;
      }

      //생성 모드
      const quizId = await createCommunityQuiz({
        content,
        category,
        isAnonymous: anonymous,
      });

      console.log("작성 완료, quizId:", quizId);
      navigate(`/community/user/${quizId}`, { replace: true });
    } catch (e: any) {
      console.error(e);
      if (e.status === 401 || (e.message ?? "").includes("로그인")) {
        alert("로그인이 필요합니다. 다시 로그인해주세요.");
        navigate("/login");
        return;
      }
      alert(e.message ?? "게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
      <div className="flex h-full scrollbar-hide flex-col overflow-y-scroll overflow-x-hidden min-h-[calc(100vh-86px)] pb-[100px]">
        {/* header*/}
        <div className="pt-[15px] pb-5 w-full">
          <Header
            title={isEdit ? "게시물 수정" : "게시물 작성"}
            onBack={() => navigate(-1)}
            showMenu={false}
          />
        </div>

        {/* 질문 입력 */}
        <div className="mt-6 px-5 w-full h-auto">
          <AnswerQInput
            placeholder="다른 사용자들에게도 질문을 들려주세요."
            className="w-full h-[150px] mb-2"
            value={content}
            onChange={(value) => setContent(value)}
          />

          {/* 익명 체크 */}
          <button
            type="button"
            className="w-auto mx-auto pb-[60px] inline-flex items-center justify-start gap-1 select-none"
            onClick={() => setAnonymous((v) => !v)}
            aria-pressed={anonymous}
          >
            <img
              src={anonymous ? IconChecked : IconUnchecked}
              alt={anonymous ? "checked" : "unchecked"}
              className="w-5 h-5"
              draggable={false}
            />
            <span
              className={`text-[16px] font-semibold ${anonymous ? "text-primary-700" : "text-neutral-400"
                }`}
            >
              익명
            </span>
          </button>
        </div>

        {/* 카테고리 선택 */}
        <div className="px-5">
          <h2 className="typ-h5 mb-1">카테고리 선택</h2>
          <Category
            className="flex-wrap max-h-[80px] w-full"
            activeId={selectedCategoryId ?? ""}
            onChange={(id) => setSelectedCategoryId(id)}
          />
        </div>

        {/* 등록 / 수정 버튼 */}
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full h-[49px] max-w-[393px] px-5">
          <BtnLong
            label={isEdit ? "수정하기" : "등록하기"}
            onClick={handleSubmit}
            disabled={!isValid || submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateQPage;
