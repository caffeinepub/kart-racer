import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { Character } from "../data/characters";
import { useDrifting } from "../hooks/useDrifting";
import { useKartControls } from "../hooks/useKartControls";
import { useLapTracking } from "../hooks/useLapTracking";
import { usePhysics } from "../hooks/usePhysics";

const WHEEL_POSITIONS: [number, number, number][] = [
  [-0.78, 0.28, 1.1],
  [0.78, 0.28, 1.1],
  [-0.78, 0.28, -1.1],
  [0.78, 0.28, -1.1],
];
const WHEEL_KEYS = ["wfl", "wfr", "wrl", "wrr"];
const SPOKE_ANGLES = [
  0,
  Math.PI * 0.4,
  Math.PI * 0.8,
  Math.PI * 1.2,
  Math.PI * 1.6,
];
const SPOKE_KEYS = ["s0", "s1", "s2", "s3", "s4"];

interface PlayerKartProps {
  character: Character;
  position: [number, number, number];
  rotation: [number, number, number];
  onPositionChange: (pos: [number, number, number]) => void;
  onRotationChange: (rot: [number, number, number]) => void;
  onSpeedChange: (speed: number) => void;
  raceStatus: string;
  speedMultiplier?: number;
  shieldActive?: boolean;
}

export default function PlayerKart({
  character,
  onPositionChange,
  onRotationChange,
  onSpeedChange,
  raceStatus,
  speedMultiplier = 1.0,
  shieldActive = false,
}: PlayerKartProps) {
  const meshRef = useRef<THREE.Group>(null);
  const wheelRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];
  const smoke1Ref = useRef<THREE.Mesh>(null);
  const smoke2Ref = useRef<THREE.Mesh>(null);
  const { throttle, brake, steer, drift } = useKartControls(
    raceStatus === "racing",
  );
  const { isDrifting, driftBoost } = useDrifting(drift, steer);
  const { updatePhysics } = usePhysics(character);
  const { checkLapProgress } = useLapTracking();

  useFrame((state, delta) => {
    if (!meshRef.current || raceStatus !== "racing") return;

    const speedMult = character.speed / 10;
    const accelMult = character.acceleration / 10;
    const handleMult = character.handling / 10;

    const newVelocity = updatePhysics(
      throttle,
      brake,
      steer,
      isDrifting,
      driftBoost,
      speedMult,
      accelMult,
      handleMult,
      delta,
    );

    const newPos: [number, number, number] = [
      meshRef.current.position.x + newVelocity.x * delta * speedMultiplier,
      0.5,
      meshRef.current.position.z + newVelocity.z * delta * speedMultiplier,
    ];

    meshRef.current.position.set(...newPos);
    onPositionChange(newPos);

    const speed = Math.sqrt(newVelocity.x ** 2 + newVelocity.z ** 2);
    if (speed > 0.1) {
      const targetRotation = Math.atan2(newVelocity.x, newVelocity.z);
      const currentRotation = meshRef.current.rotation.y;
      const newRotation = THREE.MathUtils.lerp(
        currentRotation,
        targetRotation,
        0.1,
      );
      meshRef.current.rotation.y = newRotation;
      onRotationChange([0, newRotation, isDrifting ? steer * 0.2 : 0]);
    }

    for (const wheelRef of wheelRefs) {
      if (wheelRef.current) {
        wheelRef.current.rotation.x += speed * delta * 2;
      }
    }

    if (isDrifting) {
      const pulse =
        0.08 + Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.12;
      if (smoke1Ref.current) smoke1Ref.current.scale.setScalar(pulse * 10);
      if (smoke2Ref.current) smoke2Ref.current.scale.setScalar(pulse * 10);
    } else {
      if (smoke1Ref.current) smoke1Ref.current.scale.setScalar(0);
      if (smoke2Ref.current) smoke2Ref.current.scale.setScalar(0);
    }

    onSpeedChange(speed);
    checkLapProgress(newPos);
  });

  return (
    <group ref={meshRef}>
      {/* === SPORTS CAR BODY === */}

      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.4, 0.35, 3.2]} />
        <meshStandardMaterial
          color={character.kartColor}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Hood (front, slightly angled down) */}
      <mesh castShadow position={[0, 0.57, 0.8]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[1.3, 0.08, 1.0]} />
        <meshStandardMaterial
          color={character.kartColor}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Roof / cabin */}
      <mesh castShadow position={[0, 0.72, -0.1]}>
        <boxGeometry args={[0.9, 0.35, 1.2]} />
        <meshStandardMaterial
          color={character.kartColor}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Windshield (dark tinted glass) */}
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

      {/* Rear window */}
      <mesh position={[0, 0.72, -0.72]} rotation={[0.4, 0, 0]}>
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
        <meshStandardMaterial
          color={character.kartColor}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Side skirt left */}
      <mesh castShadow position={[-0.72, 0.28, 0]}>
        <boxGeometry args={[0.08, 0.1, 2.8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Side skirt right */}
      <mesh castShadow position={[0.72, 0.28, 0]}>
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

      {/* Rear spoiler wing */}
      <mesh castShadow position={[0, 0.92, -1.4]}>
        <boxGeometry args={[1.3, 0.05, 0.25]} />
        <meshStandardMaterial
          color={character.kartColor}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Spoiler pillars */}
      <mesh position={[-0.45, 0.78, -1.4]}>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.45, 0.78, -1.4]}>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* === NEON UNDERGLOW === */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.3, 0.03, 3.0]} />
        <meshStandardMaterial
          color={character.kartColor}
          emissive={character.kartColor}
          emissiveIntensity={2.0}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>

      {/* === WHEELS === */}
      {WHEEL_POSITIONS.map((pos, i) => (
        <group key={WHEEL_KEYS[i]} position={pos}>
          {/* Tire */}
          <mesh ref={wheelRefs[i]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.28, 20]} />
            <meshStandardMaterial
              color="#111111"
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.3, 12]} />
            <meshStandardMaterial
              color="#cccccc"
              metalness={0.95}
              roughness={0.05}
            />
          </mesh>
          {/* Spokes */}
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

      {/* === HEADLIGHTS === */}
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

      {/* === TAILLIGHTS === */}
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

      {/* === TWIN EXHAUSTS === */}
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

      {/* === DRIFT SPARKS === */}
      <mesh ref={smoke1Ref} position={[-0.78, 0.28, -1.1]} scale={0}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#FF8800"
          emissive="#FF4400"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={smoke2Ref} position={[0.78, 0.28, -1.1]} scale={0}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#FFDD00"
          emissive="#FF8800"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* === SHIELD BUBBLE === */}
      {shieldActive && (
        <mesh>
          <sphereGeometry args={[2.0, 16, 16]} />
          <meshStandardMaterial color="#00aaff" transparent opacity={0.25} />
        </mesh>
      )}
    </group>
  );
}
