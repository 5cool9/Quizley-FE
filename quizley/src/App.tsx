// src/App.tsx  (또는 App.jsx → App.tsx)
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import JoinPage from "./pages/joinPage";

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
      <Route path="/" element={<LoginPage />} />
      <Route path="/join" element={<JoinPage />} />
      <Route path="/home" element={<HomeStub />} />
    </Routes>
  );
}
