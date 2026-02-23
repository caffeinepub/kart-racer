import { useState, useCallback, useEffect } from 'react';

type RaceStatus = 'waiting' | 'countdown' | 'racing' | 'finished';

export function useRaceState() {
  const [raceStatus, setRaceStatus] = useState<RaceStatus>('waiting');
  const [currentLap, setCurrentLap] = useState(1);
  const [totalLaps] = useState(3);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const startCountdown = useCallback(() => {
    setRaceStatus('countdown');
    setTimeout(() => {
      setRaceStatus('racing');
      setStartTime(Date.now());
    }, 3000);
  }, []);

  const incrementLap = useCallback(() => {
    setCurrentLap((prev) => prev + 1);
  }, []);

  const finishRace = useCallback(() => {
    setRaceStatus('finished');
  }, []);

  useEffect(() => {
    if (raceStatus !== 'racing' || !startTime) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 10);

    return () => clearInterval(interval);
  }, [raceStatus, startTime]);

  return {
    raceStatus,
    currentLap,
    totalLaps,
    elapsedTime,
    startCountdown,
    incrementLap,
    finishRace,
  };
}
