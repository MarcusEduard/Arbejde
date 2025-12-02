export const Snowflakes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute text-white/40 animate-snow-fall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
            fontSize: `${10 + Math.random() * 10}px`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};
