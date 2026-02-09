## 1. Resources In Combat:

- `AP` (Action Points)  - acts as a measure of stamina, willpower and willingness to press forward.
  - Usage: Spent on moving, changing guards, and committing to attacks or defense
  - `AP` shows how much resources is left to spend, replenishes after `Indes` is resolved by `RegenAP` value up to `MaxAP` (*Reason: Avoid situation when Hit `Indes` never happens and Players are always changing their decisions. adds a layer of resource management and limits overcommiting AP in a single Indes.*)
  - `MaxAP` maximal pool of AP that the actor can hold at one time. AP cannot be higher than this.
  - `RegenAP` after every Indes is resolved actors replanish some of the AP, up to `MaxAP`

- `FP` (Focus Points) - acts as a measure of willpower to perform very difficult feats. FP does not regenerate in combat. Actors start combat with FP equal to `MaxFP`.
  - Usage: used to "compress time"
  - `FP` shows how much resources is left to spend.
  - `MaxFP` maximal pool of AP that the actor can hold at one time. FP cannot be higher than this. FP does not regenerate in combat.

- `IT` (Initiative Tick) - `time`

---

## 2. Attributes

*Core Attributes: Describe phisical and mental capabilities of a character*

*Derived Stats: Stamina (`MaxAP`), Focus (`MaxFP`) represent maximal capacity for resources available every `Indes` these Stats are derived from Core Attributes.*

*Resources: AP, FP are renewable resources spent to perform actions. AP regenerates in combat. Track amounts for precise combat management.*

#### Core Attributes:

- **Endurance:** 10 (AP)
- **Willpower:** 10 (Focus)
- **Agility:** 10 (movement and action speed)


#### Derived Attributes:

 - **Max Action Points (`MaxAP`):** Integer, Equal to: rounddown(Endurance)
 - **Action Points Regeneration (`RegenAP`):** Integer, Equal to: rounddown (Endurance / 2) 
 - **Max Focus: (`MaxFP`)** Integer, Equal to: rounddown(Willpower / 5)
 - **ActionSpeed (`ActionSpeed`):** Integer, Equal to: rounddown(Agility)

#### Resources:
 - **Action Points (`AP`):** 
 - **Focus (`FP`):** 