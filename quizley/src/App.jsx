// src/App.jsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
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

import CommunityPage from "./pages/communityPage";
import TodayQDetailPage from "./pages/todayQDetailPage";
import WeekendQDetailPage from "./pages/weekendQDetailPage";
import UserQDetailPage from "./pages/userQDetailPage";
import SearchListPage from "./pages/searchListPage";
import CreateQPage from "./pages/createQPage";
import ComponentTestPage from "./pages/componentTestPage";


export default function App() {
  return (
    <Routes>
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
    </Routes>
  );
}
