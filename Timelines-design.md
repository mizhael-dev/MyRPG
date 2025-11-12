# Timeline Mechanics Summary

- **Atomic Resolution:** both actors update each tick; no “turn order.”
- **Auto Pause = User Action opportunity:** The game auto pausese on certain events giving an opportunity to select a skill.
  - Opponents telegraphs will give an opportunity for you to act and select a skill.
    - Your own telegraphs do not grant an opportunity to change the skill (there is no new information for you, so no need for you to act).
  - End of your own recovery triggers an auto pause for you.
- **Defense Window:** begins once windup completes and has an active duration in ms.
- **Pause Triggers:** new telegraph info revealed or expiring choice (not implemented expiring choice).
- **Outcome Logic:** a defense succeeds if active during Impact tick; otherwise the hit lands.

## Phases

Phases are important part of timeline.

### For attack actions:

1. **Wind-up:** Preparing an attack. Attack skill user can still cancel out of it by doing feint. (color green #84db90)
2. **Committed:** Attack skill user has crossed a point of no retun and commited to executing the attack. They cannot feint anymore. The only thing they can do is use `Emergency Defense` skill, cover in twitch movement in hopes to avoid fatal damage. (color yellow/gold color #ffc824)
3. **Impact:** A flash of violence. Unique phase that is a point in time when attack connects it has a tick not a duration. (color steel grey #d9d9d9)
4. **Recovery:** Time needed after the impact for the attack skill user to regain composure and start preparing a next action. End of your own recovery triggers an auto pause for you. (color red #db5a5a)

### For defense actions:

1. **Wind-up:** Preparing a defense. Defense skill user cannot feint out of it. The only thing they can do is use `Emergency Defense` skill, cover in twitch movement in hopes to avoid fatal damage. (color green #84db90)
2. **Active:** Defense skill user is ready for impact and will mitigate damage or even gain adventage. Active duration end either when the time is up or when there is an impact.(color steel grey #d9d9d9)
3. **Recovery:** Time needed after the impact or active phase timeout for the defense skill user to regain composure and start preparing a next action. Once Recovery is done auto pause is triggered for the the fight loop repeats until one of the opponents is dead. (color red #db5a5a)

### For special actions (Feint):

1. **Wind-up:** represents a time needed for an actor to readjust thinking and change the action to another one.

## Implementation Location

All timebars are implemented in a single file:
- **File:** `combat-prototype/src/components/Timeline/TimelinePanel.tsx`
- **Timebars rendered:**
  1. `PC_actual` - Own Actual timebar for PC (shows skill name)
  2. `PC_seen_by_NPC` - Opponent Predicted timebar from NPC perspective (no skill name)
  3. `NPC_actual` - Own Actual timebar for NPC (shows skill name)
  4. `NPC_seen_by_PC` - Opponent Predicted timebar from PC perspective (no skill name)
  5. `Combined` - Merged/Combined Actual timebar (split horizontally, no skill names)

## Configuration

Timeline behavior is controlled by constants in `TimelinePanel.tsx`:
- **PAST_MS:** How many milliseconds of history to show by default (default: 1000ms)
- **ZOOM_MS:** Total visible timeframe in milliseconds (default: 3000ms)
- **PX_PER_MS:** Pixel-to-millisecond ratio (calculated responsively with min/max bounds)

**IMPORTANT:** `PAST_MS` cannot be greater than `ZOOM_MS`

Example valid configurations:
- ✓ `PAST_MS = 1000`, `ZOOM_MS = 3000` (show 1s past in 3s window)
- ✓ `PAST_MS = 500`, `ZOOM_MS = 2000` (show 0.5s past in 2s window)
- ✗ `PAST_MS = 5000`, `ZOOM_MS = 3000` (invalid - can't show 5s past in 3s window)

## Types of timelines/timebars

In game's UI, a timeline is a slice of time.
A horizontal bar taking up all the available space dedicated to it.
It's dynamically updated when the time is not paused based on `currentTick` (GameEngine.ts).
The x axis starts (`start_x`) at `currentTick` minus how many ticks we set up to see in the past (`PAST_MS`). `start_x` = `currentTick - PAST_MS`
End of x axis (`end_x`) is equal to `start_x` + `ZOOM_MS`. `ZOOM_MS` is adjustable based on how it feels and how skill durations will evolve.

1. **Own Actual timebar:** PC_actual or NPC_actual
   1. Shows selected skill name on the timeline.
   2. Shows the whole duration of the skill split into phases:
      1. Wind up: bar fill color green #84db90
      2. Committed: bar fill color yellow/gold color #ffc824
      3. Impact: vertical line between Commited and Recovery: steel grey #d9d9d9
      4. Recovery: bar fill color red #db5a5a
   3. If no skill is selected and the user hovers over a skill. Show a 50% transparent duration of the skill split into phases on the timeline. This visualizes what if scenario.
2. **Opponent Predicted timebar:** NPC_seen_by_PC or PC_seen_by_NPC
   1. Doesn't show selected skill name on the timeline.
   2. Shows the whole duration of opponents selected skill split into phases:
      1. Wind up: bar fill color green #84db90
      2. Committed: bar fill color yellow/gold color #ffc824
      3. Impact: vertical line between Commited and Recovery: steel grey #d9d9d9
      4. Recovery: bar fill color red #db5a5a
   3. For now it shows what opponent actually selected.
      1. In the next iterations it won't show actual skill but a possible prediction of what can happen:
         1. automated system (PredictionEngine) will tell them what are possible actions the enemy is making and their probability. e.g. "foot back" is a first telegraph for Horizontal Slash and Thrust but not for Overhead Strike, Upward Striket, Diagonal Slash. Chances screen will show 50% Swing and 50% Thrust after first telegraph. Then the Timebar_NPC_seen_by_PC will show min time as Thrust and max time as Horizontal Slash. ItPrediction algorithm

3. **Merged/Combined Actual timebar:** Shows what actually happens for both fighters.
   1. Same height as the other bars but split into 2 smaller but equal horizontal bars. Upper one is for PC, bottom one is for NPC.
   2. Doesn't show selected skill name on the timeline.
   3. Shows the whole duration of the skill split into phases:
      1. Wind up: bar fill color green #84db90
      2. Committed: bar fill color yellow/gold color #ffc824
      3. Impact: vertical line between Commited and Recovery: steel grey #d9d9d9
      4. Recovery: bar fill color red #db5a5a

- **Timebar_NPC_seen_by_PC** displays (After PredictionEngine is implemented):
  - Minimum time (fastest possible attack from visible telegraphs)
  - Maximum time (slowest possible attack from visible telegraphs)
  - Uncertainty shading narrows as more telegraphs are revealed
