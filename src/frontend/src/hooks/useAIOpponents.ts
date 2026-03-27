import { useCallback, useState } from "react";

interface NPCState {
  id: string;
  name: string;
  color: string;
  baseSpeed: number;
  angle: number;
  laps: number;
  position: [number, number, number];
  rotation: number;
}

const NPC_CONFIGS = [
  {
    id: "npc1",
    name: "Blaze Bot",
    color: "#FF8800",
    baseSpeed: 1.3 + Math.random() * 0.2,
    startAngle: Math.PI / 3,
  },
  {
    id: "npc2",
    name: "Green Ghost",
    color: "#00CC44",
    baseSpeed: 1.2 + Math.random() * 0.2,
    startAngle: (Math.PI * 2) / 3,
  },
  {
    id: "npc3",
    name: "Violet Viper",
    color: "#CC00FF",
    baseSpeed: 1.4 + Math.random() * 0.2,
    startAngle: Math.PI,
  },
];

const TRACK_RADIUS = 11.5;
const TRACK_CENTER_Z = -10;

function computeNPCPosition(angle: number): [number, number, number] {
  return [
    Math.cos(angle) * TRACK_RADIUS,
    0.5,
    Math.sin(angle) * TRACK_RADIUS + TRACK_CENTER_Z,
  ];
}

export function useAIOpponents() {
  const [npcs, setNpcs] = useState<NPCState[]>(() =>
    NPC_CONFIGS.map((cfg) => ({
      id: cfg.id,
      name: cfg.name,
      color: cfg.color,
      baseSpeed: cfg.baseSpeed,
      angle: cfg.startAngle,
      laps: 0,
      position: computeNPCPosition(cfg.startAngle),
      rotation: cfg.startAngle + Math.PI / 2,
    })),
  );

  const updateNPCs = useCallback((delta: number) => {
    setNpcs((prev) =>
      prev.map((npc) => {
        let newAngle = npc.angle + npc.baseSpeed * delta;
        let newLaps = npc.laps;
        if (newAngle >= Math.PI * 2) {
          newAngle -= Math.PI * 2;
          newLaps += 1;
        }
        const position = computeNPCPosition(newAngle);
        // Tangent rotation (facing direction of travel)
        const rotation = newAngle + Math.PI / 2;
        return { ...npc, angle: newAngle, laps: newLaps, position, rotation };
      }),
    );
  }, []);

  return { npcs, updateNPCs };
}
