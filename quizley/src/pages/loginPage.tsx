// src/pages/loginPage.tsx
import React, { useState } from "react";
import LoginInput from "../component/loginInput";
import BtnLong from "../component/btnLong";
import { useNavigate } from "react-router-dom";
import { loginApi, saveTokens } from "../api/auth";

type LoginPageProps = {
  onLogin?: () => void;
  onSignup?: () => void;
};

export default function LoginPage({ onLogin, onSignup }: LoginPageProps) {
  const nav = useNavigate();
  const goSignup = onSignup ?? (() => nav("/join")); // ← 기본 이동 정의

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = userId.trim().length > 0 && password.trim().length > 0;

  const handleLogin = async () => {
    if (!canSubmit || loading) return;

    try {
      setLoading(true);
      const data = await loginApi({ userId, password });

      // 토큰 저장
      saveTokens(data.accessToken, data.refreshToken);

      onLogin?.();
      nav("/home");
    } catch (error: any) {
      alert(error?.message ?? "로그인에 실패했습니다.");
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
    </div>
  );
}
