// src/pages/loginPage.tsx
import React from "react";
import LoginInput from "../component/loginInput";
import BtnLong from "../component/btnLong";
import { useNavigate } from "react-router-dom";

type LoginPageProps = {
  onLogin?: () => void;
  onSignup?: () => void;
};

export default function LoginPage({ onLogin, onSignup }: LoginPageProps) {
  const nav = useNavigate();
  const goSignup = onSignup ?? (() => nav("/join")); // ← 기본 이동 정의

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
          <LoginInput label="아이디" placeholder="아이디를 입력해 주세요." showClear />
          <LoginInput label="비밀번호" type="password" placeholder="아이디를 입력해 주세요." allowToggle />
        </div>

        <div className="mt-8">
          <BtnLong label="로그인" onClick={() => nav("/home")} />
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
