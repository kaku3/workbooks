export function connectionPath(from, to, failure = false) {
  const w = from.width || 220, h = from.height || 48, tw = to.width || 220, th = to.height || 48;
  const dx = to.x + tw / 2 - from.x - w / 2, dy = to.y + th / 2 - from.y - h / 2;
  if (from.x === to.x && from.y === to.y) return `M${from.x + w},${from.y + h * .3} C${from.x + w + 55},${from.y - 30} ${from.x + w + 55},${from.y + h + 30} ${from.x + w},${from.y + h * .75}`;
  if (Math.abs(dx) < (w + tw) / 2 && Math.abs(dy) >= (h + th) / 2) {
    const sign = dy >= 0 ? 1 : -1, offset = failure ? 12 : -12;
    const x1 = from.x + w / 2 + offset, y1 = from.y + (sign > 0 ? h : 0), x2 = to.x + tw / 2, y2 = to.y + (sign > 0 ? 0 : th);
    const bend = Math.max(20, Math.abs(y2 - y1) / 2);
    return `M${x1},${y1} C${x1},${y1 + bend * sign} ${x2},${y2 - bend * sign} ${x2},${y2}`;
  }
  const sign = dx >= 0 ? 1 : -1;
  const x1 = from.x + (sign > 0 ? w : 0), y1 = from.y + h * (failure ? .72 : .28), x2 = to.x + (sign > 0 ? 0 : tw), y2 = to.y + th / 2;
  const bend = Math.max(30, Math.abs(x2 - x1) / 2);
  return `M${x1},${y1} C${x1 + bend * sign},${y1} ${x2 - bend * sign},${y2} ${x2},${y2}`;
}
