export type MapTheme = "meadows" | "rainbow" | "castle" | "beach";

export interface MapDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  theme: MapTheme;
  waypoints: [number, number][];
  gridPositions: [number, number, number][];
}

export const maps: MapDef[] = [
  {
    id: "meadows",
    name: "Mushroom Meadows",
    description:
      "A cheerful green circuit with sweeping curves and mushroom decorations.",
    emoji: "🍄",
    theme: "meadows",
    waypoints: [
      [0, 15],
      [0, -10],
      [15, -30],
      [40, -30],
      [55, -15],
      [55, 15],
      [40, 30],
      [20, 35],
      [-5, 30],
      [-20, 15],
      [-15, -5],
      [-5, 10],
    ],
    gridPositions: [
      [0, 0.5, 19],
      [-2.5, 0.5, 22],
      [2.5, 0.5, 25],
      [-2.5, 0.5, 28],
    ],
  },
  {
    id: "rainbow",
    name: "Rainbow Road",
    description:
      "A gravity-defying space track glowing with rainbow neon light.",
    emoji: "🌈",
    theme: "rainbow",
    waypoints: [
      [0, 20],
      [0, -15],
      [20, -45],
      [60, -50],
      [90, -30],
      [100, 0],
      [90, 30],
      [60, 50],
      [20, 45],
      [-10, 25],
      [-20, 0],
      [-10, -20],
    ],
    gridPositions: [
      [0, 0.5, 25],
      [-2.5, 0.5, 28],
      [2.5, 0.5, 31],
      [-2.5, 0.5, 34],
    ],
  },
  {
    id: "castle",
    name: "Bowser's Castle",
    description: "Tight hairpins through a lava-lit fortress full of traps.",
    emoji: "🏰",
    theme: "castle",
    waypoints: [
      [0, 10],
      [0, -5],
      [8, -15],
      [8, -30],
      [-5, -38],
      [-20, -30],
      [-20, -15],
      [-8, -5],
      [-8, 15],
      [0, 25],
      [10, 18],
      [10, 10],
    ],
    gridPositions: [
      [0, 0.5, 14],
      [-2.5, 0.5, 17],
      [2.5, 0.5, 20],
      [-2.5, 0.5, 23],
    ],
  },
  {
    id: "beach",
    name: "Koopa Beach",
    description:
      "Wide coastal curves with sandy shores and crystal-blue waves.",
    emoji: "🏖️",
    theme: "beach",
    waypoints: [
      [0, 25],
      [0, -5],
      [15, -25],
      [45, -30],
      [70, -15],
      [80, 10],
      [70, 35],
      [45, 45],
      [15, 40],
      [-10, 30],
      [-20, 10],
      [-10, -5],
    ],
    gridPositions: [
      [0, 0.5, 30],
      [-2.5, 0.5, 33],
      [2.5, 0.5, 36],
      [-2.5, 0.5, 39],
    ],
  },
];

export function getMap(id: string): MapDef {
  return maps.find((m) => m.id === id) ?? maps[0];
}
