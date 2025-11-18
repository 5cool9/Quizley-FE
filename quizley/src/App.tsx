// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import JoinPage from "./pages/joinPage";
<<<<<<< HEAD

import CommunityPage from "./pages/communityPage";
import TodayQDetailPage from "./pages/todayQDetailPage";
import WeekendQDetailPage from "./pages/weekendQDetailPage";
import UserQDetailPage from "./pages/userQDetailPage";
import SearchListPage from "./pages/searchListPage";
import CreateQPage from "./pages/createQPage";
import ComponentTestPage from "./pages/componentTestPage";

function HomeStub() {
  return (
    <div className="min-h-screen grid place-items-center">
      <p className="text-xl font-semibold">홈 화면(임시)</p>
    </div>
  );
}
=======
import RecordPage from "./pages/recordPage";
import WeekendInsightPage from "./pages/weekendInsightPage";
>>>>>>> e250f7f (✨feat: 기록 페이지 관련 ui 개발)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/join" element={<JoinPage />} />
<<<<<<< HEAD
      <Route path="/home" element={<HomeStub />} />

      {/* Coummunity */}
      <Route path="community" element={<CommunityPage />} />
      <Route path="today/:id" element={<TodayQDetailPage />} />
      <Route path="weekend/:id" element={<WeekendQDetailPage />} />
      <Route path="user/:id" element={<UserQDetailPage />} />
      <Route path="search" element={<SearchListPage />} />
      <Route path="create" element={<CreateQPage />} />
      <Route path="edit/:id" element={<CreateQPage />} />      
      
      {/* Etc */}
      <Route path="/component-test" element={<ComponentTestPage />} />
=======
      <Route path="/record" element={<RecordPage />} />
      <Route path="/weekend" element={<WeekendInsightPage/>}/>
      {/* ⬇️ 임시: 홈을 레코드로 리다이렉트 */}
      <Route path="/home" element={<Navigate to="/record" replace />} />
>>>>>>> e250f7f (✨feat: 기록 페이지 관련 ui 개발)
    </Routes>
  );
}
