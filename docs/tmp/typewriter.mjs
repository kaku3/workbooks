export function dialogueParts(text) {
  const parts = []; let start = 0;
  for (const match of text.matchAll(/\*\*([^*]+)\*\*/g)) {
    if (match.index > start) parts.push({ text: text.slice(start, match.index), strong: false });
    parts.push({ text: match[1], strong: true }); start = match.index + match[0].length;
  }
  if (start < text.length) parts.push({ text: text.slice(start), strong: false });
  return parts;
}
export function typeDialogue(target, text, { delay = 28, onComplete = () => {} } = {}) {
  target.replaceChildren();
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('ja', { granularity: 'grapheme' }) : null;
  const chunks = dialogueParts(text).map(part => {
    const node = part.strong ? document.createElement('strong') : document.createTextNode('');
    target.append(node);
    return { node, letters: segmenter ? [...segmenter.segment(part.text)].map(s => s.segment) : Array.from(part.text) };
  });
  target.setAttribute('aria-label', chunks.map(c => c.letters.join('')).join(''));
  let timer, index = 0, letter = 0, typing = true;
  const complete = () => { if (!typing) return; clearTimeout(timer); chunks.forEach(c => { c.node.textContent = c.letters.join(''); }); typing = false; target.classList.remove('is-typing'); onComplete(); };
  const tick = () => {
    if (!typing) return;
    while (index < chunks.length && letter >= chunks[index].letters.length) { index++; letter = 0; }
    if (index >= chunks.length) { complete(); return; }
    const chunk = chunks[index]; chunk.node.textContent += chunk.letters[letter++]; timer = setTimeout(tick, delay);
  };
  target.classList.add('is-typing');
  if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches || delay === 0) complete(); else tick();
  return { get typing() { return typing; }, finish: complete, destroy() { clearTimeout(timer); typing = false; target.classList.remove('is-typing'); } };
}
