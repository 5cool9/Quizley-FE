// src/component/tabbar.tsx
import HomeNone from "../assets/icon/HomeNone.svg";
import HomeActiv from "../assets/icon/HomeActiv.svg";
import HistoryNone from "../assets/icon/HistoryNone.svg";
import HistoryActiv from "../assets/icon/HistoryActiv.svg";
import CommunityNone from "../assets/icon/CommunityNone.svg";
import CommunityActiv from "../assets/icon/CommunityActiv.svg";
import MypageNone from "../assets/icon/MypageNone.svg";
import MypageActiv from "../assets/icon/MypageActiv.svg";

type TabKey = "home" | "history" | "community" | "my";
interface TabBarProps {
  active: TabKey;
  onChange?: (key: TabKey) => void;
}

export default function TabBar({ active, onChange }: TabBarProps) {
  const items: { key: TabKey; label: string; on: string; off: string }[] = [
    { key: "home", label: "홈", on: HomeActiv, off: HomeNone },
    { key: "history", label: "기록", on: HistoryActiv, off: HistoryNone },
    { key: "community", label: "커뮤니티", on: CommunityActiv, off: CommunityNone },
    { key: "my", label: "MY", on: MypageActiv, off: MypageNone },
  ];

  return (
    <nav className="w-full h-[86px] pt-2 pb-[30px] px-5 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.03)] border-t border-neutral-200">
      <ul className="flex items-center justify-between">
        {items.map(({ key, label, on, off }) => {
          const isActive = active === key;
          return (
            <li key={key} className="w-[42px]">
              <button
                onClick={() => onChange?.(key)}
                className="w-full flex flex-col items-center gap-1"
                aria-current={isActive ? "page" : undefined}
              >
                <img src={isActive ? on : off} alt="" className="w-6 h-6" />
                <span className={`typ-b1 text-center ${isActive ? "text-primary-500" : "text-neutral-400"}`}>
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
