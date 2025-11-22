## Points for continued discussion:

1. Let's abandon (stop):
   
   - 1.1. Card drafting system, is too restrictive and changes the feeling from decision driven turn based combat to a card game.
   - 1.2. Master strike idea is interesting and will make it to the game but not the first priority to work on.

2. Let's continue disussing and iterate:
   I would like a hybrid of System Proposal 2: The Action-Bidding Engine (Blind Resource Commitment) and System Proposal 3: The Stance-Transition Engine and some of the Shared Core Mechanics.
   - 2.1. **No HP approach**
     - To achieve a combat feel that is "fast and brutal" and avoids the abstract "miss-and-wait" scenario of mainstream RPGs, the system utilizes a deterministic wound model rather than Hit Points (HP). Every action results in an outcome with a deterministic outcome. The idea is to get enough adventage to be able to deliver a decisive strike or get the opponent to surrender because of injuries. Each succefull attack is applying wounds and debuffs on the target, that will make delivering a decisive strike easier.
     - **Injuries are persistent**. During a course of Battle, the Player will have to fight multiplpe duels. The wounds received will carry over to the next duel.
     - **Hit Location:** Wounds are typically localized (arm, leg, body, head etc.). Diffefrent wound location can result in different outcome. Head injuries are the most severe.
     - **Debuff:** Depending on the location hit, the effect (debuff) can be different. Hits to he head are the most severe.
  
   - 2.2. **AP and stamina system**
     - **Introduce max_AP:** AP is a finite resource depending on character build (Endurance attribute). High max_AP allows the character to stay in a fight longer. Add another layer to resource management.
     - **Investing into Attack Pool and Defense Pool:** What is the difference between Attack Pool and Defense Pool where in calcualtions it is being used and what actions and how is being impacted impacts?
   - 2.3. **Blind bid system in the Indes Auto Pause** is a very good idea.
   - 2.4. Who is considered **Attacker** and who is considered a **Defender**?
   - 2.4. **Margin of Victory (Mov)**
     - Calculation needs to be clearer.
     - I like that it is relative. `Player 1 MoV` minus `Player 2 Mov`. In general I like the relative approach to resolving things e.g. Strong vs Weak and the gap between them, or relative as a a precentage difference for balancing.
   - 2.5. **Hit Confirmation** needs to be redefined
   - 2.6. **Leverage Track:** How do player change this? what is it used for? I get that it is relative. Stong wins agains Weak. But how does a player get to strong? How do they weaken? I guess, you are in Indes and strong will win agains weak, meaning the strong will do damage while the weak will take damage. Do I get that right?
   - 2.6. **Damage:** How does Defender Leverage State is suposed to be interpretted when buidling the outcome of a succesfull hit. (Attacker Margin of Victory (MoV) | Defender Leverage State | Hit Location)
   - 2.7. From game perspective how do you get to Indes phase?
   - 2.8. **The Stance-Transition Engine**

3. Let's add (start):
  
   - 3.1. Reading opponents' telegraph movement that will reveal information about the opponent's next action or their state.
     - Telegraph0: You can feel the killer intent from the opponent. They selected Attacker, or are in the Stark3
     - Telegraph1: Opponents arm muscles are tense, suggest that the opponent invested a lot into A-AP
     - Telegraph2: Opponents weapon is rising. They will attack from above
   
   - 3.3. Room for long term character progression or different character builds with distinctive advantages and weaknesses
     - 3.3.1. Extra skill exapmles
       - Winding Expert: one free winding
       - One Last Hit: refills your turns AP pool even if you don;t have any AP left. (once per duel)
       - Miner: +1 Mov bonus to attacks from high position
     - 3.3.2. Skill Masteries:
       - Provocation Level2 gives +1 to MoV when Provocation intent is chosen
     - 3.3.3. Attributes and relative bonuses
       - Speed: `Speed of Player1` minus `Speed of Player2` = +1 Mov or some other quantifiable bonus. or Idea2: It let's the winnig Player reveal more information about the opponents action. TBD after the system is more fleshed out. 
  
   - 3.4. Opponent's don't know anything about each other when the duel starts. Additional infor can be revealed as the duel progresses. Mov calculations should be hidden, there should be visual/text cues suggesting what is happening. 
     - If the opponent is fast (or have Provocation Matery Lvl2) they might more likely choose Provocation
     - If the opponent is strong they might go for bind and physical dominance

4. More information needded:
Describe/define below conscepts in the simliar style as I did below for other concepts:
   - **The Bind:**
   - **Leverage:**
   - **Winding:**
   - **Press:**


## Notes and revised concepts:

---

### Resources:
- Action Points (`AP`) - acts as a measure of stamina, willpower and willingness to press forward.
  - `TurnAP` how much is left to spend, replenishes from the `MaxAP` pool after `Indes` is resolved. (This is to avoid a situation when Hit `Indes` never happens and Players are always changing their decisions)
- Initiative Tick (`IT`) - time
- Focus Points (`FP`)

---

### High Level combat flow
1. Combat starts
   1. `AP` resource is set to max available for value available for the fencer `TurnAP` (6/6)
   2. `FP` is set to 3 `TurnFP` (3/3)
   3. `CurrentTick` time is set to 0
   4. The `CurrentTick` countup is paused 
2. Fencers are `StartDistance` apart (280cm)
3. First `Indes`: P1 and P2 select their Actions blindly (they don't see the opponent's choice) and secretely (the opponent doesn't see it). Available actions:
   1. Move forward/backwards
      1. How far `MoveDistance`
      2. The sytem calculates the AP cost
      3. The system caluclates IT duration (how long it will take to move the desired `Distance`)
   2. `GuardChange`
      1. Change `Guard` to another e.g. from `Guard`=Plow to `Guard`=Wrath 
      2. `GuardPosition` move to another GuardPosition e.g. postion=7 for high-left 
   3. `WeaponAction`
      1. `Intent` Hitter, Taker, Provoker
      2. `AttackDirection` weapon ending position. Has to be the oposite of the current `GuardPosition` e.g. from 7 you move (cut) to either 2, 3, 6
      3. `A-AP` EDIT
      4. `D-AP` EDIT
   4. `Focus` If you are in `Nach` how many Focus Points `FP` are you going to spend to catch up to Opponent that has started the attack first (`Vor`). 1FP = 1IT. With FP of 3 you can be 3 Ticks behind the attacker on the timeline and still make it for the `Impact`

---

### Atomic Turns - Core Combat System

System abstracts timing directly into quantifiable time units managed on a `Timeline`.
This approach uses the concept of Initiative Ticks `IT` to simulate action duration.

In this system, fencers share a common `Timeline` govern by `CurrentTick`. The turn order is fluid and based on `SpentIT` of a total action and the `RecoveryIT` time.

Different Actions have different `APcost`, `ITcost`.
`Movement` is resolved in parallel to other `Actions` (GuardChange, WeaponAction, Focus). (see Movement section for the most up to date information)
`Focus` is spent to "catch up" on the timeline and to finish WeaponAction at the same time as the opponent.

`TurnAction`
- `Movement`: {`MoveDirection`, `MoveDistance`}
- `GuardChange`: {`NewGuard`}
- `WeaponAction`: {`Intent`, `AttackDirection`, `A-AP`, `D-AP`}
- `Focus`: {`SpentFocus`}

Simplified Example (numbers do not match with actual IT cost of actions):
1. Indes:
  - P1 selects in the Indes: `Movement` 40m forward (1 IT)
  - P2 selects in the Indes: `Movement` 80m forward (2 IT)  and `WeaponAction` (5 IT)
2. Game unpauses and `CurrentIT` countsup
3. Game `Pause` at `CurrentIT`=1 (0+1) because:
   1. `Pause` = `RecoveryComplete`, P1 finished Recovery and doesn't have any action selected (RecoveryIT is zero for Movement action)
   2. `Pause` = `new_telegraph` for P1, "P2 finished taking a passing step forward"
   3. `Pause` = `new_telegraph` for P2, "P2 has made a passing step forward and is moving forward. P2 is readying their weapon."
4. P1 selects `Wait`
5. P2 selects `Continue`
6. Game unpauses and `CurrentIT` countsup
3. Game `Pause` at `CurrentIT`=4 because:
   1. `Pause` = `new_telegraph` for P1, "P2 raises their weapon to strike"
4. P1 selects `Wait`
5. Game unpauses and `CurrentIT` countsup
6. Game `Pause` at `CurrentIT`=5 because:
   1. `Pause` = `Death` for P1 and P2, "P2 hit P1 with a weapon. P1 has died"


---

### Distance - Core Tactical State (Hit chance)

For the strike to land it needs to be executed in the approperiate distance from the opponent.
Distance is the only factor that can make a hit really miss.
Moving has `AP` cost (effort) and `IT` (time) cost and is a vulnarability (opportunity for opponent to act) `Pause`

**The distance** is from one fencer to the other.
(The distances numbers assumes a long sword of 120 cm and 180 cm tall. One step is 40cm.)

***GameEngine:***
  - `Distance` between actors is caluclated on the attack resolution after the movement:
    - `Distance` between 100cm to 140cm - attack misses, (out of measure or void)
    - `Distance` between 100cm to 140cm - attack hits
    - `Distance` =< 100cm - attack hits -> `Bind`
    - `Collision` if distance after move < 0, then 0. Resolve normally
  - `StartDistance` combat starts with fencers 280cm apart
  - `Movement`:
    - `MoveDistance`: 46-90cm,`MoveCost`=2, `Pause` = 1
    - `MoveDistance`: 0-45cm, `MoveCost`=1, `Pause` = 1
    - `MoveDistance`: 0-10cm, `MoveCost`=0, `Pause` = 0
  - Each fencer has a `MoveSpeed`, a maximal distance they can move (`MoveIT`) in one `IT`.
    - `UserDistanceSelection`/`MoveSpeed`= `RoundUp(number of IT needed to complete move)`
    - UI will show how many TI will the move will take. 
  - fencers move (use legs) and use arms (move sword) at the same time. Action time and move time moves in parralell:
   - if the `MoveIT` is equal or lower than the `ActionIT`, then it doesn't add time to action
   - if move takes more time than the action, overflow time will be added at the beginning of the action
   - move telegraph will be emited at the end of first `IT` in which move happened.
  -fencers always move at top speed (their life is on the line)
  - forward move starts time is calculated from the end of action so that the action benefit from forward momentum
  - backward move starts at the beginning of the action, wince it's a defensive move
  - attacks benefit from forward momentum
  - fencers move is resolved at the same time as `CurrentIT` counts forward

#### Distance - Design and reality context

  1. **Out of Measure (Fuori Misura):** This is the preparatory range. At this distance, neither opponent can land a blow, even with maximal footwork, such as a jump or a step-lunge. 
     ***Attacks don't make sense. Only preparatory actions, brief rest window, guard change, feint, forward/backward movement are permitted. Since no direct attacks are feasible, this zone emphasizes observation and resource banking.***

  2. **Wide Distance (Larga Misura, Zufechten):** Considered Out of Measure for most techniques, where a fencer might be over-reaching, makeing them vulnerable to counter-strikes. A hit is possible, but it requires substantial footwork, typically a committed step-lunge or a full passing step. 
    ***Attacks initiated from this range are intrinsically **Dui Tempi (two-action) moves**, which necessitate a high AP cost and create a mandatory, exploitable vulnerability with Active Pause window for the opponent.***
   
  3. **One-step Distance (Zufechten):** A fencer can take a comfortable passing step forward to be in the correct measure to hit the opponent directly.
     **Primo Tempo (one-action) strikes**

  4. **Correct Distance (Zufechten):** A fencer can directly stike the opponent without taking another step forward.
     **Primo Tempo (one-action) strikes**

  5. **Narrow Distance (Krieg)** True fight. This represents close proximity. This is the domain of high-speed, minimal footwork actions, including **Primo Tempo (one-action) strikes** and **Mezzo Tempo (half-Time/Interruption)**. Most importantly this is a **bind** range. All high-leverage techniques, including Winding maneuvers are available. Techniques focused on exploiting the **bind** are only accessible in this state, demanding that fencers commit to close distance to develop the technical aspects of the art.

---

### Tempo: Actions (Italian)

#### Italian categorization of tempo
 
1. **Dui Tempi (Two Actions):** This refers to any sequence requiring two distinct phases, typically involving simultaneous footwork and weapon movement, such as a Move/Strike combination or a Feint/Strike sequence.
  ***These actions possess a high cumulative `AP` or `IT` cost. Mechanically, Dui Tempi actions are intentionally designed to be interruptible, structurally rewarding the defender who conserves resources `FP` for a counter-attack.***

2. **Primo Tempo (Single Action):** A single Action, like a fluent Strike with a single motion of the sword. This is a fast, efficient strike requiring the low `AP` cost and `IT` cost. It is designed to maximize damage while minimizing the opponent's window of opportunity.
  ***In game terms, **Primo Tempo** is only achievable when the combatant is already in Zufechten distance or has successfully created an opening via a preceding bind or feint.***

3. **Mezzo Tempo (Interruption/Half-Time):** This is the mechanical core of the Active Pause system. Mezzo Tempo is defined as a preemptive strike, often targeting an uncovered limb, or a counter initiated before the opponent's main strike has fully begun.
  ***In the game system, this translates to the requirement of spending a dedicated resource, Focus, to resolve an action immediately upon the opponent’s declaration of a Dui Tempi action, thereby seizing the initiative flow.***

4. **Contratempo (Simultaneous Strike):** This occurs when both combatants attempt to execute offensive actions against each other within the same immediate window. This models the dangerous reality of mutual engagement. Resolution requires a specific Structured Priority Check to determine the outcome, resulting in a calculated outcome, often a "controlled double hit" where the combatant with superior structure or timing gains a critical advantage while still sustaining minimal damage. 

---

### Tempo: Opportunity to strike or a Vulnerability (Auto-Pause)
Gives a chance to either fencer in `Initiative`=`Vor` or `Initiative`=`Nach` to adjust their `Actions` in light of new information `Telegraphs`.

  ***In GameEngine it's a `Pause`, Players cannot interact with the game outside of `Pause`=`true`.***

  ***Game pauses when:***
  1. `NewTelegraph` New meaningful telegraph information emerges (Every time you see their weapon, foot, or body move)
    - Triggers when telegraph with `Pause: true` is revealed
    - **Opponent** of fencer that emitts teh telegraph can act
    - Example: P1 telegraphs → P2 can respond 
  2. `RecoveryComplete` Recovery phase is completed and actor can act again <- EDIT Recovey might get removed from the game
    - Triggers at the end of last `ActionIT` when action recovery ends
    - **That fighter** can act again
    - Message: "{name} is ready to act again"
  3. `Death` On hp <= 0
    - Triggers when HP <= 0
    - Combat ends, no more actions can be taken by netier P1 or P2
    - Message: "{name} died"
  4. `Indes` Indes starts, the attack is about to be resolved
  5. After you have parried their attack.
  6. When their blow has passed outside your body (a miss (out of measure) or void).
  7. When they raise their sword to attack you (while their hand/weapon is in motion).
  8. While they change their guard (The bigger the movement the bigger the opportunity)
  9. When they move or lift a foot to change their pace or move towards you or away from you (while they are mid-step and off-balance).

#### Tempo: Opportinty and Vulnerability - Design and reality context

The best time to attack your opponent is when he moves (gives you a tempo).  Conversely, a fencer should expect to be attacked if he makes one of these five actions.  However, to gain the advantages, one must first move.  The advantages come with their liabilities, and may not seem like advantages at all if they are also perfect opportunities for the opponent to strike. The key, however, is that one should expect to be struck at  while moving to take advantage.  Thus, they are invitations for an opponent to strike.  By making a half cut to gain the Advantage of Guard, and a half step to gain the Advantage of the Step, one can entice his opponent to make a full blow, and this large tempo can be exploited in turn with a parry and counter in a single, shorter tempo.

Gaining any Advantage requires one to make a tempo.  Delivering a half cut requires one to move from one guard to another, falsing requires the point to leave presence, and stepping offline requires the entire body to move.  Each one of these movements (and especially any combination of them) is a perfect opportunity for the opponent to strike.  Because the one attempting to gain the advantage is required to leave the safety of his guard and move into another, he is momentarily susceptible to an attack, which is what an opponent should look for when making a strike.

---

### Tempo: Initiative & Indes

1. **Vor (Before)** - represents the initial attack or aggressive action taken by one fencer, seizing the initiative. This action forces a response from the opponent.
   
   ***GameEngine:***
   - Fencer who's planned `Impact` (moment when attack is going to be resolved if no Actions are made) is sooner on the `Timeline` than the other person's `Impact`, has `Initiative`=`Vor`
   - `Initiative`=`Vor` gives a bonus to `Leaverage` +1 Stark
   - If both fencers have expected `Impact` in the same `Tick` on the `Timeline`, neither will get a `Vor` Leavearge bonus when `Indes` is resolved. ***
   
2. **Nach (After)** -  is the subsequent defensive reaction or counter-tempo action taken by the defender, often resulting in a binding of the blades (an Interrrupt).
   
    ***GameEngine:***
    - Fencer who's planned `Impact` is at least 1 `Tick` later on the `Timelien` than the other person's `Impact`, has `Initiative`=`Nach`
    - They can see opponent's Actions `Telegraph` before commiting to an Action. That gives them more information to make better choices to adjust to the attack and gain `Leverage` adventage before `Indes`.
    - Once they are ready, they spend spend `FP` (Focus points) to "catch up" to `Vor` on the timeline, which triggers `Indes`. (Vor bonus stays on for the attacker)
   
3. **Indes (Instant/Meanwhile/instance of stilleness)** - the single most critical element for simulating KdF in an atomic-turn system. Indes translates to "in the instant" or "meanwhile" and represents the immediate, **reflexive action taken upon contact with the opponent's sword**. This is the precise moment where a fencer, using trained instinct (**Fühlen**) to judge opponent's **Leaverage** (Strong or Weak) and makes a definitive counter-action (a **winding**, a **disengage**, or a **press**).

!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  ***GameEngine:*** EDIT EDIT EDIT EDIT !!!!!!!!
  - Before Indes resolution is revealed, fencers have one last chance to edit their Actions and go to Vor Nach again. It will cost 3 `FP` Focus Points to get at least 1 `Tick` on `Timeline` ahead. EDIT EDIT
 - `Indes` is a `Pause` for both P1 and P2
 
 - Both players secretly commit their decisive Indes `Action` simultaneously and cofirm the choice to unpause the game, allowing the outcome to be determined by the interaction of their choices.
  
 - `LeaverageMeter` for both P1 and P2 is visible to both of them (**Fuhlen**)
 - Winner of Hitter-Taker-Provoker (Rock-Papaer-Scissors), makes the final decisionn.


---

### Bind: Quantifying Fühlen (Strone and Weak Leverage) with The Leverage Track: 

- **Fühlen:** trained instinct to judge the opponent's leverage (**Strong-Stark** or **Weak-Swach**) and makes a definitive counter-action (a winding, a disengage, or a press).
- **Leverage:** `LeverageTrack` is a **Stark/Swach Meter**

- `LeverageTrack`: **Stark/Swach Meter**
   - ***Mechanic: **Leverage Track**, scaled from +3 (Max Stark) to -3 (Max Swach)***
     - **Stark State** (+1 to +3): Indicates the fencer possesses structural advantage and safety. Available actions are "Hard" (applying direct pressure, executing a powerful strike, or maintaining the bind).   
     - **Swach State** (-1 to -3): Indicates structural vulnerability. The fencer must utilize "Soft" actions (disengaging, retreating, or Winding) to escape the pressure. Failure to act softly when in a Swach state leads to catastrophic displacement and injury.

  ***The position on Leverage Track is the direct outcome of the players' simultaneous action choices (the Indes resolution). By visualizing this state, the game simulates the tactical judgment required of a master fencer to "feel well if he is weak or strong at the sword".***

---

### Intent: Provoker, Taker, Hitter

  - **Hitter (H):** A direct, simple strike intended to land immediately, prioritizing speed and aggression.
  - **Taker (T):** An action designed to meet or bind the opponent's blade, taking control or absorbing the momentum defensively.
  - **Provoker (P):** A deceptive or preparatory action (such as a feint) intended to draw a specific reaction (the Taker response) from the opponent.   

***The PHT functions as a high-level mind game, where predictive play and reading the opponent's tactical focus are paramount.***

**The PHT Matrix: Deterministic Conflict Resolution**

***To ensure the combat remains entirely deterministic, the PHT concepts are mapped onto an intransitive "Rock-Paper-Scissors" (RPS) framework. This ensures that for every choice, there is an optimal counter, guaranteeing that decisions matter and eliminating RNG for interaction resolution.***

- **Hitter (H)** (Quick Strike) defeats Provoker (P) (Preparing a Complex Action): The quick, direct Hitter action lands before the Provoker can fully execute their deceptive setup or withdrawal.
- **Taker (T)** (Bind/Commitment) defeats Hitter (H) (Direct Attack/Simple Strike): The Taker meets the aggressive Hitter strike with strength, successfully binding the blade and neutralizing the direct attack.
- **Provoker (P)** (Feint/Bait) defeats Taker (T) (Static Defense/Bind): The Taker is committed to receiving the blow, allowing the Provoker to deceive and strike around the defense.

***When players simultaneously commit their PHT intent, the winning intent immediately gains a deterministic Advantage, which translates into a favorable shift on the Leverage Track before the physical action is resolved. This ensures that the success of the exchange is determined by the strategic reading of the opponent's mind, not raw attributes.***

---


## Core Mechanics: Resources and State Tracking
All proposed combat system models rely on a common set of deterministic mechanics to regulate effort, tactical advantage, and consequence.


---

### The Leverage Track (Stark/Swach Meter)
***The Track is central because it governs the deterministic outcomes of all attacks:***

As established, the Leverage Track provides the numerical quantification of the strategic state, replacing RNG for **determining hit success** and **intensity**. This track is symmetrical, spanning from -3 (Maximum Swach) to +3 (Maximum Stark), with 0 representing a neutral bind or engagement.

- **Hit Confirmation:** If the attacker wins the PHT contest and successfully commits enough action resources (AP), the attack connects. The concept of a "miss" is abstracted into a glancing blow or absorbed force, determined by the defensive player's current Leverage state.
- **Outcome Modification:** The defender's current Leverage position determines the severity of the incoming wound.
  - A fencer in a high Stark state, even if struck, has adequate structure and defense to mitigate the damage.
  - A fencer in a high Swach state is structurally displaced, making recovery nearly impossible, and guaranteeing a severe outcome.
- **Action Availability:** Being on the Swach side compels "Soft" defensive actions, while the Stark side permits "Hard" offensive actions. This mechanism creates the flow of pressure inherent to KdF, where the state dictates the safest tactical options

---

### Action Point (AP) Economy: Fueling Effort and Winding (Winden)
A resource management system, the Action Point (AP) economy, is essential for regulating the tactical commitment and physical effort required for execution. AP acts as a measure of stamina, focus, and willingness to press forward.

1. Each character posses a limted AP pool for an entire combat (max_AP). Depends on character build. High max_AP allows the character to stay in a fight longer. Add another layer to resource management.
2. Each character possesses a limited AP pool at the start of each atomic turn, that comes from the max_AP pool.
3. Actions, including strikes, movement transitions, and specialized techniques, consume AP.
4. The strategic skill of the player involves budgeting AP across offensive and defensive commitments, particularly in the Indes Active Pause phase.

--- 
### The Winding Mechanic (Winden)
Winden (Winding) is used in the bind. It is the defining technical maneuver of KdF combat from the bind, allowing the fencer to shift their strong section onto the opponent's weak section, often defeating a stronger opponent through technique rather than brute force.

***Mechanical Translation: Winding is defined as a high-cost Reaction Ability***
- **Trigger:** The player is forced into a Swach state (Leverage of -1 or worse) following a PHT loss or a failed defensive action.
- **Cost:** Extra AP expenditure.
- **Effect:** The Winding action immediately attempts to reverse the Leverage situation. It grants a deterministic shift of +2 Leverage toward Stark and cancels the immediate threat of injury from the bind. This represents the successful technical manipulation of the opponent's blade, transforming a moment of weakness into safety or opportunity.

---

### Injury and Lethality Model: Critical Wound States (No HP)
To achieve a combat feel that is "fast and brutal" and avoids the abstract "miss-and-wait" scenario of mainstream RPGs, the system utilizes a deterministic wound model rather than Hit Points (HP). Every action results in an outcome with a deterministic outcome. The idea is to get enough adventage to be able to deliver a decisive strike or get the opponent to surrender because of injuries. Each succefull attack is applying wounds and debuffs on the target, that will make delivering a decisive strike easier.

**Successful attacks** result in fixed, specific injury states that apply immediate, debilitating penalties.
- **Damage:** The lethality and severity of the wound are deterministically linked to the defender's structural integrity (Leverage State) at the moment of impact.The successful execution of a strike (determined by PHT and AP Margin of Victory) is merely the prerequisite; the resulting damage type is a product of the tactical state.
- **Hit Location:** Wounds are typically localized (arm, leg, body, head etc.). Diffefrent wound location can result in different outcome. Head injuries are the most severe.
- **Debuff:** Depending on the location hit, the effect (debuff) can be different.
- **Injuries are persistent**. During a course of Battle, the Player will have to fight multiplpe duels. The wounds received will carry over to the next duel.


Table:
***Illustrates how the combination of the Margin of Victory (MoV) in the AP exchange and the Defender’s instantaneous Leverage State dictates the final outcome. This reinforces the core KdF principle that structure and control (Stark) are the primary forms of defense, offering protection even against a powerful attack.***

Attacker Margin of Victory (MoV) | Defender Leverage State | Hit Location | Resultant Wound State | Penalty Example (Limb Hit)
Marginal (1-2 AP) | Max Stark (+3) | Scratch/Fatigue | body | Lose 1 AP next turn
Marginal (1-2 AP) | Max Stark (+3) | Scratch/Fatigue | head | −1 to MoV when attacked from left side
Standard (3-5 AP) | Neutral (0) | Light Wound | leg | −1 AP pool each turn
Decisive (>6 AP)  | Swach (−2 to −3) | Severe Wound | head | Combat Incapacitation/Permanent Debuff
Decisive (>6 AP)  | Max Swach (−3) | Critical/Dead | body | −2 AP pool each turn
Decisive (>6 AP)  | Max Swach (−3) | Critical/Dead | body | Combat Incapacitation/Permanent Debuff

---

### 1 The Action-Bidding Engine (Blind Resource (AP) Commitment)

***This system maximizes the simulation of physical commitment and Fühlen by requiring players to allocate a limited resource (AP) simultaneously, quantifying the relative force applied in the exchange. This mechanism creates acute tension through unknown commitment, similar to a deterministic blind-bid structure.***


#### 1.1. Core Loop: Hidden AP Commitment to Attack vs. Defense Value

In the Indes Active Pause, both players secretly declare three simultaneous choices:
1. **PHT Intent:** Provoker, Taker, or Hitter.
2. **Target and Action Type:** The specific maneuver (e.g., High Hew, Thrust, Winding). EDIT THIS LATER
3. **AP Allocation:** The player splits their available AP pool (e.g., 5 AP) between the Attack Pool (A-AP) and the Defense Pool (D-AP).

#### 1.2. Conflict Resolution Sequence:

1. **PHT Contest:** The PHT Matrix is resolved first.
   - The winner of the intent exchange gains a Bonus to their allocated A-AP (e.g., P > T grants +2 A-AP Bonus Modifier to the Provoker).
   - The loser suffers a penalty modifier to their D-AP (e.g., -1 D-AP Penalty Modifier).
This ensures strategic intention shapes the physical outcome.

1. **Leverage Modification:** The player’s current Leverage Track position modifies the raw AP pool. If a player is +2 Stark, they add +2 to both A-AP and D-AP, reflecting superior structure.

2. **Physical Exchange (A-AP vs. D-AP):** The attacker compares their modified A-AP total against the defender’s modified D-AP total. The resulting Margin of Victory (MoV) is the raw "damage" output.

#### 1.3. Stark/Swach: The Pressure Gauge and Winding Bid

***The strategic skill lies in assessing the opponent's likely commitment based on the known Leverage State. If an opponent is in a strong Stark state, they are likely to allocate more AP to A-AP for a decisive Hitter strike. If they are in Swach, they must reserve AP for defense (D-AP) or the Winding counter-bid.***

**The Winding mechanism** is integrated as a reactive AP expenditure against the MoV. **Winding is a Counter-Bid Mechanic**.
- If the attacker achieves a low MoV (e.g., 3 or less), the defender may spend 2 AP (if reserved) on a Winding declaration.
  - This resource expenditure cancels the raw MoV damage entirely, representing the successful technical defense against insufficient force. Critically, the Winding immediately rewards the defender by shifting the Leverage Track in their favor (e.g., +1 Stark), successfully transitioning weakness into safety.1 This reinforces the principle that technique can defeat sheer strength.

#### 1.4. Deterministic Outcome: Margin of Victory and Wound Scaling
Since there is no "to hit" roll, every exchange impacts the fight. The raw MoV from the AP differential determines the severity of the blow, which is then refined by the defender’s current structural state (Leverage).

The raw damage (MoV) is applied to the Wound Severity Matrix.
  - A high MoV (high force commitment) against a structurally weak (Swach) opponent guarantees a Severe or Critical Wound, leading to immediate incapacitation.
  - This deterministic outcome structure ensures combat is lethal and focused on control and technical advantage.

---


### 2. The Stance-Transition Engine

***Managing long-term positional advantage, focusing on the strategic interaction of fixed guards designed to defeat specific stances. The system functions as a deterministic state machine, where the outcome of an action is based on the starting and ending Guard states.***