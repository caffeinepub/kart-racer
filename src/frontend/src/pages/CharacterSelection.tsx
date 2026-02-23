import { useState } from 'react';
import { characters } from '../data/characters';
import CharacterCard from '../components/CharacterCard';
import GameLogo from '../components/GameLogo';
import { Button } from '@/components/ui/button';

interface CharacterSelectionProps {
  onSelectCharacter: (characterId: string) => void;
}

export default function CharacterSelection({ onSelectCharacter }: CharacterSelectionProps) {
  const [selectedId, setSelectedId] = useState<string>('');

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleStart = () => {
    if (selectedId) {
      onSelectCharacter(selectedId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <GameLogo />
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 text-center drop-shadow-lg">
        Choose Your Racer!
      </h1>
      <p className="text-xl text-white/90 mb-8 text-center">
        Select your favorite character to start racing
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mb-8">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={selectedId === character.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <Button
        onClick={handleStart}
        disabled={!selectedId}
        size="lg"
        className="bg-boost-yellow hover:bg-boost-yellow/90 text-racing-blue font-bold text-2xl px-12 py-6 rounded-full shadow-2xl transform transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        START RACE!
      </Button>
    </div>
  );
}
