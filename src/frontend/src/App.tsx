import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Layout from "./components/Layout";
import CharacterSelection from "./pages/CharacterSelection";
import Leaderboard from "./pages/Leaderboard";
import RaceGame from "./pages/RaceGame";
import RaceResults from "./pages/RaceResults";

type GameScreen = "character-select" | "race" | "results" | "leaderboard";

function App() {
  const [currentScreen, setCurrentScreen] =
    useState<GameScreen>("character-select");
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [raceTime, setRaceTime] = useState<number>(0);

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
    setCurrentScreen("race");
  };

  const handleRaceComplete = (completionTime: number) => {
    setRaceTime(completionTime);
    setCurrentScreen("results");
  };

  const handleBackToSelect = () => {
    setCurrentScreen("character-select");
    setSelectedCharacter("");
  };

  const handleViewLeaderboard = () => {
    setCurrentScreen("leaderboard");
  };

  return (
    <Layout>
      {currentScreen === "character-select" && (
        <CharacterSelection onSelectCharacter={handleCharacterSelect} />
      )}
      {currentScreen === "race" && (
        <RaceGame
          characterId={selectedCharacter}
          onRaceComplete={handleRaceComplete}
          onBackToSelect={handleBackToSelect}
        />
      )}
      {currentScreen === "results" && (
        <RaceResults
          characterId={selectedCharacter}
          completionTime={raceTime}
          onBackToSelect={handleBackToSelect}
          onViewLeaderboard={handleViewLeaderboard}
        />
      )}
      {currentScreen === "leaderboard" && (
        <Leaderboard onBackToSelect={handleBackToSelect} />
      )}
    </Layout>
  );
}

export default App;
