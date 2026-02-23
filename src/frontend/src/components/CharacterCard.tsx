import { Character } from '../data/characters';
import { Card } from '@/components/ui/card';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  return (
    <Card
      onClick={() => onSelect(character.id)}
      className={`cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl ${
        isSelected ? 'ring-4 ring-boost-yellow scale-105 shadow-2xl' : ''
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
        <p className="text-sm text-muted-foreground text-center mb-3">{character.description}</p>
        <div className="w-full space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Speed:</span>
            <span className="font-bold">{character.speed}/10</span>
          </div>
          <div className="flex justify-between">
            <span>Accel:</span>
            <span className="font-bold">{character.acceleration}/10</span>
          </div>
          <div className="flex justify-between">
            <span>Handle:</span>
            <span className="font-bold">{character.handling}/10</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
