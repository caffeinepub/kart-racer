import { useEffect, useState } from "react";

export function useDrifting(driftKey: boolean, steer: number) {
  const [isDrifting, setIsDrifting] = useState(false);
  const [driftTime, setDriftTime] = useState(0);
  const [driftBoost, setDriftBoost] = useState(0);

  useEffect(() => {
    if (driftKey && steer !== 0) {
      setIsDrifting(true);
      setDriftTime((prev) => prev + 0.016);
    } else {
      if (isDrifting && driftTime > 0.5) {
        setDriftBoost(1.5);
        setTimeout(() => setDriftBoost(0), 1000);
      }
      setIsDrifting(false);
      setDriftTime(0);
    }
  }, [driftKey, steer, isDrifting, driftTime]);

  return { isDrifting, driftBoost };
}
