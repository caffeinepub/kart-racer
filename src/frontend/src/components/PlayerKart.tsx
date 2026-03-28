import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { Character } from "../data/characters";
import { useDrifting } from "../hooks/useDrifting";
import { useKartControls } from "../hooks/useKartControls";
import { useLapTracking } from "../hooks/useLapTracking";
import { usePhysics } from "../hooks/usePhysics";

const WHEEL_POSITIONS: [number, number, number][] = [
  [-0.5, -0.3, 0.7],
  [0.5, -0.3, 0.7],
  [-0.5, -0.3, -0.7],
  [0.5, -0.3, -0.7],
];
const WHEEL_KEYS = ["wfl", "wfr", "wrl", "wrr"];
const RIM_KEYS = ["rfl", "rfr", "rrl", "rrr"];

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

    // No circular boundary - free movement on the track
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
      {/* Kart body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.6, 2]} />
        <meshStandardMaterial
          color={character.kartColor}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Top panel */}
      <mesh position={[0, 0.35, -0.2]} castShadow>
        <boxGeometry args={[1, 0.1, 1.2]} />
        <meshStandardMaterial
          color={character.kartColor}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Front bumper */}
      <mesh position={[0, 0, 1.1]} castShadow>
        <boxGeometry args={[1.2, 0.3, 0.2]} />
        <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Rear spoiler */}
      <mesh position={[0, 0.6, -1.1]} castShadow>
        <boxGeometry args={[1.2, 0.4, 0.1]} />
        <meshStandardMaterial
          color={character.kartColor}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Wheels */}
      {WHEEL_POSITIONS.map((pos, i) => (
        <mesh
          key={WHEEL_KEYS[i]}
          ref={wheelRefs[i]}
          position={pos}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.3, 0.3, 0.25, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
      ))}

      {/* Wheel rims */}
      {WHEEL_POSITIONS.map((pos, i) => (
        <mesh key={RIM_KEYS[i]} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.26, 16]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Driver */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.3}
          metalness={0.4}
          roughness={0.2}
        />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.4, 0.1, 1.05]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffff88"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[0.4, 0.1, 1.05]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffff88"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Exhaust */}
      <mesh position={[-0.3, -0.1, -1.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.3, -0.1, -1.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Drift sparks */}
      <mesh ref={smoke1Ref} position={[-0.5, -0.3, -0.9]} scale={0}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#FF8800"
          emissive="#FF4400"
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh ref={smoke2Ref} position={[0.5, -0.3, -0.9]} scale={0}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#FFDD00"
          emissive="#FF8800"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Shield bubble */}
      {shieldActive && (
        <mesh>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial color="#00aaff" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
