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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">MyRPG - Combat Prototype</h1>
          <div className="flex gap-4">
            <button
              onClick={() => engine.togglePause()}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold transition-colors"
            >
              {gameState.pauseState.isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
          </div>
        </header>

        {/* Current Tick Display */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-xl">
            <span className="text-gray-400">Current Tick:</span>{' '}
            <span className="font-mono text-green-400">{gameState.currentTick}ms</span>
          </div>
        </div>

        {/* Timeline Visualization */}
        <TimelinePanel gameState={gameState} />

        {/* Action Buttons */}
        <ActionPanel
          gameState={gameState}
          onExecuteSkill={(skillId) => engine.executeSkill('pc', skillId)}
        />

        {/* Combat Log */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Combat Log</h2>
          <div className="space-y-1 font-mono text-sm max-h-64 overflow-y-auto">
            {gameState.combatLog.map((entry, i) => (
              <div key={i} className="text-gray-300">
                {entry}
              </div>
            ))}
          </div>
        </div>

        {/* Fighter States (Debug Info) */}
        <div className="grid grid-cols-2 gap-6">
          {/* Player Character */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Player Character</h2>
            <div className="space-y-2 text-sm">
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
                <span className="text-gray-400">Hits Taken:</span> {gameState.pc.hitsTaken} / 3
              </div>
              {gameState.pc.currentAction && (
                <div className="mt-4 p-3 bg-green-900/30 rounded">
                  <div className="font-bold text-green-400">
                    {gameState.pc.currentAction.skill.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    Phase: {gameState.pc.currentAction.currentPhase}
                  </div>
                  <div className="text-xs text-gray-400">
                    Elapsed: {gameState.pc.currentAction.elapsedTime}ms
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Opponent */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Opponent</h2>
            <div className="space-y-2 text-sm">
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
                <span className="text-gray-400">Hits Taken:</span> {gameState.npc.hitsTaken} / 3
              </div>
              {gameState.npc.currentAction && (
                <div className="mt-4 p-3 bg-red-900/30 rounded">
                  <div className="font-bold text-red-400">
                    {gameState.npc.currentAction.skill.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    Phase: {gameState.npc.currentAction.currentPhase}
                  </div>
                  <div className="text-xs text-gray-400">
                    Elapsed: {gameState.npc.currentAction.elapsedTime}ms
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
