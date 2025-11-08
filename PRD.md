Game PRD - "MyRPG"

# 1. Vision Statement

Create a grimdark fantasy with magic tactical roguelike CRPG where every decision matters, combat is turn-based but deterministic, and player skill, positioning, and foresight determine survival — not random chance.
Every spell, ability, action feels weighty and dangerous.
Combat is fast and deadly (no inflated hp encounters).
Set in a world of fading empires, dying gods, and unstable magic, where power comes at a price.
The first version will focus on gameplay mechanic not the story or the world.

### Genre
tactical roguelike CRPG

### Procedurally generated
- maps
- combat encounters

# 2. Setting and Theme

## Tone:

- Inspired by Steven Erikson and Joe Abercrombie: morally grey characters, brutal realism, and cynical humor.
- The world is in decay — magic is both salvation and corruption.

## Visual & Narrative Direction:
- Gritty, low-saturation environments.
- Ruins, ashlands, and relics of forgotten wars.
- Every spell and ability feels weighty and dangerous.

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
- Semi-open world with handcrafted hubs and procedural wilderness zones.
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

### In scope
- Inventory management
- Equipment management
- Player Character (PC) stats and derived stats
- Resource consumption and management
- Non-Player Character (NPC) stats and derived stats
- Turn based tactical combat (A big focus)
- Procedurally generated encounters
- journal
- saving

### Out of Scope for now
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
- **Skill Name:** Slash
- **Descritpion:** Attacker shlashes with the weapons
- **Cost:**
  - Stamina: 2
- **Cast Time:** 2000ms
- **Recovery Time:** 100ms
- **Skill School:** None
- **Telegraphs:**
  - Foot:
  - Shoulders:
  - Weapon position:
  - Stance: 

- **Skill Name:** Thurst
- **Descritpion:** Attacker thurst with the weapons
- **Cost:**
  - Stamina: 2
- **Cast Time:** 1500ms
- **Recovery Time:** 100ms
- **Skill School:** None
- **Telegraphs:**
  - Foot:
  - Shoulders:
  - Weapon position:
  - Stance: 

- **Combo Name:** Thurst
- **Descritpion:** a most basic combo Slash, Slash, Thurst
- **Skill School:** None
- **Combo Bonus:**
  - Slash: None
  - Slash: -200ms Cast Time, -1 stamina cost
  - Thrust: -600ms Cast Time, -1 stamina cost
 - **Telegraphs:**
  - Foot:
  - Shoulders:
  - Weapon position:
  - Stance: 

- **Skill Name:** Weapon Parry
- **Descritpion:** Defender blocks attack with a weapon taking no damage and readies a counter
- **Cost:**
  - Stamina: 1 + 50% attackers stamina spend if defended succesfully
- **Cast Time:** 1000ms
- **Recovery Time:** 100ms
- **Skill School:** None
- **Telegraphs:**
  - Foot:
  - Shoulders:
  - Weapon position:
  - Stance: 

- **Skill Name:** Weapon Parry
- **Descritpion:** Defender blocks attack with a weapon taking no damage and readies a counter
- **Cost:**
  - Stamina: 1 + 25% attackers stamina spend if defended succesfully
- **Cast Time:** 500ms
- **Recovery Time:** 500ms
- **Skill School:** None
- **Telegraphs:**
  - Foot:
  - Shoulders:
  - Weapon position:
  - Stance: 


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
     - Can regenerate 5 per turn in combat when concentrating and not interrupted.  
   - **Exhaustion Penalty:** Casting with no MP drains HP (1 HP per 1 MP used).
   - **Bonus use:** User can choose to use up to 50% more or 50% less MP for an attack. More for more damage and faster attack. Less for a faint or carefoul resource management.

2. **Stamina (Physical Energy):**  
   - **Maximum Stamina:** Equal to the Constitution Attribute.  
   - **Regeneration:**
     - Fully replenished outside of combat via rest.
     - Regenerates 1 per turn in combat.
     - Regenerates 4 per turn in combat when defending.
   - **Exhaustion Penalty:** Taking actions with no Stamina drains HP (1 HP per 2 Stamina used).
   - **Bonus use:** User can choose to use up to 50% more or 50% less stamina for an attack. More for more damage and faster attack. Less for a faint or carefoul resource management.

3. **Focus (Mental Clarity):**  
   - **Maximum Focus:** Equal to the Willpower Attribute.  
   - **Regeneration:**
     - Fully replenished outside of combat via rest
     - Regenerates 2 per turn in combat.
     - Regenerates 4 per trun in combat, when sitting down.
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

# 10. Next Steps

- Prototype combat testbed (movement, actions, no UI polish).
- Add one test map to do 1 v 1 combat to test positioning and agency