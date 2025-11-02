// src/component/commentList.tsx
import IconMenu from "../assets/icon/icon_menu.svg";
import IconLike from "../assets/icon/icon_like_none.svg";
import ProfileDefault from "../assets/img/profileIMG.svg";

type CommentItem = {
  id: string | number;
  nickname: string;
  avatarUrl?: string;
  dateText: string;
  content: string;
  likeCount: number | string;
};

type Props = {
  items: CommentItem[];
  onClickMenu?: (id: CommentItem["id"]) => void;
  onClickLike?: (id: CommentItem["id"]) => void;
  className?: string;
};

export default function CommentList({
  items,
  onClickMenu,
  onClickLike,
  className = "",
}: Props) {
  return (
    <div className={`w-full ${className}`}>
      {items.map((c) => (
        <article
          key={c.id}
          className="w-full bg-white px-5 py-5 border-b border-neutral-200"
        >
          <div className="flex flex-col gap-3">
            {/* 헤더: 아바타 / 닉네임 / 메뉴 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={c.avatarUrl || ProfileDefault}
                  alt=""
                  className="w-6 h-6 rounded-full border border-neutral-50"
                />
                <span className="typ-b6 text-neutral-650">{c.nickname}</span>
              </div>

              <button
                type="button"
                aria-label="메뉴"
                onClick={() => onClickMenu?.(c.id)}
              >
                <img src={IconMenu} alt="" className="w-6 h-6" />
              </button>
            </div>

            {/* 날짜 */}
            <span className="typ-b1 text-neutral-400">{c.dateText}</span>

            {/* 내용 */}
            <p className="typ-b6 text-neutral-650 whitespace-pre-line">
              {c.content}
            </p>

            {/* 좋아요 (UI만) */}
            <button
              type="button"
              onClick={() => onClickLike?.(c.id)}
              className="flex items-end gap-1"
              aria-label="좋아요"
            >
              <img src={IconLike} alt="" className="w-5 h-5" />
              <span className="typ-b4 text-neutral-400">{c.likeCount}</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
