// src/App.jsx
import { useState } from "react";
import TabBar from "./component/tabbar";
import BtnLong from "./component/btnLong";
import InputThink from "./component/inputThink";
import BtnShort from "./component/btnShort";
import Header from "./component/header";
import LoginInput from "./component/loginInput";
import AnswerQInput from "./component/answerQInput";
import PostList from "./component/postList";
import HotPost from "./component/hotPost";
import CommentList from "./component/commentList";
import SearchBar from "./component/searchBar";
import CommentInput from "./component/commentInput";
import Category from "./component/category";
import ChatBubble from "./component/chatBubble";
import ReportMap from "./component/reportMap";
import WeekendGameResult from "./component/weekendGameResult";
import Calendar from "./component/calendar";
import CalendarPop from "./component/calendarPop";

const demoPosts = [
  {
    id: 1,
    kind: "user",
    nickname: "닉네임",
    title: "휴대폰이 사라진 세상에서\n사람들은 어떤 도구를 발명할까?",
    timeText: "3시간 전",
    likeCount: 24,
    commentCount: 4,
    liked: false,
  },
  {
    id: 2,
    kind: "daily",
    title: "휴대폰이 사라진 세상에서\n사람들은 어떤 도구를 발명할까?",
    dateText: "2025.10.05",
    commentCount: "999+",
  },
];

const comments = [
  {
    id: 1,
    nickname: "익명1",
    dateText: "2025.10.05",
    content: "답변답변답변답변답변",
    likeCount: 3,
  },
];

export default function App() {
  const [active, setActive] = useState("home");

  // CalendarPop 상태
  const [open, setOpen] = useState(false);
  const [ym, setYm] = useState({ y: 2025, m0: 5 }); // 0-base month (June)
  const [sel, setSel] = useState(6);

  const goPrev = () =>
    setYm(({ y, m0 }) => {
      const nm = m0 - 1;
      return nm < 0 ? { y: y - 1, m0: 11 } : { y, m0: nm };
    });

  const goNext = () =>
    setYm(({ y, m0 }) => {
      const nm = m0 + 1;
      return nm > 11 ? { y: y + 1, m0: 0 } : { y, m0: nm };
    });

  return (
    <div className="min-h-screen bg-neutral-200 pb-[100px]">
      {/* 컴포넌트 프리뷰 영역 */}
      <div className="max-w-md mx-auto p-6 space-y-4">
        <p className="typ-h4 text-neutral-900">Component Preview</p>

        {/* header 확인 */}
        <Header
          title="커뮤니티"
          onBack={() => console.log("back")}
          onMenu={() => console.log("menu")}
        />

        {/* btnLong 확인 */}
        <BtnLong label="등록하기" onClick={() => console.log("click")} />
        <BtnLong label="등록하기" disabled />

        {/* inputThink 확인 */}
        <InputThink onSubmit={(t) => console.log("submit:", t)} />

        {/* btnShort 확인 */}
        <div className="grid grid-cols-2 gap-4">
          <BtnShort label="취소" variant="cancel" />
          <BtnShort label="확인" variant="confirm" />
        </div>

        {/* loginInput 확인 */}
        <div className="space-y-4">
          <LoginInput
            label="아이디"
            placeholder="아이디를 입력해 주세요."
            showClear
          />
          <LoginInput
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            allowToggle
          />
        </div>

        {/* answerQInput 확인 */}
        <AnswerQInput className="w-[353px]" />

        {/* postList 확인 */}
        <PostList
          items={demoPosts}
          onToggleLike={(id) => console.log("like toggle:", id)}
          onClickComment={(id) => console.log("go comment:", id)}
        />

        {/* hotPost 확인 */}
        <HotPost />

        {/* commentList 확인 */}
        <CommentList
          items={comments}
          onClickMenu={(id) => console.log("menu:", id)}
          onClickLike={(id) => console.log("like:", id)}
        />
        {/* searchBar 확인 */}
        <SearchBar />

        {/* commentInput 확인 */}
        <CommentInput
          onSubmit={(txt, anon) => console.log("submit:", txt, anon)}
        />

        {/* category 확인 */}
        <Category />

        {/* chatBubble 확인 */}
        <div className="max-w-md mx-auto p-6 space-y-3">
          <ChatBubble
            role="ai"
            text={"휴대폰이 사라진 세상에서\n사람들은 어떤 도구를 발명할까?"}
            timeText="오후 02:23"
          />
          <ChatBubble role="user" text="공중에 떠다니는 스크린" timeText="오후 02:23" />
        </div>

        {/* reportMap 확인 */}
        <ReportMap
          values={[0.7, 0.5, 0.45, 0.4, 0.8, 0.6]}
          labels={["미스테리", "예술", "문학", "자연과학", "심리학", "역사"]}
          highlightIndex={4}
        />

        {/* weekendGameResult 확인 */}
        <WeekendGameResult />

        {/* calendar 확인 */}
        <Calendar
          initialYear={2025}
          initialMonth={6}
          markedDays={[5, 6, 7, 8, 9, 10, 11, 12]}
          highlightDay={13}
        />

        {/* calendarPop 테스트 버튼 */}
        <button
          className="px-4 py-2 rounded-lg bg-primary-700 text-white shadow"
          onClick={() => setOpen(true)}
        >
          날짜 선택
        </button>
      </div>

      {/* calendarPop 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/20"
          onClick={() => setOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CalendarPop
              year={ym.y}
              monthZeroBase={ym.m0}
              selected={sel}
              onPrev={goPrev}
              onNext={goNext}
              onSelect={(d) => {
                setSel(d);
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 고정 하단 탭바 */}
      <div className="fixed inset-x-0 bottom-0">
        <TabBar active={active} onChange={(k) => setActive(k)} />
      </div>
    </div>
  );
}
