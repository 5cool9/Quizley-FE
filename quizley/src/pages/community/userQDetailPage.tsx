import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

import Header from "@/component/header";
import CommentList, {
    type CommentItem as UICommentItem,
} from "@/component/commentList";
import CommentInput from "@/component/commentInput";

import DeletePostPop from "@/component/deletePostPop";     // 게시글 삭제
import PostReportPop from "@/component/postReportPop";    // 게시물 신고
import BlockUserPop from "@/component/blockUserPop";      // 사용자 차단
import CantEditPop from "@/component/cantEditPop";        // 게시물 수정 불가 안내

import CommentReportPop from "@/component/commentReportPop";
import DeleteCommentPop from "@/component/deleteCommentPop";

import PostDetailCard, {
    DetailUserPost,
} from "@/component/postDetailCards";

import IconSiren from "@/assets/icon/icon_siren.svg";
import IconBlock from "@/assets/icon/icon_block.svg";
import IconPen from "@/assets/icon/icon_pen.svg";
import IconTrash from "@/assets/icon/icon_trash.svg";

/* ------------------ 타입 & 더미 데이터 ------------------ */

// 상세 페이지용 더미 게시글 타입
type UserPostDetailDemo = {
    postId: number;
    kind: "user";
    nickname: string;
    title: string;
    dateText: string;
    likeCount: number;
    commentCount: number;
    liked: boolean;
    myPost: boolean; // 내가 쓴 글인지 여부
};

// 댓글 상태용 타입
type RawComment = {
    commentId: number;
    nickname: string;
    dateText: string;  // "YYYY.MM.DD"
    content: string;
    likeCount: number;
    myComments: boolean;
    liked?: boolean;
};

// 게시물 관련 팝업 상태
type PostModalType =
    | "post-report"
    | "block-user"
    | "delete-post"
    | "cant-edit"
    | null;

// 댓글 관련 팝업 상태
type CommentModalType = "comment-report" | "delete-comment" | null;

// 게시글 더미
const demoPosts: UserPostDetailDemo[] = [
    {
        postId: 111,
        kind: "user",
        nickname: "홍길동",
        title: "인공지능이 인간의 창의성을 넘을 수 있을까?",
        dateText: "2025.10.05",
        likeCount: 245,
        commentCount: 154,
        liked: false,
        myPost: true, // T/F 바꿔가면서 테스트 가능
    },
];

// 댓글 더미
const initialComments: RawComment[] = [
{
    commentId: 555,
    nickname: "익명1",
    dateText: "2025.10.05",
    content: "패턴 분석은 잘하지만 완전히 새로운 건 힘들 것 같아요.",
    likeCount: 764,
    myComments: false,
    liked: false,
  },
  {
    commentId: 515,
    nickname: "아옹아옹",
    dateText: "2025.10.05",
    content: "언젠가 넘는 날이 올 수도",
    likeCount: 590,
    myComments: false,
    liked: false,
  },
  {
    commentId: 777,
    nickname: "익명2",
    dateText: "2025.10.05",
    content: "이미 나보다 나은 거 같아",
    likeCount: 310,
    myComments: true,
    liked: false,
  },
];

/* ------------------ 유틸: 날짜 파싱 ------------------ */

const parseDate = (dateText: string) => {
    // "2025.10.05" → Date
    const [y, m, d] = dateText.split(".").map((v) => Number(v));
    return new Date(y, m - 1, d);
};

/* ------------------ 컴포넌트 ------------------ */

const UserQDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // URL에서 온 id를 숫자로 변환
    const postId = Number(id);
    const basePost =
        demoPosts.find((p) => p.postId === postId) ?? demoPosts[0];
    const isMyPost = basePost?.myPost ?? false;

    /* -------- 게시글(상단 카드) 상태 -------- */
    const [detailPost, setDetailPost] = useState<DetailUserPost>({
        id: basePost.postId,
        kind: "user",
        nickname: basePost.nickname,
        title: basePost.title,
        dateText: basePost.dateText,
        likeCount: basePost.likeCount,
        commentCount: basePost.commentCount,
        liked: basePost.liked,
    });

    /* -------- 댓글 상태 / 정렬 -------- */
    const [commentItems, setCommentItems] =
        useState<RawComment[]>(initialComments);
    const [sortType, setSortType] =
        useState<"latest" | "popular">("latest");

    // 댓글이 하나라도 있는지
    const hasComments = commentItems.length > 0;

    // 댓글 정렬 적용
    const sortedComments = useMemo(() => {
        const list = [...commentItems];
        if (sortType === "popular") {
            // 좋아요 많은 순
            return list.sort((a, b) => b.likeCount - a.likeCount);
        }
        // 최신순 (날짜가 뒤일수록 위로)
        return list.sort(
            (a, b) =>
                parseDate(b.dateText).getTime() -
                parseDate(a.dateText).getTime()
        );
    }, [commentItems, sortType]);

    // CommentList에 넘길 형태로 매핑
    const commentListItems: UICommentItem[] = sortedComments.map(
        (c) => ({
            id: c.commentId,
            nickname: c.nickname,
            dateText: c.dateText,
            content: c.content,
            likeCount: c.likeCount,
            liked: c.liked,
            myComments: c.myComments,
        })
    );

    // 댓글 개수 → "유저들의 생각 N개"
    const commentCount = commentItems.length;

    /* -------- 좋아요 핸들러들 -------- */

    // 게시글 좋아요
    const handleTogglePostLike = (id: DetailUserPost["id"]) => {
        setDetailPost((prev) => {
            if (!prev || prev.id !== id) return prev;

            const nextLiked = !prev.liked;
            const nextCount = nextLiked
                ? prev.likeCount + 1
                : prev.likeCount - 1;

            console.log("post like:", { postId: id, nextLiked, nextCount });

            return {
                ...prev,
                liked: nextLiked,
                likeCount: nextCount,
            };
        });
    };

    // 댓글 좋아요
    const handleCommentLike = (id: number) => {
        setCommentItems((prev) =>
            prev.map((c) => {
                if (c.commentId !== id) return c;
                const nextLiked = !c.liked;
                const nextCount = nextLiked
                    ? c.likeCount + 1
                    : c.likeCount - 1;

                console.log("comment like:", {
                    commentId: id,
                    nextLiked,
                    nextCount,
                });

                return {
                    ...c,
                    liked: nextLiked,
                    likeCount: nextCount,
                };
            })
        );
    };

    /* -------- 댓글 작성 -------- */

    const handleAddComment = (text: string, isAnonymous: boolean) => {
        const newId = Date.now(); // 임시 ID
        const nickname = isAnonymous ? "익명" : "홍길동"; // 실제로는 로그인 유저 정보 사용

        const today = "2025.10.05"; // 나중에 new Date()로 포맷해서 사용

        const newComment: RawComment = {
            commentId: newId,
            nickname,
            dateText: today,
            content: text,
            likeCount: 0,
            myComments: !isAnonymous, // 예시: 익명 아닐 때만 '내 댓글'로 표시
            liked: false,
        };

        setCommentItems((prev) => [...prev, newComment]);

        // 상단 카드의 댓글 개수도 같이 증가
        setDetailPost((prev) =>
            prev
                ? { ...prev, commentCount: prev.commentCount + 1 }
                : prev
        );

        console.log("새 댓글 추가:", newComment);
    };

    /* -------- 헤더 ... 메뉴 (게시물) -------- */

    const [showPostMenu, setShowPostMenu] = useState(false);
    const [postModal, setPostModal] = useState<PostModalType>(null);

    /* -------- Toast관련 ---------*/
    // 토스트 상태
    const [toast, setToast] = useState<{ visible: boolean; message: string }>({
        visible: false,
        message: "",
    });

    // 토스트 띄우는 공통 함수
    const showToast = (message: string) => {
        setToast({ visible: true, message });

        // 2초 후 자동으로 사라지게
        setTimeout(() => {
            setToast((prev) => ({ ...prev, visible: false }));
        }, 2000);
    };

    /* -------- 댓글 메뉴 & 모달 -------- */

    const [showCommentMenu, setShowCommentMenu] = useState(false);
    const [commentModal, setCommentModal] =
        useState<CommentModalType>(null);
    const [targetCommentId, setTargetCommentId] =
        useState<number | null>(null);

    const targetComment =
        targetCommentId === null
            ? null
            : commentItems.find((c) => c.commentId === targetCommentId) ??
            null;

    const isMyComment = targetComment?.myComments ?? false;

    // 메뉴/모달 공통 닫기
    const closePostModal = () => setPostModal(null);
    const closeCommentModal = () => setCommentModal(null);

    // 댓글 메뉴 열기
    const handleOpenCommentMenu = (id: number) => {
        setTargetCommentId(id);
        setShowCommentMenu(true);
    };

    const handleCloseCommentMenu = () => {
        setShowCommentMenu(false);
    };

    // 댓글 삭제 실제 반영 (delete 모달 확인 시 사용)
    const deleteTargetComment = () => {
        if (targetCommentId === null) return;
        setCommentItems((prev) =>
            prev.filter((c) => c.commentId !== targetCommentId)
        );
        // 상단 카드의 댓글 수 감소
        setDetailPost((prev) =>
            prev
                ? { ...prev, commentCount: prev.commentCount - 1 }
                : prev
        );
        console.log("댓글 삭제:", targetCommentId);
    };

    /* ================== 렌더 ================== */

    return (
        <div className="relative w-full max-w-[393px] mx-auto min-h-screen">
            <div className="flex h-full scrollbar-hide flex-col overflow-y-scroll overflow-x-hidden min-h-[calc(100vh-86px)] pb-[100px]">
                {/* 헤더 */}
                <div className="pt-[15px] pb-5 w-full">
                    <Header
                        title="커뮤니티"
                        onBack={() => navigate(-1)}
                        onMenu={() => setShowPostMenu((prev) => !prev)}
                    />
                </div>

                {/* 헤더 메뉴 (게시물용) */}
                {showPostMenu && (
                    <div className="absolute right-5 top-[45px] z-50">
                        <div className="w-[124px] bg-white rounded-[4px] shadow-[0_0_15px_0_rgba(0,0,0,0.15)]">
                            {isMyPost ? (
                                <>
                                    <button
                                        className="w-full h-[36px] px-2 py-2 flex items-center justify-between gap-2 hover:bg-neutral-50 border-b border-neutral-200"
                                        onClick={() => {
                                            if (!hasComments) {
                                                // 내 게시물이고, 아직 댓글이 없으면 수정 페이지로 이동
                                                navigate(`/community/edit/${detailPost.id}`);
                                            } else {
                                                // 댓글이 이미 있으면 수정 불가 모달
                                                setPostModal("cant-edit");
                                            }
                                            setShowPostMenu(false);
                                        }}
                                    >
                                        <span className="typ-b4 text-neutral-650">
                                            게시물 수정
                                        </span>
                                        <img src={IconPen} alt="" className="w-5 h-5" />
                                    </button>

                                    <button
                                        className="w-full h-[36px] px-2 py-2 flex items-center justify-between gap-2 hover:bg-neutral-50 border-b border-neutral-200"
                                        onClick={() => {
                                            setPostModal("delete-post");
                                            setShowPostMenu(false);
                                        }}
                                    >
                                        <span className="typ-b4 text-neutral-650">
                                            게시물 삭제
                                        </span>
                                        <img src={IconTrash} alt="" className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="w-full px-2 py-2 flex items-center justify-between gap-2 hover:bg-neutral-50 border-b border-neutral-200"
                                        onClick={() => {
                                            setPostModal("post-report");
                                            setShowPostMenu(false);
                                        }}
                                    >
                                        <span className="typ-b4 text-neutral-650">
                                            게시물 신고
                                        </span>
                                        <img src={IconSiren} alt="" className="w-5 h-5" />
                                    </button>

                                    <button
                                        className="w-full px-2 py-2 flex items-center justify-between gap-2 hover:bg-neutral-50 border-b border-neutral-200"
                                        onClick={() => {
                                            setPostModal("block-user");
                                            setShowPostMenu(false);
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

                {/* ------------ 게시글 상세 카드 ------------ */}
                <PostDetailCard
                    post={detailPost}
                    onToggleLike={handleTogglePostLike}
                    onClickComment={(id) =>
                        console.log("댓글 영역으로 스크롤 예정:", id)
                    }

                />

                {/* 포스트 하단: 유저들의 생각 N개 
                <div className="w-full bg-white px-5 py-3 border-b border-neutral-200">
                    <span className="typ-b1 text-neutral-400">
                        유저들의 생각 {commentCount}개
                    </span>
                </div>*/}

                {/* 회색 경계선 */}
                <div className="w-full h-4 bg-neutral-50" />

                {/* ------------ 댓글 영역 ------------ */}
                <div className="comments-wrapper relative">
                    {/* 정렬 버튼 */}
                    <div className="px-5 w-full h-[75px] flex flex-row items-center gap-3">
                        <button
                            onClick={() => setSortType("popular")}
                            className="flex items-center gap-1"
                        >
                            <span
                                className={`w-[8px] h-[8px] rounded-full ${sortType === "popular"
                                    ? "bg-primary-700"
                                    : "bg-neutral-300"
                                    }`}
                            />
                            <span
                                className={`typ-b6 ${sortType === "popular"
                                    ? "text-neutral-650"
                                    : "text-neutral-400"
                                    }`}
                            >
                                인기순
                            </span>
                        </button>

                        <button
                            onClick={() => setSortType("latest")}
                            className="flex items-center gap-1"
                        >
                            <span
                                className={`w-[8px] h-[8px] rounded-full ${sortType === "latest"
                                    ? "bg-primary-700"
                                    : "bg-neutral-300"
                                    }`}
                            />
                            <span
                                className={`typ-b6 ${sortType === "latest"
                                    ? "text-neutral-650"
                                    : "text-neutral-400"
                                    }`}
                            >
                                최신순
                            </span>
                        </button>
                    </div>

                    {/* 댓글 메뉴 (점 3개 눌렀을 때) */}
                    {showCommentMenu && targetComment && (
                        <div className="absolute right-5 top-[70px] z-40">
                            <div className="w-[124px] bg-white rounded-[4px] shadow-[0_0_15px_0_rgba(0,0,0,0.15)]">
                                {isMyComment ? (
                                    <button
                                        className="w-full h-[36px] px-2 py-2 flex items-center justify-between gap-2 hover:bg-neutral-50 border-b border-neutral-200"
                                        onClick={() => {
                                            setCommentModal("delete-comment");
                                            setShowCommentMenu(false);
                                        }}
                                    >
                                        <span className="typ-b4 text-neutral-650">
                                            댓글 삭제
                                        </span>
                                        <img src={IconTrash} alt="" className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="w-full h-[36px] px-2 py-2 flex items-center justify-between gap-2 hover:bg-neutral-50 border-b border-neutral-200"
                                            onClick={() => {
                                                setCommentModal("comment-report");
                                                setShowCommentMenu(false);
                                            }}
                                        >
                                            <span className="typ-b4 text-neutral-650">
                                                댓글 신고
                                            </span>
                                            <img src={IconSiren} alt="" className="w-5 h-5" />
                                        </button>

                                        <button
                                            className="w-full h-[36px] px-2 py-2 flex items-center justify-between gap-2 hover:bg-neutral-50 border-b border-neutral-200"
                                            onClick={() => {
                                                setPostModal("block-user"); // 같은 차단 팝업 사용
                                                setShowCommentMenu(false);
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

                    {/* 댓글 리스트 */}
                    {commentItems.length === 0 ? (
                        //댓글이 하나도 없을 때: 가운데 안내 문구
                        <div className="w-full bg-white px-5 py-16 text-center border-t border-neutral-200">
                            <p className="typ-b4 text-neutral-300">아직 댓글이 없습니다.</p>
                            <p className="typ-b1 text-neutral-300 mt-1">
                                나만의 생각을 공유해 보세요.
                            </p>
                        </div>
                    ) : (
                        <CommentList
                            items={commentListItems}
                            onClickLike={(id) => handleCommentLike(Number(id))}
                            onClickReport={(id) => {
                                // 다른 유저 댓글에서 "댓글 신고"
                                setTargetCommentId(Number(id));
                                setCommentModal("comment-report");
                            }}
                            onClickBlock={(id) => {
                                // 댓글 작성자 차단 (게시물 차단 팝업 재사용)
                                setTargetCommentId(Number(id));
                                setPostModal("block-user");
                            }}
                            onClickDelete={(id) => {
                                // 내 댓글에서 "댓글 삭제"
                                setTargetCommentId(Number(id));
                                setCommentModal("delete-comment");
                            }}
                        />
                    )}
                </div>

                {/* ------------ 댓글 입력창 ------------ */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[393px]">
                    <CommentInput onSubmit={handleAddComment} />
                </div>
            </div>

            {/* ------------- 게시물 관련 팝업들 ------------- */}
            <DeletePostPop
                open={postModal === "delete-post"}
                onCancel={closePostModal}
                onConfirm={() => {
                    console.log("게시물 삭제");
                    closePostModal();

                    navigate("/community");
                    showToast("게시물이 삭제되었습니다.");

                }}
            />

            <PostReportPop
                open={postModal === "post-report"}
                onCancel={closePostModal}
                onConfirm={() => {
                    console.log("게시물 신고");
                    closePostModal();
                    showToast("신고가 접수되었습니다.");
                }}
            />

            <BlockUserPop
                open={postModal === "block-user"}
                onCancel={closePostModal}
                onConfirm={() => {
                    console.log("사용자 차단");
                    closePostModal();
                    showToast("사용자가 차단되었습니다.");

                }}
            />

            <CantEditPop
                open={postModal === "cant-edit"}
                onConfirm={closePostModal}
            />

            {/* ------------- 댓글 관련 팝업들 ------------- */}
            <CommentReportPop
                open={commentModal === "comment-report"}
                onCancel={closeCommentModal}
                onConfirm={() => {
                    console.log("댓글 신고:", targetCommentId);
                    closeCommentModal();
                    showToast("신고가 접수되었습니다.");

                }}
            />

            <DeleteCommentPop
                open={commentModal === "delete-comment"}
                onCancel={closeCommentModal}
                onConfirm={() => {
                    deleteTargetComment();
                    closeCommentModal();
                    showToast("댓글이 삭제되었습니다.");

                }}
            />

            {/* 공통 토스트 UI */}
            {toast.visible && (
                <div className="fixed bottom-[90px] left-1/2 -translate-x-1/2 z-[999]">
                    <div className="px-4 py-1.5 rounded-[20px] bg-neutral-900/60">
                        <span className="typ-b4 text-white">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserQDetailPage;
