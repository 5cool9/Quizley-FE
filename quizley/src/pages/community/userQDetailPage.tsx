import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "@/component/header";
import CommentList, {
    type CommentItem as UICommentItem,
} from "@/component/commentList";
import CommentInput from "@/component/commentInput";

import DeletePostPop from "@/component/deletePostPop"; // 게시글 삭제
import PostReportPop from "@/component/postReportPop"; // 게시물 신고
import BlockUserPop from "@/component/blockUserPop"; // 사용자 차단
import CantEditPop from "@/component/cantEditPop"; // 게시물 수정 불가 안내

import CommentReportPop from "@/component/commentReportPop";
import DeleteCommentPop from "@/component/deleteCommentPop";

import PostDetailCard, {
    DetailUserPost,
} from "@/component/postDetailCards";

import IconSiren from "@/assets/icon/icon_siren.svg";
import IconBlock from "@/assets/icon/icon_block.svg";
import IconPen from "@/assets/icon/icon_pen.svg";
import IconTrash from "@/assets/icon/icon_trash.svg";

import {
    fetchQuizDetail,
    toggleQuizLike,
    createQuizComment,
    toggleCommentLike,
    reportQuiz,
    reportComment,
    blockUser,
    deleteQuiz,
    deleteComment,
    type QuizDetailCommentApi,
    type QuizDetailApi,
} from "@/api/communityApi";

/* ------------------ 댓글 정렬용 유틸 ------------------ */

const parseDate = (dateText: string) => {
    // "2025.11.24" → Date
    const [y, m, d] = dateText.split(".").map((v) => Number(v));
    return new Date(y, m - 1, d);
};

/* ------------------ 컴포넌트 ------------------ */

const UserQDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const quizId = Number(id);

    /* -------- 상태들 -------- */

    // 상단 게시글 카드
    const [detailPost, setDetailPost] = useState<DetailUserPost | null>(null);

    // 댓글 원본(API 기준)
    const [commentItems, setCommentItems] = useState<QuizDetailCommentApi[]>([]);

    // 내가 쓴 글인지 여부 (헤더 메뉴 분기용)
    const [isMyPost, setIsMyPost] = useState(false);

    // 게시글 작성자 userId (차단용 / 나중에 API 응답에 userId 포함된다고 가정)
    const [postUserId, setPostUserId] = useState<number | null>(null);

    // 현재 차단 팝업에서 차단하려는 userId
    const [blockTargetUserId, setBlockTargetUserId] = useState<number | null>(
        null
    );

    // 댓글 정렬 기준
    const [sortType, setSortType] = useState<"latest" | "popular">("latest");

    // 로딩/에러
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 게시물 관련 팝업
    type PostModalType =
        | "post-report"
        | "block-user"
        | "delete-post"
        | "cant-edit"
        | null;
    const [showPostMenu, setShowPostMenu] = useState(false);
    const [postModal, setPostModal] = useState<PostModalType>(null);

    // 댓글 관련 팝업
    type CommentModalType = "comment-report" | "delete-comment" | null;
    const [showCommentMenu, setShowCommentMenu] = useState(false);
    const [commentModal, setCommentModal] = useState<CommentModalType>(null);
    const [targetCommentId, setTargetCommentId] = useState<number | null>(null);

    // 토스트
    const [toast, setToast] = useState<{ visible: boolean; message: string }>({
        visible: false,
        message: "",
    });

    const showToast = (message: string) => {
        setToast({ visible: true, message });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, visible: false }));
        }, 2000);
    };

    const closePostModal = () => {
        setPostModal(null);
        setBlockTargetUserId(null);
    };
    const closeCommentModal = () => setCommentModal(null);

    /* -------- 상세 데이터 로딩 -------- */
    const reloadDetail = async () => { //댓글 단후 새로고침
        setLoading(true);
        setError(null);

        try {
            const data: QuizDetailApi = await fetchQuizDetail({
                quizId,
                sort: sortType,
            });

            const q = data.quiz as QuizDetailApi["quiz"] & { userId?: number };

            setDetailPost({
                id: q.quizId,
                kind: "user",
                nickname: q.nickname,
                title: q.content,
                dateText: q.createdAt,
                likeCount: q.likeCount,
                commentCount: q.commentCount,
                liked: q.isLiked,
            });

            setCommentItems(data.comments ?? []);
            setIsMyPost(q.isMine ?? false);

            if (q.userId) setPostUserId(q.userId);
        } catch (e: any) {
            console.error("퀴즈 상세 로딩 실패:", e);

            if (e.status === 404 || e.code === "QUIZ_NOT_FOUND") {
                alert("해당 퀴즈를 찾을 수 없습니다.");
                navigate("/community", { replace: true });
                return;
            }

            if (e.status === 401 || (e.message ?? "").includes("로그인")) {
                alert("로그인이 필요합니다. 다시 로그인해주세요.");
                navigate("/login", { replace: true });
                return;
            }

            setError(e.message ?? "게시글을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!quizId) return;

        reloadDetail();
    }, [quizId, sortType, navigate]);

    // 헤더 메뉴 닫힘 효과
    useEffect(() => {
        if (!showPostMenu) return;

        const handleClickOutside = () => {
            setShowPostMenu(false);
        };

        // 50ms 딜레이 → 메뉴 버튼 클릭 시 즉시 닫히는 버그 방지
        setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
        }, 50);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showPostMenu]);

    // 댓글 메뉴 닫힘 효과
    useEffect(() => {
        if (!showCommentMenu) return;

        const handleClickOutside = () => {
            setShowCommentMenu(false);
        };

        setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
        }, 50);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showCommentMenu]);

    /* -------- 파생 값들 -------- */

    const hasComments = commentItems.length > 0;

    const commentCount = commentItems.length;

    const sortedComments = [...commentItems].sort((a, b) => {
        if (sortType === "popular") {
            return b.likeCount - a.likeCount;
        }
        // latest
        return (
            parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime()
        );
    });

    const commentListItems: UICommentItem[] = sortedComments.map((c) => ({
        id: c.commentId,
        nickname: c.nickname,
        dateText: c.createdAt,
        content: c.content,
        likeCount: c.likeCount,
        liked: c.isLiked,
        myComments: c.isMine,
    }));

    const targetComment =
        targetCommentId == null
            ? null
            : commentItems.find((c) => c.commentId === targetCommentId) ?? null;

    const isMyComment = targetComment?.isMine ?? false;


    /* -------- 좋아요 핸들러들 -------- */

    // 게시글 좋아요
    const handleTogglePostLike = async (targetId: DetailUserPost["id"]) => {
        if (!detailPost || detailPost.id !== targetId) return;

        setDetailPost((prev) => {
            if (!prev) return prev;
            const nextLiked = !prev.liked;
            const nextCount = nextLiked
                ? prev.likeCount + 1
                : prev.likeCount - 1;
            return { ...prev, liked: nextLiked, likeCount: nextCount };
        });

        try {
            await toggleQuizLike(Number(targetId));
        } catch (e: any) {
            console.error("게시글 좋아요 실패:", e);

            if (e.status === 401 || (e.message ?? "").includes("로그인")) {
                alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                navigate("/login");
                return;
            }

            showToast("좋아요 처리 중 오류가 발생했습니다.");

            // 실패 시 롤백
            setDetailPost((prev) => {
                if (!prev) return prev;
                const nextLiked = !prev.liked;
                const nextCount = nextLiked
                    ? prev.likeCount + 1
                    : prev.likeCount - 1;
                return { ...prev, liked: nextLiked, likeCount: nextCount };
            });
        }
    };

    // 댓글 좋아요
    const handleCommentLike = async (commentId: number) => {
        setCommentItems((prev) =>
            prev.map((c) => {
                if (c.commentId !== commentId) return c;
                const nextLiked = !c.isLiked;
                const nextCount = nextLiked ? c.likeCount + 1 : c.likeCount - 1;
                return { ...c, isLiked: nextLiked, likeCount: nextCount };
            })
        );

        try {
            await toggleCommentLike(commentId);
        } catch (e: any) {
            console.error("댓글 좋아요 실패:", e);

            if (e.status === 401 || (e.message ?? "").includes("로그인")) {
                alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                navigate("/login");
                return;
            }

            showToast("댓글 좋아요 처리 중 오류가 발생했습니다.");

            // 3) 실패 시 롤백
            setCommentItems((prev) =>
                prev.map((c) => {
                    if (c.commentId !== commentId) return c;
                    const nextLiked = !c.isLiked;
                    const nextCount = nextLiked
                        ? c.likeCount + 1
                        : c.likeCount - 1;
                    return { ...c, isLiked: nextLiked, likeCount: nextCount };
                })
            );
        }
    };

    /* -------- 댓글 작성 -------- */

    const handleAddComment = async (text: string, isAnonymous: boolean) => {
        const content = text.trim();
        if (!content) return;

        try {
            await createQuizComment({
                quizId,
                content,
                isAnonymous,
            });

            //바로 상세 재조회
            await reloadDetail();

            showToast("댓글이 등록되었습니다.");
        } catch (e: any) {
            console.error("댓글 작성 실패:", e);

            if (e.status === 401 || (e.message ?? "").includes("로그인")) {
                alert("로그인이 필요합니다. 다시 로그인해주세요.");
                navigate("/login");
                return;
            }

            if (e.status === 404 || e.code === "QUIZ_NOT_FOUND") {
                alert("해당 퀴즈를 찾을 수 없습니다.");
                navigate("/community", { replace: true });
                return;
            }

            showToast(e.message ?? "댓글 작성 중 오류가 발생했습니다.");
        }
    };


    /* -------- 댓글 삭제 -------- */

    const deleteTargetComment = async () => {
        if (targetCommentId === null) return;

        try {
            await deleteComment(targetCommentId);

            setCommentItems((prev) =>
                prev.filter((c) => c.commentId !== targetCommentId)
            );

            setDetailPost((prev) =>
                prev ? { ...prev, commentCount: prev.commentCount - 1 } : prev
            );

            showToast("댓글이 삭제되었습니다.");
        } catch (e: any) {
            console.error("댓글 삭제 실패:", e);

            if (e.status === 401 || (e.message ?? "").includes("로그인")) {
                alert("로그인이 필요합니다. 다시 로그인해주세요.");
                navigate("/login");
                return;
            }

            if (e.status === 403 || e.code === "FORBIDDEN") {
                showToast("댓글을 삭제할 권한이 없습니다.");
                return;
            }

            showToast(e.message ?? "댓글 삭제 중 오류가 발생했습니다.");
        }
    };

    /* -------- 댓글 메뉴 & 모달 -------- */

    const handleOpenCommentMenu = (cid: number) => {
        setTargetCommentId(cid);
        setShowCommentMenu(true);
    };

    const handleCloseCommentMenu = () => {
        setShowCommentMenu(false);
    };

    /* ================== 렌더 ================== */

    if (loading && !detailPost) {
        return (
            <div className="relative w-full max-w-[393px] mx-auto min-h-screen flex items-center justify-center">
                <span className="typ-b2 text-neutral-500">불러오는 중...</span>
            </div>
        );
    }

    if (error && !detailPost) {
        return (
            <div className="relative w-full max-w-[393px] mx-auto min-h-screen flex items-center justify-center">
                <span className="typ-b2 text-red-500">{error}</span>
            </div>
        );
    }

    if (!detailPost) {
        // quizId는 있는데 데이터가 없을 때
        return (
            <div className="relative w-full max-w-[393px] mx-auto min-h-screen flex items-center justify-center">
                <span className="typ-b2 text-neutral-500">
                    게시글 정보를 불러올 수 없습니다.
                </span>
            </div>
        );
    }

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
                                                navigate(`/community/edit/${detailPost.id}`);
                                            } else {
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
                                            // 게시글 작성자 차단
                                            setBlockTargetUserId(postUserId);
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
                    commentCount={commentCount}
                    post={detailPost}
                    onToggleLike={handleTogglePostLike}
                    onClickComment={(postId) => {
                        console.log("댓글 영역으로 스크롤 예정:", postId);
                    }}
                />

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
                                                // 댓글 작성자 userId 기준 차단
                                                const authorId = (targetComment as any)?.userId;
                                                setBlockTargetUserId(authorId ?? null);
                                                setPostModal("block-user");
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
                                setTargetCommentId(Number(id));
                                setCommentModal("comment-report");
                            }}
                            onClickBlock={(id) => {
                                const cid = Number(id);
                                const c = commentItems.find(
                                    (cmt) => cmt.commentId === cid
                                ) as any;
                                setBlockTargetUserId(c?.userId ?? null);
                                setPostModal("block-user");
                            }}
                            onClickDelete={(id) => {
                                setTargetCommentId(Number(id));
                                setCommentModal("delete-comment");
                            }}
                        />
                    )}
                </div>

                {/* 댓글 입력창 */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[393px]">
                    <CommentInput onSubmit={handleAddComment} />
                </div>
            </div>

            {/* ------------- 게시물 관련 팝업들 ------------- */}
            <DeletePostPop
                open={postModal === "delete-post"}
                onCancel={closePostModal}
                onConfirm={async () => {
                    try {
                        await deleteQuiz(Number(detailPost.id));
                        closePostModal();
                        navigate("/community", { replace: true });
                        showToast("게시물이 삭제되었습니다.");
                    } catch (e: any) {
                        console.error("게시물 삭제 실패:", e);

                        if (e.status === 401 || (e.message ?? "").includes("로그인")) {
                            alert("로그인이 필요합니다. 다시 로그인해주세요.");
                            navigate("/login");
                            return;
                        }

                        if (e.status === 403 || e.code === "FORBIDDEN") {
                            showToast("게시물을 삭제할 권한이 없습니다.");
                            return;
                        }

                        showToast(e.message ?? "게시물 삭제 중 오류가 발생했습니다.");
                    }
                }}
            />

            <PostReportPop
                open={postModal === "post-report"}
                onCancel={closePostModal}
                onConfirm={async () => {
                    try {
                        await reportQuiz(Number(detailPost.id));
                        closePostModal();
                        showToast("신고가 접수되었습니다.");
                    } catch (e: any) {
                        console.error("게시물 신고 실패:", e);

                        if (e.status === 401 || (e.message ?? "").includes("로그인")) {
                            alert("로그인이 필요합니다. 다시 로그인해주세요.");
                            navigate("/login");
                            return;
                        }

                        if (e.code === "ALREADY_REPORTED") {
                            showToast("이미 신고한 게시물입니다.");
                            closePostModal();
                            return;
                        }

                        showToast(e.message ?? "게시물 신고 중 오류가 발생했습니다.");
                    }
                }}
            />

            <BlockUserPop
                open={postModal === "block-user"}
                onCancel={closePostModal}
                onConfirm={async () => {
                    if (!blockTargetUserId) {
                        showToast("차단할 사용자를 찾을 수 없습니다.");
                        closePostModal();
                        return;
                    }

                    try {
                        await blockUser(blockTargetUserId);
                        closePostModal();
                        showToast("사용자가 차단되었습니다.");
                        navigate(-1);
                    } catch (e: any) {
                        console.error("사용자 차단 실패:", e);

                        if (e.status === 401 || (e.message ?? "").includes("로그인")) {
                            alert("로그인이 필요합니다. 다시 로그인해주세요.");
                            navigate("/login");
                            return;
                        }

                        if (e.code === "ALREADY_BLOCKED") {
                            showToast("이미 차단한 사용자입니다.");
                            closePostModal();
                            return;
                        }

                        if (e.code === "CANNOT_BLOCK_YOURSELF") {
                            showToast("자기 자신은 차단할 수 없습니다.");
                            closePostModal();
                            return;
                        }

                        showToast(e.message ?? "사용자 차단 중 오류가 발생했습니다.");
                    }
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
                onConfirm={async () => {
                    if (targetCommentId == null) {
                        closeCommentModal();
                        return;
                    }

                    try {
                        await reportComment(targetCommentId);
                        closeCommentModal();
                        showToast("신고가 접수되었습니다.");
                    } catch (e: any) {
                        console.error("댓글 신고 실패:", e);

                        if (e.status === 401 || (e.message ?? "").includes("로그인")) {
                            alert("로그인이 필요합니다. 다시 로그인해주세요.");
                            navigate("/login");
                            return;
                        }

                        if (e.code === "ALREADY_REPORTED") {
                            showToast("이미 신고한 댓글입니다.");
                            closeCommentModal();
                            return;
                        }

                        if (e.code === "COMMENT_NOT_FOUND") {
                            showToast("댓글을 찾을 수 없습니다.");
                            closeCommentModal();
                            return;
                        }

                        showToast(e.message ?? "댓글 신고 중 오류가 발생했습니다.");
                    }
                }}
            />

            <DeleteCommentPop
                open={commentModal === "delete-comment"}
                onCancel={closeCommentModal}
                onConfirm={async () => {
                    await deleteTargetComment();
                    closeCommentModal();
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
