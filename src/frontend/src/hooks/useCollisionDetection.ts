import { useCallback } from 'react';

export function useCollisionDetection() {
  const checkCollision = useCallback((position: [number, number, number], trackRadius: number) => {
    const [x, , z] = position;
    const distFromCenter = Math.sqrt(x ** 2 + z ** 2);

    if (distFromCenter > trackRadius) {
      const angle = Math.atan2(z, x);
      const correctedX = Math.cos(angle) * (trackRadius - 0.5);
      const correctedZ = Math.sin(angle) * (trackRadius - 0.5);
      return { collision: true, correctedPosition: [correctedX, position[1], correctedZ] as [number, number, number] };
    }

    return { collision: false, correctedPosition: position };
  }, []);

  return { checkCollision };
}
