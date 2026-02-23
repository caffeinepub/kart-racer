export default function GameLogo() {
  return (
    <div className="flex justify-center items-center py-6 animate-bounce-slow">
      <img
        src="/assets/generated/game-logo.dim_800x400.png"
        alt="Kart Racer"
        className="h-24 md:h-32 drop-shadow-2xl"
      />
    </div>
  );
}
