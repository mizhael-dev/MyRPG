/**
 * Build Skills - CSV to JSON Converter
 *
 * PURPOSE:
 * Converts human-editable CSV files (where skills are columns) into JSON files
 * that the game engine can load at runtime.
 *
 * WHY CSV AS COLUMNS:
 * - Easy visual comparison across all skills
 * - Fast bulk editing in text editor
 * - Diff-friendly for version control
 *
 * WHAT IT DOES:
 * 1. Parses CSV files (attacks and defenses)
 * 2. Auto-generates fields not in CSV (type, school, stage numbers)
 * 3. Calculates derived values (impact_tick = windUp + committed)
 * 4. Dynamically detects telegraph stages (t1_, t2_, t99_ - no limit)
 * 5. Validates data integrity
 * 6. Handles missing assets gracefully (uses placeholder)
 * 7. Writes JSON files to /public/CombatSkills/
 *
 * USAGE:
 *   npm run build:skills       - Convert all CSVs
 *   npm run validate:skills    - Validate without writing
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CSV PARSING
// ============================================================================

/**
 * Parses CSV file where skills are columns
 * Returns: { columns: ['skill1', 'skill2'], getValue: (row, col) => string }
 */
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);

  if (lines.length === 0) {
    throw new Error(`Empty CSV file: ${filePath}`);
  }

  // First non-comment line is header (skill IDs)
  let headerLine = lines.find(line => !line.startsWith('#'));
  const headers = headerLine.split(',').map(h => h.trim());
  const propertyCol = headers[0]; // First column is property names
  const skillIds = headers.slice(1); // Rest are skill IDs

  // Build lookup table: { propertyName: { skillId: value } }
  const data = {};

  for (const line of lines) {
    if (line.startsWith('#') || !line) continue; // Skip comments

    const cells = line.split(',').map(c => c.trim());
    const propertyName = cells[0];

    data[propertyName] = {};
    for (let i = 1; i < cells.length; i++) {
      const skillId = skillIds[i - 1];
      data[propertyName][skillId] = cells[i];
    }
  }

  return {
    columns: skillIds,
    data: data,  // Raw data object for direct access
    getValue: (property, skillId) => data[property]?.[skillId] || null
  };
}

// ============================================================================
// TELEGRAPH STAGE DETECTION
// ============================================================================

/**
 * Dynamically detects all telegraph stages in CSV
 * Looks for patterns like t1_triggerTime, t2_assetId, t99_description, etc.
 *
 * WHY DYNAMIC:
 * - No hard limit on telegraph stages
 * - Skills can have different numbers of stages
 * - Easy to add t5_, t6_, etc. without code changes
 *
 * Returns: [1, 2, 3, 4] or [1, 2, 3, 4, 5] etc.
 */
function detectTelegraphStages(csvData) {
  const properties = Object.keys(csvData);
  const stageNumbers = new Set();

  // Match any property like t{N}_something
  const pattern = /^t(\d+)_/;
  for (const prop of properties) {
    const match = prop.match(pattern);
    if (match) {
      stageNumbers.add(parseInt(match[1]));
    }
  }

  return Array.from(stageNumbers).sort((a, b) => a - b);
}

// ============================================================================
// ASSET HANDLING
// ============================================================================

/**
 * Checks if assets exist for given assetId
 * Supports: .png, .mp4, _anim.json (any combination)
 *
 * WHY FLEXIBLE:
 * - During prototyping, may have placeholder images only
 * - Later add animations
 * - Support video instead of static images
 *
 * Returns: { found: boolean, types: ['png', 'mp4', 'anim'] }
 */
function checkAssets(assetId) {
  const baseDir = path.join(__dirname, '../public/assets/telegraphs');
  const results = {
    found: false,
    types: []
  };

  const checkPaths = [
    { ext: 'png', path: path.join(baseDir, `${assetId}.png`) },
    { ext: 'mp4', path: path.join(baseDir, `${assetId}.mp4`) },
    { ext: 'anim', path: path.join(baseDir, `${assetId}_anim.json`) }
  ];

  for (const check of checkPaths) {
    if (fs.existsSync(check.path)) {
      results.found = true;
      results.types.push(check.ext);
    }
  }

  return results;
}

// ============================================================================
// ATTACK SKILL BUILDER
// ============================================================================

/**
 * Builds attack skill JSON from CSV row data
 */
function buildAttackSkill(skillId, csvData) {
  const get = (prop) => csvData[prop]?.[skillId];

  // Detect telegraph stages dynamically
  const stages = detectTelegraphStages(csvData);

  // Build telegraph array
  const telegraphs = stages.map(stageNum => {
    const assetId = get(`t${stageNum}_assetId`);

    // Check if assets exist
    const assetCheck = checkAssets(assetId);
    if (!assetCheck.found) {
      console.warn(`⚠️  Missing assets for "${assetId}" in ${skillId} (stage ${stageNum})`);
    }

    return {
      stage: stageNum,  // Auto-generated from t{N}_ prefix
      assetId: assetId,
      bodyPart: get(`t${stageNum}_bodyPart`),
      triggerTime: parseInt(get(`t${stageNum}_triggerTime`)),
      description: get(`t${stageNum}_description`),
      pause: get(`t${stageNum}_pause`) === 'true'
    };
  });

  // Calculate impact tick if AUTO
  const windUpDuration = parseInt(get('windUp_duration'));
  const committedDuration = parseInt(get('committed_duration'));
  let impactTick = get('impact_tick');

  if (impactTick === 'AUTO') {
    impactTick = windUpDuration + committedDuration;
  } else {
    impactTick = parseInt(impactTick);
  }

  // Validate impact calculation
  if (impactTick !== windUpDuration + committedDuration) {
    throw new Error(
      `Invalid impact tick for ${skillId}: ${impactTick} !== ${windUpDuration} + ${committedDuration}`
    );
  }

  // Parse arrays (pipe-separated: "sword|axe|dagger")
  const parseArray = (str) => str ? str.split('|').map(s => s.trim()) : [];

  return {
    id: skillId,
    name: get('name'),
    description: get('description'),
    type: 'attack',  // Auto-generated
    line: get('line'),
    school: get('school') || 'none',  // Auto-generated if missing
    phases: {
      windUp: {
        duration: windUpDuration,
        canCancel: true,
        canFeint: true,
        description: "Attacker prepares the attack, telegraphs become progressively visible"
      },
      committed: {
        duration: committedDuration,
        canCancel: false,
        canFeint: false,
        description: "Committed to the attack, weapon in motion, cannot be cancelled"
      },
      impact: {
        tick: impactTick,
        description: "The weapon connects with the target"
      },
      recovery: {
        duration: parseInt(get('recovery_duration')),
        description: "Recovering from the attack, regaining balance and guard position"
      }
    },
    costs: {
      stamina: {
        base: parseInt(get('stamina_base'))
      },
      mp: parseInt(get('mp_base')),
      focus: parseInt(get('focus_base')),
      dailyFatigue: parseInt(get('dailyFatigue_base'))
    },
    telegraphs: telegraphs,
    damage: {
      type: get('damage_type'),
      baseValue: parseInt(get('damage_baseValue')),
      scaling: { strength: 1.0 }
    },
    metadata: {
      weaponTypes: parseArray(get('weaponTypes')),
      tags: parseArray(get('tags')),
      learningDifficulty: get('learningDifficulty')
    }
  };
}

// ============================================================================
// DEFENSE SKILL BUILDER
// ============================================================================

/**
 * Builds defense skill JSON from CSV row data
 * Defense skills have different structure than attacks
 */
function buildDefenseSkill(skillId, csvData) {
  const get = (prop) => csvData[prop]?.[skillId];
  const parseArray = (str) => str ? str.split('|').map(s => s.trim()) : [];

  const windUpDuration = parseInt(get('windUp_duration'));
  const activeDuration = get('active_duration');
  const recoveryDuration = parseInt(get('recovery_duration'));

  return {
    id: skillId,
    name: get('name'),
    description: get('description'),
    type: 'defense',  // Auto-generated
    school: get('school') || 'none',
    phases: {
      windUp: {
        duration: windUpDuration,
        canCancel: true,
        canFeint: false,
        description: "Preparing defensive action"
      },
      // Defense skills don't have committed phase - they have active window
      active: {
        duration: activeDuration !== 'N/A' ? parseInt(activeDuration) : 0,
        description: "Defense is active and will trigger automatically"
      },
      recovery: {
        duration: recoveryDuration,
        description: "Resetting to guard position"
      }
    },
    costs: {
      stamina: {
        base: parseInt(get('stamina_base'))
      },
      mp: parseInt(get('mp_base')),
      focus: parseInt(get('focus_base')),
      dailyFatigue: parseInt(get('dailyFatigue_base'))
    },
    defenseProperties: {
      requiresLine: get('requiresLine') === 'true',
      requiresAttackId: get('requiresAttackId') === 'true',
      defenseType: get('defenseType'),
      damageReduction: parseFloat(get('damageReduction')),
      counterSpeedBonus: parseInt(get('counterSpeedBonus')) || 0
    },
    metadata: {
      weaponTypes: parseArray(get('weaponTypes') || ''),
      tags: parseArray(get('tags')),
      learningDifficulty: get('learningDifficulty')
    }
  };
}

// ============================================================================
// MAIN BUILD FUNCTION
// ============================================================================

/**
 * Main entry point
 * Processes all CSV files and writes JSON output
 */
function buildSkills(validateOnly = false) {
  console.log('🔨 Building combat skills from CSV...\n');

  const baseDir = __dirname + '/..';
  const csvDir = baseDir + '/public/CombatSkills';
  const outputDir = baseDir + '/public/CombatSkills';

  let totalSkills = 0;
  let errors = 0;

  // Process attack skills
  try {
    const attackCSV = csvDir + '/attacks/CombatSkills-attack.csv';
    if (fs.existsSync(attackCSV)) {
      console.log('📊 Processing attack skills CSV...');
      const data = parseCSV(attackCSV);

      data.columns.forEach(skillId => {
        try {
          const skill = buildAttackSkill(skillId, data.data);

          if (!validateOnly) {
            const outputPath = path.join(outputDir, 'attacks', `${skillId}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(skill, null, 2));
            console.log(`  ✓ ${skillId}.json`);
          } else {
            console.log(`  ✓ ${skillId} validated`);
          }

          totalSkills++;
        } catch (err) {
          console.error(`  ✗ ${skillId}: ${err.message}`);
          errors++;
        }
      });
    }
  } catch (err) {
    console.error(`❌ Failed to process attack CSV: ${err.message}`);
    errors++;
  }

  // Process defense skills (if CSV exists)
  try {
    const defenseCSV = csvDir + '/defense/CombatSkills-defense.csv';
    if (fs.existsSync(defenseCSV)) {
      console.log('\n📊 Processing defense skills CSV...');
      const data = parseCSV(defenseCSV);

      data.columns.forEach(skillId => {
        try {
          const skill = buildDefenseSkill(skillId, data.data);

          if (!validateOnly) {
            const outputPath = path.join(outputDir, 'defense', `${skillId}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(skill, null, 2));
            console.log(`  ✓ ${skillId}.json`);
          } else {
            console.log(`  ✓ ${skillId} validated`);
          }

          totalSkills++;
        } catch (err) {
          console.error(`  ✗ ${skillId}: ${err.message}`);
          errors++;
        }
      });
    }
  } catch (err) {
    console.error(`❌ Failed to process defense CSV: ${err.message}`);
    errors++;
  }

  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ ${totalSkills} skills ${validateOnly ? 'validated' : 'built'}`);
  if (errors > 0) {
    console.log(`❌ ${errors} errors`);
    process.exit(1);
  }
  console.log(`${'='.repeat(50)}`);
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);
const validateOnly = args.includes('--validate');

try {
  buildSkills(validateOnly);
} catch (err) {
  console.error(`\n❌ Build failed: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}
