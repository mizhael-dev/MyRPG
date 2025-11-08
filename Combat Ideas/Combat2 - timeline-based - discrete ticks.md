Perfect — you want **player and NPC to share identical deterministic rules**, grounded purely in **timing, resource use, and intent prediction**, without any “stat roll” influence.

Let’s build the **Combat Timing System** as a full, modular framework that can serve as the backbone for your prototype.

---

# ⚔️ Combat Timing System (Deterministic Model)

## 1. Core Principle

Combat is **timeline-based**, not “turn-based” in the D&D sense.
Each action consumes *real combat time* — a measurable sequence of milliseconds.

Every fighter has a **timeline**, and the combat engine advances time in discrete **ticks** (e.g. every 100 ms).
All combat decisions and outcomes resolve from the relative timing of events.

---

## 2. Combat Action Lifecycle

Every action (attack, move, defend, feint, recover) goes through the same deterministic phases:

| Phase                            | Duration               | Description                                                         | Player/NPC Can...                                                |
| -------------------------------- | ---------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Preparation**                  | Instant or small delay | Action chosen, resources reserved (stamina, MP, focus).             | Queue the next move, feint, or cancel (at resource cost).        |
| **Wind-up (Cast Time)**          | e.g. 500–3000 ms       | Telegraphs appear progressively — stance, foot, shoulder, weapon.   | Observe, attempt to read opponent, or pre-empt with parry/dodge. |
| **Impact Frame (Strike Moment)** | 1 tick                 | Action resolves — attack connects, parry checks trigger.            | Resolution of hit/parry/faint is purely timing-based.            |
| **Recovery**                     | e.g. 200–1200 ms       | Character is regaining balance, cannot attack or parry effectively. | Can reposition slowly, raise guard, or prepare a light feint.    |
| **Cooldown Complete**            | —                      | Action fully completed.                                             | New action may begin.                                            |

This cycle replaces “turns” — all combatants continuously flow through their personal timelines, synchronized by ticks.

---

## 3. Timeline Resolution

At each tick (e.g. every 100 ms):

1. **Advance all combatants’ timers.**
2. **Broadcast visible telegraph stage** for each action-in-progress.
3. **Check for incoming impacts** and resolve them deterministically:

   * If opponent started a *parry* before the impact frame → block succeeds.
   * If parry starts after → fails.
4. **Update resources (stamina, focus, MP, daily fatigue).**

   * Costs are applied at *Preparation*, *Impact*, and *Recovery* phases depending on the action.
5. **Check for death or exhaustion states.**

This makes combat “simultaneous turn-based” — time-sliced but not RNG-dependent.

---

## 4. Telegraph Resolution Timeline

Each attack has a defined **Telegraph Curve**, describing how recognizable it becomes as time progresses.

Example for a 2000 ms “Slash”:

| Time (ms) | Visible Cues              | Clarity (0–1) | Opponent Reaction                  |
| --------- | ------------------------- | ------------- | ---------------------------------- |
| 0–500     | Foot movement             | 0.2           | Guess attack class (melee/ranged?) |
| 500–1200  | Shoulder and torso rotate | 0.5           | Guess possible attack arc          |
| 1200–1800 | Weapon angle reveals      | 0.8           | Identify Slash vs Thrust           |
| 1800–2000 | Full wind-up              | 1.0           | Reaction window nearly gone        |

A **parry or dodge** must be *declared* before or during this window.
If declared:

* **Too early:** may be wrong (guessed attack incorrectly).
* **Too late:** fails (attack already in impact frame).

---

## 5. Reaction Timing Example

Imagine two fighters:

| Character | Action | Total Cast Time | Start (ms) |
| --------- | ------ | --------------- | ---------- |
| Player    | Slash  | 2000            | 0          |
| NPC       | Parry  | 1000            | 1000       |

Timeline:

* `0–500`: Player begins wind-up (telegraph minimal).
* `500–1200`: NPC starts recognizing the attack pattern.
* `1000`: NPC begins parry → will complete at 2000.
* `2000`: Player impact frame hits exactly as parry finishes → **successful parry** (deterministic outcome).

Had the NPC started at 1200 ms → completion at 2200 ms → **parry fails** (too late).

---

## 6. Deterministic Priority Rules

If multiple impact frames occur in the same tick:

1. **Initiative = Action start time + Cast Time.**
2. If equal: heavier weapon or higher stamina investment wins (represents force advantage).
3. If both equal: simultaneous clash → both take partial damage and enter extended recovery.

---

## 7. Resource Coupling

* **Preparation Phase:** Reserve Stamina/MP/Focus immediately.
* **Impact Frame:** Apply the “Bonus use” multiplier (e.g., 50% more stamina for more speed).
* **Recovery Phase:** Regain fractional stamina (e.g., 25% of cost).
* Exhaustion penalties trigger automatically when resources hit zero, delaying recovery.

This ensures fatigue and overuse matter in the timing loop.

---

## 8. Feints and Mind Games

Because timing is predictable, feints become natural:

* You can **cancel** an attack mid-wind-up (before 50%) → costs 50% stamina of the move.
* The opponent who prematurely parried or dodged now wastes stamina and loses initiative.
* This keeps the “telegraphing” layer dynamic and psychological, not purely reactive.

---

## 9. Implementation Blueprint (Prototype Logic)

```python
# pseudocode
for tick in range(0, combat_duration, TICK_SIZE):
    for fighter in fighters:
        fighter.advance_time(TICK_SIZE)

        if fighter.current_action:
            fighter.update_telegraph()
            
            if fighter.action.is_impact_tick(tick):
                target = fighter.target
                resolve_combat(fighter, target)
                
        fighter.update_recovery()
        fighter.regenerate_resources()
```

Each `fighter`’s `action` object contains:

```python
{
  "state": "windup" | "impact" | "recovery",
  "time_remaining": 1200,
  "telegraph_stage": 0.5
}
```

---

## 10. Why It Works

✅ **Deterministic:** No dice rolls, only timing and player choices.
✅ **Shared Rules:** NPCs and players obey identical phase and resource rules.
✅ **Skill Expression:** Predicting intent and timing reaction gives mastery depth.
✅ **Expandable:** Can later add *movement timing*, *multi-directional parries*, *terrain modifiers*, etc.

---

Would you like me to extend this next into a **timeline data structure and tick resolver** (so you can test it in code form, e.g., in Python or pseudo-Angular simulation)? That would let us see duels play out deterministically frame by frame.
