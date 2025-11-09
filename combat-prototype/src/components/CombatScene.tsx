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

// Create single engine instance (singleton pattern)
const engine = new GameEngine();

export function CombatScene() {
  // React state - when this updates, UI re-renders
  const [gameState, setGameState] = useState<GameState | null>(null);

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

  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-2xl">Loading combat engine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Top Bar: Tick Counter (left) and Pause Button (right) */}
      <div className="flex justify-between items-center mb-4">
        {/* Current Tick - max 1/5 width */}
        <div className="bg-gray-800 rounded px-3 py-2" style={{ maxWidth: '20%' }}>
          <div className="text-sm">
            <span className="text-gray-400">Tick:</span>{' '}
            <span className="font-mono text-green-400">{gameState.currentTick}ms</span>
          </div>
        </div>

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
        <div className="w-64">
          <ActionPanel
            gameState={gameState}
            fighter="pc"
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
          <TimelinePanel gameState={gameState} />

          {/* Combat Log */}
          <div className="bg-gray-800 rounded p-4">
            <h3 className="text-lg font-bold mb-2">Combat Log</h3>
            <div className="space-y-1 font-mono text-sm max-h-40 overflow-y-auto">
              {gameState.combatLog.slice().reverse().map((entry, i) => (
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
              <h3 className="text-lg font-bold mb-2">Player</h3>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-gray-400">HP:</span> {gameState.pc.resources.hp} /{' '}
                  {gameState.pc.maxResources.maxHp}
                </div>
                <div>
                  <span className="text-gray-400">Stamina:</span> {gameState.pc.resources.stamina} /{' '}
                  {gameState.pc.maxResources.maxStamina}
                </div>
                <div>
                  <span className="text-gray-400">Focus:</span> {gameState.pc.resources.focus} /{' '}
                  {gameState.pc.maxResources.maxFocus}
                </div>
                <div>
                  <span className="text-gray-400">Hits:</span> {gameState.pc.hitsRemaining} / 3
                </div>
                {gameState.pc.currentAction && (
                  <div className="mt-2 p-2 bg-green-900/30 rounded">
                    <div className="font-bold text-green-400 text-xs">
                      {gameState.pc.currentAction.skill.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {gameState.pc.currentAction.currentPhase} • {gameState.pc.currentAction.elapsedTime}ms
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Opponent */}
            <div className="bg-gray-800 rounded p-4">
              <h3 className="text-lg font-bold mb-2">Opponent</h3>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-gray-400">HP:</span> {gameState.npc.resources.hp} /{' '}
                  {gameState.npc.maxResources.maxHp}
                </div>
                <div>
                  <span className="text-gray-400">Stamina:</span> {gameState.npc.resources.stamina} /{' '}
                  {gameState.npc.maxResources.maxStamina}
                </div>
                <div>
                  <span className="text-gray-400">Focus:</span> {gameState.npc.resources.focus} /{' '}
                  {gameState.npc.maxResources.maxFocus}
                </div>
                <div>
                  <span className="text-gray-400">Hits:</span> {gameState.npc.hitsRemaining} / 3
                </div>
                {gameState.npc.currentAction && (
                  <div className="mt-2 p-2 bg-red-900/30 rounded">
                    <div className="font-bold text-red-400 text-xs">
                      {gameState.npc.currentAction.skill.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {gameState.npc.currentAction.currentPhase} • {gameState.npc.currentAction.elapsedTime}ms
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: NPC Actions */}
        <div className="w-64">
          <ActionPanel
            gameState={gameState}
            fighter="npc"
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
