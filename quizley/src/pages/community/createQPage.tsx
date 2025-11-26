import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/component/header";
import AnswerQInput from "@/component/answerQInput";
import BtnLong from "@/component/btnLong";
import Category from "@/component/category";

import IconChecked from "@/assets/icon/icon_checkbox.svg";
import IconUnchecked from "@/assets/icon/icon_none_checkbox_v2.svg";

// 수정 모드에서 사용할 더미 데이터
// 실제로는 여기 대신 질문 상세 API를 다시 호출 
const EDIT_DEMO: Record<
  number,
  {
    content: string;
    anonymous: boolean;
    categoryId: string; // Category 컴포넌트에서 사용하는 id 그대로
  }
> = {
  111: {
    content: "왜 우리는 공포 컨텐츠를 즐길까? 무서운데도 왜 계속 보게 되는걸까?",
    anonymous: true,          // 익명 여부 기본값
    categoryId: "psychology", // 심리 카테고리 id (네 프로젝트에 맞게 수정)
  },
};

const CreateQPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();   // /create -> undefined, /edit/:id -> 값 있음
  const isEdit = !!id;                           // 수정 모드 여부

  // 더미
  const base =
    isEdit && id
      ? EDIT_DEMO[Number(id)]
      : null;

  // 익명 여부 – base가 있으면 그 값으로 초기화
  const [anonymous, setAnonymous] = useState<boolean>(
    base?.anonymous ?? false
  );

  // 질문 내용 – base.content 사용
  const [content, setContent] = useState<string>(
    base?.content ?? ""
  );

  // 카테고리– base.categoryId 사용
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string | null>(base?.categoryId ?? null);

  const isValid =
    content.trim().length > 0 && selectedCategoryId !== null;

  // 등록 / 수정 버튼 클릭
  const handleSubmit = () => {
    if (!isValid) return;

    if (isEdit) {
      console.log("수정 요청:", {
        id,
        content,
        categoryId: selectedCategoryId,
        anonymous,
      });
      // TODO: PATCH /community/:id 수정 API
    } else {
      console.log("새 글 작성 요청:", {
        content,
        categoryId: selectedCategoryId,
        anonymous,
      });
      // TODO: POST /community 생성 API
    }

    navigate("/community", { replace: true });
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
              className={`text-[16px] font-semibold ${
                anonymous ? "text-primary-700" : "text-neutral-400"
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
            activeId={selectedCategoryId ?? ""}          // 선택된 카테고리 표시
            onChange={(id) => setSelectedCategoryId(id)} // 누르면 업데이트
          />
        </div>

        {/* 등록 / 수정 버튼 */}
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full h-[49px] max-w-[393px] px-5">
          <BtnLong
            label={isEdit ? "수정하기" : "등록하기"}
            onClick={handleSubmit}
            disabled={!isValid}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateQPage;
