import WeekdayHome from "../pages/weekdayHomePage";
import WeekendHome from "../pages/weekendHomePage";

export default function Home() {
  //const today = new Date();
  const today = new Date("2025-11-08"); // 수요일

  const day = today.getDay(); // 0(일)~6(토)
  const isWeekend = day === 0 || day === 6;

  return isWeekend ? <WeekendHome /> : <WeekdayHome />;
}
