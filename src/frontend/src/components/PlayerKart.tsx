import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Character } from '../data/characters';
import { useKartControls } from '../hooks/useKartControls';
import { useDrifting } from '../hooks/useDrifting';
import { usePhysics } from '../hooks/usePhysics';
import { useLapTracking } from '../hooks/useLapTracking';

interface PlayerKartProps {
  character: Character;
  position: [number, number, number];
  rotation: [number, number, number];
  onPositionChange: (pos: [number, number, number]) => void;
  onRotationChange: (rot: [number, number, number]) => void;
  onSpeedChange: (speed: number) => void;
  raceStatus: string;
}

export default function PlayerKart({
  character,
  position,
  rotation,
  onPositionChange,
  onRotationChange,
  onSpeedChange,
  raceStatus,
}: PlayerKartProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { throttle, brake, steer, drift } = useKartControls(raceStatus === 'racing');
  const { isDrifting, driftBoost } = useDrifting(drift, steer);
  const { velocity, updatePhysics } = usePhysics(character);
  const { checkLapProgress } = useLapTracking();

  useFrame((state, delta) => {
    if (!meshRef.current || raceStatus !== 'racing') return;

    const speedMultiplier = character.speed / 10;
    const accelMultiplier = character.acceleration / 10;
    const handleMultiplier = character.handling / 10;

    // Update physics
    const newVelocity = updatePhysics(
      throttle,
      brake,
      steer,
      isDrifting,
      driftBoost,
      speedMultiplier,
      accelMultiplier,
      handleMultiplier,
      delta
    );

    // Update position
    const newPos: [number, number, number] = [
      meshRef.current.position.x + newVelocity.x * delta,
      0.5,
      meshRef.current.position.z + newVelocity.z * delta,
    ];

    // Track boundaries (circular track)
    const distFromCenter = Math.sqrt(newPos[0] ** 2 + (newPos[2] + 10) ** 2);
    if (distFromCenter > 15 || distFromCenter < 5) {
      // Bounce back
      const angle = Math.atan2(newPos[2] + 10, newPos[0]);
      const targetDist = distFromCenter > 15 ? 14.5 : 5.5;
      newPos[0] = Math.cos(angle) * targetDist;
      newPos[2] = Math.sin(angle) * targetDist - 10;
    }

    meshRef.current.position.set(...newPos);
    onPositionChange(newPos);

    // Update rotation
    const targetRotation = Math.atan2(newVelocity.x, newVelocity.z);
    const currentRotation = meshRef.current.rotation.y;
    const newRotation = THREE.MathUtils.lerp(currentRotation, targetRotation, 0.1);
    meshRef.current.rotation.y = newRotation;
    onRotationChange([0, newRotation, isDrifting ? steer * 0.2 : 0]);

    // Update speed
    const speed = Math.sqrt(newVelocity.x ** 2 + newVelocity.z ** 2);
    onSpeedChange(speed);

    // Check lap progress
    checkLapProgress(newPos);
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Kart body */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.6, 2]} />
        <meshStandardMaterial color={character.kartColor} />
      </mesh>

      {/* Wheels */}
      <mesh position={[-0.5, -0.3, 0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.5, -0.3, 0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.5, -0.3, -0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.5, -0.3, -0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Driver indicator */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}
