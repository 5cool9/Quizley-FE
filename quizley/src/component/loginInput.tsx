// src/component/loginInput.tsx
import { useState } from "react";
import IconClear from "../assets/icon/icon_x2.svg";
import IconEye from "../assets/icon/icon_eye.svg";
import IconEyeOff from "../assets/icon/icon_eye_off.svg";

type Props = {
  label: string;
  type?: "text" | "password";
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  className?: string;
  showClear?: boolean;
  allowToggle?: boolean;
};

export default function LoginInput({
  label,
  type = "text",
  placeholder = "",
  value,
  defaultValue = "",
  onChange,
  className = "",
  showClear = true,
  allowToggle = true,
}: Props) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const text = controlled ? (value as string) : inner;

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : "text";
  const hasValue = (text ?? "").length > 0;

  const handleChange = (v: string) => {
    if (controlled) onChange?.(v);
    else {
      setInner(v);
      onChange?.(v);
    }
  };

  const borderTone = hasValue ? "border-neutral-700" : "border-neutral-300";

  return (
    <div className={`w-full bg-white rounded-[10px] px-5 py-3 border ${borderTone} focus-within:border-neutral-700 transition-colors ${className}`}>
      <div className="flex flex-col gap-0.5">
        <span className="typ-b4 text-neutral-400">{label}</span>

        <div className="flex items-center justify-between">
          <input
            type={inputType}
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none typ-b6 placeholder:text-neutral-300 "
          />

          {/* 아이콘 영역: 항상 24x24 공간 확보 */}
          <div className="ml-2 w-6 h-6 shrink-0 flex items-center justify-center">
            {/* text 타입: X 아이콘 (값 있을 때만 표시, 없으면 invisible로 자리만 유지) */}
            {!isPassword && showClear && (
              <button
                type="button"
                onClick={() => handleChange("")}
                aria-label="지우기"
                className={`p-0 ${hasValue ? "" : "invisible"}`}
              >
                <img src={IconClear} alt="" className="w-6 h-6" />
              </button>
            )}

            {/* password 타입: 눈 아이콘 (허용하지 않으면 자리만 유지) */}
            {isPassword && (
              <button
                type="button"
                onClick={() => allowToggle && setShowPassword((s) => !s)}
                aria-label={showPassword ? "비밀번호 가리기" : "비밀번호 보기"}
                className={`${allowToggle ? "" : "invisible"}`}
              >
                <img
                  src={showPassword ? IconEyeOff : IconEye}
                  alt=""
                  className="w-5 h-5"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
