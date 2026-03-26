import { Theme } from "@/lib/themeConfig";

interface SnowflakesProps {
  theme?: Theme;
}

const EASTER_PARTICLES = ['🥚', '🌸', '🌷', '🐣', '🌼'];

export const Snowflakes = ({ theme = 'christmas' }: SnowflakesProps) => {
  const isEaster = theme === 'easter';
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-snow-fall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
            fontSize: isEaster ? `${14 + Math.random() * 10}px` : `${10 + Math.random() * 10}px`,
            opacity: isEaster ? 0.55 : 0.4,
            color: isEaster ? undefined : 'white',
          }}
        >
          {isEaster ? EASTER_PARTICLES[i % EASTER_PARTICLES.length] : '❄'}
        </div>
      ))}
    </div>
  );
};
