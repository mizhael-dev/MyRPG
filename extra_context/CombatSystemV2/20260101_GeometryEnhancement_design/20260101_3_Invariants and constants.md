# Line Dominance System — Invariants, Constants & Failure Modes

**Audience**: Gameplay / AI / systems programmers

**Purpose**: This document defines the *non-negotiable invariants*, *default constants*, *edge-case handling*, and *AI evaluation shortcuts* for the Line Dominance System (LDS). It exists to prevent subtle implementation errors that would break the perceived realism or strategic depth of combat.

This document must be read alongside the *LDS Mathematical & Vector Specification*.

---

## 1. Default Constants Table (Prototype Values)

These are **safe prototype defaults**. They are conservative and chosen to preserve feel over balance.

### 1.1 Timing & Focus

| Constant | Value | Notes |
|--------|-------|------|
| FP_WEIGHT | 1.5 | Focus is strong but not dominant |
| CONTACT_BONUS | 2.0 | Rewards point-blank control |
| TIMING_NORM | 12.0 | Normalizes reach to ~[0,1] |

**Invariant**: Focus must never outweigh poor geometry alone.

---

### 1.2 Position

| Constant | Value | Notes |
|--------|-------|------|
| DIST_COEFF | 0.35 | Penalizes long travel |
| PC_MIN | -0.25 | Position cannot decide fight alone |
| PC_MAX | +0.25 | Geometry helps, not dominates |

---

### 1.3 Angle

| Constant | Value | Notes |
|--------|-------|------|
| AC_OPPOSE | +0.15 | Stable bind bonus |
| AC_CROSS | +0.10 | Awarded to earlier arriver |
| AC_ALIGN | -0.10 | Pure speed contest penalty |

---

### 1.4 Structure

| Constant | Value | Notes |
|--------|-------|------|
| SC_THRUST | +0.10 | Centerline point pressure |
| SC_EDGE | +0.05 | Long-edge alignment |
| SC_PRESSURE | +0.05 | Ending near center |
| SC_EXPOSE | -0.10 | Ending on flank |
| SC_MIN | -0.20 | |
| SC_MAX | +0.20 | |

---

### 1.5 LDS Weights

| Weight | Value |
|-------|------|
| w_T | 0.45 |
| w_P | 0.20 |
| w_A | 0.20 |
| w_S | 0.15 |

**Invariant**: Timing must always be the single largest contributor.

---

### 1.6 Resolution Thresholds

| Threshold | Value | Meaning |
|---------|-------|--------|
| HIT_T | +0.20 | Clear dominance |
| NEUTRAL | ±0.05 | Bind / contested |
| LOSS_T | -0.20 | Clear loss |

---

## 2. Edge-case Taxonomy

These situations **will occur**. Handling them explicitly is mandatory.

---

### 2.1 Simultaneous Hits (Double Kill Risk)

**Condition**:
- Both paths threaten the body before blade contact OR
- Both LDS values exceed HIT_T

**Resolution Rule**:
- If intents differ:
  - HITTER loses to TAKER
- If intents match:
  - Both take damage (reduced)

**Invariant**: Simultaneous hits must be rare but possible.

---

### 2.2 Zero-length Paths (Pure Thrusts)

**Condition**:
- start_cell == end_cell

**Handling**:
- Treat as vector from start toward opponent center
- steps_to_contact = 0 if intersecting

**Invariant**: Thrusts must dominate short distance but lose if displaced sideways.

---

### 2.3 Thrust vs Thrust

**Condition**:
- Both paths are zero-length

**Resolution Priority**:
1. TimingComponent
2. StructureComponent
3. PositionComponent

AngleComponent is ignored.

---

### 2.4 No Intersection (Ghost Swings)

**Condition**:
- path_A ∩ path_B = ∅

**Resolution**:
- If path threatens body → hit check
- Else → whiff / overextension

**Invariant**: Empty geometry must not magically bind.

---

### 2.5 Late Cancellation

**Condition**:
- Actor aborts after INDES lock

**Handling**:
- AP already committed is lost
- Opponent Focus remains spent

---

## 3. AI Evaluation Heuristic (No Full Simulation)

AI must reason *fast* and *approximately*.

### 3.1 AI Estimation Model

AI estimates a simplified LDS:

```
LDS_est ≈ 0.5 * Timing_est
        + 0.3 * Geometry_est
        + 0.2 * Commitment_est
```

---

### 3.2 Geometry_est

| Situation | Score |
|---------|------|
| Own swing crosses center early | +1 |
| Diagonal crossing | 0 |
| Sideways into center | -1 |

---

### 3.3 Timing_est

```
Timing_est = sign(AP_self - AP_enemy)
```

Focus is considered only if difference is negative.

---

### 3.4 Commitment_est

| Intent | Bias |
|------|------|
| HITTER | +1 if winning |
| TAKER | +1 if neutral |
| PROVOKER | +1 if enemy AP high |

---

### 3.5 AI Intent Selection Rule

1. If Geometry_est > 0 AND Timing_est ≥ 0 → HITTER
2. If Geometry_est ≥ 0 AND Timing_est ≈ 0 → TAKER
3. If Geometry_est < 0 → PROVOKER or disengage

---

## 4. Formal Invariants (Do Not Break)

These are **laws of the system**. Violating any will make combat feel wrong.

---

### Invariant 1 — Geometry Beats Resources

No amount of AP or Focus may fully overcome *terrible geometry*.

---

### Invariant 2 — Timing Decides Neutral Lines

When geometry is equal, early arrival must decide the exchange.

---

### Invariant 3 — Intent Never Creates Power

Intent only interprets outcomes. It must never add raw LDS.

---

### Invariant 4 — Focus Fixes Time, Not Space

Focus may compress timing but must never improve Position or Angle.

---

### Invariant 5 — Overcommitment Is Punishable

Large AP investments must increase risk, not safety.

---

### Invariant 6 — Binds Are Local

Binds can only occur at blade intersection points.

---

### Invariant 7 — Determinism

Identical inputs must always produce identical outcomes.

---

## 5. Common Failure Modes

| Symptom | Likely Cause |
|-------|-------------|
| Focus feels mandatory | FP_WEIGHT too high |
| Sideways spam works | Position penalty too low |
| Constant binds | AC_OPPOSE too high |
| No binds ever | AC_OPPOSE too low |
| Thrusts overpowered | CONTACT_BONUS too high |

---

## 6. Debug Checklist

Every resolution should log:
- start/end cells
- path intersection
- steps_to_contact
- each LDS component
- intent
- final Δ and outcome

If a result feels wrong, one of the invariants above is being violated.

---

**End of invariants & failure modes specification**

