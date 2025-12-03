import {
  fetchCommunityHome,
  fetchCommunityWeekendHome,
  toggleQuizLike,
  type CommunityHomeApi,
  type CategoryCode,
  type QuizSummaryApi,
} from "@/api/communityApi";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

import TabBar, { TabKey } from "@/component/tabbar";
import SearchBar from "@/component/searchBar";
import Category from "@/component/category";
import PostList, {
  type PostDaily,
  type PostUser,
} from "@/component/postList";
import CalendarPop from "@/component/calenderPop";
import WeekendGameResult from "@/component/weekendGameResult";

import HotPost from "@/component/hotPost";
import CalendarIcon from "@/assets/icon/icon_calender.svg";
import FloatingButton from "@/assets/icon/FlottingButtonGradi.svg";
import IconX from "@/assets/icon/icon_x_white.svg";
import BubbleTail from "@/assets/icon/icon_bubble_tail.svg";

/* ----------------------- 카테고리 매핑 상수 ----------------------- */

const CATEGORY_ID_TO_CODE: Record<string, CategoryCode> = {
  science: "과학",
  literature: "문학",
  history: "역사",
  art: "예술",
  mystery: "미스터리",
  psychology: "심리",
};


/* ----------------------- 가로 드래그 스크롤 커스텀 훅----------------------- */

const useDragScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);

  const getScrollLeft = () => ref.current?.scrollLeft ?? 0;
  const setScrollLeft = (v: number) => {
    if (ref.current) ref.current.scrollLeft = v;
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDrag(true);
    setStartX(e.pageX + getScrollLeft());
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrag) return;
    setScrollLeft(startX - e.pageX);
  };

  const onMouseUp = () => setIsDrag(false);
  const onMouseLeave = () => setIsDrag(false);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDrag(true);
    setStartX(e.touches[0].pageX + getScrollLeft());
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDrag) return;
    setScrollLeft(startX - e.touches[0].pageX);
  };

  const onTouchEnd = () => setIsDrag(false);

  const dragBind = {
    ref,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } as const;

  return { dragBind };
};

const CATEGORY_STORAGE_KEY = "communityCategory";

/* ---------------------------------------------------- */

const CommunityPage = () => {
  type WeekendOption = {
    label: string;
    percent: number;
    variant: "primary" | "gray";
  };

  const nav = useNavigate();

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = today.getMonth();
  const dd = today.getDate();

  const mm2 = String(mm + 1).padStart(2, "0");
  const dd2 = String(dd).padStart(2, "0");
  const todayStr = `${yyyy}-${mm2}-${dd2}`;


  // 마지막으로 선택한 날짜(localStorage)
  const LAST_DATE_KEY = "community_last_date";
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem(LAST_DATE_KEY);
    return saved ?? todayStr;
  });

  // 하단 탭바 상태
  const [activeTab, setActiveTab] = useState<TabKey>("community");

  // 정렬: 최신순 / 인기순
  const [sortType, setSortType] = useState<"latest" | "popular">("latest");

  // 질문 생성 말풍선
  const [showTip, setShowTip] = useState(true);

  // 카테고리 (API 요청 시 이 값이 사용됨)
  const [activeCategoryId, setActiveCategoryId] = useState<string>("science");

  // 선택된 날짜가 주말인지 여부 (토/일)
  const isWeekend = (() => {
    const d = new Date(selectedDate);
    const day = d.getDay(); // 0: 일, 6: 토
    return day === 0 || day === 6;
  })();

  // 현재 화면에 보여줄 "오늘의 + 핫 + 일반" 데이터를 한 번에 관리
  const [homeData, setHomeData] = useState<CommunityHomeApi | null>(null);

  // 로딩/에러 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------- 캘린더 관련 상태 ----------------
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(yyyy);
  const [currentMonth, setCurrentMonth] = useState(mm);
  const [selectedDay, setSelectedDay] = useState(dd);

  // ---------------- HOT 인기글 슬라이더 상태/훅 ----------------
  const [hotIndex, setHotIndex] = useState(0);
  const { dragBind: hotDrag } = useDragScroll();
  const { ref: hotRef, ...restHotDragBind } = hotDrag;

  // ---------------- 카테고리 영역 드래그 스크롤 ----------------
  const { dragBind: catDrag } = useDragScroll();
  const { ref: catDragRef, ...restCatDragBind } = catDrag;

 useEffect(() => {
  try {
    const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (saved) {
      setActiveCategoryId(saved);
    } else {
      setActiveCategoryId("mystery"); // 기본 카테고리
    }
  } catch (e) {
    console.error("카테고리 복원 실패:", e);
    setActiveCategoryId("science");
  }
}, []);


  // ---------------- 최초 마운트 시 말풍선 localStorage 확인 ----------------
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("community_tip_dismissed");
      if (dismissed === "true") {
        setShowTip(false);
      }
    } catch (e) {
      console.error("localStorage 접근 오류:", e);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const categoryKo = CATEGORY_ID_TO_CODE[activeCategoryId] ?? "심리";
      setLoading(true);
      setError(null);
      try {
        // 선택된 날짜가 주말인지 계산
        const d = new Date(selectedDate);
        const day = d.getDay();            // 0: 일, 6: 토
        const isWeekendDay = day === 0 || day === 6;

        const data = isWeekendDay
          ? await fetchCommunityWeekendHome({
            date: selectedDate,
            category: categoryKo,
          })
          : await fetchCommunityHome({
            date: selectedDate,
            category: categoryKo,
          });

        setHomeData(data);
      } catch (e: any) {
        console.error("커뮤니티 홈 로딩 실패:", e);

        if (e.status === 401) {
          alert("로그인이 필요합니다. 다시 로그인해주세요.");
          nav("/login");
        } else {
          setError(e.message ?? "커뮤니티 홈 로딩 실패");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [selectedDate, activeCategoryId, nav]);

  // 카테고리 변경 + localStorage 저장
  const handleChangeCategoryId = (nextId: string) => {
    setActiveCategoryId(nextId);
    try {
      localStorage.setItem(CATEGORY_STORAGE_KEY, nextId);
    } catch (e) {
      console.error("카테고리 localStorage 저장 실패:", e);
    }
  };

  // ---------------- 좋아요(일반/핫) ----------------
  const handleToggleLike = useCallback(
    async (id: PostUser["id"]) => {
      const quizId = Number(id);

      // 1) UI 먼저 토글(낙관적 업데이트)
      setHomeData((prev) => {
        if (!prev) return prev;

        const updateList = (list: QuizSummaryApi[]) =>
          list.map((q) => {
            if (q.quizId !== quizId) return q;
            const currentLiked = q.isLiked ?? false;
            const newLiked = !currentLiked;
            const newLikeCount = newLiked ? q.likeCount + 1 : q.likeCount - 1;
            return { ...q, isLiked: newLiked, likeCount: newLikeCount };
          });

        return {
          ...prev,
          quizzes: updateList(prev.quizzes),
          hotQuiz: updateList(prev.hotQuiz),
        };
      });

      // 2) 서버에 좋아요 요청
      try {
        await toggleQuizLike(quizId);
      } catch (e: any) {
        console.error("좋아요 토글 실패:", e);

        if (e.status === 401 || (e.message ?? "").includes("로그인")) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          nav("/login");
          return;
        }

        alert(e.message ?? "좋아요 처리에 실패했습니다.");

        // 3) 실패 시 UI 롤백
        setHomeData((prev) => {
          if (!prev) return prev;

          const updateList = (list: QuizSummaryApi[]) =>
            list.map((q) => {
              if (q.quizId !== quizId) return q;
              const currentLiked = q.isLiked ?? false;
              const newLiked = !currentLiked;
              const newLikeCount = newLiked
                ? q.likeCount + 1
                : q.likeCount - 1;
              return { ...q, isLiked: newLiked, likeCount: newLikeCount };
            });

          return {
            ...prev,
            quizzes: updateList(prev.quizzes),
            hotQuiz: updateList(prev.hotQuiz),
          };
        });
      }
    },
    [nav]
  );

  // 날짜 텍스트용(상단에 보여줄 포맷)
  const displayDate = selectedDate.replace(/-/g, ".");

  //평일/주말 라우팅
  const goToTodayDetail = (id: number | string) => {
    const d = new Date(selectedDate);
    const day = d.getDay(); //0이 일요일, 6이 토요일
    const isWeekendDay = day === 0 || day === 6;

    if (isWeekendDay) {
      nav(`/community/weekend/${id}`);
    } else {
      nav(`/community/today/${id}`);
    }
  };

  // 유저 질문 상세로 이동
  const goToUserDetail = (id: number | string) => {
    nav(`/community/user/${id}`);
  };

  // PostList 아이템 클릭 공통 핸들러
  const handleClickPostItem = (
    id: number | string,
    kind: "daily" | "user"
  ) => {
    if (kind === "daily") {
      goToTodayDetail(id);
    } else {
      goToUserDetail(id);
    }
  };

  // 검색 관련 로직
  const handleSearchSubmit = (value: string) => {
    const keyword = value.trim();
    if (!keyword) return;

    const categoryKo = CATEGORY_ID_TO_CODE[activeCategoryId];

    nav(
      `/community/search?q=${encodeURIComponent(keyword)}&category=${encodeURIComponent(categoryKo)}`
    );
  };

  // 캘린더 열기/닫기
  const handleOpenCalendar = () => setIsCalendarOpen(true);
  const handleCloseCalendar = () => setIsCalendarOpen(false);

  const handleSelectDate = (day: number) => {
    setSelectedDay(day);

    const apiDate = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    setSelectedDate(apiDate);
    localStorage.setItem(LAST_DATE_KEY, apiDate);

    setIsCalendarOpen(false);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  //질문 추가생성 말풍선 한동안 닫기
  const handleCloseTip = () => {
    setShowTip(false);
    try {
      localStorage.setItem("community_tip_dismissed", "true");
    } catch (e) {
      console.error("localStorage 저장 오류:", e);
    }
  };

  // ---------------- homeData 준비 전 로딩/에러 처리 ----------------
  if (!homeData) {
    return (
      <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
        <div className="flex h-full items-center justify-center">
          {loading
            ? "불러오는 중..."
            : error
              ? `오류: ${error}`
              : "데이터를 불러오는 중입니다."}
        </div>
      </div>
    );
  }

  // ---------------- 오늘의 질문 / 일반 질문 매핑 ----------------

  // 오늘의 퀴즈 → PostDaily로 변환
  const dailyPosts: PostDaily[] = homeData.todayQuiz
    ? [
      {
        id: homeData.todayQuiz.quizId,
        kind: "daily",
        title: homeData.todayQuiz.content,
        dateText: homeData.todayQuiz.publishedDate.replace(/-/g, "."),
        commentCount: homeData.todayQuiz.commentCount
      },
    ]
    : [];

  // 정렬된 일반 퀴즈 목록
  const sortedQuizzes: QuizSummaryApi[] = [...homeData.quizzes].sort(
    (a, b) => {
      if (sortType === "latest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return b.likeCount - a.likeCount;
    }
  );

  // 일반 퀴즈 매핑
  const userPosts: PostUser[] = sortedQuizzes.map((q) => ({
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

  // ---------------- HOT 인기글 슬라이더 ----------------

  // HOT 인기글 슬라이더 위쪽에
  const hotItems = [...homeData.hotQuiz].sort(
    (a, b) => b.likeCount - a.likeCount
  );

  const scrollToHot = (i: number) => {
    const el = hotRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setHotIndex(i);
  };

  const onHotScroll = () => {
    const el = hotRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== hotIndex) setHotIndex(i);
  };

  const createQBtn = () => {
    nav("/community/create");
  };

  // 오늘의 투표 결과 (주말용)
  const voteResult = homeData.todayQuiz?.voteResult ?? null;

  const weekendOptions: [WeekendOption, WeekendOption] | null = voteResult
    ? [
      {
        label: voteResult.sideALabel,
        percent: voteResult.sideAPercentage,
        variant:
          voteResult.sideAPercentage >= voteResult.sideBPercentage
            ? "primary"
            : "gray",
      },
      {
        label: voteResult.sideBLabel,
        percent: voteResult.sideBPercentage,
        variant:
          voteResult.sideBPercentage > voteResult.sideAPercentage
            ? "primary"
            : "gray",
      },
    ]
    : null;

  let weekendImageUrl: string | undefined;
  if (voteResult) {
    const aWin = voteResult.sideAPercentage >= voteResult.sideBPercentage;
    weekendImageUrl = aWin
      ? voteResult.sideAImageUrl
      : voteResult.sideBImageUrl;
  }

  return (
    <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
      <div className="flex h-full scrollbar-hide flex-col overflow-y-scroll overflow-x-hidden min-h-[calc(100vh-86px)] pb-[100px]">
        {/* 상단 헤더 */}
        <header className="px-5 h-[68px] w-full flex items-center">
          <h1 className="text-[24px] typ-h2">커뮤니티</h1>
        </header>

        {/* 검색창 */}
        <div className="w-full px-5">
          <SearchBar onSubmit={handleSearchSubmit} />
        </div>

        {/* 날짜 선택 영역 */}
        <div className="px-5 w-full h-[68px] flex items-center">
          <button
            className="flex flex-row items-center gap-1"
            onClick={handleOpenCalendar}
          >
            <img src={CalendarIcon} alt="날짜선택" className="w-6" />
            <h2 className="typ-h4 text-secondary">
              {displayDate || "2025.11.02"}
            </h2>
          </button>
        </div>

        {/* 카테고리 (가로 드래그 스크롤) */}
        <div
          ref={catDragRef}
          className="w-[393px] px-5 overflow-x-auto overflow-y-hidden no-scrollbar cursor-grab active:cursor-grabbing select-none touch-pan-x"
          {...restCatDragBind}
        >
          <Category
            className="h-[35px] flex-nowrap whitespace-nowrap"
            activeId={activeCategoryId}
            onChange={handleChangeCategoryId}
          />
        </div>

        {/* HOT 인기글 슬라이더 */}
        <div className="flex flex-col w-full gap-2 my-6">
          <h1 className="px-5 typ-h5 text-neutral-900">HOT 인기글</h1>

          <div
            ref={hotRef}
            onScroll={onHotScroll}
            className="overflow-x-auto overflow-y-hidden no-scrollbar
                       snap-x snap-mandatory scroll-smooth touch-pan-x
                       cursor-pointer active:cursor-grabbing select-none"
            {...restHotDragBind}
          >
            <div className="flex">
              {hotItems.map((q) => (
                <div
                  key={q.quizId}
                  className="snap-start shrink-0 w-full px-5"
                  onClick={() => goToUserDetail(q.quizId)}
                >
                  <HotPost
                    title={q.content}
                    likeCount={q.likeCount}
                    commentCount={q.commentCount}
                    liked={q.isLiked ?? false}
                    onClickLike={(e) => {
                      e.stopPropagation();
                      handleToggleLike(q.quizId);
                    }}
                  />
                </div>
              ))}
              {hotItems.length === 0 && (
                <div className="snap-start shrink-0 w-full px-5">
                  <div className="w-full rounded-[10px] px-5 py-4 bg-neutral-50 text-neutral-500 typ-b2">
                    {homeData.hotQuiz.length === 0 &&
                      homeData.todayQuiz === null
                      ? `${displayDate}에는 데이터가 없습니다.`
                      : `아직 HOT 인기글이 없습니다.`}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 인디케이터 */}
          <div className="mt-2 flex justify-center items-center gap-[6px]">
            {hotItems.length > 0 &&
              hotItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToHot(i)}
                  aria-label={`인기글 ${i + 1}`}
                  className={`h-[6px] w-[6px] rounded-full ${i === hotIndex ? "bg-primary-700" : "bg-neutral-300"
                    }`}
                />
              ))}
          </div>
        </div>

        {/* 회색 경계 */}
        <div className="w-full h-4 bg-neutral-50" />

        {/* 게시글 리스트 */}
        <div className="posts">
          {/* 정렬 버튼 */}
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

          {/* 오늘의 질문 / 주말 게임 결과 */}
          <div className="today-post cursor-pointer ">
            {isWeekend && homeData.todayQuiz && weekendOptions ? (
              <div className="flex flex-col gap-2">
                <p className="typ-b1 text-primary-700 font-semibold px-5">
                  Today's Quiz
                </p>
                <div
                  className="cursor-pointer px-5"
                  onClick={() => {
                    const quizId = homeData.todayQuiz?.quizId ?? 1;
                    goToTodayDetail(quizId);
                  }}
                >
                  <WeekendGameResult
                    title={homeData.todayQuiz.content}
                    imageUrl={weekendImageUrl}
                    options={weekendOptions}
                  />
                </div>

                {/*<div className="flex items-center justify-between px-5">
                  <span className="typ-b1 text-neutral-400">{displayDate}</span>

                  <div className="mt-1 flex items-center gap-1">
                    <img
                      src={IconComment}
                      alt=""
                    />
                    <span className="typ-b1 text-neutral-400">
                      {homeData.todayQuiz.commentCount}
                    </span>
                  </div>
                </div>*/}
                <div className="h-[1px] bg-neutral-200 w-full my-2" />

              </div>

            ) : (
              <PostList
                iconSize="sm"
                items={dailyPosts}
                onClickItem={(id, kind) => handleClickPostItem(id, kind)}
                onClickComment={(id) =>
                  console.log("오늘의 질문 댓글로 이동: ", id)
                }
              />
            )}
          </div>

          {/* 사용자 질문 리스트 */}
          <div className="pb-[90px] cursor-pointer">
            {userPosts.length > 0 ? (
              <PostList
                items={userPosts}
                onToggleLike={handleToggleLike}
                onClickItem={(id, kind) => handleClickPostItem(id, kind)}
                onClickComment={(id) =>
                  console.log("일반 질문 댓글로 이동:", id)
                }
              />
            ) : (
              <div className="w-full px-5 py-4 text-neutral-500 typ-b2 text-center">
                {homeData.hotQuiz.length === 0 &&
                  homeData.todayQuiz === null &&
                  homeData.quizzes.length === 0
                  ? `${displayDate}에는 질문 데이터가 없습니다.`
                  : `아직 해당 카테고리에 질문이 없습니다.`}
              </div>
            )}
          </div>

          {/* 캘린더 팝업 */}
          {isCalendarOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[120px]">
              <div
                className="absolute inset-0 bg-black/70"
                onClick={handleCloseCalendar}
              />
              <CalendarPop
                year={currentYear}
                monthZeroBase={currentMonth}
                selected={selectedDay}
                onPrev={handlePrevMonth}
                onNext={handleNextMonth}
                onSelect={handleSelectDate}
              />
            </div>
          )}
        </div>
      </div>

      {/* 질문 생성 플로팅 버튼 + 말풍선 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-[393px]">
        {showTip && (
          <div className="absolute right-[20px] bottom-[190px]">
            <div className="relative w-auto min-w-[164px] h-[32px] bg-neutral-700 text-white p-2 rounded-lg shadow-md flex items-center gap-2">
              <span className="typ-b1">직접 질문을 만들어보세요!</span>
              <button
                onClick={handleCloseTip}
                className="text-sm font-bold bg-neutral-700 hover:bg-neutral-600 rounded-full"
                aria-label="닫기"
              >
                <img src={IconX} alt="X" />
              </button>
              <div className="absolute -bottom-1 right-6 w-[16px] h-[8px]">
                <img src={BubbleTail} alt="말풍선꼬리" />
              </div>
            </div>
          </div>
        )}

        <button
          className="absolute right-[20px] bottom-[114px] w-[70px] h-[70px]"
          onClick={createQBtn}
        >
          <img src={FloatingButton} alt="질문추가버튼" />
        </button>
      </div>

      {/* 고정 하단 탭바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[393px]">
        <TabBar active={activeTab} onChange={(k) => setActiveTab(k)} />
      </div>
    </div>
  );
};

export default CommunityPage;
