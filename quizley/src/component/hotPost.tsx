import { useState } from "react";
import type React from "react"; // 타입용

import IconLikeInactive from "../assets/icon/icon_like_none.svg";
import IconLikeActive from "../assets/icon/icon_like_activation.svg";
import IconComment from "../assets/icon/icon_comment_gray.svg";

type HotPostProps = {
  title?: string;
  likeCount?: number | string;
  commentCount?: number | string;
  liked?: boolean;
  className?: string;
  onClickLike?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function HotPost({
  title = "휴대폰이 사라진 세상에서\n사람들은 어떤 도구를 발명할까?",
  likeCount: rawLikeCount = 3,
  commentCount = 4,
  liked = false,
  className = "",
  onClickLike,
}: HotPostProps) {
  const likeCount =
    typeof rawLikeCount === "string"
      ? parseInt(rawLikeCount, 10)
      : rawLikeCount;

  const likeIcon = liked ? IconLikeActive : IconLikeInactive;
  const likeCountClass = liked
    ? "typ-b4 text-primary-700"
    : "typ-b4 text-neutral-400";

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClickLike?.(e);
  };

  return (
    <div
      className={`w-full rounded-[10px] px-5 py-4 bg-neutral-50 ${className}`}
    >
      <div className="flex flex-col gap-5">
        {/* 제목 */}
        <p className="typ-b6 text-neutral-900 whitespace-pre-line">
          {title}
        </p>

        {/* 우측 정렬: 좋아요 / 댓글 */}
        <div className="w-full flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleLikeClick}
            className="flex items-end gap-1 p-1.5 -m-1.5"
          >
            <img
              src={likeIcon}
              alt={liked ? "좋아요 취소" : "좋아요"}
              className="w-5 h-5"
            />
            <span className={likeCountClass}>{likeCount}</span>
          </button>

          <div className="flex items-center gap-1">
            <img src={IconComment} alt="댓글" className="w-4 h-4" />
            <span className="typ-b1 text-neutral-400">{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
