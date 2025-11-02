// src/component/answerQInput.tsx
type Props = {
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export default function AnswerQInput({
  value,
  defaultValue = "",
  onChange,
  placeholder = "새로운 답을 입력해주세요",
  className = "",
}: Props) {
  return (
    <div
      className={`bg-white rounded-[10px] p-5 border border-neutral-300 focus-within:border-neutral-700 ${className}`}
    >
      <textarea
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-[150px] resize-none bg-transparent outline-none typ-b5 text-neutral-900 placeholder:text-neutral-400"
      />
    </div>
  );
}
