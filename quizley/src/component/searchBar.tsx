// src/component/searchBar.tsx
import IconSearch from "../assets/icon/icon_search_gray.svg";

type Props = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (v: string) => void;
  onSubmit?: (v: string) => void;
  className?: string;
};

export default function SearchBar({
  value,
  defaultValue = "",
  placeholder = "재밌는 답변을 찾아 보세요.",
  onChange,
  onSubmit,
  className = "",
}: Props) {
  const controlled = value !== undefined;
  const handleChange = (v: string) => onChange?.(v);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.querySelector("input") as HTMLInputElement | null;
        if (input) onSubmit?.(input.value);
      }}
      className={`w-full bg-neutral-50 rounded-[30px] px-5 py-2.5 flex items-center gap-2 ${className}`}
    >
      {/* 아이콘은 이미지 그대로 사용 */}
      <img src={IconSearch} alt="" className="w-6 h-6" />

      <input
        type="text"
        value={controlled ? value : undefined}
        defaultValue={controlled ? undefined : defaultValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none typ-b6 placeholder:text-neutral-400 text-neutral-900"
      />
    </form>
  );
}
