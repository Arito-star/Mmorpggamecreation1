import { Package } from 'lucide-react';
import type { Item } from '../types/game';

interface InventoryPanelProps {
  inventory: Item[];
  onUseItem: (item: Item) => void;
}

export function InventoryPanel({ inventory, onUseItem }: InventoryPanelProps) {
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-purple-400" />
        <h2 className="text-white">Инвентарь</h2>
        <span className="text-purple-300">({inventory.length})</span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {inventory.length === 0 ? (
          <p className="text-purple-300 text-center py-8">Инвентарь пуст</p>
        ) : (
          inventory.map((item) => (
            <div
              key={item.id}
              className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="text-white">{item.name}</h3>
                  <p className="text-purple-300">
                    {item.type === 'potion' && `+${item.value} ${item.effect === 'heal' ? 'HP' : 'Мана'}`}
                    {item.type === 'material' && 'Материал'}
                  </p>
                </div>
              </div>
              {item.type === 'potion' && (
                <button
                  onClick={() => onUseItem(item)}
                  className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded transition-colors"
                >
                  Использовать
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
