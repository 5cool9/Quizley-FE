// src/component/btnShort.tsx
type BtnShortProps = {
  label: string;                    // 예: '취소' | '확인'
  variant: "cancel" | "confirm";    // 디자인 시안 기준 두 종류
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
};

export default function BtnShort({
  label,
  variant,
  type = "button",
  onClick,
  className = "",
}: BtnShortProps) {
  const base =
    "inline-flex items-center justify-center rounded-[5px] py-[10px] px-4 typ-b4 w-full";
  const styles =
    variant === "confirm"
      ? "bg-primary-700 text-neutral-white"   // 보라(#978DFF) + 화이트 (토큰)
      : "bg-neutral-50 text-neutral-900";     // 배경(#F7F8FA) + 블랙 (토큰)

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${styles} ${className}`}
    >
      {label}
    </button>
  );
}
