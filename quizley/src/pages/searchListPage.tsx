import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../component/searchBar";
import type { Post, PostDaily, PostUser } from "../component/postList";
import PostList from "../component/postList";
import LeftIcon from "../assets/icon/icon_left.svg";

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
const userPosts: PostUser[] = demoPosts.filter(
    (p): p is PostUser => p.kind === "user"
);

const SearchListPage = () => {
    const [params, setParams] = useSearchParams();
    const [active, setActive] = useState("community"); //navbar 커뮤니티
    const [sortType, setSortType] = useState("latest"); //최신순/인기순
    const [showTip, setShowTip] = useState(true); //질문생성 팁 말풍선
    const navigate = useNavigate();

    return (
        <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
            <div className="flex h-full scrollbar-hide flex-col overflow-y-scroll overflow-x-hidden min-h-[calc(100vh-86px)] pb-[100px]">
                <header className="px-5 w-full h-[68px] flex items-center gap-5">
                    {/* 뒤로가기 버튼 */}
                    <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
                        <img src={LeftIcon} alt="뒤로가기" className="w-6 h-6" />
                    </button>

                    {/* 검색창 */}
                    <div className="w-full">
                        <SearchBar />
                    </div>
                </header>


                {/* 게시글 리스트 */}
                <div className="posts">
                    <div className="px-5 w-full h-[75px] flex flex-row gap-2 items-center">
                        <button
                            onClick={() => setSortType("latest")}
                            className={`h-[35px] w-[74px] rounded-full border border-solid typ-b6 transition text-neutral-650
                            ${sortType === "latest"
                                    ? "bg-primary-100 border-primary-700"
                                    : "bg-neutral-50 border-transparent "
                                }`}
                        >최신순</button>
                        {/* 인기순 버튼 */}
                        <button
                            onClick={() => setSortType("popular")}
                            className={`h-[35px] w-[74px] rounded-full border border-solid typ-b6 transition text-neutral-650
                            ${sortType === "popular"
                                    ? "bg-primary-100 border-primary-700"
                                    : "bg-neutral-50 border-transparent"
                                }`}
                        >
                            인기순
                        </button>
                    </div>

                    {/* 회색 경계 */}
                    <div className="w-full h-4 bg-neutral-50"></div>

                    {/* 오늘의 게시글 */}
                    <div className="today-post">
                        <PostList
                            items={dailyPost}
                            onClickComment={(id) => console.log("go comment:", id)}
                        />
                    </div>
                    {/* 사용자 게시글 */}
                    <div className="pb-[90px]">
                        <PostList
                            items={userPosts}
                            onToggleLike={(id) => console.log("like toggle:", id)}
                            onClickComment={(id) => console.log("go comment:", id)}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};


export default SearchListPage;
