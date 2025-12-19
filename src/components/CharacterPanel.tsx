import { User, Heart, Zap, TrendingUp, Coins, Sword, Brain } from 'lucide-react';
import type { Character } from '../types/game';

interface CharacterPanelProps {
  character: Character;
}

export function CharacterPanel({ character }: CharacterPanelProps) {
  const hpPercentage = (character.hp / character.maxHp) * 100;
  const manaPercentage = (character.mana / character.maxMana) * 100;
  const expPercentage = (character.exp / character.expToLevel) * 100;

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-white">{character.name}</h2>
          <p className="text-purple-300">Уровень {character.level}</p>
        </div>
      </div>

      {/* HP Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-white">HP</span>
          </div>
          <span className="text-white">{character.hp}/{character.maxHp}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-red-500 to-red-600 h-full transition-all duration-300"
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>

      {/* Mana Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-white">Мана</span>
          </div>
          <span className="text-white">{character.mana}/{character.maxMana}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
            style={{ width: `${manaPercentage}%` }}
          />
        </div>
      </div>

      {/* EXP Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <span className="text-white">Опыт</span>
          </div>
          <span className="text-white">{character.exp}/{character.expToLevel}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-full transition-all duration-300"
            style={{ width: `${expPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-purple-500/30">
        <div className="flex items-center gap-2">
          <Sword className="w-4 h-4 text-orange-400" />
          <div>
            <p className="text-purple-300">Сила</p>
            <p className="text-white">{character.strength}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-400" />
          <div>
            <p className="text-purple-300">Интеллект</p>
            <p className="text-white">{character.intelligence}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <Coins className="w-4 h-4 text-yellow-400" />
          <div>
            <p className="text-purple-300">Золото</p>
            <p className="text-white">{character.gold}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
