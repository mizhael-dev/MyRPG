/**
 * GameEngine.ts - The Heart of Your Combat System
 *
 * 🎯 THIS IS YOUR FOCUS AREA
 *
 * This is where atomic turn-based combat happens. Read through this code
 * to understand how 100ms ticks drive the entire combat simulation.
 *
 * Key concepts:
 * - Atomic ticks (100ms intervals)
 * - Event-driven architecture (Engine → UI communication)
 * - Deterministic combat (no RNG, pure timing)
 */

import type {
  GameState,
  GameEvent,
  EventListener,
  CombatSkill,
  FighterState,
  PauseState,
} from '../types/CombatTypes';

/**
 * Main Combat Engine
 *
 * Responsibilities:
 * 1. Run atomic tick loop (100ms intervals)
 * 2. Update both fighters each tick
 * 3. Check for pause triggers
 * 4. Emit events to UI
 * 5. Handle player input
 */
export class GameEngine {
  // =========================================================================
  // STATE
  // =========================================================================

  private currentTick: number = 0;          // Current time in milliseconds
  private isRunning: boolean = false;       // Is the simulation running?
  private tickInterval: number = 100;       // Atomic tick size (ms)
  private intervalId: number | null = null; // setInterval ID

  private pc: FighterState;                 // Player Character
  private npc: FighterState;                // Non-Player Character (opponent)

  private pauseState: PauseState = {
    isPaused: false,
    reason: null,
    availableActions: [],
    prediction: null,
  };

  private combatLog: string[] = [];         // Debug log
  private listeners: EventListener[] = [];  // UI event listeners
  private skills: Map<string, CombatSkill> = new Map(); // Loaded skills

  // =========================================================================
  // CONSTRUCTOR
  // =========================================================================

  constructor() {
    console.log('[GameEngine] Initializing combat engine...');

    // Initialize fighters with default state
    this.pc = this.createFighter('pc', 'Player');
    this.npc = this.createFighter('npc', 'Opponent');

    this.log('Combat engine initialized');
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  /**
   * Create a fighter with default stats
   */
  private createFighter(id: string, name: string): FighterState {
    return {
      id,
      name,
      resources: {
        hp: 10,
        stamina: 20,  // Constitution × 2
        mp: 20,       // Magic × 2
        focus: 20,    // Willpower
        dailyFatigue: 100, // Willpower × 5
      },
      maxResources: {
        maxHp: 10,
        maxStamina: 20,
        maxMp: 20,
        maxFocus: 20,
        maxDailyFatigue: 100,
      },
      currentAction: null,
      availableSkills: ['slash', 'thrust', 'parry'], // Default skills
      hitsTaken: 0, // For 3-hit death tracking
    };
  }

  /**
   * Load combat skills from JSON files
   *
   * This will be called from React component to load your
   * skills from /public/CombatSkills/ folder
   */
  public async loadSkills(): Promise<void> {
    console.log('[GameEngine] Loading combat skills from JSON...');

    try {
      // Load attack skills
      const slashResponse = await fetch('/CombatSkills/attacks/slash.json');
      const slash = await slashResponse.json();
      this.skills.set('slash', slash);

      const thrustResponse = await fetch('/CombatSkills/attacks/thrust.json');
      const thrust = await thrustResponse.json();
      this.skills.set('thrust', thrust);

      // Load defense skills
      const parryResponse = await fetch('/CombatSkills/defense/parry.json');
      const parry = await parryResponse.json();
      this.skills.set('parry', parry);

      console.log('[GameEngine] Loaded skills:', Array.from(this.skills.keys()));
      this.log(`Loaded ${this.skills.size} combat skills`);
    } catch (error) {
      console.error('[GameEngine] Failed to load skills:', error);
      this.log('ERROR: Failed to load combat skills');
    }
  }

  // =========================================================================
  // ATOMIC TICK LOOP - THE CORE
  // =========================================================================

  /**
   * Start the combat simulation
   *
   * This begins the atomic tick loop that runs every 100ms
   */
  public start(): void {
    if (this.isRunning) {
      console.warn('[GameEngine] Already running');
      return;
    }

    console.log('[GameEngine] Starting combat simulation...');
    this.isRunning = true;

    // Run tick() every 100ms
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, this.tickInterval);

    this.log('Combat started');
    this.emitStateUpdate();
  }

  /**
   * Stop the combat simulation
   */
  public stop(): void {
    if (!this.isRunning) return;

    console.log('[GameEngine] Stopping combat simulation...');
    this.isRunning = false;

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.log('Combat stopped');
  }

  /**
   * THE ATOMIC TICK - This runs every 100ms
   *
   * This is the heart of your combat system. Every 100ms:
   * 1. Advance time
   * 2. Update both fighters
   * 3. Check for pause conditions
   * 4. Emit state to UI
   */
  private tick(): void {
    // Skip ticks if paused
    if (this.pauseState.isPaused) {
      return;
    }

    // Advance time by one atomic unit
    this.currentTick += this.tickInterval;

    // Log every second for visibility
    if (this.currentTick % 1000 === 0) {
      console.log(`[GameEngine] Tick ${this.currentTick}ms`);
    }

    // Update both fighters
    this.updateFighter(this.pc);
    this.updateFighter(this.npc);

    // Check if we should pause
    // TODO: Implement pause logic based on telegraphs
    // For now, we'll just run continuously

    // Send updated state to UI
    this.emitStateUpdate();
  }

  /**
   * Update a single fighter's state for this tick
   */
  private updateFighter(fighter: FighterState): void {
    // If fighter has an active action, update it
    if (fighter.currentAction) {
      fighter.currentAction.elapsedTime += this.tickInterval;

      // TODO: Implement action phase progression
      // TODO: Implement telegraph reveals
      // TODO: Implement impact resolution

      console.log(
        `[GameEngine] ${fighter.name} action: ${fighter.currentAction.skill.name} @ ${fighter.currentAction.elapsedTime}ms (${fighter.currentAction.currentPhase})`
      );
    }
  }

  // =========================================================================
  // PLAYER INPUT
  // =========================================================================

  /**
   * Player executes a combat skill
   *
   * This is called from the UI when player clicks an action button
   */
  public executeSkill(fighterId: string, skillId: string): void {
    console.log(`[GameEngine] ${fighterId} wants to execute skill: ${skillId}`);

    const fighter = fighterId === 'pc' ? this.pc : this.npc;
    const skill = this.skills.get(skillId);

    if (!skill) {
      console.error(`[GameEngine] Skill not found: ${skillId}`);
      return;
    }

    // Check if fighter can act
    if (fighter.currentAction) {
      console.warn(`[GameEngine] ${fighter.name} already has active action`);
      return;
    }

    // Create new action
    fighter.currentAction = {
      skillId,
      skill,
      currentPhase: 'windUp',
      elapsedTime: 0,
      visibleTelegraphs: [],
      canCancel: skill.phases.windUp.canCancel,
      canFeint: skill.phases.windUp.canFeint,
    };

    this.log(`${fighter.name} begins ${skill.name}`);
    console.log(`[GameEngine] ${fighter.name} started ${skill.name}`);

    this.emitStateUpdate();
  }

  /**
   * Pause or unpause the simulation
   */
  public togglePause(): void {
    this.pauseState.isPaused = !this.pauseState.isPaused;

    if (this.pauseState.isPaused) {
      this.pauseState.reason = 'manual';
      console.log('[GameEngine] Paused (manual)');
      this.log('Combat paused');
    } else {
      this.pauseState.reason = null;
      console.log('[GameEngine] Unpaused');
      this.log('Combat resumed');
    }

    this.emitEvent({
      type: 'PAUSE_TRIGGERED',
      pauseState: this.pauseState,
    });

    this.emitStateUpdate();
  }

  // =========================================================================
  // EVENT SYSTEM - How Engine Talks to UI
  // =========================================================================

  /**
   * Add an event listener
   *
   * React components call this to listen for engine events
   */
  public addEventListener(listener: EventListener): void {
    this.listeners.push(listener);
    console.log(`[GameEngine] Added event listener (${this.listeners.length} total)`);
  }

  /**
   * Remove an event listener
   */
  public removeEventListener(listener: EventListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  /**
   * Emit an event to all listeners (UI components)
   */
  private emitEvent(event: GameEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  /**
   * Emit current game state to UI
   */
  private emitStateUpdate(): void {
    const state: GameState = {
      currentTick: this.currentTick,
      pc: this.pc,
      npc: this.npc,
      pauseState: this.pauseState,
      combatLog: [...this.combatLog], // Copy array
    };

    this.emitEvent({
      type: 'STATE_UPDATE',
      state,
    });
  }

  // =========================================================================
  // UTILITIES
  // =========================================================================

  /**
   * Add message to combat log
   */
  private log(message: string): void {
    const timestamp = `[${this.currentTick}ms]`;
    this.combatLog.push(`${timestamp} ${message}`);

    // Keep log from growing too large
    if (this.combatLog.length > 100) {
      this.combatLog.shift();
    }
  }

  /**
   * Get current state (for debugging)
   */
  public getState(): GameState {
    return {
      currentTick: this.currentTick,
      pc: this.pc,
      npc: this.npc,
      pauseState: this.pauseState,
      combatLog: [...this.combatLog],
    };
  }
}
