import { useCallback, useState } from "react";
import type { Character } from "../data/characters";

export function usePhysics(_character: Character) {
  const [velocity, setVelocity] = useState({ x: 0, z: 0 });
  const [currentAngle, setCurrentAngle] = useState(Math.PI); // Start facing forward (negative Z)

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
      delta: number,
    ) => {
      const maxSpeed = 20 * speedMultiplier;
      const acceleration = 15 * accelMultiplier;
      const friction = 0.95;
      const turnSpeed = 2 * handleMultiplier;

      let newVelX = velocity.x;
      let newVelZ = velocity.z;

      // Calculate current speed
      const currentSpeed = Math.sqrt(newVelX ** 2 + newVelZ ** 2);

      // Determine the angle to use for acceleration
      let angle = currentAngle;
      if (currentSpeed > 0.1) {
        // Use velocity direction when moving
        angle = Math.atan2(newVelX, newVelZ);
      }

      // Apply throttle - accelerate in the direction the kart is facing
      if (throttle > 0) {
        const accel = acceleration * throttle * delta * (1 + driftBoost);
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
        angle += turnAmount;
        const speed = currentSpeed;
        newVelX = Math.sin(angle) * speed;
        newVelZ = Math.cos(angle) * speed;
      }

      // Update current angle for next frame
      if (currentSpeed > 0.1) {
        setCurrentAngle(Math.atan2(newVelX, newVelZ));
      } else {
        setCurrentAngle(angle);
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
    [velocity, currentAngle],
  );

  return { velocity, updatePhysics };
}
