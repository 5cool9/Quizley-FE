import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/header";
import AnswerQInput from "../component/answerQInput";
import BtnLong from "../component/btnLong";
import Category from "../component/category";

import IconChecked from "../assets/icon/icon_checkbox.svg";
import IconUnchecked from "../assets/icon/icon_none_checkbox_v2.svg";

const CreateQPage = () => {
    const navigate = useNavigate();
    const [anonymous, setAnonymous] = useState(true); // 익명 체크

    return <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
        <div className="flex h-full px-5 scrollbar-hide flex-col overflow-y-scroll overflow-x-hidden min-h-[calc(100vh-86px)] pb-[100px]">
            {/* header*/}
            <div className="pt-[15px] pb-5 w-full">
                <Header
                    title="게시물 작성"
                    onBack={() => navigate("/community", { replace: true })}
                    onMenu={() => console.log("menu")}
                />
            </div>

            {/* 질문 입력 */}
            <div className="mt-6 w-full h-auto">
                <AnswerQInput
                    placeholder="다른 사용자들에게도 질문을 들려주세요."
                    className="w-full h-[150px] mb-2"
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
            <div>
                <h2 className="typ-h5 mb-1">카테고리 선택</h2>
                <Category className="flex-wrap max-h-[80px] w-full" />
            </div>

            {/* 등록 버튼 */}
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full h-[49px] max-w-[393px] px-5">
                <BtnLong label="등록하기" onClick={() => console.log("click")} />
            </div>

        </div>
    </div>;
}

export default CreateQPage;