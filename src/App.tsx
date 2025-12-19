import { useState, useEffect } from 'react';
import { GameWorld } from './components/GameWorld';
import { CharacterPanel } from './components/CharacterPanel';
import { InventoryPanel } from './components/InventoryPanel';
import { QuestPanel } from './components/QuestPanel';
import { BattlePanel } from './components/BattlePanel';
import { ChatPanel } from './components/ChatPanel';
import { VictoryScreen } from './components/VictoryScreen';
import type { Character, Enemy, Item, Quest, GameStatus } from './types/game';

export default function App() {
  const [character, setCharacter] = useState<Character>({
    name: 'Герой',
    level: 1,
    hp: 100,
    maxHp: 100,
    mana: 50,
    maxMana: 50,
    exp: 0,
    expToLevel: 100,
    strength: 10,
    intelligence: 8,
    gold: 50,
    position: { x: 5, y: 5 }
  });

  const [gameStatus, setGameStatus] = useState<GameStatus>({
    finalBossDefeated: false,
    newGamePlus: false,
    difficultyMultiplier: 1
  });

  const [inventory, setInventory] = useState<Item[]>([
    { id: '1', name: 'Зелье здоровья', type: 'potion', effect: 'heal', value: 30, icon: '🧪' },
    { id: '2', name: 'Зелье маны', type: 'potion', effect: 'mana', value: 20, icon: '💙' }
  ]);

  const [quests, setQuests] = useState<Quest[]>([
    { 
      id: '1', 
      title: 'Истребитель гоблинов', 
      description: 'Убейте 5 гоблинов', 
      progress: 0, 
      target: 5, 
      reward: { exp: 100, gold: 50 }, 
      completed: false,
      unlocked: true
    },
    { 
      id: '2', 
      title: 'Сбор трав', 
      description: 'Соберите 3 лечебные травы', 
      progress: 0, 
      target: 3, 
      reward: { exp: 50, gold: 25 }, 
      completed: false,
      unlocked: true
    },
    {
      id: '3',
      title: 'Охотник на волков',
      description: 'Победите 3 волков',
      progress: 0,
      target: 3,
      reward: { exp: 150, gold: 75 },
      completed: false,
      unlocked: false,
      requiredLevel: 3
    },
    {
      id: '4',
      title: 'Убийца орков',
      description: 'Победите 5 орков',
      progress: 0,
      target: 5,
      reward: { exp: 250, gold: 150 },
      completed: false,
      unlocked: false,
      requiredLevel: 5
    },
    {
      id: '5',
      title: 'Мастер боя',
      description: 'Достигните 8 уровня',
      progress: 0,
      target: 8,
      reward: { exp: 300, gold: 200 },
      completed: false,
      unlocked: false,
      requiredLevel: 5
    },
    {
      id: '6',
      title: 'Легендарный воин',
      description: 'Соберите 500 золота',
      progress: 0,
      target: 500,
      reward: { exp: 400, gold: 300 },
      completed: false,
      unlocked: false,
      requiredLevel: 7
    },
    {
      id: 'final',
      title: '⚔️ ФИНАЛЬНЫЙ КВЕСТ: Победа над тьмой',
      description: 'Достигните уровня 10 и победите Повелителя Тьмы в его цитадели (клетка 9,9)',
      progress: 0,
      target: 1,
      reward: { exp: 1000, gold: 1000 },
      completed: false,
      unlocked: false,
      requiredLevel: 10,
      prerequisiteQuests: ['1', '2', '3', '4', '5', '6']
    }
  ]);

  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [inBattle, setInBattle] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; player: string; message: string; timestamp: number }>>([
    { id: '1', player: 'Система', message: 'Добро пожаловать в мир приключений!', timestamp: Date.now() },
    { id: '2', player: 'Система', message: 'Выполняйте квесты, сражайтесь с врагами и достигните 10 уровня, чтобы открыть финальный квест!', timestamp: Date.now() + 1000 }
  ]);

  // Unlock quests based on level
  useEffect(() => {
    setQuests(prev => prev.map(quest => {
      if (quest.unlocked) return quest;
      
      // Check level requirement
      if (quest.requiredLevel && character.level >= quest.requiredLevel) {
        // Check prerequisite quests
        if (quest.prerequisiteQuests) {
          const allPrereqsComplete = quest.prerequisiteQuests.every(prereqId => 
            prev.find(q => q.id === prereqId)?.completed
          );
          if (allPrereqsComplete) {
            if (quest.id === 'final') {
              addChatMessage('Система', '⚔️ ФИНАЛЬНЫЙ КВЕСТ РАЗБЛОКИРОВАН! Отправляйтесь к цитадели тьмы (клетка 9,9)!');
            } else {
              addChatMessage('Система', `Новый квест разблокирован: ${quest.title}`);
            }
            return { ...quest, unlocked: true };
          }
        } else {
          addChatMessage('Система', `Новый квест разблокирован: ${quest.title}`);
          return { ...quest, unlocked: true };
        }
      }
      return quest;
    }));
  }, [character.level]);

  // Update quest progress for level-based and gold-based quests
  useEffect(() => {
    setQuests(prev => prev.map(quest => {
      if (quest.completed || !quest.unlocked) return quest;
      
      if (quest.id === '5') {
        const newProgress = character.level;
        if (newProgress >= quest.target && !quest.completed) {
          gainExp(quest.reward.exp);
          setCharacter(prev => ({ ...prev, gold: prev.gold + quest.reward.gold }));
          addChatMessage('Система', `Квест завершен: ${quest.title}!`);
          return { ...quest, progress: newProgress, completed: true };
        }
        return { ...quest, progress: newProgress };
      }
      
      if (quest.id === '6') {
        const newProgress = character.gold;
        if (newProgress >= quest.target && !quest.completed) {
          gainExp(quest.reward.exp);
          setCharacter(prev => ({ ...prev, gold: prev.gold + quest.reward.gold }));
          addChatMessage('Система', `Квест завершен: ${quest.title}!`);
          return { ...quest, progress: newProgress, completed: true };
        }
        return { ...quest, progress: newProgress };
      }
      
      return quest;
    }));
  }, [character.level, character.gold]);

  const addChatMessage = (player: string, message: string) => {
    setChatMessages(prev => [...prev, { id: Date.now().toString(), player, message, timestamp: Date.now() }]);
  };

  const gainExp = (amount: number) => {
    setCharacter(prev => {
      let newExp = prev.exp + amount;
      let newLevel = prev.level;
      let expToLevel = prev.expToLevel;
      
      while (newExp >= expToLevel) {
        newExp -= expToLevel;
        newLevel += 1;
        expToLevel = Math.floor(expToLevel * 1.5);
        
        addChatMessage('Система', `Поздравляем! Вы достигли ${newLevel} уровня!`);
      }
      
      const hpIncrease = (newLevel - prev.level) * 20;
      const manaIncrease = (newLevel - prev.level) * 10;
      const strIncrease = (newLevel - prev.level) * 2;
      const intIncrease = (newLevel - prev.level) * 2;
      
      return {
        ...prev,
        level: newLevel,
        exp: newExp,
        expToLevel,
        maxHp: prev.maxHp + hpIncrease,
        hp: prev.maxHp + hpIncrease,
        maxMana: prev.maxMana + manaIncrease,
        mana: prev.maxMana + manaIncrease,
        strength: prev.strength + strIncrease,
        intelligence: prev.intelligence + intIncrease
      };
    });
  };

  const startBattle = (enemy: Enemy) => {
    setCurrentEnemy(enemy);
    setInBattle(true);
    addChatMessage('Система', `Вы вступили в бой с ${enemy.name}!`);
  };

  const endBattle = (victory: boolean) => {
    if (victory && currentEnemy) {
      gainExp(currentEnemy.expReward);
      setCharacter(prev => ({ ...prev, gold: prev.gold + currentEnemy.goldReward }));
      addChatMessage('Система', `Победа! Получено ${currentEnemy.expReward} опыта и ${currentEnemy.goldReward} золота`);
      
      // Check if final boss was defeated
      if (currentEnemy.type === 'finalBoss') {
        setQuests(prev => prev.map(quest => {
          if (quest.id === 'final') {
            gainExp(quest.reward.exp);
            setCharacter(prev => ({ ...prev, gold: prev.gold + quest.reward.gold }));
            addChatMessage('Система', '🎉 ФИНАЛЬНЫЙ КВЕСТ ЗАВЕРШЕН! ПОВЕЛИТЕЛЬ ТЬМЫ ПОВЕРЖЕН!');
            setGameStatus(prev => ({ ...prev, finalBossDefeated: true }));
            setShowVictory(true);
            return { ...quest, progress: 1, completed: true };
          }
          return quest;
        }));
      } else {
        // Update quests
        setQuests(prev => prev.map(quest => {
          if (!quest.completed) {
            // Goblin quest
            if (quest.id === '1' && currentEnemy.type === 'goblin') {
              const newProgress = quest.progress + 1;
              if (newProgress >= quest.target) {
                gainExp(quest.reward.exp);
                setCharacter(prev => ({ ...prev, gold: prev.gold + quest.reward.gold }));
                addChatMessage('Система', `Квест завершен: ${quest.title}!`);
                return { ...quest, progress: newProgress, completed: true };
              }
              return { ...quest, progress: newProgress };
            }
            // Wolf quest
            if (quest.id === '3' && currentEnemy.type === 'wolf') {
              const newProgress = quest.progress + 1;
              if (newProgress >= quest.target) {
                gainExp(quest.reward.exp);
                setCharacter(prev => ({ ...prev, gold: prev.gold + quest.reward.gold }));
                addChatMessage('Система', `Квест завершен: ${quest.title}!`);
                return { ...quest, progress: newProgress, completed: true };
              }
              return { ...quest, progress: newProgress };
            }
            // Orc quest
            if (quest.id === '4' && currentEnemy.type === 'orc') {
              const newProgress = quest.progress + 1;
              if (newProgress >= quest.target) {
                gainExp(quest.reward.exp);
                setCharacter(prev => ({ ...prev, gold: prev.gold + quest.reward.gold }));
                addChatMessage('Система', `Квест завершен: ${quest.title}!`);
                return { ...quest, progress: newProgress, completed: true };
              }
              return { ...quest, progress: newProgress };
            }
          }
          return quest;
        }));
      }
    } else {
      addChatMessage('Система', 'Вы были повержены...');
      setCharacter(prev => ({ ...prev, hp: Math.floor(prev.maxHp * 0.5) }));
    }
    
    setInBattle(false);
    setCurrentEnemy(null);
  };

  const useItem = (item: Item) => {
    if (item.effect === 'heal') {
      setCharacter(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + item.value) }));
      addChatMessage('Система', `Использовано ${item.name}. Восстановлено ${item.value} HP`);
    } else if (item.effect === 'mana') {
      setCharacter(prev => ({ ...prev, mana: Math.min(prev.maxMana, prev.mana + item.value) }));
      addChatMessage('Система', `Использовано ${item.name}. Восстановлено ${item.value} маны`);
    }
    
    setInventory(prev => {
      const index = prev.findIndex(i => i.id === item.id);
      if (index !== -1) {
        const newInventory = [...prev];
        newInventory.splice(index, 1);
        return newInventory;
      }
      return prev;
    });
  };

  const collectHerb = () => {
    const newHerb: Item = {
      id: Date.now().toString(),
      name: 'Лечебная трава',
      type: 'material',
      effect: 'heal',
      value: 15,
      icon: '🌿'
    };
    
    setInventory(prev => [...prev, newHerb]);
    addChatMessage('Система', 'Собрана лечебная трава!');
    
    setQuests(prev => prev.map(quest => {
      if (quest.id === '2' && !quest.completed) {
        const newProgress = quest.progress + 1;
        if (newProgress >= quest.target) {
          gainExp(quest.reward.exp);
          setCharacter(prev => ({ ...prev, gold: prev.gold + quest.reward.gold }));
          addChatMessage('Система', `Квест завершен: ${quest.title}!`);
          return { ...quest, progress: newProgress, completed: true };
        }
        return { ...quest, progress: newProgress };
      }
      return quest;
    }));
  };

  const handleNewGamePlus = () => {
    setGameStatus(prev => ({ ...prev, newGamePlus: true, difficultyMultiplier: 2 }));
    setShowVictory(false);
    addChatMessage('Система', '🔥 Новая Игра+ активирована! Враги теперь в 2 раза сильнее!');
    // Reset character position
    setCharacter(prev => ({ ...prev, position: { x: 5, y: 5 } }));
  };

  const handleContinue = () => {
    setShowVictory(false);
    addChatMessage('Система', 'Продолжайте свои приключения в мире Легенд Фэнтези!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-4">
        <header className="text-center mb-6">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Легенды Фэнтези {gameStatus.newGamePlus && '(Новая Игра+)'}
          </h1>
          <p className="text-purple-300">Многопользовательская ролевая игра</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Левая панель */}
          <div className="space-y-4">
            <CharacterPanel character={character} />
            <QuestPanel quests={quests} />
          </div>

          {/* Центральная панель */}
          <div className="space-y-4">
            <GameWorld 
              character={character} 
              setCharacter={setCharacter}
              startBattle={startBattle}
              collectHerb={collectHerb}
              inBattle={inBattle}
              gameStatus={gameStatus}
              finalQuestUnlocked={quests.find(q => q.id === 'final')?.unlocked || false}
            />
            {inBattle && currentEnemy && (
              <BattlePanel 
                character={character}
                setCharacter={setCharacter}
                enemy={currentEnemy}
                onBattleEnd={endBattle}
              />
            )}
          </div>

          {/* Правая панель */}
          <div className="space-y-4">
            <InventoryPanel inventory={inventory} onUseItem={useItem} />
            <ChatPanel messages={chatMessages} onSendMessage={addChatMessage} />
          </div>
        </div>
      </div>
      {showVictory && (
        <VictoryScreen 
          character={character}
          onNewGamePlus={handleNewGamePlus}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}