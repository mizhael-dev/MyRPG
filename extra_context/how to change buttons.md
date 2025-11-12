# How to find a button tempalte in React+Tailwind

Search for button text, you will find {renderSkillButton('side_slash', '➡️', 'bg-blue-600 hover:bg-blue-700')}
Then search for "const renderSkillButton ="
OR "function renderSkillButton"

Quick Reference:
What you see in the code | What to search for | Where it takes you

{renderSkillButton('side_slash', ...)} | const renderSkillButton = | Line 75 - function definition with all styling

<LineSelectionModal isOpen={...} /> | function LineSelectionModal or export function LineSelectionModal | The component file with its styling

<button className="..." /> | Just look at that line | Styling is right there inline

# How to Change Action Buttons

This guide explains where action buttons are defined and how to modify their heights, padding, and margins.

## Button Definitions Location

All skill buttons (except Wait and Feint) are created by the **`renderSkillButton` function** in:

- **File:** `combat-prototype/src/components/Actions/ActionPanel.tsx`
- **Lines:** 75-189

## Where Buttons Are Called

The `renderSkillButton` function is called **8 times** in the same file (lines 199-206):

```typescript
{
  renderSkillButton(
    "emergency_defense",
    "=�",
    "bg-yellow-600 hover:bg-yellow-700"
  );
}
{
  renderSkillButton("side_slash", "�", "bg-blue-600 hover:bg-blue-700");
}
{
  renderSkillButton("thrust", "=�", "bg-blue-600 hover:bg-blue-700");
}
{
  renderSkillButton("overhead_strike", "", "bg-blue-600 hover:bg-blue-700");
}
{
  renderSkillButton("upward_strike", "", "bg-blue-600 hover:bg-blue-700");
}
{
  renderSkillButton("diagonal_slash", "�", "bg-blue-600 hover:bg-blue-700");
}
{
  renderSkillButton("parry", "=�", "bg-green-600 hover:bg-green-700", () =>
    setShowLineSelection(true)
  );
}
{
  renderSkillButton("retreat", "�", "bg-purple-600 hover:bg-purple-700");
}
{
  renderSkillButton(
    "deflection",
    "�",
    "bg-orange-600 hover:bg-orange-700",
    () => setShowAttackPrediction(true)
  );
}
```

## Special Buttons (Not Using renderSkillButton)

Two buttons are defined inline and don't use the `renderSkillButton` function:

1. **Wait Button** - Lines 196-207
2. **Feint Button** - Lines 209-227

## ONE Place to Change Heights, Padding, Margins

**YES!** There is **ONE central location** to modify all skill buttons:

### Location: `ActionPanel.tsx` Lines 143-170

```typescript
<button
  onClick={onClick || (() => onExecuteSkill(skillId))}
  disabled={!canAct}
  onMouseEnter={handleMouseEnter}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  className={`w-full px-3 py-2 rounded transition-all relative flex items-center gap-3 ${
    canAct
      ? `${colorClass} cursor-pointer`
      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
  }`}
>
  {/* Icon - 2x bigger, left-aligned, vertically centered */}
  <div className="flex-shrink-0">
    <span className="text-3xl">{icon}</span>
  </div>

  {/* Skill name and info container - aligned to left */}
  <div className="flex flex-col items-start flex-1">
    <div className="font-bold text-base leading-tight">{skill.name}</div>
    <div className="text-xs text-white/90 mt-0.5">
      {timingDisplay}
    </div>
    <div className="text-xs text-white/80 mt-0.5">
      Stamina Cost: {staminaCost}
    </div>
  </div>
</button>
```

## Key CSS Classes to Modify

### Line 149 - Main Button Styling

```typescript
className={`w-full px-3 py-2 rounded transition-all relative flex items-center gap-3 ${...}`}
```

**Tailwind Classes Breakdown:**

- `w-full` = full width of container
- `px-3` = horizontal padding (left/right) - 12px
- `py-2` = vertical padding (top/bottom) - 8px
- `gap-3` = spacing between icon and text container - 12px
- `rounded` = border radius (4px)
- `flex items-center` = flexbox with vertical centering
- `relative` = positioning context for tooltip

### Line 157 - Icon Size

```typescript
<span className="text-3xl">{icon}</span>
```

**Icon Size Options:**

- `text-base` = 16px (1rem)
- `text-lg` = 18px (1.125rem)
- `text-xl` = 20px (1.25rem)
- `text-2xl` = 24px (1.5rem)
- `text-3xl` = 30px (1.875rem) � **Current**
- `text-4xl` = 36px (2.25rem)

### Lines 162-168 - Text Spacing

```typescript
<div className="flex flex-col items-start flex-1">
  <div className="font-bold text-base leading-tight">{skill.name}</div>
  <div className="text-xs text-white/90 mt-0.5">  {/* mt-0.5 = 2px top margin */}
    {timingDisplay}
  </div>
  <div className="text-xs text-white/80 mt-0.5">  {/* mt-0.5 = 2px top margin */}
    Stamina Cost: {staminaCost}
  </div>
</div>
```

**Margin Options:**

- `mt-0` = 0px
- `mt-0.5` = 2px � **Current**
- `mt-1` = 4px
- `mt-2` = 8px
- `mt-3` = 12px

## Tailwind Padding/Margin Reference

| Class             | Pixels | Use Case                 |
| ----------------- | ------ | ------------------------ |
| `p-0` / `m-0`     | 0px    | No spacing               |
| `p-0.5` / `m-0.5` | 2px    | Minimal spacing          |
| `p-1` / `m-1`     | 4px    | Tight spacing            |
| `p-2` / `m-2`     | 8px    | Small spacing            |
| `p-3` / `m-3`     | 12px   | Medium spacing � Current |
| `p-4` / `m-4`     | 16px   | Large spacing            |
| `p-5` / `m-5`     | 20px   | Extra large spacing      |

**Directional Variants:**

- `px-*` = horizontal (left + right)
- `py-*` = vertical (top + bottom)
- `pt-*` = top only
- `pb-*` = bottom only
- `pl-*` = left only
- `pr-*` = right only

## To Change Wait and Feint Buttons

If you also want to modify **Wait** and **Feint** buttons to match, edit them separately:

- **Wait Button:** `ActionPanel.tsx` lines 196-207
- **Feint Button:** `ActionPanel.tsx` lines 209-227

You can copy the same className pattern from the skill buttons to maintain consistency.

## Example Modifications

### Make Buttons Taller (More Vertical Padding)

Change `py-2` to `py-3` on line 149:

```typescript
className={`w-full px-3 py-3 rounded transition-all relative flex items-center gap-3 ${...}`}
```

### Increase Spacing Between Icon and Text

Change `gap-3` to `gap-4` on line 149:

```typescript
className={`w-full px-3 py-2 rounded transition-all relative flex items-center gap-4 ${...}`}
```

### Make Icon Smaller

Change `text-3xl` to `text-2xl` on line 157:

```typescript
<span className="text-2xl">{icon}</span>
```

### Increase Space Between Text Lines

Change `mt-0.5` to `mt-1` on lines 163 and 166:

```typescript
<div className="text-xs text-white/90 mt-1">
  {timingDisplay}
</div>
<div className="text-xs text-white/80 mt-1">
  Stamina Cost: {staminaCost}
</div>
```

## Summary

 **One place controls all 8 skill buttons:** Line 149 in `renderSkillButton` function
� **Wait and Feint buttons:** Must be edited separately (but can use same classes)
=� **To make changes:** Modify Tailwind classes on line 149 and the layout structure inside the button

All 8 skill buttons will update automatically when you change the `renderSkillButton` function!
