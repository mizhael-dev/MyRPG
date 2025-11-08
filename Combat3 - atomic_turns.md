Perfect. Below is the **merged and fully structured version** — it combines the comprehensive *Combat Timing System* (phases, defense logic, decision pauses, telegraphs, timelines, pacing, etc.) with the **atomic-turn breakdown format** you liked from the second message.

This version is the most complete design so far — it describes *how the system behaves conceptually* **and** *how it runs tick by tick in practice.*

---

# ⚔️ **Deterministic Combat Timing System (Integrated Design)**

## 1. Core Vision

Combat is **deterministic**, **time-sliced**, and **shared by all participants**.
No random rolls or hidden modifiers — every duel unfolds through **timing**, **stamina**, and **decision-making**.

Each encounter is a rhythm of **information, commitment, and consequence**:
fighters read each other’s movements, predict intentions, and act within narrow time windows.

---

## 2. Core Combat Cycle

Every combat action progresses through the same deterministic phases.

| **Phase**                                  | **Duration** | **Attacker Capabilities**                                 | **Defender Capabilities**                                                          | **Notes**                                               |
| :--- | :--- | :--- | :--- | :--- |
| **Wind-up (Preparation / Intent Forming)** | 500-2000 ms  | Begin attack motion; may cancel; may feint...             | The more time passes, the clearer the telegraph becomes.                           | Begin reading telegraphs and prepare a defensive state. |
| **Committed (Point of No Return)**         | 300-800 ms   | Cannot cancel or feint; momentum builds; stamina drains   | Must already have defense active or starting; can sustain defense at stamina cost. | Determines who will reach Impact first.                 |
| **Impact (Resolution Frame)**              | 1 tick       | Attack resolves; stamina/focus costs                      | Defense resolves if active across this tick.                                       | Timing only – no RNG.                                   |
| **Recovery (Follow-through)**              | 300-1500 ms  | Regain balance, partial movement; cannot attack or parry. | Opportunity to counter or reposition.                                              | Heavier actions = longer recovery.                      |
---

## 3. Defense as Readiness Windows

Defenses are **sustained states**, not instant reactions.

Each defense defines:

* **Start time** – when the defensive move begins.
* **Readiness window** – the interval where the defense can absorb or counter an Impact.
* **Stamina modifier** – widens or narrows the window.

| Modifier  | Description   | Effect                       |
|-----------|---------------|------------------------------|
| + Stamina | Extend window | More safety, faster fatigue. |
| Base      | Default width | Balanced trade-off.          |
| − Stamina | Narrow window | Precise timing, less cost.   |

A parry might normally hold for **Impact ± 150 ms**; spending extra stamina widens it to **± 300 ms**.

---

## 4. Deterministic Timing Engine

Time advances in fixed **atomic ticks** (e.g., 100 ms).
Each tick:

1. Advances all timers.
2. Updates telegraph visibility.
3. Resolves any Impact events.
4. Updates stamina/focus usage.
5. Checks whether to trigger a **decision pause**.

---

## 5. Decision Pauses

Pauses are **not reflex events**; they occur only when the information state changes.

**Triggers**

1. New meaningful information becomes visible (new telegraph stage).
2. A queued choice or window is about to expire.

**During a Pause**

* The player may choose **any currently valid action**, including *Wait*.
* The UI shows prediction percentages, remaining time to Impact, and which options still fit in time.
* As time passes, options naturally fall out of range — no artificial “early/mid/late” locks.

---

## 6. Telegraph Reading & Prediction

Telegraphs reveal information progressively:

| Stage               | Typical Time | Visible Cue           | Defender Learns           |
|---------------------|--------------|-----------------------|---------------------------|
| **Footwork**        | 0–400 ms     | Direction / advance   | “Melee incoming.”         |
| **Shoulder Motion** | 400–900 ms   | Attack vector forming | “Slash or Thrust likely.” |
| **Weapon Angle**    | 900–1500 ms  | Type clarifies        | “Probably Thrust.”        |
| **Full Extension**  | 1500–1900 ms | Confirmed motion      | “Almost certain: Thrust.” |

Prediction UI displays percentages and narrows the **estimated Impact window**.

---

## 7. Available Time Window

At any tick, defenders see a predicted **min–max Impact window**, narrowing as telegraphs refine:

| Stage | Estimated Impact | Example                     |
|-------|------------------|-----------------------------|
| Early | 1000–2500 ms     | “Incoming within 1–2.5 s.”  |
| Mid   | 1200–1900 ms     | “Likely within 1.2–1.9 s.”  |
| Late  | 1500–1800 ms     | “Almost certain at ~1.7 s.” |

Actions fading outside this range are disabled or shown as unavailable.

---

## 8. Combined Timeline Concept

The **combined timeline** overlays both combatants’ actions on the same temporal axis:

* **Own timeline:** shows your current phase, stamina, focus, and cooldowns.
* **Opponent timeline:** shows telegraph stage and predicted Impact window with uncertainty shading.
* **Merged timeline:** aligns both on one axis, displaying overlaps and readiness intervals.

This makes **tempo** visually intuitive without adding tokens or stats.

---

## 9. Defensive Action Spectrum

| Defense             | Active Duration                                           | Base Cost                   | Scalable Window | Effect                                     |
|---------------------|-----------------------------------------------------------|-----------------------------|-----------------|--------------------------------------------|
| **Parry / Block**   | Must be ready before Impact and maintained through window | Medium stamina              | Adjustable      | Negates damage, extends attacker recovery. |
| **Counter**         | After parry overlap                                       | High focus                  | —               | Riposte during attacker’s recovery.        |
| **Clean Dodge**     | Active during late Wind-up → pre-Impact                   | Low stamina                 | —               | Evades completely, maintains initiative.   |
| **Emergency Dodge** | Just before or at Impact                                  | High stamina, long recovery | —               | Reduces but doesn’t nullify damage.        |
| **Wait / Cancel**   | Passive                                                   | —                           | —               | Preserve stamina, observe more telegraphs. |

---

## 10. Atomic-Turn Timeline: Example Duel

### Combatants

* **Player:** *Slash* (2000 ms)
* **NPC:** *Parry* (1000 ms cast, readiness ± 200 ms)
* **Tick:** 100 ms
* **Span:** 0–2200 ms

| Time (ms)     | **Combined Timeline** | **Player**      | **NPC** | **Notes**          |                                   |                                   |
|---------------|-----------------------|-----------------|---------|--------------------|-----------------------------------|-----------------------------------|
| **0000**      | `                     | Start           | `       | Begin Slash (0 %)  | Observing                         | Both enter system.                |  |  |
| **0100**      | `                     | Foot Shift      | `       | 10 %               | Tracking                          | Telegraph minor; no pause.        |  |  |
| **0200**      | `                     | Footwork Stable | `       | 20 % ⚡             | Sees stance → pause               | Defender may Wait or ready Parry. |  |  |
| **0400**      | `                     | Shoulder Turn   | `       | 40 % ⚡             | Predict Slash 60 % / Thrust 40 %  | Info update; may start Parry.     |  |  |
| **0500**      | `                     | Wind-up ¼       | `       | 25 %               | Starts Parry (0 / 1000) (Stam –1) | NPC commits.                      |  |  |
| **0900**      | `                     | Telegraph↑      | `       | 75 % ⚡             | Parry 60 %                        | Info update → optional pause.     |  |  |
| **1100–1300** | `                     | Final Wind-up   | `       | 85–95 %            | Parry 95 % → [1800–2200] ready    | Defense active, stamina drain.    |  |  |
| **1400**      | `                     | Commit          | `       | Locked in          | Holding Parry (Stam –0.5)         | No more feints.                   |  |  |
| **1700**      | `                     | Approach Impact | `       | Near Impact        | Still ready 🕓                     | Window nearing expiry check.      |  |  |
| **2000**      | `                     | Impact ↑        | `       | Impact tick        | Overlaps window → Parry Success   | Deterministic resolution.         |  |  |
| **2000–2200** | `                     | Recovery        | `       | Recovery (Stam –2) | Counter window 200 ms             | Flow continues.                   |  |  |
| **2200**      | `                     | Follow-through  | `       | Mid-Recovery       | Executes Counter (Impact 2300 ms) | Tempo shifts naturally.           |  |  |

---

## 11. Timeline Mechanics Summary

* **Atomic Resolution:** both actors update each tick; no “turn order.”
* **Defense Window:** begins once charged and lasts ± N ms; stamina scales its width.
* **Pause Triggers:** new telegraph info or expiring choice.
* **Outcome Logic:** a defense succeeds if active during Impact tick; otherwise the hit lands.

---

## 12. Pacing Targets

Average duel exchange: **≈ 2.5–3 seconds**

| Segment   | Duration | Feel                            |
|-----------|----------|---------------------------------|
| Wind-up   | 1 s      | Rising tension                  |
| Committed | 0.5 s    | Irreversible momentum           |
| Impact    | 0.1 s    | Flash of violence               |
| Recovery  | 1 s      | Aftershock, opening for counter |

This rhythm feels tactical yet visceral — not twitchy, not slow.

---

## 13. System Observations

| Aspect               | Behavior                                                              |
|----------------------|-----------------------------------------------------------------------|
| **Simultaneity**     | Every fighter progresses in real time — pure symmetry.                |
| **Fairness**         | Same physics, same fatigue, same logic.                               |
| **Information Flow** | Decisions emerge only when perception changes.                        |
| **Defense Duration** | Readiness sustained through multiple ticks; stamina shapes endurance. |
| **Player Load**      | Typically 2–3 pauses per 2 s exchange — dense but digestible.         |

---

## 14. Why It Works

✅ *Deterministic fairness* — no hidden rolls.
✅ *High readability* — time and intent are visible.
✅ *Strategic pacing* — decisions occur at true information thresholds.
✅ *Depth through overlap* — every feint, clash, or counter arises from timing geometry.
✅ *Scalable* — supports additional combatants, weapon types, and environmental factors without redesigning the loop.

---

Would you like the **next version** to show a **multi-attack comparison** (e.g., *Slash* vs *Thrust* offset by 200 ms to visualize overlapping impacts and partial clashes), or should we move to **modeling defense-window stamina formulas** first?
