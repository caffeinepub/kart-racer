export interface Character {
  id: string;
  name: string;
  description: string;
  kartColor: string;
  speed: number;
  acceleration: number;
  handling: number;
}

export const characters: Character[] = [
  {
    id: "speedster",
    name: "Ghost",
    description: "The untraceable street legend",
    kartColor: "#FF3333",
    speed: 9,
    acceleration: 6,
    handling: 7,
  },
  {
    id: "turbo",
    name: "Razor",
    description: "Cuts corners others can't",
    kartColor: "#FF6B35",
    speed: 7,
    acceleration: 9,
    handling: 6,
  },
  {
    id: "drift-king",
    name: "Drift Queen",
    description: "Owns every turn",
    kartColor: "#FFD700",
    speed: 6,
    acceleration: 7,
    handling: 10,
  },
  {
    id: "rocket",
    name: "Nitrous",
    description: "Chemical advantage",
    kartColor: "#00D9FF",
    speed: 8,
    acceleration: 8,
    handling: 8,
  },
  {
    id: "thunder",
    name: "Titan",
    description: "Pure displacement",
    kartColor: "#9D4EDD",
    speed: 10,
    acceleration: 5,
    handling: 6,
  },
  {
    id: "flash",
    name: "Phantom",
    description: "Gone before you blinked",
    kartColor: "#06FFA5",
    speed: 7,
    acceleration: 10,
    handling: 7,
  },
  {
    id: "nitro",
    name: "Venom",
    description: "Toxic speed",
    kartColor: "#FF006E",
    speed: 9,
    acceleration: 7,
    handling: 6,
  },
  {
    id: "blaze",
    name: "Inferno",
    description: "Leaves trails of fire",
    kartColor: "#FB5607",
    speed: 8,
    acceleration: 6,
    handling: 9,
  },
  {
    id: "storm",
    name: "Tempest",
    description: "Weather the speed",
    kartColor: "#3A86FF",
    speed: 6,
    acceleration: 8,
    handling: 9,
  },
  {
    id: "comet",
    name: "Meteor",
    description: "Burns on entry",
    kartColor: "#8338EC",
    speed: 10,
    acceleration: 6,
    handling: 7,
  },
];
