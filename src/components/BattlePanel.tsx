import { useState, useEffect } from 'react';
import { Sword, Shield, Zap, Heart } from 'lucide-react';
import type { Character, Enemy } from '../types/game';

interface BattlePanelProps {
  character: Character;
  setCharacter: (char: Character | ((prev: Character) => Character)) => void;
  enemy: Enemy;
  onBattleEnd: (victory: boolean) => void;
}

export function BattlePanel({ character, setCharacter, enemy: initialEnemy, onBattleEnd }: BattlePanelProps) {
  const [enemy, setEnemy] = useState(initialEnemy);
  const [battleLog, setBattleLog] = useState<string[]>([`Бой начался с ${enemy.name}!`]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    if (enemy.hp <= 0) {
      setBattleLog(prev => [...prev, `${enemy.name} повержен!`]);
      setTimeout(() => onBattleEnd(true), 1500);
    } else if (character.hp <= 0) {
      setBattleLog(prev => [...prev, 'Вы были повержены...']);
      setTimeout(() => onBattleEnd(false), 1500);
    }
  }, [enemy.hp, character.hp]);

  useEffect(() => {
    if (!isPlayerTurn && enemy.hp > 0 && character.hp > 0) {
      const timer = setTimeout(() => {
        enemyAttack();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn]);

  const playerAttack = () => {
    const damage = Math.max(1, character.strength + Math.floor(Math.random() * 10) - enemy.defense);
    setEnemy(prev => ({ ...prev, hp: Math.max(0, prev.hp - damage) }));
    setBattleLog(prev => [...prev, `Вы нанесли ${damage} урона ${enemy.name}`]);
    setIsPlayerTurn(false);
  };

  const playerMagicAttack = () => {
    if (character.mana < 15) {
      setBattleLog(prev => [...prev, 'Недостаточно маны!']);
      return;
    }

    const damage = Math.max(1, character.intelligence * 2 + Math.floor(Math.random() * 15));
    setEnemy(prev => ({ ...prev, hp: Math.max(0, prev.hp - damage) }));
    setCharacter(prev => ({ ...prev, mana: prev.mana - 15 }));
    setBattleLog(prev => [...prev, `Вы использовали магию и нанесли ${damage} урона!`]);
    setIsPlayerTurn(false);
  };

  const playerDefend = () => {
    setCharacter(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 5) }));
    setBattleLog(prev => [...prev, 'Вы защищаетесь и восстанавливаете 5 HP']);
    setIsPlayerTurn(false);
  };

  const enemyAttack = () => {
    const damage = Math.max(1, enemy.attack + Math.floor(Math.random() * 8));
    setCharacter(prev => ({ ...prev, hp: Math.max(0, prev.hp - damage) }));
    setBattleLog(prev => [...prev, `${enemy.name} нанес вам ${damage} урона!`]);
    setIsPlayerTurn(true);
  };

  const enemyHpPercentage = (enemy.hp / enemy.maxHp) * 100;

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-red-500/30 shadow-lg">
      <h2 className="text-white mb-4 text-center">⚔️ Бой ⚔️</h2>

      {/* Enemy Status */}
      <div className="mb-6 bg-red-900/30 rounded-lg p-4 border border-red-500/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{enemy.icon}</span>
            <div>
              <h3 className="text-white">{enemy.name}</h3>
              <p className="text-red-300">
                ⚔️ {enemy.attack} | 🛡️ {enemy.defense}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white">{enemy.hp}/{enemy.maxHp}</p>
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-red-500 to-red-600 h-full transition-all duration-300"
            style={{ width: `${enemyHpPercentage}%` }}
          />
        </div>
      </div>

      {/* Battle Log */}
      <div className="mb-4 bg-slate-900/50 rounded-lg p-3 h-32 overflow-y-auto">
        {battleLog.map((log, index) => (
          <p key={index} className="text-purple-200 mb-1">
            › {log}
          </p>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={playerAttack}
          disabled={!isPlayerTurn || enemy.hp <= 0 || character.hp <= 0}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white px-4 py-3 rounded transition-colors"
        >
          <Sword className="w-5 h-5" />
          Атака
        </button>
        <button
          onClick={playerMagicAttack}
          disabled={!isPlayerTurn || enemy.hp <= 0 || character.hp <= 0 || character.mana < 15}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white px-4 py-3 rounded transition-colors"
        >
          <Zap className="w-5 h-5" />
          Магия (15)
        </button>
        <button
          onClick={playerDefend}
          disabled={!isPlayerTurn || enemy.hp <= 0 || character.hp <= 0}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-4 py-3 rounded transition-colors col-span-2"
        >
          <Shield className="w-5 h-5" />
          Защита (+5 HP)
        </button>
      </div>

      {!isPlayerTurn && enemy.hp > 0 && character.hp > 0 && (
        <p className="text-center text-yellow-400 mt-3">Ход противника...</p>
      )}
    </div>
  );
}
