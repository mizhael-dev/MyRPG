# Pause system

Pause system is introduced to give actors a chance to act.

## When Auto pause should happen:

1. When a telegraph is revealed, the opponent can act:
   - PC reveals telegraph → Pause → NPC can select action
   - NPC reveals telegraph → Pause → PC can select action
2. When recovery phase ends:
   - PC finishes recovery → Pause → PC can select next action
   - NPC finishes recovery → Pause → NPC can select next action
3. When one of the actors is dead hp falls <= 0. (This will later by end of fight and handed differently.)
   - Fighter HP <= 0 → Pause → Combat ends
