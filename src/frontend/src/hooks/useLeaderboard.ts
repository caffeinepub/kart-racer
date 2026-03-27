import { useGetTrackLeaderboard } from "./useQueries";

export function useLeaderboard(track: string) {
  const { data, isLoading, error } = useGetTrackLeaderboard(track);

  return {
    leaderboard: data || [],
    isLoading,
    error,
  };
}
