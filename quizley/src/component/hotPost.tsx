// src/component/hotPost.tsx
import IconLike from "../assets/icon/icon_like_none.svg";
import IconComment from "../assets/icon/icon_comment_gray.svg";

type HotPostProps = {
  title?: string;
  likeCount?: number | string;
  commentCount?: number | string;
  className?: string;
};

export default function HotPost({
  title = "휴대폰이 사라진 세상에서\n사람들은 어떤 도구를 발명할까?",
  likeCount = 3,
  commentCount = 4,
  className = "",
}: HotPostProps) {
  return (
    <div
      className={`w-full rounded-[10px] px-5 py-4 bg-neutral-50 ${className}`}
    >
      <div className="flex flex-col gap-5">
        {/* 제목 */}
        <p className="typ-b6 text-neutral-900 whitespace-pre-line">
          {title}
        </p>

        {/* 우측 정렬: 좋아요 / 댓글 (아이콘 이미지만 사용) */}
        <div className="w-full flex items-center justify-end gap-4">
          <div className="flex items-end gap-1">
            <img src={IconLike} alt="" className="w-5 h-5" />
            <span className="typ-b4 text-neutral-400">{likeCount}</span>
          </div>

          <div className="flex items-center gap-1">
            <img src={IconComment} alt="" className="w-5 h-5" />
            <span className="typ-b1 text-neutral-400">{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
