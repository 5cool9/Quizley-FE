// src/pages/CommunityPage.tsx
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

import TabBar, { TabKey } from "../component/tabbar";
import SearchBar from "../component/searchBar";
import Category from "../component/category";
import PostList, {
  type Post,
  type PostDaily,
  type PostUser,
} from "../component/postList";
import CalendarPop from "../component/calenderPop";

import HotPost from "../component/hotPost";
import CalendarIcon from "../assets/icon/icon_calender.svg";
import FloatingButton from "../assets/icon/FlottingButtonGradi.svg";
import IconX from "../assets/icon/icon_x_white.svg";
import BubbleTail from "../assets/icon/icon_bubble_tail.svg";

/* ----------------------- API 응답 형태 & 더미 데이터 ----------------------- */

// 백엔드에서 내려주는 카테고리 코드 맟추기
type CategoryCode = "미스터리" | "과학" | "문학" | "예술" | "역사" | "심리";

// 오늘의 퀴즈
type TodayQuizApi = {
  quizId: number;
  content: string;
  category: CategoryCode;
  publishedDate: string; // "2025-11-02"
  isLiked: boolean;
};

// 일반/핫 퀴즈 정보
type QuizSummaryApi = {
  quizId: number;
  content: string;
  category: CategoryCode;
  likeCount: number;
  commentCount: number;
  createdAt: string; // 2025-11-04T06:04:00
  isLiked?: boolean; // 없으면 false로 처리
};

// 커뮤니티 홈(카테고리+날짜 조합)
type CommunityHomeApi = {
  date: string; // 2025-11-02
  category: CategoryCode;
  todayQuiz: TodayQuizApi | null;
  hotQuiz: QuizSummaryApi[]; // HOT 인기글 리스트
  quizzes: QuizSummaryApi[]; // 일반 유저 퀴즈 리스트
};

// 더미 데이터
const DUMMY_HOME_BY_CATEGORY: Record<string, CommunityHomeApi> = {
  //과학
  science: {
    date: "2025-11-02",
    category: "과학",
    todayQuiz: {
      quizId: 14,
      content: "어제의 질문: 시간 여행이 가능하다면?",
      category: "과학",
      publishedDate: "2025-11-02",
      isLiked: false,
    },
    hotQuiz: [
      {
        quizId: 1,
        content: "과학 카테고리 HOT 퀴즈 1",
        category: "과학",
        likeCount: 12,
        commentCount: 3,
        createdAt: "2025-11-04T06:04:00",
        isLiked: false,
      },
      {
        quizId: 5,
        content: "과학 카테고리 HOT 퀴즈 2",
        category: "과학",
        likeCount: 30,
        commentCount: 10,
        createdAt: "2025-11-04T06:10:00",
        isLiked: true,
      },
    ],
    quizzes: [
      {
        quizId: 21,
        content: "블랙홀 안에서는 시간이 어떻게 될까?",
        category: "과학",
        likeCount: 5,
        commentCount: 2,
        createdAt: "2025-11-04T06:30:00",
        isLiked: false,
      },
      {
        quizId: 22,
        content: "양자컴퓨터가 보편화되면 무엇이 달라질까?",
        category: "과학",
        likeCount: 8,
        commentCount: 4,
        createdAt: "2025-11-04T08:00:00",
        isLiked: true,
      },
    ],
  },

  //문학
  literature: {
    date: "2025-11-02",
    category: "문학",
    todayQuiz: {
      quizId: 4,
      content: "유명한 문학 퀴즈 1",
      category: "문학",
      publishedDate: "2025-11-02",
      isLiked: false,
    },
    hotQuiz: [
      {
        quizId: 4,
        content: "유명한 문학 퀴즈 1",
        category: "문학",
        likeCount: 0,
        commentCount: 0,
        createdAt: "2025-11-04T06:04:00",
      },
    ],
    quizzes: [],
  },

  //역사
  history: {
    date: "2025-11-02",
    category: "역사",
    todayQuiz: {
      quizId: 30,
      content: "어제의 역사 질문: 왕이 되지 않았다면?",
      category: "역사",
      publishedDate: "2025-11-02",
      isLiked: false,
    },
    hotQuiz: [
      {
        quizId: 2,
        content: "유명한 역사 퀴즈 1",
        category: "역사",
        likeCount: 10,
        commentCount: 1,
        createdAt: "2025-11-04T06:04:22",
      },
      {
        quizId: 3,
        content: "유명한 역사 퀴즈 2",
        category: "역사",
        likeCount: 5,
        commentCount: 0,
        createdAt: "2025-11-04T06:04:22",
      },
    ],
    quizzes: [],
  },
  //예술
  art: {
    date: "2025-11-03",
    category: "예술",
    todayQuiz: {
      quizId: 4,
      content: "유명한 심리 퀴즈 1",
      category: "예술",
      publishedDate: "2025-11-03",
      isLiked: false,
    },
    hotQuiz: [
      {
        quizId: 4,
        content: "유명한 심리 퀴즈 2",
        category: "예술",
        likeCount: 110,
        commentCount: 5,
        createdAt: "2025-11-04T06:04:00",
      },
    ],
    quizzes: [],
  },
  //미스터리
  mystery: {
    date: "2025-11-02",
    category: "미스터리",
    todayQuiz: null,
    hotQuiz: [],
    quizzes: [],
  },

  // 심리
  psychology: {
    date: "2025-11-02",
    category: "심리",
    todayQuiz: null,
    hotQuiz: [],
    quizzes: [],
  },
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

/* ---------------------------------------------------- */

const CommunityPage = () => {
  const nav = useNavigate();

  // 하단 탭바 상태
  const [activeTab, setActiveTab] = useState<TabKey>("community");

  // 정렬: 최신순 / 인기순
  const [sortType, setSortType] = useState<"latest" | "popular">("latest");

  // 질문 생성 말풍선
  const [showTip, setShowTip] = useState(true);

  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState("2025-11-02");

  // 카테고리
  const [activeCategoryId, setActiveCategoryId] =
    useState<string>("science");

  // 현재 화면에 보여줄 "오늘의 + 핫 + 일반" 데이터를 한 번에 관리
  const [homeData, setHomeData] = useState<CommunityHomeApi>(
    DUMMY_HOME_BY_CATEGORY[activeCategoryId]
  );

  // 날짜 텍스트용(상단에 보여줄 포맷)
  const displayDate = selectedDate.replace(/-/g, ".");

  // ✅ 카테고리/날짜가 바뀔 때마다 데이터 다시 세팅
  // 지금은 더미에서 꺼내지만, 나중에는 여기서 fetch로 API 호출하면 됨
  useEffect(() => {
    const dummy = DUMMY_HOME_BY_CATEGORY[activeCategoryId];
    setHomeData(dummy);
  }, [activeCategoryId, selectedDate]);

  // ---------------- 캘린더 관련 상태 ----------------
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    new Date().getMonth()
  ); // 0-based
  const [selectedDay, setSelectedDay] = useState(2);

  const handleOpenCalendar = () => setIsCalendarOpen(true);
  const handleCloseCalendar = () => setIsCalendarOpen(false);

  const handleSelectDate = (day: number) => {
    setSelectedDay(day);

    // API용(YYYY-MM-DD)
    const apiDate = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    setSelectedDate(apiDate);

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

  // ---------------- 오늘의 질문 / 일반 질문 매핑 ----------------

  // 오늘의 퀴즈 → PostDaily로 변환
  const dailyPosts: PostDaily[] = homeData.todayQuiz
    ? [
        {
          id: homeData.todayQuiz.quizId,
          kind: "daily",
          title: homeData.todayQuiz.content,
          dateText: homeData.todayQuiz.publishedDate.replace(/-/g, "."),
          commentCount: 10,
        },
      ]
    : [];

  // 정렬된 일반 퀴즈 목록
  const sortedQuizzes: QuizSummaryApi[] = [...homeData.quizzes].sort(
    (a, b) => {
      if (sortType === "latest") {
        // 최신순
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }
      // 인기순
      return b.likeCount - a.likeCount;
    }
  );

  // 일반 퀴즈 매핑
  const userPosts: PostUser[] = sortedQuizzes.map((q) => ({
    id: q.quizId,
    kind: "user",
    nickname: "닉네임", // API에 nickname 생기면 교체
    title: q.content,
    timeText: "3시간 전", // createdAt → "n시간 전"으로 계산하는 로직은 나중에
    likeCount: q.likeCount,
    commentCount: q.commentCount,
    liked: q.isLiked ?? false,
  }));

  // ---------------- 좋아요(일반/핫) ----------------
  const handleToggleLike = useCallback((id: PostUser["id"]) => {
    setHomeData((prev) => {
      const targetId = Number(id);

      const updateList = (list: QuizSummaryApi[]) =>
        list.map((q) => {
          if (q.quizId !== targetId) return q;

          const currentLiked = q.isLiked ?? false;
          const newLiked = !currentLiked;
          const newLikeCount = newLiked
            ? q.likeCount + 1
            : q.likeCount - 1;

          console.log(
            `퀴즈 ID: ${q.quizId} | 좋아요: ${
              newLiked ? "ON" : "OFF"
            } | likeCount: ${newLikeCount}`
          );

          return {
            ...q,
            isLiked: newLiked,
            likeCount: newLikeCount,
          };
        });

      return {
        ...prev,
        quizzes: updateList(prev.quizzes),
        hotQuiz: updateList(prev.hotQuiz),
      };
    });
  }, []);

  // ---------------- HOT 인기글 슬라이더 ----------------

  const hotItems = homeData.hotQuiz; // QuizSummaryApi[]
  const [hotIndex, setHotIndex] = useState(0);

  const { dragBind: hotDrag } = useDragScroll();
  const { ref: hotRef, ...restHotDragBind } = hotDrag;

  // 인디케이터 클릭 → 해당 슬라이드로 스크롤
  const scrollToHot = (i: number) => {
    const el = hotRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setHotIndex(i);
  };

  // 스크롤 시 현재 위치에 맞게 인디케이터 업데이트
  const onHotScroll = () => {
    const el = hotRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== hotIndex) setHotIndex(i);
  };

  // ---------------- 카테고리 영역 드래그 스크롤 ----------------
  const { dragBind: catDrag } = useDragScroll();
  const { ref: catDragRef, ...restCatDragBind } = catDrag;

  const createQBtn = () => {
    nav("/create");
  };

  return (
    <div className="relative bg-elevated w-full max-w-[393px] mx-auto min-h-screen">
      <div className="flex h-full scrollbar-hide flex-col overflow-y-scroll overflow-x-hidden min-h-[calc(100vh-86px)] pb-[100px]">
        {/* 상단 헤더 */}
        <header className="px-5 w-full h-[68px] flex items-center">
          <h1 className="text-[24px] typ-h2">커뮤니티</h1>
        </header>

        {/* 검색창 */}
        <div className="px-5 w-full">
          <SearchBar />
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
            onChange={setActiveCategoryId}
          />
        </div>

        {/* HOT 인기글 슬라이더 */}
        <div className="flex flex-col w-full gap-2 my-6">
          <h1 className="px-5 typ-h5 text-neutral-900">🔥HOT 인기글</h1>

          <div
            ref={hotRef}
            onScroll={onHotScroll}
            className="overflow-x-auto overflow-y-hidden no-scrollbar
                       snap-x snap-mandatory scroll-smooth touch-pan-x
                       cursor-grab active:cursor-grabbing select-none"
            {...restHotDragBind}
          >
            <div className="flex">
              {hotItems.map((q, i) => (
                <div
                  key={q.quizId}
                  className="snap-start shrink-0 w-full px-5"
                >
                  <HotPost
                    title={q.content}
                    likeCount={q.likeCount}
                    commentCount={q.commentCount}
                  />
                </div>
              ))}
              {hotItems.length === 0 && (
                <div className="snap-start shrink-0 w-full px-5">
                  <div className="w-full rounded-[10px] px-5 py-4 bg-neutral-50 text-neutral-500 typ-b2">
                    아직 HOT 인기글이 없습니다.
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
                  className={`h-[6px] w-[6px] rounded-full ${
                    i === hotIndex ? "bg-primary-700" : "bg-neutral-300"
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
                ${
                  sortType === "latest"
                    ? "bg-primary-100 border-primary-700"
                    : "bg-neutral-50 border-transparent "
                }`}
            >
              최신순
            </button>

            <button
              onClick={() => setSortType("popular")}
              className={`h-[35px] w-[74px] rounded-full border border-solid typ-b6 transition text-neutral-650
                ${
                  sortType === "popular"
                    ? "bg-primary-100 border-primary-700"
                    : "bg-neutral-50 border-transparent"
                }`}
            >
              인기순
            </button>
          </div>

          {/* 오늘의 질문 */}
          <div className="today-post">
            <PostList
              items={dailyPosts}
              onClickComment={(id) =>
                console.log("오늘의 질문 댓글로 이동:", id)
              }
            />
          </div>

          {/* 사용자 질문 리스트 */}
          <div className="pb-[90px]">
            <PostList
              items={userPosts}
              onToggleLike={handleToggleLike}
              onClickComment={(id) =>
                console.log("일반 질문 댓글로 이동:", id)
              }
            />
          </div>

          {/* 캘린더 팝업 */}
          {isCalendarOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[100px]">
              {/* 뒷배경 */}
              <div
                className="absolute inset-0 bg-black/70"
                onClick={handleCloseCalendar}
              />
              {/* 캘린더 컴포넌트 */}
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
            <div className="relative w-[164px] h-[32px] bg-neutral-700 text-white p-2 rounded-lg shadow-md flex items-center gap-2">
              <span className="typ-b1">직접 질문을 만들어보세요!</span>
              <button
                onClick={() => setShowTip(false)}
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
