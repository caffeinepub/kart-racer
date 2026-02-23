import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import RaceTrack from '../components/RaceTrack';
import PlayerKart from '../components/PlayerKart';
import RaceCamera from '../components/RaceCamera';
import PowerUpItem from '../components/PowerUpItem';
import RaceHUD from '../components/RaceHUD';
import RaceCountdown from '../components/RaceCountdown';
import { useRaceState } from '../hooks/useRaceState';
import { characters } from '../data/characters';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface RaceGameProps {
  characterId: string;
  onRaceComplete: (completionTime: number) => void;
  onBackToSelect: () => void;
}

export default function RaceGame({ characterId, onRaceComplete, onBackToSelect }: RaceGameProps) {
  const character = characters.find((c) => c.id === characterId);
  const {
    raceStatus,
    currentLap,
    totalLaps,
    elapsedTime,
    startCountdown,
    finishRace,
  } = useRaceState();

  const [kartPosition, setKartPosition] = useState<[number, number, number]>([0, 0.5, 0]);
  const [kartRotation, setKartRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [collectedPowerUp, setCollectedPowerUp] = useState<string | null>(null);

  useEffect(() => {
    // Start countdown after component mounts
    const timer = setTimeout(() => {
      startCountdown();
    }, 500);
    return () => clearTimeout(timer);
  }, [startCountdown]);

  useEffect(() => {
    if (currentLap > totalLaps && raceStatus === 'racing') {
      finishRace();
      onRaceComplete(elapsedTime);
    }
  }, [currentLap, totalLaps, raceStatus, elapsedTime, finishRace, onRaceComplete]);

  if (!character) return null;

  return (
    <div className="w-full h-screen relative">
      <Button
        onClick={onBackToSelect}
        variant="destructive"
        size="icon"
        className="absolute top-4 right-4 z-50 rounded-full"
      >
        <X className="h-6 w-6" />
      </Button>

      {raceStatus === 'countdown' && <RaceCountdown />}

      <RaceHUD
        currentLap={currentLap}
        totalLaps={totalLaps}
        elapsedTime={elapsedTime}
        currentSpeed={currentSpeed}
        collectedPowerUp={collectedPowerUp}
      />

      <Canvas shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
          <hemisphereLight args={['#87CEEB', '#90EE90', 0.5]} />

          <RaceTrack />
          <PlayerKart
            character={character}
            position={kartPosition}
            rotation={kartRotation}
            onPositionChange={setKartPosition}
            onRotationChange={setKartRotation}
            onSpeedChange={setCurrentSpeed}
            raceStatus={raceStatus}
          />
          <PowerUpItem
            position={[10, 0.5, -5]}
            onCollect={(powerUpId) => setCollectedPowerUp(powerUpId)}
          />
          <PowerUpItem
            position={[-10, 0.5, -15]}
            onCollect={(powerUpId) => setCollectedPowerUp(powerUpId)}
          />
          <PowerUpItem
            position={[0, 0.5, -25]}
            onCollect={(powerUpId) => setCollectedPowerUp(powerUpId)}
          />

          <RaceCamera kartPosition={kartPosition} kartRotation={kartRotation} />
        </Suspense>
      </Canvas>
    </div>
  );
}
