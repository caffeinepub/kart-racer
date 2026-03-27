const WHEEL_POSITIONS: [number, number, number][] = [
  [-0.6, -0.3, 0.7],
  [0.6, -0.3, 0.7],
  [-0.6, -0.3, -0.7],
  [0.6, -0.3, -0.7],
];

const WHEEL_KEYS = ["fl", "fr", "rl", "rr"];

interface NPCKartProps {
  color: string;
  position: [number, number, number];
  rotation: number;
}

export default function NPCKart({ color, position, rotation }: NPCKartProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.6, 2]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Top */}
      <mesh position={[0, 0.35, -0.2]} castShadow>
        <boxGeometry args={[1, 0.1, 1.2]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Spoiler */}
      <mesh position={[0, 0.6, -1.1]} castShadow>
        <boxGeometry args={[1.2, 0.4, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Wheels */}
      {WHEEL_POSITIONS.map((pos, i) => (
        <mesh
          key={WHEEL_KEYS[i]}
          position={pos}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.3, 0.3, 0.25, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
      ))}

      {/* Driver sphere */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
