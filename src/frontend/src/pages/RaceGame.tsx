import { Button } from "@/components/ui/button";
import { Canvas, useFrame } from "@react-three/fiber";
import { X } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import NPCKart from "../components/NPCKart";
import PlayerKart from "../components/PlayerKart";
import PowerUpItem from "../components/PowerUpItem";
import RaceCamera from "../components/RaceCamera";
import RaceCountdown from "../components/RaceCountdown";
import RaceHUD from "../components/RaceHUD";
import RaceTrack from "../components/RaceTrack";
import { characters } from "../data/characters";
import { powerups } from "../data/powerups";
import { useAIOpponents } from "../hooks/useAIOpponents";
import { useActivePowerUp } from "../hooks/useActivePowerUp";
import { useRacePosition } from "../hooks/useRacePosition";
import { useRaceState } from "../hooks/useRaceState";

const POWER_UP_POSITIONS: [number, number, number][] = [
  [10, 0.5, -5],
  [-10, 0.5, -15],
  [0, 0.5, -25],
  [11, 0.5, -18],
  [-8, 0.5, -3],
];

const PU_KEYS = ["pu0", "pu1", "pu2", "pu3", "pu4"];

interface RaceGameProps {
  characterId: string;
  onRaceComplete: (completionTime: number) => void;
  onBackToSelect: () => void;
}

function NPCUpdater({ updateNPCs }: { updateNPCs: (delta: number) => void }) {
  useFrame((_, delta) => {
    updateNPCs(delta);
  });
  return null;
}

export default function RaceGame({
  characterId,
  onRaceComplete,
  onBackToSelect,
}: RaceGameProps) {
  const character = characters.find((c) => c.id === characterId);
  const {
    raceStatus,
    currentLap,
    totalLaps,
    elapsedTime,
    startCountdown,
    finishRace,
  } = useRaceState();

  const [kartPosition, setKartPosition] = useState<[number, number, number]>([
    0, 0.5, 0,
  ]);
  const [kartRotation, setKartRotation] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const { npcs, updateNPCs } = useAIOpponents();
  const { position: racePosition, positionLabel } = useRacePosition(
    kartPosition,
    currentLap - 1,
    npcs,
  );

  const { heldItem, activeEffect, speedMultiplier, shieldActive, receiveItem } =
    useActivePowerUp();

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

  return (
    <div className="w-full h-screen relative">
      <Button
        onClick={onBackToSelect}
        variant="destructive"
        size="icon"
        data-ocid="race.back.button"
        className="absolute top-4 right-4 z-50 rounded-full"
      >
        <X className="h-6 w-6" />
      </Button>

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

      <Canvas
        shadows
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[20, 30, 15]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={100}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          <hemisphereLight args={["#87CEEB", "#5a8f5a", 0.6]} />
          <pointLight position={[0, 10, -10]} intensity={0.5} color="#ffffff" />

          <RaceTrack />

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
            />
          ))}

          <NPCUpdater updateNPCs={updateNPCs} />

          {POWER_UP_POSITIONS.map((pos, i) => (
            <PowerUpItem
              key={PU_KEYS[i]}
              position={pos}
              kartPosition={kartPosition}
              onCollect={handleCollect}
            />
          ))}

          <RaceCamera kartPosition={kartPosition} kartRotation={kartRotation} />
        </Suspense>
      </Canvas>
    </div>
  );
}
