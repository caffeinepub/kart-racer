interface RaceHUDProps {
  currentLap: number;
  totalLaps: number;
  elapsedTime: number;
  currentSpeed: number;
  collectedPowerUp: string | null;
}

export default function RaceHUD({
  currentLap,
  totalLaps,
  elapsedTime,
  currentSpeed,
  collectedPowerUp,
}: RaceHUDProps) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 pointer-events-none">
      <div className="flex justify-between items-start">
        {/* Left side - Lap counter */}
        <div className="bg-racing-blue/90 backdrop-blur text-white px-6 py-3 rounded-2xl shadow-2xl">
          <div className="text-sm font-semibold">LAP</div>
          <div className="text-3xl font-bold">
            {Math.min(currentLap, totalLaps)}/{totalLaps}
          </div>
        </div>

        {/* Right side - Time */}
        <div className="bg-racing-purple/90 backdrop-blur text-white px-6 py-3 rounded-2xl shadow-2xl">
          <div className="text-sm font-semibold">TIME</div>
          <div className="text-3xl font-bold font-mono">{formatTime(elapsedTime)}</div>
        </div>
      </div>

      {/* Bottom left - Speed */}
      <div className="absolute bottom-4 left-4 bg-boost-yellow/90 backdrop-blur text-racing-blue px-6 py-3 rounded-2xl shadow-2xl">
        <div className="text-sm font-semibold">SPEED</div>
        <div className="text-3xl font-bold">{Math.round(currentSpeed * 100)}</div>
      </div>

      {/* Bottom right - Power-up */}
      {collectedPowerUp && (
        <div className="absolute bottom-4 right-4 bg-racing-pink/90 backdrop-blur text-white px-6 py-3 rounded-2xl shadow-2xl">
          <div className="text-sm font-semibold">POWER-UP</div>
          <div className="text-xl font-bold">{collectedPowerUp}</div>
        </div>
      )}
    </div>
  );
}
