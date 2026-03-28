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
    // Kart faces +Z (front bumper at z=1.1), so camera goes behind at -Z
    const offset = new THREE.Vector3(0, 4, -8);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), kartRotation[1]);

    targetPosition.current.set(
      kartPosition[0] + offset.x,
      kartPosition[1] + offset.y,
      kartPosition[2] + offset.z,
    );

    // Smooth camera movement
    camera.position.lerp(targetPosition.current, 0.1);

    // Look ahead of the kart (in the +Z forward direction)
    const lookAheadOffset = new THREE.Vector3(0, 1, 4);
    lookAheadOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), kartRotation[1]);
    targetLookAt.current.set(
      kartPosition[0] + lookAheadOffset.x,
      kartPosition[1] + lookAheadOffset.y,
      kartPosition[2] + lookAheadOffset.z,
    );
    camera.lookAt(targetLookAt.current);
  });

  return null;
}
