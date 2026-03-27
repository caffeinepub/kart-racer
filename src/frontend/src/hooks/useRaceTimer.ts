import { useEffect, useState } from "react";

export function useRaceTimer(isRunning: boolean) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isRunning && !startTime) {
      setStartTime(Date.now());
    }
  }, [isRunning, startTime]);

  useEffect(() => {
    if (!isRunning || !startTime) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 10);

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  return { elapsedTime, formattedTime: formatTime(elapsedTime) };
}
