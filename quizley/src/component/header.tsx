// src/component/header.tsx
import LeftIcon from "../assets/icon/icon_left.svg";
import MenuIcon from "../assets/icon/icon_menu.svg";

type HeaderProps = {
  title?: string; // 기본값 '커뮤니티'
  onBack?: () => void;
  onMenu?: () => void;
  className?: string;
};

export default function Header({
  title = "커뮤니티",
  onBack,
  onMenu,
  className = "",
}: HeaderProps) {
  return (
    <div
      className={`w-full flex items-center justify-between px-1 ${className}`}
    >
      <button type="button" onClick={onBack} aria-label="뒤로가기">
        <img src={LeftIcon} alt="뒤로가기" className="w-4 h-4" />
      </button>

      <h1 className="typ-h3 text-neutral-900 text-center">{title}</h1>

      <button type="button" onClick={onMenu} aria-label="메뉴">
        <img src={MenuIcon} alt="메뉴" className="w-6 h-6" />
      </button>
    </div>
  );
}
