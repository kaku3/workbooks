export function snapPosition(x, y, nodes, movingId, scale = 1, bypass = false) {
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const threshold = 7 / Math.max(scale, .1);
  function axis(value, key, min, max) {
    value = clamp(value, min, max);
    if (bypass) return { value, aligned: false };
    const candidates = nodes.filter(n => n.id !== movingId && n[key] >= min && n[key] <= max);
    const nearest = candidates.sort((a, b) => Math.abs(a[key] - value) - Math.abs(b[key] - value))[0];
    if (nearest && Math.abs(nearest[key] - value) <= threshold) return { value: nearest[key], aligned: true };
    return { value: clamp(Math.round(value / 20) * 20, min, max), aligned: false };
  }
  const sx = axis(x, 'x', 20, 690), sy = axis(y, 'y', 40, 500);
  return { x: sx.value, y: sy.value, guideX: sx.aligned ? sx.value + 110 : null, guideY: sy.aligned ? sy.value + 24 : null };
}
