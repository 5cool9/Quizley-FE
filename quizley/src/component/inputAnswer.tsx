// src/components/inputAnswer.tsx
import SendIcon from "../assets/icon/icon_mingcute_send-fill.svg";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  placeholder?: string;
  className?: string;
};

export default function InputAnswer({
  value,
  onChange,
  onSend,
  placeholder = "내 생각을 입력해주세요",
  className = "",
}: Props) {
  return (
    <div className={`w-full rounded-[10px] p-3 bg-neutral-50 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none typ-b6 placeholder:text-neutral-400"
        />
        <button onClick={onSend}>
          <img src={SendIcon} alt="보내기" className="w-6 h-6 shrink-0" />
        </button>
      </div>
    </div>
  );
}
