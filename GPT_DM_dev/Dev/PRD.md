## Overview
This document describes the product that we will build.
We need to specify data formats

### About GPT DM game
This game is a narrative rich text based RPG game with tabletop rpg inspired combat and skill difficulty checks including randomization.

AI Game Master creates a fictional setting (world and a story) in which plaer acts out the role of a single character.
The Player describes characters' actions, intententions, conversations through text or chooses one of 4 options provided by AI Game Master. The Player does not always speak exclusively in-character. The Player is deciding and describing what actions their characters will take within the rules of the game.

The Players describe their characters' actions, and the AI Game Master responds by describing the outcome of those actions.
These outcomes are determined by the setting and the AI Game Masters common sense.
Most actions are straightforward and immediately successful. For example, if a player has their character look around a room, the AI Game Master will describe the room; if they have their character leave, the AI Game Master will describe whatever they encounter outside the room.
The outcomes of some actions are determined by the rules of the game. For example, while looking around the room, a character may or may not notice an important object or secret doorway, depending on the character's perception skill.

Determining the outcome usually involves randomization and adjusting the result for the character's statistics (attributes and skills) and environmental factors to see whether the action was successful. Typically, the higher the character's score in a particular attribute, the higher their probability of success.

RPG settings includes challenges for the player character to overcome through play, such as traps to be avoided, rulers to be courted, or enemies to be fought. Many game sessions contain moments of puzzle solving, negotiation, chases, and combat. Frequently, this involves interacting with non-player characters (NPC), other denizens of the game world, which are played by the AI Game Master.

The Player have the freedom to improvise **within the rules of the game system and the fictional world**, and their choices shape the direction and outcome of the game.

Combat is based on a system with numeric character statistics and randomization summarized by a vivid narration.
Player actions require skill Difficulty Checks involving randomization that will determine how success the action was.
Action difficulty is confronted with player statistics (attributes and skills) to determine how successful the action was and a vivid description of action and it's outcomes is provided.

---

### AI Narrative
The narrative is powered by AI Game Master.

- AI will use configuration files from database as a guideline in order to act as Game Master and generate creative adventures
- AI will use Players text inputs describing their character's action and the AI Game Master responds by describing the outcome of those actions
- When needed AI will send request to local Python Game Engine to handle mechanical, numerical side of the game. AI Game Master will recieve back a response from Python Game Engine with the result of the test and characters' numeric status update. AI Game Master will use these results as an input and provide approperiate narrative.


### Python Game Engine 
Game Engine is a formal system of rules and calculations that invlove randomization.

- When prompted by AI Game Master Python code will execute all calculations and mechanics of the game and pass them to AI Game Master

### High level logic overview

1. AI Game Master will bulid a narrative
2. The Player will take an action
   
   1. If an action starts combat:
      1. GPT DM will send to Python Game Engine parameter's stating RequestType, Attacker's identifier and Defender's identifier.
      2. Python Game Engine will read current status of Player Character from Character Sheet and starting status of NPC from Bestiary
      3. Python Game Engine will send back to AI Game Master: Combatant's Name, Skills, Skill Values, Resources, Resource Values, Equipment, Equipment modifiers
   
   2. If an action is combat oriented (attack or action targeting other character):
      1. AI Game Master will send to Python Game Engine parameters stating RequestType, Attacker's attack skill used, Attacker's identifier, Defender's identifier and Enviromental Factor Name, Enviromental Factor Modifier (integer)
      2. Python Game Engine will
         1. calculate attack hit Difficulty Check, based on rules and involved characters' numeric statistics (attribute and skill)
         2. Involve randomization by rolling a 100 sided dice, random.randint(1,100)
         3. Compare random roll with Difficulty Check. If roll is higher than Difficulty Check the attack action is a success. Otherwise it is a failure
         4. Calculate impact on current character status (HP minus damage)
         5. Send a response to AI Game Master that will include Check Result (Succes, Fail), current status of Combatant: Name, Skills, Skill Values, Resources, Resource Values, Equipment, Equipment modifiers
      
   3. If an action requires a Difficulty Check against Player Character's skills:
      1. AI Game Master will send send to Python Game Engine parameters stating: RequestType, Character Identifier, skill used, Difficulty Check  Threshold for success (integer), Enviromental Factor Name, Enviromental Factor Modifier (integer)
      2. Python Game Engine will
         1. Read Character's skill value
         2. Involve randomization by rolling a 100 sided dice, random.randint(1,100)
         3. Compare (Character skill value + roll) with Diffiulty Check Threshold for success. If roll is higher than Difficulty Check the action is a success. Otherwise it is a failure.
         4. Send a response to AI Game Master that will include Check Result (Succes, Fail)
   
   4. If an action is straightforward success, it is not sent to Python Game Engine and resolved by AI Game Master

3. AI Game Master will create a narrative describing in-game outcome of the action and display it to the Player 

Example:
1. AI Narrative: Player Character (PC) enters a quartermaster's room. It's pitch dark inside.
2. Player action: search the room for hidden valuables
3. AI Game Master: searching the room requires Perception Skill Difficulty Check. Threshold for Success is 10. Enviromental Modifier
   1. Send to Python (RequestType: DC,  CharacterIdentifier: PC, Skill: Perception, DC: 20, EnvMod: dark, EnvModValue: -3)
4. Python Game Engine will run a code:
   1. If RequestType="DC" then read CharacterSheet table
   2. In CharacterSheet table select skill_Value as Skill where skill = "Perception" and characterIdentifier="PC". Result: Skill,10
   3. if Skill + random.randint(1,100) > DC then "Success" else "Fail". Rolled 90. 10+90 > 20 means it's a Success.
   4. Send Response = "Success", to AI Game Engine
5. AI Game Engine recieves response "Success" and displays to the Player: "You have found a secret stash under the table with **secret plans** in it"


### Database

The database will contain files and tables that will be used to help maintain consistency and track changes.
Files/tables in the database will be automatically updated based on actions taken and story progression.

files/tables:
- CharacterSheet
- Items
- Bestiary
- Adventure log
- World info (factions, people, locations)

### Requirements
1. **Consistency** that helps maintain user's immersion

#### CharacterSheet
  - characters, once introduced, maintain their set charactersitics unless there is an explicit request to change them:
    - CharacterIdentifier
    - name
    - appearance
    - role
    - faction
    - personality
    - preferred combat tactics
    - motivation
    - attributes
    - skills
    - resources
    - status effects
    - equipment
    - magic
    - inventory
    - knowledge of events (key to link to adventure log)
  - Characters cannot change their CharacterIdentifier
  - Characters can change their: name, appearance, role, faction, personality, motivation, knowledge of events thorought narrative progression. This can be a lot of text and hard to remember for user, it needs to be stored in long term memory after every, mission, adventure, story arch.
  - Characters can change their attributes, derived attributes and skill values after each mission, adventure, story arch. It needs to be stored in long term memory after every, mission, adventure, story arch.
  - Character Resources (HP, Stamina, MP, Focus, Daily Fatigue) and active status effects on character are the most dynamic and have no long term implications. They can be handled in memory and there is no need to update them in long term memory or the character sheet.

#### Locations
 - Places, once introduced, miantain their set characteristics:
   - name
   - goegraphic location
   - description
   - landmarks
   - points of interest (other locations)
   - 
#### Factions
 - Factions, once introduced, maintain their set charactersitics:
   - name
   - description
   - ideology
   - strategic objectives
   - recent events related to them


---

### Starting a New Session
1. You would need World.md to know what is the world setting, locations in it, factions, recent world events, who the most important people are. It would be good to combine World.md with quotes showing sample of the tone I want you to use when communicating with player (currently tone sample is in 'Example of Storytelling.md' but it's too many tokens)
2. You would need an event log to know what is my character's story until now and where are they right now
   - You would need Player character information to know who they are and what their stats are to be consistent with previous session
     - First time opening a character you might need to calculate derived stats
     - First time opening a character you might want to know what are the descriptions and stats of items, magic, equipment a character has
     - relevant item details will need to be loaded
   - You would need World.md to know the details about location and be able to describe in a way that's consistent with previous session
   - you would need to know narrative details about all important NPC
3. You will need important characters (NPCs) in that location to describe their appearance and to act as them
4. You would offer continuation of Unresolved Plotlines from previous sessions or a new mission
5. The player will make a choice and you will generate a new adventure with possible story implications and mission objectives

---

### Going through Adventure
1. New adventure will start with a journey. A generic road, woods, mountai pass etc. No need to be consistent. The player will most likely not come here again unless the location is deemed important and added as important place to World.md
2. There can be a conversation about world with either an important character or an NPC like a traveling merchant
3. A combat might start
   1. you will need character sheet with statistics
   2. you will need python codes with game rules and calculations
   3. you will need bestiary or important characters to get NPC combat statistics, their descriptions and combat behaviour. You will need to know what are the stats and desciptions of items they have
   4. You will need to use python codes multiple times to simulate combat between combatants
      - you will need to calculate hit chance, damage, manage combat resources of all combatants
4. A combat will conclude. Looting will start. You will Player characters inventory
5. You will make an event log to save by user in long term memory. smaller event logs need to be stored in memory until the end of current,mission, adventure, story arch. Then at the end a full mission, adventure, story arch event log will be created.
6. Player will arrrive at their destination. You need to create details of a new location
   - You will need to make an updete to locations to save by user in long term memory at the end of session.
7. You will generate a mission details. There can be a puzzle, conversation, challange, chase, combat. (Some of that or all of that)
8. Player will take actions. If it's not combat you will run python code to decide the outcomes of actions with Difficulty Checks (DC)
9. A mission will be completed, new loot found, new information acquired.
   - You will need to udpate Player character sheet and create an Event log
10. Player will go back to starting location.
    - You will need World.md and important characters (NPCs) in that location to recall their descriptions
    - You will need important characters (NPCs) in that location to describe their appearance and to act as them
11. You will debrief the player by talking to quest giver. Review all event logs from the adventure separately. But also you will tie them together into bigger narrative.
12. You will create a final complete event log to save by user in long term memory for future session. It will contain Unresolved Plotlines to help start the next session.
13. All your long term memory sources should be updated to include new information generated during the session. Basically, everything aside from the tone of adventure, global world settings and sample of desired writting should be updated by the user and uploaded to you before the next adventure. This is a big request we need to resolve in user friendly way, maybe a database is better than multiple files? (I am no expert, propse what you think is best practice)