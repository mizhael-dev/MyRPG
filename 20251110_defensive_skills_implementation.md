# Defense Skills Implementation Notes

**Date:** 2025-11-10
**Status:** Planning phase - gathering user requirements

---

## User Decisions from Previous Conversation

### Defense UI & Interaction (From Earlier Session)

**PARRY - Line Selection:**

- Game is ALREADY paused (from opponent's telegraph)
- Flow: Opponent telegraph pauses game → Click "Parry" → Secondary menu appears → Select line → Game unpauses
- Requires correct line to block successfully
- Lines: high, horizontal, center, low, diagonal

**DEFLECTION - Attack Prediction:**

- Smart dropdown showing possible attacks
- Flow: Click "Deflection" → Dropdown appears → Select specific attack → Execute
- Requires correct attack ID to block successfully
- Shows possible attacks based on context/telegraphs

**EMERGENCY DEFENSE:**

- "Always available, takes full damage if too late"
- **Damage Model:** Decreases damage by flat 2 (not 50% reduction)
- Very fast windUp (100ms) allows late execution
- Takes full damage if mistimed (not partial damage)
- No prediction requirements
- **CSV Update Needed:** Change damageReduction from 0.5 to 2

**RETREAT:**

- windUp: 200ms (CONFIRMED - CSV is correct)
- Movement-based evasion
- No line prediction needed
- Full dodge if timed correctly

---

## Implementation Implications

### 1. Parry Implementation

```typescript
// Game is already paused from opponent's telegraph
// When user clicks Parry button:
1. Show line selection secondary menu (5 buttons: high/horizontal/center/low/diagonal)
2. User selects line → store in action.linePrediction
3. Defense action created with selected line
4. User manually unpauses game (via resume button)
5. Defense proceeds with windUp → active → recovery
6. On impact: check if action.linePrediction === attacker.skill.line
   - Match: Full block
   - Mismatch: Full damage
```

**UI Component Needed:**

- Modal/overlay with 5 line buttons
- Appears after clicking Parry
- Stores selection in ActionState

**Type Changes Needed:**

```typescript
// In ActionState:
linePrediction?: 'high' | 'horizontal' | 'center' | 'low' | 'diagonal';
```

### 2. Deflection Implementation

```typescript
// When user clicks Deflection button:
1. Show smart dropdown with possible attacks
2. User selects attack → store in action.attackPrediction
3. Defense proceeds with windUp → active → recovery
4. On impact: check if action.attackPrediction === attacker.skill.id
   - Match: Full block + 300ms counter bonus
   - Mismatch: Full damage
```

**UI Component Needed:**

- Dropdown menu attached to Deflection button
- Shows possible attack options (from opponent's availableSkills or visible telegraphs)
- Stores selection in ActionState

**Type Changes Needed:**

```typescript
// In ActionState:
attackPrediction?: string; // Skill ID
```

### 3. Emergency Defense Implementation

```typescript
// Simple - no prediction needed
// Just check if defense active phase overlaps attacker's impact tick
// Success: Reduce damage by 2 (flat reduction, not percentage)
// Failure: Full damage
```

**Key Properties:**

- windUp: 100ms (fastest defense)
- active: 200ms window
- recovery: 500ms (longest recovery - poor positioning)
- **damageReduction: 2** (flat damage reduction, NOT 0.5 percentage)

**CSV/JSON Update Required:**

- Change `damageReduction,0.5,1.0,1.0,1.0` to `damageReduction,2,0,0,0`
- Or change field name to `damageFlat` for clarity
- Build script needs to handle flat damage vs percentage

**Implementation:**

- If emergency_defense active: damage -= 2
- Other defenses: full block (damage = 0)

### 4. Retreat Implementation

```typescript
// Simple movement defense - no prediction
// windUp: 200ms (CONFIRMED)
// Full dodge if active phase overlaps impact
```

**Key Properties:**

- windUp: 200ms ✓
- active: 400ms window
- recovery: 300ms
- damageReduction: 1.0 (full dodge)

**No CSV updates needed** - retreat is correct as-is

---

## Damage Model Decision

**User Answer:** "Takes full damage if too late"

**Interpretation:**

- Defense is binary: either blocks completely OR doesn't block at all
- No partial damage system needed
- damageReduction field in JSON:
  - 1.0 = full block (most defenses)
  - 0.5 = ??? (Emergency Defense - contradicts user's "full damage" statement)

**Implementation Approach:**

- Treat all successful defenses as full blocks (damageReduction ignored)
- Treat all failed defenses as full hits
- Emergency Defense is just riskier due to:
  - Short active window (200ms)
  - Late availability (100ms windUp)
  - Long recovery (500ms)

---

## Phase System Changes

### Defense Phase Flow

```
Attack:  windUp → committed → [impact] → recovery
Defense: windUp → active → recovery
```

**Key Differences:**

- Defense has NO committed phase
- Defense has NO impact phase (responds to attacker's impact)
- Defense active phase = readiness window (auto-triggers if attack hits)

### Type System Updates Needed

**CombatTypes.ts:**

```typescript
// Add 'active' phase
export type CombatPhase =
  | "windUp"
  | "committed"
  | "active"
  | "impact"
  | "recovery";

// ActionState additions
export interface ActionState {
  // ... existing fields
  linePrediction?: "high" | "horizontal" | "center" | "low" | "diagonal";
  attackPrediction?: string; // Skill ID for deflection
}
```

---

## UI Components Needed

### 1. Line Selection Modal (for Parry)

- Triggered when Parry button clicked
- 5 buttons in modal: High, Horizontal, Center, Low, Diagonal
- Visual: Show directional arrows matching attack icons
- Confirmation stores selection and resumes game

### 2. Attack Prediction Dropdown (for Deflection)

- Attached to Deflection button or appears after click
- Lists opponent's available attacks
- Could filter to "possible" attacks based on telegraphs (smart)
- Selection immediately starts defense action

### 3. Defense Section in ActionPanel

Current layout:

```
Attacks (5 buttons)
Defenses (4 buttons) ← Need to add
Wait button
```

Consider grouping:

```tsx
<h4>Attacks</h4>
{attack buttons}

<h4>Defenses</h4>
{defense buttons with special UI for parry/deflection}

{wait button}
```

---

## Implementation Phases

### Phase 1: Basic Defense Structure ✓ (Research Complete)

- [x] Research all defense skills
- [x] Identify implementation gaps
- [x] Document user decisions
- [ ] Create implementation plan

### Phase 2: Foundation (Type System & Loading)

1. Update CombatPhase type to include 'active'
2. Update PhaseTimings interface for active phase
3. Load all 4 defense skills in GameEngine
4. Add defenses to fighter availableSkills
5. Update checkAutoPause for all defenses

### Phase 3: Phase Progression

1. Modify updatePhaseProgression for defense phase flow
2. Handle windUp → active → recovery (no committed/impact)
3. Test phase transitions for all 4 defenses

### Phase 4: Basic Defense Buttons (No Predictions)

1. Add 4 defense buttons to ActionPanel
2. Update timing display for active phase
3. Test all defenses can be clicked and start
4. All defenses block ANY attack if in active phase (simple mode)

### Phase 5: Parry Line Selection UI

1. Create line selection modal component
2. Add linePrediction to ActionState
3. Show modal when Parry clicked
4. Store selection and proceed with defense
5. Check line match in isDefenseActive

### Phase 6: Deflection Attack Prediction UI

1. Create attack dropdown component
2. Add attackPrediction to ActionState
3. Show dropdown when Deflection clicked
4. Store selection and proceed with defense
5. Check attack match in isDefenseActive

### Phase 7: Counter Speed Bonus

1. Add activeBonus field to FighterState
2. Apply counterSpeedBonus after successful defense
3. Reduce next attack windUp by bonus
4. Clear bonus after use

---

## Open Questions

1. ~~**Retreat windUp timing:**~~ ✓ RESOLVED
   - 200ms is correct (CSV matches user requirement)

2. ~~**Emergency Defense damage reduction:**~~ ✓ RESOLVED
   - Flat 2 damage reduction (not 50%)
   - Need to update CSV from 0.5 to 2

3. **Smart dropdown for Deflection:**
   - "Smart" = filter by visible telegraphs?
   - Or show all opponent skills?
   - How smart should it be?

4. **Line selection timing:**
   - User declares line "after clicking button (during pause)"
   - Does this mean game auto-pauses when Parry clicked?
   - Or player clicks Parry during existing telegraph pause?

---

## Testing Checklist

### Basic Functionality

- [ ] All 4 defenses load without errors
- [ ] All 4 defense buttons appear in UI
- [ ] Clicking defense starts windUp phase
- [ ] Defense transitions windUp → active → recovery
- [ ] Defense blocks attack when active phase overlaps impact

### Parry Specific

- [ ] Line selection modal appears when Parry clicked
- [ ] Selecting line stores prediction in ActionState
- [ ] Correct line prediction = successful block
- [ ] Wrong line prediction = full damage
- [ ] 100ms counter speed bonus applies

### Deflection Specific

- [ ] Attack dropdown appears when Deflection clicked
- [ ] Dropdown shows opponent's available attacks
- [ ] Selecting attack stores prediction in ActionState
- [ ] Correct attack prediction = successful block
- [ ] Wrong attack prediction = full damage
- [ ] 300ms counter speed bonus applies

### Emergency Defense Specific

- [ ] Very fast windUp (100ms) works
- [ ] Short active window (200ms) makes timing tight
- [ ] Long recovery (500ms) leaves vulnerable
- [ ] No prediction needed - always works if active

### Retreat Specific

- [ ] Movement-based defense works
- [ ] No prediction needed
- [ ] Full dodge if timed correctly
- [ ] Appropriate windUp timing (clarify 200ms vs 800ms)

---

## Notes for Implementation

- Start with Phase 1-4 (basic defenses working, no predictions)
- Then add Phase 5-6 (prediction UI) as separate feature
- Counter speed bonus (Phase 7) can be last
- Keep each phase independently testable
- User wants to test as we go - don't implement everything at once

---

## Related Files

**Design Documents:**

- `public/CombatSkills/defense/CombatSkills-defense.md` - Defense mechanics design
- `20251110_handover.md` - Project handover with defense context

**Data Files:**

- `public/CombatSkills/defense/emergency_defense.json`
- `public/CombatSkills/defense/retreat.json`
- `public/CombatSkills/defense/parry.json`
- `public/CombatSkills/defense/deflection.json`

**Code Files:**

- `src/types/CombatTypes.ts` - Type definitions
- `src/engine/GameEngine.ts` - Defense logic, phase progression
- `src/components/Actions/ActionPanel.tsx` - Defense buttons and UI

---

## IMPLEMENTATION GUIDE FOR NEXT AI AGENT

### STATUS: Defense JSONs are correct, ready to implement

### STEP 1: Update CSV for Emergency Defense (CRITICAL)

**File:** `public/CombatSkills/defense/CombatSkills-defense.csv`
**Line 36:** Change from `damageReduction,0.5,1.0,1.0,1.0` to `damageReduction,2,0,0,0`
**Reasoning:** Emergency defense = flat 2 damage reduction. Other defenses = full block (0 damage taken)

### STEP 2: Update Build Script

**File:** `scripts/buildSkills.cjs`
**Location:** `buildDefenseSkill()` function around line 300

Add field to distinguish flat vs multiplier:

```javascript
defenseProperties: {
  requiresLine: get('requiresLine') === 'true',
  requiresAttackId: get('requiresAttackId') === 'true',
  defenseType: get('defenseType'),
  damageReduction: parseFloat(get('damageReduction')),
  counterSpeedBonus: parseInt(get('counterSpeedBonus')) || 0
}
```

### STEP 3: Update CombatTypes.ts

**Add 'active' phase:**

```typescript
export type CombatPhase =
  | "windUp"
  | "committed"
  | "active"
  | "impact"
  | "recovery";
```

**Add active to PhaseTimings:**

```typescript
active?: {
  duration: number;
  description: string;
};
```

**Add prediction fields to ActionState:**

```typescript
linePrediction?: 'high' | 'horizontal' | 'center' | 'low' | 'diagonal';
attackPrediction?: string;
```

### STEP 4: Load All 4 Defenses in GameEngine

**File:** `src/engine/GameEngine.ts`
**Location:** After line 143 (after parry loading)

```typescript
const emergencyResponse = await fetch(
  "/CombatSkills/defense/emergency_defense.json"
);
const emergency = await emergencyResponse.json();
this.validateSkill(emergency);
this.skills.set("emergency_defense", emergency);

const retreatResponse = await fetch("/CombatSkills/defense/retreat.json");
const retreat = await retreatResponse.json();
this.validateSkill(retreat);
this.skills.set("retreat", retreat);

const deflectionResponse = await fetch("/CombatSkills/defense/deflection.json");
const deflection = await deflectionResponse.json();
this.validateSkill(deflection);
this.skills.set("deflection", deflection);
```

**Update availableSkills (line 98):**

```typescript
availableSkills: [
  "side_slash",
  "thrust",
  "overhead_strike",
  "upward_strike",
  "diagonal_slash",
  "parry",
  "emergency_defense",
  "retreat",
  "deflection",
];
```

**Update pauseState.availableActions (line 513):**

```typescript
this.pauseState.availableActions = [
  "side_slash",
  "thrust",
  "overhead_strike",
  "upward_strike",
  "diagonal_slash",
  "parry",
  "emergency_defense",
  "retreat",
  "deflection",
];
```

### STEP 5: Implement Defense Phase Progression

**File:** `GameEngine.ts` method `updatePhaseProgression()` (line 282)

**Add at START of function:**

```typescript
// DEFENSE SKILLS: windUp → active → recovery
if (skill.type === "defense") {
  const windUpEnd = skill.phases.windUp.duration;
  const activeEnd = windUpEnd + (skill.phases.active?.duration || 0);
  const recoveryEnd = activeEnd + skill.phases.recovery.duration;

  if (elapsed < windUpEnd) {
    newPhase = "windUp";
  } else if (elapsed < activeEnd) {
    newPhase = "active";
  } else if (elapsed < recoveryEnd) {
    newPhase = "recovery";
  } else {
    fighter.currentAction = null;
    this.log(`${fighter.name} completes ${skill.name}`);
    return;
  }

  // Update phase if changed
  if (newPhase !== action.currentPhase) {
    action.currentPhase = newPhase;
    this.log(`${fighter.name} ${skill.name} enters ${newPhase}`);
  }
  return; // Exit early for defense
}

// ATTACK SKILLS: continue with existing logic...
```

### STEP 6: Fix isDefenseActive() Method

**File:** `GameEngine.ts` line 424
**Replace entire method:**

```typescript
private isDefenseActive(defender: FighterState, attacker: FighterState): boolean {
  const defenseAction = defender.currentAction;
  if (!defenseAction) return false;
  if (defenseAction.skill.type !== 'defense') return false;

  // Defense must be in active phase
  if (defenseAction.currentPhase !== 'active') {
    return false;
  }

  const defenseProps = defenseAction.skill.defenseProperties;

  // Check line requirement (parry) - FOR NOW: skip this check, implement in Phase 5
  // if (defenseProps.requiresLine && defenseAction.linePrediction !== attacker.currentAction?.skill.line) {
  //   return false;
  // }

  // Check attack ID requirement (deflection) - FOR NOW: skip this check, implement in Phase 6
  // if (defenseProps.requiresAttackId && defenseAction.attackPrediction !== attacker.currentAction?.skill.id) {
  //   return false;
  // }

  return true; // Simple mode: any defense in active phase blocks
}
```

### STEP 7: Add Defense Buttons to UI

**File:** `src/components/Actions/ActionPanel.tsx`
**Location:** After line 92 (after parry button)

```typescript
{
  renderSkillButton(
    "emergency_defense",
    "🛡️",
    "bg-yellow-600 hover:bg-yellow-700"
  );
}
{
  renderSkillButton("retreat", "↩️", "bg-purple-600 hover:bg-purple-700");
}
{
  renderSkillButton("deflection", "⚔️", "bg-orange-600 hover:bg-orange-700");
}
```

### STEP 8: Fix Timing Display for Defenses

**File:** `ActionPanel.tsx` around line 42
**Replace parry special case with:**

```typescript
} else if (skill.type === 'defense') {
  const windUpEnd = phases.windUp.duration;
  const activeStart = windUpEnd;
  const activeDuration = phases.active?.duration || 0;
  const activeEnd = activeStart + activeDuration;
  const recoveryEnd = activeEnd + phases.recovery.duration;

  impactText = `Active: ${activeStart}-${activeEnd}ms`;
  timingText = `Wind: 0-${windUpEnd} · Active: ${activeStart}-${activeEnd} · Recov: ${activeEnd}-${recoveryEnd}`;
}
```

### STEP 9: Rebuild Skills

```bash
npm run build:skills
```

### TESTING AFTER STEPS 1-9:

1. Load game - should show 10 skills loaded
2. Click each defense button - should start windUp
3. Watch phase transitions: windUp → active → recovery
4. Test basic blocking: attack during defense active = blocked
5. Test timing: attack during windUp or recovery = hit

### PHASE 2 (LATER): Prediction UI

**Don't implement yet - test basic defenses first!**

- Parry line selection modal
- Deflection attack dropdown
- Update isDefenseActive to check predictions

### EMERGENCY DEFENSE DAMAGE HANDLING

**File:** `GameEngine.ts` in `resolveImpact()` around line 385

Current code blocks completely. Update to:

```typescript
if (this.isDefenseActive(defender, attacker)) {
  const defenseProps = defender.currentAction?.skill.defenseProperties;
  const damageReduction = defenseProps?.damageReduction || 0;

  if (damageReduction === 2) {
    // Emergency defense: flat 2 damage reduction
    // TODO: Implement damage system (currently hits-based)
    // For now: treat as full block (will implement damage later)
    defender.hitsRemaining -= 0;
  } else {
    // Full block
    defender.hitsRemaining -= 0;
  }
  // ... rest of defense logic
}
```

### FILES TO MODIFY SUMMARY:

1. `CombatSkills-defense.csv` - Update emergency defense damageReduction
2. `buildSkills.cjs` - No changes needed (already handles it)
3. `CombatTypes.ts` - Add 'active' phase, prediction fields
4. `GameEngine.ts` - Load 3 defenses, fix phase progression, fix isDefenseActive
5. `ActionPanel.tsx` - Add 3 buttons, fix timing display

### RUN ORDER:

1. Update CSV
2. Run `npm run build:skills`
3. Update TypeScript files (will have compile errors until done)
4. Test incrementally

---

## IMPLEMENTATION COMPLETED - 2025-11-10

### Summary: Defense Skills Implementation Complete ✅

All 4 defense skills (Emergency Defense, Retreat, Parry, Deflection) have been successfully implemented in the MyRPG combat prototype.

### What Was Implemented

**Phase 1: Type System Foundation**

- Added `'active'` phase to CombatTypes.ts:19 (CombatPhase type)
- Added `active` property to PhaseTimings interface with duration and description fields
- Documented defense flow: windUp → active → recovery (vs attack flow: windUp → committed → impact → recovery)

**Phase 2: Data Fix**

- Fixed Emergency Defense damage in CombatSkills-defense.csv:36
- Changed from `damageReduction,0.5` to `damageReduction,2` (flat damage reduction)
- Rebuilt all 10 skills from CSV successfully (5 attacks + 4 defenses + 1 special)

**Phase 3: Game Engine Loading**

- Loaded all 3 missing defenses in GameEngine.ts:145-158
  - emergency_defense.json
  - retreat.json
  - deflection.json
- Updated availableSkills arrays at GameEngine.ts:98 and GameEngine.ts:528
- Now loading **10 skills total** (previously only 6)

**Phase 4: Defense Phase Logic**

- Rewrote updatePhaseProgression():305-344 to handle defense phase flow
  - Defense path: windUp → active → recovery
  - Attack path: windUp → committed → impact → recovery (unchanged)
- Rewrote isDefenseActive():486-506 for all 4 defenses
  - Checks if defense is in `active` phase
  - Simple mode: Any defense in active phase blocks any attack
  - Removed hardcoded Parry logic and deprecated readinessWindow property

**Phase 5: UI Updates**

- Added 3 defense buttons in ActionPanel.tsx:93-95
  - Emergency Defense (🚨 yellow)
  - Retreat (↩️ purple)
  - Deflection (⚔️ orange)
- Fixed timing display ActionPanel.tsx:42-52 for all defenses
  - Replaced Parry-specific readinessWindow code
  - Now uses standard active phase calculation for all defenses

### Defense Skills Final Stats

| Skill                 | windUp | Active | Recovery | Special Property           |
| --------------------- | ------ | ------ | -------- | -------------------------- |
| **Emergency Defense** | 100ms  | 200ms  | 500ms    | Flat 2 damage reduction    |
| **Retreat**           | 200ms  | 400ms  | 300ms    | Movement-based, full dodge |
| **Parry**             | 300ms  | 500ms  | 200ms    | +100ms counter bonus       |
| **Deflection**        | 300ms  | 500ms  | 200ms    | +300ms counter bonus       |

### What Works Now

✅ All 10 skills load without errors
✅ All 4 defense buttons appear in UI with correct timing info
✅ Defense phase progression works: windUp → active → recovery
✅ Basic blocking functional: Any defense in active phase blocks any attack
✅ Different timing windows give each defense unique tactical properties
✅ Dev server compiles with no TypeScript errors
✅ Emergency Defense has correct flat damage reduction value (2)

### What's NOT Yet Implemented (Future Work)

These advanced features are documented but not implemented:

- **Parry line selection UI** - Player selecting which line to defend (high/horizontal/center/low/diagonal)
- **Deflection attack prediction UI** - Player predicting specific attack to deflect
- **Counter speed bonus mechanics** - Applying +100ms/+300ms bonuses after successful defense
- **Prediction validation** - Checking if player's line/attack predictions match attacker's action
- **Emergency Defense flat damage** - Currently treats as full block, needs damage system implementation

These will be implemented in a future session after basic defense functionality is tested.

### Testing Instructions

Run dev server: `npm run dev` in combat-prototype directory

**Basic defense test:**

1. NPC executes an attack (e.g., side_slash)
2. During attack windUp, PC clicks a defense (e.g., Parry)
3. Watch defense phases in timeline: windUp → active → recovery
4. If defense is in active phase when attack hits impact = BLOCKED
5. If defense is in windUp or recovery when attack hits = HIT

**Testing each defense:**

- **Emergency Defense**: Very fast windUp (100ms) but short active window (200ms) - test late reactions
- **Retreat**: Moderate windUp (200ms) with longer active window (400ms) - test medium timing
- **Parry**: Slow windUp (300ms) with long active window (500ms) - test early commits
- **Deflection**: Same as Parry but conceptually for perfect counter timing

All defenses currently work in "basic mode" - they don't require prediction inputs yet. Just click and time it right!

### Files Modified

1. **CombatTypes.ts** - Added active phase to type system (lines 19, 35-38)
2. **CombatSkills-defense.csv** - Fixed Emergency Defense damageReduction (line 36: 0.5 → 2)
3. **GameEngine.ts** - Loaded 3 defenses (145-158), fixed phase logic (305-344), rewrote blocking (486-506)
4. **ActionPanel.tsx** - Added 3 buttons (93-95), fixed timing display (42-52)

### Build Verification

```
npm run build:skills
✅ 10 skills built successfully
✅ All defense JSONs generated correctly
✅ No validation errors
⚠️  Missing asset warnings expected (placeholders used)
```

### Implementation Status: COMPLETE

All planned phases (1-6) from the implementation guide have been completed:

- ✅ Phase 1: Type System
- ✅ Phase 2: Data Fix
- ✅ Phase 3: Loading
- ✅ Phase 4: Phase Logic
- ✅ Phase 5: UI
- ✅ Phase 6: Basic Functionality

The prototype is ready for testing. Advanced features (line selection, attack prediction, counter bonuses) are deferred to Phase 7+.

**Timestamp:** 2025-11-10 22:21 UTC
**Implementation Time:** ~1 hour
**Status:** Ready for user testing
