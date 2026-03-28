import { useFrame } from "@react-three/fiber";
import { type ReactElement, useMemo, useRef } from "react";
import * as THREE from "three";
import type { MapTheme } from "../data/maps";

export const TRACK_WIDTH = 9;

interface RaceTrackProps {
  theme: MapTheme;
  waypoints: [number, number][];
}

interface Segment {
  key: string;
  mx: number;
  mz: number;
  length: number;
  angle: number;
  isStart: boolean;
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

const checkerTex = createCheckerTexture();

export default function RaceTrack({ theme, waypoints }: RaceTrackProps) {
  const segments = useMemo<Segment[]>(() => {
    return waypoints.map((from, i) => {
      const to = waypoints[(i + 1) % waypoints.length];
      const mx = (from[0] + to[0]) / 2;
      const mz = (from[1] + to[1]) / 2;
      const dx = to[0] - from[0];
      const dz = to[1] - from[1];
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dx, dz);
      const isStart = i === waypoints.length - 1;
      return { key: `seg-${i}`, mx, mz, length, angle, isStart };
    });
  }, [waypoints]);

  if (theme === "rainbow") {
    return <RainbowTrack segments={segments} />;
  }

  const groundColor =
    theme === "castle" ? "#1a1515" : theme === "beach" ? "#c8a96e" : "#3a7d44";
  const roadColor =
    theme === "castle" ? "#1c1c1c" : theme === "beach" ? "#888888" : "#2a2a2a";

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial
          color={groundColor}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {segments.map((seg) => (
        <group key={seg.key}>
          <mesh
            position={[seg.mx, 0.02, seg.mz]}
            rotation={[-Math.PI / 2, 0, seg.angle]}
            receiveShadow
          >
            <planeGeometry args={[TRACK_WIDTH, seg.length]} />
            <meshStandardMaterial
              color={roadColor}
              roughness={0.85}
              metalness={0.1}
            />
          </mesh>
          {seg.isStart && (
            <mesh
              position={[seg.mx, 0.04, seg.mz]}
              rotation={[-Math.PI / 2, 0, seg.angle]}
              receiveShadow
            >
              <planeGeometry args={[TRACK_WIDTH, 2]} />
              <meshStandardMaterial emissive="#ffffff" emissiveIntensity={0.1}>
                <primitive attach="map" object={checkerTex} />
              </meshStandardMaterial>
            </mesh>
          )}
          <SegmentCurb seg={seg} side={-1} theme={theme} />
          <SegmentCurb seg={seg} side={1} theme={theme} />
        </group>
      ))}

      {theme === "meadows" && <MeadowsDecorations />}
      {theme === "castle" && <CastleDecorations segments={segments} />}
      {theme === "beach" && <BeachDecorations />}
    </group>
  );
}

// ── Rainbow Road ──────────────────────────────────────────
function RainbowTrack({ segments }: { segments: Segment[] }) {
  const segRefs = useRef<(THREE.Mesh | null)[]>([]);
  const hueRef = useRef(0);

  useFrame((_, delta) => {
    hueRef.current = (hueRef.current + delta * 40) % 360;
    segRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const hue = ((hueRef.current + i * 20) % 360) / 360;
      const color = new THREE.Color().setHSL(hue, 1, 0.55);
      mat.emissive.set(color);
      mat.emissiveIntensity = 1.8;
      mat.color.set(color);
    });
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#050510" roughness={1} metalness={0} />
      </mesh>

      {segments.map((seg, i) => (
        <group key={seg.key}>
          <mesh
            ref={(el) => {
              segRefs.current[i] = el;
            }}
            position={[seg.mx, 0.02, seg.mz]}
            rotation={[-Math.PI / 2, 0, seg.angle]}
          >
            <planeGeometry args={[TRACK_WIDTH, seg.length]} />
            <meshStandardMaterial
              color="#8800ff"
              emissive="#8800ff"
              emissiveIntensity={1.8}
              toneMapped={false}
            />
          </mesh>
          {seg.isStart && (
            <mesh
              position={[seg.mx, 0.04, seg.mz]}
              rotation={[-Math.PI / 2, 0, seg.angle]}
            >
              <planeGeometry args={[TRACK_WIDTH, 2]} />
              <meshStandardMaterial emissive="#ffffff" emissiveIntensity={0.5}>
                <primitive attach="map" object={checkerTex} />
              </meshStandardMaterial>
            </mesh>
          )}
        </group>
      ))}

      <StarField />

      {([-40, 0, 40, 80, -20] as number[]).map((x, i) => (
        <FloatingOrb key={`orb-${x}`} position={[x, 3, (i - 2) * 20]} />
      ))}
    </group>
  );
}

function StarField() {
  const stars = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 200; i++) {
      pts.push([
        (Math.random() - 0.5) * 300,
        Math.random() * 6 + 0.5,
        (Math.random() - 0.5) * 300,
      ]);
    }
    return pts;
  }, []);

  return (
    <>
      {stars.map((pos) => (
        <mesh
          key={`star-${pos[0].toFixed(1)}-${pos[2].toFixed(1)}`}
          position={pos}
        >
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

function FloatingOrb({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);
  const t = useRef(Math.random() * Math.PI * 2);
  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t.current) * 0.8;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.8, 12, 12]} />
      <meshStandardMaterial
        color="#ff00ff"
        emissive="#ff00ff"
        emissiveIntensity={2.5}
        toneMapped={false}
      />
      <pointLight color="#ff00ff" intensity={3} distance={12} decay={2} />
    </mesh>
  );
}

// ── Shared curb ──────────────────────────────────────────
function SegmentCurb({
  seg,
  side,
  theme,
}: { seg: Segment; side: -1 | 1; theme: MapTheme }) {
  const halfW = TRACK_WIDTH / 2;
  const perpX = Math.cos(seg.angle) * (halfW + 0.3) * side;
  const perpZ = -Math.sin(seg.angle) * (halfW + 0.3) * side;
  const cx = seg.mx + perpX;
  const cz = seg.mz + perpZ;

  const numStripes = Math.max(1, Math.floor(seg.length / 2));
  const stripes: ReactElement[] = [];
  for (let n = 0; n < numStripes; n++) {
    const t = (n + 0.5) / numStripes;
    const stripeX = cx + Math.sin(seg.angle) * (t - 0.5) * seg.length;
    const stripeZ = cz + Math.cos(seg.angle) * (t - 0.5) * seg.length;
    const isRed = n % 2 === 0;
    const color1 =
      theme === "castle"
        ? "#551111"
        : theme === "beach"
          ? "#ffaa33"
          : "#cc2222";
    const color2 =
      theme === "castle"
        ? "#2a2a2a"
        : theme === "beach"
          ? "#fffaaa"
          : "#eeeeee";
    stripes.push(
      <mesh
        key={n}
        position={[stripeX, 0.15, stripeZ]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.6, 0.25, seg.length / numStripes - 0.05]} />
        <meshStandardMaterial color={isRed ? color1 : color2} />
      </mesh>,
    );
  }
  return <>{stripes}</>;
}

// ── Meadows ──────────────────────────────────────────────
function MeadowsDecorations() {
  return (
    <group>
      <Grandstand position={[-15, 0, 18]} color="#3366cc" />
      <Grandstand position={[15, 0, 18]} color="#cc3333" />
      <FlagPole position={[-7, 0, 14]} colorAlt={false} />
      <FlagPole position={[7, 0, 14]} colorAlt />
      <Mushroom position={[-12, 0, -35]} capColor="#ff3333" />
      <Mushroom position={[12, 0, -35]} capColor="#ffdd00" />
      <Mushroom position={[30, 0, -38]} capColor="#3399ff" />
      <Mushroom position={[60, 0, -32]} capColor="#ff3333" />
      <Tree position={[65, 0, 0]} />
      <Tree position={[65, 0, 25]} />
      <Tree position={[48, 0, 40]} />
      <Tree position={[15, 0, 45]} />
      <Tree position={[-10, 0, 42]} />
      <Tree position={[-28, 0, 20]} />
      <Grandstand position={[62, 0, -5]} color="#aa8800" />
    </group>
  );
}

function Mushroom({
  position,
  capColor,
}: { position: [number, number, number]; capColor: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#c8a96e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 12, 12]} />
        <meshStandardMaterial color={capColor} roughness={0.7} />
      </mesh>
      {["dot0", "dot1", "dot2", "dot3"].map((dotKey, i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={dotKey}
            position={[Math.cos(a) * 0.7, 2.6, Math.sin(a) * 0.7]}
            castShadow
          >
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        );
      })}
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
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
  );
}

function Grandstand({
  position,
  color,
}: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[4, 4, 8]} />
        <meshStandardMaterial color="#8B4513" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[4.5, 0.5, 8.5]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.7} />
      </mesh>
    </group>
  );
}

function FlagPole({
  position,
  colorAlt,
}: { position: [number, number, number]; colorAlt: boolean }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.1, 6, 8]} />
        <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
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
  );
}

// ── Castle ───────────────────────────────────────────────
function CastleDecorations({ segments }: { segments: Segment[] }) {
  const wallPositions = segments
    .filter((_, i) => i % 3 === 0)
    .map((seg) => ({ x: seg.mx, z: seg.mz, angle: seg.angle }));

  return (
    <group>
      {(
        [
          [-15, -45],
          [15, -20],
          [-5, -10],
        ] as [number, number][]
      ).map(([x, z]) => (
        <mesh
          key={`lava-${x}-${z}`}
          position={[x, 0.03, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[6, 4]} />
          <meshStandardMaterial
            color="#ff4400"
            emissive="#ff2200"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
      ))}
      {(
        [
          [-12, -25],
          [10, -30],
          [-18, -5],
        ] as [number, number][]
      ).map(([x, z]) => (
        <pointLight
          key={`torch-${x}-${z}`}
          position={[x, 3, z]}
          color="#ff8800"
          intensity={6}
          distance={18}
          decay={2}
        />
      ))}
      {wallPositions.map((wp) => (
        <CastleWall
          key={`wall-${wp.x.toFixed(1)}-${wp.z.toFixed(1)}`}
          x={wp.x}
          z={wp.z}
          angle={wp.angle}
        />
      ))}
    </group>
  );
}

function CastleWall({ x, z, angle }: { x: number; z: number; angle: number }) {
  const perpX = Math.cos(angle) * 7;
  const perpZ = -Math.sin(angle) * 7;
  return (
    <group>
      {([-1, 1] as const).map((side) => (
        <mesh
          key={`side-${side}`}
          position={[x + perpX * side, 2.5, z + perpZ * side]}
          rotation={[0, angle, 0]}
          castShadow
        >
          <boxGeometry args={[1.5, 5, 4]} />
          <meshStandardMaterial
            color="#3a3030"
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Beach ────────────────────────────────────────────────
function BeachDecorations() {
  return (
    <group>
      <mesh position={[-80, 0.15, 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 200]} />
        <meshStandardMaterial
          color="#0077be"
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>
      <PalmTree position={[-35, 0, 35]} />
      <PalmTree position={[-40, 0, 10]} />
      <PalmTree position={[-30, 0, -10]} />
      <PalmTree position={[60, 0, 50]} />
      <PalmTree position={[85, 0, 15]} />
      <BeachUmbrella position={[-28, 0, 25]} color="#ff3333" />
      <BeachUmbrella position={[-32, 0, 0]} color="#3399ff" />
      <BeachUmbrella position={[75, 0, 30]} color="#ffdd00" />
    </group>
  );
}

function PalmTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.35, 6, 8]} />
        <meshStandardMaterial color="#c8a96e" roughness={0.9} />
      </mesh>
      {["leaf0", "leaf1", "leaf2", "leaf3", "leaf4"].map((leafKey, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={leafKey}
            position={[Math.cos(a) * 1.5, 6.2, Math.sin(a) * 1.5]}
            rotation={[0.6, a, 0]}
            castShadow
          >
            <coneGeometry args={[0.3, 2.5, 6]} />
            <meshStandardMaterial color="#22aa44" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

function BeachUmbrella({
  position,
  color,
}: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3, 6]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0, 3.1, 0]} rotation={[-0.1, 0, 0]} castShadow>
        <coneGeometry args={[1.5, 0.5, 12]} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
