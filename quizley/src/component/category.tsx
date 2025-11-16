// src/component/category.tsx
type Item = { id: string; label: string };

type Props = {
  items?: Item[];
  activeId?: string;
  onChange?: (id: string) => void;
  className?: string;
  pillWidth?: number;        // ★ 모든 칩 동일 너비 (기본 96px)
};

export default function Category({
  items = [
    { id: "mystery", label: "🕵🏻‍♂️ 미스터리" },
    { id: "science", label: "🧬 과학" },
    { id: "literature", label: "📚 문학" },
    { id: "art", label: "🎨 예술" },
    { id: "history", label: "⏳ 역사" },
    { id: "psychology", label: "❤️‍🔥 심리" },
  ],
  activeId = "mystery",
  onChange,
  className = "",
  //pillWidth = 115,            // 필요에 따라 100~110으로 조절
}: Props) {
  return (
    <div className={`w-full flex items-center gap-2 ${className}`}>
      {items.map((it) => {
        const active = it.id === activeId;
        const base =
          "h-[35px] px-4 py-2 rounded-[30px] inline-flex items-center justify-center whitespace-nowrap"; // ★ 줄바꿈 방지
        const activeCls =
          "bg-primary-700 text-neutral-white typ-b7";
        const inactiveCls =
          "bg-neutral-50 text-neutral-650 typ-b6";
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onChange?.(it.id)}
            className={`${base} ${active ? activeCls : inactiveCls}`}
            //style={{ width: pillWidth }}     // ★ 동일 너비 적용
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
