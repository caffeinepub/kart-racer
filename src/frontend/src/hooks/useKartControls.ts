import { useEffect, useRef, useState } from "react";

interface MobileInput {
  throttle: number;
  brake: number;
  steer: number;
  drift: boolean;
  useItem: boolean;
}

const DEFAULT_MOBILE: MobileInput = {
  throttle: 0,
  brake: 0,
  steer: 0,
  drift: false,
  useItem: false,
};

// Module-level ref so MobileControls can push into PlayerKart's hook
let _setMobileInput: ((input: MobileInput) => void) | null = null;

export function setMobileInput(input: MobileInput) {
  if (_setMobileInput) _setMobileInput(input);
}

export function useKartControls(enabled: boolean) {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    drift: false,
  });

  const [mobileInput, setMobile] = useState<MobileInput>(DEFAULT_MOBILE);
  const mobileRef = useRef(mobileInput);
  mobileRef.current = mobileInput;

  // Register setter so external code can push mobile input
  useEffect(() => {
    _setMobileInput = setMobile;
    return () => {
      _setMobileInput = null;
    };
  }, []);

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
        case "shift":
        case "z":
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
        case "shift":
        case "z":
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

  // Merge keyboard + mobile
  const throttle = keys.forward ? 1 : mobileInput.throttle;
  const brake = keys.backward ? 1 : mobileInput.brake;
  const steer = keys.left ? -1 : keys.right ? 1 : mobileInput.steer;
  const drift = keys.drift || mobileInput.drift;
  const useItem = mobileInput.useItem;

  return { throttle, brake, steer, drift, useItem };
}
