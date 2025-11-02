// src/component/btnLong.tsx
type BtnLongProps = {
  label?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
};

export default function BtnLong({
  label = "등록하기",
  disabled = false,
  type = "button",
  onClick,
  className = "",
}: BtnLongProps) {
  const base =
    "w-full rounded-[10px] py-[15px] flex items-center justify-center typ-b7"; // 타이포 토큰
  const active = "bg-gradient-to-r from-brand-from to-brand-to text-neutral-white";
  const inactive = "bg-neutral-400 text-neutral-white cursor-not-allowed";

  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      onClick={onClick}
      className={`${base} ${disabled ? inactive : active} ${className}`}
    >
      {label}
    </button>
  );
}
