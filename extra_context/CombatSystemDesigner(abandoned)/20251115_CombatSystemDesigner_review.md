# Deep Analysis of Combat System Rules & Tool Plan

**Date:** 2025-11-15
**Review of:** Combat System Designer specifications
**Reviewer:** AI Agent (Claude Code)

Let me provide a comprehensive critique of your game rules and tool-building approach.

---

## Part 1: Critical Analysis of Game Rules

### ✅ **What Works Well**

1. **Infinite Loop as Fairness Baseline** - Brilliant anchor point. If equal combatants can't reach equilibrium, the system is biased.

2. **Telegraph-Prediction Tradeoff** - "More certainty = less time to respond" is elegant tension.

3. **Three-Pause System** - Telegraph, recovery, death pauses create clear decision moments without twitch reflexes.

4. **Simultaneous Timeline** - Atomic ticks with parallel progression eliminates "whose turn is it?" ambiguity.

5. **Rock-Paper-Scissors Foundation** - Parry→Attack→Feint→Parry is classic and sound.

---

### 🚨 **Critical Flaws & Contradictions**

#### **FLAW 1: Parry Timing Paradox**
Your rules state:
- "Parry needs to be faster than Attack" (line 97)
- "Need to parry before committed attack to make it in time" (line 104)
- "Auto-Pause for Attacker and Defender when Attack is 0.1s before commitment" (line 108)

**The Problem:**
If Parry must be **faster than Attack** AND must start **before Attack commits**, then:
- PC starts Attack (windUp 1.0s → committed 0.5s → impact 0.2s)
- NPC sees telegraph at 0.5s, has 100% certainty
- NPC starts Parry (windUp 0.4s → active window)
- If Parry takes 0.4s total and Attack impacts at 1.7s, NPC must start Parry by 1.3s
- But if NPC starts Parry at 0.5s (telegraph reveal), they're **active and waiting for 0.8s before impact**

**This creates two issues:**
1. Parry being "faster" means shorter total duration, but that doesn't help if you must predict early
2. Long active windows drain stamina excessively OR make Parry trivial (just hold it)

**Suggested Fix:**
- Parry should have **short windUp** (quick reaction) but **tight active window** (±100-200ms)
- "Faster than Attack" should mean: `Parry.windUp < Attack.committed` (can react during commitment phase)
- Remove the "must parry before committed" rule—parries should work if active window overlaps impact tick

---

#### **FLAW 2: Feint Logic Contradiction**
Your rules state:
- "Feint beats Parry" (line 66)
- "Feint + Attack has to be longer than just Attack" (line 103)
- "Feint needs to be faster than Parry(+Attack)" (line 102)
- "Feint/Provoke is blind at 100% certainty threshold (don't see parry)" (line 112)

**The Problem:**
If Feint is "blind" and doesn't see Parry, how does it "beat" Parry? You need a **mechanism**:

**Option A: Feint as Cancel-Recast**
- PC starts Attack → NPC sees telegraph → NPC starts Parry
- PC uses Feint **during windUp**, cancels Attack, restarts Attack
- NPC's Parry active window triggers **too early** (before new Attack impact)
- PC's second Attack hits during NPC's recovery

**Option B: Feint as Morph**
- PC starts Attack → NPC sees telegraph (horizontal line) → NPC starts Parry(horizontal)
- PC uses Feint **during windUp**, changes Attack to different line (diagonal)
- NPC's Parry is wrong line → fails

**Your current implementation uses Option B** (see FeintSelectionModal.tsx), but your rules describe Option A.

**The timing issue:**
- If `Feint + Attack > Attack` (longer), attacker loses tempo
- If `Feint + Attack < Attack` (faster), it's strictly better than Attack
- If `Feint + Attack == Attack`, there's no cost to feinting

**Suggested Fix:**
Make Feint a **tempo sacrifice for prediction resistance**:
```
Feint mechanics:
- Can only be used during windUp (before committed)
- Adds +100ms to windUp (now opponent has MORE time to read you)
- Changes attack line OR restarts telegraphs (opponent loses prediction certainty)
- Costs 1.4x stamina
- Total duration: (windUp + 100ms) + committed + recovery
```

This way:
- Feint vs Parry: You sacrifice tempo to invalidate their prediction
- Attack vs Feint: You punish their slowness by hitting first
- Parry vs Attack: You predict correctly and negate damage

---

#### **FLAW 3: Bind/Power Struggle Tiebreaker**
You wrote:
> "If PC_strength == NPC_strength, a tie breaker is a comparison of Sum of windUp ticks and committed ticks accumulated over the combat by PC vs. NPC."

**The Problem:**
This creates a **degenerate strategy**: Once you've committed more total ticks than opponent, you should **always go for binds** because you'll always win.

**Example:**
- PC has committed 10s of windUp+committed over fight
- NPC has committed 12s of windUp+committed
- PC should NEVER attack-into-attack because they'll lose every bind
- NPC should ALWAYS attack-into-attack because they'll win every bind

**Suggested Fix:**
Replace cumulative ticks with **instantaneous commitment momentum**:
```
Bind winner = who has more "commitment depth" at moment of impact
Commitment depth = % through committed phase when impact occurs

Example:
- PC impact tick: 1.5s into 2.0s committed phase = 75% depth
- NPC impact tick: 1.0s into 1.5s committed phase = 67% depth
- PC wins bind (more committed to the strike)
```

This makes binds **situational**, not deterministic based on fight history.

---

#### **FLAW 4: The "Infinite Loop" Assumption**
You state equal combatants using optimal play should loop infinitely. But you need to define **what "optimal play" means** in your system.

**In classic RPS:**
- Optimal play is 33/33/33 random mix
- Result: Statistical draw over infinite iterations

**In your system with telegraphs:**
- Optimal play ≠ random mix (telegraphs give information)
- Optimal defender: Wait for max telegraph info, then counter
- Optimal attacker: Use fastest attack to minimize telegraph time

**This creates a contradiction:**
- If defender always waits for 100% certainty, attacker should use **fastest attack** (thrust)
- If attacker always uses thrust, defender should always **preemptive parry center line**
- If defender always parries center, attacker should **feint to diagonal**
- If attacker always feints, defender should **attack during feint's long windUp**
- Loop back to: If defender attacks, attacker should **parry**...

**But this loop depends on timing values!** If:
- `Thrust.total < Parry.total + Attack.total`, then Attack→Parry→Attack is too slow
- First attacker wins by **tempo**, not by RPS counters

**Suggested Fix:**
Define the infinite loop **scenario precisely**:
```
Scenario: "Neutral Exchange from Recovery"
- Both fighters in recovery simultaneously
- Both ready to act at tick T
- Both have full stamina, equal stats
- Both have all skills available

Optimal strategy should cycle:
1. PC waits for NPC telegraph → NPC waits for PC telegraph → DEADLOCK
   - Solution: First mover disadvantage (telegraphs reveal intent)

2. PC provokes (commits to feint/weak attack) → NPC responds → PC counters response
   - Solution: Provocation has cost (stamina/time) that balances info gain

3. Both commit to "safe" option that doesn't lose to any counter
   - Solution: No such option exists (RPS has no dominant strategy)
```

You need to **solve the deadlock** problem first, or the game becomes "who attacks first loses."

---

### 🤔 **Unclear/Untestable Rules**

1. **"At least 0.1s has to pass for first telegraph to appear"** - Why 0.1s? This should be derived from martial realism or playtesting, not arbitrary.

2. **"Parry is full commitment. If you do fake parry you die"** - What's a "fake parry"? Do you mean feinting out of parry? You said parry can't be feinted (line 100).

3. **"Feint/Provocation needs to threaten to be addressed"** - How do you mechanically enforce this? If Feint doesn't deal damage, why must it be addressed?

4. **"Downsides: Parry at 100% certainty is weaker"** - Weaker how? Less damage reduction? Longer recovery?

---

## Part 2: Critical Analysis of Tool Plan

### ✅ **What's Smart**

1. **Scenario-Based Testing** - Encoding "Parry beats Attack" as a test case is excellent for validation.

2. **Visual Timeline Editor** - Your wireframe shows you understand the need to **see** timing overlaps.

3. **Automated Validation** - Running scenarios to check assumptions will catch timing bugs early.

4. **Multi-Scenario Comparison** - Side-by-side comparison of "Parry vs Attack" and "Attack vs Feint" will reveal balance issues.

---

### 🚨 **Critical Issues with Tool Approach**

#### **ISSUE 1: You're Building the Wrong Tool First**

You're planning a **mixer/editor UI** to manually test scenarios, but your **rules aren't stable yet**. You have contradictions and undefined mechanics.

**What you actually need first:**
1. **A mathematical model** (spreadsheet or Python script) that calculates outcomes
2. **A constraint solver** that finds timing values satisfying your rules
3. **THEN** a visual tool to explore the solution space

**Why this order matters:**
- Your wireframe shows "Parry Wins" as the outcome, but you haven't **proven** your timing values produce that result
- If you build the UI first, you'll spend weeks tweaking scenarios only to discover your rules are impossible to balance
- A model lets you test **1000 scenarios in 1 second** vs. dragging UI blocks manually

---

#### **ISSUE 2: Missing the "Solver" Component**

You wrote:
> "Parry needs to be faster than Attack"
> "Attack needs to be faster than Feint+Attack"
> "Feint+Attack needs to outmaneuver parry"

These are **constraints**, not values. You need a tool that:
1. Takes constraints as input
2. Finds timing values that satisfy all constraints
3. Tells you if constraints are **contradictory**

**Example constraint system:**
```
Variables:
- Attack_windUp, Attack_committed, Attack_recovery
- Parry_windUp, Parry_active, Parry_recovery
- Feint_duration

Constraints:
- Attack_total < Parry_total + Attack_total  (Attack beats Parry→Attack)
- Parry_windUp + Parry_active must overlap Attack_impact (Parry beats Attack)
- Feint + Attack_total > Attack_total (Feint is slower)
- Parry_active < 500ms (Parry window is tight)
- Attack_windUp > 100ms (First telegraph delay)

Solve for: Valid ranges of each variable
```

**This is a constraint satisfaction problem (CSP).** Tools:
- **Spreadsheet** with formula solver (Excel/Sheets)
- **Python + constraint library** (python-constraint, OR-Tools)
- **SMT solver** (Z3) for complex logic

---

#### **ISSUE 3: The Wireframe Shows Manual Work, Not Automation**

Your wireframe has:
- Manual selection of actions
- Manual timing placement
- Manual outcome interpretation

**What you should automate:**
1. **Generate scenarios from rules** - "Test all 3x3 RPS matchups"
2. **Calculate outcomes deterministically** - "Given these timings, who wins?"
3. **Highlight rule violations** - "Attack should beat Feint, but Feint won - timing bug!"

---

### 💡 **Alternative Approach: Build a Combat Simulator First**

Instead of a visual editor, I recommend:

**Phase 1: Combat Rules Engine (1-2 days)**
- A TypeScript/Python class that simulates combat tick-by-tick
- Input: Action sequences for PC and NPC
- Output: Complete combat log with outcomes
- Can run **headless** (no UI needed for testing)

**Phase 2: Automated Test Suite (1 day)**
- Define scenarios as JSON:
```json
{
  "name": "Parry beats Attack",
  "pc_actions": ["attack_thrust"],
  "npc_actions": ["wait:500", "parry_center"],
  "expected_outcome": "npc_blocks",
  "expected_winner": "npc"
}
```
- Run all scenarios, report pass/fail

**Phase 3: Constraint Solver/Balancer (2-3 days)**
- Script that finds timing values satisfying your rules
- Outputs: "Attack windUp: 400-600ms, Parry windUp: 200-300ms"

**Phase 4: Visual Editor (3-5 days)**
- NOW build the mixer UI, using the validated rules engine
- Drag-drop actions onto timeline
- Real-time simulation using Phase 1 engine
- Comparison mode for side-by-side scenarios

**Why this order:**
- Phase 1-3 can be built **quickly** with minimal UI work
- You validate rules **before** investing in visual tools
- Phase 4 becomes easier because the engine is already debugged

---

### 💡 **What Files Would Help Me (AI Agent)?**

To effectively assist you, I would need:

**1. Formal Rules Definition:**
```yaml
# combat_rules.yaml
mechanics:
  - name: "Parry beats Attack"
    condition: "defender.parry.active_window overlaps attacker.attack.impact_tick"
    outcome: "attack_blocked"

  - name: "Attack beats Feint→Attack"
    condition: "attacker1.attack.impact_tick < attacker2.feint_attack.impact_tick"
    outcome: "attacker1_hits_first"

timing_constraints:
  - rule: "Parry.windUp < Attack.committed"
    reason: "Defender must react during attacker's commitment"

  - rule: "Feint.duration + Attack.total > Attack.total"
    reason: "Feint sacrifices tempo"
```

**2. Test Scenario Catalog:**
```json
// scenarios/parry_vs_attack.json
{
  "id": "parry_vs_attack_100pct",
  "description": "NPC parries PC attack at 100% certainty",
  "initial_state": {
    "pc": { "hp": 3, "stamina": 20, "position": 0 },
    "npc": { "hp": 3, "stamina": 20, "position": 0 }
  },
  "actions": [
    { "tick": 0, "actor": "pc", "skill": "thrust" },
    { "tick": 500, "actor": "npc", "skill": "parry_center" }
  ],
  "assertions": {
    "outcome": "npc_blocks",
    "npc_hp_final": 3,
    "pc_stamina_spent": ">=3"
  }
}
```

**3. Combat Log Format:**
```json
// Standard output format for analysis
{
  "scenario_id": "parry_vs_attack_100pct",
  "tick_log": [
    { "tick": 0, "event": "pc_starts_thrust", "phase": "windUp" },
    { "tick": 100, "event": "telegraph_1_revealed", "certainty": 0.33 },
    { "tick": 500, "event": "npc_starts_parry_center", "phase": "windUp" },
    { "tick": 600, "event": "pc_enters_committed", "phase": "committed" },
    { "tick": 700, "event": "npc_parry_active", "phase": "active" },
    { "tick": 850, "event": "pc_impact_tick", "result": "blocked_by_parry" }
  ],
  "outcome": {
    "winner": "npc",
    "reason": "parry_active_during_impact",
    "pc_hp": 3,
    "npc_hp": 3
  }
}
```

**4. Timing Profiles:**
```json
// skill_timings.json - Easy to tweak for balancing
{
  "thrust": {
    "windUp": 400,
    "committed": 300,
    "impact_tick": 700,
    "recovery": 500,
    "telegraphs": [
      { "tick": 100, "info": "stance_shift", "reveals": ["thrust", "slash", "overhead"] },
      { "tick": 400, "info": "weapon_angle", "reveals": ["thrust"] }
    ]
  },
  "parry_center": {
    "windUp": 200,
    "active_duration": 300,
    "recovery": 400
  }
}
```

With these structured files, I could:
- **Validate** that your timing values satisfy constraints
- **Simulate** thousands of combat scenarios
- **Identify** rule contradictions automatically
- **Suggest** timing adjustments to fix imbalances
- **Generate** test cases you haven't thought of

---

## Summary & Recommendations

### **Game Rules: Fix These First**
1. ❌ **Parry timing paradox** - Clarify "faster" means shorter windUp, not shorter total duration
2. ❌ **Feint mechanism undefined** - Choose: Cancel-recast OR Line-morph, not both
3. ❌ **Bind tiebreaker creates degeneracy** - Use instantaneous commitment depth, not cumulative history
4. ❌ **Infinite loop undefined** - Specify the exact scenario that should loop

### **Tool Plan: Rebuild Priority**
| Your Plan | My Recommendation | Why |
|-----------|-------------------|-----|
| Visual editor first | **Constraint solver first** | Rules have contradictions; need to find valid timings before building UI |
| Manual scenario testing | **Automated test suite** | 1000 scenarios/second vs. dragging blocks |
| Mixer UI for balance | **Spreadsheet model first** | Rapid iteration on timing values without UI overhead |
| AI assistant last | **Structured data formats first** | AI can't help without parseable rules/logs |

### **Proposed Plan**
1. **Week 1**: Fix rule contradictions, write formal constraints
2. **Week 1**: Build headless combat simulator (reuse your GameEngine.ts!)
3. **Week 2**: Create automated test suite with 20-30 core scenarios
4. **Week 2**: Build constraint solver to find valid timing ranges
5. **Week 3**: Build visual editor using validated engine
6. **Week 3**: Integrate AI assistant with structured outputs

**The key insight:** Your existing `GameEngine.ts` is **already 80% of the simulator you need**. You don't need a new tool—you need to:
1. Make it **runnable headless** (no React UI)
2. Add **scenario loading** from JSON
3. Add **outcome assertions** to validate results
4. Build a simple **test runner** that executes 100 scenarios and reports pass/fail

Then layer the visual editor on top **after** the rules are proven to work.

---

## Next Steps

Would you like me to proceed with building the headless simulator + test suite approach, or do you prefer the visual editor path?
