import { useCallback, useEffect, useState } from "react";
import type { PowerUp } from "../data/powerups";

interface ActivePowerUpState {
  heldItem: PowerUp | null;
  activeEffect: "speed-boost" | "shield" | null;
  speedMultiplier: number;
  shieldActive: boolean;
  rocketActive: boolean;
}

export function useActivePowerUp() {
  const [state, setState] = useState<ActivePowerUpState>({
    heldItem: null,
    activeEffect: null,
    speedMultiplier: 1.0,
    shieldActive: false,
    rocketActive: false,
  });

  const receiveItem = useCallback((item: PowerUp) => {
    setState((prev) => ({ ...prev, heldItem: item }));
  }, []);

  const activateItem = useCallback(() => {
    setState((prev) => {
      if (!prev.heldItem) return prev;
      const { effectType } = prev.heldItem;
      if (effectType === "speed") {
        return {
          ...prev,
          heldItem: null,
          activeEffect: "speed-boost",
          speedMultiplier: 2.0,
        };
      }
      if (effectType === "shield") {
        return {
          ...prev,
          heldItem: null,
          activeEffect: "shield",
          shieldActive: true,
        };
      }
      if (effectType === "projectile") {
        return { ...prev, heldItem: null, rocketActive: true };
      }
      return prev;
    });
  }, []);

  const clearHeldItem = useCallback(() => {
    setState((prev) => ({ ...prev, heldItem: null }));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "KeyZ") {
        e.preventDefault();
        activateItem();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activateItem]);

  useEffect(() => {
    if (state.activeEffect !== "speed-boost") return;
    const t = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        activeEffect: null,
        speedMultiplier: 1.0,
      }));
    }, 3000);
    return () => clearTimeout(t);
  }, [state.activeEffect]);

  useEffect(() => {
    if (!state.shieldActive) return;
    const t = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        shieldActive: false,
        activeEffect: null,
      }));
    }, 5000);
    return () => clearTimeout(t);
  }, [state.shieldActive]);

  useEffect(() => {
    if (!state.rocketActive) return;
    const t = setTimeout(() => {
      setState((prev) => ({ ...prev, rocketActive: false }));
    }, 1500);
    return () => clearTimeout(t);
  }, [state.rocketActive]);

  return {
    ...state,
    receiveItem,
    activateItem,
    clearHeldItem,
  };
}
