# Defensive Actions

## General idea

All actions need to have telegrpahs
All actions need to have windUp duration, a time needed to prepare.
For attack actions commited means that they are stuck in the motion. Can only be broken by Emergency Defense.
For defense actions active means that the defense is ready, it will trigger automatically at impact if it happens within the time window. If no impact happens user will go into recovery after the active duration passes. If impact happens user will go into recovery right after impact.

### 1. Emergency Defense - "Cover" / "Copertura"

Last resort action that can be used at any point in defense and attack.
**Windup:** Very Fast
**Recovery:** Slow
**Description:** A desperate last-moment reaction when you've misread the attack or reacted too late. The fighter doesn't have time for proper technique - they're just trying to get _something_ between themselves and the incoming blade, or pull back vital areas. This includes throwing up the sword awkwardly to absorb impact (not a proper block), turning the body to take a hit on armor/shoulder instead of face/chest, pulling back frantically while raising arms, or half-stepping backward while bringing sword up.
**When Available:** ANY time - as long as you have 0.2s before opponent's attack lands
**Requirement:** None
**Result:** Takes reduced damage (chip damage), breaks timing/balance, leaves fighter in poor position. No counterattack opportunity. Longest recovery time after defending.
**Stamina Cost:** Low (it's reflexive)

---

### 2. Move Backwards - "Retreat" / "Void"

**Windup:** Fast
**Recovery:** Medium
**Description:** Step or leap backward, maintaining guard but not engaging blade. Creates distance to reset spacing and break opponent's rhythm. Does NOT interrupt attacker's combo - they can continue forward with next strike if they have the stamina and distance. This is explicitly NOT a parry - you're not engaging the blade at all, just moving out of range.
Used whenof attack type but see commitment coming. When stamina is low and can't afford risky defense. To bait opponent into overextending.
**When Available:** ANY time - as long as you have 0.6-0.8s before opponent's attack lands AND enough space behind you to retreat
**Requirement:** None
**Result:** Attack misses. Does NOT interrupt attacker's combo. No counter opportunity.
**Stamina Cost:** Low-Medium

---

### 3. Parry - "Block"

**windUp:** Medium
**Recovery:** Fast
**Description:** The bread-and-butter defense. Fighter properly intercepts the incoming attack with their blade, meeting it with structure and intention. Strong of your blade meets weak of opponent's blade on the correct line, giving mechanical leverage advantage. The swords clash, forces are redirected, both fighters maintain reasonable positioning. This is what happens most in real sword fighting - controlled blade contact that neutralizes the attack without creating a major advantage for either side.

**Requirement:** need to identify and declare correct line based on attack opponent is performing. resolved on impact. On opponents with amateur skills it is better to use Deflection.

- **Diagonal Slash** → diagonal
- **Overhead Strike** → high
- **side_slash** → horizontal
- **Thrust** → center
- **upward_strike** → low

**Result:** Attack fully stopped, weapons clash. Moderate recovery. No immediate counter window but you have slight advantage.
**Stamina Cost:** Medium (absorbing force)
**Requirements:** Must parry correct line

---

### 4. Deflection - "Counter" / "Riposte"

**windUp:** Medium
**Recovery:** No recovery! This is the main benefit.
**Description:** A perfectly timed, minimal-effort deflection that redirects the opponent's attack away from the body while simultaneously creating an opening. A cut parry that sweeps the opponent's blade aside while simultaneously positioning your point for the riposte. Instead of meeting force with force, the skilled fighter uses precise blade angle and timing to guide the enemy's weapon offline while maintaining their own advantageous position. Minimal blade contact, maximum redirection. Uses angles rather than force. The opponent's blade slides harmlessly past while their body is exposed.

**Requirement:** need to identify and declare correct attack the opponent is performing. Resolved on impact.

- **Diagonal Slash** → diagonal
- **Overhead Strike** → high
- **side_slash** → horizontal
- **Thrust** → Center
- **upward_strike** → Low

**Gameplay Mechanic:**

- Player selects Deflection + chooses specific attack (Overhead/Horizontal/Thrust/Rising/Diagonal)
- Commits during Phase 1-3
- If guess correct AND timing right = Perfect deflection, riposte window
- If guess wrong = Blade positioned on wrong line, takes full hit
- If too early = Opponent reads telegraph, uses Feint to change attack
- If too late = Degrades to Emergency Defense

**Result:** Attack neutralized with minimal effort, opponent off-balance or overextended, immediate counterattack opportunity (riposte window), defender gains initiative. Shortest recovery time.

**Stamina Cost:** Low (efficiency through technique)

**Requirements:** Must correctly predict attack type AND direction, perfect timing window

---

## Special skill

### 5. Feint - Attack Morphing (Attacker Action)

**Description:** Attacker sees defender committing to specific defense (via telegraph reading), changes attack mid-motion. Feints are techniques where the attacker threatens one line then attacks another, forcing the defender to adjust their parry. This represents the tactical cat-and-mouse game of reading and counter-reading.

**Requirement:** New attack needs to be on another line.
**When Available:** Before commitement phase starts

**Execution Timing:**

- Recognition: 0.0-0.1s (reading defender's telegraph)
- Adjustment: 0.2-0.3s (changing attack angle/type mid-motion)
- Completion: Normal attack timing for new attack type (but slightly slower)

**Line System:** Changes from original attack line to different line mid-motion

**Outcome:**

- If attacker reads defender's telegraph correctly and morphs in time: New attack bypasses defender's prepared defense
- Defender must react with Emergency Defense or take hit
- If attacker misreads: Morphed attack is weaker, awkward, and more easily parried

**Stamina Penalty:** +30-50% stamina cost (changing momentum mid-motion is exhausting)

---

## Attacker's Emergency Cancel

### Emergency Defense (Attacker becomes Defender)

- Attacker recognizes immediate danger (defender's threatening counter-action)
- Aborts attack, throws up emergency guard
- Takes no damage but wastes all attack stamina, terrible position, Slow recovery

---

## **The Line System Future-Proofing:**

- New attacks can be added with their own line definitions
- Defense mechanics stay consistent: Parry blocks the line, Deflection predicts specific attack on that line
- Creates rock-paper-scissors depth: Right read on wrong line vs Wrong read on right line vs Perfect read
