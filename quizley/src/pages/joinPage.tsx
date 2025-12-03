// src/pages/joinPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginInput from "../component/loginInput";
import BtnLong from "../component/btnLong";
import Header from "../component/header";
import { signupApi } from "../api/auth";
import AlertPop from "../component/alertPop";

export default function JoinPage() {
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [afterSignupRedirect, setAfterSignupRedirect] = useState(false); // ✅ 추가

  const canSubmit = [nickname, userid, password].every(
    (v) => v.trim().length > 0
  );

  const handleSignup = async () => {
    if (!canSubmit || loading) return;

    try {
      setLoading(true);
      await signupApi({
        userId: userid,
        password,
        nickname,
      });

      // 팝업 띄우기
      setAlertMessage("회원가입이 완료되었습니다.\n로그인 후 이용해 주세요.");
      setAfterSignupRedirect(true); // 성공 후 로그인 페이지 이동 표시
      setAlertOpen(true); 
    } catch (error: any) {
      setAlertMessage(error?.message ?? "회원가입에 실패했습니다.");
      setAfterSignupRedirect(false); // 이동 없음
      setAlertOpen(true); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div className="h-[30px]" />
      <div className="max-w-[393px] mx-auto w-full">
        <Header title="회원가입" showMenu={false} onBack={() => nav(-1)} />
      </div>

      <div className="max-w-[393px] mx-auto w-full px-5">
        <div className="mt-20">
          <p className="text-[22px] font-bold text-neutral-650 leading-snug">
            회원가입에 필요한
            <br />
            정보들을 알려주세요.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <LoginInput
            label="닉네임"
            placeholder="닉네임을 입력해 주세요."
            value={nickname}
            onChange={(v: string) => setNickname(v)}
          />
          <LoginInput
            label="아이디"
            placeholder="아이디를 입력해 주세요."
            value={userid}
            onChange={(v: string) => setUserid(v)}
          />
          <LoginInput
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            value={password}
            allowToggle
            onChange={(v: string) => setPassword(v)}
          />
        </div>

        <div className="mt-8">
          <BtnLong
            label="등록하기"
            disabled={!canSubmit || loading}
            onClick={handleSignup}
          />
        </div>
      </div>

      {/* AlertPop */}
      <AlertPop
        open={alertOpen}
        title={alertMessage}
        onConfirm={() => {
          setAlertOpen(false);
          // 성공 시만 로그인 페이지로 이동
          if (afterSignupRedirect) {
            nav("/login");
          }
        }}
      />
    </div>
  );
}
