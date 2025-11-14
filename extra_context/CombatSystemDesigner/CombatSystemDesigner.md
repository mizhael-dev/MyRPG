# Combat System Designer - specifications
This documents contains specificaiton for a support tool that will be used by human nad AI to create and balance a robust and unique combat system for an CRPG game.
The main objective of a tool and workflow that this tool facilitates is to fine tune a balancing and game rules.

**GOAL** The main goal of the tool and this workflow is to transform and fine tune a set of lose ideas about longsword and katana combar inspired by HEMA (Historical European Martial Arts) and Japanese katana martial arts (kenjutsu, Battōjutsu, Iaido) into a real video game combat system, that is fun, but also somewhat realistic.

## 1. Combat System
This section explains how complex this system can get and why we need a tool to help design and balance a gaming system.

**High level overview:**
A **grimdark fantasy tactical roguelike CRPG** with a unique **atomic turn-based deterministic combat system**. The core philosophy is:

- **Player agency over luck** - Very little RNG (no %chance to hit and dice rolls to hit), outcomes determined by player skill, positioning, and foresight
- **Every decision matters** - Weighty, dangerous combat where resources and making right decision in the right moment are critical
- **Fast and deadly** - No inflated HP encounters; combat is brutal and tactical
- **Telegraphing/Intent Reading** - Defender reads attacker's micro-movements to predict and counter attacks

- **Inspirations:** Steven Erikson, Joe Abercrombie (grimdark), tactical roguelikes
- **why it is different** The goal is to add a layer of meaningfull decision to the oversimplistic and RNG based combat systems of most rogulikes and CRPG games.

---

### Core Combat System - Atomic Turns

Combat system operates on **atomic ticks** (not discrete turns) with auto pause non-reflex based turn system where:
***atomic ticks can be set to different time intervals like 100ms for simplicity. The flow of time is important the actual values not that much. Most martial arts acitons take a fraction of second. It is an auto pause game where actual gamers time perception is much much longer but the sub 1second timing is for immersion and realism***

1. **Simultaneous Action Evolution:** Both combatants' actions progress in parallel each tick. They share a timeline.
2. **Telegraph System:** Attacker's intent gradually reveals through body cues (e.g. telegraph1 at 0.0s attack is initated, telegraph2 at 0.1 helps to narrow down to 3 possoble attacks, telegraph3 at 0.5 helps to narrow down to a signle attack with 100% precision)
3. **Auto-Pauses:** Game pauses when:
   - New meaningful telegraph information emerges
   - Recovery phase is completed and actor can act again
   - On hp <= 0
4. **Defense Readiness Windows:** Defender must time their defense to overlap attacker's Impact frame
5. **Deterministic Resolution:** If defense is active during Impact tick → successful defense; otherwise → hit lands
6. Actor can only act when they are not in Commited pahse or Recover phase

#### Telegraph Mechanics
- **Micro-movements reveal intent:** Foot shifts, shoulder rotation, weapon positioning, stance changes
- **Prediction confidence grows with time:** More time watching = higher certainty, but less time to respond
- **Repetition penalty:** Using same attack multiple times makes it easier to read (faster prediction)
- **Skill School Combos:** Predefined combo sequences get bonuses but are easier to predict
There are 2 key componenets to it


#### Three Auto-Pause Types:**

1. **Telegraph Pause** (`new_telegraph`)
   - Triggers when telegraph with `pause: true` is revealed
   - **Opponent** of telegraphing fighter can act
   - Example: PC telegraphs → NPC can respond

2. **Recovery Complete Pause** (`recovery_complete`)
   - Triggers when action recovery ends
   - **That fighter** can act again
   - Message: "{name} is ready to act again"

3. **Death Pause** (`manual` placeholder)
   - Triggers when HP <= 0
   - Combat ends
   - Future: Replace 'manual' with 'death' reason

#### **Rock Paper Scissors Mechanic as a starting point**
1. **Parry** +Attack beats Attack+Attack
2. **Attack** beats Attack then Feint
3. **Feint** beats Parry

#### CRITICAL: **A fair system - infite loop model**
To ensure an unbiased fair combat system we need to build a model where the outcome should be infitie loop of optimal actions by PC and NPC utilizing 3 main mechnics i.e. Attack, Parry, Feint/Provocation.
This should be ture when PC and NPC
- are equally fast, strong, have same stamina and hp (have same attributes and derived stats)
- both use medium intent/stance (not Strenghten, or Weaken)
- have the same skills at their disposal
- follow the same ruleset

#### **To break out of this inifite loop** will have a few options.
1. The actors are forced to choose high risk high reward actions like:
   - Parry an attack without 100% certainty of guessing the attack line, that can result in either being hit or scoring a hit due to tempo adventage (time adventage)
   - blindly Feint (feint before opponents Parries) to gain tempo (time advantage) over Parry, but risk getting hit if opponent uses Attack instead of Parry
   - Attack into an attack. If PC Attack and NPC Attack have impact at the same time, it will result in a bind/power_struggle that will be won by character with more strength. If PC_strength == NPC_strength a tie breaker is a comparison of a Sum of warmUp ticks and Commited ticks accumulated over the combat by PC vs. NPC.

When stats are different, the game changes and PC and NPC will try to play to their advantages:
Stats are hidden so only during the fight the actors get a feeling what is the objecitve of their opponent:
- Faster character will try to hit first
- Strong character will try to get into bind/power_struggle to throw opponent off balance and score a hit
- High stamina character will try to draw out the fight to tire the opponent

When intent/stance is introduced:
- Strenghten decrease WarmUp duration and Commitement duration at cost of increasing Recovery. Faster, more decisive actions but more exposed.
- Weaken will increase WarmUp duration and Commitement duration throwin off timing and allowing playing actions at unexpecteed time. Slower but strategically.

In genraal, there are many ideas how to bend the system to adventage of the PC or NPC. But the initial system should give a fair foundation.


#### **My assumptions and rules, that need testing**
   - Parry needs to be faster than  Attack
   - Attack needs to be faster than Feint+Attack
   - Feint+Attack needs outmanouver parry. DOESN't have to be faster
   - Parry needs to be triggered during Attack commitment zones (otherwise Attack can Feint)
   - Feint(+Attack), is used during Parry commitment.
   - Feint needs to be is faster than parry(+Attack) -> 
   - Feint + Attack has to be longer than just Attack
   - Need to parry before commited attack to make it in time
   - Parry is full comitement. If you do fake parry you die
   - Feint/Provocation needs to threaten to be addressed
   - At least 0.1s has to pass for first telegraph to appear
   - Auto-Pause for Attacker and Defender when Attack is 0.1s before commitment -> they eiter continue attack (Wait) and go to commited next interval, or Feint and stay in WindUp in next interval
   - Feint needs to add time to Attack
   - Downsides: Attack cost stamina
   - Downsides: Parry at 100% certainty is weaker and easy to predict if character is not actively doing anything
   - Downsides: Feint/Provoke is blind at 100% certainity threshold (don't see parry)

## 2. Tools to help design the combat system

### 1. Combat Editor
UI sinspired by browser based Video editors (mixer) but for convenient testing of different combat scenarios with visual help and automated combat resolution according to combat engine. I tihnk we are very close to it with our main game UI design. This new mixer can be another page or another app.

This is how I tried to do balancing manually:
C:\Projects\MyRPG\extra_context\CombatSystemDesigner\CombatSYstemDesigner_wireframe.png

This is the mixer interface I have been  
C:\Projects\MyRPG\extra_context\CombatSystemDesigner\mixer_UI.png

**Features**
- create a scenarios containing a set of actions in certain order by PC and NCP.
  - save scenarios as
  - load scenarios
- an option to compare up to 3 scenarios on one screen.
- drag and drop actions into a grid
- play the scenario without pauses. Timeline advances and Combat log is updated
- create filters for combat log
- display filtered messages with a vertical line and a combat log message
- display user comments with a certical linea and a message a certain timetick
- save new actions with different parameters to use them for experimentation(e.g. Attack with Warmup duration of 3 instead of 5)
    - Keep them between sessions
- validate that the act
- Two rows per scenario one for PC and the other for NPC
  - User selects actions in order and the system populates the timeline
  - If an action needs resolution it happens in real time (e.g. Parry goes into Recovery, Feint cancels an attack)
  - hide/unhide resolved actions (unroll Attack that was cancelled by Feint to see it on the timeline, every next action is pushed to the right)
  
### 2. Combat System Assistant Validator

#### 2.1. Validator 
an automated valiadtion script that will run saved scenarios and check if they pass or fail core assumptions according to new settings.

Possible scenarios
1. PC **Parry** at 100% certainty +Attack beats NPC: Attack + Attack
2. PC **Attack** beats NPC Attack then Feint +Attack
3. PC **Feint** beats Parry

### 2.2 Combat System Agent + outputs to help AI agent
You, an AI agent that will use the saved scenarios and the combat logs together with settings to help me find what is working and what is not.
What kind of files would help you help me meet our objective?

---

## Tech Stack:
Same as the combat-prototype. Consider shadcn if it can contribut to the new requests.
