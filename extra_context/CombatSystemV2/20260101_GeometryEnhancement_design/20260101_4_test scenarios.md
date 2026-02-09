# Line Dominance System — Test Scenarios Suite

**Audience**: Gameplay programmers, QA, designers

**Purpose**: This document defines **canonical combat exchanges** with fixed inputs and **expected qualitative outcomes**. These scenarios are used to:
- Validate correctness of the LDS implementation
- Catch regressions during tuning
- Align designer and programmer expectations

Scenarios avoid UI/UX and focus strictly on **geometry, timing, intent, and resolution**.

---

## How to Use This Document

For each scenario:
- Inputs must be injected exactly as specified
- LDS components may vary numerically with tuning
- **Outcome classification must match**

If outcome differs, one or more **LDS invariants is broken**.

---

## Legend

- Grid cells use numbering:
```
1 2 3
4 5 6
7 8 9
```
- AP_pre: AP committed before INDES
- AP_post: AP committed after INDES
- FP: Focus spent

---

## Scenario 1 — Pure Speed Contest (Hitter vs Hitter)

**Description**: Identical geometry, identical intent. Speed and commitment decide.

**P1**
- Start: 2
- End: 8
- Intent: HITTER
- AP_pre: 6
- AP_post: 0
- FP: 0

**P2**
- Start: 2
- End: 8
- Intent: HITTER
- AP_pre: 4
- AP_post: 0
- FP: 0

**Expected Outcome**:
- Clear hit by P1

**Invariant Tested**:
- Timing decides when geometry is equal

---

## Scenario 2 — Geometry Beats Commitment

**Description**: Sideways cut into a strong centerline attack.

**P1**
- Start: 6
- End: 4
- Intent: HITTER
- AP_pre: 8
- FP: 0

**P2**
- Start: 2
- End: 8
- Intent: HITTER
- AP_pre: 4
- FP: 0

**Expected Outcome**:
- P2 hits or forces dominant bind

**Invariant Tested**:
- Geometry beats resources

---

## Scenario 3 — Focus Catch-Up into Taker

**Description**: Late defender uses Focus to arrive in time.

**P1**
- Start: 1
- End: 7
- Intent: HITTER
- AP_pre: 5
- FP: 0

**P2**
- Start: 9
- End: 3
- Intent: TAKER
- AP_pre: 2
- FP: 1

**Expected Outcome**:
- Bind achieved by P2

**Invariant Tested**:
- Focus fixes timing, not geometry

---

## Scenario 4 — Overcommit Punished

**Description**: Heavy hitter runs into prepared taker.

**P1**
- Start: 2
- End: 8
- Intent: HITTER
- AP_pre: 9

**P2**
- Start: 8
- End: 2
- Intent: TAKER
- AP_pre: 3

**Expected Outcome**:
- P2 controls bind; P1 loses initiative

**Invariant Tested**:
- Overcommitment is punishable

---

## Scenario 5 — Provoker Success

**Description**: Provoker baits excessive AP.

**P1**
- Start: 3
- End: 5
- Intent: PROVOKER
- AP_pre: 2

**P2**
- Start: 2
- End: 8
- Intent: HITTER
- AP_pre: 7

**Expected Outcome**:
- P1 disengages safely; P2 overextends

**Invariant Tested**:
- Intent interprets outcome, does not create power

---

## Scenario 6 — Provoker Ignored

**Description**: Same setup, but opponent does not bite.

**P1**
- Start: 3
- End: 5
- Intent: PROVOKER
- AP_pre: 2

**P2**
- Start: 4
- End: 6
- Intent: TAKER
- AP_pre: 2

**Expected Outcome**:
- No immediate advantage for P1

**Invariant Tested**:
- Provocation requires opponent commitment

---

## Scenario 7 — Thrust vs Cut

**Description**: Point threatens centerline before cut arrives.

**P1**
- Start: 5
- End: 5 (thrust)
- Intent: HITTER
- AP_pre: 4

**P2**
- Start: 1
- End: 7
- Intent: HITTER
- AP_pre: 4

**Expected Outcome**:
- P1 hits or forces bind advantage

**Invariant Tested**:
- Thrust dominance at short distance

---

## Scenario 8 — Thrust vs Thrust

**Description**: Pure timing and structure contest.

**P1**
- Start: 5
- End: 5
- Intent: HITTER
- AP_pre: 5

**P2**
- Start: 5
- End: 5
- Intent: HITTER
- AP_pre: 5

**Expected Outcome**:
- Simultaneous hit or mutual damage

**Invariant Tested**:
- Double hits are possible

---

## Scenario 9 — Late Cancellation Value

**Description**: Attack is aborted after opponent spends Focus.

**P1**
- Start: 2
- End: 8
- Intent: HITTER
- AP_pre: 4
- Cancels late

**P2**
- Start: 8
- End: 2
- Intent: TAKER
- AP_pre: 2
- FP: 1

**Expected Outcome**:
- No hit; P2 permanently loses 1 Focus

**Invariant Tested**:
- Forcing reactions has value

---

## Scenario 10 — Neutral Geometry Bind

**Description**: Symmetrical diagonals into center.

**P1**
- Start: 1
- End: 9
- Intent: TAKER
- AP_pre: 4

**P2**
- Start: 3
- End: 7
- Intent: TAKER
- AP_pre: 4

**Expected Outcome**:
- Stable bind; no immediate hit

**Invariant Tested**:
- Binds emerge from opposing geometry

---

## Final Validation Rule

If **any** of these scenarios produce a contradictory result:
- Log all LDS components
- Check violated invariant
- Fix before tuning

These scenarios define the *truth table* of the system.

---

**End of test scenarios suite**

