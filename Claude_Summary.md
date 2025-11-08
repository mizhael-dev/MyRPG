# Claude Summary - MyRPG Design Analysis

**Date:** 2025-11-08
**Status:** Initial Analysis Complete - Awaiting Contradiction Resolution

---

## Project Vision

You're building a **grimdark fantasy tactical roguelike CRPG** with a unique **atomic turn-based deterministic combat system**. The core philosophy is:

- **Player agency over luck** - No RNG, outcomes determined by skill, positioning, and foresight
- **Every decision matters** - Weighty, dangerous combat where resources and timing are critical
- **Fast and deadly** - No inflated HP encounters; combat is brutal and tactical
- **Telegraphing/Intent Reading** - Defender reads attacker's micro-movements to predict and counter attacks

**Inspirations:** Steven Erikson, Joe Abercrombie (grimdark), tactical roguelikes
**First Version Focus:** Gameplay mechanics, not story/world

---

## Core Combat System - Atomic Turns

### What Makes It Unique

Your combat system operates on **100ms atomic ticks** (not discrete turns), where:

1. **Simultaneous Action Evolution:** Both combatants' actions progress in parallel each tick
2. **Telegraph System:** Attacker's intent gradually reveals through body cues (0% → 100%)
3. **Smart Pauses:** Game pauses when:
   - New meaningful telegraph information emerges (⚡)
   - Defense window or action option is about to expire (🕓)
4. **Defense Readiness Windows:** Defender must time their defense to overlap attacker's Impact frame
5. **Deterministic Resolution:** If defense is active during Impact tick → success; otherwise → hit lands

### Example Timeline (from Atomic_Turns.md)
- **Slash:** 2000ms total duration, progressive telegraphs at 10%, 20%, 40%, 60%, 80%, 95%
- **Parry:** 1000ms cast time, readiness window ±200ms (1800-2200ms)
- **Impact resolution:** Deterministic - if parry is ready at 2000ms Impact → parry succeeds

### Telegraph Mechanics
- **Micro-movements reveal intent:** Foot shifts, shoulder rotation, weapon positioning, stance changes
- **Prediction confidence grows with time:** More time watching = higher certainty, but less time to respond
- **Repetition penalty:** Using same attack multiple times makes it easier to read (faster prediction)
- **Skill School Combos:** Predefined combo sequences get bonuses but are easier to predict

---

## Resource System (4-Layer Design)

Your resource system creates tactical depth through cascading consumption:

### 1. **MP (Magic Points)**
- **Max:** Magic Attribute × 2
- **Regeneration:**
  - Full outside combat (rest/meditation)
  - 5 per turn in combat (concentrating, uninterrupted)
- **Exhaustion:** 0 MP → drain HP (1 HP per 1 MP used)
- **Variable Power:** Can use ±50% MP to modify damage/speed

### 2. **Stamina (Physical Energy)**
- **Max:** Constitution Attribute **[CONTRADICTION - see below]**
- **Regeneration:**
  - Full outside combat (rest)
  - 1 per turn in combat
  - 4 per turn when defending
- **Exhaustion:** 0 Stamina → drain HP (1 HP per 2 Stamina used)
- **Variable Power:** Can use ±50% Stamina to modify damage/speed

### 3. **Focus (Mental Clarity)**
- **Max:** Willpower Attribute
- **Cost Formula:** Focus cost = MP cost + Stamina cost
- **Regeneration:**
  - Full outside combat (rest)
  - 2 per turn in combat
  - 4 per turn when sitting
- **Exhaustion:** 0 Focus → drain HP (1 HP per 2 Focus used)
- **Purpose:** Prevents unlimited combat; forces tactical repositioning and team coordination

### 4. **Daily Fatigue**
- **Max:** Willpower × 5
- **Cost Formula:** Daily Fatigue cost = MP cost + Stamina cost
- **Regeneration:** Only via long rest (6+ hours sleep)
- **Exhaustion:** 0 Daily Fatigue → drain HP (1 HP per 5 Daily Fatigue used)
- **Purpose:** Prevents unlimited grinding; forces rest periods in longer adventures

**Key Insight:** Every action consumes all 4 resources simultaneously (via formulas), creating deep resource management

---

## Character System

### Core Attributes
- **Strength:** Physical power
- **Agility:** Agility, Accuracy, Evade, Reflexes
- **Constitution:** Health and stamina
- **Speed:** Movement and action speed
- **Magic:** Magic power
- **Willpower:** How much magic can be channeled at once

### Derived Stats/Resources
- **Max HP:** Constitution + modifiers
- **Max Stamina:** Constitution × 2 + modifiers **[CONTRADICTION - see below]**
- **Max MP:** Magic × 2 + modifiers
- **Max Focus:** Willpower + modifiers
- **Max Daily Fatigue:** Willpower × 5 + modifiers

### Skills & Proficiencies
- Examples: Stealth, Perception
- Provide modifiers to difficulty checks
- Increase through use and training

---

## Combat Skills Defined (Incomplete)

### Attack Skills

**Slash**
- Stamina: 2
- Cast Time: 2000ms
- Recovery Time: 100ms
- School: None
- Telegraphs: [EMPTY - needs definition]

**Thrust**
- Stamina: 2
- Cast Time: 1500ms
- Recovery Time: 100ms
- School: None
- Telegraphs: [EMPTY - needs definition]

### Combo Example
**Slash → Slash → Thrust**
- School: None
- Bonuses:
  - Slash 1: None
  - Slash 2: -200ms cast, -1 stamina
  - Thrust: -600ms cast, -1 stamina
- Telegraphs: [EMPTY - needs definition]

### Defense Skills

**Weapon Parry** **[DUPLICATE - see contradictions below]**
- Two versions with different stats

---

## Equipment System

### Weapons
- **Belt slots (1-2):** Small weapons (daggers, short swords)
- **Back slots (1-2):** Large weapons (bows, long swords, spears)

### Armor
- Head, Chest, Back, Gloves, Legs, Boots

### Jewelry
- Rings (max 10)
- Amulets (max 3)

### Inventory
- **Pockets:** 1-3 small items (quick access)
- **Backpack:** Larger items (limited access)

### Weapon Impact on Gameplay
- **Spear:** Deadly at long range, ineffective when opponent is too close
- **Dagger:** Light, fast, short range - requires stealth or speed to close distance
- **Ranged weapons:** Hard to aim at fast targets, deadly against slow targets

---

## World & Exploration

- **Semi-open world:** Handcrafted hubs + procedural wilderness/dungeons/combat zones
- **Environmental interaction:** Collapsing bridges, fires, water redirection can alter battles
- **Setting:** Fading empires, dying gods, unstable magic
- **Power costs:** Magic drains life/madness/stability

---

## Architecture Guidance (from TechStack Considerations)

### Model-View-Controller (MVC) Pattern

**Core Game Engine (Model):**
- Pure TypeScript, zero dependencies on React/DOM/rendering libs
- `GameEngine` class holds all state as plain objects/interfaces
- Public methods for all game actions (moveUnit, playCard, etc.)
- Event Emitter for Model → View communication
- **Portability goal:** GameEngine can be reused if switching React/PixiJS → Phaser

**React View Layer:**
- Controller: Collects user input, calls GameEngine methods
- View: Subscribes to GameEngine events, triggers re-renders
- PixiJS/SVG bridge updates based on events
- **Never directly modifies engine state**

**Tech Stack Priorities:**
- Fast iteration over polish
- Modular, vibe-driven development
- Isometric or top-down tactical grid/hex (whichever is easier)
- JSON-driven entity stats

---

## ~~CONTRADICTIONS REQUIRING RESOLUTION~~ ✅ RESOLVED

### 1. Weapon Parry - Duplicate Definitions ✅ RESOLVED

**Resolution:** Version 2 is correct. Updated PRD.md to use Version 2 only.

**Final Weapon Parry Stats:**
- Cost: 1 + 25% attacker's stamina
- Cast Time: 500ms
- Recovery: 500ms

### 2. Max Stamina Formula ✅ RESOLVED

**Resolution:** Constitution × 2 is correct.

Updated PRD.md:189 to reflect correct formula:
> Maximum Stamina: Equal to the Constitution Attribute × 2

### 3. "Turn" vs "Tick" Terminology ✅ RESOLVED

**Resolution:** Replaced all "per turn" instances with `<regeneration_rate>` variable.

Added note in PRD.md:
> `<regeneration_rate>` is a variable that needs balancing through playtesting. Initial estimate: 1000ms (1 second), but will be adjusted based on combat pacing.

All resource regeneration now uses `<regeneration_rate>` terminology to avoid confusion with atomic ticks.

---

## ~~GAPS & MISSING ELEMENTS~~ NOW COMPLETED OR DEFERRED

### ✅ Combat Skills - COMPLETED
1. ~~**Telegraph definitions**~~ ✅ All telegraphs defined in JSON with bodyPart, triggerTime, visibility%, description
2. ~~**More combat skills**~~ ✅ 5 attack skills + 3 defense skills + 2 special skills + 1 combo created
3. ~~**Damage calculation**~~ ✅ Prototype damage system defined: 1 clean hit OR 3 hits = death
4. ~~**JSON Format**~~ ✅ All combat skills converted to JSON in `/CombatSkills/` folder

### 📋 Combat Skills Created:

**Attacks (5):**
- slash.json - Horizontal slashing attack (2000ms)
- thrust.json - Forward stabbing attack (1500ms, fast)
- overhead_strike.json - Powerful downward strike (2200ms, slow, breaks defense)
- upward_strike.json - Rising cut (1300ms, breaks guard)
- diagonal_slash.json - Angled cutting attack (1700ms, versatile)

**Defense (3):**
- parry.json - Weapon parry with adjustable window, enables counter
- dodge_clean.json - Clean evasion, low stamina, maintains initiative
- dodge_emergency.json - Panic dodge, high cost, reduces damage 50%

**Special (2):**
- counter.json - Swift riposte after successful parry
- feint.json - Cancel attack to bait opponent's defense

**Combos (1):**
- slash_slash_thrust.json - Basic 3-hit combo with stamina/time bonuses

### 🔜 Deferred to Later (Out of Scope for Prototype)
- **Movement skills** - Tactical map movement will be added after core combat is working
- **Magic/spell combat skills** - Spells deferred to later version
- **Armor mechanics** - Deferred to later version
- **Positioning mechanics** - Grid/hex positioning deferred
- **Range mechanics** - Weapon range deferred
- **Line of sight** - Visibility systems deferred
- **Enemy AI behavior** - Will be developed once core mechanics are tested

---

## COMBAT PHASE SYSTEM (From Combat3 - atomic_turns.md)

Your combat system operates through **four deterministic phases**:

### 1. Wind-up (Preparation)
- **Duration:** 500-2000ms (varies by skill)
- **Attacker can:** Cancel, feint, observe telegraphs
- **Defender can:** Read telegraphs, prepare defense
- **Telegraphs:** Progressively revealed at intervals

### 2. Committed (Point of No Return)
- **Duration:** 300-800ms
- **Attacker:** Cannot cancel or feint, momentum builds
- **Defender:** Must already have defense active or starting
- **Critical:** Determines who reaches Impact first

### 3. Impact (Resolution Frame)
- **Duration:** 1 tick (instantaneous)
- **Resolution:** Attack connects OR defense succeeds
- **Deterministic:** No RNG, purely timing-based

### 4. Recovery (Follow-through)
- **Duration:** 300-1500ms (heavier actions = longer recovery)
- **Attacker:** Regaining balance, vulnerable
- **Defender:** Opportunity to counter or reposition

### Telegraph Stages (Detailed Timing)

| Stage | Timing | Visible Cue | Defender Learns |
|-------|--------|-------------|-----------------|
| **Footwork** | 0-400ms | Direction/advance | "Melee incoming" |
| **Shoulder Motion** | 400-900ms | Attack vector forming | "Slash or Thrust likely" |
| **Weapon Angle** | 900-1500ms | Type clarifies | "Probably Thrust" |
| **Full Extension** | 1500-1900ms | Confirmed motion | "Almost certain: Thrust" |

### Defense Window Mechanics

Defenses are **sustained readiness windows**, not instant reactions:

**Stamina Modifiers:**
- **−Stamina:** Narrow window (precise timing, less cost)
- **Base:** Default width (balanced)
- **+Stamina:** Extended window (more safety, higher cost)

**Example:** Parry base window ±150ms can be:
- Narrowed to ±100ms (saves 1 stamina, requires precision)
- Widened to ±300ms (costs 1 stamina, easier to time)

### Pacing Target

Average duel exchange: **2.5-3 seconds**

| Segment | Duration | Feel |
|---------|----------|------|
| Wind-up | 1s | Rising tension |
| Committed | 0.5s | Irreversible momentum |
| Impact | 0.1s | Flash of violence |
| Recovery | 1s | Aftershock, counter opening |

---

## DAMAGE SYSTEM (Prototype Version)

For the initial prototype, combat is extremely deadly to focus on core mechanics:

**Death Conditions:**
- **1 clean hit** (successful attack with no defense) = **instant death**
- **3 hits of any kind** (blocked, parried, or glancing) = **death**

**Rationale:** Simplified system allows focus on atomic turn mechanics and telegraph reading without complex damage calculations. More sophisticated damage systems will be added later.

---

## TELEGRAPH UI DESIGN

### Manga-Style Visual Panels

Telegraphs displayed as close-up panels showing body parts with text:
- Panel: Leg close-up + Large text: **"FOOT BACK"**
- Panel: Shoulders + Text: **"SHOULDER ROTATION"**

### Prediction Display

Shows possible attacks and probabilities:
- After "Foot back" telegraph:
  - **50% Horizontal Slash**
  - **50% Thrust**
  - (Not possible: Overhead Strike)

### Timebar_NPC_seen_by_PC

Displays attack timing window:
- **Minimum time:** Fastest possible attack from visible telegraphs
- **Maximum time:** Slowest possible attack from visible telegraphs
- **Uncertainty shading:** Narrows as more telegraphs revealed

**Example Progression:**
- Early: 1000-2500ms (wide uncertainty)
- Mid: 1200-1900ms (narrowing)
- Late: 1500-1800ms (almost certain)

---

## OUT OF SCOPE (For Now)

As you specified, these are noted but not current focus:
- **Statistics** - Will adjust once combat visualized
- **Equipment** - Will be in scope later
- **AI Game Master** - Out of scope
- **AI Generated Stories** - Out of scope

---

## NEXT STEPS (Recommended)

1. **Resolve contradictions** (see above)
2. **Define telegraph details** for existing combat skills
3. **Design combat skills JSON format**
4. **Choose tech stack** (React + Vite + PixiJS? or other?)
5. **Prototype combat testbed:**
   - Grid/hex movement
   - Atomic turn timeline visualization
   - 1v1 combat scenario
   - Telegraph display system
6. **Create more combat skills** to test variety and balance

---

## MY OBSERVATIONS & QUESTIONS

### On the Atomic Turn System:
This is genuinely innovative. The combination of:
- Simultaneous action evolution
- Progressive telegraph reveals
- Smart pauses at meaningful moments
- Deterministic outcomes

...creates a unique blend of real-time tactics and turn-based strategy. It could feel like playing chess while reading your opponent's poker tells.

### Questions for You:

1. **Telegraph visibility:** How will players "see" telegraphs? Visual cues on character models? UI indicators? Both?

2. **Cognitive load:** With telegraphs revealing at 10%, 20%, 40%, 60%, 80%, 95% - will players be overwhelmed tracking all this information?

3. **Learning curve:** How will players learn to recognize telegraphs? Tutorial? Practice mode?

4. **Multi-combatant scenarios:** How does the pause system work when 4+ characters are acting simultaneously?

5. **AI decision-making:** How will enemy AI decide when to commit to actions given the atomic timeline?

---

## ✅ COMBAT SKILLS JSON IMPLEMENTATION - COMPLETED

All combat skills have been implemented as separate JSON files for maximum modularity and git-friendliness.

### File Structure Created:

```
/CombatSkills/
  /attacks/
    slash.json
    thrust.json
    overhead_strike.json
    upward_strike.json
    diagonal_slash.json
  /defense/
    parry.json
    dodge_clean.json
    dodge_emergency.json
  /special/
    counter.json
    feint.json
  /combos/
    slash_slash_thrust.json
```

### JSON Schema Implemented:

Each skill JSON includes:
- **Basic info:** id, name, description, type, school
- **Combat phases:** windUp, committed, impact, recovery (with durations)
- **Telegraphs array:** bodyPart, triggerTime, visibilityPercent, description, possibleSkills[]
- **Resource costs:** stamina (with variable power), mp, focus, dailyFatigue
- **Damage/defense specs:** type, scaling, special properties
- **Metadata:** weaponTypes, tags, learningDifficulty, notes

### Example: Slash Telegraph Structure

```json
"telegraphs": [
  {
    "stage": 1,
    "bodyPart": "foot",
    "triggerTime": 200,
    "visibilityPercent": 20,
    "description": "Weight shifts to front foot, stance widens slightly",
    "possibleSkills": ["slash", "thrust", "diagonal_slash"]
  },
  ...
]
```

### Benefits Achieved:
- ✅ Modular: Each skill is independent file
- ✅ Git-friendly: Easy to track changes per skill
- ✅ Data-driven: No code changes needed for balance
- ✅ AI-ready: Clear structure for AI agents to modify
- ✅ Portable: Same JSON works across tech stacks

---

## TECH STACK RECOMMENDATION (From Combat3 - TechStack.md)

Based on your Combat3 - TechStack.md file, you have a detailed React + TypeScript + Vite architecture already designed:

### Recommended Stack:
- **Frontend:** React + TypeScript + Vite
- **Styling:** TailwindCSS
- **Animation/Rendering:** SVG or Canvas (PixiJS if needed)

### Architecture Components:
1. **CombatLoopController** - Runs 100ms atomic tick simulation
2. **TimelinePanel** - Displays 5 synchronized timebars:
   - Timebar_PC_actual
   - Timebar_PC_seen_by_NPC
   - Timebar_NPC_actual
   - Timebar_NPC_seen_by_PC
   - Timebar_Combined_actual
3. **ActionPanel** - Player action buttons
4. **PauseOverlay** - Prediction display + response options
5. **CombatLog** - Debug output (optional)

### Core Design Principle:
**Model-View-Controller separation** for maximum portability:
- **Core Game Engine (Model):** Pure TypeScript, zero React dependencies
- **React View Layer:** Subscribes to engine events, displays state
- **Benefit:** If switching to Phaser later, only rewrite View, keep Engine

---

## ✅ SUMMARY OF COMPLETED WORK

### Documents Updated:
1. **PRD.md** - Fixed contradictions, added damage system, telegraph UI, JSON references, updated scope
2. **Claude_Summary.md** - Marked contradictions as resolved, added combat phase details, telegraph UI, damage system

### Content Created:
1. **11 Combat Skill JSON files** organized in `/CombatSkills/` folder
   - 5 attack skills with full telegraphs and phases
   - 3 defense skills with readiness windows
   - 2 special skills (counter, feint)
   - 1 combo with bonuses

### Contradictions Resolved:
1. ✅ Weapon Parry - Using Version 2
2. ✅ Max Stamina - Constitution × 2
3. ✅ "Turn" terminology - Replaced with `<regeneration_rate>` variable

### Systems Defined:
1. ✅ Damage System - 1 clean hit OR 3 hits = death
2. ✅ Telegraph UI - Manga-style panels with prediction display
3. ✅ Combat Phases - 4-phase system (Wind-up, Committed, Impact, Recovery)
4. ✅ Telegraph Timing - Detailed stage-by-stage breakdown
5. ✅ Defense Windows - Sustained readiness with stamina modifiers

### Next Steps:
Ready to choose tech stack and begin prototype development. All design contradictions resolved, combat skills defined, and scope clarified.

---

## ✅ TECH STACK DECISION - APPROVED

### Chosen Stack: React + TypeScript + Vite

**Decision Date:** 2025-11-08

**Core Technologies:**
- **Game Engine:** Pure TypeScript (focus area - understand combat logic)
- **UI Framework:** React 18 (pre-built components - just needs to work)
- **Build Tool:** Vite (fast hot-reload, zero-config TypeScript)
- **Styling:** TailwindCSS (utility-first CSS, no custom CSS needed)
- **Rendering:** HTML/CSS initially (Canvas/PixiJS upgrade path available)

### Rationale:

**Your Priorities:**
1. ✅ TypeScript is a must - Want to understand combat system
2. ✅ UI is secondary - Just needs to work (5 timebars functional)
3. ✅ Learn through observation - Understand how it works, not write it all
4. ✅ Avoid refactoring - Complex UI from start (all 5 timebars)
5. ✅ Visual validation - Console logs + timebars are sufficient

**Why This Stack:**
- **Pure TypeScript Engine:** Your focus - read, understand, add logs, validate
- **React UI Components:** Pre-built - you don't need to master React
- **Clear MVC Separation:** Engine (your focus) independent from UI (just works)
- **Fast Iteration:** Vite hot-reload - save file, see changes instantly
- **Observation-Friendly:** Console logs + React DevTools show everything

### Architecture:

```
┌─────────────────────────────────────┐
│   TypeScript Combat Engine (Model)  │  ← YOUR FOCUS
│   • GameEngine.ts                   │
│   • Fighter.ts                      │
│   • TelegraphSystem.ts              │
│   • Pure TypeScript logic           │
└─────────────────────────────────────┘
            ↓ Events
┌─────────────────────────────────────┐
│   React UI Layer (View)             │  ← PRE-BUILT
│   • 5 Timebars                      │
│   • Action Buttons                  │
│   • Telegraph Panels                │
└─────────────────────────────────────┘
```

### Learning Path:

**Phase 1: Setup** (30-45 min)
- Install Node.js, npm
- Create Vite project
- Verify dev server works
- See SETUP_GUIDE.md

**Phase 2: Understand Engine** (Days 2-3)
- Read GameEngine.ts comments
- Trace one atomic tick
- Add console.logs
- Observe timebars

**Phase 3: Test Combat** (Week 1)
- Load JSON combat skills
- Execute Slash attack
- Watch telegraphs reveal
- Verify Impact resolution

**Phase 4: Validate System** (Week 2)
- Test all 11 skills
- Verify pause logic
- Check resource consumption
- Validate death conditions

### Documentation Created:

1. **TechStack_Recommendation.md** - Full architecture, learning path, code examples
2. **SETUP_GUIDE.md** - Step-by-step installation, troubleshooting, verification
3. **Claude_Summary.md** (this file) - Complete project overview

### Next Steps:

1. ✅ Read TechStack_Recommendation.md - Understand architecture
2. ✅ Read SETUP_GUIDE.md - Get environment running
3. ⏭️ Run setup commands - Install Node.js, create project
4. ⏭️ I create starter code - GameEngine skeleton + React components
5. ⏭️ You observe first test - Watch atomic ticks in action

---

**Status:** Design complete. Tech stack chosen. Ready for environment setup and implementation.
