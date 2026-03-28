import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface RocketProjectileProps {
  startPosition: [number, number, number];
  direction: number; // kart Y rotation
  npcPositions: [number, number, number][];
  onHit: (npcIndex: number) => void;
  onDone: () => void;
}

export default function RocketProjectile({
  startPosition,
  direction,
  npcPositions,
  onHit,
  onDone,
}: RocketProjectileProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const posRef = useRef<THREE.Vector3>(new THREE.Vector3(...startPosition));
  const doneRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  // direction vector
  const dirVec = useRef(
    new THREE.Vector3(Math.sin(direction), 0, Math.cos(direction)),
  );

  useEffect(() => {
    return () => {
      doneRef.current = true;
    };
  }, []);

  useFrame((_, delta) => {
    if (doneRef.current) return;

    // Move projectile forward
    const speed = 60;
    posRef.current.addScaledVector(dirVec.current, speed * delta);

    if (groupRef.current) {
      groupRef.current.position.copy(posRef.current);
    }

    // Check hit
    for (let i = 0; i < npcPositions.length; i++) {
      const npc = npcPositions[i];
      const dx = posRef.current.x - npc[0];
      const dz = posRef.current.z - npc[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 4) {
        doneRef.current = true;
        onHit(i);
        onDone();
        return;
      }
    }

    // Timeout after 3 seconds
    if (Date.now() - startTimeRef.current > 3000) {
      doneRef.current = true;
      onDone();
    }
  });

  return (
    <group ref={groupRef} position={startPosition}>
      {/* Rocket body */}
      <mesh>
        <sphereGeometry args={[0.35, 10, 10]} />
        <meshStandardMaterial
          color="#ff3300"
          emissive="#ff6600"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
      {/* Glow light */}
      <pointLight color="#ff4400" intensity={6} distance={10} decay={2} />
    </group>
  );
}
