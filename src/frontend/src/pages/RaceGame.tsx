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

  // Show rocket projectile when rocketActive fires
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

  // Power-up positions from map waypoints (every other waypoint, offset)
  const POWER_UP_POSITIONS: [number, number, number][] = map.waypoints
    .filter((_, i) => i % 2 === 0)
    .slice(0, 5)
    .map(([x, z]) => [x, 0.5, z]);

  const npcPositions = npcs.map((n) => n.position);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Button
        onClick={onBackToSelect}
        variant="destructive"
        size="icon"
        data-ocid="race.back.button"
        className="absolute top-4 right-4 z-50 rounded-full"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Map name badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <span className="px-4 py-1 rounded-full bg-black/60 text-white text-sm font-bold tracking-wide border border-white/20">
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
          {map.theme === "rainbow" ? (
            <>
              <ambientLight intensity={0.3} />
              <pointLight
                position={[40, 20, 0]}
                intensity={2}
                color="#aa00ff"
              />
              <pointLight
                position={[-20, 20, -30]}
                intensity={2}
                color="#0044ff"
              />
            </>
          ) : map.theme === "castle" ? (
            <>
              <ambientLight intensity={0.2} />
              <directionalLight
                position={[20, 30, 15]}
                intensity={0.6}
                castShadow
              />
              <hemisphereLight args={["#330000", "#111", 0.4]} />
            </>
          ) : map.theme === "beach" ? (
            <>
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[20, 30, 15]}
                intensity={1.4}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={200}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
              />
              <hemisphereLight args={["#87CEEB", "#c8a96e", 0.7]} />
            </>
          ) : (
            <>
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[20, 30, 15]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={150}
                shadow-camera-left={-80}
                shadow-camera-right={80}
                shadow-camera-top={80}
                shadow-camera-bottom={-80}
              />
              <hemisphereLight args={["#87CEEB", "#5a8f5a", 0.6]} />
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
