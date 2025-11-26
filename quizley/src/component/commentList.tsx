// src/component/commentList.tsx
import { useState } from "react";

import IconMenu from "../assets/icon/icon_menu.svg";
import IconLike from "../assets/icon/icon_like_none.svg";
import IconLikeOn from "../assets/icon/icon_like_activation.svg";
import ProfileDefault from "../assets/img/profileIMG.svg";
import IconSiren from "@/assets/icon/icon_siren.svg";
import IconBlock from "@/assets/icon/icon_block.svg";
import IconTrash from "@/assets/icon/icon_trash.svg";

export type CommentItem = {
  id: string | number;
  nickname: string;
  avatarUrl?: string;
  dateText: string;
  content: string;
  likeCount: number;
  liked?: boolean;       // 좋아요 여부
  myComments?: boolean;  // 내 댓글인지 여부
};

type Props = {
  items: CommentItem[];
  onClickLike?: (id: CommentItem["id"]) => void;

  // 메뉴에서 눌렸을 때 부모에게 알려줄 콜백들
  onClickReport?: (id: CommentItem["id"]) => void;
  onClickBlock?: (id: CommentItem["id"]) => void;
  onClickDelete?: (id: CommentItem["id"]) => void;

  className?: string;
};

export default function CommentList({
  items,
  onClickLike,
  onClickReport,
  onClickBlock,
  onClickDelete,
  className = "",
}: Props) {
  // 어떤 댓글의 메뉴가 열려 있는지
  const [openMenuId, setOpenMenuId] = useState<CommentItem["id"] | null>(
    null
  );

  return (
    // 리스트 전체를 클릭하면 메뉴 닫기
    <div
      className={`w-full ${className}`}
      onClick={() => setOpenMenuId(null)}
    >
      {items.map((c) => (
        <article
          key={c.id}
          className="relative w-full bg-white px-5 py-5 border-b border-neutral-200"
        // article 눌러도 메뉴 닫히도록 (상위 div onClick이 처리)
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
                <span className="typ-b6 text-neutral-650">
                  {c.nickname}
                </span>
              </div>

              {/* 점 3개 버튼 */}
              <button
                type="button"
                aria-label="메뉴"
                onClick={(e) => {
                  e.stopPropagation(); // 상위 div onClick 막기
                  setOpenMenuId((prev) => (prev === c.id ? null : c.id));
                }}
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

            {/* 좋아요 */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClickLike?.(c.id);
              }}
              className="flex items-end gap-1"
              aria-label="좋아요"
            >
              <img
                src={c.liked ? IconLikeOn : IconLike}
                alt=""
                className="w-5 h-5"
              />
              <span
                className={`typ-b4 ${c.liked ? "text-primary-700" : "text-neutral-400"
                  }`}
              >
                {c.likeCount}
              </span>
            </button>
          </div>

          {/* ====== 댓글별 메뉴 (해당 댓글 카드 기준 위치) ====== */}
          {openMenuId === c.id && (
            <div
              className="absolute right-5 top-12 z-40"
              onClick={(e) => e.stopPropagation()} // 메뉴 내부 클릭 시 닫히지 않게
            >
              <div className="w-[124px] bg-white rounded-[4px] shadow-[0_0_15px_0_rgba(0,0,0,0.15)]">
                {c.myComments ? (
                  // 내 댓글이면: 댓글 삭제
                  <button
                    className="w-full h-[36px] px-2 py-2 flex items-center justify-between gap-2 hover:bg-neutral-50 border-b border-neutral-200"
                    onClick={() => {
                      onClickDelete?.(c.id);
                      setOpenMenuId(null);
                    }}
                  >
                    <span className="typ-b4 text-neutral-650">
                      댓글 삭제
                    </span>
                      <img src={IconTrash} alt="" className="w-5 h-5" />
                  </button>
                ) : (
                  <>
                    {/* 다른 유저 댓글: 댓글 신고 */}
                    <button
                      className="w-full h-[36px] px-2 py-2 flex items-center justify-between gap-2 hover:bg-neutral-50 border-b border-neutral-200"
                      onClick={() => {
                        onClickReport?.(c.id);
                        setOpenMenuId(null);
                      }}
                    >
                      <span className="typ-b4 text-neutral-650">
                        댓글 신고
                      </span>
                      <img src={IconSiren} alt="" className="w-5 h-5" />
                    </button>

                    {/* 사용자 차단 */}
                    <button
                      className="w-full h-[36px] px-2 py-2 flex items-center justify-between gap-2 hover:bg-neutral-50 border-b border-neutral-200"
                      onClick={() => {
                        onClickBlock?.(c.id);
                        setOpenMenuId(null);
                      }}
                    >
                      <span className="typ-b4 text-neutral-650">
                        사용자 차단
                      </span>
                      <img src={IconBlock} alt="" className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
