# Code Guide - Understanding Your Combat System

**Created:** 2025-11-08
**For:** Understanding the starter code architecture

---

## 🎯 What You Should Focus On

### 👀 Read and Understand:
1. **`src/types/CombatTypes.ts`** - All the data structures
2. **`src/engine/GameEngine.ts`** - The atomic tick loop

### ⏭️ Don't Worry About:
1. React components (`src/components/`) - They just display engine state
2. Tailwind CSS classes - They're just styling
3. TypeScript configuration files

---

## 📁 File Structure Overview

```
combat-prototype/
├── src/
│   ├── types/
│   │   └── CombatTypes.ts          🎯 READ THIS - All type definitions
│   │
│   ├── engine/
│   │   └── GameEngine.ts           🎯 READ THIS - Core combat logic
│   │
│   ├── components/                 ⏭️ Pre-built UI (skip for now)
│   │   ├── CombatScene.tsx
│   │   ├── Timeline/
│   │   │   └── TimelinePanel.tsx
│   │   └── Actions/
│   │       └── ActionPanel.tsx
│   │
│   ├── App.tsx                     (Just imports CombatScene)
│   └── main.tsx                    (Vite bootstrap - don't touch)
│
├── public/
│   └── CombatSkills/               Your JSON files
│       ├── attacks/
│       ├── defense/
│       └── special/
│
└── package.json                    Dependencies list
```

---

## 🎯 Start Here: CombatTypes.ts

**File:** `src/types/CombatTypes.ts`

This file defines ALL the data structures. Understanding these types is key.

### Key Types to Understand:

#### 1. `CombatPhase`
```typescript
type CombatPhase = 'windUp' | 'committed' | 'impact' | 'recovery';
```
The four phases from Combat3 - atomic_turns.md.

#### 2. `Telegraph`
```typescript
interface Telegraph {
  stage: number;            // 1, 2, 3, 4
  bodyPart: string;         // "foot", "shoulders", "weapon", "stance"
  triggerTime: number;      // When it appears (ms)
  visibilityPercent: number;// Confidence level (20%, 40%, 60%, 95%)
  description: string;
  possibleSkills: string[]; // Which attacks still possible
}
```
Represents one telegraph stage from your JSON skills.

#### 3. `FighterState`
```typescript
interface FighterState {
  id: string;
  name: string;
  resources: Resources;        // HP, stamina, MP, focus, dailyFatigue
  maxResources: MaxResources;  // Maximum values
  currentAction: ActionState | null;  // What they're doing
  availableSkills: string[];   // Skills they can use
  hitsTaken: number;           // For 3-hit death
}
```
Complete state of one combatant (PC or NPC).

#### 4. `GameState`
```typescript
interface GameState {
  currentTick: number;         // Current time (ms)
  pc: FighterState;            // Player
  npc: FighterState;           // Opponent
  pauseState: PauseState;      // Is game paused?
  combatLog: string[];         // Debug messages
}
```
The entire game state at a moment in time.

---

## 🎯 Core Logic: GameEngine.ts

**File:** `src/engine/GameEngine.ts`

This is where combat happens. Read through it with the comments.

### Key Methods:

#### `constructor()`
- Initializes PC and NPC
- Creates default fighter states

#### `loadSkills()`
- Fetches JSON skills from `/public/CombatSkills/`
- Stores them in `this.skills` Map

#### `start()`
- Begins the atomic tick loop
- Calls `tick()` every 100ms using `setInterval`

#### `tick()` - **THE HEART**
```typescript
private tick(): void {
  // Skip if paused
  if (this.pauseState.isPaused) return;

  // Advance time
  this.currentTick += 100;

  // Update both fighters
  this.updateFighter(this.pc);
  this.updateFighter(this.npc);

  // Check for pause triggers (TODO)

  // Send state to UI
  this.emitStateUpdate();
}
```

This runs **every 100ms** and drives the entire simulation.

#### `updateFighter(fighter: FighterState)`
- Called for PC and NPC each tick
- Updates their current action
- **TODO:** Phase progression, telegraph reveals, impact resolution

#### `executeSkill(fighterId: string, skillId: string)`
- Called when player clicks action button
- Creates new `ActionState` for the fighter
- Sets phase to 'windUp', elapsedTime to 0

#### `emitEvent(event: GameEvent)`
- Sends events to React UI
- React listens and re-renders when state changes

---

## 🔄 How It All Connects

```
┌─────────────────────────────────────────────────────┐
│  1. Browser Loads                                   │
│     ↓                                                │
│  2. React renders CombatScene.tsx                   │
│     ↓                                                │
│  3. CombatScene creates GameEngine instance         │
│     ↓                                                │
│  4. GameEngine.loadSkills() fetches JSON            │
│     ↓                                                │
│  5. GameEngine.start() begins tick loop             │
│     ↓                                                │
│  6. Every 100ms: tick() runs                        │
│     ├─ Updates PC                                   │
│     ├─ Updates NPC                                  │
│     └─ Emits STATE_UPDATE event                     │
│         ↓                                            │
│  7. React receives event, updates UI                │
│     ├─ Timelines re-render                          │
│     ├─ Action buttons update                        │
│     └─ Combat log updates                           │
│         ↓                                            │
│  8. Player clicks "Slash" button                    │
│     ↓                                                │
│  9. executeSkill('pc', 'slash') called              │
│     ↓                                                │
│ 10. PC.currentAction set to Slash                   │
│     ↓                                                │
│ 11. Next tick: updateFighter() progresses action    │
│     ↓                                                │
│ 12. Loop continues...                               │
└─────────────────────────────────────────────────────┘
```

---

## 🧪 How to Observe Behavior

### 1. **Browser Console (F12)**

The engine logs everything:

```javascript
[GameEngine] Initializing combat engine...
[GameEngine] Loading combat skills from JSON...
[GameEngine] Loaded skills: ['slash', 'thrust', 'parry']
[GameEngine] Starting combat simulation...
[GameEngine] Tick 1000ms
[GameEngine] Player action: Slash @ 500ms (windUp)
[GameEngine] Player action: Slash @ 600ms (windUp)
```

### 2. **UI Display**

- **Current Tick:** Top of screen shows time
- **Timelines:** 5 bars show action progress
- **Combat Log:** Shows all events
- **Fighter States:** Shows HP, stamina, current action

### 3. **Add Your Own Logs**

In `GameEngine.ts`, add:

```typescript
console.log('[DEBUG]', 'Whatever you want to see');
```

Save file → Vite hot-reloads → See log in console

---

## 🎯 First Experiments

### Test 1: Watch Atomic Ticks

1. Start dev server: `npm run dev`
2. Open browser: http://localhost:5173/
3. Open console: Press F12
4. Watch: Every second you see `[GameEngine] Tick 1000ms`

### Test 2: Execute an Action

1. Click "Slash" button
2. Watch console:
   - `[GameEngine] pc wants to execute skill: slash`
   - `[GameEngine] Player started Slash`
   - `[GameEngine] Player action: Slash @ 100ms (windUp)`
   - `[GameEngine] Player action: Slash @ 200ms (windUp)`
3. Watch timelines: Green bar progresses
4. Watch combat log: Shows events

### Test 3: Pause and Resume

1. Click "Pause" button
2. Watch: Ticks stop, timelines freeze
3. Console shows: `[GameEngine] Paused (manual)`
4. Click "Resume"
5. Console shows: `[GameEngine] Unpaused`
6. Ticks resume

---

## 🚧 What's NOT Implemented Yet

The current code is a **skeleton**. Here's what still needs work:

### In `GameEngine.ts`:

1. **Phase Progression** - Actions stay in 'windUp' forever
   - Need to check elapsed time vs phase durations
   - Transition: windUp → committed → impact → recovery

2. **Telegraph Reveals** - Telegraphs never appear
   - Need to check elapsed time vs telegraph trigger times
   - Add visible telegraphs to `ActionState.visibleTelegraphs[]`

3. **Impact Resolution** - Nothing happens at Impact tick
   - Need to check if Impact tick is reached
   - Check if defender has active defense
   - Apply damage or resolve defense

4. **Pause Logic** - Only manual pause works
   - Need to detect new telegraphs
   - Need to detect when possibleSkills[] changes
   - Trigger auto-pause

5. **Resource Consumption** - Stamina/MP never decrease
   - Deduct costs when action starts
   - Check for exhaustion penalties

6. **Death Conditions** - Nobody dies
   - Check for 1 clean hit
   - Check for 3 total hits
   - Emit FIGHTER_DIED event

---

## 📝 Next Steps for YOU

### Step 1: Read the Types
Open `src/types/CombatTypes.ts` and read every interface.
Understand what data the system tracks.

### Step 2: Trace One Tick
Open `src/engine/GameEngine.ts` and read the `tick()` method.
Follow the flow from tick → updateFighter → emitStateUpdate.

### Step 3: Execute an Action
Run the app, click "Slash", watch console logs.
Understand how `executeSkill()` creates an `ActionState`.

### Step 4: Add a Console Log
In `updateFighter()`, add:
```typescript
console.log('[DEBUG] Updating', fighter.name, fighter.currentAction);
```
Save, watch browser update automatically.

### Step 5: Implement Phase Progression
This is your first real task:
- In `updateFighter()`, check if `elapsedTime >= currentPhase.duration`
- If yes, advance to next phase
- Emit PHASE_CHANGED event

---

## 💡 Understanding React (Minimal)

You don't need to master React, but here's what's happening:

### In `CombatScene.tsx`:

```typescript
const [gameState, setGameState] = useState<GameState | null>(null);
```
This creates a React "state variable". When `setGameState()` is called, React re-renders the UI.

```typescript
useEffect(() => {
  const handleEvent = (event: any) => {
    if (event.type === 'STATE_UPDATE') {
      setGameState(event.state);  // This causes re-render
    }
  };
  engine.addEventListener(handleEvent);
}, []);
```
This says: "When component mounts, listen to engine events. When STATE_UPDATE arrives, update React state."

**That's it!** Engine emits events → React updates → UI re-renders.

---

## 🐛 Debugging Tips

### Console Logs Not Showing?

- Check browser console (F12 → Console tab)
- Make sure dev server is running
- Hard refresh: Ctrl+F5

### Timelines Not Moving?

- Check if action was created: Look for currentAction in fighter state
- Check console for errors
- Check if ticks are running: Should see `Tick 1000ms` etc.

### Hot Reload Not Working?

- Save file with Ctrl+S
- Check terminal for compile errors
- Restart dev server: Ctrl+C, then `npm run dev`

---

## 📚 Resources

**Your Design Docs:**
- `Combat3 - atomic_turns.md` - Phase system specification
- `PRD.md` - Resource system, damage system
- `TechStack_Recommendation.md` - Architecture overview

**TypeScript:**
- https://www.typescriptlang.org/docs/handbook/basic-types.html

**Browser DevTools:**
- F12 → Console: See logs
- F12 → Sources: Set breakpoints in TypeScript
- F12 → Network: See skill JSON loading

---

## ❓ Questions?

When adding features, ask yourself:

1. **What data do I need?** → Add to `CombatTypes.ts`
2. **When should it update?** → Add to `tick()` or `updateFighter()`
3. **How will I observe it?** → Add `console.log()` or emit event
4. **Does UI need to show it?** → Emit event, React will handle it

---

**Ready to start experimenting?**

1. Open `src/engine/GameEngine.ts`
2. Find the `// TODO:` comments
3. Pick one to implement
4. Add console.logs to understand what's happening
5. Watch the browser and console to validate behavior

Good luck! 🚀
