import { useState } from "react";
import { characters } from "../data/characters";

interface CharacterSelectionProps {
  onSelectCharacter: (characterId: string) => void;
}

function StatBar({
  label,
  value,
  color,
}: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className="w-10 shrink-0"
        style={{ color: "#555", fontWeight: 600, letterSpacing: "0.05em" }}
      >
        {label}
      </span>
      <div className="flex-1 h-1" style={{ background: "#1a1a1a" }}>
        <div
          className="h-full transition-all"
          style={{ width: `${value * 10}%`, background: color }}
        />
      </div>
      <span className="w-4 text-right font-bold" style={{ color: "#444" }}>
        {value}
      </span>
    </div>
  );
}

export default function CharacterSelection({
  onSelectCharacter,
}: CharacterSelectionProps) {
  const [selectedId, setSelectedId] = useState<string>("");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: "#030303" }}
    >
      {/* Header */}
      <div className="text-center mb-10">
        <p
          className="text-xs tracking-[0.5em] uppercase mb-2"
          style={{ color: "#444" }}
        >
          Need for Speed
        </p>
        <h1
          className="text-4xl md:text-6xl font-black uppercase tracking-[0.08em] mb-3"
          style={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            background:
              "linear-gradient(90deg, #888 0%, #fff 30%, #bbb 50%, #fff 70%, #888 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          SELECT DRIVER
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

      {/* Character grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-7xl mb-10 w-full">
        {characters.map((character) => {
          const isSelected = selectedId === character.id;
          return (
            <button
              type="button"
              key={character.id}
              data-ocid="character.card"
              onClick={() => setSelectedId(character.id)}
              className="relative text-left cursor-pointer transition-all duration-150 group"
              style={{
                background: isSelected ? "#0d0d0d" : "#0a0a0a",
                border: `1px solid ${isSelected ? character.kartColor : "#1a1a1a"}`,
                boxShadow: isSelected
                  ? `0 0 20px ${character.kartColor}44, inset 0 0 15px ${character.kartColor}11`
                  : "none",
                padding: "1rem",
                transform: isSelected ? "scale(1.03)" : "scale(1)",
              }}
            >
              {/* Color badge */}
              <div
                className="w-full mb-3 flex items-center justify-center"
                style={{
                  height: "56px",
                  background: `${character.kartColor}22`,
                  borderBottom: `2px solid ${character.kartColor}`,
                }}
              >
                <span
                  className="font-black text-2xl"
                  style={{
                    color: character.kartColor,
                    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                  }}
                >
                  {character.name.charAt(0)}
                </span>
              </div>

              <h3
                className="font-black text-sm uppercase tracking-wider mb-0.5"
                style={{
                  color: isSelected ? character.kartColor : "#ffffff",
                  fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                }}
              >
                {character.name}
              </h3>
              <p className="text-xs mb-3" style={{ color: "#444" }}>
                {character.description}
              </p>

              <div className="space-y-1.5">
                <StatBar
                  label="SPD"
                  value={character.speed}
                  color={`linear-gradient(90deg, ${character.kartColor}88, ${character.kartColor})`}
                />
                <StatBar
                  label="ACC"
                  value={character.acceleration}
                  color="linear-gradient(90deg, #22c55e88, #22c55e)"
                />
                <StatBar
                  label="HDL"
                  value={character.handling}
                  color="linear-gradient(90deg, #3b82f688, #3b82f6)"
                />
              </div>

              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-xs font-black"
                  style={{ background: character.kartColor, color: "#000" }}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Start button */}
      <button
        type="button"
        data-ocid="character.select.submit_button"
        onClick={() => selectedId && onSelectCharacter(selectedId)}
        disabled={!selectedId}
        className="px-16 py-5 font-black text-base tracking-[0.4em] uppercase transition-all duration-200"
        style={{
          background: selectedId ? "#ff8800" : "#111",
          color: selectedId ? "#000" : "#333",
          border: selectedId ? "none" : "1px solid #222",
          boxShadow: selectedId ? "0 0 40px rgba(255,136,0,0.6)" : "none",
          cursor: selectedId ? "pointer" : "not-allowed",
          transform: selectedId ? "scale(1.02)" : "scale(1)",
        }}
      >
        START RACE
      </button>

      {/* Footer */}
      <p className="mt-8 text-xs" style={{ color: "#222" }}>
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#333" }}
          className="hover:text-gray-500 transition-colors"
        >
          Built with love using caffeine.ai
        </a>
      </p>
    </div>
  );
}
