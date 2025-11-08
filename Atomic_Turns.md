Below is a **text-based diagram** that shows how your **deterministic telegraph-based combat** behaves on an **atomic-turn timeline**, step by step, tick by tick.

This version keeps fidelity to your rules:

* both combatants act under identical logic,
* timing and stamina drive outcomes,
* telegraphs unfold progressively,
* defense readiness is a window,
* pauses occur when *meaningful information* emerges or an *option is about to expire*.

---

# ⚛️ **Atomic-Turn Timeline: Example Duel**

### Combatants:

* **Player:** uses *Slash* (2000 ms total duration).
* **NPC:** uses *Parry* (1000 ms cast, readiness ±200 ms window).
* **Tick size:** 100 ms (the atomic unit of time).
* **Simulation span:** 0–2200 ms (22 ticks).

---

## 🧭 **Legend**

| Symbol         | Meaning                                        |
| -------------- | ---------------------------------------------- |
| `P:`           | Player’s current phase or telegraph info       |
| `E:`           | Enemy (NPC) current phase or defense readiness |
| `⚡`            | New telegraph info available → possible pause  |
| `🕓`           | Decision pending (option nearing expiration)   |
| `↑`            | Impact frame                                   |
| `[Ready X–Y]`  | Defense readiness window                       |
| `(Stamina -n)` | Resource change                                |

---

## 🕒 **Atomic-Turn Breakdown**

| Time (ms)     | Player Timeline                               | NPC Timeline                                             | Notes                                                                    |
| ------------- | --------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------ |
| **0000**      | P: *Start Slash* (Wind-up 0%)                 | E: Idle, observing                                       | Both enter atomic time system.                                           |
| **0100**      | P: Early foot shift (Telegraph 10%)           | E: Tracking.                                             | Telegraph invisible to casual eye.                                       |
| **0200**      | P: Footwork stable (20%) ⚡                    | E: Sees stance change, system pause triggers (new info). | Pause: defender can *Wait* or prepare *Parry*.                           |
| **0300**      | P: Continues Wind-up                          | E: Chooses *Wait*.                                       | No stamina spent yet.                                                    |
| **0400**      | P: Shoulders rotate (40%) ⚡                   | E: Prediction “Slash 60%, Thrust 40%”.                   | Second pause possible; defender decides *Parry start soon*.              |
| **0500**      | P: Wind-up 25% complete                       | E: Prepares Parry (0/1000 ms). (Stamina -1)              | NPC begins action.                                                       |
| **0600–0800** | P: Weapon lifting (Telegraph 60%)             | E: Parry building (30–50%)                               | Defense not ready yet.                                                   |
| **0900**      | P: Wind-up 45%                                | E: Parry 60%                                             | New info visible (Telegraph 75%) ⚡ → Pause possible (meaningful update). |
| **1000**      | P: Shoulders aligned (Telegraph 80%)          | E: Parry 70%                                             | Defense almost primed.                                                   |
| **1100–1300** | P: Late Wind-up (85–95%)                      | E: Parry 85–95%, opens readiness window [1800–2200].     | Defense can now catch an Impact if it falls within that window.          |
| **1400**      | P: Transition to *Committed* (cannot cancel). | E: Holding Parry (stamina drain). (Stamina -0.5)         | No more feints.                                                          |
| **1500**      | P: Weapon angle visible (Telegraph 95%) ⚡     | E: Confirms “Slash” (95%).                               | Info update → optional pause.                                            |
| **1600**      | P: Committed momentum (weapon swing).         | E: Holding defense (ready).                              | No pause — nothing new yet.                                              |
| **1700**      | P: Swing nearly complete.                     | E: Still ready [1800–2200].                              | 🕓 Window approaching start; system checks for decision expiry.          |
| **1800**      | P: Impact imminent.                           | E: Readiness active.                                     | Both locked in.                                                          |
| **2000**      | P: **Impact ↑**                               | E: Defense overlaps window → **Parry Success**           | Deterministic resolution.                                                |
| **2000–2200** | P: Recovery (Stamina -2).                     | E: Counter opportunity opens for 200 ms.                 | System continues atomic progression.                                     |
| **2200**      | P: Mid-recovery.                              | E: Executes *Counter* (Impact 2300 ms).                  | Tempo naturally shifts without needing initiative tokens.                |

---

## 🔍 **Timeline Analysis**

**Time Flow:**

* Each 100 ms tick is an **atomic unit**.
* No discrete turns; both sides’ actions advance simultaneously.
* Game state is synchronized at every tick boundary.

**Pause Triggers:**

1. **Telegraph visibility changes (⚡)** — new meaningful information appears.
2. **Defense window or action about to expire (🕓)** — last chance to adjust.

**Defense Window Rule:**

* Defense becomes effective at 100% preparation, remains ready for ±N ms.
* Wider window → higher stamina cost.
* Defense must *still be active* during the attacker’s Impact tick.

**Outcomes:**

* Parry succeeds if ready and active across Impact frame.
* Otherwise, Impact hits cleanly.
* Timing, not RNG, determines result.

---

## 💡 **Atomic Turn Observations**

| Aspect               | Behavior                                                                            |
| -------------------- | ----------------------------------------------------------------------------------- |
| **Simultaneity**     | Both actions evolve each tick — no artificial “turns.”                              |
| **Fairness**         | Shared timing logic; whoever’s action reaches Impact first naturally hits first.    |
| **Decision Flow**    | Pauses happen organically at info thresholds, not every tick.                       |
| **Defense Duration** | Defense readiness behaves like an “aura” sustained over multiple atoms.             |
| **Pacing**           | Continuous but comprehensible; player experiences 2–3 pauses per 2-second exchange. |

---

## 🧩 **Why This Mapping Matters**

* You can now model *any* weapon, stance, or move purely through duration values and telegraph thresholds.
* Atomic ticks provide **resolution precision** — you can later simulate higher fidelity (50 ms, 33 ms, etc.) without rewriting logic.
* Every emergent behavior (clash, counter, feint, exhaustion) stems from how atomic phases overlap — not random rolls.
* It’s deterministic, fair, and scalable to multiple combatants.