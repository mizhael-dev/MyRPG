/**
 * Core TypeScript type definitions for the combat system
 *
 * These types define the structure of your combat data.
 * Understanding these types is key to understanding the entire system.
 */

// ============================================================================
// COMBAT PHASES
// ============================================================================

/**
 * The phases combat actions go through
 * Based on Combat3 - atomic_turns.md specification
 *
 * Attack flow: windUp → committed → impact → recovery
 * Defense flow: windUp → active → recovery
 */
export type CombatPhase = 'windUp' | 'committed' | 'active' | 'impact' | 'recovery';

/**
 * Phase timing information from skill JSON
 */
export interface PhaseTimings {
  windUp: {
    duration: number;      // How long wind-up lasts (ms)
    canCancel: boolean;    // Can action be cancelled?
    canFeint: boolean;     // Can action be feinted?
  };
  committed: {
    duration: number;      // How long committed phase lasts (ms)
    canCancel: boolean;    // Always false - cannot cancel once committed
    canFeint: boolean;     // Always false
  };
  active?: {
    duration: number;      // How long defense active window lasts (ms) - only for defenses
    description: string;   // Description of active phase
  };
  impact: {
    tick: number;          // Exact ms when impact occurs
  };
  recovery: {
    duration: number;      // How long recovery lasts (ms)
  };
}

// ============================================================================
// TELEGRAPHS
// ============================================================================

/**
 * A single telegraph stage that reveals information about an attack
 */
export interface Telegraph {
  stage: number;              // Telegraph sequence number (1, 2, 3, 4, ...)
  assetId: string;            // Reference to shared asset (e.g., "shoulders_tense")
  bodyPart: string;           // Which body part shows the tell (foot, shoulders, weapon, stance)
  triggerTime: number;        // When this telegraph becomes visible (ms into action)
  description: string;        // Human-readable description
  pause?: boolean;            // Whether to auto-pause when this telegraph is revealed
}

// ============================================================================
// RESOURCES
// ============================================================================

/**
 * Character resources consumed by actions
 * Based on 4-layer resource system from PRD.md
 */
export interface Resources {
  hp: number;              // Hit points (character dies when HP <= 0)
  stamina: number;         // Physical energy
  mp: number;              // Magic points
  focus: number;           // Mental clarity
  dailyFatigue: number;    // Long-term exhaustion
}

/**
 * Maximum resource capacity
 */
export interface MaxResources {
  maxHp: number;
  maxStamina: number;
  maxMp: number;
  maxFocus: number;
  maxDailyFatigue: number;
}

/**
 * Resource costs for an action
 */
export interface ResourceCosts {
  stamina: {
    base: number;
    variablePower?: {
      min: number;  // 50% less stamina
      max: number;  // 50% more stamina
    };
  };
  mp: number;
  focus: number;           // Calculated: MP cost + Stamina cost
  dailyFatigue: number;    // Calculated: MP cost + Stamina cost
}

// ============================================================================
// COMBAT SKILLS (from JSON)
// ============================================================================

/**
 * Defense-specific properties for defensive skills
 */
export interface DefenseProperties {
  requiresLine?: boolean;        // Parry needs line selection (horizontal/center/diagonal/high/low)
  requiresAttackId?: boolean;    // Deflection needs specific attack prediction
  defenseType: 'emergency' | 'movement' | 'deflection';
  damageReductionFlat: number;   // Flat damage reduction in points (e.g., 2.00 = reduces 2 damage, 3.00 = reduces 3 damage)
  damageReductionPercent: number; // Percentage damage reduction (e.g., 0.50 = 50% reduction, 1.00 = 100% block)
  counterSpeedBonus?: number;    // Ms reduction to next attack windUp (e.g., 100 for deflection)
}

/**
 * Complete skill definition loaded from JSON
 * Matches the structure in /CombatSkills/ folder
 */
export interface CombatSkill {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'defense' | 'special';
  line: 'horizontal' | 'center' | 'diagonal' | 'high' | 'low';  // Attack direction for targeting
  school: string;
  phases: PhaseTimings;
  costs: ResourceCosts;
  telegraphs: Telegraph[];
  damage?: {
    type: string;
    baseValue: number;
    scaling?: Record<string, number>;
  };
  defenseProperties?: DefenseProperties;
  metadata: {
    weaponTypes: string[];
    tags: string[];
    learningDifficulty: string;
    notes?: string;
  };
}

// ============================================================================
// FIGHTER STATE
// ============================================================================

/**
 * Complete state of a combatant
 */
export interface FighterState {
  id: string;
  name: string;
  resources: Resources;
  maxResources: MaxResources;
  currentAction: ActionState | null;  // What they're doing right now
  availableSkills: string[];          // Skill IDs they can use
  activeCounterBonus?: number;        // Ms reduction to next attack windUp (from successful defense)
}

// ============================================================================
// ACTION STATE
// ============================================================================

/**
 * State of an action in progress
 */
export interface ActionState {
  skillId: string;
  skill: CombatSkill;
  currentPhase: CombatPhase;
  elapsedTime: number;              // How long action has been running (ms)
  visibleTelegraphs: Telegraph[];   // Telegraphs visible to opponent
  canCancel: boolean;               // Can this action still be cancelled?
  canFeint: boolean;                // Can this action still be feinted?
  linePrediction?: 'high' | 'horizontal' | 'center' | 'low' | 'diagonal'; // Parry line selection
  attackPrediction?: string;        // Deflection attack ID prediction
  windUpModifier?: number;          // Ms adjustment for counter bonus (negative = faster)
}

// ============================================================================
// ACTION HISTORY
// ============================================================================

/**
 * A completed or in-progress combat action
 * Used to render phase-colored bars on the timeline
 */
export interface ActionHistoryEntry {
  fighterId: 'pc' | 'npc';          // Which fighter performed this action
  skill: CombatSkill;                // The skill that was used
  startTick: number;                 // When action started (milliseconds)
  endTick: number;                   // When action ended (milliseconds)

  // Pre-calculated phase end times for fast rendering
  phases: {
    windUpEnd: number;               // When wind-up phase ended (ms)
    committedEnd?: number;           // When committed phase ended (ms) - attacks only
    activeEnd?: number;              // When active phase ended (ms) - defenses only
    impactTick?: number;             // When impact occurred (ms) - attacks only
    recoveryEnd: number;             // When recovery phase ended (ms)
  };

  windUpModifier?: number;           // Counter speed bonus applied (negative = faster)
}

// ============================================================================
// PAUSE SYSTEM
// ============================================================================

/**
 * Why the game paused
 */
export type PauseReason =
  | 'new_telegraph'           // New telegraph became visible
  | 'option_expiring'         // Decision window closing
  | 'manual';                 // Player pressed pause

/**
 * Information shown during pause
 */
export interface PauseState {
  isPaused: boolean;
  reason: PauseReason | null;
  availableActions: string[];  // What actions player can take
  prediction: {
    estimatedImpactRange: {
      min: number;              // Earliest possible impact (ms)
      max: number;              // Latest possible impact (ms)
    };
  } | null;
}

// ============================================================================
// TIMELINE STATE
// ============================================================================

/**
 * Complete game state at a point in time
 * This is what the UI displays
 */
export interface GameState {
  currentTick: number;        // Current time in ms
  pc: FighterState;           // Player character
  npc: FighterState;          // Non-player character (opponent)
  pauseState: PauseState;     // Is game paused? Why?
  combatLog: string[];        // Event log for debugging
  loadedSkills: Map<string, CombatSkill>; // All loaded skills from JSON
  actionHistory: ActionHistoryEntry[];    // Full combat history for timeline rendering
}

// ============================================================================
// EVENTS
// ============================================================================

/**
 * Events emitted by GameEngine
 * React components listen to these to update UI
 */
export type GameEvent =
  | { type: 'STATE_UPDATE'; state: GameState }
  | { type: 'PAUSE_TRIGGERED'; pauseState: PauseState }
  | { type: 'TELEGRAPH_REVEALED'; telegraph: Telegraph; fighterId: string }
  | { type: 'PHASE_CHANGED'; fighterId: string; newPhase: CombatPhase }
  | { type: 'IMPACT_RESOLVED'; attacker: string; defender: string; hit: boolean }
  | { type: 'FIGHTER_DIED'; fighterId: string; reason: string };

/**
 * Event listener callback type
 */
export type EventListener = (event: GameEvent) => void;
