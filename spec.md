# Kart Racer

## Current State
- 3D kart racing game built with React Three Fiber + Three.js
- 10 playable characters with unique speed/accel/handling stats
- Single oval ring track with barriers, trees, grandstands
- Player kart with physics, steering, drift boost
- Basic power-up items on track (3 positions) that collect but do nothing
- Lap counter (3 laps), race timer, speed HUD
- Race countdown, results screen, leaderboard (backend-connected)
- No AI opponents, no position tracking, no functional power-up effects

## Requested Changes (Diff)

### Add
- **AI opponents** (3-4 NPC karts): Each NPC drives around the oval track autonomously using angle-based path following. They have their own position, speed, lap count. Displayed as colored karts in the scene.
- **Race position tracker**: Calculate player's position (1st/2nd/3rd/4th) by comparing player lap+track angle progress vs NPC progress. Show "POS: 1st" in HUD.
- **Functional power-ups**: Speed Boost = 3-second speed multiplier on the player. Shield = absorb one hit (visual ring around kart). Rocket = launches a projectile forward that temporarily slows the first NPC it hits.
- **Item boxes**: Replace the 3 plain PowerUpItem positions with glowing rotating cube item boxes that respawn after pickup. Picking up awards a random power-up from the list.
- **Drift/boost visual effects**: When drifting, emit small colored spark/smoke particles behind rear wheels. When speed boost active, add speed-line streaks as an overlay.
- **Active item display**: Show the currently held item in HUD with an icon, and a "use item" button (Z key or tap button).

### Modify
- **RaceHUD**: Add position display (1st/2nd/3rd/4th). Add held item slot with icon. Add item use button indicator.
- **RaceGame**: Wire up NPC karts, position calculation, and power-up effect application.
- **PlayerKart**: Apply speed boost multiplier from active power-up state. Show shield ring when shield active.
- **PowerUpItem**: Upgrade to ItemBox component — rotating, glowing cube with respawn timer.
- **CharacterCard**: Add stat bars (speed, acceleration, handling) as colored progress bars below the character name.

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/hooks/useAIOpponents.ts` — manages 3 NPC karts on a circular path, each with own angle/speed/lap state. Each NPC follows the oval at `angle += npcSpeed * delta`, position = `[cos(angle)*11.5, 0.5, sin(angle)*11.5 - 10]`.
2. Create `src/frontend/src/components/NPCKart.tsx` — renders a simplified kart mesh (same structure as PlayerKart but no controls) with distinct color per NPC.
3. Create `src/frontend/src/hooks/useRacePosition.ts` — computes player's 1-4 position by converting each racer's lap+angle to a single progress float and ranking them.
4. Create `src/frontend/src/hooks/useActivePowerUp.ts` — manages held item, use action, effects (speedBoost, shield, rocket), and rocket projectile state.
5. Update `PowerUpItem.tsx` → `ItemBox.tsx` — rotating glowing cube, respawn after 8s, awards random power-up on collect.
6. Update `RaceHUD.tsx` — add position badge, item slot, item use prompt.
7. Update `PlayerKart.tsx` — read speedBoost multiplier, render shield ring mesh when shield active.
8. Update `RaceGame.tsx` — add NPCKart instances from hook state, add ItemBox positions, wire useActivePowerUp, useRacePosition.
9. Update `CharacterCard.tsx` — add stat progress bars for speed/acceleration/handling.
