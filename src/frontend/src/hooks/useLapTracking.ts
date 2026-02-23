import { useState, useCallback } from 'react';
import { useRaceState } from './useRaceState';

export function useLapTracking() {
  const { incrementLap } = useRaceState();
  const [lastCheckpoint, setLastCheckpoint] = useState(0);
  const [checkpointsPassed, setCheckpointsPassed] = useState<Set<number>>(new Set());

  const checkLapProgress = useCallback(
    (position: [number, number, number]) => {
      const [x, , z] = position;
      const angle = Math.atan2(z + 10, x);
      const normalizedAngle = ((angle + Math.PI) / (2 * Math.PI)) * 4;
      const checkpoint = Math.floor(normalizedAngle);

      if (checkpoint !== lastCheckpoint) {
        const newCheckpoints = new Set(checkpointsPassed);
        newCheckpoints.add(checkpoint);
        setCheckpointsPassed(newCheckpoints);
        setLastCheckpoint(checkpoint);

        // Check if all checkpoints passed
        if (newCheckpoints.size === 4 && checkpoint === 0) {
          incrementLap();
          setCheckpointsPassed(new Set([0]));
        }
      }
    },
    [lastCheckpoint, checkpointsPassed, incrementLap]
  );

  return { checkLapProgress };
}
