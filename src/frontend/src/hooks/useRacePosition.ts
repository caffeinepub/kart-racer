import { useMemo } from "react";
import { TOTAL_WAYPOINTS, TRACK_WAYPOINTS } from "../data/track";

function getOrdinal(pos: number): string {
  if (pos === 1) return "1st";
  if (pos === 2) return "2nd";
  if (pos === 3) return "3rd";
  return `${pos}th`;
}

export function useRacePosition(
  playerPos: [number, number, number],
  playerLaps: number,
  npcs: Array<{
    id: string;
    laps: number;
    waypointIndex: number;
    progress: number;
    angle: number;
  }>,
) {
  return useMemo(() => {
    // Find the nearest waypoint to the player
    let bestWP = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < TOTAL_WAYPOINTS; i++) {
      const wp = TRACK_WAYPOINTS[i];
      const d = Math.sqrt(
        (playerPos[0] - wp[0]) ** 2 + (playerPos[2] - wp[1]) ** 2,
      );
      if (d < bestDist) {
        bestDist = d;
        bestWP = i;
      }
    }

    const nextWPIndex = (bestWP + 1) % TOTAL_WAYPOINTS;
    const curWP = TRACK_WAYPOINTS[bestWP];
    const nextWP = TRACK_WAYPOINTS[nextWPIndex];
    const segDx = nextWP[0] - curWP[0];
    const segDz = nextWP[1] - curWP[1];
    const segLenSq = segDx * segDx + segDz * segDz;
    const projFrac =
      segLenSq > 0
        ? Math.max(
            0,
            Math.min(
              1,
              ((playerPos[0] - curWP[0]) * segDx +
                (playerPos[2] - curWP[1]) * segDz) /
                segLenSq,
            ),
          )
        : 0;

    const playerProgress = playerLaps + (bestWP + projFrac) / TOTAL_WAYPOINTS;

    const allRacers: Array<{ id: string; progress: number }> = [
      { id: "player", progress: playerProgress },
      ...npcs.map((npc) => ({
        id: npc.id,
        progress:
          npc.laps +
          npc.waypointIndex / TOTAL_WAYPOINTS +
          npc.progress / TOTAL_WAYPOINTS,
      })),
    ];

    allRacers.sort((a, b) => b.progress - a.progress);
    const playerPosition = allRacers.findIndex((r) => r.id === "player") + 1;

    return {
      position: playerPosition,
      positionLabel: getOrdinal(playerPosition),
    };
  }, [playerPos, playerLaps, npcs]);
}
