// src/component/commentInput.tsx
import { useState } from "react";
import SendIcon from "../assets/icon/icon_mingcute_send-fill.svg";
import IconCheckbox from "../assets/icon/icon_checkbox.svg";
import IconNoneCheckbox from "../assets/icon/icon_none_checkbox.svg";

type Props = {
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
  onSubmit?: (v: string, isAnonymous: boolean) => void;
  anonymousChecked?: boolean;
  onToggleAnonymous?: (checked: boolean) => void;
  className?: string;
};

export default function CommentInput({
  placeholder = "생각을 나눠주세요.",
  defaultValue = "",
  value,
  onChange,
  onSubmit,
  anonymousChecked,
  onToggleAnonymous,
  className = "",
}: Props) {
  const [inner, setInner] = useState(defaultValue);
  const [innerAnon, setInnerAnon] = useState(true);

  const controlled = value !== undefined;
  const text = controlled ? (value as string) : inner;
  const isAnon = anonymousChecked ?? innerAnon;

  const handleChange = (v: string) => {
    if (controlled) onChange?.(v);
    else {
      setInner(v);
      onChange?.(v);
    }
  };

  const toggleAnon = () => {
    const next = !isAnon;
    if (anonymousChecked === undefined) setInnerAnon(next);
    onToggleAnonymous?.(next);
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit?.(text.trim(), isAnon);
    if (!controlled) setInner("");
  };

  return (
    <div className={`w-full bg-white pt-2.5 pb-10 ${className}`}>
      <div className="w-[353px] mx-auto rounded-[10px] bg-neutral-50 p-3">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 익명 토글 + 입력 */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={toggleAnon}
              aria-pressed={isAnon}
              aria-label="익명 전환"
              className="flex items-center gap-1.5 shrink-0"
            >
              <img
                src={isAnon ? IconCheckbox : IconNoneCheckbox}
                alt=""
                className="w-5 h-5"
              />
              <span
                className={`typ-b6 ${
                  isAnon ? "text-primary-700 font-semibold" : "text-neutral-400"
                }`}
              >
                익명
              </span>
            </button>

            <input
              value={text}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              className="typ-b6 text-neutral-650 placeholder:text-neutral-400 bg-transparent outline-none w-full"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            aria-label="보내기"
            className="shrink-0 ml-2"
          >
            <img src={SendIcon} alt="" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
