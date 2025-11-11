/**
 * CombatScene.tsx - Main Combat UI Container
 *
 * ⏭️ PRE-BUILT COMPONENT - You don't need to understand React deeply
 *
 * This component:
 * 1. Creates the GameEngine instance
 * 2. Listens to engine events
 * 3. Displays the UI (timelines, actions, logs)
 *
 * You can mostly ignore this file. Focus on GameEngine.ts instead.
 */

import { useEffect, useState } from 'react';
import { GameEngine } from '../engine/GameEngine';
import type { GameState } from '../types/CombatTypes';
import { TimelinePanel } from './Timeline/TimelinePanel';
import { ActionPanel } from './Actions/ActionPanel';
import { ViewModeSelector, type ViewMode } from './ViewModeSelector';

// Create single engine instance (singleton pattern)
const engine = new GameEngine();

export function CombatScene() {
  // React state - when this updates, UI re-renders
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('debug');

  // Run once when component mounts
  useEffect(() => {
    console.log('[CombatScene] Mounting component...');

    // Listen to engine events
    const handleEvent = (event: any) => {
      if (event.type === 'STATE_UPDATE') {
        setGameState(event.state);
      }
    };

    engine.addEventListener(handleEvent);

    // Load skills and start engine
    const initialize = async () => {
      await engine.loadSkills();
      engine.start();
    };

    initialize();

    // Cleanup when component unmounts
    return () => {
      console.log('[CombatScene] Unmounting component...');
      engine.removeEventListener(handleEvent);
      engine.stop();
    };
  }, []);

  // Keyboard shortcuts for view modes
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '1') setViewMode('debug');
      if (e.key === '2') setViewMode('pc');
      if (e.key === '3') setViewMode('npc');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Helper: Filter combat log based on view mode
  const getFilteredCombatLog = () => {
    if (!gameState) return [];
    if (viewMode === 'debug') return gameState.combatLog;

    // Filter log based on what the fighter should know
    const perspective = viewMode === 'pc' ? 'Player' : 'Opponent';
    const opponent = viewMode === 'pc' ? 'Opponent' : 'Player';

    return gameState.combatLog.filter((entry) => {
      // Hide initialization messages (debug only)
      if (entry.includes('Combat engine initialized') || entry.includes('Loaded') || entry.includes('skills')) {
        return false;
      }

      // Always show: game state changes (paused, resumed, combat started)
      if (entry.includes('paused') || entry.includes('resumed') || entry.includes('Combat started') || entry.includes('Combat ended')) {
        return true;
      }

      // Show all actions by the perspective fighter
      if (entry.includes(perspective)) {
        return true;
      }

      // Show opponent telegraphs (visible information)
      if (entry.includes(opponent) && entry.includes('telegraph')) {
        return true;
      }

      // Show impact events (visible)
      if (entry.includes('Impact') || entry.includes('blocked') || entry.includes('HIT')) {
        return true;
      }

      // Show death events
      if (entry.includes('died')) {
        return true;
      }

      // Hide opponent's internal state (begins action, phase transitions, resource spending)
      if (entry.includes(opponent) && (entry.includes('begins') || entry.includes('spent') || entry.includes('completed'))) {
        return false;
      }

      // Default: show in debug, hide in perspective modes
      return false;
    });
  };

  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-2xl">Loading combat engine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Top Bar: Tick Counter, View Mode Selector, and Pause Button */}
      <div className="flex justify-between items-center mb-4">
        {/* Current Tick - subtle styling */}
        <div className="bg-gray-800/50 rounded px-3 py-2">
          <div className="text-sm">
            <span className="text-gray-500">Tick:</span>{' '}
            <span className="font-mono text-gray-400">{gameState.currentTick}ms</span>
          </div>
        </div>

        {/* View Mode Selector */}
        <ViewModeSelector currentMode={viewMode} onModeChange={setViewMode} />

        {/* Pause Button */}
        <button
          onClick={() => engine.togglePause()}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded font-semibold transition-colors text-sm"
        >
          {gameState.pauseState.isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>

      {/* Main Layout: Left Sidebar + Center Content + Right Sidebar */}
      <div className="flex gap-4">
        {/* Left Sidebar: PC Actions */}
        <div
          className={`w-64 transition-all ${
            viewMode === 'pc'
              ? 'ring-2 ring-blue-500 rounded-lg shadow-lg shadow-blue-500/50'
              : viewMode === 'npc'
              ? 'opacity-70'
              : ''
          }`}
        >
          <ActionPanel
            gameState={gameState}
            fighter="pc"
            viewMode={viewMode}
            onExecuteSkill={(skillId) => engine.executeSkill('pc', skillId)}
            onWait={() => {
              if (gameState.pauseState.isPaused) {
                engine.togglePause();
              }
            }}
          />
        </div>

        {/* Center Column: Main Content */}
        <div className="flex-1 space-y-4">
          {/* Timeline Visualization */}
          <TimelinePanel gameState={gameState} viewMode={viewMode} />

          {/* Combat Log */}
          <div className="bg-gray-800 rounded p-4">
            <h3 className="text-lg font-bold mb-2">
              Combat Log
              {viewMode !== 'debug' && (
                <span className="text-xs text-gray-500 ml-2">
                  ({viewMode === 'pc' ? 'PC' : 'NPC'} perspective)
                </span>
              )}
            </h3>
            <div className="space-y-1 font-mono text-sm max-h-40 overflow-y-auto">
              {getFilteredCombatLog()
                .slice()
                .reverse()
                .map((entry, i) => (
                  <div key={i} className="text-gray-300">
                    {entry}
                  </div>
                ))}
            </div>
          </div>

          {/* Fighter States */}
          <div className="grid grid-cols-2 gap-4">
            {/* Player Character */}
            <div className="bg-gray-800 rounded p-4">
              <h3 className="text-lg font-bold mb-2">Mizhael</h3>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-gray-400">HP:</span> {gameState.pc.resources.hp} /{' '}
                  {gameState.pc.maxResources.maxHp}
                </div>
                {(viewMode === 'debug' || viewMode === 'pc') && (
                  <>
                    <div>
                      <span className="text-gray-400">Stamina:</span> {gameState.pc.resources.stamina} /{' '}
                      {gameState.pc.maxResources.maxStamina}
                    </div>
                    <div>
                      <span className="text-gray-400">Focus:</span> {gameState.pc.resources.focus} /{' '}
                      {gameState.pc.maxResources.maxFocus}
                    </div>
                  </>
                )}
                {gameState.pc.currentAction && (
                  <div className="mt-2 p-2 bg-green-900/30 rounded">
                    <div className="font-bold text-green-400 text-xs">
                      {(viewMode === 'debug' || viewMode === 'pc')
                        ? gameState.pc.currentAction.skill.name
                        : '⏳ Acting...'}
                    </div>
                    {(viewMode === 'debug' || viewMode === 'pc') && (
                      <div className="text-xs text-gray-400">
                        {gameState.pc.currentAction.currentPhase} • {gameState.pc.currentAction.elapsedTime}ms
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Opponent */}
            <div className="bg-gray-800 rounded p-4">
              <h3 className="text-lg font-bold mb-2">Bandit</h3>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-gray-400">HP:</span> {gameState.npc.resources.hp} /{' '}
                  {gameState.npc.maxResources.maxHp}
                </div>
                {(viewMode === 'debug' || viewMode === 'npc') && (
                  <>
                    <div>
                      <span className="text-gray-400">Stamina:</span> {gameState.npc.resources.stamina} /{' '}
                      {gameState.npc.maxResources.maxStamina}
                    </div>
                    <div>
                      <span className="text-gray-400">Focus:</span> {gameState.npc.resources.focus} /{' '}
                      {gameState.npc.maxResources.maxFocus}
                    </div>
                  </>
                )}
                {gameState.npc.currentAction && (
                  <div className="mt-2 p-2 bg-red-900/30 rounded">
                    <div className="font-bold text-red-400 text-xs">
                      {(viewMode === 'debug' || viewMode === 'npc')
                        ? gameState.npc.currentAction.skill.name
                        : '⏳ Acting...'}
                    </div>
                    {(viewMode === 'debug' || viewMode === 'npc') && (
                      <div className="text-xs text-gray-400">
                        {gameState.npc.currentAction.currentPhase} • {gameState.npc.currentAction.elapsedTime}ms
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: NPC Actions */}
        <div
          className={`w-64 transition-all ${
            viewMode === 'npc'
              ? 'ring-2 ring-red-500 rounded-lg shadow-lg shadow-red-500/50'
              : viewMode === 'pc'
              ? 'opacity-70'
              : ''
          }`}
        >
          <ActionPanel
            gameState={gameState}
            fighter="npc"
            viewMode={viewMode}
            onExecuteSkill={(skillId) => engine.executeSkill('npc', skillId)}
            onWait={() => {
              if (gameState.pauseState.isPaused) {
                engine.togglePause();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
