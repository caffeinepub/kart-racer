import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { powerups } from "../data/powerups";

interface PowerUpItemProps {
  position: [number, number, number];
  onCollect: (powerUpId: string) => void;
  kartPosition?: [number, number, number];
}

export default function PowerUpItem({
  position,
  onCollect,
  kartPosition,
}: PowerUpItemProps) {
  const boxRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Proximity check for collection
  useEffect(() => {
    if (collected || !kartPosition) return;
    const dx = kartPosition[0] - position[0];
    const dz = kartPosition[2] - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 1.5) {
      const randomPowerUp =
        powerups[Math.floor(Math.random() * powerups.length)];
      onCollect(randomPowerUp.id);
      setCollected(true);
      const id = setTimeout(() => setCollected(false), 8000);
      setTimeoutId(id);
    }
  }, [kartPosition, collected, position, onCollect]);

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  useFrame((state, delta) => {
    if (!boxRef.current || collected) return;
    boxRef.current.rotation.y += delta * 2;

    // Rainbow-ish hue shift on emissive
    const t = state.clock.elapsedTime;
    const mat = boxRef.current.material as THREE.MeshStandardMaterial;
    const hue = (t * 0.1) % 1;
    mat.emissive.setHSL(hue, 1, 0.5);

    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 1.5;
      const scale = 1.05 + Math.sin(t * 4) * 0.05;
      wireRef.current.scale.set(scale, scale, scale);
    }
  });

  if (collected) return null;

  return (
    <group position={position}>
      {/* Main glowing cube */}
      <mesh ref={boxRef}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#ffdd00"
          emissive="#ffdd00"
          emissiveIntensity={0.5}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Wireframe glow shell */}
      <mesh ref={wireRef}>
        <boxGeometry args={[1.0, 1.0, 1.0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffdd00"
          emissiveIntensity={0.8}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        intensity={1.5}
        distance={4}
        color="#ffdd00"
      />
    </group>
  );
}
