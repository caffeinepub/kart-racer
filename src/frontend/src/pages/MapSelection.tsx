import { useState } from "react";
import { maps } from "../data/maps";

interface MapSelectionProps {
  characterId: string;
  onSelectMap: (mapId: string) => void;
  onBack: () => void;
}

const THEME_STYLES: Record<
  string,
  { bg: string; border: string; glow: string }
> = {
  meadows: {
    bg: "from-green-900 to-green-700",
    border: "border-green-400",
    glow: "shadow-green-500/50",
  },
  rainbow: {
    bg: "from-purple-900 to-indigo-800",
    border: "border-purple-400",
    glow: "shadow-purple-500/50",
  },
  castle: {
    bg: "from-stone-900 to-red-950",
    border: "border-orange-500",
    glow: "shadow-orange-600/50",
  },
  beach: {
    bg: "from-sky-900 to-cyan-800",
    border: "border-cyan-400",
    glow: "shadow-cyan-500/50",
  },
};

export default function MapSelection({
  onSelectMap,
  onBack,
}: MapSelectionProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8"
      style={{
        background:
          "linear-gradient(135deg, #0a0010 0%, #1a002a 50%, #050015 100%)",
      }}
    >
      {/* Title */}
      <div className="text-center mb-8">
        <h1
          className="text-5xl md:text-7xl font-black tracking-wider mb-2 uppercase"
          style={{
            fontFamily: "'Arial Black', sans-serif",
            background:
              "linear-gradient(90deg, #ff0080, #ff8800, #ffff00, #00ff80, #0080ff, #8000ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(255,100,255,0.5))",
          }}
        >
          Choose Your Track!
        </h1>
        <p className="text-gray-300 text-lg">
          Pick a circuit and start your engine 🏁
        </p>
      </div>

      {/* Map Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mb-10">
        {maps.map((map) => {
          const styles = THEME_STYLES[map.theme];
          const isSelected = selected === map.id;
          return (
            <button
              type="button"
              key={map.id}
              data-ocid={`mapselect.${map.id}.button`}
              onClick={() => setSelected(map.id)}
              className={[
                "relative rounded-2xl p-6 text-left cursor-pointer transition-all duration-200",
                `bg-gradient-to-br ${styles.bg}`,
                `border-2 ${isSelected ? styles.border : "border-transparent"}`,
                isSelected
                  ? `shadow-2xl ${styles.glow}`
                  : "opacity-80 hover:opacity-100 hover:scale-[1.02]",
                isSelected ? "scale-[1.04]" : "",
              ].join(" ")}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white flex items-center justify-center">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
              )}
              <div className="text-5xl mb-3">{map.emoji}</div>
              <h2 className="text-white text-2xl font-black tracking-wide mb-1">
                {map.name}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {map.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-4 items-center">
        <button
          type="button"
          data-ocid="mapselect.back.button"
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-lg border border-white/20 hover:bg-white/20 transition-all"
        >
          ← Back
        </button>
        <button
          type="button"
          data-ocid="mapselect.start.button"
          onClick={() => selected && onSelectMap(selected)}
          disabled={!selected}
          className={[
            "px-10 py-4 rounded-xl font-black text-2xl uppercase tracking-widest transition-all duration-200",
            selected
              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-2xl hover:scale-105 cursor-pointer"
              : "bg-gray-700 text-gray-500 cursor-not-allowed",
          ].join(" ")}
        >
          START RACE! 🏁
        </button>
      </div>
    </div>
  );
}
