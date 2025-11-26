// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
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

function HomeStub() {
  return (
    <div className="min-h-screen grid place-items-center">
      <p className="text-xl font-semibold">홈 화면(임시)</p>
    </div>
  );
}
export default function App() {
  return (
    <Routes>
      {/* Login/Join */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/join" element={<JoinPage />} />

      {/* Home(임시) */}
      <Route path="/home" element={<HomeStub />} />

      {/* Coummunity */}
      <Route path="community" element={<CommunityPage />} />
      <Route path="community/today/:id" element={<TodayQDetailPage />} /> {/*오늘의 질문(평일)*/}
      <Route path="community/weekend/:id" element={<WeekendQDetailPage />} /> {/*오늘의 질문(주말)*/}
      <Route path="community/user/:id" element={<UserQDetailPage />} />
      <Route path="community/search" element={<SearchListPage />} />
      <Route path="community/create" element={<CreateQPage />} />
      <Route path="community/edit/:id" element={<CreateQPage />} />

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
  );
}
