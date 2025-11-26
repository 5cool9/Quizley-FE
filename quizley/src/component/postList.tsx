// src/component/postList.tsx
import IconLike from "../assets/icon/icon_like_none.svg";          // 좋아요 (비활성)
import IconLikeOn from "../assets/icon/icon_like_activation.svg";  // 좋아요 (활성)
import IconComment from "../assets/icon/icon_comment_gray.svg";    // 댓글

type PostUser = {
  id: string | number;
  kind: "user";                     // 사용자가 만든 질문
  nickname: string;                 // '닉네임'
  title: string;                    // 질문 내용
  timeText: string;                 // '3시간 전'
  likeCount: number;
  commentCount: number;
  liked?: boolean;                  // 사용자가 좋아요 눌렀는지
};

type PostDaily = {
  id: string | number;
  kind: "daily";                    // 오늘의 질문
  title: string;
  dateText: string;                 // 'YYYY.MM.DD'
  commentCount: string | number;    // '999+' 가능
};

type Post = PostUser | PostDaily;

type IconSize = "sm" | "md";

type Props = {
  items: Post[];
  onToggleLike?: (id: PostUser["id"]) => void;   // user 글만 동작
  onClickComment?: (id: Post["id"]) => void;
  className?: string;
  iconSize?: IconSize;                           // 전체 크기 기준
  onClickItem?: (id: Post["id"], kind: Post["kind"]) => void; // 클릭되었는지 전달 
};

export default function PostList({
  items,
  onToggleLike,
  onClickComment,
  className = "",
  iconSize = "md",
  onClickItem,
}: Props) {
  // 좋아요 아이콘: sm → 20px, md → 24px
  const likeIconClass = iconSize === "sm" ? "w-5 h-5" : "w-6 h-6";
  // 댓글 아이콘: sm → 16px, md → 20px  (요청대로 한 단계 더 작게)
  const commentIconClass = iconSize === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className={`w-full ${className}`}>
      {items.map((it) =>
        it.kind === "user" ? (
          <article
            key={it.id}
            className="w-full bg-white px-5 py-5 border-b border-neutral-200"
            onClick={() => onClickItem?.(it.id, it.kind)}
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <p className="typ-b1 text-neutral-400">
                  {it.nickname}님이 만든 질문
                </p>
                <h3 className="typ-b5 text-neutral-900">{it.title}</h3>
              </div>

              <div className="flex items-center justify-between">
                <span className="typ-b1 text-neutral-400">{it.timeText}</span>

                <div className="flex items-center gap-0.5">
                  {/* 좋아요 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike?.(it.id);
                    }}
                    className="flex items-center gap-0.5"
                    aria-label="좋아요"
                  >

                    <img
                      src={it.liked ? IconLikeOn : IconLike}
                      alt=""
                      className={likeIconClass}
                    />
                    <span
                      className={`typ-b1 w-[31px] text-left ${it.liked ? "text-primary-700" : "text-neutral-400"
                        }`}
                    >
                      {it.likeCount}
                    </span>
                  </button>

                  {/* 댓글 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickComment?.(it.id);
                    }}
                    className="flex items-center gap-0.5"
                    aria-label="댓글"
                  >
                    <img
                      src={IconComment}
                      alt=""
                      className={commentIconClass}
                    />
                    <span className="typ-b1 text-neutral-400">
                      {it.commentCount}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <article
            key={it.id}
            className="w-full bg-white px-5 py-5 border-b border-neutral-200"
            onClick={() => onClickItem?.(it.id, it.kind)}
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <p className="typ-b1 text-primary-700 font-semibold">
                  Today's Quiz
                </p>
                <h3 className="typ-b5 text-neutral-900">{it.title}</h3>
              </div>

              <div className="flex items-center justify-between">
                <span className="typ-b1 text-neutral-400">{it.dateText}</span>

                {/* 오늘의 질문: 좋아요 없음, 댓글만 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickComment?.(it.id);
                  }}
                  className="flex items-center gap-1"
                  aria-label="댓글"
                >
                  <img
                    src={IconComment}
                    alt=""
                    className={commentIconClass}
                  />
                  <span className="typ-b1 text-neutral-400">
                    {it.commentCount}
                  </span>
                </button>
              </div>
            </div>
          </article>
        )
      )}
    </div>
  );
}

export type { Post, PostUser, PostDaily };
