import { useCallback, useRef } from "react";
import { triggerMobileItemUse } from "../hooks/useActivePowerUp";
import { setMobileInput } from "../hooks/useKartControls";

interface ButtonState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  gas: boolean;
  brake: boolean;
  drift: boolean;
}

const DEFAULT_BTN: ButtonState = {
  up: false,
  down: false,
  left: false,
  right: false,
  gas: false,
  brake: false,
  drift: false,
};

export default function MobileControls() {
  const btnState = useRef<ButtonState>({ ...DEFAULT_BTN });

  const flush = useCallback(() => {
    const s = btnState.current;
    const throttle = s.gas || s.up ? 1 : 0;
    const brake = s.brake || s.down ? 1 : 0;
    const steer = s.left ? -1 : s.right ? 1 : 0;
    const drift = s.drift;
    setMobileInput({ throttle, brake, steer, drift, useItem: false });
  }, []);

  const press = useCallback(
    (key: keyof ButtonState, val: boolean) => {
      btnState.current[key] = val;
      flush();
    },
    [flush],
  );

  function btn(label: string, key: keyof ButtonState, extra = "") {
    return (
      <button
        type="button"
        className={`select-none flex items-center justify-center text-white font-black rounded-xl bg-black/60 border-2 border-white/30 active:bg-white/20 touch-none ${extra}`}
        style={{ userSelect: "none" }}
        onTouchStart={(e) => {
          e.preventDefault();
          press(key, true);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          press(key, false);
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          press(key, false);
        }}
        onMouseDown={() => press(key, true)}
        onMouseUp={() => press(key, false)}
        onMouseLeave={() => press(key, false)}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none md:hidden"
      style={{ touchAction: "none" }}
    >
      {/* Left D-pad — 3x3 grid with DRIFT top-left */}
      <div
        className="absolute bottom-8 left-4 pointer-events-auto"
        style={{
          display: "grid",
          gridTemplateColumns: "60px 60px 60px",
          gridTemplateRows: "60px 60px 60px",
          gap: 5,
        }}
      >
        {/* Row 1 */}
        {btn(
          "DRIFT",
          "drift",
          "text-yellow-300 border-yellow-400/50 bg-yellow-900/60 text-sm",
        )}
        {btn("▲", "up")}
        <div />
        {/* Row 2 */}
        {btn("◀", "left")}
        <div className="rounded-xl bg-black/30 border border-white/10" />
        {btn("▶", "right")}
        {/* Row 3 */}
        <div />
        {btn("▼", "down")}
        <div />
      </div>

      {/* Right side: GAS + USE + BRAKE */}
      <div
        className="absolute bottom-8 right-4 pointer-events-auto flex flex-col items-center"
        style={{ gap: 10 }}
      >
        {btn(
          "GAS",
          "gas",
          "text-green-400 border-green-400/50 bg-green-900/60",
        )}

        {/* USE button — triggers item use directly, no btnState */}
        <button
          type="button"
          data-ocid="controls.use_item.button"
          className="select-none flex items-center justify-center font-black rounded-xl border-2 touch-none text-yellow-300 border-yellow-400/50 bg-yellow-900/70 active:bg-yellow-700/80"
          style={{ width: 72, height: 60, fontSize: 16, userSelect: "none" }}
          onTouchStart={(e) => {
            e.preventDefault();
            triggerMobileItemUse();
          }}
          onMouseDown={() => triggerMobileItemUse()}
        >
          USE
        </button>

        {btn("BRAKE", "brake", "text-red-400 border-red-400/50 bg-red-900/60")}
      </div>
    </div>
  );
}
