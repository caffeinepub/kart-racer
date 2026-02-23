import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";

actor {
  type RaceEntry = {
    username : Text;
    character : Text;
    raceTrack : Text;
    raceCompletionTime : Time.Time;
    runtime : Time.Time;
  };

  module RaceEntry {
    public func compare(entry1 : RaceEntry, entry2 : RaceEntry) : Order.Order {
      Int.compare(entry1.raceCompletionTime, entry2.raceCompletionTime);
    };
  };

  let races = Map.empty<Text, RaceEntry>();
  let leaders = Map.empty<Text, Map.Map<Text, Time.Time>>();
  let raceTracks = Map.empty<Text, Text>();

  public shared ({ caller }) func saveRaceDetails(username : Text, character : Text, track : Text, raceCompletionTime : Time.Time, runtime : Time.Time) : async () {
    let entry : RaceEntry = {
      username;
      character;
      raceTrack = track;
      raceCompletionTime;
      runtime;
    };
    races.add(username, entry);
    updateLeaders(track, username, raceCompletionTime);
    addTrack(track);
  };

  public query ({ caller }) func getRaceDetails(username : Text) : async RaceEntry {
    switch (races.get(username)) {
      case (null) { Runtime.trap("Could not find a race record for user " # username) };
      case (?race) { race };
    };
  };

  public query ({ caller }) func getTrackLeaderboard(track : Text) : async [(Text, Time.Time)] {
    switch (leaders.get(track)) {
      case (null) { [] };
      case (?trackLeaders) {
        let entries = trackLeaders.toArray();
        entries.sort(
          func(left, right) { Int.compare(left.1, right.1) }
        );
      };
    };
  };

  public query ({ caller }) func getTracks() : async [Text] {
    raceTracks.values().toArray();
  };

  func updateLeaders(track : Text, username : Text, raceCompletionTime : Time.Time) : () {
    let existing = leaders.get(track);
    let trackLeaders = switch (existing) {
      case (null) { Map.empty<Text, Time.Time>() };
      case (?trackLeaders) { trackLeaders };
    };

    trackLeaders.add(username, raceCompletionTime);
    leaders.add(track, trackLeaders);
  };

  func addTrack(trackName : Text) : () {
    raceTracks.add(trackName, trackName);
  };
};
