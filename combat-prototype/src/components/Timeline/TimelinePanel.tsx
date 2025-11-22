/**
 * TimelinePanel.tsx - Timeline Visualization
 *
 * Shows scrollable timeline with phase-colored action bars.
 * Displays full combat history with auto-scroll behavior.
 */

import { useRef, useState, useEffect } from 'react';
import type { JSX } from 'react';
import type { GameState, ActionHistoryEntry, ActionState } from '../../types/CombatTypes';
import type { ViewMode } from '../ViewModeSelector';

// ============================================================================
// TIMELINE CONFIGURATION
// ============================================================================
//
// Adjust these values to change how the timeline looks and behaves.
// No technical knowledge required - just change the numbers!
//
// ============================================================================

const TIMELINE_CONFIG = {
  // -------------------------------------------------------------------------
  // TIME WINDOW SETTINGS
  // -------------------------------------------------------------------------

  // PAST_MS: How many milliseconds of history to show by default
  // Example: 1000 = show 1 second of past actions
  PAST_MS: 1000,

  // ZOOM_MS: Total visible timeframe in milliseconds
  // This is the "width" of the timeline window you're looking through
  // Example: 3000 = see 3 seconds at once (1 second past + 2 seconds future)
  ZOOM_MS: 3000,

  // VALIDATION: PAST_MS must be smaller than ZOOM_MS
  // (You can't show more past than your total window!)

  // -------------------------------------------------------------------------
  // RENDERING DETAIL SETTINGS
  // -------------------------------------------------------------------------

  // These control how "zoomed in" or "zoomed out" the timeline appears
  // Higher numbers = more detail (zoomed in), Lower numbers = less detail (zoomed out)

  // MIN_PX_PER_MS: Minimum detail level (prevents zooming out too far)
  // Example: 0.1 means 1 pixel = 10 milliseconds
  MIN_PX_PER_MS: 0.1,

  // MAX_PX_PER_MS: Maximum detail level (prevents zooming in too far)
  // Example: 1.0 means 1 pixel = 1 millisecond
  MAX_PX_PER_MS: 1.0,

  // DEFAULT_PX_PER_MS: Default detail level (good balance)
  // Example: 0.3 means 1 pixel = 3.33 milliseconds
  DEFAULT_PX_PER_MS: 0.3,

  // -------------------------------------------------------------------------
  // SCROLL BEHAVIOR SETTINGS
  // -------------------------------------------------------------------------

  // AUTO_SCROLL_BUFFER: How close to the edge counts as "at the end"
  // Timeline auto-scrolls only when you're this close to the right edge
  // Example: 10 = within 10 pixels of the edge
  AUTO_SCROLL_BUFFER: 10,

  // -------------------------------------------------------------------------
  // VISUAL APPEARANCE SETTINGS
  // -------------------------------------------------------------------------

  // NOW_LINE_WIDTH: Width of the black "now" indicator line
  // Example: 2 = 2 pixels wide
  NOW_LINE_WIDTH: 2,

  // TIMEBAR_HEIGHT: Height of each individual timebar
  // Example: 30 = 30 pixels tall
  TIMEBAR_HEIGHT: 30,

  // TIMEBAR_SPACING: Vertical gap between timebars
  // Example: 8 = 8 pixels of space
  TIMEBAR_SPACING: 8,
};

// Validation check (will show error in browser console if wrong)
if (TIMELINE_CONFIG.PAST_MS > TIMELINE_CONFIG.ZOOM_MS) {
  console.error('Configuration Error: PAST_MS cannot be greater than ZOOM_MS');
}

// ============================================================================
// COMPONENT
// ============================================================================

interface TimelinePanelProps {
  gameState: GameState;
  viewMode: ViewMode;
  hoveredSkillId: string | null; // NEW: Skill being hovered for ghost preview
}

export function TimelinePanel({ gameState, viewMode, hoveredSkillId }: TimelinePanelProps) {
  // -------------------------------------------------------------------------
  // STATE & REFS
  // -------------------------------------------------------------------------

  const viewportRef = useRef<HTMLDivElement>(null); // Viewport (fixed width)
  const [viewportWidth, setViewportWidth] = useState(800); // Default width
  const [isShaking, setIsShaking] = useState(false); // NEW: Impact shake effect
  const lastLogLengthRef = useRef(0); // Track combat log length for impact detection

  // -------------------------------------------------------------------------
  // RESPONSIVE WIDTH TRACKING
  // -------------------------------------------------------------------------

  useEffect(() => {
    const updateWidth = () => {
      if (viewportRef.current) {
        setViewportWidth(viewportRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // -------------------------------------------------------------------------
  // IMPACT SHAKE DETECTION
  // -------------------------------------------------------------------------

  useEffect(() => {
    // Detect new impact messages in combat log
    if (gameState.combatLog.length > lastLogLengthRef.current) {
      const newLogs = gameState.combatLog.slice(lastLogLengthRef.current);
      const hasImpact = newLogs.some(log => log.includes('Impact') || log.includes('HIT'));

      if (hasImpact) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 200); // Shake for 200ms
      }
    }

    lastLogLengthRef.current = gameState.combatLog.length;
  }, [gameState.combatLog]);

  // -------------------------------------------------------------------------
  // PIXEL-TO-MS RATIO (HYBRID APPROACH)
  // -------------------------------------------------------------------------

  // Calculate pixel-to-millisecond ratio based on viewport width
  // Constrained by min/max bounds to prevent extreme zoom levels
  const pxPerMs = Math.min(
    Math.max(
      viewportWidth / TIMELINE_CONFIG.ZOOM_MS, // Responsive calculation
      TIMELINE_CONFIG.MIN_PX_PER_MS // Enforce minimum
    ),
    TIMELINE_CONFIG.MAX_PX_PER_MS // Enforce maximum
  );

  // -------------------------------------------------------------------------
  // TIMELINE DIMENSIONS
  // -------------------------------------------------------------------------

  // Calculate where "now" should be positioned in the viewport (33% from left)
  const nowPositionPercent = (TIMELINE_CONFIG.PAST_MS / TIMELINE_CONFIG.ZOOM_MS) * 100;
  const nowPositionPx = (nowPositionPercent / 100) * viewportWidth;

  // Calculate how far left to shift the timeline content
  // We want currentTick to appear at nowPositionPx in the viewport
  const timelineOffsetPx = -(gameState.currentTick * pxPerMs) + nowPositionPx;

  // Timeline content should be wide enough for full history + future
  const futureBuffer = TIMELINE_CONFIG.ZOOM_MS - TIMELINE_CONFIG.PAST_MS; // Show future buffer
  const timelineWidthPx = (gameState.currentTick + futureBuffer + 1000) * pxPerMs; // +1000ms extra buffer

  // -------------------------------------------------------------------------
  // ACTION DATA PREPARATION
  // -------------------------------------------------------------------------

  // Combine history + current in-progress actions
  const pcActions: ActionHistoryEntry[] = [
    ...(gameState.actionHistory?.filter((a) => a.fighterId === 'pc') || []),
  ];
  const npcActions: ActionHistoryEntry[] = [
    ...(gameState.actionHistory?.filter((a) => a.fighterId === 'npc') || []),
  ];

  // Add current in-progress actions
  if (gameState.pc.currentAction) {
    pcActions.push(convertCurrentActionToHistoryEntry(gameState.pc.currentAction, 'pc', gameState.currentTick));
  }
  if (gameState.npc.currentAction) {
    npcActions.push(convertCurrentActionToHistoryEntry(gameState.npc.currentAction, 'npc', gameState.currentTick));
  }

  // Note: Auto-scroll behavior removed - timeline content moves via CSS transform instead

  // -------------------------------------------------------------------------
  // GHOST PREVIEW LOGIC
  // -------------------------------------------------------------------------

  let ghostPreview: {
    skill: CombatSkill;
    startTick: number;
    interruptPrediction: 'player_wins' | 'player_loses' | 'none';
    damageIndicatorTick?: number; // Where to show red flash if player loses
    interruptTick?: number; // Where to gray out enemy if player wins
  } | null = null;

  if (hoveredSkillId) {
    const hoveredSkill = gameState.loadedSkills.get(hoveredSkillId);

    if (hoveredSkill) {
      // Determine ghost start time
      let ghostStartTick = gameState.currentTick;

      // If PC has current action, ghost starts after it finishes
      if (gameState.pc.currentAction) {
        const pcAction = pcActions.find(a => a.fighterId === 'pc' && !a.endTick);
        if (pcAction) {
          ghostStartTick = pcAction.phases.recoveryEnd;
        }
      }

      // Calculate ghost impact time (for attacks only)
      let ghostImpactTick: number | undefined;
      if (hoveredSkill.type === 'attack') {
        ghostImpactTick = ghostStartTick + hoveredSkill.phases.impact.tick;
      }

      // Interrupt prediction logic
      let interruptPrediction: 'player_wins' | 'player_loses' | 'none' = 'none';
      let damageIndicatorTick: number | undefined;
      let interruptTick: number | undefined;

      // Check against NPC's current action
      const npcCurrentAction = gameState.npc.currentAction;
      if (npcCurrentAction && hoveredSkill.type === 'attack') {
        const npcAction = npcActions.find(a => a.fighterId === 'npc');

        if (npcAction && npcAction.skill.type === 'attack' && ghostImpactTick) {
          const npcImpactTick = npcAction.startTick + npcAction.skill.phases.impact.tick;

          if (ghostImpactTick < npcImpactTick) {
            // Player wins - interrupt enemy
            interruptPrediction = 'player_wins';
            interruptTick = ghostImpactTick;
          } else if (npcImpactTick < ghostImpactTick) {
            // Player loses - take damage during wind-up/committed
            interruptPrediction = 'player_loses';
            damageIndicatorTick = npcImpactTick;
          }
        }
      }

      ghostPreview = {
        skill: hoveredSkill,
        startTick: ghostStartTick,
        interruptPrediction,
        damageIndicatorTick,
        interruptTick,
      };
    }
  }

  // -------------------------------------------------------------------------
  // LAYOUT CALCULATIONS
  // -------------------------------------------------------------------------

  const timebarHeight = TIMELINE_CONFIG.TIMEBAR_HEIGHT;
  const spacing = TIMELINE_CONFIG.TIMEBAR_SPACING;

  // View mode filtering
  const showPcActual = viewMode === 'debug' || viewMode === 'pc';
  const showPcSeenByNpc = viewMode === 'debug' || viewMode === 'npc';
  const showNpcActual = viewMode === 'debug' || viewMode === 'npc';
  const showNpcSeenByPc = viewMode === 'debug' || viewMode === 'pc';
  const showCombined = viewMode === 'debug';

  // Calculate positions based on which timebars are visible
  let currentY = 0;
  const positions: Record<string, number> = {};

  if (showPcActual) {
    positions.pcActual = currentY;
    currentY += timebarHeight + spacing;
  }
  if (showPcSeenByNpc) {
    positions.pcSeenByNpc = currentY;
    currentY += timebarHeight + spacing;
  }
  if (showNpcActual) {
    positions.npcActual = currentY;
    currentY += timebarHeight + spacing;
  }
  if (showNpcSeenByPc) {
    positions.npcSeenByPc = currentY;
    currentY += timebarHeight + spacing;
  }
  if (showCombined) {
    positions.combined = currentY;
    currentY += timebarHeight + spacing;
  }

  // Calculate total height based on visible timebars
  const visibleCount =
    (showPcActual ? 1 : 0) +
    (showPcSeenByNpc ? 1 : 0) +
    (showNpcActual ? 1 : 0) +
    (showNpcSeenByPc ? 1 : 0) +
    (showCombined ? 1 : 0);
  const totalHeight = (timebarHeight * visibleCount) + (spacing * Math.max(0, visibleCount - 1));

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------

  return (
    <div className="bg-gray-800 rounded px-4 py-2">
      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -2px); }
          75% { transform: translate(-2px, -2px); }
        }
        .timeline-shake {
          animation: shake 0.2s ease-in-out;
        }
      `}</style>

      <h3 className="text-lg font-bold mb-2">
        Combat Timelines
        {viewMode !== 'debug' && (
          <span className="text-xs text-gray-500 ml-2">({viewMode === 'pc' ? 'PC' : 'NPC'} perspective)</span>
        )}
      </h3>

      {/* Timeline viewport (fixed width, clips content) */}
      <div
        ref={viewportRef}
        className={`relative overflow-hidden ${isShaking ? 'timeline-shake' : ''}`}
        style={{
          width: '100%',
          height: `${totalHeight}px`
        }}
      >
        {/* Timeline content (moves left as time advances) */}
        <div
          className="absolute top-0 left-0"
          style={{
            width: `${timelineWidthPx}px`,
            height: `${totalHeight}px`,
            transform: `translateX(${timelineOffsetPx}px)`,
            transition: 'transform 50ms linear', // Smooth movement matching tick interval
          }}
        >
          {/* Timebar labels (fixed on left side) */}
          <div className="absolute left-0 top-0 text-xs text-gray-400 w-32 pointer-events-none">
            {showPcActual && (
              <div style={{ height: `${timebarHeight}px`, lineHeight: `${timebarHeight}px` }}>PC_actual</div>
            )}
            {showPcSeenByNpc && (
              <div
                style={{
                  height: `${timebarHeight}px`,
                  lineHeight: `${timebarHeight}px`,
                  marginTop: showPcActual ? `${spacing}px` : 0,
                }}
              >
                PC_seen_by_NPC
              </div>
            )}
            {showNpcActual && (
              <div
                style={{
                  height: `${timebarHeight}px`,
                  lineHeight: `${timebarHeight}px`,
                  marginTop: showPcActual || showPcSeenByNpc ? `${spacing}px` : 0,
                }}
              >
                NPC_actual
              </div>
            )}
            {showNpcSeenByPc && (
              <div
                style={{
                  height: `${timebarHeight}px`,
                  lineHeight: `${timebarHeight}px`,
                  marginTop: showPcActual || showPcSeenByNpc || showNpcActual ? `${spacing}px` : 0,
                }}
              >
                NPC_seen_by_PC
              </div>
            )}
            {showCombined && (
              <div
                style={{
                  height: `${timebarHeight}px`,
                  lineHeight: `${timebarHeight}px`,
                  marginTop: `${spacing}px`,
                }}
              >
                Combined
              </div>
            )}
          </div>

          {/* Timebar 1: PC_actual */}
          {showPcActual &&
            pcActions.map((action) => renderActionBars(action, positions.pcActual, true, pxPerMs, timebarHeight))}

          {/* Ghost Preview - Render on PC_actual timebar only */}
          {showPcActual && ghostPreview && (() => {
            // Create a temporary ActionHistoryEntry for rendering
            const ghostAction: ActionHistoryEntry = {
              fighterId: 'pc',
              skill: ghostPreview.skill,
              startTick: ghostPreview.startTick,
              endTick: ghostPreview.startTick, // Doesn't matter for rendering
              phases: {
                windUpEnd: ghostPreview.startTick + ghostPreview.skill.phases.windUp.duration,
                committedEnd: ghostPreview.skill.type === 'attack'
                  ? ghostPreview.startTick + ghostPreview.skill.phases.windUp.duration + ghostPreview.skill.phases.committed.duration
                  : undefined,
                activeEnd: ghostPreview.skill.type === 'defense' && ghostPreview.skill.phases.active
                  ? ghostPreview.startTick + ghostPreview.skill.phases.windUp.duration + ghostPreview.skill.phases.active.duration
                  : undefined,
                impactTick: ghostPreview.skill.type === 'attack'
                  ? ghostPreview.startTick + ghostPreview.skill.phases.impact.tick
                  : undefined,
                recoveryEnd: ghostPreview.skill.type === 'attack'
                  ? ghostPreview.startTick + ghostPreview.skill.phases.impact.tick + ghostPreview.skill.phases.recovery.duration
                  : ghostPreview.startTick + ghostPreview.skill.phases.windUp.duration + (ghostPreview.skill.phases.active?.duration || 0) + ghostPreview.skill.phases.recovery.duration,
              },
            };

            return renderActionBars(ghostAction, positions.pcActual, true, pxPerMs, timebarHeight, 0.5, 'ghost-');
          })()}

          {/* Damage Indicator - Red flash where player takes damage */}
          {showPcActual && ghostPreview?.damageIndicatorTick && (
            <div
              className="absolute z-20 animate-pulse"
              style={{
                left: `${ghostPreview.damageIndicatorTick * pxPerMs}px`,
                top: `${positions.pcActual}px`,
                width: '4px',
                height: `${timebarHeight}px`,
                backgroundColor: '#FF3333',
                boxShadow: '0 0 10px #FF3333',
              }}
            />
          )}

          {/* Timebar 2: PC_seen_by_NPC */}
          {showPcSeenByNpc &&
            pcActions.map((action) =>
              renderActionBars(action, positions.pcSeenByNpc, false, pxPerMs, timebarHeight)
            )}

          {/* Timebar 3: NPC_actual */}
          {showNpcActual &&
            npcActions.map((action) => renderActionBars(action, positions.npcActual, true, pxPerMs, timebarHeight))}

          {/* Interrupt Effect - Gray out enemy action + crack texture when player wins */}
          {showNpcActual && ghostPreview?.interruptPrediction === 'player_wins' && ghostPreview.interruptTick && (() => {
            const npcAction = npcActions.find(a => a.fighterId === 'npc');
            if (!npcAction) return null;

            // Calculate the interrupted portion (from interrupt point to end)
            const interruptPx = ghostPreview.interruptTick * pxPerMs;
            const actionEndPx = npcAction.phases.recoveryEnd * pxPerMs;
            const actionStartPx = npcAction.startTick * pxPerMs;

            // Only show if interrupt happens during the action
            if (interruptPx < actionStartPx || interruptPx > actionEndPx) return null;

            return (
              <div
                className="absolute z-10 pointer-events-none"
                style={{
                  left: `${interruptPx}px`,
                  top: `${positions.npcActual}px`,
                  width: `${actionEndPx - interruptPx}px`,
                  height: `${timebarHeight}px`,
                  backgroundColor: 'rgba(85, 85, 85, 0.7)', // Dark gray overlay
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(0,0,0,0.4) 10px,
                    rgba(0,0,0,0.4) 12px
                  )`, // Crack texture
                }}
              />
            );
          })()}

          {/* Timebar 4: NPC_seen_by_PC */}
          {showNpcSeenByPc &&
            npcActions.map((action) =>
              renderActionBars(action, positions.npcSeenByPc, false, pxPerMs, timebarHeight)
            )}

          {/* Timebar 5: Combined (PC on top half, NPC on bottom half) - Debug mode only */}
          {showCombined && (
            <>
              {pcActions.map((action) =>
                renderActionBars(action, positions.combined, false, pxPerMs, timebarHeight / 2)
              )}
              {npcActions.map((action) =>
                renderActionBars(action, positions.combined + timebarHeight / 2, false, pxPerMs, timebarHeight / 2)
              )}
            </>
          )}

          {/* Action bars render here */}
        </div>

        {/* "Now" line indicator (fixed position in viewport, above moving content) */}
        <div
          className="absolute bg-black pointer-events-none"
          style={{
            left: `${nowPositionPx}px`,
            top: 0,
            width: `${TIMELINE_CONFIG.NOW_LINE_WIDTH}px`,
            height: '100%',
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert current in-progress action to history entry format
 */
function convertCurrentActionToHistoryEntry(
  action: ActionState,
  fighterId: 'pc' | 'npc',
  currentTick: number
): ActionHistoryEntry {
  const skill = action.skill;
  const windUpModifier = action.windUpModifier || 0;
  const startTick = currentTick - action.elapsedTime;
  const windUpEnd = startTick + skill.phases.windUp.duration + windUpModifier;

  // Calculate recovery end based on skill type
  let recoveryStart: number;
  if (skill.type === 'attack') {
    recoveryStart = startTick + skill.phases.impact.tick + windUpModifier;
  } else {
    recoveryStart = windUpEnd + (skill.phases.active?.duration || 0);
  }
  const recoveryEnd = recoveryStart + skill.phases.recovery.duration;

  const entry: ActionHistoryEntry = {
    fighterId,
    skill,
    startTick,
    endTick: currentTick, // Current action is still in progress
    phases: {
      windUpEnd,
      recoveryEnd,
    },
    windUpModifier,
  };

  // Add attack-specific phases
  if (skill.type === 'attack') {
    entry.phases.committedEnd =
      startTick + skill.phases.windUp.duration + skill.phases.committed.duration + windUpModifier;
    entry.phases.impactTick = startTick + skill.phases.impact.tick + windUpModifier;
  }

  // Add defense-specific phases
  if (skill.type === 'defense' && skill.phases.active) {
    entry.phases.activeEnd = windUpEnd + skill.phases.active.duration;
  }

  return entry;
}

/**
 * Render an action as phase-colored bars
 */
function renderActionBars(
  action: ActionHistoryEntry,
  yOffset: number,
  showSkillName: boolean,
  pxPerMs: number,
  height: number,
  opacity: number = 1.0, // NEW: Support opacity for ghost preview
  keyPrefix: string = '' // NEW: Key prefix to avoid collisions
): JSX.Element {
  const startPx = action.startTick * pxPerMs;
  const skill = action.skill;

  // Calculate phase widths
  const windUpWidth = skill.phases.windUp.duration * pxPerMs;
  const recoveryWidth = skill.phases.recovery.duration * pxPerMs;

  let committedWidth = 0;
  let activeWidth = 0;

  if (skill.type === 'attack') {
    committedWidth = skill.phases.committed.duration * pxPerMs;
  } else if (skill.type === 'defense' && skill.phases.active) {
    activeWidth = skill.phases.active.duration * pxPerMs;
  }

  return (
    <div
      key={`${keyPrefix}${action.fighterId}-${action.startTick}`}
      className="absolute flex"
      style={{
        left: `${startPx}px`,
        top: `${yOffset}px`,
        height: `${height}px`,
        opacity: opacity,
      }}
    >
      {/* PHASE 1: Wind-up (GREEN) */}
      <div
        className="h-full"
        style={{
          width: `${windUpWidth}px`,
          backgroundColor: '#84db90',
          border: opacity < 1 ? '1px solid #84db90' : 'none', // Highlight border for ghost
        }}
      />

      {/* PHASE 2: Committed (YELLOW) or Active (GREY BAR) */}
      {skill.type === 'attack' ? (
        <div
          className="h-full"
          style={{
            width: `${committedWidth}px`,
            backgroundColor: '#ffc824',
            border: opacity < 1 ? '1px solid #ffc824' : 'none', // Highlight border for ghost
          }}
        />
      ) : (
        <div
          className="h-full"
          style={{
            width: `${activeWidth}px`,
            backgroundColor: '#d9d9d9',
            border: opacity < 1 ? '1px solid #d9d9d9' : 'none', // Highlight border for ghost
          }}
        />
      )}

      {/* PHASE 3: Impact (GREY VERTICAL LINE) - Attacks only */}
      {skill.type === 'attack' && (
        <div
          className="h-full"
          style={{
            width: '2px',
            backgroundColor: '#d9d9d9',
          }}
        />
      )}

      {/* PHASE 4: Recovery (RED) */}
      <div
        className="h-full"
        style={{
          width: `${recoveryWidth}px`,
          backgroundColor: '#db5a5a',
          border: opacity < 1 ? '1px solid #db5a5a' : 'none', // Highlight border for ghost
        }}
      />

      {/* Skill name label (overlay) */}
      {showSkillName && (
        <div className="absolute inset-0 flex items-center pl-2 text-xs text-white font-semibold pointer-events-none">
          {skill.name}
        </div>
      )}

      {/* Time cost label (below bar) - NEW */}
      {showSkillName && (
        <div
          className="absolute top-full left-2 text-[10px] text-gray-400 pointer-events-none whitespace-nowrap"
          style={{ marginTop: '2px' }}
        >
          {skill.type === 'attack'
            ? `${(skill.phases.impact.tick / 1000).toFixed(1)}s`
            : `${((skill.phases.windUp.duration + (skill.phases.active?.duration || 0)) / 1000).toFixed(1)}s`}
        </div>
      )}
    </div>
  );
}
