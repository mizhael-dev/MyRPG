  Critical Contradictions Found:

Weapon Parry defined twice with different stats - need to clarify which is correct (or if they're meant to be 2 different skills)
`ANSWER:` Version 2 is correct change the version 1

Max Stamina formula conflict:
`ANSWER:` Constitution × 2 is correct update incorrect mention


"Turn" terminology unclear - Resources regenerate "per turn" but combat uses 100ms ticks. What is a turn in milliseconds?
`ANSWER:` Good point make it a variable <regeneration_rate> instead of "per turn". I don;t know what it is now. might be 1000ms but will need rebalanding for sure. 

Combat Skills JSON Format
`ANSWER:` Let's use json. make a note of that in the PRD and provide a link to a json file that we will use. remove the skills that are there currently to streamline PRD. Separate files per skill will make it easier for me to start with, let's do that. Put them all in a separate folder "CombatSkills"



## GAPS & MISSING ELEMENTS

### Combat Skills Need:
1. **Telegraph definitions** - All skills have empty Telegraph fields (Foot, Shoulders, Weapon position, Stance)
`ANSWER:` see if there is anyting useful in Combat3 md files to populate these.
2. **More combat skills** - Only have 2 attacks + 1 defense defined
`ANSWER:` Yes, we need more even for a test. I need 5 attacks and few defense options. See Combat3 md files for more examples of skills and recommend your own.
3. **Movement skills** - How does movement work in atomic turns?
`ANSWER:` for now I want to focus on skills. movement as in combat distance will be important later, distance and movement in combat will have to be calculated at atomic level by the system. also tactical map movement and positioning will be important, but that later. update PRD
4. **Magic/spell combat skills** - No spell combat actions defined yet
`ANSWER:` Magic and spells are for later. update PRD
5. **Damage calculation** - How is damage determined?
`ANSWER:` For first prototype 1 clean hit and you are dead. 3 hits of any kind and you are dead.
6. **Armor mechanics** - How does armor interact with damage/combat?
`ANSWER:` For later. update PRD

### JSON Format:
- Currently all combat skills are in Markdown
- Need to convert to JSON for data-driven implementation
`ANSWER:` Yes, do that

### Gameplay Systems:
- **Enemy AI behavior** - How do NPCs make decisions in atomic turn system?

- **Positioning mechanics** - How does grid/hex positioning work?
`ANSWER:` This will come later but might impact your decision about tech stack. The idea is that movement on tactical map will be also time based on atomic turns. At first it will be one tile movement at normal speed, 2 tiles running, 3 tiles sprinting. Colissions will need to be resolved.
- **Range mechanics** - How is weapon range calculated and enforced?
`ANSWER:` For now it is not. I want the core mechanic first and this later. Update PRD
- **Line of sight** - How does visibility/targeting work?
`ANSWER:` For now it is not. I want the core mechanic first and this later, even after Range mechanics and movement. Update PRD


### Questions for You:

1. **Telegraph visibility:** How will players "see" telegraphs? Visual cues on character models? UI indicators? Both?
`ANSWER:` UI indicators are easier for now. We can use manga comics like panels that will show a leg and big text "Foot Back"
2. **Cognitive load:** With telegraphs revealing at 10%, 20%, 40%, 60%, 80%, 95% - will players be overwhelmed tracking all this information?
`ANSWER:` This is a good point. That is why the UI is so important and why pause should only trigger when a meaningful information that is changing something is revealed. We will test it out.
3. **Learning curve:** How will players learn to recognize telegraphs? Tutorial? Practice mode?
`ANSWER:` automated system will tell them what are possible actions the enemy is making and their probability. e.g. "foot back" is a first telegraph for Horizontal Slash and Thrust but not for Overhead Strike, Upward Striket, Diagonal Slash. Chances screen will show 50% Swing and 50% Thrust after first telegraph. Then the Timebar_NPC_seen_by_PC will show min time as Thrust and max time as Horizontal Slash.

4. **Multi-combatant scenarios:** How does the pause system work when 4+ characters are acting simultaneously?
`ANSWER:` I don't have it well thought out yet. For now I will focus on duels. My general idea is that if PC is not focused on another enemy they will see less and will get less telegraph pauses. NPC will get as many pauses as the Player.

5. **AI decision-making:** How will enemy AI decide when to commit to actions given the atomic timeline?
`ANSWER:` I don't know yet. We will find a set of rules depending on the type of enemy and their combat experiance. For that we need to know how the system works in rpactice. I will play both sides for the time being.
