// Clamp one shared delta so spacing is preserved at the canvas boundaries.
export function groupDelta(positions, dx, dy, width) {
  const minX = Math.min(...positions.map(p => p.x));
  const maxX = Math.max(...positions.map(p => p.x));
  const minY = Math.min(...positions.map(p => p.y));
  const maxY = Math.max(...positions.map(p => p.y));
  return {
    x: Math.max(20 - minX, Math.min(width - 200 - maxX, dx)),
    y: Math.max(40 - minY, Math.min(500 - maxY, dy)),
  };
}
