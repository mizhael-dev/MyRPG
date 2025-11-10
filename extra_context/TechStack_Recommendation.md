# Tech Stack Recommendation - MyRPG Combat Prototype

**Date:** 2025-11-08
**Status:** Approved
**Target:** First working prototype with atomic turn combat visualization

---

## Recommended Stack

### Core Technologies

| Component | Technology | Why |
|-----------|------------|-----|
| **Game Engine** | Pure TypeScript | Your focus - understand combat logic without framework complexity |
| **UI Framework** | React 18 | Component model handles complex UI (5 timebars), pre-built components provided |
| **Build Tool** | Vite | Fast hot-reload, zero-config TypeScript support, modern dev experience |
| **Styling** | TailwindCSS | Utility-first CSS, rapid UI iteration, no need to write custom CSS |
| **Rendering** | HTML/CSS (Canvas later) | Start simple with DOM rendering, upgrade to Canvas/PixiJS if needed |

---

## Architecture: Clear Separation of Concerns

```
┌─────────────────────────────────────────────────────────────┐
│                        YOUR FOCUS AREA                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          TypeScript Combat Engine (Model)               │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │  • GameEngine.ts        - Main combat logic            │ │
│  │  • Fighter.ts           - Character state & actions    │ │
│  │  • Action.ts            - Combat skills (from JSON)    │ │
│  │  • TelegraphSystem.ts   - Telegraph visibility calc    │ │
│  │  • PauseSystem.ts       - Decision pause logic         │ │
│  │  • TimelineManager.ts   - Atomic tick progression      │ │
│  │                                                          │ │
│  │  Pure TypeScript - Zero React dependencies             │ │
│  │  Read, understand, and validate this code              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   PRE-BUILT FOR YOU                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           React UI Layer (View/Controller)              │ │
│  │  ─────────────────────────────────────────────────────  │ │
│  │  • CombatScene.tsx      - Top-level container          │ │
│  │  • TimelinePanel.tsx    - 5 synchronized timebars      │ │
│  │  • ActionPanel.tsx      - Player action buttons        │ │
│  │  • PauseOverlay.tsx     - Prediction display           │ │
│  │  • TelegraphDisplay.tsx - Manga-style telegraph panels │ │
│  │                                                          │ │
│  │  Use as-is, minimal React knowledge needed             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

     Communication: GameEngine emits events → React listens → UI updates
```

---

## What You Need to Learn vs What Just Works

### ✅ You WILL Learn (Your Focus):

1. **TypeScript Basics:**
   - Classes and interfaces
   - Type annotations
   - Enums and unions
   - Reading JSON types

2. **Combat Engine Logic:**
   - How atomic ticks work (`TimelineManager.tick()`)
   - How telegraphs are calculated (`TelegraphSystem.update()`)
   - How pauses are triggered (`PauseSystem.check()`)
   - How actions progress through phases (`Action.update()`)
   - Event emission pattern (how engine talks to UI)

3. **Validation:**
   - Reading console logs
   - Using browser DevTools
   - Verifying combat outcomes

### ⏭️ You DON'T Need to Master (Pre-Built):

1. **React Internals:**
   - JSX syntax (you'll see it but don't need to write it)
   - Component lifecycle (handled for you)
   - Hooks (used in provided components)
   - State management (abstracted away)

2. **Build Tools:**
   - Vite configuration (works out of the box)
   - Module bundling (automatic)
   - Hot reload (just works)

3. **Styling:**
   - TailwindCSS classes (already applied)
   - Responsive layout (provided)

---

## Project Structure

```
MyRPG/
├── CombatSkills/              # Your JSON combat skills (already created)
│   ├── attacks/
│   ├── defense/
│   ├── special/
│   └── combos/
│
├── src/                       # Source code
│   ├── engine/               # 🎯 YOUR FOCUS: Pure TypeScript combat logic
│   │   ├── GameEngine.ts
│   │   ├── Fighter.ts
│   │   ├── Action.ts
│   │   ├── TelegraphSystem.ts
│   │   ├── PauseSystem.ts
│   │   └── TimelineManager.ts
│   │
│   ├── types/                # TypeScript interfaces (read to understand)
│   │   ├── CombatTypes.ts
│   │   ├── SkillTypes.ts
│   │   └── EventTypes.ts
│   │
│   ├── components/           # ⏭️ PRE-BUILT: React UI (use as-is)
│   │   ├── CombatScene.tsx
│   │   ├── TimelinePanel.tsx
│   │   ├── ActionPanel.tsx
│   │   ├── PauseOverlay.tsx
│   │   └── TelegraphDisplay.tsx
│   │
│   ├── App.tsx              # Entry point (minimal changes needed)
│   └── main.tsx             # Vite bootstrap (don't touch)
│
├── public/                   # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config (pre-configured)
├── vite.config.ts           # Vite config (pre-configured)
└── tailwind.config.js       # Tailwind config (pre-configured)
```

---

## How the Engine Works (Simplified)

### 1. Game Loop (100ms Atomic Ticks)

```typescript
// TimelineManager.ts
class TimelineManager {
  private currentTick: number = 0;

  tick(deltaMs: number): void {
    this.currentTick += deltaMs; // Advance 100ms

    // Update all fighters
    this.fighters.forEach(fighter => {
      fighter.update(deltaMs);
    });

    // Check for pause triggers
    if (this.pauseSystem.shouldPause()) {
      this.emit('PAUSE_TRIGGERED');
    }

    // Emit state update
    this.emit('STATE_UPDATE', this.getState());
  }
}
```

### 2. Action Progression

```typescript
// Action.ts
class Action {
  phase: 'windUp' | 'committed' | 'impact' | 'recovery';
  elapsedTime: number = 0;

  update(deltaMs: number): void {
    this.elapsedTime += deltaMs;

    // Check phase transitions
    if (this.elapsedTime >= this.currentPhase.duration) {
      this.advancePhase();
    }

    // Update telegraph visibility
    this.telegraphSystem.update(this.elapsedTime);
  }
}
```

### 3. Telegraph Visibility

```typescript
// TelegraphSystem.ts
class TelegraphSystem {
  checkVisibility(elapsedTime: number): Telegraph[] {
    return this.telegraphs.filter(t =>
      elapsedTime >= t.triggerTime
    );
  }
}
```

### 4. Event Communication (Engine → UI)

```typescript
// GameEngine.ts
class GameEngine extends EventEmitter {
  // Engine emits events, React listens
  this.emit('TELEGRAPH_REVEALED', {
    bodyPart: 'foot',
    visibility: 20,
    possibleSkills: ['slash', 'thrust']
  });

  this.emit('PAUSE_TRIGGERED', {
    reason: 'new_telegraph',
    options: this.getAvailableActions()
  });
}
```

---

## Development Workflow

### Daily Iteration Loop:

1. **Start dev server:** `npm run dev`
2. **Open browser:** http://localhost:5173
3. **Open DevTools Console:** See engine logs
4. **Modify engine code:** `src/engine/GameEngine.ts`
5. **Save file:** Hot reload updates browser automatically
6. **Observe changes:** Watch console + 5 timebars
7. **Validate behavior:** Check if atomic ticks work as designed

### Debugging:

```typescript
// Add console logs to understand engine state
console.log('[GameEngine] Tick:', this.currentTick);
console.log('[Telegraph] Revealed:', telegraph);
console.log('[Pause] Triggered because:', reason);
```

Browser DevTools shows:
- Console: Your engine logs
- React DevTools: Component state (optional)
- Network: Loading JSON skills
- Sources: Set breakpoints in TypeScript

---

## Learning Path

### Phase 1: Setup (Day 1) - See SETUP_GUIDE.md
- Install Node.js
- Create Vite project
- Run dev server
- Verify "Hello World" works

### Phase 2: Understand Engine (Days 2-3)
- Read `src/engine/GameEngine.ts` comments
- Trace one atomic tick through the code
- Add console.logs to see flow
- Observe 5 timebars updating

### Phase 3: Load Combat Skills (Day 4)
- Engine loads your JSON files from `/CombatSkills/`
- See "Slash" skill telegraph timings
- Verify telegraphs reveal at correct ms

### Phase 4: Test Combat (Days 5-7)
- PC executes "Slash"
- Watch telegraphs reveal on NPC timeline
- NPC executes "Parry"
- Verify Impact resolution

### Phase 5: Validate System (Week 2)
- Test all 11 combat skills
- Verify pause logic
- Check resource consumption
- Validate death conditions (1 clean hit / 3 hits)

---

## Why This Stack Works for You

| Your Need | How Stack Solves It |
|-----------|-------------------|
| **Understand combat logic** | Pure TypeScript engine - read classes, add logs, trace execution |
| **Complex UI (5 timebars)** | React components handle it - you don't need to understand HOW, just that it works |
| **Fast iteration** | Vite hot-reload - save TypeScript file, see changes instantly |
| **Visual validation** | Browser shows timebars + console shows logs - easy to verify behavior |
| **Learn through observation** | Add console.logs everywhere, watch atomic ticks happen in real-time |
| **Avoid refactoring** | MVC separation means engine and UI evolve independently |

---

## Minimal React Knowledge Needed

You'll see React code like this in provided components:

```tsx
// You don't need to write this, just recognize it's the UI displaying engine state
export function TimelinePanel({ engineState }) {
  return (
    <div className="timeline-panel">
      <Timebar_PC_actual progress={engineState.pc.progress} />
      <Timebar_NPC_actual progress={engineState.npc.progress} />
    </div>
  );
}
```

**What you need to know:**
- `{engineState.pc.progress}` means "show the PC's progress from engine state"
- When `engineState` updates (via event from your engine), React re-renders automatically
- That's it! You don't need to write React code, just understand it's displaying your engine's data.

---

## Alternative Considered: Vanilla TypeScript + Canvas

**Pros:**
- No React to learn
- Full control over rendering

**Cons:**
- You'd have to manually code 5 timebars, manga panels, action buttons, pause overlays
- More UI code to write = less time understanding combat logic
- Harder to iterate on complex UI

**Verdict:** React wins because YOU want to focus on engine, not UI implementation.

---

## Next Steps

1. **Read SETUP_GUIDE.md** - Get environment running (30 min)
2. **I'll generate starter code** - Pre-built React components + TypeScript engine skeleton
3. **You read `GameEngine.ts`** - Understand atomic tick loop (1-2 hours)
4. **Run first test** - Watch a single "Slash" action progress through phases
5. **Add console.logs** - Trace telegraph reveals in real-time
6. **Validate behavior** - Does it match Combat3 - atomic_turns.md spec?

---

## Questions Before We Start?

Before I create the starter code, do you have questions about:
- The architecture (Engine vs UI separation)?
- What you'll be learning (TypeScript engine logic)?
- How validation works (console + timebars)?
- Development workflow (edit → save → hot reload → observe)?

---

**Ready to proceed to SETUP_GUIDE.md?**
