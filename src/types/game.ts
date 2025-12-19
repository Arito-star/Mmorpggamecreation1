export interface Character {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  exp: number;
  expToLevel: number;
  strength: number;
  intelligence: number;
  gold: number;
  position: { x: number; y: number };
}

export interface Enemy {
  id: string;
  name: string;
  type: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  expReward: number;
  goldReward: number;
  icon: string;
}

export interface Item {
  id: string;
  name: string;
  type: 'potion' | 'equipment' | 'material';
  effect: string;
  value: number;
  icon: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: {
    exp: number;
    gold: number;
  };
  completed: boolean;
  unlocked: boolean;
  requiredLevel?: number;
  prerequisiteQuests?: string[];
}

export interface GameStatus {
  finalBossDefeated: boolean;
  newGamePlus: boolean;
  difficultyMultiplier: number;
}