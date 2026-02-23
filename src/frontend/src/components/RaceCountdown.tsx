import { useState, useEffect } from 'react';

export default function RaceCountdown() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) return;

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count]);

  if (count === 0) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none">
      <div className="text-white text-9xl font-bold animate-bounce drop-shadow-2xl">
        {count === 3 && '3'}
        {count === 2 && '2'}
        {count === 1 && '1'}
      </div>
    </div>
  );
}
