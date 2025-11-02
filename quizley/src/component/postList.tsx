// src/component/postList.tsx
import IconLike from "../assets/icon/icon_like_none.svg";                // 좋아요 (비활성)
import IconLikeOn from "../assets/icon/icon_like_activation.svg";        // 좋아요 (활성)
import IconComment from "../assets/icon/icon_comment_gray.svg";               // 댓글

type PostUser = {
  id: string | number;
  kind: "user";                           // 사용자가 만든 질문
  nickname: string;                       // '닉네임'
  title: string;                          // 질문 내용
  timeText: string;                       // '3시간 전'
  likeCount: number;
  commentCount: number;
  liked?: boolean;                        // 사용자가 좋아요 눌렀는지
};

type PostDaily = {
  id: string | number;
  kind: "daily";                          // 오늘의 질문
  title: string;
  dateText: string;                       // 'YYYY.MM.DD'
  commentCount: string | number;          // '999+' 가능
};

type Post = PostUser | PostDaily;

type Props = {
  items: Post[];
  onToggleLike?: (id: PostUser["id"]) => void;   // user 글만 동작
  onClickComment?: (id: Post["id"]) => void;
  className?: string;
};

export default function PostList({
  items,
  onToggleLike,
  onClickComment,
  className = "",
}: Props) {
  return (
    <div className={`w-full ${className}`}>
      {items.map((it) =>
        it.kind === "user" ? (
          <article
            key={it.id}
            className="w-full bg-white px-5 py-5 border-b border-neutral-200"
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <p className="typ-b1 text-neutral-400">
                  {it.nickname}님이 만든 질문
                </p>
                <h3 className="typ-b5 text-neutral-900">
                  {it.title}
                </h3>
              </div>

              <div className="flex items-center justify-between">
                <span className="typ-b1 text-neutral-400">{it.timeText}</span>

                <div className="flex items-center gap-4">
                  {/* 좋아요 (사용자 생성 글에만) */}
                  <button
                    type="button"
                    onClick={() => onToggleLike?.(it.id)}
                    className="flex items-center gap-1"
                    aria-label="좋아요"
                  >
                    <img
                      src={it.liked ? IconLikeOn : IconLike}
                      alt=""
                      className="w-6 h-6"
                    />
                    <span className="typ-b1 text-neutral-400">{it.likeCount}</span>
                  </button>

                  {/* 댓글 */}
                  <button
                    type="button"
                    onClick={() => onClickComment?.(it.id)}
                    className="flex items-center gap-1"
                    aria-label="댓글"
                  >
                    <img src={IconComment} alt="" className="w-5 h-5" />
                    <span className="typ-b1 text-neutral-400">{it.commentCount}</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <article
            key={it.id}
            className="w-full bg-white px-5 py-5 border-b border-neutral-200"
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <p className="typ-b1 text-primary-700 font-semibold">오늘의 질문</p>
                <h3 className="typ-b5 text-neutral-900">{it.title}</h3>
              </div>

              <div className="flex items-center justify-between">
                <span className="typ-b1 text-neutral-400">{it.dateText}</span>

                {/* 오늘의 질문: 좋아요 없음, 댓글만 */}
                <button
                  type="button"
                  onClick={() => onClickComment?.(it.id)}
                  className="flex items-center gap-1"
                  aria-label="댓글"
                >
                  <img src={IconComment} alt="" className="w-5 h-5" />
                  <span className="typ-b1 text-neutral-400">{it.commentCount}</span>
                </button>
              </div>
            </div>
          </article>
        )
      )}
    </div>
  );
}
