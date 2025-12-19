import { Crown, Trophy, Sparkles, RotateCcw } from 'lucide-react';

interface VictoryScreenProps {
  character: {
    name: string;
    level: number;
  };
  onNewGamePlus: () => void;
  onContinue: () => void;
}

export function VictoryScreen({ character, onNewGamePlus, onContinue }: VictoryScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-yellow-900/90 to-purple-900/90 rounded-xl p-8 border-4 border-yellow-500 shadow-2xl max-w-2xl w-full text-center">
        <div className="mb-6 flex justify-center">
          <Crown className="w-24 h-24 text-yellow-400 animate-pulse" />
        </div>

        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-4">
          🎉 ПОБЕДА! 🎉
        </h1>
        
        <div className="space-y-4 mb-8">
          <p className="text-yellow-200 text-xl">
            Повелитель Тьмы повержен!
          </p>
          <p className="text-purple-300">
            Герой {character.name} (Уровень {character.level}) спас мир от вечной тьмы!
          </p>
          <p className="text-purple-200">
            Легенды о ваших подвигах будут передаваться из поколения в поколение.
          </p>
        </div>

        <div className="bg-black/40 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h3 className="text-yellow-400">Достижения разблокированы</h3>
          </div>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-green-400">
              <Sparkles className="w-4 h-4" />
              <span>✓ Спаситель Мира</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <Sparkles className="w-4 h-4" />
              <span>✓ Убийца Повелителя Тьмы</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <Sparkles className="w-4 h-4" />
              <span>✓ Мастер Квестов</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onNewGamePlus}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Новая Игра+ (Враги x2 сильнее)
          </button>
          
          <button
            onClick={onContinue}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-all"
          >
            Продолжить исследование
          </button>
        </div>

        <p className="text-purple-400 mt-4">
          Спасибо за игру в &ldquo;Легенды Фэнтези&rdquo;!
        </p>
      </div>
    </div>
  );
}
