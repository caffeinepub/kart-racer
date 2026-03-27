import { useMemo } from "react";

function getOrdinal(pos: number): string {
  if (pos === 1) return "1st";
  if (pos === 2) return "2nd";
  if (pos === 3) return "3rd";
  return `${pos}th`;
}

export function useRacePosition(
  playerPos: [number, number, number],
  playerLaps: number,
  npcs: Array<{ id: string; laps: number; angle: number }>,
) {
  return useMemo(() => {
    const rawAngle = Math.atan2(playerPos[2] + 10, playerPos[0]);
    const normalizedAngle =
      ((rawAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const playerProgress = playerLaps + normalizedAngle / (Math.PI * 2);

    const allRacers: Array<{ id: string; progress: number }> = [
      { id: "player", progress: playerProgress },
      ...npcs.map((npc) => ({
        id: npc.id,
        progress: npc.laps + npc.angle / (Math.PI * 2),
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
