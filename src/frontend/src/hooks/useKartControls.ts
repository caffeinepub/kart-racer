import { useEffect, useState } from "react";

export function useKartControls(enabled: boolean) {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    drift: false,
  });

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          setKeys((prev) => ({ ...prev, forward: true }));
          break;
        case "s":
        case "arrowdown":
          setKeys((prev) => ({ ...prev, backward: true }));
          break;
        case "a":
        case "arrowleft":
          setKeys((prev) => ({ ...prev, left: true }));
          break;
        case "d":
        case "arrowright":
          setKeys((prev) => ({ ...prev, right: true }));
          break;
        case " ":
          setKeys((prev) => ({ ...prev, drift: true }));
          e.preventDefault();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          setKeys((prev) => ({ ...prev, forward: false }));
          break;
        case "s":
        case "arrowdown":
          setKeys((prev) => ({ ...prev, backward: false }));
          break;
        case "a":
        case "arrowleft":
          setKeys((prev) => ({ ...prev, left: false }));
          break;
        case "d":
        case "arrowright":
          setKeys((prev) => ({ ...prev, right: false }));
          break;
        case " ":
          setKeys((prev) => ({ ...prev, drift: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [enabled]);

  return {
    throttle: keys.forward ? 1 : 0,
    brake: keys.backward ? 1 : 0,
    steer: keys.left ? -1 : keys.right ? 1 : 0,
    drift: keys.drift,
  };
}
