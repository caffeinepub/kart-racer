import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RaceEntry {
    username: string;
    character: string;
    raceCompletionTime: Time;
    raceTrack: string;
    runtime: Time;
}
export type Time = bigint;
export interface backendInterface {
    getRaceDetails(username: string): Promise<RaceEntry>;
    getTrackLeaderboard(track: string): Promise<Array<[string, Time]>>;
    getTracks(): Promise<Array<string>>;
    saveRaceDetails(username: string, character: string, track: string, raceCompletionTime: Time, runtime: Time): Promise<void>;
}
