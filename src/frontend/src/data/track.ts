// Mario Kart style circuit - waypoints are [x, z] pairs
export const TRACK_WAYPOINTS: [number, number][] = [
  [0, 15], // 0 - start/finish line
  [0, -10], // 1 - straight forward (north)
  [15, -30], // 2 - sweeping right curve
  [40, -30], // 3 - straight east
  [55, -15], // 4 - curve right turning south
  [55, 15], // 5 - straight south
  [40, 30], // 6 - curve left
  [20, 35], // 7 - sweeping left continuing
  [-5, 30], // 8 - hairpin north-west
  [-20, 15], // 9 - curve back right
  [-15, -5], // 10 - short straight
  [-5, 10], // 11 - gentle right back to start
];
// The track loops: last point connects back to first
export const TRACK_WIDTH = 9;

// Grid starting positions (x, y, z) - lined up behind start line
export const GRID_POSITIONS: [number, number, number][] = [
  [0, 0.5, 19], // player (pole position)
  [-2.5, 0.5, 22], // NPC1 (left, row 2)
  [2.5, 0.5, 25], // NPC2 (right, row 3)
  [-2.5, 0.5, 28], // NPC3 (left, row 4)
];

export const TOTAL_WAYPOINTS = TRACK_WAYPOINTS.length;
