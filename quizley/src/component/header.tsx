// src/component/header.tsx
import LeftIcon from "../assets/icon/icon_left.svg";
import MenuIcon from "../assets/icon/icon_menu.svg";

type HeaderProps = {
  title?: string;
  onBack?: () => void;
  onMenu?: () => void;
  className?: string;
  showMenu?: boolean;          // ← 추가: 메뉴 아이콘 노출 여부
};

export default function Header({
  title = "커뮤니티",
  onBack,
  onMenu,
  className = "",
  showMenu = true,
}: HeaderProps) {
  return (
    <div className={`w-full flex items-center justify-between px-5 ${className}`}>
      {/* 뒤로가기 */}
      <button type="button" onClick={onBack} aria-label="뒤로가기">
        <img src={LeftIcon} alt="뒤로가기" className="w-4 h-4" />
      </button>

      {/* 타이틀 */}
      <h1 className="typ-h3 text-neutral-900 text-center">{title}</h1>

      {/* 메뉴(숨김시 동일 폭 스페이서로 정렬 유지) */}
      {showMenu ? (
        <button type="button" onClick={onMenu} aria-label="메뉴">
          <img src={MenuIcon} alt="메뉴" className="w-6 h-6" />
        </button>
      ) : (
        <span className="w-6 h-6" />
      )}
    </div>
  );
}
