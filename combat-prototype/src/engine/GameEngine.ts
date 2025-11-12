/**
 * GameEngine.ts - The Heart of Your Combat System
 *
 * 🎯 THIS IS YOUR FOCUS AREA
 *
 * This is where atomic turn-based combat happens. Read through this code
 * to understand how 50ms ticks drive the entire combat simulation.
 *
 * Key concepts:
 * - Atomic ticks (50ms intervals)
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
  ActionHistoryEntry,
  ActionState,
} from '../types/CombatTypes';

/**
 * Main Combat Engine
 *
 * Responsibilities:
 * 1. Run atomic tick loop (50ms intervals)
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
  private ticksStarted: boolean = false;    // Has the tick interval started?
  private tickInterval: number = 50;        // Atomic tick size (ms)
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
  private actionHistory: ActionHistoryEntry[] = []; // Full combat history for timeline

  // =========================================================================
  // CONSTRUCTOR
  // =========================================================================

  constructor() {
    console.log('[GameEngine] Initializing combat engine...');

    // Initialize fighters with default state
    this.pc = this.createFighter('pc', 'Mizhael');
    this.npc = this.createFighter('npc', 'Bandit');

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
        hp: 3,
        stamina: 20,  // Constitution × 2
        mp: 20,       // Magic × 2
        focus: 20,    // Willpower
        dailyFatigue: 100, // Willpower × 5
      },
      maxResources: {
        maxHp: 3,
        maxStamina: 20,
        maxMp: 20,
        maxFocus: 20,
        maxDailyFatigue: 100,
      },
      currentAction: null,
      availableSkills: ['side_slash', 'thrust', 'overhead_strike', 'upward_strike', 'diagonal_slash', 'parry', 'emergency_defense', 'retreat', 'deflection'], // All skills
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

      // Load special skills
      const feintResponse = await fetch('/CombatSkills/special/feint.json');
      const feint = await feintResponse.json();
      this.validateSkill(feint);
      this.skills.set('feint', feint);

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

      // Validate that impact tick is aligned with game tick interval
      if (impactTick % this.tickInterval !== 0) {
        throw new Error(
          `Invalid skill "${skill.id}": impact tick (${impactTick}) must be a multiple of tick interval (${this.tickInterval}ms). Use ${Math.floor(impactTick / this.tickInterval) * this.tickInterval} or ${Math.ceil(impactTick / this.tickInterval) * this.tickInterval}`
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
   * Combat is now ready, but the tick loop won't start until the first action is taken
   */
  public start(): void {
    if (this.isRunning) {
      console.warn('[GameEngine] Already running');
      return;
    }

    console.log('[GameEngine] Combat ready (waiting for first action)...');
    this.isRunning = true;

    // Don't start the interval yet - wait for first action
    // The tick loop will start when executeSkill() is called

    this.log('Combat ready - awaiting first action');
    this.emitStateUpdate();
  }

  /**
   * Stop the combat simulation
   */
  public stop(): void {
    if (!this.isRunning) return;

    console.log('[GameEngine] Stopping combat simulation...');
    this.isRunning = false;
    this.ticksStarted = false;

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Clear action history
    this.actionHistory = [];

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
        // Action complete, save to history and clear
        this.log(`${fighter.name} completed ${skill.name}`);
        const historyEntry = this.createHistoryEntry(fighter, action, this.currentTick);
        this.actionHistory.push(historyEntry);
        this.log(`${fighter.name} action added to history: ${historyEntry.skill.name}`);
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
    // Calculate phase boundaries (apply windUpModifier for counter bonus)
    const windUpEnd = skill.phases.windUp.duration + (action.windUpModifier || 0);
    const impactTick = skill.phases.impact.tick + (action.windUpModifier || 0);
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
      // Action complete, save to history and clear
      this.log(`${fighter.name} completed ${skill.name}`);
      const historyEntry = this.createHistoryEntry(fighter, action, this.currentTick);
      this.actionHistory.push(historyEntry);
      this.log(`${fighter.name} action added to history: ${historyEntry.skill.name}`);
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
   * Create a history entry from a completed action
   * Pre-calculates all phase end times for fast timeline rendering
   */
  private createHistoryEntry(
    fighter: FighterState,
    action: ActionState,
    endTick: number
  ): ActionHistoryEntry {
    const skill = action.skill;
    const windUpModifier = action.windUpModifier || 0;

    // Calculate when action started
    const startTick = endTick - action.elapsedTime;

    // Calculate phase end times
    const windUpEnd = startTick + skill.phases.windUp.duration + windUpModifier;

    // Recovery end calculation differs for attacks vs defenses
    let recoveryStart: number;
    if (skill.type === 'attack') {
      recoveryStart = skill.phases.impact.tick + windUpModifier + startTick;
    } else {
      // Defense: recovery starts after active phase
      recoveryStart = windUpEnd + (skill.phases.active?.duration || 0);
    }
    const recoveryEnd = recoveryStart + skill.phases.recovery.duration;

    // Build base history entry
    const entry: ActionHistoryEntry = {
      fighterId: fighter.id as 'pc' | 'npc',
      skill: skill,
      startTick: startTick,
      endTick: endTick,
      phases: {
        windUpEnd: windUpEnd,
        recoveryEnd: recoveryEnd,
      },
      windUpModifier: windUpModifier,
    };

    // Add attack-specific phase times
    if (skill.type === 'attack') {
      entry.phases.committedEnd = startTick + skill.phases.windUp.duration + skill.phases.committed.duration + windUpModifier;
      entry.phases.impactTick = startTick + skill.phases.impact.tick + windUpModifier;
    }

    // Add defense-specific phase times
    if (skill.type === 'defense' && skill.phases.active) {
      entry.phases.activeEnd = windUpEnd + skill.phases.active.duration;
    }

    return entry;
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
   * Damage formula: attackDamage * (1 - damageReductionPercent) - damageReductionFlat
   * If damage < 0, then damage = 0
   */
  private resolveImpact(attacker: FighterState): void {
    const action = attacker.currentAction;
    if (!action || action.skill.type !== 'attack') return;

    // Identify defender
    const defender = attacker.id === 'pc' ? this.npc : this.pc;

    this.log(`${attacker.name} ${action.skill.name} Impact!`);

    // Get base attack damage
    const baseDamage = action.skill.damage?.baseValue || 0;
    let finalDamage = baseDamage;

    // Check if defender has active defense
    const defenseActive = this.isDefenseActive(defender, action.elapsedTime);

    if (defenseActive && defender.currentAction) {
      // Defense is active - apply damage reduction
      const defenseProps = defender.currentAction.skill.defenseProperties;
      if (defenseProps) {
        const percentReduction = defenseProps.damageReductionPercent || 0;
        const flatReduction = defenseProps.damageReductionFlat || 0;

        // Apply damage formula: damage * (1 - percent) - flat
        finalDamage = baseDamage * (1 - percentReduction) - flatReduction;

        // Ensure damage doesn't go below 0
        if (finalDamage < 0) finalDamage = 0;

        this.log(`${defender.name} ${defender.currentAction.skill.name} reduces damage: ${baseDamage} → ${finalDamage}`);
      }

      // Apply parry stamina cost if applicable
      if (defender.currentAction?.skill.id === 'parry') {
        const attackerStaminaSpent = action.skill.costs.stamina.base;
        const additionalCost = attackerStaminaSpent * 0.25;
        defender.resources.stamina -= additionalCost;
        this.log(`${defender.name} parry cost: ${additionalCost.toFixed(1)} stamina`);
      }

      // Apply counter speed bonus for successful defense
      if (defenseProps?.counterSpeedBonus) {
        defender.activeCounterBonus = defenseProps.counterSpeedBonus;
        this.log(`${defender.name} gains ${defenseProps.counterSpeedBonus}ms counter bonus!`);
      }
    }

    // Apply damage to HP
    defender.resources.hp -= finalDamage;
    this.log(`${defender.name} takes ${finalDamage} damage (HP: ${defender.resources.hp}/${defender.maxResources.maxHp})`);

    this.emitEvent({
      type: 'IMPACT_RESOLVED',
      attacker: attacker.id,
      defender: defender.id,
      hit: finalDamage > 0,
    });

    // Check for death (HP <= 0)
    if (defender.resources.hp <= 0) {
      this.checkDeath(defender, 'hp_depleted');
    }
  }

  /**
   * Check if defender has active defense during attacker's impact
   * All 4 defense types supported: Parry, Emergency Defense, Retreat, Deflection
   *
   * IMPORTANT: This checks if the defense's active window overlaps with the attack's impact tick,
   * not just if the defense is currently in the active phase.
   */
  private isDefenseActive(defender: FighterState, _attackImpactTime: number): boolean {
    const defenseAction = defender.currentAction;
    if (!defenseAction) return false;
    if (defenseAction.skill.type !== 'defense') return false;

    // Calculate the defense's active window time range
    const skill = defenseAction.skill;
    const windUpEnd = skill.phases.windUp.duration;
    const activeStart = windUpEnd;
    const activeDuration = skill.phases.active?.duration || 0;
    const activeEnd = activeStart + activeDuration;

    // Check if the attack's impact falls within the defense's active window
    const defenseElapsed = defenseAction.elapsedTime;
    const defenseActiveStart = activeStart;
    const defenseActiveEnd = activeEnd;

    // The defense is active if: defenseActiveStart <= impact tick < defenseActiveEnd
    // We need to check this relative to when the defense action started
    const isInActiveWindow = defenseElapsed >= defenseActiveStart && defenseElapsed < defenseActiveEnd;

    if (!isInActiveWindow) {
      this.log(`${defender.name} defense not in active window: elapsed=${defenseElapsed}ms, active window=${defenseActiveStart}-${defenseActiveEnd}ms`);
      return false;
    }

    const defenseProps = defenseAction.skill.defenseProperties;

    // Validate line prediction (Parry)
    if (defenseProps?.requiresLine) {
      const attacker = defender.id === 'pc' ? this.npc : this.pc;
      const attackLine = attacker.currentAction?.skill.line;
      const predictedLine = defenseAction.linePrediction;

      if (predictedLine !== attackLine) {
        this.log(`${defender.name} Parry FAILED - wrong line (predicted ${predictedLine}, actual ${attackLine})`);
        return false;
      }
      this.log(`${defender.name} Parry SUCCESS - correct line (${attackLine})`);
    }

    // Validate attack ID prediction (Deflection)
    if (defenseProps?.requiresAttackId) {
      const attacker = defender.id === 'pc' ? this.npc : this.pc;
      const actualAttack = attacker.currentAction?.skill.id;
      const predictedAttack = defenseAction.attackPrediction;

      if (predictedAttack !== actualAttack) {
        this.log(`${defender.name} Deflection FAILED - wrong attack (predicted ${predictedAttack}, actual ${actualAttack})`);
        return false;
      }
      this.log(`${defender.name} Deflection SUCCESS - correct attack (${actualAttack})`);
    }

    this.log(
      `${defender.name} ${defenseAction.skill.name} active (${defenseAction.elapsedTime}ms) - BLOCKS attack!`
    );

    return true;
  }

  /**
   * Check if fighter should die
   * Death occurs when HP <= 0
   */
  private checkDeath(fighter: FighterState, reason: string): void {
    // Check HP
    if (fighter.resources.hp <= 0) {
      this.log(`${fighter.name} died: ${reason}`);

      // Clear current action
      fighter.currentAction = null;

      this.emitEvent({
        type: 'FIGHTER_DIED',
        fighterId: fighter.id,
        reason: reason,
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
    _fighter: FighterState,
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
  public executeSkill(
    fighterId: string,
    skillId: string,
    predictions?: {
      linePrediction?: 'high' | 'horizontal' | 'center' | 'low' | 'diagonal';
      attackPrediction?: string;
    }
  ): void {
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

    // Clear counter bonus when using any skill (encourages immediate counter-attack)
    if (fighter.activeCounterBonus) {
      this.log(`${fighter.name} counter bonus cleared (unused)`);
      fighter.activeCounterBonus = undefined;
    }

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

    // Apply counter speed bonus if available
    let windUpModifier = 0;
    if (fighter.activeCounterBonus && skill.type === 'attack') {
      windUpModifier = -fighter.activeCounterBonus; // Negative = faster
      this.log(
        `${fighter.name} uses ${fighter.activeCounterBonus}ms counter bonus: windUp ${skill.phases.windUp.duration}ms → ${skill.phases.windUp.duration + windUpModifier}ms`
      );
      fighter.activeCounterBonus = undefined; // Clear after use
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
      windUpModifier, // Add counter bonus modifier
      linePrediction: predictions?.linePrediction, // Add line prediction
      attackPrediction: predictions?.attackPrediction, // Add attack prediction
    };

    this.log(`${fighter.name} begins ${skill.name}`);
    console.log(`[GameEngine] ${fighter.name} started ${skill.name}`);

    // Start the tick interval on first action
    if (!this.ticksStarted && this.isRunning) {
      this.ticksStarted = true;
      console.log('[GameEngine] Starting tick interval (first action taken)...');
      this.log('Combat timing started');

      // Start the interval timer
      this.intervalId = window.setInterval(() => {
        this.tick();
      }, this.tickInterval);
    }

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

  /**
   * Check if a fighter can execute a feint
   *
   * Feint requires:
   * - Fighter has active attack in windUp phase
   * - canFeint flag is true
   * - Combat is paused due to opponent's telegraph
   */
  public canExecuteFeint(fighterId: string): boolean {
    const fighter = fighterId === 'pc' ? this.pc : this.npc;

    // Check if fighter has active attack
    if (!fighter.currentAction || fighter.currentAction.skill.type !== 'attack') {
      return false;
    }

    // Check if in windUp phase with canFeint enabled
    if (fighter.currentAction.currentPhase !== 'windUp' || !fighter.currentAction.canFeint) {
      return false;
    }

    // Check if paused due to opponent telegraph
    if (!this.pauseState.isPaused || this.pauseState.reason !== 'new_telegraph') {
      return false;
    }

    return true;
  }

  /**
   * Execute a feint - cancel current attack and start new attack on different line
   *
   * Feint mechanics:
   * - Costs 1.4x stamina of original attack + 3 focus + 3 daily fatigue
   * - Adds 100ms time penalty to new attack windUp
   * - Must change to different attack line
   */
  public executeFeint(fighterId: string, newAttackId: string): void {
    console.log(`[GameEngine] ${fighterId} attempting feint to ${newAttackId}`);

    const fighter = fighterId === 'pc' ? this.pc : this.npc;

    // Validate feint is possible
    if (!this.canExecuteFeint(fighterId)) {
      console.error(`[GameEngine] Cannot execute feint - conditions not met`);
      return;
    }

    const currentAction = fighter.currentAction;
    if (!currentAction) return; // TypeScript guard

    const newSkill = this.skills.get(newAttackId);
    if (!newSkill || newSkill.type !== 'attack') {
      console.error(`[GameEngine] Invalid feint target skill: ${newAttackId}`);
      return;
    }

    // Verify different line
    if (currentAction.skill.line === newSkill.line) {
      console.error(`[GameEngine] Feint must change attack line (current: ${currentAction.skill.line}, new: ${newSkill.line})`);
      this.log(`${fighter.name} feint FAILED - must change attack line`);
      return;
    }

    // Calculate feint costs
    const originalStamina = currentAction.skill.costs.stamina.base;
    const feintStaminaCost = originalStamina * 1.4;
    const feintFocusCost = 3;
    const feintFatigueCost = 3;

    // Deduct feint costs
    fighter.resources.stamina -= feintStaminaCost;
    fighter.resources.focus -= feintFocusCost;
    fighter.resources.dailyFatigue -= feintFatigueCost;

    this.log(
      `${fighter.name} FEINTS from ${currentAction.skill.name} to ${newSkill.name} (cost: ${feintStaminaCost.toFixed(1)} stam, ${feintFocusCost} focus, ${feintFatigueCost} fatigue)`
    );

    // Clear counter bonus when using feint
    if (fighter.activeCounterBonus) {
      this.log(`${fighter.name} counter bonus cleared (unused)`);
      fighter.activeCounterBonus = undefined;
    }

    // Create new action with 100ms time penalty (positive windUpModifier = slower)
    fighter.currentAction = {
      skillId: newAttackId,
      skill: newSkill,
      currentPhase: 'windUp',
      elapsedTime: 0,
      visibleTelegraphs: [],
      canCancel: newSkill.phases.windUp.canCancel,
      canFeint: newSkill.phases.windUp.canFeint,
      windUpModifier: 100, // Positive = slower (100ms penalty)
    };

    this.log(`${fighter.name} begins ${newSkill.name} with 100ms feint penalty`);
    console.log(`[GameEngine] ${fighter.name} feinted to ${newSkill.name}`);

    // Check for initial telegraphs
    this.updateTelegraphReveals(fighter);

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
      actionHistory: this.actionHistory, // Full combat history for timeline
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
