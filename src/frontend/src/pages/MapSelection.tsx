import { useState } from "react";
import { maps } from "../data/maps";

interface MapSelectionProps {
  characterId: string;
  onSelectMap: (mapId: string) => void;
  onBack: () => void;
}

const THEME_STYLES: Record<
  string,
  { borderColor: string; glowColor: string; accentColor: string }
> = {
  city: {
    borderColor: "#00ccff",
    glowColor: "rgba(0,200,255,0.4)",
    accentColor: "#00ccff",
  },
  highway: {
    borderColor: "#ff8800",
    glowColor: "rgba(255,136,0,0.4)",
    accentColor: "#ff8800",
  },
  docks: {
    borderColor: "#ccff00",
    glowColor: "rgba(180,255,0,0.35)",
    accentColor: "#ccff00",
  },
  mountain: {
    borderColor: "#cc44ff",
    glowColor: "rgba(180,60,255,0.4)",
    accentColor: "#cc44ff",
  },
};

const THEME_BG: Record<string, string> = {
  city: "linear-gradient(135deg, #050510 0%, #0a0a20 100%)",
  highway: "linear-gradient(135deg, #100a00 0%, #1a1000 100%)",
  docks: "linear-gradient(135deg, #020505 0%, #050a05 100%)",
  mountain: "linear-gradient(135deg, #080010 0%, #100820 100%)",
};

export default function MapSelection({
  onSelectMap,
  onBack,
}: MapSelectionProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8"
      style={{ background: "#050505" }}
    >
      {/* Title */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.4em] text-gray-500 uppercase mb-2">
          Need for Speed
        </p>
        <h1
          className="text-5xl md:text-7xl font-black tracking-[0.1em] uppercase mb-3"
          style={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            background:
              "linear-gradient(90deg, #888 0%, #fff 30%, #aaa 50%, #fff 70%, #888 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          SELECT TRACK
        </h1>
        <div
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #ff8800, transparent)",
            maxWidth: "300px",
            margin: "0 auto",
          }}
        />
      </div>

      {/* Map Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-4xl mb-10">
        {maps.map((map) => {
          const styles = THEME_STYLES[map.theme];
          const isSelected = selected === map.id;
          return (
            <button
              type="button"
              key={map.id}
              data-ocid={`mapselect.${map.id}.button`}
              onClick={() => setSelected(map.id)}
              className="relative text-left cursor-pointer transition-all duration-200 group"
              style={{
                background: isSelected ? THEME_BG[map.theme] : "#0d0d0d",
                border: `1px solid ${isSelected ? styles.borderColor : "#222"}`,
                boxShadow: isSelected
                  ? `0 0 30px ${styles.glowColor}, inset 0 0 20px ${styles.glowColor}`
                  : "none",
                padding: "1.5rem",
                transform: isSelected ? "scale(1.02)" : "scale(1)",
              }}
            >
              {isSelected && (
                <div
                  className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center"
                  style={{
                    background: styles.borderColor,
                    color: "#000",
                    fontSize: "12px",
                    fontWeight: 900,
                  }}
                >
                  ✓
                </div>
              )}

              {/* Accent line */}
              <div
                style={{
                  width: "30px",
                  height: "3px",
                  background: styles.borderColor,
                  marginBottom: "0.75rem",
                  opacity: isSelected ? 1 : 0.4,
                  boxShadow: isSelected
                    ? `0 0 8px ${styles.glowColor}`
                    : "none",
                }}
              />

              <h2
                className="text-xl font-black tracking-widest uppercase mb-1"
                style={{
                  color: isSelected ? styles.accentColor : "#ffffff",
                  fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                }}
              >
                {map.name}
              </h2>
              <p className="text-xs tracking-wide" style={{ color: "#666" }}>
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
          className="px-6 py-3 font-bold text-sm tracking-widest uppercase transition-all"
          style={{
            background: "transparent",
            border: "1px solid #333",
            color: "#888",
          }}
        >
          ← BACK
        </button>
        <button
          type="button"
          data-ocid="mapselect.start.button"
          onClick={() => selected && onSelectMap(selected)}
          disabled={!selected}
          className="px-10 py-4 font-black text-sm tracking-[0.3em] uppercase transition-all duration-200"
          style={{
            background: selected ? "#ff8800" : "#1a1a1a",
            color: selected ? "#000" : "#444",
            border: selected ? "none" : "1px solid #333",
            boxShadow: selected ? "0 0 30px rgba(255,136,0,0.5)" : "none",
            cursor: selected ? "pointer" : "not-allowed",
            transform: selected ? "scale(1.02)" : "scale(1)",
          }}
        >
          RACE NOW
        </button>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-700">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-gray-500 transition-colors"
        >
          Built with love using caffeine.ai
        </a>
      </p>
    </div>
  );
}
