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

1. **Wind-up:** Preparing an attack. Attack skill user can still cancel out of it by doing feint.
2. **Committed:** Attack skill user has crossed a point of no retun and commited to executing the attack. They cannot feint anymore. The only thing they can do is use `Emergency Defense` skill, cover in twitch movement in hopes to avoid fatal damage.
3. **Impact:** A flash of violence. Unique phase that is a point in time when attack connects it has a tick not a duration.
4. **Recovery:** Time needed after the impact for the attack skill user to regain composure and start preparing a next action. End of your own recovery triggers an auto pause for you.

### For defense actions:

1. **Wind-up:** Preparing a defense. Defense skill user cannot feint out of it. The only thing they can do is use `Emergency Defense` skill, cover in twitch movement in hopes to avoid fatal damage.
2. **Active:** Defense skill user is ready for impact and will mitigate damage or even gain adventage. Active duration end either when the time is up or when there is an impact.
3. **Recovery:** Time needed after the impact or active phase timeout for the defense skill user to regain composure and start preparing a next action. Once Recovery is done auto pause is triggered for the the fight loop repeats until one of the opponents is dead.

### For special actions (Feint):

1. **Wind-up:** represents a time needed for an actor to readjust thinking and change the action to another one.

## Types of timelines/timebars

In game's UI, a timeline is a slice of time.
A horizontal bar taking up all the available space dedicated to it.
It's dynamically udpated when the time is not paused based on cure `current intervalTick` (what is the name of it in our code?)
The x axis starts (`start_x`) at `current intervalTick` minus how many ticks we set up to see in the past (`past-x`). `start_x` = `current intervalTick`- `past-x`
End of x axis (`end_x`) is equal to `start_x` + `zoom-x`. `zoom-x` is something I will adjust based on how it feels and how skill durations will evolve.

1. **Own Actual timebar:** Timebar_PC_actual.tsx for PC, or Timebar_NPC_actual.tsx for NPC
   1. Shows selected skill name on the timeline.
   2. Shows the whole duration of the skill split into phases:
      1. Wind up: bar fill color green #84db90
      2. Committed: bar fill color yellow/gold color #ffc824
      3. Impact: vertical line between Commited and Recovery: steel grey #d9d9d9
      4. Recovery: bar fill color red #db5a5a
   3. If no skill is selected and the user hovers over a skill. Show a 50% transparent duration of the skill split into phases on the timeline. This visualizes what if scenario.
2. **Opponent Predicted timebar:** Timebar_NPC_seen_by_PC.tsx for PC, or Timebar_PC_seen_by_NPC.tsx for NPC
   1. Doesn't show selected skill name on the timeline.
   2. Shows the whole duration of opponents selected skill split into phases:
      1. Wind up: bar fill color green #84db90
      2. Committed: bar fill color yellow/gold color #ffc824
      3. Impact: vertical line between Commited and Recovery: steel grey #d9d9d9
      4. Recovery: bar fill color red #db5a5a
   3. For now it shows what opponent actually selected.
      1. In the next iterations it won't show actual skill but a possible prediction of what can happen:
         1. automated system will tell them what are possible actions the enemy is making and their probability. e.g. "foot back" is a first telegraph for Horizontal Slash and Thrust but not for Overhead Strike, Upward Striket, Diagonal Slash. Chances screen will show 50% Swing and 50% Thrust after first telegraph. Then the Timebar_NPC_seen_by_PC will show min time as Thrust and max time as Horizontal Slash. ItPrediction algorithm

3. **Merged/Combined Actual timebar:** Shows what actually happens for both fighters.
   1. Same height as the other bars but split into 2 smaller but equal horizontal bars. Upper one is for PC, bottom one is for NPC.
   2. Doesn't show selected skill name on the timeline.
   3. Shows the whole duration of the skill split into phases:
      1. Wind up: bar fill color green #84db90
      2. Committed: bar fill color yellow/gold color #ffc824
      3. Impact: vertical line between Commited and Recovery: steel grey #d9d9d9
      4. Recovery: bar fill color red #db5a5a

- **Timebar_NPC_seen_by_PC** displays:
  - Minimum time (fastest possible attack from visible telegraphs)
  - Maximum time (slowest possible attack from visible telegraphs)
  - Uncertainty shading narrows as more telegraphs are revealed
