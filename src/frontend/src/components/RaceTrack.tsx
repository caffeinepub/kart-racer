import { type ReactElement, useMemo } from "react";
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

  const groundColor =
    theme === "city"
      ? "#0a0a0a"
      : theme === "highway"
        ? "#1a1206"
        : theme === "docks"
          ? "#080808"
          : "#2a2520";

  const roadColor =
    theme === "city"
      ? "#151515"
      : theme === "highway"
        ? "#1c1c1c"
        : theme === "docks"
          ? "#111111"
          : "#1a1a1a";

  const roadMetalness = theme === "docks" ? 0.4 : 0.1;
  const roadRoughness = theme === "docks" ? 0.3 : 0.85;

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial
          color={groundColor}
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {segments.map((seg) => (
        <group key={seg.key}>
          {/* Road surface */}
          <mesh
            position={[seg.mx, 0.02, seg.mz]}
            rotation={[-Math.PI / 2, 0, seg.angle]}
            receiveShadow
          >
            <planeGeometry args={[TRACK_WIDTH, seg.length]} />
            <meshStandardMaterial
              color={roadColor}
              roughness={roadRoughness}
              metalness={roadMetalness}
            />
          </mesh>

          {/* Center lane markings */}
          <mesh
            position={[seg.mx, 0.03, seg.mz]}
            rotation={[-Math.PI / 2, 0, seg.angle]}
          >
            <planeGeometry args={[0.15, seg.length * 0.45]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.4}
              transparent
              opacity={0.6}
            />
          </mesh>

          {/* Start/finish line */}
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

      {theme === "city" && <CityDecorations segments={segments} />}
      {theme === "highway" && <HighwayDecorations segments={segments} />}
      {theme === "docks" && <DocksDecorations segments={segments} />}
      {theme === "mountain" && <MountainDecorations segments={segments} />}
    </group>
  );
}

// ── Curbs ──────────────────────────────────────────────────
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
    const isAlt = n % 2 === 0;

    const color1 =
      theme === "city"
        ? "#00ccff"
        : theme === "highway"
          ? "#ff8800"
          : theme === "docks"
            ? "#ffcc00"
            : "#cc2222";
    const color2 =
      theme === "city"
        ? "#003366"
        : theme === "highway"
          ? "#ffffff"
          : theme === "docks"
            ? "#111111"
            : "#eeeeee";

    stripes.push(
      <mesh
        key={n}
        position={[stripeX, 0.15, stripeZ]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.6, 0.25, seg.length / numStripes - 0.05]} />
        <meshStandardMaterial
          color={isAlt ? color1 : color2}
          emissive={isAlt && theme === "city" ? color1 : undefined}
          emissiveIntensity={isAlt && theme === "city" ? 1.0 : 0}
          toneMapped={false}
        />
      </mesh>,
    );
  }
  return <>{stripes}</>;
}

// Building positions: [x, y, z, width, height]
const BUILDING_POSITIONS: [number, number, number, number, number][] = [
  [-25, 0, -20, 8, 30],
  [70, 0, -20, 10, 40],
  [70, 0, 25, 8, 25],
  [-30, 0, 30, 7, 35],
  [45, 0, 45, 6, 20],
  [-20, 0, -15, 5, 18],
  [30, 0, -40, 9, 28],
];

const WIN_FRACS = [0.3, 0.5, 0.7];
const WIN_FRAC_KEYS = ["w30", "w50", "w70"];

// ── City Decorations ──────────────────────────────────────
function CityDecorations({ segments }: { segments: Segment[] }) {
  return (
    <group>
      {/* Skyscrapers with glowing windows */}
      {BUILDING_POSITIONS.map(([x, , z, w, h]) => (
        <group key={`bldg-${x}-${z}`} position={[x, 0, z]}>
          <mesh castShadow position={[0, h / 2, 0]}>
            <boxGeometry args={[w, h, w * 0.8]} />
            <meshStandardMaterial
              color="#0a0a0f"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
          {WIN_FRACS.map((frac, wi) => (
            <mesh key={WIN_FRAC_KEYS[wi]} position={[0, h * frac, w * 0.41]}>
              <boxGeometry args={[w * 0.7, h * 0.06, 0.05]} />
              <meshStandardMaterial
                color="#ffaa44"
                emissive="#ff8800"
                emissiveIntensity={wi % 2 === 0 ? 1.5 : 0.8}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Neon billboard signs along track */}
      {segments
        .filter((_, i) => i % 4 === 1)
        .map((seg) => (
          <NeonBillboard
            key={seg.key}
            x={seg.mx + Math.cos(seg.angle) * 8}
            z={seg.mz - Math.sin(seg.angle) * 8}
            angle={seg.angle}
          />
        ))}

      {/* Streetlights */}
      {segments
        .filter((_, i) => i % 2 === 0)
        .map((seg) => (
          <group key={`light-${seg.key}`}>
            <Streetlight
              x={seg.mx + Math.cos(seg.angle) * 6}
              z={seg.mz - Math.sin(seg.angle) * 6}
            />
            <Streetlight
              x={seg.mx - Math.cos(seg.angle) * 6}
              z={seg.mz + Math.sin(seg.angle) * 6}
            />
          </group>
        ))}
    </group>
  );
}

function NeonBillboard({
  x,
  z,
  angle,
}: { x: number; z: number; angle: number }) {
  const colors = ["#ff0066", "#00ffcc", "#ff6600", "#aa00ff"];
  const color = colors[Math.floor(Math.abs(x + z) % colors.length)];
  return (
    <group position={[x, 0, z]} rotation={[0, angle, 0]}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 6, 6]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 6.5, 0]}>
        <boxGeometry args={[4, 2, 0.15]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, 6.5, 0.1]}>
        <boxGeometry args={[3.6, 1.6, 0.05]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, 6.5, 0.3]}
        color={color}
        intensity={4}
        distance={15}
        decay={2}
      />
    </group>
  );
}

function Streetlight({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 6, 6]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.4, 6.1, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.9, 6]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.85, 6.2, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial
          color="#ffeeaa"
          emissive="#ff9900"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0.85, 6.2, 0]}
        color="#ff8800"
        intensity={5}
        distance={20}
        decay={2}
      />
    </group>
  );
}

// ── Highway Decorations ───────────────────────────────────
const ROCK_XS = [-60, -40, 80, 110, -15] as const;

function HighwayDecorations({ segments }: { segments: Segment[] }) {
  return (
    <group>
      {/* Desert rock formations */}
      {ROCK_XS.map((x, i) => (
        <group key={`rock-${x}`} position={[x, 0, (i - 2) * 20]}>
          <mesh position={[0, 3, 0]} castShadow>
            <boxGeometry args={[8, 6, 6]} />
            <meshStandardMaterial
              color="#3a2a18"
              roughness={0.95}
              metalness={0.0}
            />
          </mesh>
          <mesh position={[3, 5, 2]} castShadow>
            <boxGeometry args={[4, 3, 3]} />
            <meshStandardMaterial
              color="#2e2010"
              roughness={0.95}
              metalness={0.0}
            />
          </mesh>
        </group>
      ))}

      {/* Guardrails */}
      {segments
        .filter((_, i) => i % 3 === 0)
        .map((seg) => (
          <group key={`rail-${seg.key}`}>
            <GuardRail
              x={seg.mx + Math.cos(seg.angle) * 5.5}
              z={seg.mz - Math.sin(seg.angle) * 5.5}
              angle={seg.angle}
              length={seg.length}
            />
            <GuardRail
              x={seg.mx - Math.cos(seg.angle) * 5.5}
              z={seg.mz + Math.sin(seg.angle) * 5.5}
              angle={seg.angle}
              length={seg.length}
            />
          </group>
        ))}

      {/* Highway signs */}
      {segments
        .filter((_, i) => i % 4 === 2)
        .map((seg) => (
          <HighwaySign
            key={`sign-${seg.key}`}
            x={seg.mx + Math.cos(seg.angle) * 7}
            z={seg.mz - Math.sin(seg.angle) * 7}
            angle={seg.angle}
          />
        ))}

      {/* Overpass pillars */}
      {segments
        .filter((_, i) => i % 5 === 0)
        .map((seg) => (
          <mesh
            key={`pillar-${seg.key}`}
            position={[seg.mx, 3, seg.mz]}
            castShadow
          >
            <boxGeometry args={[1.5, 6, 1.5]} />
            <meshStandardMaterial
              color="#888888"
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>
        ))}
    </group>
  );
}

function GuardRail({
  x,
  z,
  angle,
  length,
}: { x: number; z: number; angle: number; length: number }) {
  return (
    <mesh position={[x, 0.5, z]} rotation={[0, angle, 0]}>
      <boxGeometry args={[0.15, 0.6, length * 0.95]} />
      <meshStandardMaterial color="#cccccc" metalness={0.85} roughness={0.2} />
    </mesh>
  );
}

function HighwaySign({ x, z, angle }: { x: number; z: number; angle: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, angle, 0]}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 6, 6]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 6.2, 0]}>
        <boxGeometry args={[3, 1.2, 0.12]} />
        <meshStandardMaterial color="#006600" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, 6.2, 0.07]}>
        <boxGeometry args={[2.6, 0.8, 0.05]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ── Docks Decorations ─────────────────────────────────────
const CONTAINER_POSITIONS: [number, number, number][] = [
  [-40, 0, -20],
  [-40, 0, 0],
  [-40, 0, 20],
  [60, 0, -30],
  [60, 0, 10],
];

const BARREL_POSITIONS: [number, number, number][] = [
  [-35, 0, -5],
  [-35, 0, 5],
  [55, 0, 25],
  [55, 0, 30],
];

const DOCK_LIGHT_POSITIONS: [number, number, number][] = [
  [-30, 4, -10],
  [40, 4, 20],
];

const containerColors = ["#cc3300", "#006699", "#336600", "#663300", "#990099"];

function DocksDecorations({ segments }: { segments: Segment[] }) {
  return (
    <group>
      {/* Dock water */}
      <mesh position={[-60, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 200]} />
        <meshStandardMaterial
          color="#050a10"
          roughness={0.05}
          metalness={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Stacked shipping containers */}
      {CONTAINER_POSITIONS.map(([x, , z], i) => (
        <group key={`container-${x}-${z}`} position={[x, 0, z]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[6, 3, 2.5]} />
            <meshStandardMaterial
              color={containerColors[i % containerColors.length]}
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>
          <mesh position={[0, 4.5, 0]} castShadow>
            <boxGeometry args={[6, 3, 2.5]} />
            <meshStandardMaterial
              color={containerColors[(i + 2) % containerColors.length]}
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Industrial crane arm */}
      <group position={[50, 0, -10]}>
        <mesh position={[0, 8, 0]} castShadow>
          <boxGeometry args={[1, 16, 1]} />
          <meshStandardMaterial
            color="#ffcc00"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[-6, 15, 0]} castShadow>
          <boxGeometry args={[12, 1, 1]} />
          <meshStandardMaterial
            color="#ffcc00"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        <pointLight
          position={[0, 16, 0]}
          color="#ffcc00"
          intensity={8}
          distance={30}
          decay={2}
        />
      </group>

      {/* Industrial barrels */}
      {BARREL_POSITIONS.map(([x, , z], i) => (
        <mesh key={`barrel-${x}-${z}`} position={[x, 0.9, z]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 1.8, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#882200" : "#224400"}
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
      ))}

      {/* Warehouse walls */}
      {segments
        .filter((_, i) => i % 4 === 0)
        .map((seg) => (
          <mesh
            key={`wall-${seg.key}`}
            position={[
              seg.mx + Math.cos(seg.angle) * 9,
              3,
              seg.mz - Math.sin(seg.angle) * 9,
            ]}
            rotation={[0, seg.angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.5, 6, seg.length * 0.8]} />
            <meshStandardMaterial
              color="#1a1a1a"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        ))}

      {/* Green dock lights */}
      {DOCK_LIGHT_POSITIONS.map(([x, y, z]) => (
        <pointLight
          key={`docklight-${x}-${z}`}
          position={[x, y, z]}
          color="#44ff88"
          intensity={5}
          distance={25}
          decay={2}
        />
      ))}
    </group>
  );
}

// ── Mountain Decorations ──────────────────────────────────
const PINE_POSITIONS: [number, number, number][] = [
  [-25, 0, 40],
  [-30, 0, 15],
  [-22, 0, -10],
  [-28, 0, -25],
  [90, 0, 40],
  [92, 0, 15],
  [88, 0, -15],
  [85, 0, -30],
  [55, 0, 55],
  [22, 0, 55],
  [-8, 0, 38],
];

function MountainDecorations({ segments }: { segments: Segment[] }) {
  return (
    <group>
      {/* Mountain backdrop */}
      <mesh position={[35, 20, -80]} castShadow>
        <boxGeometry args={[200, 40, 10]} />
        <meshStandardMaterial
          color="#1e1812"
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>
      <mesh position={[35, 30, -85]}>
        <boxGeometry args={[120, 30, 8]} />
        <meshStandardMaterial
          color="#2a2218"
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {/* Pine trees */}
      {PINE_POSITIONS.map(([x, , z]) => (
        <PineTree key={`pine-${x}-${z}`} position={[x, 0, z]} />
      ))}

      {/* Cliff face walls */}
      {segments
        .filter((_, i) => i % 3 === 0)
        .map((seg) => (
          <mesh
            key={`cliff-${seg.key}`}
            position={[
              seg.mx + Math.cos(seg.angle) * 8,
              4,
              seg.mz - Math.sin(seg.angle) * 8,
            ]}
            rotation={[0, seg.angle, 0]}
            castShadow
          >
            <boxGeometry args={[2, 8, seg.length * 0.9]} />
            <meshStandardMaterial
              color="#3a3028"
              roughness={0.98}
              metalness={0.0}
            />
          </mesh>
        ))}

      {/* Safety guardrails */}
      {segments
        .filter((_, i) => i % 2 === 0)
        .map((seg) => (
          <mesh
            key={`grail-${seg.key}`}
            position={[
              seg.mx - Math.cos(seg.angle) * 5,
              0.6,
              seg.mz + Math.sin(seg.angle) * 5,
            ]}
            rotation={[0, seg.angle, 0]}
          >
            <boxGeometry args={[0.12, 0.8, seg.length * 0.9]} />
            <meshStandardMaterial
              color="#aaaaaa"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        ))}
    </group>
  );
}

function PineTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 3, 7]} />
        <meshStandardMaterial color="#3d2b1a" roughness={0.95} />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow>
        <coneGeometry args={[1.6, 3.5, 7]} />
        <meshStandardMaterial color="#1a3020" roughness={0.8} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <coneGeometry args={[1.1, 2.8, 7]} />
        <meshStandardMaterial color="#1e3822" roughness={0.8} />
      </mesh>
      <mesh position={[0, 7.5, 0]} castShadow>
        <coneGeometry args={[0.7, 2.2, 7]} />
        <meshStandardMaterial color="#223e26" roughness={0.8} />
      </mesh>
    </group>
  );
}
