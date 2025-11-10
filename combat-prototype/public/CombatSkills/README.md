# Combat Skills Data Management

This folder contains the **source of truth** for all combat skills in the game.

## Quick Start

1. **Edit the CSV** (skills as columns for easy comparison):
   - `/attacks/CombatSkills-attack.csv` - Attack skills
   - `/defense/CombatSkills-defense.csv` - Defense skills
   - `/special/CombatSkills-special.csv` - Special skills (feint, etc.)

2. **Rebuild JSON files**:

   ```bash
   npm run build:skills
   ```

3. **Validate without writing** (check for errors):

   ```bash
   npm run validate:skills
   ```

4. **Test in game** (dev server auto-reloads):
   ```bash
   npm run dev
   ```

---

## CSV Format Explained

### Why Skills as Columns?

```csv
id,overhead_strike,side_slash,thrust
name,Overhead Strike,Horizontal Strike,Thrust
windUp_duration,400,500,200
```

**Advantages:**

- See all skills side-by-side
- Easy to compare timing values
- Fast bulk editing in text editor
- Git diff shows what changed

### What Gets Auto-Generated

You **don't need** to include these in CSV (build script adds them):

- `type: "attack"`, `"defense"`, or `"special"` - Based on which CSV file
- `school: "none"` - Default value
- `stage` numbers in telegraphs - Derived from `t1_`, `t2_`, etc.

### Calculated Values

**`impact_tick = AUTO`** means:

```
impact_tick = windUp_duration + committed_duration
```

Build script calculates this automatically and validates it.

---

## Editing Skills

### Change Timing Values

1. Open `CombatSkills-attack.csv`
2. Find the row: `windUp_duration,400,500,200,400,600`
3. Change a value: `windUp_duration,400,**600**,200,400,600`
4. Run: `npm run build:skills`
5. Test in game

**The build script will automatically recalculate `impact_tick`.**

### Add a New Telegraph Stage

Want to add stage 5 to a skill?

1. Add these rows to the CSV:

   ```csv
   t5_triggerTime,700,0,0,0,0
   t5_assetId,special_tell,placeholder,placeholder,placeholder,placeholder
   t5_bodyPart,eyes,n/a,n/a,n/a,n/a
   t5_description,Eyes flash red,n/a,n/a,n/a,n/a
   t5_pause,true,false,false,false,false
   ```

2. Run: `npm run build:skills`

**No limit on telegraph stages!** Use t1*, t2*, t3*, ..., t99*, etc.

### Add a New Skill

1. Add a new column to the CSV:

   ```csv
   id,overhead_strike,side_slash,thrust,NEW_SKILL_ID
   name,Overhead Strike,Horizontal Strike,Thrust,Cool New Attack
   ...
   ```

2. Fill in all required rows for that column

3. Run: `npm run build:skills`

4. New file created: `/attacks/NEW_SKILL_ID.json`

---

## Telegraph Assets

### Asset Naming

Assets are stored in `/public/assets/telegraphs/` and referenced by `assetId`:

```csv
t1_assetId,shoulders_tense,...
```

This looks for:

- `shoulders_tense.png` (static image)
- `shoulders_tense.mp4` (video animation)
- `shoulders_tense_anim.json` (animation data)

**Any combination is valid.** Missing assets use `placeholder.png`.

### Asset Reuse

Multiple skills can share the same `assetId`:

```csv
# Both overhead_strike and side_slash use "shoulders_tense" for stage 1
t1_assetId,shoulders_tense,shoulders_tense,...
```

This is intentional - many attacks start with the same body language.

---

## CSV Structure Reference

### Required Rows (Must Have)

```csv
id,skill1,skill2,skill3
name,Display Name,Another Name,Third Name
description,Text description,...
line,high,horizontal,center

# Phase Timings
windUp_duration,400,500,200
committed_duration,800,800,600
impact_tick,AUTO,AUTO,AUTO
recovery_duration,800,500,700

# At least 1 telegraph stage (t1_*)
t1_triggerTime,0,0,0
t1_assetId,asset_name,...
t1_bodyPart,shoulders,...
t1_description,Text...
t1_pause,true,true,false

# Damage
damage_type,slashing,piercing,...
damage_baseValue,1,1,1

# Metadata
weaponTypes,sword|axe,...
tags,basic|melee,...
learningDifficulty,easy,medium,hard

# Resources
stamina_base,2,2,2
mp_base,0,0,0
focus_base,2,2,2
dailyFatigue_base,2,2,2
```

### Line Values (for targeting)

- `high` - Overhead attacks
- `horizontal` - Side slashes
- `center` - Thrusts, center line
- `low` - Rising attacks from below
- `diagonal` - Angled attacks

### Defense Skills Structure

Defense skills have different required rows:

```csv
id,emergency_defense,retreat,parry,deflection
name,Emergency Defense,Retreat,Parry,Deflection
description,Text description,...

# Phase Timings
windUp_duration,100,200,300,300
active_duration,200,400,500,500
recovery_duration,500,300,200,200

# Telegraph Stages (optional but recommended)
t1_triggerTime,0,0,0,0
t1_assetId,eyes_widen,weight_shift_back,eyes_lock_blade,eyes_lock_blade
t1_bodyPart,eyes,foot,eyes,eyes
t1_description,Eyes widen suddenly,Weight shifts to back foot,...
t1_pause,true,true,true,true
# (t2_, t3_, t4_ follow same pattern as attacks)

# Defense Properties
requiresLine,false,false,true,false
requiresAttackId,false,false,false,true
defenseType,emergency,movement,deflection,deflection
damageReduction,0.5,1.0,1.0,1.0
counterSpeedBonus,0,0,100,300

# Metadata & Resources (same as attacks)
```

**Key differences from attacks:**

- `active_duration` instead of `committed_duration` (use `N/A` for instant defenses)
- No `impact_tick` (defense timing is based on active window)
- No `line` field (only attacks have line direction)
- **Telegraphs optional** but recommended to show defender's intent to attacker
- Defense-specific properties: `requiresLine`, `requiresAttackId`, `defenseType`, `damageReduction`, `counterSpeedBonus`

**Defense Types:**

- `emergency` - Last resort, can be used late, reduced damage
- `movement` - Movement-based defense (dodge, retreat)
- `deflection` - Blade-based defense (parry, deflection)

### Special Skills Structure

Special skills have unique mechanics (feint, morph, etc.):

```csv
id,feint
name,Feint (Attack Morph)
description,Change attack mid-motion after reading defender's telegraph...

# Special Mechanics
specialType,attack_morph
requiresActiveAttack,true
requiresDefenderTelegraph,true
requiresDifferentLine,true
availableInPhase,windUp
cannotUseAfter,committed

# Timing Mechanics (ms)
recognitionTime,0
adjustmentTime,100
timePenalty,100
morphDescription,Reading defender's telegraph then adjusting attack angle

# Execution Flow
executionFlow,1_Read defender telegraph|2_Cancel current attack|3_Apply penalty|4_Start new attack|5_Continue
resetBehavior,reset_to_zero_plus_penalty
newAttackStartTime,100

# Stamina Mechanics
staminaMultiplier,1.4
staminaDescription,Costs base attack stamina * 1.4 (40% penalty)
originalAttackStaminaLost,true

# Success/Failure Conditions
onSuccessfulRead,New attack bypasses defender's prepared defense line
onMisread,Morphed attack telegraphs revealed defender adapts

# Telegraph Stages (same format as attacks/defenses)
# Tactical Properties, Requirements, Metadata, Resources...
```

**Key features of special skills:**

- Unique mechanics tied to game state (active attacks, defender telegraphs)
- Complex execution flow with multiple steps
- Timing penalties and stamina multipliers
- Success/failure conditions based on tactical reads
- Telegraphs show the special action in progress

**Special Types:**

- `attack_morph` - Change attack mid-motion (feint)
- Additional special types can be added for other tactical actions

### Array Values

Use `|` separator for arrays:

```csv
weaponTypes,sword|axe|dagger
tags,basic|melee|fast
```

---

## Validation Rules

The build script checks:

### Hard Errors (Build Fails)

- ❌ Missing required fields (id, name, line)
- ❌ `impact_tick` doesn't equal `windUp + committed` (if not AUTO)
- ❌ Telegraph `triggerTime` > `windUp_duration` (stage 4 must be ≤ windUp)

### Warnings (Build Succeeds)

- ⚠️ Missing asset files (uses placeholder)
- ⚠️ Duplicate skill IDs
- ⚠️ Telegraph stages not sequential (1, 2, 3, 4...)

---

## Troubleshooting

### "Invalid impact tick for X"

**Problem:** Impact tick doesn't match windUp + committed

**Fix:**

1. Check your CSV values
2. Or set `impact_tick,AUTO,AUTO,AUTO,...` to auto-calculate

### "Missing assets for X"

**Problem:** Asset file doesn't exist

**Fix:**

- Create the asset file in `/public/assets/telegraphs/`
- OR ignore warning (placeholder will be used)

### Build fails with NaN

**Problem:** Non-numeric value in timing field

**Fix:** Check CSV for typos in duration/tick fields

### Changes not appearing in game

1. Check console for JSON load errors
2. Verify `GameEngine.ts` is loading the skill
3. Hard refresh browser (Ctrl+F5)

---

## Example Workflow

**Scenario:** Make thrust faster

1. Edit CSV:

   ```csv
   windUp_duration,400,500,**150**,400,600
   ```

2. Rebuild:

   ```bash
   npm run build:skills
   ```

3. Output:

   ```
   ✓ thrust.json
   impact_tick auto-calculated: 750 (150 + 600)
   ```

4. Test in game - thrust now has 150ms windUp instead of 200ms

---

## Tips

- **Comments in CSV:** Lines starting with `#` are ignored
- **Blank lines:** Also ignored (use for readability)
- **Text editor:** VSCode works great (CSV Rainbow extension helps)
- **Git:** Commit both CSV (source) and JSON (generated)
- **Telegraph descriptions:** Can use `|` for "or" (e.g., "Blade rises | Torso rotates")

---

## Next Steps

- [x] Add defense skills CSV
- [ ] Create telegraph assets (replace placeholders)
- [ ] Add more attack and defense skills
- [ ] Implement combo system

For questions, see `/scripts/buildSkills.cjs` - it's heavily commented.
