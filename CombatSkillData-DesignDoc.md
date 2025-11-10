Ready to code?

Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Combat Skills Data Management - Design Document

1.  Overview

Problem: Editing individual JSON files is inefficient for balancing combat skills. Need centralized, human-editable format.

Solution: CSV as source of truth → Build script → Runtime JSON files

Goals:

- Easy visual comparison of all skills
- Fast bulk editing in text editor
- Shared telegraph assets across skills
- Automated validation of derived values
- Support for different defense vs attack structures

---

2.  Data Architecture

2.1 Attack Skills CSV Structure

Format: Skills as columns (current transposed format)

Property,overhead_strike,side_slash,thrust,upward_strike,diagonal_slash
id,overhead_strike,side_slash,thrust,upward_strike,diagonal_slash
name,Overhead Strike,Horizontal Strike,Thrust,Upward Strike,Diagonal Slash
description,"Vertical overhead attack","Horizontal rotating attack","Forward stabbing attack","Rising low-to-high attack","Angled diagonal cut"
type,attack,attack,attack,attack,attack
line,high,horizontal,center,low,diagonal
school,none,none,none,none,none

`User_Comment:` I don't need all the data in the csv file. waht is the difference between propert and id? looks like duplicated information. type in attack skills is attack. I don't need to have it, if it is needed in json then let the code add it.

# Phase Timings (milliseconds)

windUp_duration,400,500,200,400,600
committed_duration,800,800,600,600,500
impact_tick,AUTO,AUTO,AUTO,AUTO,AUTO
recovery_duration,800,500,700,400,600

# Resources

stamina_base,2,2,2,2,2
mp_base,0,0,0,0,0
focus_base,2,2,2,2,2
dailyFatigue_base,2,2,2,2,2

`User_Comment:` Move resource secion to be last.

# Telegraph Stage 1

t1_stage,1,1,1,1,1
t1_triggerTime,0,100,100,0,0
t1_assetId,shoulders_tense,shoulders_tense,weight_shift_back,shoulders_tense,shoulders_tense
t1_bodyPart,shoulders,shoulders,foot,shoulders,shoulders
t1_description,Shoulders tens up,Shoulders tens up,Weight shifts to back foot,Shoulders tens up,Shoulders tens up
t1_pause,true,true,true,true,true

`User_Comment:` I don't need stage in the csv. It's in the name already t1. Let the code handle that. t1* means stage one t4* means stage 4 etc. make it dynamic so I can add stage 5. do this for all Telegraph stages.

# Telegraph Stage 2

t2_stage,2,2,2,2,2
t2_triggerTime,100,200,200,100,100
t2_assetId,blade_rises_high,torso_rotate,weight_shift_forward,blade_drops_low,blade_rises_or_rotate
t2_bodyPart,weapon,body,foot,weapon,body
t2_description,Blade rises high,Torso rotates sideways,Weight shifts forward,Blade drops low,Random: Blade rises high OR Torso rotates sideways
t2_pause,true,true,true,true,true

# Telegraph Stage 3

t3_stage,3,3,3,3,3
t3_triggerTime,200,300,200,200,200
t3_assetId,blade_overhead,blade_wide_side,point_forward,blade_points_down,blade_shoulder_diagonal
t3_bodyPart,weapon,weapon,weapon,weapon,weapon
t3_description,Blade rises directly above head,Blade pulls wide to the side,Point aims directly at target in straight line,Blade point aims downward,Blade rises to the shoulder
t3_pause,true,true,true,true,true

# Telegraph Stage 4

t4_stage,4,4,4,4,4
t4_triggerTime,400,500,200,400,600
t4_assetId,vertical_commit,horizontal_commit,thrust_commit,rising_commit,diagonal_commit
t4_bodyPart,stance,stance,stance,stance,stance
t4_description,Brief pause at apex blade perfectly vertical,Hips reach maximum coil leading shoulder drops,Weight shifts decisively forward rear leg muscles visibly tense,Knees straighten body  
 rises blade begins upward arc,Clear diagonal line from high shoulder to low opposite hip
t4_pause,false,false,false,false,false

# Damage

damage_type,slashing,slashing,piercing,slashing,slashing
damage_baseValue,1,1,1,1,1

# Metadata

weaponTypes,sword|axe,sword|axe|dagger,sword|spear|dagger,sword,sword|axe
tags,basic|melee|vertical,basic|melee|horizontal,basic|melee|piercing|fast,basic|melee|rising,versatile|melee|slashing|angled
learningDifficulty,easy,easy,easy,easy,medium

Key Points:

- impact_tick = AUTO → Build script calculates: windUp_duration + committed_duration
- Array values use | separator (e.g., sword|axe|dagger)
- Telegraph stages: Repeating pattern t{N}\_stage, t{N}\_triggerTime, t{N}\_assetId, etc.
- Maximum 4 telegraph stages per skill

  2.2 Defense Skills CSV Structure

Separate file: CombatSkills-defense.csv (different fields than attacks)

Property,emergency_defense,retreat,parry,deflection
id,emergency_defense,retreat,parry,deflection
name,Emergency Defense,Retreat,Parry,Deflection
description,Desperate last-moment reaction,Step backward maintaining guard,Blade-on-blade block,Precise deflection with riposte
type,defense,defense,defense,defense
school,none,none,none,none

`User_Comment:` I don't need all the data in the csv file. waht is the difference between propert and id? looks like duplicated information. type in defense skills is always defense. I don't need to have it, if it is needed in json then let the code add it.

# Phase Timings

windUp_duration,200,800,500,500
active_duration,N/A,N/A,400,400
recovery_duration,1000,600,500,0

# Requirements

alwaysAvailable,true,false,false,false
requiresLine,false,false,true,false
requiresAttackId,false,false,false,true
requiresSpace,false,true,false,false
`User_Comment:` remove requiresSpace from csv and json

# Defense Properties

defenseType,emergency,movement,deflection,deflection
damageReduction,0.5,1.0,1.0,1.0
enablesCounter,false,false,false,true
counterWindow,0,0,0,200

`User_Comment:` I wonder about enablesCounter and counterWindow. I assume you wanted it for deflection but deflection gives bonus to windUp of next attack no specific counter is needed call it counterSpeedBonus. If the sytem will need enableCounter then keep it otherwise I don't need it.

# Resources

stamina_base,1,2,1,1
mp_base,0,0,0,0
focus_base,1,1,1,2
dailyFatigue_base,1,1,1,1

`User_Comment:` Move resource secion to be last.

# Metadata

tags,emergency|desperate,movement|disengage,defense|timing,defense|counter|advanced
learningDifficulty,easy,easy,medium,hard

Defense-Specific Fields:

- active_duration - Readiness window for defense
- requiresLine - Must select line (Parry)
- requiresAttackId - Must predict specific attack (Deflection)
- enablesCounter - Creates riposte window
- counterWindow - Duration of riposte opportunity (ms)

---

3.  Asset Management System

3.1 Telegraph Assets

Convention: {assetId}.png and {assetId}\_anim.json

Folder structure:
/public/assets/telegraphs/
shoulders_tense.png
shoulders_tense_anim.json
torso_rotate.png
torso_rotate_anim.json
blade_rises_high.png
blade_rises_high_anim.json
...

JSON output:
{
"telegraphs": [
{
"stage": 1,
"assetId": "shoulders_tense",
"bodyPart": "shoulders",
"triggerTime": 100,
"description": "Shoulders tens up",
"pause": true
}
]
}

Runtime asset loading:
const assetPath = `/assets/telegraphs/${telegraph.assetId}.png`;
const animPath = `/assets/telegraphs/${telegraph.assetId}_anim.json`;

3.2 Asset Validation

Build script checks:

- ✓ Referenced assetId files exist
- ✓ Both .png and \_anim.json present
- ⚠️ Warning if missing (non-blocking)
- 📋 Generate asset manifest for preloading

`User_Comment:` I will often times not have an asset while prototyping. Can we use a placeholder in that case? It is possible that I will have only pnd or animation not necessarily both, I can also have a video.

---

4.  Build Process

4.1 Conversion Flow

CSV Files (source of truth)
↓
Build Script (Node.js)
↓ Parse CSV
↓ Calculate derived values
↓ Validate constraints
↓ Check assets exist
↓
JSON Files (runtime)

4.2 Derived Value Calculations

Automatic calculations:
// Impact tick = windUp + committed
if (row.impact_tick === 'AUTO') {
skill.phases.impact.tick =
parseInt(row.windUp_duration) +
parseInt(row.committed_duration);
}

// Telegraph 4 trigger = windUp duration
skill.telegraphs[3].triggerTime = parseInt(row.windUp_duration);

4.3 Validation Rules

Hard errors (build fails):

- ✗ impact_tick !== windUp_duration + committed_duration (if not AUTO)
- ✗ Missing required fields (id, name, type)
- ✗ Telegraph triggerTime > windUp_duration (Stage 4)
- ✗ Invalid enum values (type, line, school)

Warnings (build succeeds):

- ⚠️ Missing asset files
- ⚠️ Duplicate skill IDs
- ⚠️ Telegraph stages not sequential (1,2,3,4)
- ⚠️ Recovery duration = 0 for non-deflection skills
  `User_Comment:` remove Recovery duration check
  4.4 Build Script Commands

# Convert CSV → JSON

npm run build:skills

# Validate only (no file writes)

npm run validate:skills

# Watch mode (auto-rebuild on CSV change)

npm run watch:skills

---

5.  TypeScript Type Updates

5.1 Add Line Field

export interface CombatSkill {
id: string;
name: string;
description: string;
type: 'attack' | 'defense';
line?: 'horizontal' | 'center' | 'diagonal' | 'high' | 'low'; // ← NEW
school: string;
phases: PhaseTimings;
// ... rest
}

`User_Comment:` line without questionmark at the end

5.2 Add Asset ID to Telegraph

export interface Telegraph {
stage: number;
assetId: string; // ← NEW: Reference to shared asset
bodyPart: string;
triggerTime: number;
description: string;
pause?: boolean;
}

5.3 Defense-Specific Fields

export interface DefenseProperties {
requiresLine?: boolean; // Parry needs line selection
requiresAttackId?: boolean; // Deflection needs attack prediction
requiresSpace?: boolean; // Retreat needs space
defenseType: 'emergency' | 'movement' | 'deflection';
damageReduction: number; // 0.0-1.0 (1.0 = full block)
enablesCounter?: boolean;
counterWindow?: number; // ms
}

export interface CombatSkill {
// ... existing fields
defenseProperties?: DefenseProperties; // ← NEW
}

---

6.  Clarified Game Mechanics

6.1 Parry Mechanic

// User flow:
// 1. Enemy telegraph triggers pause
// 2. User clicks "Parry" button
// 3. UI shows line selection (horizontal/center/diagonal/high/low)
// 4. User selects line
// 5. Game unpauses, Parry executes with selected line

// At impact:
if (defenseAction.type === 'parry') {
const success = (attackAction.line === selectedLine);
if (success) {
// Block damage, fast recovery
} else {
// Take full damage
}
}

6.2 Deflection Mechanic

// User flow:
// 1. Enemy telegraph triggers pause
// 2. User clicks "Deflection" button
// 3. Dropdown shows: enemyAction.visibleTelegraphs[last].possibleSkills
// 4. User selects specific attack ID (e.g., "side_slash")
// 5. Game unpauses, Deflection executes

// At impact:
if (defenseAction.type === 'deflection') {
const success = (attackAction.id === selectedAttackId);
if (success) {
// Block damage, no recovery, enable riposte window
defenseAction.counterWindow = 200; // ms
} else {
// Take full damage
}
}

6.3 Feint Mechanic

// Attacker in windUp phase
// Defender triggers pause (via telegraph)
// Attacker can Feint if:
// - Still in windUp phase
// - New attack has different line
// - Has stamina for +penalty

function executeFeint(oldAttack, newAttack) {
// Reset to new attack timeline from 0ms
currentAction = {
skill: newAttack,
startTick: currentTick, // ← Reset to now
elapsedTime: 0,
currentPhase: 'windUp'
};

// Add 100ms penalty to windUp
currentAction.windUpEnd = newAttack.phases.windUp.duration + 100;

// Clear old telegraphs
currentAction.visibleTelegraphs = [];
}

6.4 Emergency Defense

// Always available
// No timing check
// If pressed during enemy impact:
// damageReduction = 0.5 (chip damage)
// Longest recovery (1000ms)

---

7.  Migration Plan

Phase 1: Setup (No breaking changes)

1.  Create scripts/buildSkills.js
2.  Create attack CSV from existing JSONs
3.  Run build script → verify output matches current JSONs
4.  Add to git: CSV (source) + JSON (generated)

Phase 2: Add New Fields

1.  Add line column to CSV
2.  Add assetId to telegraph rows
3.  Update TypeScript types
4.  Rebuild JSONs

Phase 3: Asset System

1.  Create /public/assets/telegraphs/ folder
2.  Add placeholder images
3.  Update UI to load from assetId

Phase 4: Defense Skills

1.  Create defense CSV
2.  Add defense-specific fields to types
3.  Implement Parry/Deflection/Emergency Defense logic

---

8.  Example Build Script Pseudocode

// scripts/buildSkills.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

async function buildSkills() {
const attacks = await parseCSV('CombatSkills-attack.csv');
const defenses = await parseCSV('CombatSkills-defense.csv');

// Process each skill column
attacks.columns.forEach(skillId => {
const skill = {
id: skillId,
name: attacks.getValue('name', skillId),
type: 'attack',
line: attacks.getValue('line', skillId),
phases: {
windUp: {
duration: parseInt(attacks.getValue('windUp_duration', skillId))
},
committed: {
duration: parseInt(attacks.getValue('committed_duration', skillId))
},
impact: {
tick: parseInt(attacks.getValue('windUp_duration', skillId)) +
parseInt(attacks.getValue('committed_duration', skillId))
},
recovery: {
duration: parseInt(attacks.getValue('recovery_duration', skillId))
}
},
telegraphs: [
{
stage: 1,
assetId: attacks.getValue('t1_assetId', skillId),
triggerTime: parseInt(attacks.getValue('t1_triggerTime', skillId)),
description: attacks.getValue('t1_description', skillId),
pause: attacks.getValue('t1_pause', skillId) === 'true'
},
// ... stages 2-4
]
};

     // Validate
     validateSkill(skill);

     // Write JSON
     fs.writeFileSync(
       `public/CombatSkills/attacks/${skillId}.json`,
       JSON.stringify(skill, null, 2)
     );

});
}

function validateSkill(skill) {
const calculated = skill.phases.windUp.duration + skill.phases.committed.duration;
if (skill.phases.impact.tick !== calculated) {
throw new Error(`Invalid impact tick for ${skill.id}`);
}

// Check assets exist
skill.telegraphs.forEach(t => {
const imgPath = `public/assets/telegraphs/${t.assetId}.png`;
if (!fs.existsSync(imgPath)) {
console.warn(`⚠️  Missing asset: ${imgPath}`);
}
});
}

---

9.  Summary

Data Flow:
CSV (human edits)
→ Build Script (validation + derivation)
→ JSON (runtime)
→ Assets (loaded by assetId)

Advantages:

- ✓ Single-glance balancing across all skills
- ✓ Text editor friendly (diff, merge, version control)
- ✓ Automatic calculation of derived values
- ✓ Shared telegraph assets reduce duplication
- ✓ Build-time validation catches errors early
- ✓ Separate CSV for defense vs attack (different structures)

Next Steps:

1.  Implement build script
2.  Convert existing JSONs to CSV
3.  Add line field to all attacks
4.  Create asset folder structure
5.  Update GameEngine to use assetId

Proceed with implementation?
`User_Comment:`processd with implementation, make sure the code it properly commented so that the next ai coding agent know what it does and why. keep it short but comprehensive, make sure to include the most impoart parts.
