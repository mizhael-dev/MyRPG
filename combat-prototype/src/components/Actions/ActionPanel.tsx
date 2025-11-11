/**
 * ActionPanel.tsx - Player Action Buttons
 *
 * ⏭️ PRE-BUILT COMPONENT - Just shows action buttons
 *
 * Displays buttons for combat skills the player can use.
 */

import { useState } from 'react';
import type { GameState, CombatSkill } from '../../types/CombatTypes';
import type { ViewMode } from '../ViewModeSelector';
import { LineSelectionModal } from './LineSelectionModal';
import { AttackPredictionDropdown } from './AttackPredictionDropdown';
import { FeintSelectionModal } from './FeintSelectionModal';

interface ActionPanelProps {
  gameState: GameState;
  fighter: 'pc' | 'npc';
  viewMode: ViewMode;
  onExecuteSkill: (skillId: string) => void;
  onExecuteSkillWithPredictions: (
    skillId: string,
    predictions: {
      linePrediction?: 'high' | 'horizontal' | 'center' | 'low' | 'diagonal';
      attackPrediction?: string;
    }
  ) => void;
  onExecuteFeint: (newAttackId: string) => void;
  onWait: () => void;
}

export function ActionPanel({ gameState, fighter, onExecuteSkill, onExecuteSkillWithPredictions, onExecuteFeint, onWait }: ActionPanelProps) {
  const currentFighter = gameState[fighter];
  const canAct = !currentFighter.currentAction;
  const fighterLabel = fighter === 'pc' ? 'PC' : 'NPC';

  // UI state for modals
  const [showLineSelection, setShowLineSelection] = useState(false);
  const [showAttackPrediction, setShowAttackPrediction] = useState(false);
  const [showFeintSelection, setShowFeintSelection] = useState(false);

  // UI state for hover tooltips
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showFeintTooltip, setShowFeintTooltip] = useState(false);
  const [feintTooltipPosition, setFeintTooltipPosition] = useState({ x: 0, y: 0 });

  // Helper to get opponent's attacks
  const getOpponentAttacks = (): CombatSkill[] => {
    const opponent = fighter === 'pc' ? gameState.npc : gameState.pc;
    return opponent.availableSkills
      .map(id => gameState.loadedSkills.get(id))
      .filter((skill): skill is CombatSkill => skill?.type === 'attack');
  };

  // Helper to determine likely predictions (placeholder for now)
  const getLikelyLines = (): string[] => {
    // TODO: Analyze opponent's visible telegraphs to determine likely lines
    // For now, return empty array (show all equally)
    return [];
  };

  const getLikelyAttacks = (): string[] => {
    // TODO: Analyze opponent's visible telegraphs to determine likely attacks
    // For now, return empty array (show all equally)
    return [];
  };

  // Helper to check if feint is available
  const canFeint = currentFighter.currentAction?.canFeint &&
                   gameState.pauseState.isPaused &&
                   gameState.pauseState.reason === 'new_telegraph';

  // Helper function to convert ms to seconds with 1 decimal place
  const msToSeconds = (ms: number): string => {
    return (ms / 1000).toFixed(1);
  };

  // Helper function to render skill button with dynamic timings
  const renderSkillButton = (skillId: string, icon: string, colorClass: string, onClick?: () => void) => {
    const skill = gameState.loadedSkills.get(skillId);
    if (!skill) return null;

    const phases = skill.phases;
    const staminaCost = skill.costs.stamina.base;

    // Calculate timing info for display
    let timingDisplay = '';
    let tooltipData: { label: string; value: string; color: string }[] = [];

    if (skill.type === 'attack') {
      // Attack: Show "Attack time: {impactTick}s"
      const impactTick = phases.impact.tick;
      timingDisplay = `Attack time: ${msToSeconds(impactTick)}s`;

      // Tooltip data
      const windUpDuration = phases.windUp.duration;
      const committedDuration = phases.committed.duration;
      const recoveryDuration = phases.recovery.duration;

      tooltipData = [
        { label: 'Wind up:', value: `${msToSeconds(windUpDuration)}s`, color: '#84db90' },
        { label: 'Committed:', value: `${msToSeconds(committedDuration)}s`, color: '#ffc824' },
        { label: 'Impact:', value: `at ${msToSeconds(impactTick)}s`, color: '#d9d9d9' },
        { label: 'Recovery:', value: `${msToSeconds(recoveryDuration)}s`, color: '#db5a5a' },
      ];
    } else if (skill.type === 'defense') {
      // Defense: Show "Defense window: {activeStart}s-{activeEnd}s"
      const windUpEnd = phases.windUp.duration;
      const activeStart = windUpEnd;
      const activeDuration = phases.active?.duration || 0;
      const activeEnd = activeStart + activeDuration;

      timingDisplay = `Defense window: ${msToSeconds(activeStart)}s-${msToSeconds(activeEnd)}s`;

      // Tooltip data
      const windUpDuration = phases.windUp.duration;
      const recoveryDuration = phases.recovery.duration;

      tooltipData = [
        { label: 'Wind up:', value: `${msToSeconds(windUpDuration)}s`, color: '#84db90' },
        { label: 'Active:', value: `${msToSeconds(activeDuration)}s`, color: '#ffc824' },
        { label: 'Recovery:', value: `${msToSeconds(recoveryDuration)}s`, color: '#db5a5a' },
      ];
    }

    const handleMouseEnter = (e: React.MouseEvent) => {
      setHoveredSkill(skillId);
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (hoveredSkill === skillId) {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseLeave = () => {
      setHoveredSkill(null);
    };

    return (
      <>
        <button
          onClick={onClick || (() => onExecuteSkill(skillId))}
          disabled={!canAct}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`w-full px-3 py-1 rounded transition-all relative flex items-center gap-3 ${
            canAct
              ? `${colorClass} cursor-pointer`
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {/* Icon - 2x bigger, left-aligned, vertically centered */}
          <div className="flex-shrink-0">
            <span className="text-3xl">{icon}</span>
          </div>

          {/* Skill name and info container - aligned to left */}
          <div className="flex flex-col items-start flex-1">
            <div className="font-bold text-base leading-tight text-left">{skill.name}</div>
            <div className="text-xs text-white/90 mt-0.5 text-left">
              {timingDisplay}
            </div>
            <div className="text-xs text-white/80 text-left">
              Stamina Cost: {staminaCost}
            </div>
          </div>
        </button>

        {/* Tooltip */}
        {hoveredSkill === skillId && canAct && (
          <div
            className="fixed pointer-events-none z-[10000] bg-gray-900/95 rounded-lg border border-gray-700 px-3 py-2 shadow-lg"
            style={{
              left: `${tooltipPosition.x + 15}px`,
              top: `${tooltipPosition.y + 15}px`,
            }}
          >
            {tooltipData.map((item, index) => (
              <div key={index} className="text-sm whitespace-nowrap mb-1 last:mb-0">
                <span style={{ color: item.color }} className="font-semibold">
                  {item.label}
                </span>{' '}
                <span className="text-white">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-gray-800 rounded p-4 sticky top-4 space-y-4">
      {/* Actions Section */}
      <div>
        <h3 className={`text-sm font-bold mb-2 ${fighter === 'pc' ? 'text-green-400' : 'text-red-400'}`}>{fighterLabel} Actions</h3>

        <div className="space-y-1">
          {/* Wait Button - Only active when opponent action triggers pause */}
          <button
            onClick={onWait}
            disabled={!gameState.pauseState.isPaused || gameState.pauseState.reason !== 'new_telegraph'}
            className={`w-full px-3 py-1 rounded transition-all relative flex items-center gap-3 ${
              gameState.pauseState.isPaused && gameState.pauseState.reason === 'new_telegraph'
                ? 'bg-gray-600 hover:bg-gray-700 cursor-pointer'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {/* Icon - 2x bigger, left-aligned, vertically centered */}
            <div className="flex-shrink-0">
              <span className="text-3xl">⏸️</span>
            </div>

            {/* Skill name and info container - aligned to left */}
            <div className="flex flex-col items-start flex-1">
              <div className="font-bold text-base leading-tight text-left">Wait</div>
              <div className="text-xs text-white/90 mt-0.5 text-left">
                Pass your turn
              </div>
            </div>
          </button>

          {renderSkillButton('emergency_defense', '🚨', 'bg-yellow-600 hover:bg-yellow-700')}

          {/* Feint Button - Only active during windUp when opponent pauses */}
          <button
            onClick={() => setShowFeintSelection(true)}
            disabled={!canFeint}
            onMouseEnter={(e) => {
              setShowFeintTooltip(true);
              setFeintTooltipPosition({ x: e.clientX, y: e.clientY });
            }}
            onMouseMove={(e) => {
              if (showFeintTooltip) {
                setFeintTooltipPosition({ x: e.clientX, y: e.clientY });
              }
            }}
            onMouseLeave={() => setShowFeintTooltip(false)}
            className={`w-full px-3 py-1 rounded transition-all relative flex items-center gap-3 ${
              canFeint
                ? 'bg-pink-600 hover:bg-pink-700 cursor-pointer'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {/* Icon - 2x bigger, left-aligned, vertically centered */}
            <div className="flex-shrink-0">
              <span className="text-3xl">⚡</span>
            </div>

            {/* Skill name and info container - aligned to left */}
            <div className="flex flex-col items-start flex-1">
              <div className="font-bold text-base leading-tight text-left">Feint</div>
              <div className="text-xs text-white/90 mt-0.5 text-left">
                Change attack line
              </div>
              <div className="text-xs text-white/80 text-left">
                Cost: 1.4× stamina + 3 focus
              </div>
            </div>
          </button>

          {/* Feint Tooltip */}
          {showFeintTooltip && canFeint && (
            <div
              className="fixed pointer-events-none z-[10000] bg-gray-900/95 rounded-lg border border-gray-700 px-3 py-2 shadow-lg"
              style={{
                left: `${feintTooltipPosition.x + 15}px`,
                top: `${feintTooltipPosition.y + 15}px`,
              }}
            >
              <div className="text-sm whitespace-nowrap mb-1">
                <span style={{ color: '#ffc824' }} className="font-semibold">
                  Adjustment time:
                </span>{' '}
                <span className="text-white">0.1s</span>
              </div>
              <div className="text-sm whitespace-nowrap">
                <span style={{ color: '#db5a5a' }} className="font-semibold">
                  Time penalty:
                </span>{' '}
                <span className="text-white">+0.1s</span>
              </div>
            </div>
          )}

          {renderSkillButton('side_slash', '➡️', 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('thrust', '🗡️', 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('overhead_strike', '⬇️', 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('upward_strike', '⬆️', 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('diagonal_slash', '↘️', 'bg-blue-600 hover:bg-blue-700')}
          {renderSkillButton('parry', '🛡️', 'bg-green-600 hover:bg-green-700', () => setShowLineSelection(true))}
          {renderSkillButton('retreat', '↩️', 'bg-purple-600 hover:bg-purple-700')}
          {renderSkillButton('deflection', '⚔️', 'bg-orange-600 hover:bg-orange-700', () => setShowAttackPrediction(true))}
        </div>

        {!canAct && currentFighter.currentAction && (
          <div className="mt-2 p-1 bg-yellow-900/30 rounded text-yellow-400 text-xs">
            ⏳ {currentFighter.currentAction.skill.name}
          </div>
        )}
      </div>

      {/* Global Pause State */}
      {gameState.pauseState.isPaused && (
        <div className="p-2 bg-blue-900/30 rounded text-blue-400 text-xs">
          ⏸ Paused
        </div>
      )}

      {/* Line Selection Modal for Parry */}
      {showLineSelection && (
        <LineSelectionModal
          isOpen={showLineSelection}
          likelyLines={getLikelyLines()}
          onSelectLine={(line) => {
            onExecuteSkillWithPredictions('parry', { linePrediction: line });
            setShowLineSelection(false);
          }}
          onCancel={() => setShowLineSelection(false)}
        />
      )}

      {/* Attack Prediction Dropdown for Deflection */}
      {showAttackPrediction && (
        <AttackPredictionDropdown
          isOpen={showAttackPrediction}
          availableAttacks={getOpponentAttacks()}
          likelyAttacks={getLikelyAttacks()}
          onSelectAttack={(attackId) => {
            onExecuteSkillWithPredictions('deflection', { attackPrediction: attackId });
            setShowAttackPrediction(false);
          }}
          onCancel={() => setShowAttackPrediction(false)}
        />
      )}

      {/* Feint Selection Modal */}
      {showFeintSelection && (
        <FeintSelectionModal
          isOpen={showFeintSelection}
          availableAttacks={currentFighter.availableSkills
            .map(id => gameState.loadedSkills.get(id))
            .filter((skill): skill is CombatSkill => skill?.type === 'attack')}
          currentAttackLine={currentFighter.currentAction?.skill.line}
          onSelectAttack={(attackId) => {
            onExecuteFeint(attackId);
            setShowFeintSelection(false);
          }}
          onCancel={() => setShowFeintSelection(false)}
        />
      )}
    </div>
  );
}
