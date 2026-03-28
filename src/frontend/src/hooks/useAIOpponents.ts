import { useCallback, useState } from "react";

interface NPCState {
  id: string;
  name: string;
  color: string;
  baseSpeed: number;
  waypointIndex: number;
  progress: number;
  laps: number;
  position: [number, number, number];
  rotation: number;
  angle: number;
  stunned: boolean;
  stunnedUntil: number;
}

const NPC_CONFIGS = [
  {
    id: "npc1",
    name: "Blaze Bot",
    color: "#FF8800",
    baseSpeed: 14,
    gridIndex: 1,
  },
  {
    id: "npc2",
    name: "Green Ghost",
    color: "#00CC44",
    baseSpeed: 12,
    gridIndex: 2,
  },
  {
    id: "npc3",
    name: "Violet Viper",
    color: "#CC00FF",
    baseSpeed: 16,
    gridIndex: 3,
  },
];

function getWaypointPos(
  index: number,
  waypoints: [number, number][],
): [number, number] {
  return waypoints[index % waypoints.length];
}

export function useAIOpponents(
  waypoints: [number, number][],
  gridPositions: [number, number, number][],
) {
  const [npcs, setNpcs] = useState<NPCState[]>(() =>
    NPC_CONFIGS.map((cfg) => {
      const gridPos =
        gridPositions[cfg.gridIndex] ?? gridPositions[gridPositions.length - 1];
      const targetWP = getWaypointPos(0, waypoints);
      const dx = targetWP[0] - gridPos[0];
      const dz = targetWP[1] - gridPos[2];
      const rotation = Math.atan2(dx, dz);
      return {
        id: cfg.id,
        name: cfg.name,
        color: cfg.color,
        baseSpeed: cfg.baseSpeed,
        waypointIndex: 0,
        progress: 0,
        laps: 0,
        position: [gridPos[0], gridPos[1], gridPos[2]],
        rotation,
        angle: 0,
        stunned: false,
        stunnedUntil: 0,
      };
    }),
  );

  const stunNPC = useCallback((id: string) => {
    setNpcs((prev) =>
      prev.map((npc) =>
        npc.id === id
          ? { ...npc, stunned: true, stunnedUntil: Date.now() + 2000 }
          : npc,
      ),
    );
  }, []);

  const updateNPCs = useCallback(
    (delta: number, raceStarted: boolean) => {
      if (!raceStarted) return;
      const totalWaypoints = waypoints.length;

      setNpcs((prev) =>
        prev.map((npc) => {
          // Clear stun
          const nowStunned = npc.stunned && Date.now() < npc.stunnedUntil;
          if (nowStunned) {
            // Spin in place while stunned
            return {
              ...npc,
              stunned: true,
              rotation: npc.rotation + delta * 6,
            };
          }

          const curWP = getWaypointPos(npc.waypointIndex, waypoints);
          const nextWPIndex = (npc.waypointIndex + 1) % totalWaypoints;
          const nextWP = getWaypointPos(nextWPIndex, waypoints);

          const segDx = nextWP[0] - curWP[0];
          const segDz = nextWP[1] - curWP[1];
          const segLen = Math.sqrt(segDx * segDx + segDz * segDz);

          const moveAmount = npc.baseSpeed * delta;
          let newProgress =
            npc.progress + (segLen > 0 ? moveAmount / segLen : 0);
          let newWaypointIndex = npc.waypointIndex;
          let newLaps = npc.laps;

          while (newProgress >= 1) {
            newProgress -= 1;
            const prevWPIndex = newWaypointIndex;
            newWaypointIndex = (newWaypointIndex + 1) % totalWaypoints;
            if (prevWPIndex === totalWaypoints - 1) {
              newLaps += 1;
            }
          }

          const activeCurWP = getWaypointPos(newWaypointIndex, waypoints);
          const activeNextWP = getWaypointPos(
            (newWaypointIndex + 1) % totalWaypoints,
            waypoints,
          );
          const px =
            activeCurWP[0] + (activeNextWP[0] - activeCurWP[0]) * newProgress;
          const pz =
            activeCurWP[1] + (activeNextWP[1] - activeCurWP[1]) * newProgress;

          const rdx = activeNextWP[0] - activeCurWP[0];
          const rdz = activeNextWP[1] - activeCurWP[1];
          const rotation = Math.atan2(rdx, rdz);

          return {
            ...npc,
            stunned: false,
            waypointIndex: newWaypointIndex,
            progress: newProgress,
            laps: newLaps,
            position: [px, 0.5, pz],
            rotation,
            angle:
              ((newWaypointIndex + newProgress) / totalWaypoints) * Math.PI * 2,
          };
        }),
      );
    },
    [waypoints],
  );

  return { npcs, updateNPCs, stunNPC };
}
