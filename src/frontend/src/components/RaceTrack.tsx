import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function RaceTrack() {
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>

      {/* Track surface - oval shape */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -10]} receiveShadow>
        <ringGeometry args={[8, 15, 32]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Track markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -10]} receiveShadow>
        <ringGeometry args={[10.4, 10.6, 32]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Start/Finish line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[7, 1]} />
        <meshStandardMaterial color="#FFFFFF">
          <primitive attach="map" object={createCheckerTexture()} />
        </meshStandardMaterial>
      </mesh>

      {/* Outer barriers */}
      {createBarriers(18, 64).map((pos, i) => (
        <mesh key={`outer-${i}`} position={pos} castShadow>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#FF3333" />
        </mesh>
      ))}

      {/* Inner barriers */}
      {createBarriers(5, 32).map((pos, i) => (
        <mesh key={`inner-${i}`} position={pos} castShadow>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#3A86FF" />
        </mesh>
      ))}

      {/* Decorative elements */}
      <mesh position={[-20, 1, -10]} castShadow>
        <coneGeometry args={[2, 4, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[20, 1, -10]} castShadow>
        <coneGeometry args={[2, 4, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}

function createCheckerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const size = 8;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? '#000000' : '#FFFFFF';
      ctx.fillRect(i * size, j * size, size, size);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createBarriers(radius: number, count: number): [number, number, number][] {
  const barriers: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius - 10;
    barriers.push([x, 1, z]);
  }
  return barriers;
}
