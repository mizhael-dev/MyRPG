# Telegraph Assets

This folder contains visual assets for telegraph animations.

## File Naming Convention

Assets are referenced by `assetId` in skill JSON files.

For each `assetId`, you can have:
- `{assetId}.png` - Static image
- `{assetId}.mp4` - Video animation
- `{assetId}_anim.json` - Animation data

**Examples:**
- `shoulders_tense.png`
- `shoulders_tense_anim.json`
- `blade_rises_high.mp4`

## During Prototyping

Missing assets will use `placeholder.png` automatically.
The build script warns about missing assets but doesn't fail.

## Asset Reuse

Multiple skills can share the same `assetId`.
Example: Both "Horizontal Strike" and "Overhead Strike" use `shoulders_tense` for stage 1.
