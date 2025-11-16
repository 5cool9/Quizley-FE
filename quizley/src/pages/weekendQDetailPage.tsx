import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/header";
import CommentList from "../component/commentList";
import WeekendGameResult from "../component/weekendGameResult";
import CommentInput from "../component/commentInput";

import type { Post, PostDaily, PostUser } from "../component/postList";
import PostList from "../component/postList";

const demoPosts: Post[] = [
    {
        id: 1,
        kind: "user",
        nickname: "닉네임",
        title: "휴대폰이 사라진 세상에서\n사람들은 어떤 도구를 발명할까?",
        timeText: "3시간 전",
        likeCount: 245,
        commentCount: 154,
        liked: false,
    },
    {
        id: 2,
        kind: "daily",
        title: "휴대폰이 사라진 세상에서\n사람들은 어떤 도구를 발명할까?",
        dateText: "2025.10.05",
        commentCount: "999+",
    },
    {
        id: 3,
        kind: "user",
        nickname: "닉네임2",
        title: "외계인이 있을까?",
        timeText: "3시간 전",
        likeCount: 4,
        commentCount: 5,
        liked: false,
    },
];

const dailyPost: PostDaily[] = demoPosts.filter(
    (p): p is PostDaily => p.kind === "daily"
);

const comments = [
    {
        id: 1,
        nickname: "익명1",
        dateText: "2025.10.05",
        content: "답변답변답변답변답변",
        likeCount: 3,
    },
];

const weekendQDetailPage = () => {
    const [active, setActive] = useState("community"); //navbar 커뮤니티
    const [sortType, setSortType] = useState("latest"); //최신순/인기순
    const [showTip, setShowTip] = useState(true); //질문생성 팁 말풍선
    const navigate = useNavigate();

    return (
        <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
            <div className="flex h-full scrollbar-hide flex-col overflow-y-scroll overflow-x-hidden min-h-[calc(100vh-86px)] pb-[100px]">
                {/* header*/}
                <div className="pt-[15px] pb-5 px-5 w-full">
                    <Header
                        title="커뮤니티"
                        onBack={() => navigate(-1)}
                    />
                </div>

                {/* 오늘의 주말 게시글 */}
                <div className="bg-neutral-50 w-full h-auto px-5 flex pb-6 flex-col items-center">
                    <div className="w-full mt-5 content-start mb-3">
                        <p className="typ-b7 text-primary-700">Today's Quiz
                            <span className="typ-b4 text-neutral-400 ml-3">2025.01.11</span>
                        </p>
                    </div>

                    <div className="w-full y-full">
                        <WeekendGameResult />
                    </div>
                </div>

                {/* 댓글  */}
                <div className="comments-wrapper">
                    <div className="px-5 w-full h-[75px] flex flex-row items-center gap-3">
                        {/* 인기순 버튼 */}
                        <button
                            onClick={() => setSortType("popular")}
                            className="flex items-center gap-1"
                        >
                            <span
                                className={`w-[8px] h-[8px] rounded-full ${sortType === "popular" ? "bg-primary-700" : "bg-neutral-300"
                                    }`}
                            ></span>
                            <span
                                className={`typ-b6 ${sortType === "popular" ? "text-neutral-650" : "text-neutral-400"
                                    }`}
                            >
                                인기순
                            </span>
                        </button>

                        {/* 최신순 버튼 */}
                        <button
                            onClick={() => setSortType("latest")}
                            className="flex items-center gap-1"
                        >
                            <span
                                className={`w-[8px] h-[8px] rounded-full ${sortType === "latest" ? "bg-primary-700" : "bg-neutral-300"
                                    }`}
                            ></span>
                            <span
                                className={`typ-b6 ${sortType === "latest" ? "text-neutral-650" : "text-neutral-400"
                                    }`}
                            >
                                최신순
                            </span>
                        </button>
                    </div>

                    <CommentList items={comments}
                        onClickMenu={(id) => console.log("menu:", id)}
                        onClickLike={(id) => console.log("like:", id)} />
                </div>

                {/* 댓글 입력창 */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[393px]">
                    <CommentInput
                        onSubmit={(txt, anon) => console.log("submit:", txt, anon)}
                    /></div>
            </div>
        </div>
    );
};


export default weekendQDetailPage;