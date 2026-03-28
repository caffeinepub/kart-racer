# Kart Racer

## Current State
- Single winding track (12 waypoints) in RaceTrack.tsx / data/track.ts
- 3 power-ups: speed boost (working), shield (working), rocket (rocketActive flag set but no visual/effect happens)
- Character selection → race → results flow
- AI opponents hardcoded to TRACK_WAYPOINTS from data/track.ts
- RaceTrack renders fixed decorations for a single green environment

## Requested Changes (Diff)

### Add
- `data/maps.ts`: 4 themed maps each with id, name, description, waypoints, gridPositions, theme ('meadows'|'rainbow'|'castle'|'beach')
  - Mushroom Meadows: existing green track with mushroom decorations
  - Rainbow Road: sweeping space-style track, dark void bg, glowing rainbow road segments
  - Bowser's Castle: tight turns, dark stone ground, lava pits, castle walls
  - Koopa Beach: wide coastal curves, sandy ground, palm trees, blue ocean
- `pages/MapSelection.tsx`: map picker with 4 themed cards, select button
- Rocket visual: RocketProjectile component moves forward from kart, stuns nearest NPC within 5 units for 2s
- NPC stun system in useAIOpponents: stunNPC(id) function, stunned NPC stops+spins for 2s

### Modify
- App.tsx: add selectedMap state and 'map-select' screen between character-select and race
- CharacterSelection.tsx: navigate to map-select after picking character
- RaceGame.tsx: accept mapId prop; pass waypoints to useAIOpponents; pass theme to RaceTrack; wire rocket stun
- RaceTrack.tsx: accept theme prop; render per-theme ground color, road color, decorations; Rainbow Road uses emissive glowing cycling hue road
- useAIOpponents.ts: accept waypoints param; add stun state
- NPCKart.tsx: accept stunned prop and show spin visual

### Remove
- Nothing

## Implementation Plan
1. Create data/maps.ts with 4 map definitions and distinct waypoints
2. Create pages/MapSelection.tsx with 4 visually distinct cards
3. Update App.tsx flow: character-select → map-select → race
4. Update RaceGame.tsx to accept mapId, look up map, thread to components
5. Update RaceTrack.tsx for per-theme rendering
6. Update useAIOpponents.ts with waypoints param and stun
7. Add RocketProjectile component and wire rocket active state
8. Update NPCKart to show stun visual
