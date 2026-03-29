import type { Character } from "../data/characters";

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: (id: string) => void;
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
        style={{ color: "#555", fontWeight: 600 }}
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

export default function CharacterCard({
  character,
  isSelected,
  onSelect,
}: CharacterCardProps) {
  return (
    <button
      type="button"
      data-ocid="character.card"
      onClick={() => onSelect(character.id)}
      className="relative text-left cursor-pointer transition-all duration-150 w-full"
      style={{
        background: isSelected ? "#0d0d0d" : "#0a0a0a",
        border: `1px solid ${isSelected ? character.kartColor : "#1a1a1a"}`,
        boxShadow: isSelected ? `0 0 20px ${character.kartColor}44` : "none",
        padding: "1rem",
        transform: isSelected ? "scale(1.03)" : "scale(1)",
      }}
    >
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
}
