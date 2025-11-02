// src/component/inputThink.tsx
import SendIcon from "../assets/icon/icon_mingcute_send-fill.svg";

type Props = {
  placeholder?: string;
  className?: string;
};

export default function InputThink({
  placeholder = "내 생각을 입력해주세요",
  className = "",
}: Props) {
  return (
    <div className={`w-full rounded-[10px] p-3 bg-neutral-50 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent outline-none typ-b6 placeholder:text-neutral-400"
        />
        <img src={SendIcon} alt="보내기" className="w-6 h-6 shrink-0" />
      </div>
    </div>
  );
}