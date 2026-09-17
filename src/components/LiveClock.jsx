// components/LiveClock.jsx
import { useEffect, useState } from "react";

const LiveClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const date = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="text-right leading-tight select-none whitespace-nowrap">
      <p className="text-xs sm:text-sm font-semibold text-slate-700">{time}</p>
      <p className="text-[10px] sm:text-xs text-slate-400">{date}</p>
    </div>
  );
};

export default LiveClock;
