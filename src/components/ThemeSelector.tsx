import { Theme } from "@/lib/themeConfig";

interface ThemeSelectorProps {
  onSelect: (theme: Theme) => void;
}

export const ThemeSelector = ({ onSelect }: ThemeSelectorProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-gray-950">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-800/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-700/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-900/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg">
          🎉 Vælg dit tema 🎉
        </h1>
        <p className="text-xl md:text-2xl text-white/70">
          Hvilken fest fejrer I i dag?
        </p>
      </div>

      {/* Theme cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">

        {/* Christmas */}
        <button
          onClick={() => onSelect('christmas')}
          className="group cursor-pointer rounded-3xl p-8 bg-gradient-to-br from-red-800/90 to-green-900/90 border-4 border-yellow-400 shadow-2xl hover:scale-105 hover:shadow-yellow-400/30 transition-all duration-300 text-center focus:outline-none focus:ring-4 focus:ring-yellow-400"
        >
          <div className="text-9xl mb-6 group-hover:animate-bounce inline-block">🎅</div>
          <h2 className="text-4xl font-bold text-white mb-3">Julefrokost</h2>
          <p className="text-white/80 text-lg mb-5">
            Med julemanden, sne og julehygge
          </p>
          <div className="flex justify-center gap-3 text-3xl mb-6">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎄</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>❄️</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎁</span>
            <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🔔</span>
          </div>
          <div className="bg-yellow-400 text-red-900 font-bold py-3 px-6 rounded-full text-xl group-hover:bg-yellow-300 transition-colors shadow-lg">
            Vælg Julefrokost 🎄
          </div>
        </button>

        {/* Easter */}
        <button
          onClick={() => onSelect('easter')}
          className="group cursor-pointer rounded-3xl p-8 bg-gradient-to-br from-pink-700/90 to-yellow-700/90 border-4 border-pink-300 shadow-2xl hover:scale-105 hover:shadow-pink-400/30 transition-all duration-300 text-center focus:outline-none focus:ring-4 focus:ring-pink-300"
        >
          <img src="/påskehare.png" alt="Påskehare" className="h-36 mb-6 mx-auto object-contain group-hover:animate-bounce" />
          <h2 className="text-4xl font-bold text-white mb-3">Påskefrokost</h2>
          <p className="text-white/80 text-lg mb-5">
            Med påskeharen, æg og påskehygge
          </p>
          <div className="flex justify-center gap-3 text-3xl mb-6">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🥚</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🌸</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🌷</span>
            <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🐣</span>
          </div>
          <div className="bg-pink-200 text-pink-900 font-bold py-3 px-6 rounded-full text-xl group-hover:bg-pink-100 transition-colors shadow-lg">
            Vælg Påskefrokost 🐰
          </div>
        </button>

      </div>
    </div>
  );
};
