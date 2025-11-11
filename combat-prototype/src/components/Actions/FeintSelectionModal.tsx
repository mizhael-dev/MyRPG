import { createPortal } from 'react-dom';
import type { CombatSkill } from '../../types/CombatTypes';

interface FeintSelectionModalProps {
  isOpen: boolean;
  availableAttacks: CombatSkill[];
  currentAttackLine: string | undefined;
  onSelectAttack: (skillId: string) => void;
  onCancel: () => void;
}

export function FeintSelectionModal({
  isOpen,
  availableAttacks,
  currentAttackLine,
  onSelectAttack,
  onCancel
}: FeintSelectionModalProps) {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={onCancel}>
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-4">Feint Attack</h2>
        <p className="text-sm text-gray-300 mb-4">
          Choose a new attack on a different line. Cost: 1.4× stamina + 3 focus + 100ms delay
        </p>

        <div className="space-y-2 mb-4">
          {availableAttacks.map((attack) => {
            const isDifferentLine = attack.line !== currentAttackLine;
            const isSameLine = attack.line === currentAttackLine;

            return (
              <button
                key={attack.id}
                onClick={() => isDifferentLine ? onSelectAttack(attack.id) : null}
                disabled={isSameLine}
                className={`w-full p-3 rounded text-left transition-colors ${
                  isDifferentLine
                    ? 'bg-pink-600 hover:bg-pink-700 border-2 border-pink-400 cursor-pointer'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                } text-white`}
              >
                <span className="font-bold">{attack.name}</span>
                {isSameLine && <span className="ml-2 text-gray-400">(Same Line)</span>}
                {isDifferentLine && <span className="ml-2 text-pink-300">✓ Valid</span>}
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
