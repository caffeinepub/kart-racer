export interface PowerUp {
  id: string;
  name: string;
  effectType: "speed" | "shield" | "projectile";
  duration: number;
  color: string;
}

export const powerups: PowerUp[] = [
  {
    id: "speed-boost",
    name: "Speed Boost",
    effectType: "speed",
    duration: 3000,
    color: "#FFD700",
  },
  {
    id: "shield",
    name: "Shield",
    effectType: "shield",
    duration: 5000,
    color: "#00D9FF",
  },
  {
    id: "rocket",
    name: "Rocket",
    effectType: "projectile",
    duration: 1000,
    color: "#FF3333",
  },
];
