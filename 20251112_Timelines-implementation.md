# Timeline System Implementation Guide

**Date:** 2025-11-12
**Status:** Implementation in progress
**Goal:** Implement scrollable, time-based timeline visualization with phase-colored bars

---

## 🎯 Overview

This document describes how to implement the new timeline system that shows combat actions as colored bars on a scrollable horizontal timeline.

**Key Features:**
- Scrollable timeline showing full combat history
- Phase-colored bars (green/yellow/grey/red)
- Auto-scroll behavior (follows "now" unless user scrolls back)
- 5 synchronized timebars (PC_actual, PC_seen_by_NPC, NPC_actual, NPC_seen_by_PC, Combined)
- Responsive width with configurable zoom
- Action history tracking

---

## ⚙️ Configuration

All timeline behavior is controlled by constants at the top of `TimelinePanel.tsx`:

```typescript
// ============================================================================
// TIMELINE CONFIGURATION
// ============================================================================
//
// Adjust these values to change how the timeline looks and behaves.
// No technical knowledge required - just change the numbers!
//
// ============================================================================

const TIMELINE_CONFIG = {
  // -------------------------------------------------------------------------
  // TIME WINDOW SETTINGS
  // -------------------------------------------------------------------------

  // PAST_MS: How many milliseconds of history to show by default
  // Example: 1000 = show 1 second of past actions
  PAST_MS: 1000,

  // ZOOM_MS: Total visible timeframe in milliseconds
  // This is the "width" of the timeline window you're looking through
  // Example: 3000 = see 3 seconds at once (1 second past + 2 seconds future)
  ZOOM_MS: 3000,

  // VALIDATION: PAST_MS must be smaller than ZOOM_MS
  // (You can't show more past than your total window!)

  // -------------------------------------------------------------------------
  // RENDERING DETAIL SETTINGS
  // -------------------------------------------------------------------------

  // These control how "zoomed in" or "zoomed out" the timeline appears
  // Higher numbers = more detail (zoomed in), Lower numbers = less detail (zoomed out)

  // MIN_PX_PER_MS: Minimum detail level (prevents zooming out too far)
  // Example: 0.1 means 1 pixel = 10 milliseconds
  MIN_PX_PER_MS: 0.1,

  // MAX_PX_PER_MS: Maximum detail level (prevents zooming in too far)
  // Example: 1.0 means 1 pixel = 1 millisecond
  MAX_PX_PER_MS: 1.0,

  // DEFAULT_PX_PER_MS: Default detail level (good balance)
  // Example: 0.3 means 1 pixel = 3.33 milliseconds
  DEFAULT_PX_PER_MS: 0.3,

  // -------------------------------------------------------------------------
  // SCROLL BEHAVIOR SETTINGS
  // -------------------------------------------------------------------------

  // AUTO_SCROLL_BUFFER: How close to the edge counts as "at the end"
  // Timeline auto-scrolls only when you're this close to the right edge
  // Example: 10 = within 10 pixels of the edge
  AUTO_SCROLL_BUFFER: 10,

  // -------------------------------------------------------------------------
  // VISUAL APPEARANCE SETTINGS
  // -------------------------------------------------------------------------

  // NOW_LINE_WIDTH: Width of the black "now" indicator line
  // Example: 2 = 2 pixels wide
  NOW_LINE_WIDTH: 2,

  // TIMEBAR_HEIGHT: Height of each individual timebar
  // Example: 30 = 30 pixels tall
  TIMEBAR_HEIGHT: 30,

  // TIMEBAR_SPACING: Vertical gap between timebars
  // Example: 8 = 8 pixels of space
  TIMEBAR_SPACING: 8,
};

// Validation check (will show error in browser console if wrong)
if (TIMELINE_CONFIG.PAST_MS > TIMELINE_CONFIG.ZOOM_MS) {
  console.error('Configuration Error: PAST_MS cannot be greater than ZOOM_MS');
}
```

### What Each Setting Does:

| Setting | What It Controls | Example |
|---------|------------------|---------|
| `PAST_MS` | How much history is visible by default | `1000` = 1 second of past |
| `ZOOM_MS` | Total visible time window | `3000` = 3 seconds visible |
| `MIN_PX_PER_MS` | Maximum zoom out level | `0.1` = 1px = 10ms |
| `MAX_PX_PER_MS` | Maximum zoom in level | `1.0` = 1px = 1ms |
| `DEFAULT_PX_PER_MS` | Starting detail level | `0.3` = 1px = 3.33ms |
| `AUTO_SCROLL_BUFFER` | Auto-scroll trigger distance | `10` = 10px from edge |
| `NOW_LINE_WIDTH` | "Now" indicator thickness | `2` = 2 pixels wide |
| `TIMEBAR_HEIGHT` | Height of each bar | `30` = 30 pixels tall |
| `TIMEBAR_SPACING` | Gap between bars | `8` = 8 pixels gap |

---

## 🏗️ Architecture

### System Components:

```
GameEngine.ts
  ↓ Tracks actions
  ↓ Stores history
  ↓ Emits state updates
  ↓
TimelinePanel.tsx
  ↓ Receives gameState with actionHistory
  ↓ Calculates timeline dimensions
  ↓ Renders 5 timebars
  ↓
User sees scrollable timeline
```

### Data Flow:

1. **Action Starts:** User clicks skill button → GameEngine.executeSkill()
2. **Action Progresses:** GameEngine.tick() updates action.elapsedTime
3. **Action Completes:** GameEngine detects completion → pushes to actionHistory
4. **UI Updates:** React re-renders TimelinePanel with new actionHistory
5. **Timeline Scrolls:** Auto-scroll keeps "now" visible (if user is pinned to latest)

---

## 📊 Data Structures

### ActionHistoryEntry Interface

Location: `combat-prototype/src/types/CombatTypes.ts`

```typescript
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
```

### Updated GameState Interface

Location: `combat-prototype/src/types/CombatTypes.ts`

```typescript
export interface GameState {
  currentTick: number;
  pc: FighterState;
  npc: FighterState;
  pauseState: PauseState;
  combatLog: string[];
  loadedSkills: Map<string, CombatSkill>;
  actionHistory: ActionHistoryEntry[];  // NEW - full combat history
}
```

---

## 🎨 Rendering Algorithm

### Step 1: Calculate Timeline Dimensions

```typescript
// Get container width (responsive to screen size)
const containerRef = useRef<HTMLDivElement>(null);
const [containerWidth, setContainerWidth] = useState(800);

useEffect(() => {
  const updateWidth = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  };
  updateWidth();
  window.addEventListener('resize', updateWidth);
  return () => window.removeEventListener('resize', updateWidth);
}, []);

// Calculate pixel-to-millisecond ratio (Hybrid Approach)
const pxPerMs = Math.min(
  Math.max(
    containerWidth / TIMELINE_CONFIG.ZOOM_MS,  // Responsive: fill container
    TIMELINE_CONFIG.MIN_PX_PER_MS              // Enforce minimum (prevent too much zoom out)
  ),
  TIMELINE_CONFIG.MAX_PX_PER_MS                // Enforce maximum (prevent too much zoom in)
);

// Calculate total timeline width (past + present + future)
const futureBuffer = 5000; // Show 5 seconds into the future
const timelineWidthPx = (gameState.currentTick + futureBuffer) * pxPerMs;

// Calculate "now" line position
const nowPositionPx = gameState.currentTick * pxPerMs;
```

**How Hybrid Approach Works:**

1. Container width = 900px, ZOOM_MS = 3000ms
2. Initial calculation: `900 / 3000 = 0.3` pixels per ms
3. Check bounds: `0.3` is between `MIN (0.1)` and `MAX (1.0)` ✓
4. Result: Use `0.3` px/ms ratio
5. If container resizes to 300px: `300 / 3000 = 0.1` (hits minimum, stays at 0.1)
6. If container resizes to 6000px: `6000 / 3000 = 2.0` (exceeds maximum, caps at 1.0)

**Benefits:**
- Timeline fills available space on any screen size
- Prevents extreme zoom levels (too much/too little detail)
- Adjusting `ZOOM_MS` changes visible time window
- Easy to add zoom controls later

### Step 2: Prepare Action Data

```typescript
// Combine history + current actions
const pcActions = [...(gameState.actionHistory?.filter(a => a.fighterId === 'pc') || [])];
const npcActions = [...(gameState.actionHistory?.filter(a => a.fighterId === 'npc') || [])];

// Add current in-progress actions
if (gameState.pc.currentAction) {
  pcActions.push(convertCurrentActionToHistoryEntry(gameState.pc.currentAction, 'pc', gameState.currentTick));
}
if (gameState.npc.currentAction) {
  npcActions.push(convertCurrentActionToHistoryEntry(gameState.npc.currentAction, 'npc', gameState.currentTick));
}
```

### Step 3: Render Phase Bars

```typescript
/**
 * Renders an action as phase-colored bars
 *
 * @param action - The action to render
 * @param yOffset - Vertical position (which timebar)
 * @param showSkillName - Whether to show skill name label
 * @param pxPerMs - Pixel-to-millisecond ratio
 * @param height - Bar height (optional, for Combined timebar half-height)
 */
function renderActionBars(
  action: ActionHistoryEntry,
  yOffset: number,
  showSkillName: boolean,
  pxPerMs: number,
  height?: number
) {
  const startPx = action.startTick * pxPerMs;
  const skill = action.skill;
  const barHeight = height || TIMELINE_CONFIG.TIMEBAR_HEIGHT;

  // Calculate phase widths in pixels
  const windUpWidth = skill.phases.windUp.duration * pxPerMs;
  const recoveryWidth = skill.phases.recovery.duration * pxPerMs;

  let committedWidth = 0;
  let activeWidth = 0;

  if (skill.type === 'attack') {
    committedWidth = skill.phases.committed.duration * pxPerMs;
  } else if (skill.type === 'defense' && skill.phases.active) {
    activeWidth = skill.phases.active.duration * pxPerMs;
  }

  return (
    <div
      key={`${action.fighterId}-${action.startTick}`}
      className="absolute flex"
      style={{
        left: `${startPx}px`,
        top: `${yOffset}px`,
        height: `${barHeight}px`
      }}
    >
      {/* PHASE 1: Wind-up (GREEN #84db90) */}
      <div
        className="h-full"
        style={{
          width: `${windUpWidth}px`,
          backgroundColor: '#84db90'
        }}
      />

      {/* PHASE 2: Committed (YELLOW #ffc824) or Active (GREY #d9d9d9) */}
      {skill.type === 'attack' ? (
        // Attack: Committed phase
        <div
          className="h-full"
          style={{
            width: `${committedWidth}px`,
            backgroundColor: '#ffc824'
          }}
        />
      ) : (
        // Defense: Active phase
        <div
          className="h-full"
          style={{
            width: `${activeWidth}px`,
            backgroundColor: '#d9d9d9'
          }}
        />
      )}

      {/* PHASE 3: Impact (GREY VERTICAL LINE #d9d9d9) - Attacks only */}
      {skill.type === 'attack' && (
        <div
          className="h-full"
          style={{
            width: '2px',
            backgroundColor: '#d9d9d9'
          }}
        />
      )}

      {/* PHASE 4: Recovery (RED #db5a5a) */}
      <div
        className="h-full"
        style={{
          width: `${recoveryWidth}px`,
          backgroundColor: '#db5a5a'
        }}
      />

      {/* Skill name label (overlaid on bars) */}
      {showSkillName && (
        <div className="absolute inset-0 flex items-center pl-2 text-xs text-white font-semibold pointer-events-none">
          {skill.name}
        </div>
      )}
    </div>
  );
}
```

**Visual Example:**

```
Attack Action:
[████ Green ████][████ Yellow ████]|[████ Red ████]
    Wind-up          Committed     ^      Recovery
                                Impact
                              (2px line)

Defense Action:
[████ Green ████][████ Grey ████][████ Red ████]
    Wind-up           Active         Recovery
```

### Step 4: Render All 5 Timebars

```typescript
// Calculate Y positions for each timebar
const timebarHeight = TIMELINE_CONFIG.TIMEBAR_HEIGHT;
const spacing = TIMELINE_CONFIG.TIMEBAR_SPACING;

const positions = {
  pcActual: 0,
  pcSeenByNpc: timebarHeight + spacing,
  npcActual: (timebarHeight + spacing) * 2,
  npcSeenByPc: (timebarHeight + spacing) * 3,
  combined: (timebarHeight + spacing) * 4,
};

// Total height needed
const totalHeight = (timebarHeight * 5) + (spacing * 4);

return (
  <div
    ref={scrollContainerRef}
    className="overflow-x-auto bg-gray-800 rounded px-4 py-2"
    onScroll={handleScroll}
  >
    <div
      className="relative"
      style={{
        width: `${timelineWidthPx}px`,
        height: `${totalHeight}px`
      }}
    >
      {/* Timebar labels (fixed on left) */}
      <div className="absolute left-0 top-0 text-xs text-gray-400 w-32">
        <div style={{ height: `${timebarHeight}px`, lineHeight: `${timebarHeight}px` }}>PC_actual</div>
        <div style={{ height: `${timebarHeight}px`, lineHeight: `${timebarHeight}px`, marginTop: `${spacing}px` }}>PC_seen_by_NPC</div>
        <div style={{ height: `${timebarHeight}px`, lineHeight: `${timebarHeight}px`, marginTop: `${spacing}px` }}>NPC_actual</div>
        <div style={{ height: `${timebarHeight}px`, lineHeight: `${timebarHeight}px`, marginTop: `${spacing}px` }}>NPC_seen_by_PC</div>
        <div style={{ height: `${timebarHeight}px`, lineHeight: `${timebarHeight}px`, marginTop: `${spacing}px` }}>Combined</div>
      </div>

      {/* Timebar 1: PC_actual (shows skill name) */}
      {(viewMode === 'debug' || viewMode === 'pc') &&
        pcActions.map(action => renderActionBars(action, positions.pcActual, true, pxPerMs))
      }

      {/* Timebar 2: PC_seen_by_NPC (no skill name) */}
      {(viewMode === 'debug' || viewMode === 'npc') &&
        pcActions.map(action => renderActionBars(action, positions.pcSeenByNpc, false, pxPerMs))
      }

      {/* Timebar 3: NPC_actual (shows skill name) */}
      {(viewMode === 'debug' || viewMode === 'npc') &&
        npcActions.map(action => renderActionBars(action, positions.npcActual, true, pxPerMs))
      }

      {/* Timebar 4: NPC_seen_by_PC (no skill name) */}
      {(viewMode === 'debug' || viewMode === 'pc') &&
        npcActions.map(action => renderActionBars(action, positions.npcSeenByPc, false, pxPerMs))
      }

      {/* Timebar 5: Combined (split horizontally) */}
      {/* PC bars on top half */}
      {pcActions.map(action =>
        renderActionBars(action, positions.combined, false, pxPerMs, timebarHeight / 2)
      )}
      {/* NPC bars on bottom half */}
      {npcActions.map(action =>
        renderActionBars(action, positions.combined + (timebarHeight / 2), false, pxPerMs, timebarHeight / 2)
      )}

      {/* "Now" line indicator (black vertical line) */}
      <div
        className="absolute bg-black"
        style={{
          left: `${nowPositionPx}px`,
          top: 0,
          width: `${TIMELINE_CONFIG.NOW_LINE_WIDTH}px`,
          height: '100%',
          zIndex: 10
        }}
      />
    </div>
  </div>
);
```

---

## 🎬 Film Strip Behavior (Moving Timeline)

### How It Works

Instead of scrolling like a document, the timeline works like a **moving film strip** or **side-scrolling game background**:

```
┌─────────────────────────────────┐ ← Fixed Viewport (100% width)
│ Past  │NOW│    Future            │
│ ◄─────┃───┃─────►               │
│ [═══] ┃   ┃ [   ]                │ ← Timeline moves left ←
│       ┃   ┃                      │
└───────┃───┃──────────────────────┘
        ↑
    "Now" line
   (stays here)
```

**Key Concepts:**

1. **Viewport is Fixed** - The container stays at 100% width, doesn't grow
2. **"Now" Line is Fixed** - Positioned at 33% from left (PAST_MS / ZOOM_MS), never moves
3. **Content Moves** - Timeline content shifts left using CSS `transform: translateX()`
4. **Automatic Clipping** - `overflow: hidden` hides content outside viewport

### Implementation

```typescript
// Calculate where "now" should be in viewport (33% from left by default)
const nowPositionPercent = (TIMELINE_CONFIG.PAST_MS / TIMELINE_CONFIG.ZOOM_MS) * 100;
const nowPositionPx = (nowPositionPercent / 100) * viewportWidth;

// Calculate how far left to shift the timeline content
// We want currentTick to appear at nowPositionPx in the viewport
const timelineOffsetPx = -(gameState.currentTick * pxPerMs) + nowPositionPx;

// Apply transform to move content
<div style={{
  transform: `translateX(${timelineOffsetPx}px)`,
  transition: 'transform 50ms linear', // Smooth movement
}}>
  {/* Timeline content */}
</div>

// "Now" line stays at fixed position in viewport
<div style={{ left: `${nowPositionPx}px` }} /> {/* Fixed, doesn't move */}
```

**User Experience:**

1. **Combat starts** → Timeline content moves left automatically
2. **New actions appear** from right edge of viewport
3. **Old actions disappear** off left edge of viewport
4. **"Now" line stays put** - content flows underneath it

**Why Film Strip Approach:**

- ✅ Viewport stays within page layout (no page scroll)
- ✅ "Now" line is always visible at same position
- ✅ Smooth continuous movement
- ✅ No scroll state management needed
- ✅ Works like familiar game scrolling backgrounds

---

## 🔨 Implementation Steps

### File 1: `combat-prototype/src/types/CombatTypes.ts`

**Add ActionHistoryEntry interface:**

```typescript
// Add near other interfaces (after ActionState)

/**
 * A completed or in-progress combat action
 * Used to render phase-colored bars on the timeline
 */
export interface ActionHistoryEntry {
  fighterId: 'pc' | 'npc';
  skill: CombatSkill;
  startTick: number;
  endTick: number;
  phases: {
    windUpEnd: number;
    committedEnd?: number;
    activeEnd?: number;
    impactTick?: number;
    recoveryEnd: number;
  };
  windUpModifier?: number;
}
```

**Update GameState interface:**

```typescript
export interface GameState {
  currentTick: number;
  pc: FighterState;
  npc: FighterState;
  pauseState: PauseState;
  combatLog: string[];
  loadedSkills: Map<string, CombatSkill>;
  actionHistory: ActionHistoryEntry[];  // ADD THIS LINE
}
```

---

### File 2: `combat-prototype/src/engine/GameEngine.ts`

**Add actionHistory field:**

```typescript
// Add to class fields (around line 57)
private actionHistory: ActionHistoryEntry[] = [];
```

**Add helper to create history entries:**

```typescript
/**
 * Converts a completed action into a history entry
 * Pre-calculates all phase end times for fast rendering
 */
private createHistoryEntry(
  fighter: FighterState,
  action: ActionState,
  endTick: number
): ActionHistoryEntry {
  const skill = action.skill;
  const startTick = endTick - action.elapsedTime;
  const windUpModifier = action.windUpModifier || 0;

  // Calculate phase end times
  const windUpEnd = startTick + skill.phases.windUp.duration + windUpModifier;
  const recoveryStart = skill.type === 'attack'
    ? skill.phases.impact.tick + windUpModifier
    : windUpEnd + (skill.phases.active?.duration || 0);
  const recoveryEnd = recoveryStart + skill.phases.recovery.duration;

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

  // Add phase-specific timestamps
  if (skill.type === 'attack') {
    entry.phases.committedEnd = startTick + skill.phases.windUp.duration + skill.phases.committed.duration + windUpModifier;
    entry.phases.impactTick = skill.phases.impact.tick + windUpModifier;
  } else if (skill.type === 'defense' && skill.phases.active) {
    entry.phases.activeEnd = windUpEnd + skill.phases.active.duration;
  }

  return entry;
}
```

**Track completed actions:**

```typescript
// In updateFighter() method, when clearing completed action
// Find where it says: fighter.currentAction = null;
// Add BEFORE clearing:

if (fighter.currentAction) {
  // Action is completing, save to history
  const historyEntry = this.createHistoryEntry(
    fighter,
    fighter.currentAction,
    this.currentTick
  );
  this.actionHistory.push(historyEntry);
  this.log(`${fighter.name} action added to history: ${historyEntry.skill.name}`);
}

fighter.currentAction = null;
```

**Expose actionHistory in getState:**

```typescript
// In getGameState() method, add to returned object:
public getGameState(): GameState {
  return {
    currentTick: this.currentTick,
    pc: this.pc,
    npc: this.npc,
    pauseState: this.pauseState,
    combatLog: [...this.combatLog],
    loadedSkills: this.skills,
    actionHistory: this.actionHistory,  // ADD THIS LINE
  };
}
```

**Reset history on stop:**

```typescript
// In stop() method, add:
this.actionHistory = [];
```

---

### File 3: `combat-prototype/src/components/Timeline/TimelinePanel.tsx`

**Complete rewrite** (see full component code below)

---

### File 4: `Timelines-design.md`

**Update terminology:**

- Replace all instances of "current intervalTick" with "currentTick"

**Add file location section:**

```markdown
## Implementation Location

All timebars are implemented in a single file:
- **File:** `combat-prototype/src/components/Timeline/TimelinePanel.tsx`
- **Timebars rendered:**
  1. `PC_actual` - Own Actual timebar for PC (shows skill name)
  2. `PC_seen_by_NPC` - Opponent Predicted timebar from NPC perspective (no skill name)
  3. `NPC_actual` - Own Actual timebar for NPC (shows skill name)
  4. `NPC_seen_by_PC` - Opponent Predicted timebar from PC perspective (no skill name)
  5. `Combined` - Merged/Combined Actual timebar (split horizontally, no skill names)
```

**Add validation note:**

```markdown
## Configuration Validation

**IMPORTANT:** `PAST_MS` cannot be greater than `ZOOM_MS`

Example valid configurations:
- ✓ `PAST_MS = 1000`, `ZOOM_MS = 3000` (show 1s past in 3s window)
- ✓ `PAST_MS = 500`, `ZOOM_MS = 2000` (show 0.5s past in 2s window)
- ✗ `PAST_MS = 5000`, `ZOOM_MS = 3000` (invalid - can't show 5s past in 3s window)
```

---

## ✅ Testing Checklist

### Visual Tests:

- [ ] Timeline appears below action buttons
- [ ] 5 timebars visible in debug mode
- [ ] Correct timebars visible in PC mode (PC_actual, NPC_seen_by_PC, Combined)
- [ ] Correct timebars visible in NPC mode (NPC_actual, PC_seen_by_NPC, Combined)
- [ ] Black "now" line visible and moving
- [ ] Skill names appear on PC_actual and NPC_actual only
- [ ] No skill names on PC_seen_by_NPC, NPC_seen_by_PC, Combined

### Color Tests:

- [ ] Attack wind-up phase is green (#84db90)
- [ ] Attack committed phase is yellow (#ffc824)
- [ ] Attack impact is grey vertical line (#d9d9d9, 2px wide)
- [ ] Attack recovery phase is red (#db5a5a)
- [ ] Defense wind-up phase is green (#84db90)
- [ ] Defense active phase is grey bar (#d9d9d9)
- [ ] Defense recovery phase is red (#db5a5a)

### Scroll Behavior Tests:

- [ ] Timeline auto-scrolls as combat progresses
- [ ] Auto-scroll keeps "now" line roughly 1/3 from left edge
- [ ] Scrolling left stops auto-scroll
- [ ] Scrolling all the way right resumes auto-scroll
- [ ] All 5 timebars scroll in sync (single scrollbar)

### History Tests:

- [ ] Completed actions remain visible
- [ ] Actions scroll left as time progresses
- [ ] Actions disappear when scrolled out of past window
- [ ] Multiple completed actions visible simultaneously
- [ ] Current in-progress action visible

### Configuration Tests:

- [ ] Changing `ZOOM_MS` adjusts visible timeframe
- [ ] Changing `PAST_MS` adjusts "now" line position
- [ ] Changing `TIMEBAR_HEIGHT` adjusts bar height
- [ ] Changing `TIMEBAR_SPACING` adjusts vertical gaps
- [ ] Configuration validation catches `PAST_MS > ZOOM_MS`

---

## 🚀 Future Extensions

### Planned Features (Future PRs):

1. **Hover Preview for Skills** ⚡ **HIGH PRIORITY**
   - **Status:** Not implemented yet
   - **Description:** When user hovers over a skill button in ActionPanel, show a ghost preview (50% transparent) of that skill's phase-colored bars on the Own Actual timebar
   - **User Comment:** "I think it is better to have it located in the TimelinePanel"
   - **Implementation Notes:**
     - Location: TimelinePanel.tsx (not in ActionPanel components)
     - Use same `renderActionBars()` function with opacity: 0.5
     - Position preview at currentTick (if no action) or after current action ends
     - Pass hovered skill from ActionPanel to TimelinePanel via props
     - Remove preview when hover ends
   - **Why important:** Lets player visualize "what if I select this skill?" before committing

2. **Interactive Zoom Controls**
   - **Status:** Not needed yet - code-based zoom is sufficient
   - **User Comment:** "Zoom in the code is fine for now"
   - **Future implementation:** Add buttons to adjust ZOOM_MS dynamically

3. **Telegraph Markers on Timeline** 🔵 **LOW PRIORITY**
   - **Status:** Not implemented yet
   - **Description:** Show visual markers at telegraph trigger times
   - **Implementation Notes:**
     - Add colored markers/icons at calculated X positions
     - Show telegraph stage numbers
     - Hover to see telegraph description
     - Body part indicators (foot, shoulders, weapon, stance)

4. **Prediction/Uncertainty Visualization** 🔵 **LOW PRIORITY**
   - **Status:** Blocked - requires PredictionEngine implementation
   - **User Comment:** "Has dependency on PredictionEngine that is yet to be defined and built. UI is low priority now"
   - **Description:** Show min/max time ranges for opponent predicted timebars
   - **Current behavior:** Predicted timebars (PC_seen_by_NPC, NPC_seen_by_PC) show actual opponent data
   - **Future behavior:**
     - Show minimum time (fastest possible attack based on visible telegraphs)
     - Show maximum time (slowest possible attack based on visible telegraphs)
     - Gradient shading between min/max
     - Uncertainty narrows as more telegraphs are revealed
     - Probability ranges (e.g., "50% Horizontal Slash, 50% Thrust")

5. **True Perspective Filtering** 🔵 **LOW PRIORITY**
   - **Status:** Blocked - requires PredictionEngine implementation
   - **User Comment:** "Has dependency on PredictionEngine that is yet to be defined and built. UI is low priority now"
   - **Description:** View mode should show perspective-appropriate data
   - **Current behavior:** All timebars show actual data
   - **Future behavior:**
     - PC mode: Show actual PC timeline + predicted NPC timeline (based on telegraphs PC can see)
     - NPC mode: Show actual NPC timeline + predicted PC timeline (based on telegraphs NPC can see)
     - Debug mode: Show everything actual (current behavior)

6. **Expiring Choice Warnings** 🔵 **LOW PRIORITY**
   - **Status:** Not implemented yet
   - **User Comment:** "Low priority"
   - **Description:** Auto-pause when decision window is about to expire
   - **Implementation Notes:**
     - Add visual indicator on timeline (e.g., flashing zone)
     - Show countdown timer
     - Trigger pause when reaction time window closes
     - Example: "You only have 200ms left to react before it's too late to parry"

7. **Timeline Replay**
   - Ability to pause/resume combat
   - Scrub timeline to review specific moments
   - Playback speed controls

8. **Export Combat Recording**
   - Save actionHistory to JSON
   - Load and replay saved combats
   - Share combat recordings

---

## 📚 Related Documents

- **Design Spec:** `Timelines-design.md` - Original design requirements
- **Type Definitions:** `combat-prototype/src/types/CombatTypes.ts` - Data structures
- **Game Engine:** `combat-prototype/src/engine/GameEngine.ts` - Combat simulation
- **Handover Doc:** `20251112_1_handover.md` - Project context

---

## 🤝 Notes for Next AI Agent

**What makes this code maintainable:**

1. **Configuration at top:** All magic numbers in one place with comments
2. **Helper functions:** `renderActionBars()` encapsulates bar rendering logic
3. **Clear naming:** `pxPerMs`, `nowPositionPx`, `timelineWidthPx` are self-explanatory
4. **Standard patterns:** Uses flexbox, absolute positioning (same as ActionPanel.tsx)
5. **No external libraries:** Pure React + CSS, no learning curve

**If you need to debug:**

1. Check browser console for configuration validation errors
2. Use React DevTools to inspect `gameState.actionHistory`
3. Verify `pxPerMs` calculation (should be 0.1-1.0 range)
4. Check timeline width: `(currentTick + 5000) * pxPerMs`
5. Verify scroll position: `scrollLeft` should track `nowPositionPx - PAST_MS`

**If you need to extend:**

1. **Add zoom controls:** Create state for `zoomMs`, add buttons to adjust it
2. **Add markers:** Render additional divs at calculated X positions
3. **Change colors:** Update hex codes in `renderActionBars()`
4. **Adjust layout:** Modify `TIMEBAR_HEIGHT` and `TIMEBAR_SPACING`
5. **Filter history:** Add date range or max entries limit

---

**Implementation complete when all tests pass and timeline behaves as specified in design doc!**
