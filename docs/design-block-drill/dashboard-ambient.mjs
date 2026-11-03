// Decorative telemetry only; real execution records are rendered separately.
export function installDashboardAmbient(panel) {
  const layer = document.createElement('div');
  layer.className = 'dashboard-ambient'; layer.setAttribute('aria-hidden', 'true');
  const ns = 'http://www.w3.org/2000/svg';
  const wire = document.createElementNS(ns, 'svg');
  wire.setAttribute('viewBox', '0 0 1440 320'); wire.setAttribute('preserveAspectRatio', 'none'); wire.classList.add('ambient-wire');
  const point = (column, row) => [column * 120 - 60 + (row % 2) * 55, row * 95 - 30 + Math.sin(column * 1.7 + row) * 18];
  const lines = [];
  for (let row = 0; row < 5; row++) for (let column = 0; column < 14; column++) {
    const a = point(column, row);
    for (const b of [point(column + 1, row), ...(row < 4 ? [point(column, row + 1), point(column + 1, row + 1)] : [])]) lines.push(`M${a.join(',')} L${b.join(',')}`);
  }
  const mesh = document.createElementNS(ns, 'path'); mesh.setAttribute('d', lines.join(' ')); mesh.setAttribute('vector-effect', 'non-scaling-stroke'); wire.append(mesh);
  layer.append(wire);
  const bars = document.createElement('div'); bars.className = 'ambient-bars';
  for (let i = 0; i < 12; i++) {
    const bar = document.createElement('i'); bar.style.setProperty('--bar-index', i); bars.append(bar);
  }
  layer.append(bars);
  const pie = document.createElementNS(ns, 'svg'); pie.classList.add('ambient-pie'); pie.setAttribute('viewBox', '0 0 120 120');
  for (const radius of [45, 30]) {
    const circle = document.createElementNS(ns, 'circle'); circle.setAttribute('cx', '60'); circle.setAttribute('cy', '60'); circle.setAttribute('r', radius); pie.append(circle);
  }
  layer.append(pie);
  const stream = document.createElement('div'); stream.className = 'ambient-stream';
  const text = Array.from({ length: 24 }, (_, i) => `${(i * 4093 + 8192).toString(16).padStart(6, '0').toUpperCase()} :: ${['SYNC', 'TRACE', 'BUFFER', 'ROUTE'][i % 4]} / ${(i * 37).toString(16).padStart(4, '0')}`).join('\n') + '\n';
  const pre = document.createElement('pre'); pre.textContent = text + text; stream.append(pre); layer.append(stream);
  panel.prepend(layer);
}
