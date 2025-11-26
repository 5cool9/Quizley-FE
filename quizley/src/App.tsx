import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import JoinPage from "./pages/joinPage";
import CommunityPage from "./pages/community/communityPage";
import TodayQDetailPage from "./pages/community/todayQDetailPage";
import WeekendQDetailPage from "./pages/community/weekendQDetailPage";
import UserQDetailPage from "./pages/community/userQDetailPage";
import SearchListPage from "./pages/community/searchListPage";
import CreateQPage from "./pages/community/createQPage";
import RecordPage from "./pages/recordPage";
import WeekendInsightPage from "./pages/weekendInsightPage";
import MyPage from "./pages/myPage";
import EditProfilePage from "./pages/editProfilePage";
import MyPostListPage from "./pages/myPostListPage";
import MyCommentPage from "./pages/myCommentPage";
import MyLikePage from "./pages/myLikePage";
import HomePage from "./pages/homePage";
import QuizleyBotPage from "./pages/quizleyBotPage";
import TodayInsightPage from "./pages/todayInsightPage";
import EditSummaryPage from "./pages/editSummaryPage";
import NotificationPage from "./pages/notificationPage";

// LevelUp Context
import { useLevel } from "./context/LevelCotext";
import LevelUpPop from "./component/levelupPop";


export default function App() {
  const { isLevelUp, resetLevelUp } = useLevel();

  return (
    <>
      {/* 모든 페이지에서 레벨업 팝업 */}
      <LevelUpPop open={isLevelUp} onConfirm={resetLevelUp} />

      <Routes>
        {/* Login/Join */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />

        {/* Home */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat/:category" element={<QuizleyBotPage />} />
        <Route path="/analyze/:category" element={<TodayInsightPage />} />
        <Route path="/analyze/:category/edit" element={<EditSummaryPage />} />
        <Route path="/noti" element={<NotificationPage />} />

        {/* Community */}
        <Route path="community" element={<CommunityPage />} />
        <Route path="today/:id" element={<TodayQDetailPage />} /> {/* 오늘의 질문(평일) */}
        <Route path="weekend/:id" element={<WeekendQDetailPage />} /> {/* 오늘의 질문(주말) */}
        <Route path="user/:id" element={<UserQDetailPage />} />
        <Route path="search" element={<SearchListPage />} />
        <Route path="create" element={<CreateQPage />} />
        <Route path="edit/:id" element={<CreateQPage />} />

        {/* Record */}
        <Route path="/record" element={<RecordPage />} />
        <Route path="/weekend" element={<WeekendInsightPage />} />

        {/* MyPage */}
        <Route path="/my" element={<MyPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/post-list" element={<MyPostListPage />} />
        <Route path="/comment-list" element={<MyCommentPage />} />
        <Route path="/like-list" element={<MyLikePage />} />
      </Routes>
    </>
  );
}

