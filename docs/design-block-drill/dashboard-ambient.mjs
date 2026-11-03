// Decorative telemetry only; real execution records are rendered separately.
export function installDashboardAmbient(panel) {
  const layer = document.createElement('div');
  layer.className = 'dashboard-ambient'; layer.setAttribute('aria-hidden', 'true');
  const ns = 'http://www.w3.org/2000/svg';
  const wire = document.createElementNS(ns, 'svg');
  wire.setAttribute('viewBox', '0 0 260 180'); wire.classList.add('ambient-wire');
  for (let i = 0; i < 5; i++) {
    const polygon = document.createElementNS(ns, 'polygon');
    polygon.setAttribute('points', '130,15 225,60 225,120 130,165 35,120 35,60');
    polygon.setAttribute('transform', `rotate(${i * 18} 130 90) scale(${1 - i * .12}) translate(${i * 18} ${i * 12})`);
    wire.append(polygon);
  }
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
