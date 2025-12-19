import { Scroll, CheckCircle2, Circle, Lock } from 'lucide-react';
import type { Quest } from '../types/game';

interface QuestPanelProps {
  quests: Quest[];
}

export function QuestPanel({ quests }: QuestPanelProps) {
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Scroll className="w-5 h-5 text-purple-400" />
        <h2 className="text-white">Квесты</h2>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`rounded-lg p-3 border ${
              quest.completed 
                ? 'bg-green-900/30 border-green-500/50' 
                : !quest.unlocked
                ? 'bg-slate-900/50 border-slate-600/50 opacity-60'
                : 'bg-slate-700/50 border-purple-500/30'
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              {quest.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              ) : !quest.unlocked ? (
                <Lock className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`mb-1 ${quest.completed ? 'text-green-400' : !quest.unlocked ? 'text-slate-400' : 'text-white'}`}>
                  {quest.title}
                </h3>
                <p className={`mb-2 ${!quest.unlocked ? 'text-slate-500' : 'text-purple-300'}`}>{quest.description}</p>
                
                {!quest.unlocked && quest.requiredLevel && (
                  <p className="text-yellow-400 mb-2">
                    🔒 Требуется уровень {quest.requiredLevel}
                  </p>
                )}
                
                {!quest.completed && quest.unlocked && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-purple-300">Прогресс</span>
                      <span className="text-white">{quest.progress}/{quest.target}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                        style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <span className="text-yellow-400">
                    ⭐ {quest.reward.exp} опыта
                  </span>
                  <span className="text-yellow-400">
                    💰 {quest.reward.gold} золота
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}