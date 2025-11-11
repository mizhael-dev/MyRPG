/**
 * ActionPanel.tsx - Player Action Buttons
 *
 * ⏭️ PRE-BUILT COMPONENT - Just shows action buttons
 *
 * Displays buttons for combat skills the player can use.
 */

import type { GameState } from '../../types/CombatTypes';
import type { ViewMode } from '../ViewModeSelector';

interface ActionPanelProps {
  gameState: GameState;
  fighter: 'pc' | 'npc';
  viewMode: ViewMode;
  onExecuteSkill: (skillId: string) => void;
  onWait: () => void;
}

export function ActionPanel({ gameState, fighter, viewMode, onExecuteSkill, onWait }: ActionPanelProps) {
  const currentFighter = gameState[fighter];
  const opponent = fighter === 'pc' ? gameState.npc : gameState.pc;
  const canAct = !currentFighter.currentAction;
  const fighterColor = fighter === 'pc' ? 'green' : 'red';
  const fighterLabel = fighter === 'pc' ? 'PC' : 'NPC';

  // Helper function to render skill button with dynamic timings
  const renderSkillButton = (skillId: string, icon: string, colorClass: string) => {
    const skill = gameState.loadedSkills.get(skillId);
    if (!skill) return null;

    const phases = skill.phases;
    let timingText = '';
    let impactText = '';

    if (skill.type === 'attack') {
      // Calculate phase boundaries using tick for impact
      const windUpEnd = phases.windUp.duration;
      const impactTick = phases.impact.tick;
      const recoveryEnd = impactTick + phases.recovery.duration;

      impactText = `Impact: ${impactTick}ms`;
      timingText = `Wind: 0-${windUpEnd} · Commit: ${windUpEnd}-${impactTick} · Recov: ${impactTick}-${recoveryEnd}`;
    } else if (skill.type === 'defense') {
      // Defense phase flow: windUp → active → recovery
      const windUpEnd = phases.windUp.duration;
      const activeStart = windUpEnd;
      const activeDuration = phases.active?.duration || 0;
      const activeEnd = activeStart + activeDuration;
      const recoveryEnd = activeEnd + phases.recovery.duration;

      impactText = `Active: ${activeStart}-${activeEnd}ms`;
      timingText = `Wind: 0-${windUpEnd} · Active: ${activeStart}-${activeEnd} · Recov: ${activeEnd}-${recoveryEnd}`;
    }

    return (
      <button
        onClick={() => onExecuteSkill(skillId)}
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

  const opponentLabel = fighter === 'pc' ? 'NPC' : 'PC';

  return (
    <div className="bg-gray-800 rounded p-4 sticky top-4 space-y-4">
      {/* Actions Section */}
      <div>
        <h3 className={`text-sm font-bold mb-2 ${fighter === 'pc' ? 'text-green-400' : 'text-red-400'}`}>{fighterLabel} Actions</h3>

        <div className="space-y-1">
          {/* Wait Button - Top position for easy access */}
          <button
            onClick={onWait}
            className="w-full px-2 py-2 rounded text-sm transition-all flex items-center gap-2 bg-gray-600 hover:bg-gray-700 cursor-pointer mb-2"
          >
            <span className="text-base">⏸️</span>
            <span className="font-semibold">Wait</span>
          </button>

          {renderSkillButton('side_slash', '➡️', 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('thrust', '🗡️', 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('overhead_strike', '⬇️', 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('upward_strike', '⬆️', 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('diagonal_slash', '↘️', 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('parry', '🛡️', 'bg-green-600 hover:bg-green-700')}
          {renderSkillButton('emergency_defense', '🚨', 'bg-yellow-600 hover:bg-yellow-700')}
          {renderSkillButton('retreat', '↩️', 'bg-purple-600 hover:bg-purple-700')}
          {renderSkillButton('deflection', '⚔️', 'bg-orange-600 hover:bg-orange-700')}
        </div>

        {!canAct && currentFighter.currentAction && (
          <div className="mt-2 p-1 bg-yellow-900/30 rounded text-yellow-400 text-xs">
            ⏳ {currentFighter.currentAction.skill.name}
          </div>
        )}

        {/* Opponent Telegraph Trigger Times */}
        {opponent.currentAction && opponent.currentAction.skill.telegraphs && (
          <div className={`mt-3 p-2 rounded border ${
            fighter === 'pc'
              ? 'bg-red-900/20 border-red-900/50'
              : 'bg-green-900/20 border-green-900/50'
          }`}>
            <div className={`text-sm font-bold mb-2 ${
              fighter === 'pc' ? 'text-red-400' : 'text-green-400'
            }`}>{opponentLabel} Telegraph Stages:</div>
            <div className="space-y-1 text-xs">
              {opponent.currentAction.skill.telegraphs.map((t, i) => (
                <div
                  key={i}
                  className={`p-1.5 rounded ${
                    opponent.currentAction!.visibleTelegraphs.some(vt => vt.stage === t.stage)
                      ? fighter === 'pc'
                        ? 'bg-red-900/40 text-red-200 font-bold border border-red-600'
                        : 'bg-green-900/40 text-green-200 font-bold border border-green-600'
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
