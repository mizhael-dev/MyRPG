/**
 * ActionPanel.tsx - Player Action Buttons
 *
 * ⏭️ PRE-BUILT COMPONENT - Just shows action buttons
 *
 * Displays buttons for combat skills the player can use.
 */

import type { GameState } from '../../types/CombatTypes';

interface ActionPanelProps {
  gameState: GameState;
  onExecuteSkill: (skillId: string) => void;
}

export function ActionPanel({ gameState, onExecuteSkill }: ActionPanelProps) {
  const canAct = !gameState.pc.currentAction && !gameState.pauseState.isPaused;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Your Actions</h2>

      <div className="grid grid-cols-3 gap-4">
        {/* Slash Attack */}
        <button
          onClick={() => onExecuteSkill('slash')}
          disabled={!canAct}
          className={`p-6 rounded-lg font-semibold text-lg transition-all ${
            canAct
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <div className="text-2xl mb-2">⚔️</div>
          <div>Slash</div>
          <div className="text-xs mt-2 opacity-75">2000ms | 2 stamina</div>
        </button>

        {/* Thrust Attack */}
        <button
          onClick={() => onExecuteSkill('thrust')}
          disabled={!canAct}
          className={`p-6 rounded-lg font-semibold text-lg transition-all ${
            canAct
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <div className="text-2xl mb-2">🗡️</div>
          <div>Thrust</div>
          <div className="text-xs mt-2 opacity-75">1500ms | 2 stamina</div>
        </button>

        {/* Parry Defense */}
        <button
          onClick={() => onExecuteSkill('parry')}
          disabled={!canAct}
          className={`p-6 rounded-lg font-semibold text-lg transition-all ${
            canAct
              ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <div className="text-2xl mb-2">🛡️</div>
          <div>Parry</div>
          <div className="text-xs mt-2 opacity-75">500ms cast | Defense</div>
        </button>
      </div>

      {!canAct && gameState.pc.currentAction && (
        <div className="mt-4 p-3 bg-yellow-900/30 rounded text-yellow-400 text-sm">
          ⏳ Already executing: {gameState.pc.currentAction.skill.name}
        </div>
      )}

      {gameState.pauseState.isPaused && (
        <div className="mt-4 p-3 bg-blue-900/30 rounded text-blue-400 text-sm">
          ⏸ Combat is paused. Click "Resume" to continue.
        </div>
      )}
    </div>
  );
}
