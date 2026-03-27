import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Trophy } from "lucide-react";
import { useState } from "react";
import GameLogo from "../components/GameLogo";
import { characters } from "../data/characters";
import { useSaveRace } from "../hooks/useSaveRace";

interface RaceResultsProps {
  characterId: string;
  completionTime: number;
  onBackToSelect: () => void;
  onViewLeaderboard: () => void;
}

export default function RaceResults({
  characterId,
  completionTime,
  onBackToSelect,
  onViewLeaderboard,
}: RaceResultsProps) {
  const character = characters.find((c) => c.id === characterId);
  const [username, setUsername] = useState("");
  const { saveRace, isSaving, isSaved } = useSaveRace();

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    if (username.trim() && character) {
      saveRace(
        username.trim(),
        character.name,
        "Rainbow Circuit",
        completionTime,
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <GameLogo />

      <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-center mb-6">
          <Trophy className="w-16 h-16 text-boost-yellow mr-4" />
          <h1 className="text-5xl font-bold text-racing-blue">
            Race Complete!
          </h1>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg"
              style={{ backgroundColor: character?.kartColor }}
            >
              {character?.name.charAt(0)}
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">{character?.name}</h2>
          <div className="flex items-center justify-center text-2xl text-muted-foreground">
            <Clock className="w-6 h-6 mr-2" />
            <span className="font-mono font-bold">
              {formatTime(completionTime)}
            </span>
          </div>
        </div>

        {!isSaved ? (
          <div className="space-y-4 mb-6">
            <div>
              <Label
                htmlFor="leaderboard-name"
                className="block text-sm font-semibold mb-2"
              >
                Save your time to the leaderboard:
              </Label>
              <Input
                id="leaderboard-name"
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-lg"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={!username.trim() || isSaving}
              className="w-full bg-racing-blue hover:bg-racing-blue/90 text-white font-bold text-xl py-6 rounded-full"
            >
              {isSaving ? "Saving..." : "Save to Leaderboard"}
            </Button>
          </div>
        ) : (
          <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-6 text-center font-semibold">
            ✓ Your time has been saved to the leaderboard!
          </div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={onViewLeaderboard}
            variant="outline"
            className="flex-1 font-bold text-lg py-6 rounded-full"
          >
            View Leaderboard
          </Button>
          <Button
            onClick={onBackToSelect}
            className="flex-1 bg-boost-yellow hover:bg-boost-yellow/90 text-racing-blue font-bold text-lg py-6 rounded-full"
          >
            Race Again
          </Button>
        </div>
      </div>

      <footer className="mt-8 text-white/80 text-sm text-center">
        © {new Date().getFullYear()} Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
