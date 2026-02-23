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
    id: 'speedster',
    name: 'Speedster Sam',
    description: 'Lightning fast racer',
    kartColor: '#FF3333',
    speed: 9,
    acceleration: 6,
    handling: 7,
  },
  {
    id: 'turbo',
    name: 'Turbo Tina',
    description: 'Acceleration expert',
    kartColor: '#FF6B35',
    speed: 7,
    acceleration: 9,
    handling: 6,
  },
  {
    id: 'drift-king',
    name: 'Drift King',
    description: 'Master of corners',
    kartColor: '#FFD700',
    speed: 6,
    acceleration: 7,
    handling: 10,
  },
  {
    id: 'rocket',
    name: 'Rocket Rita',
    description: 'Balanced racer',
    kartColor: '#00D9FF',
    speed: 8,
    acceleration: 8,
    handling: 8,
  },
  {
    id: 'thunder',
    name: 'Thunder Tom',
    description: 'Power driver',
    kartColor: '#9D4EDD',
    speed: 10,
    acceleration: 5,
    handling: 6,
  },
  {
    id: 'flash',
    name: 'Flash Fiona',
    description: 'Quick starter',
    kartColor: '#06FFA5',
    speed: 7,
    acceleration: 10,
    handling: 7,
  },
  {
    id: 'nitro',
    name: 'Nitro Nick',
    description: 'Boost specialist',
    kartColor: '#FF006E',
    speed: 9,
    acceleration: 7,
    handling: 6,
  },
  {
    id: 'blaze',
    name: 'Blaze Betty',
    description: 'Fire on wheels',
    kartColor: '#FB5607',
    speed: 8,
    acceleration: 6,
    handling: 9,
  },
  {
    id: 'storm',
    name: 'Storm Steve',
    description: 'Unstoppable force',
    kartColor: '#3A86FF',
    speed: 6,
    acceleration: 8,
    handling: 9,
  },
  {
    id: 'comet',
    name: 'Comet Carla',
    description: 'Shooting star',
    kartColor: '#8338EC',
    speed: 10,
    acceleration: 6,
    handling: 7,
  },
];
