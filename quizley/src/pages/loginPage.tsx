// src/pages/loginPage.tsx
import React, { useState } from "react";
import LoginInput from "../component/loginInput";
import BtnLong from "../component/btnLong";
import { useNavigate } from "react-router-dom";
import { loginApi, saveTokens } from "../api/auth";
import AlertPop from "../component/alertPop";

type LoginPageProps = {
  onLogin?: () => void;
  onSignup?: () => void;
};

export default function LoginPage({ onLogin, onSignup }: LoginPageProps) {
  const nav = useNavigate();
  const goSignup = onSignup ?? (() => nav("/join"));

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [afterLoginRedirect, setAfterLoginRedirect] = useState(false); // 추가

  const canSubmit = userId.trim().length > 0 && password.trim().length > 0;

  const handleLogin = async () => {
    if (!canSubmit || loading) return;

    try {
      setLoading(true);
      const data = await loginApi({ userId, password });

      setAlertMessage("로그인에 성공했습니다!");
      setAfterLoginRedirect(true); // ✅ 성공 후 홈으로 이동
      setAlertOpen(true);
      onLogin?.();
    } catch (error: any) {
      setAlertMessage(error?.message ?? "로그인에 실패했습니다.");
      setAfterLoginRedirect(false); // 실패 시 이동 없음
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="h-[60px]" />
      <div className="px-5 mt-10 w-full max-w-[393px] mx-auto">
        <div className="mt-10 mb-8">
          <p className="text-[22px] font-bold text-neutral-650 leading-snug">
            안녕하세요!
            <br />
            퀴즐리입니다.
          </p>
        </div>

        <div className="space-y-3">
          <LoginInput
            label="아이디"
            placeholder="아이디를 입력해 주세요."
            showClear
            value={userId}
            onChange={(v: string) => setUserId(v)}
          />
          <LoginInput
            label="비밀번호"
            type="password"
            placeholder="아이디를 입력해 주세요."
            allowToggle
            value={password}
            onChange={(v: string) => setPassword(v)}
          />
        </div>

        <div className="mt-8">
          <BtnLong
            label="로그인"
            onClick={handleLogin}
            disabled={!canSubmit || loading}
          />
        </div>

        <button
          type="button"
          className="mt-4 w-full text-center text-[16px] font-semibold text-neutral-900"
          onClick={goSignup}
        >
          회원가입
        </button>
        
      </div>

      {/* AlertPop */}
      <AlertPop
        open={alertOpen}
        title={alertMessage}
        onConfirm={() => {
          setAlertOpen(false);
          if (afterLoginRedirect) {
            nav("/home"); // 확인 후 홈 이동
          }
        }}
      />
    </div>
  );
}
