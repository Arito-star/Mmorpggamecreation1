import { useEffect, useState } from 'react';
import { MapPin, TreePine, Mountain, Home, Skull, Crown } from 'lucide-react';
import type { Character, Enemy, GameStatus } from '../types/game';

interface GameWorldProps {
  character: Character;
  setCharacter: (char: Character | ((prev: Character) => Character)) => void;
  startBattle: (enemy: Enemy) => void;
  collectHerb: () => void;
  inBattle: boolean;
  gameStatus: GameStatus;
  finalQuestUnlocked: boolean;
}

interface WorldTile {
  type: 'grass' | 'forest' | 'mountain' | 'village' | 'enemy' | 'finalBoss';
  enemy?: Enemy;
  hasHerb?: boolean;
}

export function GameWorld({ character, setCharacter, startBattle, collectHerb, inBattle, gameStatus, finalQuestUnlocked }: GameWorldProps) {
  const [world, setWorld] = useState<WorldTile[][]>([]);
  const [otherPlayers, setOtherPlayers] = useState<Array<{ name: string; position: { x: number; y: number } }>>([]);

  const worldSize = 10;

  useEffect(() => {
    // Generate world
    const newWorld: WorldTile[][] = [];
    for (let y = 0; y < worldSize; y++) {
      const row: WorldTile[] = [];
      for (let x = 0; x < worldSize; x++) {
        const rand = Math.random();
        if (x === 0 && y === 0) {
          row.push({ type: 'village' });
        } else if (x === 9 && y === 9) {
          // Final boss location
          row.push({ type: 'finalBoss' });
        } else if (rand < 0.1) {
          const enemyTypes = [
            { name: 'Гоблин', type: 'goblin', attack: 8, defense: 3, expReward: 25, goldReward: 15, icon: '👺' },
            { name: 'Волк', type: 'wolf', attack: 12, defense: 5, expReward: 30, goldReward: 10, icon: '🐺' },
            { name: 'Орк', type: 'orc', attack: 15, defense: 7, expReward: 50, goldReward: 30, icon: '👹' }
          ];
          const enemyTemplate = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
          const mult = gameStatus.difficultyMultiplier;
          row.push({ 
            type: 'enemy',
            enemy: {
              id: `${x}-${y}`,
              ...enemyTemplate,
              hp: Math.floor((50 + Math.floor(Math.random() * 30)) * mult),
              maxHp: Math.floor((50 + Math.floor(Math.random() * 30)) * mult),
              attack: Math.floor(enemyTemplate.attack * mult),
              defense: Math.floor(enemyTemplate.defense * mult),
              expReward: Math.floor(enemyTemplate.expReward * mult),
              goldReward: Math.floor(enemyTemplate.goldReward * mult)
            }
          });
        } else if (rand < 0.3) {
          row.push({ type: 'forest', hasHerb: Math.random() < 0.3 });
        } else if (rand < 0.4) {
          row.push({ type: 'mountain' });
        } else {
          row.push({ type: 'grass' });
        }
      }
      newWorld.push(row);
    }
    setWorld(newWorld);

    // Simulate other players
    const players = [
      { name: 'Воин123', position: { x: 3, y: 2 } },
      { name: 'Маг_Огня', position: { x: 7, y: 5 } },
      { name: 'Лучник99', position: { x: 2, y: 8 } }
    ];
    setOtherPlayers(players);

    // Move other players randomly
    const interval = setInterval(() => {
      setOtherPlayers(prev => prev.map(player => {
        const directions = [
          { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
        ];
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const newX = Math.max(0, Math.min(worldSize - 1, player.position.x + dir.x));
        const newY = Math.max(0, Math.min(worldSize - 1, player.position.y + dir.y));
        return { ...player, position: { x: newX, y: newY } };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [gameStatus.difficultyMultiplier]);

  const moveCharacter = (dx: number, dy: number) => {
    if (inBattle) return;

    setCharacter(prev => {
      const newX = Math.max(0, Math.min(worldSize - 1, prev.position.x + dx));
      const newY = Math.max(0, Math.min(worldSize - 1, prev.position.y + dy));
      
      if (newX === prev.position.x && newY === prev.position.y) return prev;

      const tile = world[newY]?.[newX];
      
      if (tile?.type === 'mountain') return prev;
      
      if (tile?.type === 'finalBoss') {
        if (finalQuestUnlocked) {
          // Create the final boss
          const finalBoss: Enemy = {
            id: 'final-boss',
            name: '👑 Повелитель Тьмы',
            type: 'finalBoss',
            hp: 300 * gameStatus.difficultyMultiplier,
            maxHp: 300 * gameStatus.difficultyMultiplier,
            attack: 30 * gameStatus.difficultyMultiplier,
            defense: 20 * gameStatus.difficultyMultiplier,
            expReward: 500 * gameStatus.difficultyMultiplier,
            goldReward: 500 * gameStatus.difficultyMultiplier,
            icon: '👑'
          };
          startBattle(finalBoss);
        }
        return prev; // Don't move onto final boss tile
      }
      
      if (tile?.type === 'enemy' && tile.enemy) {
        startBattle(tile.enemy);
        // Remove enemy from world
        setWorld(prevWorld => {
          const newWorld = [...prevWorld];
          newWorld[newY] = [...newWorld[newY]];
          newWorld[newY][newX] = { type: 'grass' };
          return newWorld;
        });
      }
      
      if (tile?.type === 'forest' && tile.hasHerb) {
        collectHerb();
        setWorld(prevWorld => {
          const newWorld = [...prevWorld];
          newWorld[newY] = [...newWorld[newY]];
          newWorld[newY][newX] = { type: 'forest', hasHerb: false };
          return newWorld;
        });
      }
      
      return { ...prev, position: { x: newX, y: newY } };
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          moveCharacter(0, -1);
          break;
        case 'ArrowDown':
        case 's':
          moveCharacter(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
          moveCharacter(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
          moveCharacter(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [world, inBattle]);

  const getTileColor = (tile: WorldTile) => {
    switch (tile.type) {
      case 'grass': return 'bg-green-700';
      case 'forest': return 'bg-green-900';
      case 'mountain': return 'bg-gray-600';
      case 'village': return 'bg-yellow-700';
      case 'enemy': return 'bg-red-800';
      case 'finalBoss': return finalQuestUnlocked ? 'bg-black border-red-500 border-2 animate-pulse' : 'bg-gray-800';
      default: return 'bg-green-700';
    }
  };

  const getTileIcon = (tile: WorldTile, x: number, y: number) => {
    const isPlayer = character.position.x === x && character.position.y === y;
    const otherPlayer = otherPlayers.find(p => p.position.x === x && p.position.y === y);

    if (isPlayer) return <div className="text-2xl">⚔️</div>;
    if (otherPlayer) return <div className="text-2xl">👤</div>;
    
    if (tile.type === 'finalBoss') {
      if (finalQuestUnlocked) {
        return <Crown className="w-8 h-8 text-red-500 animate-pulse" />;
      }
      return <div className="text-2xl">🏰</div>;
    }
    
    if (tile.type === 'forest') {
      if (tile.hasHerb) return <TreePine className="w-6 h-6 text-green-300" />;
      return <TreePine className="w-6 h-6 text-green-400" />;
    }
    if (tile.type === 'mountain') return <Mountain className="w-6 h-6 text-gray-400" />;
    if (tile.type === 'village') return <Home className="w-6 h-6 text-yellow-400" />;
    if (tile.type === 'enemy' && tile.enemy) return <div className="text-2xl">{tile.enemy.icon}</div>;
    return null;
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white">Мир игры</h2>
        <div className="flex items-center gap-2 text-purple-300">
          <MapPin className="w-4 h-4" />
          <span>X:{character.position.x} Y:{character.position.y}</span>
        </div>
      </div>

      <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: `repeat(${worldSize}, minmax(0, 1fr))` }}>
        {world.map((row, y) => (
          row.map((tile, x) => {
            const isPlayer = character.position.x === x && character.position.y === y;
            const otherPlayer = otherPlayers.find(p => p.position.x === x && p.position.y === y);
            
            return (
              <div
                key={`${x}-${y}`}
                className={`aspect-square ${getTileColor(tile)} rounded flex items-center justify-center relative border ${
                  isPlayer ? 'border-purple-400 border-2' : 'border-slate-700'
                } transition-all hover:brightness-110 cursor-pointer`}
                onClick={() => {
                  const dx = x - character.position.x;
                  const dy = y - character.position.y;
                  if (Math.abs(dx) + Math.abs(dy) === 1) {
                    moveCharacter(dx, dy);
                  }
                }}
              >
                {getTileIcon(tile, x, y)}
                {otherPlayer && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-900 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap">
                    {otherPlayer.name}
                  </div>
                )}
              </div>
            );
          })
        ))}
      </div>

      <div className="text-center text-purple-300">
        Используйте WASD или стрелки для движения
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => moveCharacter(0, -1)}
          disabled={inBattle}
          className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
        >
          ↑
        </button>
        <div className="w-full flex gap-2">
          <button
            onClick={() => moveCharacter(-1, 0)}
            disabled={inBattle}
            className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => moveCharacter(0, 1)}
            disabled={inBattle}
            className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            ↓
          </button>
          <button
            onClick={() => moveCharacter(1, 0)}
            disabled={inBattle}
            className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}