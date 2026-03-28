import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Layout from "./components/Layout";
import CharacterSelection from "./pages/CharacterSelection";
import Leaderboard from "./pages/Leaderboard";
import MapSelection from "./pages/MapSelection";
import RaceGame from "./pages/RaceGame";
import RaceResults from "./pages/RaceResults";

const queryClient = new QueryClient();

type GameScreen =
  | "character-select"
  | "map-select"
  | "race"
  | "results"
  | "leaderboard";

function App() {
  const [currentScreen, setCurrentScreen] =
    useState<GameScreen>("character-select");
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [selectedMap, setSelectedMap] = useState<string>("meadows");
  const [raceTime, setRaceTime] = useState<number>(0);

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
    setCurrentScreen("map-select");
  };

  const handleMapSelect = (mapId: string) => {
    setSelectedMap(mapId);
    setCurrentScreen("race");
  };

  const handleBackToCharacterSelect = () => {
    setCurrentScreen("character-select");
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
    <QueryClientProvider client={queryClient}>
      <Layout>
        {currentScreen === "character-select" && (
          <CharacterSelection onSelectCharacter={handleCharacterSelect} />
        )}
        {currentScreen === "map-select" && (
          <MapSelection
            characterId={selectedCharacter}
            onSelectMap={handleMapSelect}
            onBack={handleBackToCharacterSelect}
          />
        )}
        {currentScreen === "race" && (
          <RaceGame
            characterId={selectedCharacter}
            mapId={selectedMap}
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
    </QueryClientProvider>
  );
}

export default App;
