import IconLike from "../assets/icon/icon_like_none.svg";
import IconLikeOn from "../assets/icon/icon_like_activation.svg";
import IconComment from "../assets/icon/icon_comment_gray.svg";

export type DetailUserPost = {
  id: string | number;
  kind: "user";
  nickname: string;
  title: string;
  dateText: string; // 'YYYY.MM.DD'
  likeCount: number;
  commentCount: number;
  liked?: boolean;
};

export type DetailDailyPost = {
  id: string | number;
  kind: "daily";
  title: string;
  dateText: string; // 'YYYY.MM.DD'
  commentCount: number | string;
};

export type DetailPost = DetailUserPost | DetailDailyPost;

type IconSize = "sm" | "md";

type Props = {
  post: DetailPost;
  iconSize?: IconSize;
  className?: string;
  commentCount?: number;
  onToggleLike?: (id: DetailUserPost["id"]) => void;  // user일 때만 동작
  onClickComment?: (id: DetailPost["id"]) => void;
};

export default function PostDetailCard({
  post,
  iconSize = "md",
  className = "",
  onToggleLike,
  onClickComment,
  commentCount,
}: Props) {
  const displayCommentCount = commentCount ?? post.commentCount;

  const isUser = post.kind === "user";

  const likeIconClass = iconSize === "sm" ? "w-5 h-5" : "w-6 h-6";
  const commentIconClass = iconSize === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <section
      className={`w-full bg-white pt-5 pb-[10px] ${className}`}
    >
      {/* 상단: 라벨 + 날짜 */}
      <header className="flex  px-5 items-center gap-3 mb-3">
        {isUser ? (
          <p className="typ-b4 text-neutral-400">
            {(post as DetailUserPost).nickname}님이 만든 Quiz
          </p>
        ) : (
          <p className="typ-b7 text-primary-700">
            Today&apos;s Quiz
          </p>
        )}

        <span className="typ-b4 text-neutral-400">
          {post.dateText}
        </span>
      </header>

      {/* 질문 본문 */}
      <h1 className="typ-b6 px-5 pb-8 border-b border-neutral-200">
        {post.title}
      </h1>

      {/* 하단: 좋아요 / 댓글 정보 */}
      <footer className="flex px-5 pt-[10px] items-center">
        {/* 왼쪽은 필요하면 텍스트 넣어도 되고 지금은 비움 */}
        <span className="typ-b1 text-neutral-400" />

        <div className="flex items-center gap-2">
          {/* 유저 게시글인 경우에만 좋아요 버튼 노출 */}
          {isUser && (
            <button
              type="button"
              onClick={() => onToggleLike?.(post.id)}
              className="flex items-center gap-0.5"
              aria-label="좋아요"
            >
              <img
                src={post.liked ? IconLikeOn : IconLike}
                alt=""
                className={likeIconClass}
              />
              <span
                className={`typ-b1  ml-1 w-[31px] text-left ${post.liked ? "text-primary-700" : "text-neutral-400"
                  }`}
              >
                {post.likeCount}
              </span>
            </button>
          )}

          {/* 댓글 버튼 (두 타입 공통) */}
          <button
            type="button"
            onClick={() => onClickComment?.(post.id)}
            className="flex items-center gap-0.5"
            aria-label="댓글"
          >
            <img src={IconComment} alt="" className={commentIconClass} />
            <span className="typ-b1 ml-1 text-neutral-400">유저들의 생각
            </span>
            <span className="typ-b1 ml-1 text-neutral-400">
              {displayCommentCount}
            </span>
          </button>
        </div>
      </footer>
    </section>
  );
}
