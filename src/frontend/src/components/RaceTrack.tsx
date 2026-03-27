import * as THREE from "three";

interface BarrierItem {
  key: string;
  pos: [number, number, number];
}
interface FlagItem {
  key: string;
  pos: [number, number, number];
  colorAlt: boolean;
}
interface TreeItem {
  key: string;
  pos: [number, number, number];
}

const OUTER_BARRIERS: BarrierItem[] = createBarriers(18, 64, "outer");
const INNER_BARRIERS: BarrierItem[] = createBarriers(5, 32, "inner");
const FLAG_POLES: FlagItem[] = createFlagPoles();
const TREES: TreeItem[] = createTrees();

export default function RaceTrack() {
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#3a7d44" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Track surface */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, -10]}
        receiveShadow
      >
        <ringGeometry args={[8, 15, 64]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Track inner edge */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, -10]}
        receiveShadow
      >
        <ringGeometry args={[7.9, 8.1, 64]} />
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ffcc00"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Track center line */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, -10]}
        receiveShadow
      >
        <ringGeometry args={[10.4, 10.6, 64]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Track outer edge */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, -10]}
        receiveShadow
      >
        <ringGeometry args={[14.9, 15.1, 64]} />
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ffcc00"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Start/Finish line */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
        receiveShadow
      >
        <planeGeometry args={[7, 1.2]} />
        <meshStandardMaterial emissive="#ffffff" emissiveIntensity={0.1}>
          <primitive attach="map" object={createCheckerTexture()} />
        </meshStandardMaterial>
      </mesh>

      {/* Outer barriers */}
      {OUTER_BARRIERS.map(({ key, pos }) => (
        <group key={key} position={pos}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 2, 0.8]} />
            <meshStandardMaterial
              color="#cc2222"
              metalness={0.3}
              roughness={0.6}
            />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[0.9, 0.2, 0.9]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Inner barriers */}
      {INNER_BARRIERS.map(({ key, pos }) => (
        <group key={key} position={pos}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 2, 0.8]} />
            <meshStandardMaterial
              color="#2a6fd6"
              metalness={0.3}
              roughness={0.6}
            />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[0.9, 0.2, 0.9]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Grandstands */}
      <group position={[-20, 0, -10]}>
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[4, 4, 8]} />
          <meshStandardMaterial
            color="#8B4513"
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        <mesh position={[0, 4.5, 0]} castShadow>
          <boxGeometry args={[4.5, 0.5, 8.5]} />
          <meshStandardMaterial
            color="#cc3333"
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
      </group>
      <group position={[20, 0, -10]}>
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[4, 4, 8]} />
          <meshStandardMaterial
            color="#8B4513"
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        <mesh position={[0, 4.5, 0]} castShadow>
          <boxGeometry args={[4.5, 0.5, 8.5]} />
          <meshStandardMaterial
            color="#3366cc"
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
      </group>

      {/* Flag poles */}
      {FLAG_POLES.map(({ key, pos, colorAlt }) => (
        <group key={key} position={pos}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 6, 8]} />
            <meshStandardMaterial
              color="#cccccc"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0.5, 2.5, 0]} castShadow>
            <boxGeometry args={[1, 0.6, 0.05]} />
            <meshStandardMaterial
              color={colorAlt ? "#ff3333" : "#3366ff"}
              metalness={0.1}
              roughness={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* Trees */}
      {TREES.map(({ key, pos }) => (
        <group key={key} position={pos}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
            <meshStandardMaterial color="#654321" roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.5, 0]} castShadow>
            <coneGeometry args={[1.5, 3, 8]} />
            <meshStandardMaterial color="#228B22" roughness={0.8} />
          </mesh>
          <mesh position={[0, 5, 0]} castShadow>
            <coneGeometry args={[1.2, 2.5, 8]} />
            <meshStandardMaterial color="#2a9d2a" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function createCheckerTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const size = 16;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? "#000000" : "#FFFFFF";
      ctx.fillRect(r * size, c * size, size, size);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createBarriers(
  radius: number,
  count: number,
  prefix: string,
): BarrierItem[] {
  const items: BarrierItem[] = [];
  for (let step = 0; step < count; step++) {
    const angle = (step / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius - 10;
    items.push({
      key: `${prefix}-${Math.round(x * 100)}-${Math.round(z * 100)}`,
      pos: [x, 1, z],
    });
  }
  return items;
}

function createFlagPoles(): FlagItem[] {
  const coords: [number, number, number][] = [
    [-22, 0, -18],
    [-22, 0, -10],
    [-22, 0, -2],
    [22, 0, -18],
    [22, 0, -10],
    [22, 0, -2],
  ];
  return coords.map((pos, n) => ({
    key: `flag-${pos[0]}-${pos[2]}`,
    pos,
    colorAlt: n % 2 === 0,
  }));
}

function createTrees(): TreeItem[] {
  const coords: [number, number, number][] = [
    [-28, 0, -20],
    [-28, 0, -5],
    [-28, 0, 5],
    [28, 0, -20],
    [28, 0, -5],
    [28, 0, 5],
    [-15, 0, 15],
    [15, 0, 15],
    [-15, 0, -35],
    [15, 0, -35],
  ];
  return coords.map((pos) => ({
    key: `tree-${pos[0]}-${pos[2]}`,
    pos,
  }));
}
