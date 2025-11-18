// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import JoinPage from "./pages/joinPage";
import CommunityPage from "./pages/communityPage";
import TodayQDetailPage from "./pages/todayQDetailPage";
import WeekendQDetailPage from "./pages/weekendQDetailPage";
import UserQDetailPage from "./pages/userQDetailPage";
import SearchListPage from "./pages/searchListPage";
import CreateQPage from "./pages/createQPage";
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
      <Route path="today/:id" element={<TodayQDetailPage />} />
      <Route path="weekend/:id" element={<WeekendQDetailPage />} />
      <Route path="user/:id" element={<UserQDetailPage />} />
      <Route path="search" element={<SearchListPage />} />
      <Route path="create" element={<CreateQPage />} />
      <Route path="edit/:id" element={<CreateQPage />} />      
      
      {/* Record */}
      <Route path="/record" element={<RecordPage />} />
      <Route path="/weekend" element={<WeekendInsightPage/>}/>

      {/* MyPage */}
      <Route path="/my" element={<MyPage/>}/>
      <Route path="/edit-profile" element={<EditProfilePage/>}/>
      <Route path="/post-list" element={<MyPostListPage/>}/>
      <Route path="/comment-list" element={<MyCommentPage/>}/>
      <Route path="/like-list" element={<MyLikePage/>}/>
    </Routes>
  );
}
