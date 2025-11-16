import { useState } from "react";
import IconLikeInactive from "../assets/icon/icon_like_none.svg";
import IconLikeActive from "../assets/icon/icon_like_activation.svg";
import IconComment from "../assets/icon/icon_comment_gray.svg";

type HotPostProps = {
  title?: string;
  likeCount?: number | string;
  commentCount?: number | string;
  className?: string;
};

export default function HotPost({
  title = "휴대폰이 사라진 세상에서\n사람들은 어떤 도구를 발명할까?",
  likeCount: initialLikeCount = 3,
  commentCount = 4,
  className = "",
}: HotPostProps) {
  const initialCount =
    typeof initialLikeCount === "string"
      ? parseInt(initialLikeCount, 10)
      : initialLikeCount;

  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(initialCount);

  const handleLikeClick = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    // 좋아요 상태에 따라 카운트 변경
    setCurrentLikeCount((prevCount) =>
      newIsLiked ? prevCount + 1 : prevCount - 1
    );

    //test
    console.log(
      `HotPost 좋아요 클릭됨. 상태: ${
        newIsLiked ? "좋아요" : "좋아요 비활성화"
      }`
    );
  };

  const likeIcon = isLiked ? IconLikeActive : IconLikeInactive;
  const likeCountClass = isLiked
    ? "typ-b4 text-primary-700"
    : "typ-b4 text-neutral-400";

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
              alt={isLiked ? "좋아요 취소" : "좋아요"} 
              className="w-5 h-5" 
            />
            <span className={likeCountClass}>
              {currentLikeCount}
            </span>
          </button>

          <div className="flex items-center gap-1">
            <img src={IconComment} alt="댓글" className="w-5 h-5" />
            <span className="typ-b1 text-neutral-400">{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}