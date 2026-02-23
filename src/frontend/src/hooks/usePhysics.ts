import { useState, useCallback } from 'react';
import { Character } from '../data/characters';

export function usePhysics(character: Character) {
  const [velocity, setVelocity] = useState({ x: 0, z: 0 });

  const updatePhysics = useCallback(
    (
      throttle: number,
      brake: number,
      steer: number,
      isDrifting: boolean,
      driftBoost: number,
      speedMultiplier: number,
      accelMultiplier: number,
      handleMultiplier: number,
      delta: number
    ) => {
      const maxSpeed = 20 * speedMultiplier;
      const acceleration = 15 * accelMultiplier;
      const friction = 0.95;
      const turnSpeed = 2 * handleMultiplier;

      let newVelX = velocity.x;
      let newVelZ = velocity.z;

      // Calculate current speed
      const currentSpeed = Math.sqrt(newVelX ** 2 + newVelZ ** 2);

      // Apply throttle
      if (throttle > 0) {
        const accel = acceleration * throttle * delta * (1 + driftBoost);
        const angle = Math.atan2(newVelX, newVelZ);
        newVelX += Math.sin(angle) * accel;
        newVelZ += Math.cos(angle) * accel;
      }

      // Apply brake
      if (brake > 0) {
        newVelX *= 0.9;
        newVelZ *= 0.9;
      }

      // Apply steering
      if (steer !== 0 && currentSpeed > 0.1) {
        const turnAmount = steer * turnSpeed * delta * (isDrifting ? 1.5 : 1);
        const angle = Math.atan2(newVelX, newVelZ);
        const newAngle = angle + turnAmount;
        const speed = currentSpeed;
        newVelX = Math.sin(newAngle) * speed;
        newVelZ = Math.cos(newAngle) * speed;
      }

      // Apply friction
      newVelX *= friction;
      newVelZ *= friction;

      // Limit max speed
      const speed = Math.sqrt(newVelX ** 2 + newVelZ ** 2);
      if (speed > maxSpeed) {
        newVelX = (newVelX / speed) * maxSpeed;
        newVelZ = (newVelZ / speed) * maxSpeed;
      }

      const newVelocity = { x: newVelX, z: newVelZ };
      setVelocity(newVelocity);
      return newVelocity;
    },
    [velocity]
  );

  return { velocity, updatePhysics };
}
