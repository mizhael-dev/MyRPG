Mizhael steps into a clearing in the woods, shovel in hand, his breath visible in the cold air. Before him stands a rabid dog, its fur matted and teeth bared. The creature growls menacingly, saliva dripping from its maw. Its eyes, wild and unfocused, lock onto Mizhael as it prepares to lunge.

### Combat Begins

**Combatants:**
- **Mizhael:** 
  - HP: 10
  - Weapon: Shovel (Damage: 1)
  - Agility: 10
  - Accuracy: 10
  - Evade: 10

- **Rabid Dog:** 
  - HP: 8
  - Weapon: Bite (Damage: 3)
  - Agility: 12
  - Accuracy: 15
  - Evade: 12

### Initiative:
The speed attribute will determine actions per turn. Both Mizhael and the rabid dog have a speed range of 10, so they will alternate turns, with initiative decided by a dice roll.

Let’s roll for initiative! Mizhael rolls first.

<pre><code>python
import random

# Roll for initiative
mizhael_initiative = random.randint(1, 20)
dog_initiative = random.randint(1, 20)

mizhael_initiative, dog_initiative
</code></pre>
Result
(5, 17)


The rabid dog wins initiative with a roll of 17, compared to Mizhael's 5. It snarls and lunges forward, preparing to attack first!

<pre><code>python
### Rabid Dog's Turn
The dog will roll to determine if its bite attack lands. Its **accuracy** (15) and **agility** (12) contribute to its chance of success, against Mizhael's **evade** (10). Let’s calculate the hit threshold and roll!

# Combat variables
base_hit_modifier = 75
dog_accuracy = 15
dog_agility = 12
mizhael_evasion = 10

# Calculate hit threshold for the rabid dog's attack
dog_hit_chance = base_hit_modifier + dog_accuracy + dog_agility - mizhael_evasion
dog_hit_threshold = 100 - dog_hit_chance

# Roll to hit
dog_attack_roll = random.randint(1, 100)
dog_hit_threshold, dog_attack_roll
</code></pre>
Result
(8, 15)

The rabid dog rolls a 15, which is above its hit threshold of 8. The bite attack lands!

<pre><code>python
### Damage Calculation:
The dog's bite does **3 base damage**, plus any modifiers. Mizhael’s current HP will now be adjusted accordingly. Let's update Mizhael's HP.

# Damage calculation
dog_damage = 3
mizhael_hp = 10

# Apply damage to Mizhael
mizhael_hp -= dog_damage
mizhael_hp
</code></pre>
Result 7

The rabid dog bites into Mizhael’s arm, tearing through his cotton shirt and dealing **3 damage**. Mizhael’s HP drops to **7**.

### Mizhael's Turn
Mizhael grips his shovel and swings at the dog. His **accuracy** (10) and **agility** (10) factor into his attack, against the dog’s **evade** (12). Let’s calculate Mizhael’s hit threshold and roll!

<pre><code>python
# Mizhael's attack variables
mizhael_accuracy = 10
mizhael_agility = 10
dog_evade = 12

# Calculate hit threshold for Mizhael's attack
mizhael_hit_chance = base_hit_modifier + mizhael_accuracy + mizhael_agility - dog_evade
mizhael_hit_threshold = 100 - mizhael_hit_chance

# Roll to hit
mizhael_attack_roll = random.randint(1, 100)
mizhael_hit_threshold, mizhael_attack_roll
</code></pre>
Result
(17, 56)

Mizhael rolls a 56, which is well above his hit threshold of 17. His shovel connects with the rabid dog!

### Damage Calculation:
The shovel’s **base damage** is 1, plus an additional 10% of Mizhael's **strength** (10). Let’s calculate the total damage and update the dog’s HP.

<pre><code>python
# Damage calculation for Mizhael's attack
mizhael_strength = 10
shovel_base_damage = 1

# Total damage
mizhael_damage = shovel_base_damage + (0.1 * mizhael_strength)

# Rabid dog's HP
dog_hp = 8
dog_hp -= mizhael_damage

mizhael_damage, dog_hp
</code></pre>
Result
(2.0, 6.0)

Mizhael swings his shovel with force, striking the rabid dog and dealing **2 damage**. The dog snarls in pain, its HP dropping to **6**.

### Current Status:
- **Mizhael:** HP: 7
- **Rabid Dog:** HP: 6

The dog, though injured, circles Mizhael with feral determination, ready to attack again. 

**What will Mizhael do next?**
1. Swing the shovel again.
2. Attempt to dodge and reposition.
3. Use an item (if available). 

Choose your action!

1

Mizhael tightens his grip on the shovel, raising it for another strike. The rabid dog growls, ready to counter, but Mizhael's determination is unwavering.

Let’s calculate Mizhael’s hit threshold and roll to see if the shovel connects again!

<pre><code>python
# Roll for Mizhael's second attack
mizhael_attack_roll_2 = random.randint(1, 100)
mizhael_hit_threshold, mizhael_attack_roll_2
</code></pre>
Result
(17, 71)

Mizhael rolls a 71, far exceeding his hit threshold of 17. The shovel strikes true once again!

### Damage Calculation:
Let’s calculate the damage dealt by Mizhael's shovel and update the rabid dog’s HP.

<pre><code>python
# Apply damage to the rabid dog
dog_hp -= mizhael_damage
dog_hp
</code></pre>
Result
4.0

Mizhael's shovel lands another solid hit, dealing **2 damage**. The rabid dog’s HP drops to **4**, but it remains on its feet, snarling with feral rage.

### Rabid Dog's Turn
The dog retaliates with another lunge, attempting to sink its teeth into Mizhael once more. Let’s calculate its hit threshold and roll!

<pre><code>python
# Roll for the rabid dog's second attack
dog_attack_roll_2 = random.randint(1, 100)
dog_hit_threshold, dog_attack_roll_2
</code></pre>
Result
(8, 28)

The rabid dog rolls a 28, which is above its hit threshold of 8. The attack lands!

### Damage Calculation:
The dog’s bite deals **3 damage**. Let’s update Mizhael’s HP accordingly.

<pre><code>python
# Apply damage to Mizhael
mizhael_hp -= dog_damage
mizhael_hp
</code></pre>
Result
4

The rabid dog lunges and sinks its teeth into Mizhael’s leg, dealing **3 damage**. Mizhael’s HP drops to **4**, leaving him bloodied but still standing.

### Current Status:
- **Mizhael:** HP: 4
- **Rabid Dog:** HP: 4

Both combatants are wounded and on edge, circling each other cautiously.

**What will Mizhael do next?**
1. Swing the shovel for another attack.
2. Try to dodge and reposition.
3. Attempt to intimidate the dog and force it to back off.
4. Use an item (if available). 

Choose your action!

<pre><code>python

</code></pre>