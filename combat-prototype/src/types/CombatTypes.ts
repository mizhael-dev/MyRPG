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
 * The four phases every combat action goes through
 * Based on Combat3 - atomic_turns.md specification
 */
export type CombatPhase = 'windUp' | 'committed' | 'impact' | 'recovery';

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
  stage: number;              // Telegraph sequence number (1, 2, 3, 4)
  bodyPart: string;           // Which body part shows the tell (foot, shoulders, weapon, stance)
  triggerTime: number;        // When this telegraph becomes visible (ms into action)
  visibilityPercent: number;  // How confident defender is (20%, 40%, 60%, 95%)
  description: string;        // Human-readable description
  possibleSkills: string[];   // Which skills could still match this telegraph
}

// ============================================================================
// RESOURCES
// ============================================================================

/**
 * Character resources consumed by actions
 * Based on 4-layer resource system from PRD.md
 */
export interface Resources {
  hp: number;              // Hit points (1 clean hit = death, 3 hits = death)
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
 * Complete skill definition loaded from JSON
 * Matches the structure in /CombatSkills/ folder
 */
export interface CombatSkill {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'defense' | 'special';
  school: string;
  phases: PhaseTimings;
  costs: ResourceCosts;
  telegraphs: Telegraph[];
  damage?: {
    type: string;
    baseValue: number;
    scaling?: Record<string, number>;
  };
  defensiveProperties?: {
    defenseType: string;
    damageReduction: number;
    effectiveWindow?: any;
    onSuccess?: any;
  };
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
  hitsRemaining: number;              // Hits remaining (starts at 3, clean hit = 0, non-clean = -1)
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
}

// ============================================================================
// PAUSE SYSTEM
// ============================================================================

/**
 * Why the game paused
 */
export type PauseReason =
  | 'new_telegraph'           // New telegraph became visible
  | 'possibleSkills_changed'  // Set of possible attacks narrowed
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
    possibleSkills: string[];  // What attacks opponent might do
    confidence: number;         // How certain (0-100%)
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
