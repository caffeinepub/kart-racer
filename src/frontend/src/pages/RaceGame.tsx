import { Button } from "@/components/ui/button";
import { Canvas, useFrame } from "@react-three/fiber";
import { X } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import MobileControls from "../components/MobileControls";
import NPCKart from "../components/NPCKart";
import PlayerKart from "../components/PlayerKart";
import PowerUpItem from "../components/PowerUpItem";
import RaceCamera from "../components/RaceCamera";
import RaceCountdown from "../components/RaceCountdown";
import RaceHUD from "../components/RaceHUD";
import RaceTrack from "../components/RaceTrack";
import RocketProjectile from "../components/RocketProjectile";
import { characters } from "../data/characters";
import { getMap } from "../data/maps";
import { powerups } from "../data/powerups";
import { useAIOpponents } from "../hooks/useAIOpponents";
import { useActivePowerUp } from "../hooks/useActivePowerUp";
import { useRacePosition } from "../hooks/useRacePosition";
import { useRaceState } from "../hooks/useRaceState";

const PU_KEYS = ["pu0", "pu1", "pu2", "pu3", "pu4"];

interface RaceGameProps {
  characterId: string;
  mapId: string;
  onRaceComplete: (completionTime: number) => void;
  onBackToSelect: () => void;
}

function NPCUpdater({
  updateNPCs,
  raceStarted,
}: {
  updateNPCs: (delta: number, raceStarted: boolean) => void;
  raceStarted: boolean;
}) {
  useFrame((_, delta) => {
    updateNPCs(delta, raceStarted);
  });
  return null;
}

export default function RaceGame({
  characterId,
  mapId,
  onRaceComplete,
  onBackToSelect,
}: RaceGameProps) {
  const character = characters.find((c) => c.id === characterId);
  const map = getMap(mapId);

  const {
    raceStatus,
    currentLap,
    totalLaps,
    elapsedTime,
    startCountdown,
    finishRace,
  } = useRaceState();

  const [kartPosition, setKartPosition] = useState<[number, number, number]>(
    map.gridPositions[0],
  );
  const [kartRotation, setKartRotation] = useState<[number, number, number]>([
    0,
    Math.PI,
    0,
  ]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [rocketVisible, setRocketVisible] = useState(false);

  const { npcs, updateNPCs, stunNPC } = useAIOpponents(
    map.waypoints,
    map.gridPositions,
  );

  const { position: racePosition, positionLabel } = useRacePosition(
    kartPosition,
    currentLap - 1,
    npcs,
  );

  const {
    heldItem,
    activeEffect,
    speedMultiplier,
    shieldActive,
    rocketActive,
    receiveItem,
  } = useActivePowerUp();

  useEffect(() => {
    if (rocketActive) {
      setRocketVisible(true);
    }
  }, [rocketActive]);

  useEffect(() => {
    const timer = setTimeout(() => startCountdown(), 500);
    return () => clearTimeout(timer);
  }, [startCountdown]);

  useEffect(() => {
    if (currentLap > totalLaps && raceStatus === "racing") {
      finishRace();
      onRaceComplete(elapsedTime);
    }
  }, [
    currentLap,
    totalLaps,
    raceStatus,
    elapsedTime,
    finishRace,
    onRaceComplete,
  ]);

  if (!character) return null;

  const handleCollect = (powerUpId: string) => {
    const pu = powerups.find((p) => p.id === powerUpId);
    if (pu) receiveItem(pu);
  };

  const raceStarted = raceStatus === "racing";

  const POWER_UP_POSITIONS: [number, number, number][] = map.waypoints
    .filter((_, i) => i % 2 === 0)
    .slice(0, 5)
    .map(([x, z]) => [x, 0.5, z]);

  const npcPositions = npcs.map((n) => n.position);

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      <Button
        onClick={onBackToSelect}
        variant="destructive"
        size="icon"
        data-ocid="race.back.button"
        className="absolute top-4 right-4 z-50 rounded-none border border-red-800"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Map name badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <span
          className="px-4 py-1 text-xs font-bold tracking-widest uppercase"
          style={{
            background: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,140,0,0.5)",
            color: "#ff8800",
            letterSpacing: "0.2em",
          }}
        >
          {map.emoji} {map.name}
        </span>
      </div>

      {raceStatus === "countdown" && <RaceCountdown />}

      <RaceHUD
        currentLap={currentLap}
        totalLaps={totalLaps}
        elapsedTime={elapsedTime}
        currentSpeed={currentSpeed}
        collectedPowerUp={heldItem?.id ?? null}
        position={racePosition}
        positionLabel={positionLabel}
        heldItem={heldItem?.id ?? null}
        activeEffect={activeEffect}
      />

      {raceStarted && <MobileControls />}

      <Canvas
        shadows
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={null}>
          {map.theme === "city" ? (
            <>
              <ambientLight intensity={0.15} />
              <pointLight
                position={[10, 8, 0]}
                intensity={4}
                color="#aa00ff"
                distance={40}
                decay={2}
              />
              <pointLight
                position={[-10, 8, 20]}
                intensity={4}
                color="#00ccff"
                distance={40}
                decay={2}
              />
              <pointLight
                position={[30, 6, -20]}
                intensity={3}
                color="#ff6600"
                distance={30}
                decay={2}
              />
              <pointLight
                position={[-20, 6, -10]}
                intensity={3}
                color="#ff0066"
                distance={30}
                decay={2}
              />
            </>
          ) : map.theme === "highway" ? (
            <>
              <ambientLight intensity={0.1} />
              <directionalLight
                position={[-30, 20, 10]}
                intensity={0.5}
                color="#aabbff"
                castShadow
              />
              <pointLight
                position={[50, 3, 0]}
                intensity={3}
                color="#ff6600"
                distance={60}
                decay={2}
              />
              <hemisphereLight args={["#111133", "#1a1206", 0.3]} />
            </>
          ) : map.theme === "docks" ? (
            <>
              <ambientLight intensity={0.1} />
              <pointLight
                position={[20, 8, -10]}
                intensity={5}
                color="#ffcc44"
                distance={40}
                decay={2}
              />
              <pointLight
                position={[-20, 6, 10]}
                intensity={4}
                color="#44ff88"
                distance={35}
                decay={2}
              />
              <pointLight
                position={[0, 6, -30]}
                intensity={3}
                color="#ffaa00"
                distance={30}
                decay={2}
              />
            </>
          ) : (
            <>
              <ambientLight intensity={0.2} />
              <directionalLight
                position={[20, 30, 15]}
                intensity={0.8}
                color="#ffaa66"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={200}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
              />
              <hemisphereLight args={["#331a00", "#2a2520", 0.4]} />
            </>
          )}

          <RaceTrack theme={map.theme} waypoints={map.waypoints} />

          <PlayerKart
            character={character}
            position={kartPosition}
            rotation={kartRotation}
            onPositionChange={setKartPosition}
            onRotationChange={setKartRotation}
            onSpeedChange={setCurrentSpeed}
            raceStatus={raceStatus}
            speedMultiplier={speedMultiplier}
            shieldActive={shieldActive}
          />

          {npcs.map((npc) => (
            <NPCKart
              key={npc.id}
              color={npc.color}
              position={npc.position}
              rotation={npc.rotation}
              stunned={npc.stunned}
            />
          ))}

          <NPCUpdater updateNPCs={updateNPCs} raceStarted={raceStarted} />

          {POWER_UP_POSITIONS.map((pos, i) => (
            <PowerUpItem
              key={PU_KEYS[i]}
              position={pos}
              kartPosition={kartPosition}
              onCollect={handleCollect}
            />
          ))}

          {rocketVisible && (
            <RocketProjectile
              startPosition={[
                kartPosition[0],
                kartPosition[1] + 0.5,
                kartPosition[2],
              ]}
              direction={kartRotation[1]}
              npcPositions={npcPositions}
              onHit={(idx) => {
                const npc = npcs[idx];
                if (npc) stunNPC(npc.id);
              }}
              onDone={() => setRocketVisible(false)}
            />
          )}

          <RaceCamera kartPosition={kartPosition} kartRotation={kartRotation} />
        </Suspense>
      </Canvas>
    </div>
  );
}
