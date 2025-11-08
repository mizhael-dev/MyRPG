/**
 * TimelinePanel.tsx - Timeline Visualization
 *
 * ⏭️ PRE-BUILT COMPONENT - Just displays timelines
 *
 * Shows the 5 synchronized timebars you specified.
 * You don't need to understand this code deeply.
 */

import type { GameState } from '../../types/CombatTypes';

interface TimelinePanelProps {
  gameState: GameState;
}

export function TimelinePanel({ gameState }: TimelinePanelProps) {
  // Calculate progress for each timeline (0-100%)
  const pcProgress = gameState.pc.currentAction
    ? (gameState.pc.currentAction.elapsedTime / gameState.pc.currentAction.skill.phases.impact.tick) * 100
    : 0;

  const npcProgress = gameState.npc.currentAction
    ? (gameState.npc.currentAction.elapsedTime / gameState.npc.currentAction.skill.phases.impact.tick) * 100
    : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Combat Timelines</h2>

      {/* Timebar 1: PC Actual */}
      <div>
        <div className="text-sm text-gray-400 mb-2">Timebar_PC_actual</div>
        <div className="h-8 bg-gray-700 rounded overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-100"
            style={{ width: `${Math.min(pcProgress, 100)}%` }}
          />
        </div>
        {gameState.pc.currentAction && (
          <div className="text-xs text-gray-400 mt-1">
            {gameState.pc.currentAction.skill.name} - {gameState.pc.currentAction.currentPhase}
          </div>
        )}
      </div>

      {/* Timebar 2: PC seen by NPC */}
      <div>
        <div className="text-sm text-gray-400 mb-2">Timebar_PC_seen_by_NPC</div>
        <div className="h-8 bg-gray-700 rounded overflow-hidden">
          <div
            className="h-full bg-green-400 transition-all duration-100"
            style={{ width: `${Math.min(pcProgress, 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          (What opponent sees - includes telegraphs)
        </div>
      </div>

      {/* Timebar 3: NPC Actual */}
      <div>
        <div className="text-sm text-gray-400 mb-2">Timebar_NPC_actual</div>
        <div className="h-8 bg-gray-700 rounded overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-100"
            style={{ width: `${Math.min(npcProgress, 100)}%` }}
          />
        </div>
        {gameState.npc.currentAction && (
          <div className="text-xs text-gray-400 mt-1">
            {gameState.npc.currentAction.skill.name} - {gameState.npc.currentAction.currentPhase}
          </div>
        )}
      </div>

      {/* Timebar 4: NPC seen by PC */}
      <div>
        <div className="text-sm text-gray-400 mb-2">Timebar_NPC_seen_by_PC</div>
        <div className="h-8 bg-gray-700 rounded overflow-hidden">
          <div
            className="h-full bg-red-400 transition-all duration-100"
            style={{ width: `${Math.min(npcProgress, 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          (What you see - includes telegraphs)
        </div>
      </div>

      {/* Timebar 5: Combined */}
      <div>
        <div className="text-sm text-gray-400 mb-2">Timebar_Combined_actual</div>
        <div className="h-12 bg-gray-700 rounded relative overflow-hidden">
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
        <div className="text-xs text-gray-500 mt-1">
          (Both timelines overlaid - shows who acts first)
        </div>
      </div>
    </div>
  );
}
