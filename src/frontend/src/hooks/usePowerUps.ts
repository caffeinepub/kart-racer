import { useState, useCallback } from 'react';

export function usePowerUps() {
  const [collectedPowerUp, setCollectedPowerUp] = useState<string | null>(null);
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);

  const collectPowerUp = useCallback((powerUpId: string) => {
    setCollectedPowerUp(powerUpId);
  }, []);

  const usePowerUp = useCallback(() => {
    if (collectedPowerUp) {
      setActivePowerUp(collectedPowerUp);
      setCollectedPowerUp(null);

      setTimeout(() => {
        setActivePowerUp(null);
      }, 3000);
    }
  }, [collectedPowerUp]);

  return {
    collectedPowerUp,
    activePowerUp,
    collectPowerUp,
    usePowerUp,
  };
}
