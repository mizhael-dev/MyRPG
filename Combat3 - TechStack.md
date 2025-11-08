# ⚙️ React + TypeScript + Vite Combat Prototype Architecture

## 1. Technical Overview

From your current design, the prototype must support:

| Feature                    | Technical Need                                                                   |
| -------------------------- | -------------------------------------------------------------------------------- |
| **Atomic-turn simulation** | Deterministic time loop (50–100 ms ticks).                                       |
| **Pause & resume**         | Loop can pause when new telegraph info appears or when an action window expires. |
| **Action buttons**         | Player input to choose attacks, defenses, and waits.                             |
| **Timeline visualization** | Multiple simultaneous timelines (player, NPC, combined).                         |
| **Fast iteration**         | Rapid testing of balance parameters.                                             |
| **Low setup friction**     | Minimal build tools and boilerplate.                                             |

---

## 2. Performance Considerations

Atomic turns are very lightweight. Even with 50 ms resolution (20 ticks/sec), CPU load is negligible for a few combatants.

**Key rule:** compute every tick, but render every 2–3 ticks or only when state changes significantly (telegraph, phase shift, pause trigger).

---

## 3. Recommended Stack

**Frontend:** React + TypeScript + Vite
**Styling:** TailwindCSS
**Animation/Rendering:** SVG or Canvas (via PixiJS if needed)

### Why React?

* Fast to prototype UI + simulation together.
* JSX simplifies drawing timelines and buttons.
* Hooks make implementing a time loop trivial.
* Easy to modularize logic vs visuals.

**Alternative engines** (Godot, Unity, etc.) are better for full production, but slower for iterating logic.

---

## 4. Architecture Overview

```
App
│
└── CombatScene
     ├── CombatLoopController     ← runs atomic-tick simulation
     │
     ├── TimelinePanel
     │    ├── Timebar_PC_actual
     │    ├── Timebar_PC_seen_by_NPC
     │    ├── Timebar_NPC_actual
     │    ├── Timebar_NPC_seen_by_PC
     │    └── Timebar_Combined_actual
     │
     ├── ActionPanel              ← player actions (Attack, Feint, Parry, Wait)
     │
     ├── PauseOverlay             ← when info updates or options expire
     │    ├── PredictionDisplay
     │    └── ResponseButtons
     │
     └── CombatLog (optional)     ← debug text feed
```

---

## 5. Component Responsibilities

### `App`

Top-level wrapper that loads the combat scene and game configuration.

### `CombatScene`

Manages top-level state and simulation instance.

**Example State:**

```ts
const [frame_PC, setFrame_PC] = useState<FrameData>(initFrame_PC);
const [frame_NPC, setFrame_NPC] = useState<FrameData>(initFrame_NPC);
const [paused, setPaused] = useState(false);
const [options_PC, setOptions_PC] = useState<ActionOption[]>([]);
const [prediction_PC, setPrediction_PC] = useState<PredictionInfo>(initPrediction_PC);
```

**Passed Down To:**

* `TimelinePanel` → frame_PC, frame_NPC
* `ActionPanel` → options_PC
* `PauseOverlay` → prediction_PC + options_PC

### `CombatLoopController`

Implements the main atomic loop.

```ts
useEffect(() => {
  if (paused) return;
  const interval = setInterval(() => {
    const update = sim.tick(100);
    if (update.pauseTrigger) setPaused(true);
    else {
      setFrame_PC(update.frame_PC);
      setFrame_NPC(update.frame_NPC);
    }
  }, 100);
  return () => clearInterval(interval);
}, [paused]);
```

### `TimelinePanel`

Displays five synchronized bars:

1. `Timebar_PC_actual`
2. `Timebar_PC_seen_by_NPC`
3. `Timebar_NPC_actual`
4. `Timebar_NPC_seen_by_PC`
5. `Timebar_Combined_actual`

### `ActionPanel`

Interactive buttons for player actions. Disables unavailable ones.

### `PauseOverlay`

Appears when the system pauses. Displays new information and viable reactions.

### `CombatLog`

Optional; prints tick-by-tick events for debugging.

---

## 6. State Flow

```
┌──────────────────────┐
│ CombatLoopController │
└──────────┬───────────┘
           │
           ▼
     sim.tick(dt)
           │
  ┌────────┴────────┐
  │                 │
 no pause      pause trigger
  │                 │
  ▼                 ▼
setFrame_PC(),     setPaused(true)
setFrame_NPC()      │
  │                 │
  ▼                 │
TimelinePanel,     │
ActionPanel update │
                    │
                    ▼
               PauseOverlay visible
                    │
             Player selects response
                    │
                    ▼
           sim.enqueueAction_PC()
                    │
                    ▼
            setPaused(false)
```

---

## 7. Performance Tips

| Technique                                  | Reason                                        |
| ------------------------------------------ | --------------------------------------------- |
| Compute every tick, render every 2–3 ticks | Smooth UI with light CPU load.                |
| Separate simulation logic                  | Keep testable and reusable for other engines. |
| Memoize props & callbacks                  | Prevent unnecessary re-renders.               |
| Use SVG or Canvas                          | More efficient for animating progress bars.   |

---

## 8. File Structure

```
src/
 ├─ core/
 │   ├─ simulation.ts        ← deterministic combat engine
 │   ├─ fighter.ts
 │   └─ actions.ts
 ├─ components/
 │   ├─ TimelinePanel/
 │   │    ├─ index.tsx
 │   │    ├─ Timebar_PC_actual.tsx
 │   │    ├─ Timebar_PC_seen_by_NPC.tsx
 │   │    ├─ Timebar_NPC_actual.tsx
 │   │    ├─ Timebar_NPC_seen_by_PC.tsx
 │   │    └─ Timebar_Combined_actual.tsx
 │   ├─ ActionPanel.tsx
 │   ├─ PauseOverlay.tsx
 │   └─ CombatLog.tsx
 ├─ scenes/
 │   └─ CombatScene.tsx
 └─ App.tsx
```

---

## 9. Summary

| Goal             | Recommended Tool                           |
| ---------------- | ------------------------------------------ |
| Fast prototype   | React + TypeScript + Vite                  |
| Visual timelines | HTML + Tailwind or SVG/Canvas              |
| Simulation       | Plain TypeScript logic, decoupled from UI  |
| Performance      | Compute every tick, render less frequently |
| Portability      | Core logic reusable in other engines       |

Atomic turns are cheap to compute. The challenge is pacing and UI communication, not performance. React + Vite gives you an ideal sandbox to test balance and player experience quickly.