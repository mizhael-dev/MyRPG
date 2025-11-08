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
  onExecuteSkillPC: (skillId: string) => void;
  onExecuteSkillNPC: (skillId: string) => void;
  onWait: () => void;
}

export function ActionPanel({ gameState, onExecuteSkillPC, onExecuteSkillNPC, onWait }: ActionPanelProps) {
  const canActPC = !gameState.pc.currentAction;
  const canActNPC = !gameState.npc.currentAction;

  // Helper function to render skill button with dynamic timings
  const renderSkillButton = (skillId: string, icon: string, onClick: () => void, canAct: boolean, colorClass: string) => {
    const skill = gameState.loadedSkills.get(skillId);
    if (!skill) return null;

    const phases = skill.phases;
    let timingText = '';
    let impactText = '';

    if (skill.type === 'attack') {
      // Calculate cumulative times from durations
      const windUpEnd = phases.windUp.duration;
      const committedEnd = windUpEnd + phases.committed.duration;
      const impactEnd = committedEnd + phases.impact.duration;
      const recoveryEnd = impactEnd + phases.recovery.duration;

      impactText = `Impact: ${committedEnd}-${impactEnd}ms`;
      timingText = `Wind: 0-${windUpEnd} · Commit: ${windUpEnd}-${committedEnd} · Impact: ${committedEnd}-${impactEnd} · Recov: ${impactEnd}-${recoveryEnd}`;
    } else if (skill.type === 'defense' && skillId === 'parry') {
      // Parry has readinessWindow instead of standard phases
      const windUpEnd = phases.windUp.duration;
      // @ts-ignore - readinessWindow is not in standard PhaseTimings type
      const readinessStart = phases.readinessWindow?.startTick || 500;
      // @ts-ignore
      const readinessDuration = phases.readinessWindow?.baseDuration || 400;
      const readinessEnd = readinessStart + readinessDuration;
      const recoveryEnd = readinessEnd + phases.recovery.duration;

      impactText = `Active: ${readinessStart}-${readinessEnd}ms`;
      timingText = `Wind: 0-${windUpEnd} · Active: ${readinessStart}-${readinessEnd} · Recov: ${readinessEnd}-${recoveryEnd}`;
    }

    return (
      <button
        onClick={onClick}
        disabled={!canAct}
        className={`w-full px-2 py-2 rounded text-sm transition-all ${
          canAct
            ? `${colorClass} cursor-pointer`
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="font-semibold">{skill.name}</span>
          <span className="ml-auto opacity-75">{impactText}</span>
        </div>
        <div className="text-xs opacity-60 mt-0.5 font-mono">
          {timingText}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-gray-800 rounded p-4 sticky top-4 space-y-4">
      {/* PC Actions Section */}
      <div>
        <h3 className="text-sm font-bold mb-2 text-green-400">PC Actions</h3>

        <div className="space-y-1">
          {renderSkillButton('slash', '⚔️', () => onExecuteSkillPC('slash'), canActPC, 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('thrust', '🗡️', () => onExecuteSkillPC('thrust'), canActPC, 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('parry', '🛡️', () => onExecuteSkillPC('parry'), canActPC, 'bg-green-600 hover:bg-green-700')}

          {/* Wait Button */}
          <button
            onClick={onWait}
            className="w-full px-2 py-2 rounded text-sm transition-all flex items-center gap-2 bg-gray-600 hover:bg-gray-700 cursor-pointer mt-2"
          >
            <span className="text-base">⏸️</span>
            <span className="font-semibold">Wait</span>
          </button>
        </div>

        {!canActPC && gameState.pc.currentAction && (
          <div className="mt-2 p-1 bg-yellow-900/30 rounded text-yellow-400 text-xs">
            ⏳ {gameState.pc.currentAction.skill.name}
          </div>
        )}

        {/* Telegraph Trigger Times */}
        {gameState.npc.currentAction && gameState.npc.currentAction.skill.telegraphs && (
          <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-900/50">
            <div className="text-sm font-bold text-red-400 mb-2">NPC Telegraph Stages:</div>
            <div className="space-y-1 text-xs">
              {gameState.npc.currentAction.skill.telegraphs.map((t, i) => (
                <div
                  key={i}
                  className={`p-1.5 rounded ${
                    gameState.npc.currentAction!.visibleTelegraphs.some(vt => vt.stage === t.stage)
                      ? 'bg-red-900/40 text-red-200 font-bold border border-red-600'
                      : 'bg-gray-800/50 text-gray-400'
                  }`}
                >
                  <div className="flex justify-between mb-0.5">
                    <span className="font-semibold">Stage {t.stage}</span>
                    <span className="font-mono">{t.triggerTime}ms</span>
                  </div>
                  <div className="text-xs opacity-75">{t.bodyPart} · {t.visibilityPercent}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* NPC Actions Section */}
      <div>
        <h3 className="text-sm font-bold mb-2 text-red-400">NPC Actions</h3>

        <div className="space-y-1">
          {renderSkillButton('slash', '⚔️', () => onExecuteSkillNPC('slash'), canActNPC, 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('thrust', '🗡️', () => onExecuteSkillNPC('thrust'), canActNPC, 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('parry', '🛡️', () => onExecuteSkillNPC('parry'), canActNPC, 'bg-green-600 hover:bg-green-700')}

          {/* Wait Button */}
          <button
            onClick={onWait}
            className="w-full px-2 py-2 rounded text-sm transition-all flex items-center gap-2 bg-gray-600 hover:bg-gray-700 cursor-pointer mt-2"
          >
            <span className="text-base">⏸️</span>
            <span className="font-semibold">Wait</span>
          </button>
        </div>

        {!canActNPC && gameState.npc.currentAction && (
          <div className="mt-2 p-1 bg-yellow-900/30 rounded text-yellow-400 text-xs">
            ⏳ {gameState.npc.currentAction.skill.name}
          </div>
        )}

        {/* Telegraph Trigger Times */}
        {gameState.pc.currentAction && gameState.pc.currentAction.skill.telegraphs && (
          <div className="mt-3 p-2 bg-green-900/20 rounded border border-green-900/50">
            <div className="text-sm font-bold text-green-400 mb-2">PC Telegraph Stages:</div>
            <div className="space-y-1 text-xs">
              {gameState.pc.currentAction.skill.telegraphs.map((t, i) => (
                <div
                  key={i}
                  className={`p-1.5 rounded ${
                    gameState.pc.currentAction!.visibleTelegraphs.some(vt => vt.stage === t.stage)
                      ? 'bg-green-900/40 text-green-200 font-bold border border-green-600'
                      : 'bg-gray-800/50 text-gray-400'
                  }`}
                >
                  <div className="flex justify-between mb-0.5">
                    <span className="font-semibold">Stage {t.stage}</span>
                    <span className="font-mono">{t.triggerTime}ms</span>
                  </div>
                  <div className="text-xs opacity-75">{t.bodyPart} · {t.visibilityPercent}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global Pause State */}
      {gameState.pauseState.isPaused && (
        <div className="p-2 bg-blue-900/30 rounded text-blue-400 text-xs">
          ⏸ Paused
        </div>
      )}
    </div>
  );
}
