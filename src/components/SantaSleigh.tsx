export const SantaSleigh = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="sleigh-animation text-9xl">
        🎅🦌
      </div>
      <div className="absolute bottom-1/3 text-center">
        <p className="text-4xl font-bold text-white animate-pulse">
          Julemanden vælger en plads...
        </p>
      </div>
    </div>
  );
};
