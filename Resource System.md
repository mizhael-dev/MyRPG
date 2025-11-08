## Resource consumption  
   - Each action, atttack and ability consumes resources based on it's type: `MP`, `Stamina`, and `Focus`.
     - Attack with weapons and physical consume `Stamina`
     - Attack with abilities and spells consume `MP` and some `Stamina`
     - Every action that consumes `Stamina` or `MP` also consumes `Focus` resource **Cost Calculation:** **Focus cost = MP cost + Stamina cost.**
     - Every action that consumes `Focus` resource also consumes `Daily Fatigue` resource. **Cost Calculation:** **Daily Fatigue cost = MP cost + Stamina cost.**

---

# Character Attributes and Resources

---

## **Resource System**
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
