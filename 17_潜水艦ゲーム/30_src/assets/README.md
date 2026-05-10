# Sprite Assets (Draft)

This folder contains a first-pass sprite sheet for the submarine battle game.

- `spritesheet.svg`: 8x2 grid, each cell is 64x64.
- `spritesheet.json`: frame map for rendering code.

## Notes

- The current game draws most visuals procedurally on canvas.
- This sheet is intended as a visual baseline you can refine.
- If needed, we can export PNG variants (`1x`, `2x`) next.

## Suggested Next Step

1. Load `spritesheet.svg` into an `Image` in `render.js`.
2. Replace drawing of one object type first (e.g., submarine) with `drawImage`.
3. Keep fallback to current vector drawing while migrating.
