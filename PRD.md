Game PRD - "MyRPG"

# 1. Vision Statement

Create a grimdark fantasy with magic tactical roguelike CRPG where every decision matters, combat is atomic-turn-based but deterministic, and player skill, positioning, and foresight determine survival — not random chance.
Every spell, ability, action feels weighty and dangerous.
Combat is fast and deadly (no inflated hp encounters).
Set in a world of fading empires, dying gods, and unstable magic, where power comes at a price.
The first version will focus on gameplay mechanic not the story or the world.

### Genre
tactical roguelike CRPG


# 2. Setting and Theme

## Tone:
- Inspired by Steven Erikson and Joe Abercrombie: morally grey characters, brutal realism, and cynical humor.
- Every spell and ability feels weighty and dangerous.
- Gritty, low-saturation environments.

# 3. Core Gamaplay Pillars

### Tactical Agency
Combat outcomes depend on player skill (actions that player takes), positioning and stats, not dice rolls.

### Meaningful Choices
Every decision (in combat or narrative) carries a lasting effect — sacrifice, scars, or shifting world states.

### Risk and Consequence
Power costs something — magic drains life, madness, or stability.
- every physical attack can be stronger or weaker depending how much effort (stamina) the user puts into it
- stronger attacks take mroe time or require a longer time to recover after the attack and before taking another action
- very physical attack can be stronger or weaker depending how much mana the user puts into it

# 4. World and Exploration
- Semi-open world with handcrafted hubs and procedural wilderness/dungeon/combat zones.
- Environmental interaction: collapsing bridges, setting fires, or redirecting water can alter battles.


## Tech Stack
to AI coding agent: I need a suggestion.

I want to be able to iterate fast, I don't need polish for now
- Highest Priority: Modular, vibe-driven iteration: implement ideas quickly, test them, discard or refine.
- Perspective: Isometric or top-down tactical grid or hex based (whatever is easier to )
- Core Systems to Prototype First
  - Deterministic combat 
  - Grid-based movement
  - Ability / spell framework
- Data Model: JSON-driven entity stats?


# 5. Features:

### In scope Must haves
- Atomic turn based tactical combat (A big focus)
- Resource consumption and management
- Combat skills system (attacks, defenses, telegraphs)
- Telegraph UI and prediction system

### In scope Nice to haves
- Inventory management
- Equipment management
- Player Character (PC) stats and derived stats
- Non-Player Character (NPC) stats and derived stats
- Procedurally generated encounters
- journal
- saving

### Out of Scope for now (Will be added later)
- Movement mechanics (tactical map positioning, collision resolution)
- Magic and spell combat skills
- Armor mechanics and damage mitigation
- Weapon range mechanics
- Line of sight and visibility systems
- AI game master and AI generated stories
  

# 6. Combat System Overview
A huge focus of this project is figuring out a satisfying comabt system. This will require a lot of iterating.

Core principles:
- The user needs to have an agency over their fate.
- every decision matters
- combat is turn-based but deterministic. Player skill, positioning, and foresight determine survival — not random chance.
- Every spell, ability, action feels weighty and dangerous.
- Combat is dynamic and deadly (no inflated hp encounters).
- Weapon range, weapon type, weapon weight has a big impact on gameplay
  - Spear is deadly on the long range, but not effective when opponent is too close
  - dagger is light, fast, with short range. The user needs to get close to the target fast or stealthy
  - ranged weapons are hard to aim at fast moving tagets but on slow moving target deadly
- actions take time
- combatants are getting more and more tired as they continue fighting `Resource consumption`, proper Resource management is key

##### Combat idea: Telegraphing / Intent Reading / Combat Reading /Tells

**Inspiration:**
- Telegraphing a fighter unintentionally reveals their next move through subtle body cues (stance shift, shoulder movement, gaze, etc.).
- Intent Reading: Awareness of the opponent’s intent based on **micro-movements** and **timing**.
- Tells: predict enemy actions if defendar has high perception, or combat experience.
  
**Mechanic Description:**
- By reading subtle telegraphs, tells in the enemy’s movement, fighters can anticipate opponents next strike and prepare a response.
- defender's certainty of what is the attack grows with each passing micro-movement but the time to act is decreaing. This forces the defender to balance chance of sucesfully predicting what the attack is with the options available to mitigate or counter it.
- using the same attack ability more then once gives the opponent an adventage to Combat Reading (takes less time to read the tell = gives more time to respond). This is to encourage diversity, stop spamming of "optimal" actions in combat and keeping a trump attack for the right moment.
- `Skill School Combo` Predefined Combos can be performed out of same school combat skills each next skill gets a bonus. On the other hand it is easier to predict without any tells or telegrpahs.


## Combat Skills

All combat skills are defined in JSON format for data-driven design and easy iteration. Skills are organized by type:

**Location:** `/CombatSkills/`

**Structure:**
- `/CombatSkills/attacks/` - Offensive combat skills (Slash, Thrust, Overhead Strike, etc.)
- `/CombatSkills/defense/` - Defensive combat skills (Parry, Dodge, Block, etc.)
- `/CombatSkills/special/` - Special combat skills (Counter, Feint, etc.)
- `/CombatSkills/combos/` - Predefined skill combinations with bonuses

Each skill JSON includes:
- Basic info (id, name, description, type, school)
- Combat phases (wind-up, committed, impact, recovery durations)
- Telegraph stages (bodyPart, visibility%, triggerTime, description, possibleSkills[])
- Resource costs (stamina, mp, focus, dailyFatigue)
- Damage/defense specifications
- Variable power modifiers (±50% for stamina/MP adjustment)

See `/CombatSkills/` folder for all skill definitions.

IMPORTANT: More detailed combat mechanics are documented in Combat3 series files (Combat3 - atomic_turns.md, Combat3 - TechStack.md).


##### Resource consumption  
- Each action, atttack and ability consumes resources based on it's type: `MP`, `Stamina`, and `Focus`.
  - Attack with weapons and physical consume `Stamina`
  - Attack with abilities and spells consume `MP` and some `Stamina`
  - Every action that consumes `Stamina` or `MP` also consumes `Focus` resource **Cost Calculation:** **Focus cost = MP cost + Stamina cost.**
  - Every action that consumes `Focus` resource also consumes `Daily Fatigue` resource. **Cost Calculation:** **Daily Fatigue cost = MP cost + Stamina cost.**

##### **Resource System**
1. **MP (Magic Points):**  
   - **Maximum MP:** Determined by Magic Attribute × 2.  
   - **Regeneration:**
     - Fully replenished outside of combat via rest or meditation.
     - Can regenerate 5 per `<regeneration_rate>` in combat when concentrating and not interrupted.  
   - **Exhaustion Penalty:** Casting with no MP drains HP (1 HP per 1 MP used).
   - **Bonus use:** User can choose to use up to 50% more or 50% less MP for an attack. More for more damage and faster attack. Less for a faint or carefoul resource management.

2. **Stamina (Physical Energy):**
   - **Maximum Stamina:** Equal to the Constitution Attribute × 2.  
   - **Regeneration:**
     - Fully replenished outside of combat via rest.
     - Regenerates 1 per `<regeneration_rate>` in combat.
     - Regenerates 4 per `<regeneration_rate>` in combat when defending.
   - **Exhaustion Penalty:** Taking actions with no Stamina drains HP (1 HP per 2 Stamina used).
   - **Bonus use:** User can choose to use up to 50% more or 50% less stamina for an attack. More for more damage and faster attack. Less for a faint or carefoul resource management.

3. **Focus (Mental Clarity):**  
   - **Maximum Focus:** Equal to the Willpower Attribute.  
   - **Regeneration:**
     - Fully replenished outside of combat via rest
     - Regenerates 2 per `<regeneration_rate>` in combat.
     - Regenerates 4 per `<regeneration_rate>` in combat, when sitting down.
   - **Cost Calculation:** **Focus cost = MP cost + Stamina cost.**
   - **Exhaustion Penalty:** Taking actions with no Focus drains HP (1 HP per 2 Focus used).  
   - **Reason for mechanic:** chaaracters get tired when fighting longer battles. Makes combat more interestinga and tactical. Requires smart repositioning and depending on others to catch a breath. No single character can overwhelm an army. Makes longer combat encounters more challanging and adds aspect of resource management.


4. **Daily Fatigue:**
   - **Maximum Daily Fatigue:** Equal to the Willpower Attribute multiplied by 5.
   - **Regeneration:**
     - Fully replenished outside of combat via long rest (sleep) for at least 6 hours.
     - No regeneration occurs during short rests or meditation; those actions restore only MP, Stamina, and Focus.
   - **Cost Calculation:** **Daily Fatigue cost = MP cost + Stamina cost.**
   - **Exhaustion Penalty:** Taking actions with no Daily Fatigue drains HP (1 HP per 5 Daily Fatigue used).
   - **Reason for mechanic:** lock player from unlimited grinding without rest. Makes longer adventures more challanging and adds aspect of resource management.

**Note:** `<regeneration_rate>` is a variable that needs balancing through playtesting. Initial estimate: 1000ms (1 second), but will be adjusted based on combat pacing.

##### **Damage System (First Prototype)**

For the initial prototype, combat is extremely deadly:
- **1 clean hit (successful attack with no defense) = instant death**
- **3 hits of any kind (blocked, parried, or glancing) = death**

This simplified system allows us to focus on the core atomic turn mechanics and telegraph reading without complex damage calculations. More sophisticated damage systems will be added later.

##### **Telegraph UI (Visual Design)**

Telegraphs will be displayed using **manga-style panels** showing close-ups of body parts with clear text labels:
- Example: Panel shows a leg with large text "FOOT BACK"
- Example: Panel shows shoulders with text "SHOULDER ROTATION"

**Prediction Display:**
- Shows possible attacks and their probability percentages
  - e.g., "Foot back" is a telegraph for both "Horizontal Slash" and "Thrust" but not for "Overhead Strike"
  - After first telegraph: "50% Slash, 50% Thrust"
- **Timebar_NPC_seen_by_PC** displays:
  - Minimum time (fastest possible attack from visible telegraphs)
  - Maximum time (slowest possible attack from visible telegraphs)
  - Uncertainty shading narrows as more telegraphs are revealed

# 10. Next Steps

- Prototype combat testbed (movement, actions, no UI polish).
- Add one test map to do 1 v 1 combat to test positioning and agency