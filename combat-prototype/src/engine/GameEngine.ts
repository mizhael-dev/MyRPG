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
      availableSkills: ['side_slash', 'thrust', 'overhead_strike', 'upward_strike', 'diagonal_slash', 'parry', 'emergency_defense', 'retreat', 'deflection'], // All skills
      hitsRemaining: 3, // Starts with 3 hits, clean hit = instant death (0), non-clean = -1
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
      const slashResponse = await fetch('/CombatSkills/attacks/side_slash.json');
      const slash = await slashResponse.json();
      this.validateSkill(slash);
      this.skills.set('side_slash', slash);

      const thrustResponse = await fetch('/CombatSkills/attacks/thrust.json');
      const thrust = await thrustResponse.json();
      this.validateSkill(thrust);
      this.skills.set('thrust', thrust);

      const overheadResponse = await fetch('/CombatSkills/attacks/overhead_strike.json');
      const overhead = await overheadResponse.json();
      this.validateSkill(overhead);
      this.skills.set('overhead_strike', overhead);

      const upwardResponse = await fetch('/CombatSkills/attacks/upward_strike.json');
      const upward = await upwardResponse.json();
      this.validateSkill(upward);
      this.skills.set('upward_strike', upward);

      const diagonalResponse = await fetch('/CombatSkills/attacks/diagonal_slash.json');
      const diagonal = await diagonalResponse.json();
      this.validateSkill(diagonal);
      this.skills.set('diagonal_slash', diagonal);

      // Load defense skills
      const parryResponse = await fetch('/CombatSkills/defense/parry.json');
      const parry = await parryResponse.json();
      this.validateSkill(parry);
      this.skills.set('parry', parry);

      const emergencyResponse = await fetch('/CombatSkills/defense/emergency_defense.json');
      const emergency = await emergencyResponse.json();
      this.validateSkill(emergency);
      this.skills.set('emergency_defense', emergency);

      const retreatResponse = await fetch('/CombatSkills/defense/retreat.json');
      const retreat = await retreatResponse.json();
      this.validateSkill(retreat);
      this.skills.set('retreat', retreat);

      const deflectionResponse = await fetch('/CombatSkills/defense/deflection.json');
      const deflection = await deflectionResponse.json();
      this.validateSkill(deflection);
      this.skills.set('deflection', deflection);

      console.log('[GameEngine] Loaded skills:', Array.from(this.skills.keys()));
      this.log(`Loaded ${this.skills.size} combat skills`);
    } catch (error) {
      console.error('[GameEngine] Failed to load skills:', error);
      this.log('ERROR: Failed to load combat skills');
      throw error; // Re-throw to make validation errors visible
    }
  }

  /**
   * Validate skill JSON structure
   * Ensures impact tick = windUp duration + committed duration
   */
  private validateSkill(skill: any): void {
    if (skill.type === 'attack') {
      const windUp = skill.phases.windUp.duration;
      const committed = skill.phases.committed.duration;
      const impactTick = skill.phases.impact.tick;

      if (impactTick !== windUp + committed) {
        throw new Error(
          `Invalid skill "${skill.id}": impact tick (${impactTick}) must equal windUp (${windUp}) + committed (${committed}) = ${windUp + committed}`
        );
      }
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
      const action = fighter.currentAction;
      const prevPhase = action.currentPhase;

      action.elapsedTime += this.tickInterval;

      // PHASE PROGRESSION
      this.updatePhaseProgression(fighter);

      // TELEGRAPH REVEALS
      this.updateTelegraphReveals(fighter);

      // IMPACT RESOLUTION - trigger once when entering impact phase
      if (fighter.currentAction && fighter.currentAction.currentPhase === 'impact' && prevPhase !== 'impact') {
        this.resolveImpact(fighter);
      }

      console.log(
        `[GameEngine] ${fighter.name} action: ${action.skill.name} @ ${action.elapsedTime}ms (${action.currentPhase})`
      );
    }
  }

  /**
   * Update action phase based on elapsed time
   */
  private updatePhaseProgression(fighter: FighterState): void {
    const action = fighter.currentAction;
    if (!action) return;

    const skill = action.skill;
    const elapsed = action.elapsedTime;
    const prevPhase = action.currentPhase;

    // DEFENSE SKILLS: windUp → active → recovery
    if (skill.type === 'defense') {
      const windUpEnd = skill.phases.windUp.duration;
      const activeDuration = skill.phases.active?.duration || 0;
      const activeEnd = windUpEnd + activeDuration;
      const recoveryEnd = activeEnd + skill.phases.recovery.duration;

      let newPhase: typeof action.currentPhase = action.currentPhase;

      if (elapsed < windUpEnd) {
        newPhase = 'windUp';
        action.canCancel = skill.phases.windUp.canCancel;
        action.canFeint = skill.phases.windUp.canFeint;
      } else if (elapsed < activeEnd) {
        newPhase = 'active';
        action.canCancel = false;
        action.canFeint = false;
      } else if (elapsed < recoveryEnd) {
        newPhase = 'recovery';
        action.canCancel = false;
        action.canFeint = false;
      } else {
        // Action complete, clear it
        this.log(`${fighter.name} completed ${skill.name}`);
        fighter.currentAction = null;
        return;
      }

      // Update phase and emit event if changed
      if (newPhase !== prevPhase) {
        action.currentPhase = newPhase;
        this.log(`${fighter.name} ${skill.name}: ${prevPhase} → ${newPhase}`);

        this.emitEvent({
          type: 'PHASE_CHANGED',
          fighterId: fighter.id,
          newPhase: newPhase,
        });
      }
      return; // Exit early for defense skills
    }

    // ATTACK SKILLS: windUp → committed → impact → recovery
    // Calculate phase boundaries
    const windUpEnd = skill.phases.windUp.duration;
    const impactTick = skill.phases.impact.tick;
    const recoveryEnd = impactTick + skill.phases.recovery.duration;

    // Determine current phase
    let newPhase: typeof action.currentPhase = action.currentPhase;

    if (elapsed < windUpEnd) {
      newPhase = 'windUp';
      action.canCancel = skill.phases.windUp.canCancel;
      action.canFeint = skill.phases.windUp.canFeint;
    } else if (elapsed < impactTick) {
      newPhase = 'committed';
      action.canCancel = false;
      action.canFeint = false;
    } else if (elapsed === impactTick) {
      newPhase = 'impact';
      action.canCancel = false;
      action.canFeint = false;
    } else if (elapsed < recoveryEnd) {
      newPhase = 'recovery';
      action.canCancel = false;
      action.canFeint = false;
    } else {
      // Action complete, clear it
      this.log(`${fighter.name} completed ${skill.name}`);
      fighter.currentAction = null;
      return;
    }

    // Update phase and emit event if changed
    if (newPhase !== prevPhase) {
      action.currentPhase = newPhase;
      this.log(`${fighter.name} ${skill.name}: ${prevPhase} → ${newPhase}`);

      this.emitEvent({
        type: 'PHASE_CHANGED',
        fighterId: fighter.id,
        newPhase,
      });
    }
  }

  /**
   * Check for new telegraph reveals
   */
  private updateTelegraphReveals(fighter: FighterState): void {
    const action = fighter.currentAction;
    if (!action) return;

    const skill = action.skill;
    const elapsed = action.elapsedTime;

    // Check each telegraph
    for (const telegraph of skill.telegraphs) {
      // If elapsed time has reached trigger time and not already visible
      if (elapsed >= telegraph.triggerTime) {
        const alreadyVisible = action.visibleTelegraphs.some(
          (t) => t.stage === telegraph.stage
        );

        if (!alreadyVisible) {
          action.visibleTelegraphs.push(telegraph);

          this.log(
            `${fighter.name} telegraph ${telegraph.stage}: ${telegraph.description}`
          );

          this.emitEvent({
            type: 'TELEGRAPH_REVEALED',
            telegraph,
            fighterId: fighter.id,
          });

          // Trigger auto-pause for new telegraph
          this.checkAutoPause(fighter, 'new_telegraph', telegraph);
        }
      }
    }
  }

  /**
   * Resolve impact when attack reaches Impact tick
   */
  private resolveImpact(attacker: FighterState): void {
    const action = attacker.currentAction;
    if (!action || action.skill.type !== 'attack') return;

    // Identify defender
    const defender = attacker.id === 'pc' ? this.npc : this.pc;

    this.log(`${attacker.name} ${action.skill.name} Impact!`);

    // Check if defender has active defense
    const defenseActive = this.isDefenseActive(defender, action.elapsedTime);

    if (defenseActive) {
      // Perfect block - no damage, no hit counted
      this.log(`${defender.name} blocked the attack!`);

      // Apply parry stamina cost if applicable
      if (defender.currentAction?.skill.id === 'parry') {
        const attackerStaminaSpent = action.skill.costs.stamina.base;
        const additionalCost = attackerStaminaSpent * 0.25;
        defender.resources.stamina -= additionalCost;
        this.log(`${defender.name} parry cost: ${additionalCost.toFixed(1)} stamina`);
      }

      this.emitEvent({
        type: 'IMPACT_RESOLVED',
        attacker: attacker.id,
        defender: defender.id,
        hit: false,
      });
    } else {
      // Clean hit - no defense active
      this.log(`${attacker.name} CLEAN HIT on ${defender.name}!`);

      // Clean strike: instant death (3 → 0)
      defender.hitsRemaining = 0;

      this.emitEvent({
        type: 'IMPACT_RESOLVED',
        attacker: attacker.id,
        defender: defender.id,
        hit: true,
      });

      // Check for death
      this.checkDeath(defender, 'clean_hit');
    }
  }

  /**
   * Check if defender has active defense during attacker's impact
   * All 4 defense types supported: Parry, Emergency Defense, Retreat, Deflection
   */
  private isDefenseActive(defender: FighterState, attackImpactTime: number): boolean {
    const defenseAction = defender.currentAction;
    if (!defenseAction) return false;
    if (defenseAction.skill.type !== 'defense') return false;

    // Defense must be in active phase
    if (defenseAction.currentPhase !== 'active') {
      this.log(`${defender.name} defense not active: currently in ${defenseAction.currentPhase} phase`);
      return false;
    }

    // Basic mode: Any defense in active phase blocks any attack
    // Future: Check linePrediction for Parry, attackPrediction for Deflection
    const defenseProps = defenseAction.skill.defenseProperties;

    this.log(
      `${defender.name} ${defenseAction.skill.name} active (${defenseAction.elapsedTime}ms) - BLOCKS attack!`
    );

    return true;
  }

  /**
   * Check if fighter should die
   */
  private checkDeath(fighter: FighterState, reason: string): void {
    let shouldDie = false;
    let deathReason = '';

    // Check hits remaining
    if (fighter.hitsRemaining <= 0) {
      shouldDie = true;
      deathReason = reason === 'clean_hit'
        ? 'Clean strike - instant death'
        : `No hits remaining (${3 - fighter.hitsRemaining} hits taken)`;
    }
    // Check HP (from exhaustion, etc.)
    else if (fighter.resources.hp <= 0) {
      shouldDie = true;
      deathReason = 'HP depleted';
      fighter.hitsRemaining = 0;
    }

    if (shouldDie) {
      this.log(`${fighter.name} died: ${deathReason}`);

      // Clear current action
      fighter.currentAction = null;

      this.emitEvent({
        type: 'FIGHTER_DIED',
        fighterId: fighter.id,
        reason: deathReason,
      });

      // Pause combat
      this.pauseState.isPaused = true;
      this.pauseState.reason = 'manual'; // Use manual as placeholder
      this.log('Combat ended');
    }
  }

  /**
   * Check if combat should auto-pause based on telegraph.pause field
   */
  private checkAutoPause(
    fighter: FighterState,
    reason: 'new_telegraph',
    telegraph?: any
  ): void {
    if (reason === 'new_telegraph' && telegraph) {
      // Check if this telegraph should trigger a pause
      if (telegraph.pause === true) {
        this.pauseState.isPaused = true;
        this.pauseState.reason = 'new_telegraph';
        this.pauseState.availableActions = ['side_slash', 'thrust', 'overhead_strike', 'upward_strike', 'diagonal_slash', 'parry', 'emergency_defense', 'retreat', 'deflection']; // TODO: Calculate based on time available

        // Build prediction
        this.pauseState.prediction = {
          estimatedImpactRange: {
            min: 1000, // TODO: Calculate from opponent's current action
            max: 2500,
          },
        };

        this.log(`Auto-pause: ${telegraph.description}`);

        this.emitEvent({
          type: 'PAUSE_TRIGGERED',
          pauseState: this.pauseState,
        });
      } else {
        // Telegraph revealed but no pause - just log it
        this.log(`Telegraph revealed: ${telegraph.description}`);
      }
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

    // RESOURCE CONSUMPTION - Deduct costs when action starts
    const costs = skill.costs;
    const staminaCost = costs.stamina.base;
    const mpCost = costs.mp;
    const focusCost = costs.focus;
    const dailyFatigueCost = costs.dailyFatigue;

    // Deduct resources
    fighter.resources.stamina -= staminaCost;
    fighter.resources.mp -= mpCost;
    fighter.resources.focus -= focusCost;
    fighter.resources.dailyFatigue -= dailyFatigueCost;

    this.log(
      `${fighter.name} spent: ${staminaCost} stam, ${mpCost} MP, ${focusCost} focus, ${dailyFatigueCost} fatigue`
    );

    // Handle exhaustion penalties
    let hpDrain = 0;

    if (fighter.resources.stamina < 0) {
      // 1 HP per 2 stamina deficit
      const deficit = Math.abs(fighter.resources.stamina);
      hpDrain += deficit / 2;
      this.log(`${fighter.name} exhausted (stamina): -${(deficit / 2).toFixed(1)} HP`);
    }

    if (fighter.resources.mp < 0) {
      // 1 HP per 1 MP deficit
      const deficit = Math.abs(fighter.resources.mp);
      hpDrain += deficit;
      this.log(`${fighter.name} exhausted (MP): -${deficit.toFixed(1)} HP`);
    }

    if (fighter.resources.focus < 0) {
      // 1 HP per 2 focus deficit
      const deficit = Math.abs(fighter.resources.focus);
      hpDrain += deficit / 2;
      this.log(`${fighter.name} exhausted (focus): -${(deficit / 2).toFixed(1)} HP`);
    }

    if (fighter.resources.dailyFatigue < 0) {
      // 1 HP per 5 daily fatigue deficit
      const deficit = Math.abs(fighter.resources.dailyFatigue);
      hpDrain += deficit / 5;
      this.log(`${fighter.name} exhausted (fatigue): -${(deficit / 5).toFixed(1)} HP`);
    }

    // Apply HP drain from exhaustion
    if (hpDrain > 0) {
      fighter.resources.hp -= hpDrain;
      this.log(`${fighter.name} HP drained: -${hpDrain.toFixed(1)} (exhaustion penalty)`);

      // Check if fighter died from exhaustion
      if (fighter.resources.hp <= 0) {
        this.checkDeath(fighter, 'exhaustion');
        return; // Don't create action if fighter died
      }
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

    // Check for initial telegraphs (triggerTime 0) immediately
    this.updateTelegraphReveals(fighter);

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
      loadedSkills: this.skills, // Expose loaded skills to UI
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
      loadedSkills: this.skills,
    };
  }
}
