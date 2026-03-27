import { useState } from "react";
import { useActor } from "./useActor";

export function useSaveRace() {
  const { actor } = useActor();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveRace = async (
    username: string,
    character: string,
    track: string,
    completionTime: number,
  ) => {
    if (!actor) {
      setError("Actor not initialized");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const runtime = BigInt(Date.now());
      const raceTime = BigInt(completionTime);
      await actor.saveRaceDetails(
        username,
        character,
        track,
        raceTime,
        runtime,
      );
      setIsSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save race");
    } finally {
      setIsSaving(false);
    }
  };

  return { saveRace, isSaving, isSaved, error };
}
