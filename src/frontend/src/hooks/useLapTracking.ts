import { useCallback, useRef } from "react";
import { TOTAL_WAYPOINTS, TRACK_WAYPOINTS } from "../data/track";
import { useRaceState } from "./useRaceState";

// Halfway waypoint index
const HALFWAY = Math.floor(TOTAL_WAYPOINTS / 2);

export function useLapTracking() {
  const { incrementLap } = useRaceState();
  const passedHalfway = useRef(false);
  const lastZ = useRef<number | null>(null);

  // Start/finish line near waypoint 0 = TRACK_WAYPOINTS[0] = [0, 15]
  const startLineZ = TRACK_WAYPOINTS[0][1]; // 15

  const checkLapProgress = useCallback(
    (position: [number, number, number]) => {
      const [px, , pz] = position;

      // Check if player has passed the halfway mark (waypoints 5-7 area)
      // Use simple x/z proximity to halfway waypoints
      const halfWP = TRACK_WAYPOINTS[HALFWAY];
      const distToHalf = Math.sqrt(
        (px - halfWP[0]) ** 2 + (pz - halfWP[1]) ** 2,
      );
      if (distToHalf < 20) {
        passedHalfway.current = true;
      }

      // Detect crossing start/finish line (z crosses from > startLineZ+2 to < startLineZ-2)
      // Player must have passed halfway to count
      if (
        lastZ.current !== null &&
        passedHalfway.current &&
        lastZ.current > startLineZ + 1 &&
        pz < startLineZ - 1
      ) {
        incrementLap();
        passedHalfway.current = false;
      }

      lastZ.current = pz;
    },
    [incrementLap, startLineZ],
  );

  return { checkLapProgress };
}
