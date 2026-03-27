import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface RaceCameraProps {
  kartPosition: [number, number, number];
  kartRotation: [number, number, number];
}

export default function RaceCamera({
  kartPosition,
  kartRotation,
}: RaceCameraProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    // Calculate camera position behind the kart
    // Offset is now negative Z to be behind when kart faces forward (negative Z)
    const offset = new THREE.Vector3(0, 4, 8);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), kartRotation[1]);

    targetPosition.current.set(
      kartPosition[0] + offset.x,
      kartPosition[1] + offset.y,
      kartPosition[2] + offset.z,
    );

    // Smooth camera movement
    camera.position.lerp(targetPosition.current, 0.1);

    // Look at kart position slightly ahead
    targetLookAt.current.set(
      kartPosition[0],
      kartPosition[1] + 1,
      kartPosition[2],
    );
    camera.lookAt(targetLookAt.current);
  });

  return null;
}
