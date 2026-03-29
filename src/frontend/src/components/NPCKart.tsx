import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

const WHEEL_POSITIONS: [number, number, number][] = [
  [-0.78, 0.28, 1.1],
  [0.78, 0.28, 1.1],
  [-0.78, 0.28, -1.1],
  [0.78, 0.28, -1.1],
];

const WHEEL_KEYS = ["fl", "fr", "rl", "rr"];
const SPOKE_ANGLES = [
  0,
  Math.PI * 0.4,
  Math.PI * 0.8,
  Math.PI * 1.2,
  Math.PI * 1.6,
];
const SPOKE_KEYS = ["s0", "s1", "s2", "s3", "s4"];

interface NPCKartProps {
  color: string;
  position: [number, number, number];
  rotation: number;
  stunned?: boolean;
}

export default function NPCKart({
  color,
  position,
  rotation,
  stunned,
}: NPCKartProps) {
  const stunRingRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (stunned && stunRingRef.current) {
      stunRingRef.current.rotation.y += delta * 8;
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.4, 0.35, 3.2]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Hood */}
      <mesh castShadow position={[0, 0.57, 0.8]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[1.3, 0.08, 1.0]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Roof / cabin */}
      <mesh castShadow position={[0, 0.72, -0.1]}>
        <boxGeometry args={[0.9, 0.35, 1.2]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.72, 0.52]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.85, 0.28, 0.05]} />
        <meshStandardMaterial
          color="#111a2a"
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Trunk */}
      <mesh castShadow position={[0, 0.57, -1.1]}>
        <boxGeometry args={[1.3, 0.08, 0.6]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Side skirts */}
      <mesh position={[-0.72, 0.28, 0]}>
        <boxGeometry args={[0.08, 0.1, 2.8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.72, 0.28, 0]}>
        <boxGeometry args={[0.08, 0.1, 2.8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Front splitter */}
      <mesh position={[0, 0.22, 1.65]}>
        <boxGeometry args={[1.5, 0.06, 0.2]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Rear diffuser */}
      <mesh position={[0, 0.22, -1.65]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[1.4, 0.12, 0.3]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Rear spoiler */}
      <mesh castShadow position={[0, 0.92, -1.4]}>
        <boxGeometry args={[1.3, 0.05, 0.25]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.45, 0.78, -1.4]}>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.45, 0.78, -1.4]}>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Neon underglow */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.3, 0.03, 3.0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>

      {/* Wheels */}
      {WHEEL_POSITIONS.map((pos, i) => (
        <group key={WHEEL_KEYS[i]} position={pos}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.28, 20]} />
            <meshStandardMaterial
              color="#111111"
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.3, 12]} />
            <meshStandardMaterial
              color="#cccccc"
              metalness={0.95}
              roughness={0.05}
            />
          </mesh>
          {SPOKE_ANGLES.map((angle, si) => (
            <mesh key={SPOKE_KEYS[si]} rotation={[0, 0, angle + Math.PI / 2]}>
              <boxGeometry args={[0.04, 0.36, 0.04]} />
              <meshStandardMaterial
                color="#aaaaaa"
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Headlights */}
      <mesh position={[-0.45, 0.48, 1.63]}>
        <boxGeometry args={[0.25, 0.08, 0.05]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffcc"
          emissiveIntensity={2.0}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.45, 0.48, 1.63]}>
        <boxGeometry args={[0.25, 0.08, 0.05]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffcc"
          emissiveIntensity={2.0}
          toneMapped={false}
        />
      </mesh>

      {/* Taillights */}
      <mesh position={[-0.45, 0.48, -1.65]}>
        <boxGeometry args={[0.3, 0.07, 0.04]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff0000"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.45, 0.48, -1.65]}>
        <boxGeometry args={[0.3, 0.07, 0.04]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff0000"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Twin exhausts */}
      <mesh position={[-0.35, 0.3, -1.72]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.18, 8]} />
        <meshStandardMaterial
          color="#444444"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0.35, 0.3, -1.72]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.18, 8]} />
        <meshStandardMaterial
          color="#444444"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Stun ring */}
      {stunned && (
        <mesh ref={stunRingRef} position={[0, 1.2, 0]}>
          <torusGeometry args={[1.0, 0.12, 8, 24]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffdd00"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}
