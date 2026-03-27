import { useEffect, useState } from "react";

interface RaceHUDProps {
  currentLap: number;
  totalLaps: number;
  elapsedTime: number;
  currentSpeed: number;
  collectedPowerUp: string | null;
  position?: number;
  positionLabel?: string;
  heldItem?: string | null;
  activeEffect?: string | null;
}

const positionColors: Record<number, string> = {
  1: "from-yellow-400 to-amber-500 text-yellow-900",
  2: "from-slate-300 to-slate-400 text-slate-800",
  3: "from-amber-600 to-orange-700 text-orange-100",
  4: "from-red-600 to-red-800 text-white",
};

export default function RaceHUD({
  currentLap,
  totalLaps,
  elapsedTime,
  currentSpeed,
  position = 1,
  positionLabel = "1st",
  heldItem = null,
  activeEffect = null,
}: RaceHUDProps) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const posClass = positionColors[position] ?? positionColors[4];

  const [boostFlash, setBoostFlash] = useState(false);
  useEffect(() => {
    if (activeEffect !== "speed-boost") return;
    const interval = setInterval(() => setBoostFlash((f) => !f), 300);
    return () => clearInterval(interval);
  }, [activeEffect]);

  const itemLabel = heldItem
    ? heldItem
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : null;

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 pointer-events-none">
      {/* Top row */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Left — Lap counter */}
        <div
          data-ocid="hud.lap.panel"
          className="bg-racing-blue/90 backdrop-blur text-white px-6 py-3 rounded-2xl shadow-2xl"
        >
          <div className="text-sm font-semibold">LAP</div>
          <div className="text-3xl font-bold">
            {Math.min(currentLap, totalLaps)}/{totalLaps}
          </div>
        </div>

        {/* Center — Position badge */}
        <div
          data-ocid="hud.position.panel"
          className={`bg-gradient-to-br ${posClass} px-8 py-3 rounded-2xl shadow-2xl text-center`}
        >
          <div className="text-xs font-bold uppercase tracking-widest opacity-70">
            POSITION
          </div>
          <div className="text-4xl font-black">{positionLabel}</div>
        </div>

        {/* Right — Timer */}
        <div className="bg-racing-purple/90 backdrop-blur text-white px-6 py-3 rounded-2xl shadow-2xl">
          <div className="text-sm font-semibold">TIME</div>
          <div className="text-3xl font-bold font-mono">
            {formatTime(elapsedTime)}
          </div>
        </div>
      </div>

      {/* Bottom left — Speed */}
      <div className="absolute bottom-4 left-4 bg-boost-yellow/90 backdrop-blur text-racing-blue px-6 py-3 rounded-2xl shadow-2xl">
        <div className="text-sm font-semibold">SPEED</div>
        <div className="text-3xl font-bold">
          {Math.round(currentSpeed * 100)}
        </div>
      </div>

      {/* Bottom center — Item slot */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div
          data-ocid="hud.item.panel"
          className={`px-6 py-3 rounded-2xl shadow-2xl backdrop-blur text-center min-w-[140px] ${
            heldItem
              ? "bg-yellow-500/90 border-2 border-yellow-300 text-yellow-900"
              : "bg-slate-800/70 border border-slate-600 text-slate-400"
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-widest opacity-70">
            ITEM
          </div>
          <div className="text-xl font-black">{itemLabel ?? "NO ITEM"}</div>
        </div>
      </div>

      {/* Bottom right — Active effect */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
        {activeEffect === "speed-boost" && (
          <div
            data-ocid="hud.boost.panel"
            className={`px-5 py-2 rounded-2xl font-black text-xl shadow-2xl transition-opacity ${
              boostFlash
                ? "bg-yellow-400 text-yellow-900 opacity-100"
                : "bg-yellow-500 text-yellow-900 opacity-60"
            }`}
          >
            ⚡ BOOST!
          </div>
        )}
        {activeEffect === "shield" && (
          <div
            data-ocid="hud.shield.panel"
            className="px-5 py-2 rounded-2xl font-black text-xl shadow-2xl bg-blue-500/90 text-white"
          >
            🛡 SHIELD
          </div>
        )}
      </div>
    </div>
  );
}
