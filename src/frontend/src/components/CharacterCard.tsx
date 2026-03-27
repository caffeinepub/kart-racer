import { Card } from "@/components/ui/card";
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
      <span className="w-12 text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value * 10}%`, background: color }}
        />
      </div>
      <span className="w-4 text-right font-bold text-muted-foreground">
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
    <Card
      data-ocid="character.card"
      onClick={() => onSelect(character.id)}
      className={`cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl ${
        isSelected ? "ring-4 ring-boost-yellow scale-105 shadow-2xl" : ""
      } bg-white/95 backdrop-blur`}
    >
      <div className="p-4 flex flex-col items-center">
        <div
          className="w-20 h-20 rounded-full mb-3 flex items-center justify-center text-white font-bold text-2xl shadow-lg"
          style={{ backgroundColor: character.kartColor }}
        >
          {character.name.charAt(0)}
        </div>
        <h3 className="font-bold text-lg text-center mb-1">{character.name}</h3>
        <p className="text-sm text-muted-foreground text-center mb-3">
          {character.description}
        </p>
        <div className="w-full space-y-1.5">
          <StatBar
            label="Speed"
            value={character.speed}
            color="linear-gradient(90deg, #ff6b35, #ff3333)"
          />
          <StatBar
            label="Accel"
            value={character.acceleration}
            color="linear-gradient(90deg, #22c55e, #16a34a)"
          />
          <StatBar
            label="Handle"
            value={character.handling}
            color="linear-gradient(90deg, #3b82f6, #2563eb)"
          />
        </div>
      </div>
    </Card>
  );
}
