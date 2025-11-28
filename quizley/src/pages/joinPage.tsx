// src/pages/joinPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginInput from "../component/loginInput";
import BtnLong from "../component/btnLong";
import Header from "../component/header";
import { signupApi } from "../api/auth";

export default function JoinPage() {
  const nav = useNavigate();
  const [nickname, setNickname] = useState("");
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

      alert("회원가입이 완료되었습니다. 로그인 후 이용해 주세요.");
      // 회원가입 후 이동 경로는 필요에 따라 변경 가능
      nav("/login");
    } catch (error: any) {
      alert(error?.message ?? "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* 상태바 여백 */}
      <div className="h-[60px]" />

      {/* 헤더: 가운데 정렬(본문과 동일 너비) + 메뉴 숨김 */}
      <div className="max-w-[393px] mx-auto w-full">
        <Header title="회원가입" showMenu={false} onBack={() => nav(-1)} />
      </div>

      {/* 본문 공통 컨테이너: 안내/입력/버튼 모두 동일 좌표 */}
      <div className="max-w-[393px] mx-auto w-full px-5">
        {/* 안내 문구 */}
        <div className="mt-8">
          <p className="text-[22px] font-bold text-neutral-650 leading-snug">
            회원가입에 필요한
            <br />
            정보들을 알려주세요.
          </p>
        </div>

        {/* 폼 */}
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

        {/* 등록 버튼 */}
        <div className="mt-8">
          <BtnLong
            label="등록하기"
            disabled={!canSubmit || loading}
            onClick={handleSignup}
          />
        </div>
      </div>
    </div>
  );
}
