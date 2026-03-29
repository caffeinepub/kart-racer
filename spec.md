# Street Racer (NFS Theme)

## Current State
Kart racing game with Mario Kart maps, box-geometry karts with driver spheres, colorful aesthetic.

## Requested Changes (Diff)

### Add
- 4 NFS-themed maps: Downtown Neon (city night), Highway Havoc (desert night), Industrial Docks (port), Mountain Pass (dusk cliffs)
- Realistic sports car: sleek body, hood, side skirts, diffuser, fender flares, realistic rims, neon underglow strip
- Dark NFS atmosphere with stronger headlights and neon glow

### Modify
- PlayerKart.tsx: realistic low-profile sports car geometry, no driver sphere
- NPCKart.tsx: same realistic car shape
- RaceTrack.tsx: 4 NFS environment themes replacing Mario Kart themes
- data/maps.ts: NFS map definitions, MapTheme = city|highway|docks|mountain
- data/characters.ts: NFS street racer names/descriptions, keep IDs and stats
- MapSelection.tsx: NFS dark theme UI
- CharacterSelection.tsx: NFS dark theme
- RaceGame.tsx: lighting per NFS theme

### Remove
- Mario Kart map themes, driver sphere, mushrooms/palms/rainbow decorations

## Implementation Plan
1. Update data/maps.ts with NFS types and 4 map defs
2. Update data/characters.ts with street racer names
3. Rewrite PlayerKart.tsx realistic sports car body
4. Rewrite NPCKart.tsx same shape
5. Rewrite RaceTrack.tsx 4 NFS environments
6. Update RaceGame.tsx lighting per theme
7. Update MapSelection.tsx and CharacterSelection.tsx NFS styling
