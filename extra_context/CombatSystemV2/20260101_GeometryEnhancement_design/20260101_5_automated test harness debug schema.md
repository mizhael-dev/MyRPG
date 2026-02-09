# LDS Automated Test Harness & Debug Readout Schema

This document defines **machine-readable formats** for validating and debugging the Line Dominance System (LDS). It is designed for early prototypes, deterministic simulation, and regression testing.

---

## Part A — Minimal Automated Test Harness Format

### Design Goals
- Deterministic (no RNG, no hidden state)
- Human-readable and diff-friendly
- Independent of UI and animation
- Focused on *geometry, timing, intent, and AP/FP commitment*

---

### Scenario Spec (JSON-like)

```json
{
  "id": "SCN_01_HIGH_VS_HIGH_SPEED",
  "description": "Mirror high guards, equal intent, AP decides",

  "initial_state": {
    "measure": "in",
    "time": 0.0
  },

  "fighters": {
    "P1": {
      "speed": 1.0,
      "focus": 10,
      "ap_pool": 10,
      "guard": 1
    },
    "P2": {
      "speed": 1.0,
      "focus": 10,
      "ap_pool": 10,
      "guard": 1
    }
  },

  "actions": [
    {
      "actor": "P1",
      "type": "attack",
      "intent": "hitter",
      "vector": { "from": 1, "to": 9 },
      "ap_commit": 5,
      "timing": "pre_indes"
    },
    {
      "actor": "P2",
      "type": "attack",
      "intent": "hitter",
      "vector": { "from": 1, "to": 9 },
      "ap_commit": 4,
      "timing": "pre_indes"
    }
  ],

  "expected": {
    "outcome": "P1_hit",
    "notes": [
      "Equal geometry",
      "Equal timing",
      "Higher AP commitment wins"
    ]
  }
}
```

---

### Required Fields

| Field | Purpose |
|-----|--------|
| `guard` | Starting 3×3 grid index (1–9) |
| `vector.from/to` | Weapon path definition |
| `intent` | hitter / taker / provoker |
| `ap_commit` | AP spent into action |
| `timing` | pre_indes / post_indes |
| `speed` | Multiplier for time resolution |
| `focus` | Resource used to compress time |

---

### Expected Outcome Types

```text
P1_hit
P2_hit
bind_neutral
bind_adv_P1
bind_adv_P2
double_hit
whiff_overextension
```

---

### Harness Pass Condition
A test **passes** if:
- Outcome type matches
- No forbidden invariant is violated
- All required debug values are computable (no NaN, no negatives)

---

## Part B — Single-Step LDS Debug Readout Schema

This schema describes **what gets logged for one resolved exchange**. It is intended for:
- Debug overlays
- AI decision introspection
- Regression diffing

---

### Debug Record Structure

```json
{
  "exchange_id": "EX_1042",
  "timestamp": 12.433,

  "fighters": {
    "P1": {
      "intent": "hitter",
      "vector": { "from": 1, "to": 9 },
      "ap_committed": 5,
      "ap_effective": 5.0,
      "focus_spent": 0,
      "speed": 1.0
    },
    "P2": {
      "intent": "taker",
      "vector": { "from": 9, "to": 1 },
      "ap_committed": 4,
      "ap_effective": 4.0,
      "focus_spent": 1,
      "speed": 1.0
    }
  },

  "lds_components": {
    "TimingComponent": {
      "delta_t": -0.12,
      "advantage": "P2"
    },
    "PositionComponent": {
      "line_overlap": 0.85,
      "dominance": "P2"
    },
    "AngleComponent": {
      "angle_diff_deg": 160,
      "favor": "P2"
    },
    "StructureComponent": {
      "structure_delta": -0.3,
      "favor": "P2"
    }
  },

  "lds_score": {
    "P1": 3.2,
    "P2": 4.6,
    "winner": "P2"
  },

  "resolution": {
    "result": "bind_adv_P2",
    "damage": null,
    "notes": ["taker absorbed hitter", "line captured"]
  }
}
```

---

### Mandatory Debug Guarantees (Invariants)

- `ap_effective <= ap_committed`
- Timing advantage never flips outcome alone
- Geometry components always logged, even if neutral
- Double hit logged explicitly (never implicit)

---

## Implementation Notes

- The **test harness format** should be executable without animation or UI.
- The **debug schema** should be serializable per exchange.
- Both formats must survive tuning of constants without structural change.

If a change breaks an expected scenario **or** violates a debug invariant, the combat system should be considered unstable.

