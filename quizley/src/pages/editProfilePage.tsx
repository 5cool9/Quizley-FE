// src/pages/editProfilePage.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../component/header";
import LoginInput from "../component/loginInput";
import BtnLong from "../component/btnLong";
import ProfileImg from "../assets/img/profileIMG.svg";
import { getMyProfile, updateMyProfile } from "../api/mypage";
import AlertPop from "../component/alertPop";

export default function EditProfilePage() {
  const navigate = useNavigate();

  // 초기 값 (API 연동)
  const [nickname, setNickname] = useState("");
  const [userId, setUserId] = useState("");
  const passwordPlaceholder = "********";

  // 프로필 이미지 미리보기 + 파일
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [afterSubmitRedirect, setAfterSubmitRedirect] = useState(false);

  // 닉네임/아이디/프로필 이미지 불러오기
  useEffect(() => {
    (async () => {
      try {
        const data = await getMyProfile();
        setNickname(data.nickname);
        if (data.userId) {
          setUserId(data.userId);
        }
        if ((data as any).profileImageUrl) {
          setProfilePreview((data as any).profileImageUrl);
        }
      } catch (error) {
        console.error("프로필 정보 조회 실패:", error);
      }
    })();
  }, []);

  const handleClickProfile = () => {
    fileInputRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfilePreview(url);
    setProfileFile(file);
  };

  // 닉네임이 비어 있으면 비활성, 한 글자라도 있으면 활성
  const isSubmitDisabled = nickname.trim().length === 0;

  const handleSubmit = async () => {
    if (isSubmitDisabled) return;

    try {
      const formData = new FormData();
      formData.append("nickname", nickname);
      if (profileFile) {
        // 필드 이름은 명세서에 맞게 수정 (예: "profileImage")
        formData.append("profileImage", profileFile);
      }

      await updateMyProfile(formData);
      setAlertMessage("프로필이 수정되었습니다.");
      setAfterSubmitRedirect(true);
      setAlertOpen(true); 
    } catch (error: any) {
      console.error("프로필 수정 실패:", error);
      setAlertMessage(error?.message ?? "프로필 수정에 실패했습니다.");
      setAfterSubmitRedirect(false);
      setAlertOpen(true); 
    }
  };

  return (
    <div className="min-h-max bg-neutral-50">
      {/* iPhone 프레임 */}
      <div className="relative mx-auto w-full max-w-[393px] min-h-screen bg-white">
        {/* 상단 헤더 */}
        <div className="pt-8">
          <Header
            title="프로필 수정"
            onBack={() => navigate(-1)}
            showMenu={false}
            className="pt-1 pb-5"
          />
        </div>

        {/* 내용 영역 */}
        <main className="px-5 pt-4 pb-[140px] flex flex-col items-center">
          {/* 프로필 이미지 + 파일 인풋(숨김) */}
          <button
            type="button"
            className="mt-4 mb-10 w-[100px] h-[100px] rounded-full border border-neutral-100 overflow-hidden"
            onClick={handleClickProfile}
          >
            <img
              src={profilePreview ?? ProfileImg}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChangeFile}
          />

          {/* 입력 필드 */}
          <div className="w-full space-y-3">
            {/* 닉네임 (수정 가능) */}
            <LoginInput
              label="닉네임"
              placeholder="닉네임"
              value={nickname}
              onChange={setNickname}
            />

            {/* 아이디 (수정 불가) */}
            <LoginInput
              label="아이디"
              placeholder={userId}
              defaultValue={userId}
              disabled
              showClear={false}
            />

            {/* 비밀번호 (수정 불가 – 나중에 별도 변경 화면 만들면 됨) */}
            <LoginInput
              label="비밀번호"
              placeholder={passwordPlaceholder}
              defaultValue={passwordPlaceholder}
              disabled
              showClear={false}
              type="password"
              allowToggle={false}
            />
          </div>
        </main>

        {/* 하단 긴 버튼 */}
        <div className="absolute left-0 right-0 bottom-[60px] px-5">
          <BtnLong
            label="수정하기"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          />
        </div>
      </div>
    <AlertPop
      open={alertOpen}
      title={alertMessage}
      onConfirm={() => {
        setAlertOpen(false);
        if (afterSubmitRedirect) {
          navigate(-1); // 확인 후 화면 이동
        }
      }}
    />
  </div>
  );
}
