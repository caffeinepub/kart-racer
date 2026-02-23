import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PowerUpItemProps {
  position: [number, number, number];
  onCollect: (powerUpId: string) => void;
}

export default function PowerUpItem({ position, onCollect }: PowerUpItemProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);
  const [respawnTimer, setRespawnTimer] = useState(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (collected) {
      setRespawnTimer((prev) => {
        const newTimer = prev + delta;
        if (newTimer > 5) {
          setCollected(false);
          return 0;
        }
        return newTimer;
      });
      return;
    }

    // Rotate and bob
    meshRef.current.rotation.y += delta * 2;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
  });

  if (collected) return null;

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
    </mesh>
  );
}
