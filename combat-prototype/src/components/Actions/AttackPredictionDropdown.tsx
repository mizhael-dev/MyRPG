import { createPortal } from 'react-dom';
import type { CombatSkill } from '../../types/CombatTypes';

interface AttackPredictionDropdownProps {
  isOpen: boolean;
  availableAttacks: CombatSkill[];
  onSelectAttack: (skillId: string) => void;
  onCancel: () => void;
  likelyAttacks?: string[]; // Highlighted based on telegraphs
}

export function AttackPredictionDropdown({
  isOpen,
  availableAttacks,
  onSelectAttack,
  onCancel,
  likelyAttacks = []
}: AttackPredictionDropdownProps) {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={onCancel}>
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-4">Predict Attack</h2>

        <div className="space-y-2 mb-4">
          {availableAttacks.map((attack) => {
            const isLikely = likelyAttacks.includes(attack.id);
            return (
              <button
                key={attack.id}
                onClick={() => onSelectAttack(attack.id)}
                className={`w-full p-3 rounded text-left transition-colors ${
                  isLikely
                    ? 'bg-orange-600 hover:bg-orange-700 border-2 border-yellow-400'
                    : 'bg-gray-700 hover:bg-gray-600'
                } text-white`}
              >
                <span className="font-bold">{attack.name}</span>
                {isLikely && <span className="ml-2 text-yellow-400">⭐ Likely</span>}
                <div className="text-sm text-gray-300">
                  Line: {attack.line} • Impact: {attack.phases.impact.tick}ms
                </div>
              </button>
            );
          })}
        </div>

        <button onClick={onCancel} className="w-full p-2 bg-gray-600 hover:bg-gray-500 rounded text-white">
          Cancel
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
