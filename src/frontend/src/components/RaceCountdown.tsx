import { useEffect, useState } from "react";

export default function RaceCountdown() {
  // starts at 4, counts down to 0
  // count=4 → "3", count=3 → "2", count=2 → "1", count=1 → "GO!", count=0 → hidden
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (count === 0) return;
    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [count]);

  if (count === 0) return null;

  const display =
    count === 4
      ? "3"
      : count === 3
        ? "2"
        : count === 2
          ? "1"
          : count === 1
            ? "GO!"
            : null;

  const isGo = count === 1;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={`font-black drop-shadow-2xl select-none transition-all duration-200 ${
          isGo ? "text-green-400" : "text-white"
        }`}
        style={{
          fontSize: "clamp(80px, 20vw, 180px)",
          textShadow: isGo ? "0 0 40px #00ff44" : "0 0 20px rgba(0,0,0,0.8)",
        }}
      >
        {display}
      </div>
    </div>
  );
}
