/**
 * TimelinePanel.tsx - Timeline Visualization
 *
 * ⏭️ PRE-BUILT COMPONENT - Just displays timelines
 *
 * Shows the 5 synchronized timebars you specified.
 * You don't need to understand this code deeply.
 */

import type { GameState } from '../../types/CombatTypes';
import type { ViewMode } from '../ViewModeSelector';

interface TimelinePanelProps {
  gameState: GameState;
  viewMode: ViewMode;
}

export function TimelinePanel({ gameState, viewMode }: TimelinePanelProps) {
  // Calculate progress for each timeline (0-100%)
  // For attacks: use impact.tick, for defenses: use windUp + active + recovery
  const calculateTotalDuration = (action: typeof gameState.pc.currentAction) => {
    if (!action) return 1; // Avoid division by zero
    const skill = action.skill;
    if (skill.type === 'defense') {
      // Defense: windUp + active + recovery
      const windUp = skill.phases.windUp.duration;
      const active = skill.phases.active?.duration || 0;
      const recovery = skill.phases.recovery.duration;
      return windUp + active + recovery;
    } else {
      // Attack: use impact tick
      return skill.phases.impact.tick;
    }
  };

  const pcProgress = gameState.pc.currentAction
    ? (gameState.pc.currentAction.elapsedTime / calculateTotalDuration(gameState.pc.currentAction)) * 100
    : 0;

  const npcProgress = gameState.npc.currentAction
    ? (gameState.npc.currentAction.elapsedTime / calculateTotalDuration(gameState.npc.currentAction)) * 100
    : 0;

  return (
    <div className="bg-gray-800 rounded px-4 py-2 space-y-2">
      <h3 className="text-lg font-bold mb-1">
        Combat Timelines
        {viewMode !== 'debug' && (
          <span className="text-xs text-gray-500 ml-2">
            ({viewMode === 'pc' ? 'PC' : 'NPC'} perspective)
          </span>
        )}
      </h3>

      {/* Timebar 1: PC Actual - show in debug and PC modes */}
      {(viewMode === 'debug' || viewMode === 'pc') && (
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400 w-32 flex-shrink-0">PC_actual</div>
          <div className="flex-1 h-5 bg-gray-700 rounded overflow-hidden relative">
            <div
              className="h-full bg-green-500 transition-all duration-100"
              style={{ width: `${Math.min(pcProgress, 100)}%` }}
            />
            {gameState.pc.currentAction && (
              <div className="absolute inset-0 flex items-center pl-2 text-xs text-white font-semibold pointer-events-none">
                {gameState.pc.currentAction.skill.name}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timebar 2: PC seen by NPC - show in debug and NPC modes */}
      {(viewMode === 'debug' || viewMode === 'npc') && (
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400 w-32 flex-shrink-0">PC_seen_by_NPC</div>
          <div className="flex-1 h-5 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-green-400 transition-all duration-100"
              style={{ width: `${Math.min(pcProgress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Timebar 3: NPC Actual - show in debug and NPC modes */}
      {(viewMode === 'debug' || viewMode === 'npc') && (
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400 w-32 flex-shrink-0">NPC_actual</div>
          <div className="flex-1 h-5 bg-gray-700 rounded overflow-hidden relative">
            <div
              className="h-full bg-red-500 transition-all duration-100"
              style={{ width: `${Math.min(npcProgress, 100)}%` }}
            />
            {gameState.npc.currentAction && (
              <div className="absolute inset-0 flex items-center pl-2 text-xs text-white font-semibold pointer-events-none">
                {gameState.npc.currentAction.skill.name}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timebar 4: NPC seen by PC - show in debug and PC modes */}
      {(viewMode === 'debug' || viewMode === 'pc') && (
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400 w-32 flex-shrink-0">NPC_seen_by_PC</div>
          <div className="flex-1 h-5 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-red-400 transition-all duration-100"
              style={{ width: `${Math.min(npcProgress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Timebar 5: Combined - show in all modes */}
      <div className="flex items-center gap-3">
        <div className="text-xs text-gray-400 w-32 flex-shrink-0">Combined</div>
        <div className="flex-1 h-6 bg-gray-700 rounded relative overflow-hidden">
          {/* PC bar (green) */}
          <div
            className="absolute top-0 left-0 h-1/2 bg-green-500/50 transition-all duration-100"
            style={{ width: `${Math.min(pcProgress, 100)}%` }}
          />
          {/* NPC bar (red) */}
          <div
            className="absolute bottom-0 left-0 h-1/2 bg-red-500/50 transition-all duration-100"
            style={{ width: `${Math.min(npcProgress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
