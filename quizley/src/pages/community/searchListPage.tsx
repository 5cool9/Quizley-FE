import { useSearchParams } from "react-router-dom";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "@/component/searchBar";
import type { Post, PostDaily, PostUser } from "@/component/postList";
import PostList from "@/component/postList";
import LeftIcon from "@/assets/icon/icon_left.svg";

// DUMMY 데이터
const DUMMY_SEARCH_RESULTS: Post[] = [
    {
        id: 1,
        kind: "user",
        nickname: "닉네임",
        title: "휴대폰이 사라진 세상에서\n사람들은 어떤 도구를 발명할까?",
        timeText: "2025.09.01",
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
        timeText: "2025.10.01",
        likeCount: 4,
        commentCount: 5,
        liked: false,
    },
    {
        id: 3,
        kind: "user",
        nickname: "닉네임2",
        title: "휴대폰이 사라진 세상에서\n사람들은 어떤 도구를 발명할까?",
        timeText: "2025.10.11",
        likeCount: 4,
        commentCount: 5,
        liked: false,
    },
];


const SearchListPage = () => {
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();

    // 1. URL 파라미터에서 검색어 읽기
    const searchQuery = params.get("q") ?? "";

    // 2. 검색 결과를 담을 상태를 생성합니다. (API 호출 결과가 들어갈 자리)
    const [searchResults, setSearchResults] = useState<Post[]>([]);
    
    //최신순/인기순 정렬 상태
    const [sortType, setSortType] = useState<"latest" | "popular">("latest");

    // 3. 검색 로직을 useEffect로 분리하여, 검색어 또는 정렬 기준이 바뀔 때 데이터를 가져옵니다.
    useEffect(() => {
        // 실제 API 호출 로직이 들어갈 부분입니다.
        if (!searchQuery) {
            setSearchResults([]);
            return;
        }

        // --- 현재는 더미 데이터를 필터링하는 것으로 대체 ---
        let results = DUMMY_SEARCH_RESULTS.filter(post =>
            post.title.includes(searchQuery)
        );
        setSearchResults(results);
        // --- 더미 데이터 대체 끝 ---

        // 참고: 정렬은 useMemo에서 수행하는 것이 효율적입니다.
    }, [searchQuery]); // searchQuery가 바뀔 때만 실행

    // 4. URL 파라미터 업데이트 (검색어 v => q 파라미터로)
    const handleSearchSubmit = useCallback((v: string) => {
        setParams({ q: v });
    }, [setParams]);

    // 5. 필터링된 검색 결과를 정렬하는 로직 (useMemo는 데이터가 바뀔 때만 정렬)
    const filteredAndSortedPosts = useMemo(() => {
        let results = [...searchResults]; // 현재 상태의 복사본으로 시작

        // 정렬 로직
        if (sortType === "latest") {
            // ID를 기준으로 가정
            results.sort((a, b) => (b.id as number) - (a.id as number));
        } else if (sortType === "popular") {
            // 좋아요 수를 기준으로 정렬
            results.sort((a, b) => {
                const likeA = (a.kind === 'user' ? a.likeCount : 0);
                const likeB = (b.kind === 'user' ? b.likeCount : 0);
                return likeB - likeA;
            });
        }
        return results;
    }, [searchResults, sortType]);


    // 6. 검색 결과 상태를 직접 업데이트하는 좋아요 토글 로직
    const handleToggleLike = useCallback((id: PostUser["id"]) => {
        setSearchResults(prevResults => {
            const targetId = Number(id);

            return prevResults.map(post => {
                if (post.kind !== 'user' || post.id !== targetId) {
                    return post;
                }

                // PostUser 타입인 경우에만 좋아요 상태를 토글
                const currentLiked = post.liked ?? false;
                const newLiked = !currentLiked;
                const newLikeCount = newLiked
                    ? post.likeCount + 1
                    : post.likeCount - 1;

                console.log(
                    `퀴즈 ID: ${post.id} | 좋아요: ${newLiked ? "ON" : "OFF"
                    } | likeCount: ${newLikeCount}`
                );

                // API 호출 예정
                // api.toggleLike(targetId);

                return {
                    ...post,
                    liked: newLiked,
                    likeCount: newLikeCount,
                } as PostUser; // PostUser 타입으로 반환
            });
        });
    }, []);


    // 검색 결과를 PostUser와 PostDaily로 분리
    const dailyPost: PostDaily[] = filteredAndSortedPosts.filter(
        (p): p is PostDaily => p.kind === "daily"
    );
    const userPosts: PostUser[] = filteredAndSortedPosts.filter(
        (p): p is PostUser => p.kind === "user"
    );

    return (
        <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
            <div className="flex h-full scrollbar-hide flex-col overflow-y-scroll overflow-x-hidden min-h-[calc(100vh-86px)] pb-[100px]">
                <header className="px-5 w-full h-[68px] flex items-center gap-2">
                    {/* 뒤로가기 버튼 */}
                    <button type="button" onClick={() => navigate("/community")} aria-label="뒤로가기">
                        <img src={LeftIcon} alt="뒤로가기" className="w-6 h-6" />
                    </button>

                    {/* 검색창 */}
                    <div className="w-full">
                        <SearchBar 
                            defaultValue={searchQuery}
                            onSubmit={handleSearchSubmit} 
                            placeholder="검색어를 입력하세요."
                        />
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

                    {/* 검색 결과 표시 */}
                    {searchQuery && (
                        <>
                            {/* 오늘의 게시글 */}
                            <div className="today-post">
                                <PostList
                                    // 좋아요 토글 함수 연결
                                    onToggleLike={handleToggleLike} 
                                    items={dailyPost}
                                    onClickComment={(id) => console.log("go comment:", id)}
                                />
                            </div>
                            {/* 사용자 게시글 */}
                            <div className="pb-[90px]">
                                <PostList
                                    items={userPosts}
                                    // 좋아요 토글 함수 연결
                                    onToggleLike={handleToggleLike} 
                                    onClickComment={(id) => console.log("go comment:", id)}
                                />
                                {filteredAndSortedPosts.length === 0 && (
                                    <div className="text-center py-20 text-neutral-500 typ-b3">
                                        "{searchQuery}"에 대한 검색 결과가 없습니다.
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {!searchQuery && (
                         <div className="text-center py-20 text-neutral-500 typ-b3">
                            검색어를 입력하고 커뮤니티 글을 찾아보세요!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default SearchListPage;