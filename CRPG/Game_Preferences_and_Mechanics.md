
Always use Python to do calculations

**ALWAYS verify that player's requested actions align with documented skills, abilities, or spells in the character sheet before proceeding.**
If a player requests an action beyond their abilities:
-  Explain why the action is not possible.
-  Suggest an in-character alternative.

## Attack Hit Chance
Attack Hit or miss is decided by a single d100 dice roll

**accuracy lowers the difficulty of hitting** by **reducing the threshold needed for success**.

---

### Succesfull Hit Threshold Formula:
1. **Base Hit Modifier**: 75
2. **Modifiers**:
   - **Add** Attacker's **Agility** and **Accuracy** (boost hit chance).
   - **Subtract** Defender's **Agility** and **Evade** (reduce hit chance).
   - **Adjust** for **Environmental Factors** (e.g., poor visibility reduces hit chance).

3. **Calculation**:
   - Roll a d100. If the roll is **equal to or above HT**, the attack hits.
   - **Succesfull Hit Threshold (HT)** = d100 roll is equal or higher than ( 100 - Base Hit Modifier + Attacker's Agility + Accuracy - Defender's Evade - Environmental Factors)

---

### Example:
Mizhael (Agility: 10, Accuracy: 10) attacks a rabid dog (Evade: 12) on uneven ground (-2):
- Base Chance = 75%
- Modifiers = \( 75 + 10 + 10 - 12 - (-2) = 85 \).
- **Hit Threshold** = \( 100 - 85 = 15 \).

Roll a d100:
- If the roll is **15 or above**, the attack hits.
- Rolls below 15 miss.

---

### Explanation:
- **Accuracy and Agility** lower the threshold, making hits more likely.
- **Defender's Evade** raises the threshold, making hits harder.
- Higher rolls are better

--

## Attack Damage Calculation:
1. **Attacker's Base Skill Damage**: simple attack is 0
2. **Modifiers**:
   - **Add** Attacker's Weapon Damage and (0.1 * Attacker's Strength Attribute).
   - **Subtract** Defender's **Armor Damage Reduction**.
   - **Adjust** for **Environmental or situational bonuses or penalties.**

3. **Calculation**:
   - Roll a d100. If the roll is **equal to or above HT**, the attack hits.
   - **Succesfull Hit Threshold (HT)** = d100 roll is equal or higher than ( 100 - Base Hit Modifier + Attacker's Agility + Accuracy - Defender's Evade - Environmental or situational bonuses orpenalties.)


---

## **Success Scaling**
1. **Critical Success (Roll exceeds by 50+):** Exceptional results, often with bonuses or added effects.  
2. **Full Success (Roll meets or exceeds Difficulty by 25+):** As intended, avoiding major complications.  
3. **Partial Success (Within 5 points below Difficulty):** Succeeds with drawbacks or reduced effectiveness.  
4. **Failure (Falls below Difficulty):** No effect; resources are consumed, and potential penalties occur.  

---

## Resource consumption  
   - Each action, atttack and ability consumes MP, Stamina, and Focus based on its type.
     - Attack with weapons and physical skills have Stamina Cost
     - Attack with abilities and spells consume MP and some stamina
     - Every action that consumes Stamina or MP also consumes Focus resource **Cost Calculation:** **Focus cost = MP cost + Stamina cost.**
     - Every action that consumes Focus resource also consumes Daily Fatigue resource. **Cost Calculation:** **Daily Fatigue cost = MP cost + Stamina cost.**
     - Success or failure impacts resource use and outcomes.  

## Difficulty checks
Actions that are not combat attacks and combat abilities targeting opponet's directly are checked for success against DM assigned difficulty checks (DC)

### Difficulty check formula
Core Attribute or Sk

### Difficulty check value guidelines
Adjust roll difficulty depending on your assessment of tasks difficulty:

- **Very Easy (≤15):** Success is nearly guaranteed unless the character is actively impaired.
- **Easy (16–30):** Simple challenges, suitable for straightforward tasks with minimal risk.
- **Medium (31–60):** Balanced challenges where success depends on preparation and skill.
- **Hard (61–90):** Significant difficulty, requiring strong strategy or high rolls to succeed.
- **Very Hard (91+):** High-risk, complex challenges where failure is likely without specialized skills or advantages.


-----------

# Character Attributes and Resources

---

## **Resource System**
1. **MP (Magic Points):**  
   - **Maximum MP:** Determined by Magic Attribute × 2.  
   - **Regeneration:** Fully replenished outside of combat via rest or meditation. Can regenerate 5 per turn in combat with a successful concentration test (Base Difficulty 25).  
   - **Exhaustion Penalty:** Casting with no MP drains HP (1 HP per 1 MP used).  

2. **Stamina (Physical Energy):**  
   - **Maximum Stamina:** Equal to the Constitution Attribute.  
   - **Regeneration:** Fully replenished outside of combat via rest. Regenerates **1 per turn** during combat.
   - **Exhaustion Penalty:** Taking actions with no Stamina drains HP (1 HP per 2 Stamina used). 

3. **Focus (Mental Clarity):**  
   - **Maximum Focus:** Equal to the Willpower Attribute.  
   - **Regeneration:** Fully replenished outside of combat via rest. Regenerates **2 per turn** in combat.  
   - **Cost Calculation:** **Focus cost = MP cost + Stamina cost.**
   - **Exhaustion Penalty:** Taking actions with no Focus drains HP (1 HP per 2 Focus used).  
   - 
4. **Daily Fatigue:**  
   - **Maximum Daily Fatigue:** Equal to the Willpower Attribute multiplied by 5.  
   - **Regeneration:** Fully replenished outside of combat via long rest (sleep) for at least 6 hours.
     - No regeneration occurs during short rests or meditation; those actions restore only MP, Stamina, and Focus.
   - **Cost Calculation:** **Daily Fatigue cost = MP cost + Stamina cost.**
   - **Exhaustion Penalty:** Taking actions with no Daily Fatigue drains HP (1 HP per 5 Daily Fatigue used).  
---

## Core Attributes

### Agility Attribute

#### Agility Attribute in combat
Agility Attribute is added to Accuracy and Evade

### Speed Attribute 
Speed Attribute indicates how fast a character is.

#### Speed Attribute Table

This table defines the effect of Speed attribute for characters, grouped in ranges of 5 (e.g., from 1 to 5, from 6 to 10).
**Description:** It incudes descriptions to give context how fast the character is.
**Actions per turn:** Dictates how many actions a character can take compared to other characters involved in combat.
**Top Speed Sprinting (km/h):** It includes speed in km/h to get a better sense of the travel speed.
**Top Speed Distance Traveled in 1 Second (m):** The table also includes the distance traveled in 1 second, calculated based on the sprinting speed. Distance Traveled in 1 second is useful for DM, to decide how far characters can reposition in combat.

| Speed from | Speed to | Description                                               | Actions per turn | Top Speed Sprinting (km/h) from | Top Speed Sprinting (km/h) to | Top Speed Distance Traveled in 1 Second (m) from | Top Speed Distance Traveled in 1 Second (m) to |
| ---------- | -------- | --------------------------------------------------------- | ---------------- | ------------------------------- | ----------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| 1          | 5        | Children, elderly, sick.                                  | 0.5              | 2.0                             | 10.0                          | 0.56                                             | 2.78                                           |
| 6          | 10       | Below Average Adult Human                                 | 1                | 12.0                            | 20.0                          | 3.33                                             | 5.56                                           |
| 11         | 15       | Average Adult Human                                       | 1.5              | 22.0                            | 30.0                          | 6.11                                             | 8.33                                           |
| 15         | 20       | Sprinting Dog, Exceptional Adult HumanAverage Adult Human | 2                | 32.0                            | 40.0                          | 8.89                                             | 11.11                                          |
| 21         | 25       | Superhuman Speed. (Usain Bolt).                           | 2.5              | 42.0                            | 50.0                          | 11.67                                            | 13.89                                          |
| 26         | 30       | Horse gallop speed.                                       | 3                | 52.0                            | 60.0                          | 14.44                                            | 16.67                                          |
| 31         | 35       | Horse gallop speed.                                       | 3.5              | 62.0                            | 70.0                          | 17.22                                            | 19.44                                          |
| 36         | 40       | Horse gallop speed.                                       | 4                | 72.0                            | 80.0                          | 20.0                                             | 22.22                                          |
| 41         | 45       | Superhorse speed threshold.                               | 4.5              | 82.0                            | 90.0                          | 22.78                                            | 25.0                                           |
| 46         | 50       | Superhorse speed                                          | 5                | 92.0                            | 100.0                         | 25.56                                            | 27.78                                          |
| 51         | 55       | Above 100 km/h.                                           | 5.5              | 102.0                           | 110.0                         | 28.33                                            | 30.56                                          |
| 56         | 60       | Above 110 km/h.                                           | 6                | 112.0                           | 120.0                         | 31.11                                            | 33.33                                          |
| 61         | 65       | Above 120 km/h.                                           | 6.5              | 122.0                           | 130.0                         | 33.89                                            | 36.11                                          |
| 66         | 70       | Above 130 km/h.                                           | 7                | 132.0                           | 140.0                         | 36.67                                            | 38.89                                          |
| 71         | 75       | Above 140 km/h.                                           | 7.5              | 142.0                           | 150.0                         | 39.44                                            | 41.67                                          |
| 76         | 80       | Faster than an arrow.                                     | 8                | 152.0                           | 160.0                         | 42.22                                            | 44.44                                          |
| 81         | 85       | Above 160 km/h.                                           | 8.5              | 162.0                           | 170.0                         | 45.0                                             | 47.22                                          |
| 86         | 90       | Above 170 km/h.                                           | 9                | 172.0                           | 180.0                         | 47.78                                            | 50.0                                           |
| 91         | 95       | Above 180 km/h.                                           | 9.5              | 182.0                           | 190.0                         | 50.56                                            | 52.78                                          |
| 96         | 100      | Above 190 km/h.                                           | 10               | 192.0                           | 200.0                         | 53.33                                            | 55.56                                          |
| 151        | 155      | Faster than any arrow.                                    | 15               | 302.0                           | 310.0                         | 83.88                                            | 86.11                                          |
| 301        | 305      | Speed of sound at sea level (Mach 1).                     | 30               | 602.0                           | 610.0                         | 167.22                                           | 169.44                                         |
| 651        | 655      | Faster than a bullet                                      | 65               | 1302.0                          | 1310.0                        | 361.66                                           | 363.88                                         |**


 #### Speed Attribute in combat
 Dictates how many actions a character can take compared to other characters involved in combat.
 Dictates how far a character can reposition.

 ## Character Stats Progression
 - Completing missions will award proficiency or core attribute points. 
   - Depending on type of mission and what skills were used Player will increase relevant stats. It's DM's discretion to award this. (Example: After completing a stealth mission where character was sneaking and maaged to stay undetected, DM might award +1 stealth.)
 - Training opportunities will occasionally happen. They are exhausting and will spend all daily fatigue to complete. They will give +1 to statistic