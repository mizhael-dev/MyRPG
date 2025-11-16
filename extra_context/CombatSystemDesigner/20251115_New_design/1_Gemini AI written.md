# First draft - Exploratory
**Date:** 2025-11-15 14:00

Expert Report: Design of a Deterministic, Atomic-Turn Combat Engine for Liechtenauer's Art of Fencing (KdF)
I. Strategic Imperatives: The Philosophical Framework of KdF Combat
The foundation of a tactical combat system derived from Johannes Liechtenauer’s tradition (Kunst des Fechtens, or KdF) must prioritize positional advantage, tempo control, and precise action resolution over probabilistic outcomes. The goal is to design a deterministic system where tactical judgment regarding measure, leverage, and opponent intent replaces reliance on mainstream random number generation (RNG) [User Query]. Success is predicated on recognizing the opponent's state (Fühlen) and executing the single-tempo response (Indes).   

1.1. The Tactical Time Cycle: Vor, Nach, and the Decisiveness of Indes
KdF theory organizes conflict into distinct phases of tempo control: Vor (Before), Nach (After), and Indes (Instant/Meanwhile). These concepts provide the necessary structure for mapping rapid, flowing combat onto discrete, atomic decision points.

The Vor represents the initial attack or aggressive action taken by one fencer, seizing the initiative. This action forces a response from the opponent. The Nach is the subsequent defensive reaction or counter-tempo action taken by the defender, often resulting in a binding of the blades. Critically, relying too heavily on winning the Vor at all costs, especially from inappropriate measure, leads to poor technique and wide, distorted bindings—a failure of the art criticized by historical sources.   

The concept of Indes is the single most critical element for simulating KdF in an atomic-turn system. Indes translates to "in the instant" or "meanwhile" and represents the immediate, reflexive action taken upon contact with the opponent's sword. This is the precise moment where a fencer, using trained instinct (Fühlen), judges the opponent's leverage (Strong or Weak) and makes a definitive counter-action (a winding, a disengage, or a press). Since this decision must be made "in an instant" before the opponent has time to react to the defense, standard sequential turn-taking fails to model the necessary simultaneity. Therefore, Indes must serve as the Active Pause mechanism in the proposed system. Both players secretly commit their decisive Indes action simultaneously, allowing the outcome to be determined by the interaction of their choices, not by a fixed initiative order.   

1.2. The Measure and Krieg: Distance as a Core Tactical State
Fencing measure dictates the validity and safety of any chosen action. The system must abstract distance into quantifiable states that gate the available techniques.

The exchange begins in Zufechten (approach), where fencers are preparing or searching for an opening. The true fight, Krieg (war), occurs when the fencers step into striking measure. Ignoring measure and relying on long, reaching strikes is explicitly identified as an error in historical practice.   

The system formalizes distance using a simple Measure Track with three states:

Out of Measure (Zufechten): Only preparatory actions, forward steps, or feints are permitted. Direct strikes are disallowed, preventing the simulation of overly long, ineffective attacks.   

Closing: Transitional state. Limited offensive actions available, primarily quick steps combined with attacks designed to force the Bind.

Krieg (In Measure): All high-leverage techniques, including Winding maneuvers and Master Strikes, are available. Techniques focused on exploiting the bind (am schwert) are only accessible in this state, demanding that fencers commit to close distance to develop the technical aspects of the art.   

This spatial abstraction ensures that tactical decisions are weighted by risk: actions in Krieg are decisive but dangerous, forcing players to train to come close to the danger.   

1.3. Mastery of the Bind: Understanding Stark and Swach (Strong and Weak Leverage)
The concepts of Stark (Strong) and Swach (Weak) are central to the mechanical conflict. They are not merely references to the parts of the sword (strong near the cross, weak near the point) but describe the dynamic leverage achieved during the bind. The strength of the sword is maximized near the cross, leveraging the body as a fulcrum.   

In any bind, a duality exists: one opponent is strong, and the other is weak. The fundamental objective of KdF is to use one's strong part against the opponent's weak part. The art allows the weaker fencer to prevail through technique by shifting their leverage, such as winding their strong onto the opponent's weak blade.   

This dynamic necessity—of adjusting technique based on the relative pressure—must be translated into a quantifiable, deterministic game state. The ability to sense this pressure is known as Fühlen (feeling). The system must make this internal sensation external and visible to the player.   

The Leverage Track: Quantifying Fühlen
The mechanical representation of Fühlen is the shared Leverage Track (Stark/Swach Meter). This quantifiable scale replaces randomized hit chances, functioning as a deterministic pressure indicator that informs decision-making.

A Leverage Track, scaled from +3 (Max Stark) to -3 (Max Swach), defines the mechanical advantage and safety of the current fencing position.

Stark State (+1 to +3): Indicates the fencer possesses structural advantage and safety. Available actions are "Hard" (applying direct pressure, executing a powerful strike, or maintaining the bind).   

Swach State (-1 to -3): Indicates structural vulnerability. The fencer must utilize "Soft" actions (disengaging, retreating, or Winding) to escape the pressure. Failure to act softly when in a Swach state leads to catastrophic displacement and injury.   

The position on this track is the direct outcome of the players' simultaneous action choices (the Indes resolution). By visualizing this state, the game simulates the tactical judgment required of a master fencer to "feel well if he is weak or strong at the sword".   

II. Translating HEMA Theory into Core Game Functions
The tactical depth of the proposed system relies on abstracting strategic intent and technical execution into two interlocking deterministic mechanics: the PHT cycle and the concept of single-tempo priority.

2.1. The PHT Cycle: Mechanizing Strategic Intent (Provoker, Taker, Hitter)
The Provoker, Taker, and Hitter (PHT) paradigm, often associated with Meyer’s teachings but functionally integrated into longsword theory , provides the strategic layer for simultaneous action selection. PHT dictates the intent or goal of the action, moving beyond a simple description of the cut.   

Hitter (H): A direct, simple strike intended to land immediately, prioritizing speed and aggression.

Taker (T): An action designed to meet or bind the opponent's blade, taking control or absorbing the momentum defensively.

Provoker (P): A deceptive or preparatory action (such as a feint) intended to draw a specific reaction (the Taker response) from the opponent.   

The PHT functions as a high-level mind game, where predictive play and reading the opponent's tactical focus are paramount. In an ideal sequence, three hews are exchanged, one of which should always hit.   

The PHT Matrix: Deterministic Conflict Resolution
To ensure the combat remains entirely deterministic, the PHT concepts are mapped onto an intransitive "Rock-Paper-Scissors" (RPS) framework. This ensures that for every choice, there is an optimal counter, guaranteeing that decisions matter and eliminating RNG for interaction resolution.   

The hypothesized functional relationships are defined as follows:

Provoker (P) (Feint/Bait) defeats Taker (T) (Static Defense/Bind): The Taker is committed to receiving the blow, allowing the Provoker to deceive and strike around the defense.

Taker (T) (Bind/Commitment) defeats Hitter (H) (Direct Attack/Simple Strike): The Taker meets the aggressive Hitter strike with strength, successfully binding the blade and neutralizing the direct attack.

Hitter (H) (Quick Strike) defeats Provoker (P) (Preparing a Complex Action): The quick, direct Hitter action lands before the Provoker can fully execute their deceptive setup or withdrawal.

When players simultaneously commit their PHT intent, the winning intent immediately gains a deterministic Advantage, which translates into a favorable shift on the Leverage Track before the physical action is resolved. This ensures that the success of the exchange is determined by the strategic reading of the opponent's mind, not raw attributes.

2.2. Single-Tempo Resolution: Emulating Master Strikes (Meisterhau)
Master Strikes (Meisterhau or ‘secret strikes’) are essential to KdF and represent techniques that combine offense and defense into a single movement, granting superior safety and efficacy. In contrast, less skilled fencers typically rely on double-tempo actions (defend, then counterattack).   

To reflect the technical superiority and priority of the Meisterhau in a deterministic system, these actions must be treated as specific resources or high-cost moves that inherently supersede standard attacks.

Priority Mechanic: A Master Strike action must possess fixed priority over standard attacks and counterattacks, aligning with established fencing principles where a properly executed attack generally has priority over a counterattack.   

Resource Cost: Meisterhau actions must consume a significant portion of the Action Point (AP) economy (Section 3.2), modeling the required physical effort and commitment.

Leverage Guarantee: A successfully executed Master Strike places the strong of the blade in a defensively protected angle while delivering the attack. Mechanically, this translates to a guaranteed, maximum Leverage gain for the attacker (e.g., +3 Stark) upon execution, forcing the defender into a state of severe disadvantage, provided the technique targeted the correct defensive posture.   

III. Shared Core Mechanics: Resources and State Tracking
All proposed combat system models rely on a common set of deterministic mechanics to regulate effort, tactical advantage, and consequence.

3.1. The Leverage Track (Stark/Swach Meter)
As established, the Leverage Track provides the numerical quantification of the strategic state, replacing RNG for determining hit success and intensity. This track is symmetrical, spanning from −3 (Maximum Swach) to +3 (Maximum Stark), with 0 representing a neutral bind or engagement.

The Track is central because it governs the deterministic outcomes of all attacks:

Hit Confirmation: If the attacker wins the PHT contest (Section 2.1) and successfully commits enough action resources (Section 3.2), the attack connects. The concept of a "miss" is abstracted into a glancing blow or absorbed force, determined by the defensive player's current Leverage state.

Outcome Modification: The defender's current Leverage position determines the severity of the incoming wound (Section 3.3). A fencer in a high Stark state, even if struck, has adequate structure and defense to mitigate the damage. Conversely, a fencer in a high Swach state is structurally displaced, making recovery nearly impossible, and guaranteeing a severe outcome.   

Action Availability: Being on the Swach side compels "Soft" defensive actions, while the Stark side permits "Hard" offensive actions. This mechanism creates the flow of pressure inherent to KdF, where the state dictates the safest tactical options.   

3.2. Action Point (AP) Economy: Fueling Effort and Winding (Winden)
A resource management system, the Action Point (AP) economy, is essential for regulating the tactical commitment and physical effort required for execution. AP acts as a measure of stamina, focus, and willingness to press forward.   

Each character possesses a limited AP pool (e.g., 5-7 points) at the start of each atomic turn. Actions, including strikes, movement transitions, and specialized techniques, consume AP. The strategic skill of the player involves budgeting AP across offensive and defensive commitments, particularly in the Active Pause phase.

The Winding Mechanic (Winden)
Winden (Winding) is the defining technical maneuver of KdF combat from the bind, allowing the fencer to shift their strong section onto the opponent's weak section, often defeating a stronger opponent through technique rather than brute force. Historical texts emphasize that one "rarely is a good fencer without the windings" and criticize those who rely solely on extended, outstretched strength.   

Mechanical Translation: Winding is defined as a high-cost Reaction Ability.

Trigger: The player is forced into a Swach state (Leverage of −1 or worse) following a PHT loss or a failed defensive action.

Cost: 2 AP expenditure.

Effect: The Winding action immediately attempts to reverse the Leverage situation. It grants a deterministic shift of +2 Leverage toward Stark and cancels the immediate threat of injury from the bind. This represents the successful technical manipulation of the opponent's blade, transforming a moment of weakness into safety or opportunity.   

3.3. Injury and Lethality Model: Critical Wound States (No HP)
To achieve a combat feel that is "fast and brutal" and avoids the abstract "miss-and-wait" scenario of mainstream RPGs , the system utilizes a deterministic wound model rather than Hit Points (HP). Every successful action results in an outcome; a null result is minimized.   

Successful attacks result in fixed, specific injury states that apply immediate, debilitating penalties. These wounds are typically localized (arm, leg, head, etc.).   

The lethality and severity of the wound are deterministically linked to the defender's structural integrity (Leverage State) at the moment of impact. The successful execution of a strike (determined by PHT and AP Margin of Victory) is merely the prerequisite; the resulting damage type is a product of the tactical state.

Table II illustrates how the combination of the Margin of Victory (MoV) in the AP exchange and the Defender’s instantaneous Leverage State dictates the final outcome. This reinforces the core KdF principle that structure and control (Stark) are the primary forms of defense, offering protection even against a powerful attack.   

Table II: Critical Wound Determination based on Leverage

Attacker Margin of Victory (MoV)	Defender Leverage State	Resultant Wound State	Penalty Example (Limb Hit)
Marginal (1-2 AP)	Max Stark (+3)	Scratch/Fatigue	Lose 1 AP next turn
Standard (3-5 AP)	Neutral (0)	Light Wound	−1 to Attack checks permanently
Decisive (>6 AP) or Master Strike	Swach (−2 to −3)	Severe Wound	Forced Prone/Stunned (Lose next turn)
Decisive (>6 AP) or Master Strike	Max Swach (−3)	Critical/Dead	Combat Incapacitation/Permanent Debuff
IV. System Proposal 1: The Force-Priority Engine (Card/Action Drafting)
This proposal models combat as a sequence of fixed tactical declarations, using a closed system of action cards to abstract immediate fencing options.

4.1. Core Loop: Simultaneous Card Reveal and Initiative Priority
Players utilize a small, pre-selected deck of Action Cards (e.g., 10 cards representing basic Hews, Thrusts, Parries, Feints). At the moment of Indes (Active Pause), both players simultaneously and secretly select one Card to play.

Resolution occurs in two stages, emphasizing priority:

Priority Resolution: Every card possesses a fixed, public Priority Value (PV), which reflects the inherent tempo of the technique. The action with the highest PV resolves first. Actions with equal PV result in a Bind.   

Example: A Standard Strike might have PV 3. A Stop-Hit (a high-tempo counter) might have PV 5. If Player A uses a Stop-Hit (PV 5) against Player B’s Strike (PV 3), Player A resolves first, potentially landing a hit before Player B's attack is completed.

Effect Resolution: The action of the winning priority player is checked against the losing player's card type for full effect.

4.2. PHT Integration: Card Intent and Leverage Gain
Each Action Card is tagged with one of the PHT intents (Provoker, Taker, Hitter). The PHT tags are essential for resolving exchanges that result in a Bind (equal PV).

When a Bind occurs, the PHT Matrix (Section 2.1) is consulted to determine tactical advantage:

The player whose PHT intent defeats the opponent’s intent (e.g., Taker vs. Hitter) gains immediate advantage, resulting in a +1 shift on the Leverage Track. The losing player suffers a −1 shift.

This exchange of Leverage, resulting from the clash of intentions during the bind, sets the stage for the next action, requiring the player in Swach to adjust their strategy (e.g., utilize a Winding Card if one is available).

4.3. Stark/Swach Feedback and Resource Management
The Leverage Track acts as a condition modifier for the cards. The current state dictates the effectiveness of the tactical options:

A player at +2 Stark may find that their Hitter cards gain a passive +1 PV, reflecting the added force and safety of their structure.

A player at −2 Swach might find their Taker cards lose −1 PV, indicating that static defense from a poor position is structurally unsound.

The cards themselves are a finite resource, forcing strategic management (Deck Management). Players must balance playing cards for immediate tactical gain versus discarding them to reset their hand or regenerate AP, ensuring they utilize the full spectrum of PHT actions rather than spamming a single technique.   

V. System Proposal 2: The Action-Bidding Engine (Blind Resource Commitment)
This system proposal maximizes the simulation of physical commitment and Fühlen by requiring players to allocate a limited resource (AP) simultaneously, quantifying the relative force applied in the exchange. This mechanism creates acute tension through unknown commitment, similar to a deterministic blind-bid structure.   

5.1. Core Loop: Hidden AP Commitment to Attack vs. Defense Value
In the Active Pause (Indes), both players secretly declare three simultaneous choices:

PHT Intent: Provoker, Taker, or Hitter.

Target and Action Type: The specific maneuver (e.g., High Hew, Thrust, Winding).

AP Allocation: The player splits their available AP pool (e.g., 5 AP) between the Attack Pool (A-AP) and the Defense Pool (D-AP).   

Conflict Resolution Sequence:
PHT Contest: The PHT Matrix (Section 2.1) is resolved first. The winner of the intent exchange gains a bonus multiplier to their allocated A-AP (e.g., P > T grants +2 A-AP Multiplier to the Provoker). The loser suffers a penalty multiplier to their D-AP (e.g., −1 D-AP Multiplier). This ensures strategic intention shapes the physical outcome.

Leverage Modification: The player’s current Leverage Track position modifies the raw AP pool. If a player is +2 Stark, they add +2 to both A-AP and D-AP, reflecting superior structure.   

Physical Exchange (A-AP vs. D-AP): The attacker compares their modified A-AP total against the defender’s modified D-AP total. The resulting Margin of Victory (MoV) is the raw "damage" output.

5.2. Stark/Swach: The Pressure Gauge and Winding Bid
The strategic skill lies in assessing the opponent's likely commitment based on the known Leverage State. If an opponent is in a strong Stark state, they are likely to allocate more AP to A-AP for a decisive Hitter strike. If they are in Swach, they must reserve AP for defense (D-AP) or the Winding counter-bid.

Winding as Counter-Bid Mechanic
The Winding mechanism (Section 3.2) is integrated here as a reactive AP expenditure against the MoV.

If the attacker achieves a low MoV (e.g., 3 or less), the defender may spend 2 AP (if reserved) on a Winding declaration.

This resource expenditure cancels the raw MoV damage entirely, representing the successful technical defense against insufficient force. Critically, the Winding immediately rewards the defender by shifting the Leverage Track in their favor (e.g., +1 Stark), successfully transitioning weakness into safety. This reinforces the principle that technique can defeat sheer strength.   

5.3. Deterministic Outcome: Margin of Victory and Wound Scaling
Since there is no "to hit" roll, every exchange impacts the fight. The raw MoV from the AP differential determines the severity of the blow, which is then refined by the defender’s current structural state (Leverage).

The raw damage (MoV) is applied to the Wound Severity Matrix (Table II). A high MoV (high force commitment) against a structurally weak (Swach) opponent guarantees a Severe or Critical Wound, leading to immediate incapacitation. This deterministic outcome structure ensures combat is lethal and focused on control and technical advantage rather than attrition.   

VI. System Proposal 3: The Stance-Transition Engine (State Machine Focus)
This proposal shifts the primary tactical decision away from momentary AP bidding toward managing long-term positional advantage, focusing on the strategic interaction of fixed guards and Master Strikes designed to defeat specific stances. The system functions as a deterministic state machine, where the outcome of an action is based entirely on the starting and ending Guard states.   

6.1. Core Loop: Posture Selection and Stance Advantage
Players utilize a defined set of primary KdF Guards (Ochs (Ox), Pflug (Plow), Alber (Fool), Vom Tag (From the Roof), etc.). Combat turns are spent declaring the intended Guard change for the next turn, and selecting a single action that facilitates that transition.

6.2. PHT/Stark/Swach Integration: Stances as Pre-determined Tactical Roles
In this model, the strategic intent (PHT) and inherent structural advantage (Stark/Swach) are intrinsic properties of the Guard itself, not the player's momentary decision.

Ochs (Ox): Possesses a passive Taker intent (designed to absorb incoming strikes) and grants a passive +1 Stark bonus, modeling its superior defensive structure.

Alber (Fool): Possesses a passive Hitter intent (designed to strike from below) and carries an intrinsic −1 Swach penalty, modeling the high-risk, exposed nature of the posture.   

Actions, therefore, are measured by the cost (in AP) to transition from one posture to another, rather than the effort of the swing itself.

6.3. System Flow: Stance-vs-Stance Matchup and Leverage Transfer
The resolution of the Active Pause relies on a fixed Stance-vs-Stance Resolution Matrix. This matrix outlines the predetermined outcomes when an Attacker attempts to transition/strike from Stance A toward an opponent occupying Stance B.

Matrix Resolution: The matrix entry defines the outcome (Hit, Bind, Displacement, etc.), the amount of Leverage shift, and the specific Master Strike counter that applies. This design mirrors the prescriptive nature of historical fencing manuals, which taught specific techniques (Master Strikes) intended to defeat specific guards.   

Leverage Transfer: The outcome is non-negotiable. If a stance transition designed as a Provoker is successfully executed against a stance inherently defined as a Taker (P > T), the Attacker gains +X Leverage and the Defender suffers −Y Leverage.

Master Strike as Perfect Counter: If a player successfully executes a transition action (a Master Strike) that perfectly counters the opponent's chosen Stance (as defined by the matrix), the attack resolves with maximum Leverage (e.g., +3 Stark) and immediately triggers a Severe Wound outcome, bypassing lower wound tiers due to the technical superiority and perfect tempo of the action.   

This system emphasizes positional strategy and the execution of specific counters over general offensive maneuvers.

Table IV: Stance-vs-Stance Resolution Matrix (Partial Example)

Attacker Stance (Intent)	Defender Stance	PHT Matchup	Resultant Leverage Change	Outcome Detail
Ochs (Taker)	Alber (Hitter)	T > H (Win)	Attacker +2, Defender −2	Defender Displaced (Forced Retreat 1 Measure)
Pflug (Provoker)	Ochs (Taker)	P > T (Win)	Attacker +1, Defender −1	Successful Hit, Wound determined by Defender's −1 Swach
Alber (Hitter)	Pflug (Provoker)	H > P (Loss)	Attacker −3, Defender +3	Attacker Displaced, Suffers Severe Wound (Master Stroke Counter)
VII. Executive Summary and Design Synthesis
7.1. Comparative Analysis of the Three Proposed Systems
The three proposed systems translate the core HEMA principles—Vor, Nach, Indes, Stark, Swach, and PHT—into deterministic mechanics, but differ significantly in their operational focus:

Feature	System 1: Card Drafting	System 2: Action Bidding (Recommended Core)	System 3: Stance Transition
Primary Mechanism	Simultaneous Card Selection/Priority (ROW)	Hidden AP Allocation (Resource Commitment)	Fixed Stance-to-Stance Determinism
PHT Integration	Card tags define intent, resolving ties.	Simultaneous intent declaration dictates priority and AP multipliers.	Stances intrinsically define PHT role.
Fidelity to Fühlen	Low: Focus on managing hand options and fixed priorities.	High: AP commitment directly models physical effort, tension, and pressure.	Medium: Focus on positional advantage matching the technical manuals.
Design Tension	Bluffing and managing the flow of the card resource (options economy).	Predicting opponent’s physical commitment (AP allocation).	Predicting opponent’s structural positioning (Stance change/counter).
Best for:	Large scale tactical battles (simulating breadth of options and training methods).	1-on-1 duels (simulating the moment-to-moment physical and psychological pressure of Krieg).	Highly structured, technical narrative duels (simulating prescriptive KdF drills and ideal Master Strike usage).
7.2. Hybridization and Conclusion
The goal of designing a system where player decisions regarding Fühlen and leverage drive deterministic outcomes is best served by combining the most robust elements of the proposed models.

The Action-Bidding Engine (Proposal 2) provides the most nuanced deterministic simulation of pressure, leverage, and commitment. The act of splitting AP between offensive force (A-AP) and defensive structure (D-AP) is a direct mechanical analog for managing physical presence in the fight. The necessary element of predictive play is introduced by the PHT contest, which modifies the AP pool efficiency before the exchange is resolved.

The incorporation of the Winding mechanic as a 2 AP counter-bid is vital, as it allows a player in a moment of Swach vulnerability to recover by applying proper technique, embodying the principle that skill can defeat superior strength.   

Recommended Hybrid Blueprint:

Tempo (Atomic Turn): Utilize the Active Pause for simultaneous declaration (Indes).

Strategic Intent: Players declare PHT Intent, which is resolved by the PHT Matrix to determine initial advantage multipliers on AP pools.

Physical Commitment: Players secretly allocate AP between Attack (A-AP) and Defense (D-AP), adjusted by the current Leverage Track position.

Exchange Resolution: MoV (A-AP vs. D-AP) is calculated. The defender may spend 2 AP for Winding if MoV is low, shifting Leverage and canceling damage.

Consequence: If Winding is unsuccessful or unattempted, the MoV and the defender’s final Leverage State determine the severity of the Critical Wound, ensuring rapid, decisive, and deterministic results.   

This hybrid system successfully replaces mainstream RNG with deterministic state tracking (Leverage Track), resource commitment (AP Bidding), and strategic decision-making (PHT Intent), resulting in a combat engine that accurately and engagingly models the nuanced, high-stakes tactical dynamics of Liechtenauer's swordsmanship.


hroarr.com
The Onion - Basics of European Longsword: Part 4 - HROARR
Opens in a new window

hema101.com
Liechtenauer's longsword 101 - part 2: Overview of the system
Opens in a new window

ernstfechten.wordpress.com
The Problem With HEMA - Ernst Fechten - WordPress.com
Opens in a new window

fanatical.com
Real-Time with Pause Games | PC and Steam Keys - Fanatical
Opens in a new window

ernstfechten.wordpress.com
Liechtenauer's Long Sword – Ernst Fechten - WordPress.com
Opens in a new window

hema101.com
Liechtenauer's longsword 101 - Part 6: The five words
Opens in a new window

elegant-weapon.blogspot.com
An elegant weapon for a more civilized age
Opens in a new window

reddit.com
Is Lichtenauer's system a unique outlier, or are people interpreting it incorrectly? - Reddit
Opens in a new window

reddit.com
The Psychological state of "Flow" and game design : r/truegaming - Reddit
Opens in a new window

en.wikipedia.org
Rock paper scissors - Wikipedia
Opens in a new window

youtube.com
Taking the fencing out of it - Provoker/Taker/Hitter - YouTube
Opens in a new window

historicaleuropeanmartialarts.com
German Long Sword Fighting Techniques in HEMA
Opens in a new window

saladellatrespade.com
Head to Desk, Repeat: Explaining ROW to HEMA - Capitale Escrime Historical Fencing
Opens in a new window

reddit.com
New Combat System for TTRPG game : r/RPGdesign - Reddit
Opens in a new window

reddit.com
No roll to hit? : r/RPGdesign - Reddit
Opens in a new window

reddit.com
Combat system without damage or HP? : r/RPGdesign - Reddit
Opens in a new window

reddit.com
Combat system without HP and Attack Points : r/gamedesign - Reddit
Opens in a new window

reddit.com
What systems have impressed you with their injury and healing rules? : r/rpg - Reddit
Opens in a new window

gamebalanceconcepts.wordpress.com
Level 1: Intro to Game Balance
Opens in a new window

reddit.com
Best deterministic combat system? : r/boardgames - Reddit
Opens in a new window

reddit.com
Tactical TTRPGs with more deterministic outcomes : r/RPGdesign - Reddit
Opens in a new window

reddit.com
Interesting combat systems that aren't 'roll to hit, roll to damage'? : r/RPGdesign - Reddit
Opens in a new window

youtube.com
Longsword Winding - The Ultimate Guide to Liechtenauer's Secret Technique - YouTube
Opens in a new window

reddit.com
Systems with simultaneous combat : r/rpg - Reddit
Opens in a new window

enworld.org
TTRPGs with simultaneous instead of turn-based combat - EN World
Opens in a new window

reddit.com
What are some options for combat with no hit points? : r/RPGdesign - Reddit
Opens in a new window

reddit.com
Recommend a game with "Real Time and Pause" combat? : r/rpg_gamers - Reddit
Opens in a new window

reddit.com
How do you guys feel about the RNG based combat in Morrowind? : r/ElderScrolls - Reddit
Opens in a new window

roll20.net
Combat | D&D 5th Edition on Roll20 Compendium
Opens in a new window

ttrpg-games.com
Survive or Die: Mechanics That Make TTRPG Survival Feel Real
Opens in a new window

reddit.com
What Is Your FAVORITE TTRPG Mechanic? : r/rpg - Reddit
Opens in a new window

domainofmanythings.com
11 TTRPG Ideas So Cool You'll Want Them in Every Game
Opens in a new window

ttrpg-games.com
Top Strategies for Balancing Combat Encounters - TTRPG Games Directory
Opens in a new window

uxdesign.cc
Tabletop game design: 6 types of damage mechanics | by Sam Hollon | UX Collective
Opens in a new window

reddit.com
Thoughts on totally abandoning the HP system? : r/RPGdesign - Reddit
Opens in a new window

artofthesword.blogspot.com
HEMA games - Art of the Sword
Opens in a new window

youtube.com
Strong, Weak, and Indes - The Five Words Of Liechtenauer (1/3 ...
Opens in a new window
Defining the Core Concepts
I'm starting my research by focusing on the core HEMA (Historical European Martial Arts) concepts from the Lichtenauer tradition that will form the basis of the combat system. This includes defining the functional differences between Taker (Nehmer), Provoker (Locker), and Hitter (Schlager), as well as the mechanistic implications of Strong (Stark) and Weak (Swach) positions. Understanding these concepts is crucial for translating dynamic fencing ideas into static, turn-based rules.
Translating HEMA to RPG Rules
The central challenge is to translate real-time fencing principles—especially the crucial moment of the *Indes* (In the Instant)—into a deterministic, atomic-turn RPG mechanic. Since the system must avoid mainstream RNG (random number generation) or percentage chances, I am also investigating existing non-RNG combat systems. This will help structure how advantage, initiative, and damage are modeled using player prediction, simultaneous action selection (SAS), or resource management, rather than luck.
Next Research Steps
My immediate plan is to execute several lines of inquiry concurrently. I will analyze the provided YouTube channel for direct definitions of the Lichtenauer terms, while simultaneously performing broader research on the dynamics of Stark/Swach (Strong/Weak) and the strategic interaction flow of the Taker/Provoker/Hitter archetypes. Finally, I will research deterministic game mechanics to provide a robust framework for the proposed system designs.

Researching websites

hema101.com
Liechtenauer's longsword 101 - Part 6: The five words

hroarr.com
The Onion - Basics of European Longsword: Part 4 - HROARR

hema101.com
Liechtenauer's longsword 101 - part 2: Overview of the system

ernstfechten.wordpress.com
Liechtenauer's Long Sword – Ernst Fechten - WordPress.com

elegant-weapon.blogspot.com
An elegant weapon for a more civilized age

reddit.com
Is Lichtenauer's system a unique outlier, or are people interpreting it incorrectly? - Reddit

historicaleuropeanmartialarts.com
German Long Sword Fighting Techniques in HEMA

ernstfechten.wordpress.com
The Problem With HEMA - Ernst Fechten - WordPress.com

reddit.com
How do you guys feel about the RNG based combat in Morrowind? : r/ElderScrolls - Reddit

reddit.com
Interesting combat systems that aren't 'roll to hit, roll to damage'? : r/RPGdesign - Reddit

reddit.com
Tactical TTRPGs with more deterministic outcomes : r/RPGdesign - Reddit

reddit.com
Best deterministic combat system? : r/boardgames - Reddit

gamebalanceconcepts.wordpress.com
Level 1: Intro to Game Balance

reddit.com
The Psychological state of "Flow" and game design : r/truegaming - Reddit

reddit.com
Systems with simultaneous combat : r/rpg - Reddit

enworld.org
TTRPGs with simultaneous instead of turn-based combat - EN World

reddit.com
No roll to hit? : r/RPGdesign - Reddit

reddit.com
What are some options for combat with no hit points? : r/RPGdesign - Reddit

fanatical.com
Real-Time with Pause Games | PC and Steam Keys - Fanatical

reddit.com
Recommend a game with "Real Time and Pause" combat? : r/rpg_gamers - Reddit
Understanding Strong vs. Weak Dynamics
My initial research into Liechtenauer's Strong (*Stark*) and Weak (*Swach*) concepts has provided crucial insights. These terms describe not only parts of the blade but, more importantly, the leverage and positioning during a bind. The core principle is that the weaker opponent can often win by using their weakness strategically—either by winding their strong onto the opponent's weak or by leveraging the weakness to disengage quickly. The concepts of *Vor* (initial attack), *Nach* (defense/bind), and *Indes* (acting 'in the instant' based on the feeling of the bind) seem to form a strategic flow that must be captured in the combat system's turn structure.
Defining Functional Roles in Combat
I've started gathering information on the strategic roles of the Provoker, Hitter, and Taker, which are often associated with Meyer's fencing theory, but are functional analogs to Liechtenauer's tactical advice. The search results suggest that these roles describe the function of a strike: the Provoker forces a reaction, the Taker reacts to a provocation, and the Hitter delivers the decisive blow. This confirms that these are not static character classes but dynamic roles players can adopt turn-by-turn. Furthermore, I learned that Master Strikes rely on single-tempo actions, emphasizing the need for decisive, skill-based choices in the game design.
Initial Review of Deterministic Systems
To meet the requirement of avoiding RNG, I investigated non-RNG, simultaneous-action combat systems. I found examples of TTRPGs and video games that use 'Real-Time with Pause' or 'Simultaneous Combat' mechanics. A key insight for designing a deterministic system is that every action must have a meaningful effect beyond just dealing damage. Actions should focus on resource management, positioning, and tactical effects (like pinning, knocking back, or creating openings) since the success of the action is often guaranteed. This points toward a system where players commit actions simultaneously, and the outcome is resolved based on the interaction of those chosen actions.
Refining the Research Focus
My primary source of information, the specific YouTube channel, was not fully accessible in the first step. To address this, I am initiating targeted searches to find specific video links from 'The Historical Fencing Channel' that detail the Lichtenauer concepts. I will then analyze those videos to ensure the proposed system designs are grounded in the specific interpretations and teachings of that source, while synthesizing this with the general HEMA and deterministic game design principles already uncovered.

Researching websites

youtube.com
Strong, Weak, and Indes - The Five Words Of Liechtenauer (1/3) - YouTube

youtube.com
Longsword Winding - The Ultimate Guide to Liechtenauer's Secret Technique - YouTube

reddit.com
Systems with simultaneous combat : r/rpg - Reddit

enworld.org
TTRPGs with simultaneous instead of turn-based combat - EN World

reddit.com
No roll to hit? : r/RPGdesign - Reddit

reddit.com
What are some options for combat with no hit points? : r/RPGdesign - Reddit

fanatical.com
Real-Time with Pause Games | PC and Steam Keys - Fanatical

reddit.com
Recommend a game with "Real Time and Pause" combat? : r/rpg_gamers - Reddit

elegant-weapon.blogspot.com
An elegant weapon for a more civilized age

reddit.com
Is Lichtenauer's system a unique outlier, or are people interpreting it incorrectly? - Reddit

historicaleuropeanmartialarts.com
German Long Sword Fighting Techniques in HEMA

ernstfechten.wordpress.com
The Problem With HEMA - Ernst Fechten - WordPress.com

hema101.com
Liechtenauer's longsword 101 - Part 6: The five words

hroarr.com
The Onion - Basics of European Longsword: Part 4 - HROARR

hema101.com
Liechtenauer's longsword 101 - part 2: Overview of the system

ernstfechten.wordpress.com
Liechtenauer's Long Sword – Ernst Fechten - WordPress.com

reddit.com
How do you guys feel about the RNG based combat in Morrowind? : r/ElderScrolls - Reddit

roll20.net
Combat | D&D 5th Edition on Roll20 Compendium

reddit.com
Tactical TTRPGs with more deterministic outcomes : r/RPGdesign - Reddit

reddit.com
Best deterministic combat system? : r/boardgames - Reddit

gamebalanceconcepts.wordpress.com
Level 1: Intro to Game Balance

reddit.com
The Psychological state of "Flow" and game design : r/truegaming - Reddit
Core Mechanics Defined
I have successfully synthesized the core HEMA concepts into potential game mechanics. The Strong (*Stark*) vs. Weak (*Swach*) dynamic confirms the need for a **positional resource track or bind state** in the game, focusing on leverage and tactical positioning rather than simple strength. This duality is central to the Liechtenauer tradition, where the fencer can use their 'weakness' as an advantage to disengage or transition to another technique at the critical moment of *Indes* (in the instant).
Mapping Functional Roles to Actions
The Taker, Provoker, and Hitter roles strongly suggest a **Simultaneous Action Selection (SAS) matrix** is the ideal framework for the 'atomic turn.' These roles describe the *intent* of a strike (forcing a reaction, seeking a bind, or delivering a decisive hit). This model allows the turn resolution to be deterministic and strategic, where the player's predicted choice of action (e.g., Provoker) interacts decisively with the opponent's choice (e.g., Taker), replacing the need for random chance.
Designing Deterministic Consequences
Research into non-RNG combat systems validates that success is not determined by a 'to-hit' roll, but by the **consequences** of the action. This aligns perfectly with the lethality of HEMA, where the first clean hit often matters most. Instead of tracking traditional Hit Points, the system should likely model **variable outcomes** such as positional advantages, crippling states, or injuries based on resources or leverage, making every choice consequential.
Focusing on Source Material and System Design
I have successfully located a highly relevant video on the user-specified channel, 'Strong, Weak, and Indes - The Five Words Of Liechtenauer,' which is critical for grounding the design in the requested source. My next steps will analyze the content of this video to extract specific channel interpretations and then immediately move into the system design phase: formally modeling the Taker/Provoker/Hitter matrix and translating the Strong/Weak concept into a deterministic resource track.

Researching websites

reddit.com
What Is Your FAVORITE TTRPG Mechanic? : r/rpg - Reddit

ttrpg-games.com
Survive or Die: Mechanics That Make TTRPG Survival Feel Real

reddit.com
New Combat System for TTRPG game : r/RPGdesign - Reddit

ttrpg-games.com
Top Strategies for Balancing Combat Encounters - TTRPG Games Directory

youtube.com
Taking the fencing out of it - Provoker/Taker/Hitter - YouTube

en.wikipedia.org
Rock paper scissors - Wikipedia

artofthesword.blogspot.com
HEMA games - Art of the Sword

saladellatrespade.com
Head to Desk, Repeat: Explaining ROW to HEMA - Capitale Escrime Historical Fencing

reddit.com
What systems have impressed you with their injury and healing rules? : r/rpg - Reddit

uxdesign.cc
Tabletop game design: 6 types of damage mechanics | by Sam Hollon | UX Collective

reddit.com
Combat system without damage or HP? : r/RPGdesign - Reddit

reddit.com
Combat system without HP and Attack Points : r/gamedesign - Reddit
Strong vs. Weak Mechanics
My research confirms that the Strong (*Stark*) and Weak (*Swach*) concepts are fundamental to designing the system's core mechanic, particularly around the bind. This isn't about physical strength but about leverage, timing (*Indes*), and positioning. I have synthesized that the system must incorporate a mechanism where a player can intentionally choose a 'Weak' position to exploit an opening or disengage, thus turning a potential disadvantage into an advantage. This strongly supports the idea of a **resource or posture track** that shifts dynamically based on player choices.
Taker, Provoker, Hitter Interaction
The Taker, Provoker, and Hitter (PHT) roles provide the strategic layer for the system's turn-based action. These roles describe the *intent* behind the strike—whether to force a reaction, engage in the bind, or strike decisively. This reinforces my conclusion that the game turn should use a **Simultaneous Action Selection (SAS)** framework, where the interaction of Player 1's chosen role (e.g., Provoker) against Player 2's chosen role (e.g., Taker or Hitter) determines the outcome of the exchange deterministically.
Design Principles for Deterministic Combat
By studying existing non-RNG systems, I have solidified the design constraints: success is guaranteed, but the *consequence* is variable and tactical. This means player choices must manage resources and posture states (like advantage, leverage, or position) rather than rolling to see if they hit. This approach ensures that every atomic turn is meaningful and strategic, replacing chance with calculated prediction, which aligns well with the HEMA emphasis on single-tempo decisive actions (Master Strikes) and strategic positioning.
Preparing System Proposals
I have collected sufficient information on the HEMA concepts and the necessary non-RNG game design frameworks. My final steps will be to execute the remaining targeted searches for deeper system design elements, such as resource management and advantage tracks, and then synthesize all findings into the three distinct high-level combat system proposals, as requested.

Researching websites

reddit.com
What Is Your FAVORITE TTRPG Mechanic? : r/rpg - Reddit

domainofmanythings.com
11 TTRPG Ideas So Cool You'll Want Them in Every Game

reddit.com
New Combat System for TTRPG game : r/RPGdesign - Reddit

ttrpg-games.com
Top Strategies for Balancing Combat Encounters - TTRPG Games Directory

reddit.com
What systems have impressed you with their injury and healing rules? : r/rpg - Reddit

uxdesign.cc
Tabletop game design: 6 types of damage mechanics | by Sam Hollon | UX Collective

reddit.com
Thoughts on totally abandoning the HP system? : r/RPGdesign - Reddit

reddit.com
Combat system without damage or HP? : r/RPGdesign - Reddit

youtube.com
Taking the fencing out of it - Provoker/Taker/Hitter - YouTube

en.wikipedia.org
Rock paper scissors - Wikipedia

artofthesword.blogspot.com
HEMA games - Art of the Sword

saladellatrespade.com
Head to Desk, Repeat: Explaining ROW to HEMA - Capitale Escrime Historical Fencing

youtube.com
Strong, Weak, and Indes - The Five Words Of Liechtenauer (1/3 ...
Strong vs. Weak as Tactical Advantage
I've confirmed that the Strong (*Stark*) vs. Weak (*Swach*) dynamic is fundamentally about **leverage and timing** in the bind. This concept is crucial for modeling tactical advantage in the system. The *Indes* (in the instant) principle confirms that the player's primary task in the system should be to immediately assess the opponent's current state (Strong or Weak) and act upon it. This strongly supports using a deterministic resource or status track to model shifting leverage, making player choices—rather than chance—determine whether a strike is effective.
Taker, Provoker, Hitter Interaction Matrix
The research on the Taker, Provoker, and Hitter (PHT) roles provides the perfect structure for the system's 'atomic turn.' These three roles can form the foundation of a **Simultaneous Action Selection (SAS) Rock-Paper-Scissors matrix**, where the outcome of the turn is deterministic and dictated by how one player's chosen intent (e.g., Provoker, forcing a reaction) interacts with the opponent's intent (e.g., Taker, seizing the blade). This model meets the requirement for meaningful decisions in an active pause system.
Modeling Deterministic Outcomes
I have verified that non-RNG combat systems often model consequences through **resource management, progress clocks, and distinct injury tables**, rather than relying on chance to hit or traditional Hit Points. This is a critical finding, confirming that we can create a 'realistic' feel where a clean hit is consequential (fatal or crippling) and where tactical advantage (Strong/Weak) is managed as a depletable resource. This allows for system designs that emphasize resource control and tactical prediction.
Synthesizing System Proposals
I have gathered sufficient information on HEMA principles, simultaneous action mechanics, and deterministic consequence modeling. All the core research components are now in place. My next and final action is to synthesize these findings into the three distinct high-level combat system proposals, providing options based on Resource Management (Strong/Weak focus), a Prediction Matrix (Taker/Provoker/Hitter focus), and a Hybrid Stance/State Flow system.