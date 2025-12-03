import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useCallback, useEffect } from "react";

import SearchBar from "@/component/searchBar";
import type { Post, PostDaily, PostUser } from "@/component/postList";
import PostList from "@/component/postList";
import LeftIcon from "@/assets/icon/icon_left.svg";
import {
  fetchCommunitySearch,
  toggleQuizLike,
  type CategoryCode,
} from "@/api/communityApi";

const CATEGORY_ID_TO_CODE: Record<string, CategoryCode> = {
  science: "과학",
  literature: "문학",
  history: "역사",
  art: "예술",
  mystery: "미스터리",
  psychology: "심리",
};

const SearchListPage = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = params.get("q") ?? "";
  const categoryParam = params.get("category") as CategoryCode | null;

  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [sortType, setSortType] = useState<"latest" | "popular">("latest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 검색 API 호출
  useEffect(() => {
    const load = async () => {
      if (!searchQuery) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchCommunitySearch({
          keyword: searchQuery,
          sortBy: sortType,
        });

        let quizzes = data.quizzes;

        //카테고리 필터링
        if (categoryParam) {
          const categoryKo = CATEGORY_ID_TO_CODE[categoryParam] ?? null;

          if (categoryKo) {
            quizzes = quizzes.filter((q) => q.category === categoryKo);
          }
        }


        const posts: PostUser[] = quizzes.map((q) => ({
          id: q.quizId,
          kind: "user",
          nickname: q.nickname ?? "익명",
          title: q.content,
          timeText: q.createdAt
            ? q.createdAt
            : q.publishedDate
              ? q.publishedDate.replace(/-/g, ".")
              : "",
          likeCount: q.likeCount,
          commentCount: q.commentCount,
          liked: q.isLiked ?? false,
        }));

        setSearchResults(posts);
      } catch (e: any) {
        console.error("검색 실패:", e);
        setError(e.message ?? "검색 중 오류가 발생했습니다.");

        if (e.status === 401 || (e.message ?? "").includes("로그인")) {
          alert("로그인이 필요합니다. 다시 로그인해주세요.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchQuery, sortType, categoryParam, navigate]);


  // 검색어 입력 후 엔터 → URL q 파라미터 갱신
  const handleSearchSubmit = useCallback(
    (v: string) => {
      const trimmed = v.trim();
      if (!trimmed) return;

      const next: Record<string, string> = { q: trimmed };
      if (categoryParam) next.category = categoryParam;
      setParams(next);
    },
    [setParams, categoryParam]
  );

  //검색 결과 클릭 핸들러
  const handleClickSearchResult = (quizId: number) => {
    navigate(`/community/user/${quizId}`);
  };

  // 정렬 적용된 결과
  const filteredAndSortedPosts = useMemo(() => {
    let results = [...searchResults];

    if (sortType === "latest") {
      results.sort((a, b) => (Number(b.id) as number) - (Number(a.id) as number));
    } else if (sortType === "popular") {
      results.sort((a, b) => {
        const likeA = a.kind === "user" ? (a.likeCount ?? 0) : 0;
        const likeB = b.kind === "user" ? (b.likeCount ?? 0) : 0;
        return likeB - likeA;
      });
    }

    return results;
  }, [searchResults, sortType]);

  // 좋아요 토글
  const handleToggleLike = useCallback(
    async (id: PostUser["id"]) => {
      const targetId = Number(id);

      // 1) UI 먼저 토글
      setSearchResults((prevResults) =>
        prevResults.map((post) => {
          if (post.kind !== "user" || post.id !== targetId) return post;

          const currentLiked = post.liked ?? false;
          const newLiked = !currentLiked;
          const newLikeCount = newLiked
            ? post.likeCount + 1
            : post.likeCount - 1;

          return {
            ...post,
            liked: newLiked,
            likeCount: newLikeCount,
          } as PostUser;
        })
      );

      try {
        await toggleQuizLike(targetId);
      } catch (err: any) {
        console.error(err);
        if (err.status === 401 || (err.message ?? "").includes("로그인")) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/login");
          return;
        }

        alert("좋아요 처리 중 오류가 발생했습니다.");

        // 실패 시 되돌리기
        setSearchResults((prevResults) =>
          prevResults.map((post) => {
            if (post.kind !== "user" || post.id !== targetId) return post;

            const currentLiked = post.liked ?? false;
            const newLiked = !currentLiked;
            const newLikeCount = newLiked
              ? post.likeCount + 1
              : post.likeCount - 1;

            return {
              ...post,
              liked: newLiked,
              likeCount: newLikeCount,
            } as PostUser;
          })
        );
      }
    },
    [navigate]
  );

  const dailyPost: PostDaily[] = filteredAndSortedPosts.filter(
    (p): p is PostDaily => p.kind === "daily"
  );
  const userPosts: PostUser[] = filteredAndSortedPosts.filter(
    (p): p is PostUser => p.kind === "user"
  );

  // 검색 아이템 클릭
  const handleClickSearchItem = (id: number | string) => {
    navigate(`/community/user/${id}`);
  };
  return (
    <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
      <div className="flex h-full scrollbar-hide flex-col overflow-y-scroll overflow-x-hidden min-h-[calc(100vh-86px)] pb-[100px]">
        <header className="px-5 w-full h-[68px] flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/community")}
            aria-label="뒤로가기"
          >
            <img src={LeftIcon} alt="뒤로가기" className="w-6 h-6" />
          </button>

          <div className="w-full">
            <SearchBar
              defaultValue={searchQuery}
              onSubmit={handleSearchSubmit}
              placeholder="검색어를 입력하세요."
            />
          </div>
        </header>

        <div className="posts">
          <div className="px-5 w-full h-[75px] flex flex-row gap-2 items-center">
            <button
              onClick={() => setSortType("latest")}
              className={`h-[35px] w-[74px] rounded-full border border-solid typ-b6 transition text-neutral-650
              ${sortType === "latest"
                  ? "bg-primary-100 border-primary-700"
                  : "bg-neutral-50 border-transparent "
                }`}
            >
              최신순
            </button>
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

          <div className="w-full h-4 bg-neutral-50" />

          {loading && (
            <div className="text-center py-20 text-neutral-500 typ-b3">
              검색 중입니다...
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-20 text-red-500 typ-b3">
              {error}
            </div>
          )}

          {!loading && !error && searchQuery && (
            <>
              {/* 오늘의 게시글(추후 사용가능성을 위해) 유지) */}
              <div className="today-post">
                <PostList
                  onToggleLike={handleToggleLike}
                  items={dailyPost}
                  onClickComment={(id) => console.log("go comment:", id)}
                />
              </div>
              {/* 사용자 게시글 */}
              <div className="pb-[90px] cursor-pointer">
                <PostList
                  items={userPosts}
                  onToggleLike={handleToggleLike}
                  onClickItem={(id) => handleClickSearchItem(id)}
                  onClickComment={(id) => handleClickSearchItem(id)}
                />
                {filteredAndSortedPosts.length === 0 && (
                  <div className="text-center py-20 text-neutral-500 typ-b3">
                    "{searchQuery}"에 대한 검색 결과가 없습니다.
                  </div>
                )}
              </div>
            </>
          )}

          {!searchQuery && !loading && !error && (
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
