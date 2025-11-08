## Attack Damage Calculation:
1. **Attacker's Base Skill Damage**: simple attack is 0
2. **Modifiers**:
   - **Add** Attacker's Weapon Damage and (0.1 * Attacker's Strength Attribute).
   - **Subtract** Defender's **Armor Damage Reduction**.
   - **Adjust** for **Environmental or situational bonuses or penalties.**


---


## 🧩 Phase 1: Define Core Combat Loop (Player + NPC follow same rules)

Both player and NPCs act under identical timing, visibility, and fatigue rules.

**Turn = Time Slice (e.g. 200ms - 1000ms segments)**
Each turn, every combatant:

1. Chooses an *action* (attack, move, defend, wait, feint).
2. Begins the **execution timeline**:

   * **Cast Time (wind-up)** → visible telegraphs start.
   * **Contact Frame (impact)** → attack resolves.
   * **Recovery Time (cooldown)** → vulnerable state.

**Goal:**
Player and NPC act simultaneously; outcomes depend on prediction, timing, and stamina/focus economy.

---

## ⚔️ Phase 2: Telegraph Reading System (Predictive Combat)

“intent reading” concept game logic:

| Phase                    | What Happens                   | Visible To Opponent                            | Player Choice                                    |
| ------------------------ | ------------------------------ | ---------------------------------------------- | ------------------------------------------------ |
| **0. Preparation**       | Fighter selects action         | Nothing                                        | Choose stance / wait / fake                      |
| **1. Telegraph Start**   | Movement, stance, weapon shift | Partial cues visible based on Perception skill | Guess possible actions, prepare counter or dodge |
| **2. Telegraph Deepens** | Attack intent becomes clearer  | Cues become specific (e.g., thrust vs slash)   | Player can commit to counter or defend           |
| **3. Attack Impact**     | Damage is applied              | —                                              | Outcome based on whether counter matched intent  |
| **4. Recovery**          | Fighter recovers               | —                                              | Opportunity to punish if opponent overcommitted  |

The **accuracy of prediction** grows over time, but **reaction window shrinks**, forcing a tactical trade-off:

* React **early** = more time but less certainty.
* React **late** = more certainty but less time.


---

## 🧮 Phase 3: Decision Engine for AI (shared logic)

NPCs run on the same system:

* Evaluate visible telegraphs.
* Predict likely attack.
* Choose **defend**, **dodge**, **counter**, or **feint** based on certainty.
* Same stamina/focus costs and recovery frames apply.

This gives the sense of an intelligent opponent *without scripting “cheating” behaviors.*

---

## 🧱 Phase 4: Prototype Architecture

Propose to model actions as **JSON combat states**:

```json
{
  "action": "slash",
  "castTime": 2000,
  "recoveryTime": 100,
  "telegraphProfile": {
    "foot": "forward",
    "shoulders": "left_turn",
    "weaponPosition": "high",
    "stance": "offensive"
  },
  "cost": { "stamina": 2 },
  "school": "none"
}
```

Each 200ms tick of the cast time can update which part of the telegraph is visible.