import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RaceEntry } from '../backend';

export function useGetRaceDetails(username: string) {
  const { actor, isFetching } = useActor();

  return useQuery<RaceEntry>({
    queryKey: ['raceDetails', username],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getRaceDetails(username);
    },
    enabled: !!actor && !isFetching && !!username,
  });
}

export function useGetTrackLeaderboard(track: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ['leaderboard', track],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrackLeaderboard(track);
    },
    enabled: !!actor && !isFetching && !!track,
  });
}

export function useGetTracks() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['tracks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTracks();
    },
    enabled: !!actor && !isFetching,
  });
}
