// Injected only into the distribution; never modify the host's URL.
export function initializeRoute(host, now = Date.now()) {
  // Hosting may change its entry path when recreating the game frame.
  const key = 'design-block-drill.plicy.route.v3';
  const read = (storage, name) => {
    try { const value = JSON.parse(host[storage].getItem(name)); return value && typeof value.search === 'string' ? value : null; } catch { return null; }
  };
  const write = (storage, name, value) => { try { host[storage].setItem(name, JSON.stringify(value)); } catch {} };
  const pending = read('localStorage', key + '.pending');
  try { host.localStorage.removeItem(key + '.pending'); } catch {}
  const current = read('sessionStorage', key);
  const params = new URLSearchParams(host.location.search);
  const legacy = params.has('drill') || params.get('mode') === 'story' ? host.location.search : '';
  const search = pending && now - pending.at >= 0 && now - pending.at < 60000 ? pending.search : current?.search ?? legacy;
  host.__designBlockPlicyRouteKey = key;
  host.__designBlockPlicyRouteSearch = search;
  host.__setDesignBlockPlicyRoute = (value, reload = false) => {
    const query = new URLSearchParams(value).toString();
    const record = { search: query ? '?' + query : '', at: Date.now() };
    host.__designBlockPlicyRouteSearch = record.search;
    write('sessionStorage', key, record);
    if (reload) write('localStorage', key + '.pending', record);
  };
  write('sessionStorage', key, { search, at: now });
}
export function gameURL(physicalURL, search) {
  const url = new URL(physicalURL);
  if (search !== undefined) url.search = search;
  url.hash = '';
  return url;
}
function routeWindow() {
  if (!window.__setDesignBlockPlicyRoute) initializeRoute(window);
  return window;
}
const plicyLocation = {
  get href() { const host = routeWindow(); return gameURL(host.location.href, host.__designBlockPlicyRouteSearch).href; },
  get search() { return routeWindow().__designBlockPlicyRouteSearch; },
  assign(destination) {
    const host = routeWindow(), target = new URL(destination, plicyLocation.href);
    host.__setDesignBlockPlicyRoute(target.search, true);
    if (!host.__designBlockPlicyNavigate) throw new Error('In-page navigation is not initialized');
    host.__designBlockPlicyNavigate();
  },
};
const plicyHistory = {
  replaceState(state, title, destination) {
    const target = new URL(destination, plicyLocation.href);
    routeWindow().__setDesignBlockPlicyRoute(target.search);
  },
};
if (typeof window !== 'undefined') {
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a.mode-link');
    if (!anchor || (anchor.target && anchor.target !== '_self')) return;
    event.preventDefault(); plicyLocation.assign(anchor.href);
  });
}
export { plicyLocation as location, plicyHistory as history };

let currentMount = null;
export function __plicyMountToken() { return currentMount; }
export function __plicyIsMountCurrent(token) { return token === currentMount && token?.active; }
export function __plicyAddWindowListener(type, listener, options) {
  globalThis.window.addEventListener(type, listener, options);
  currentMount?.listeners.push([globalThis.window, type, listener, options]);
}
export function __plicyAddDocumentListener(type, listener, options) {
  globalThis.document.addEventListener(type, listener, options);
  currentMount?.listeners.push([globalThis.document, type, listener, options]);
}
function timeout(callback, delay, repeat, args) {
  const scope = currentMount;
  const invoke = () => { if (scope?.active) callback(...args); };
  const id = (repeat ? globalThis.setInterval : globalThis.setTimeout)(invoke, delay);
  scope?.timers.push([repeat, id]); return id;
}
function gameSetTimeout(callback, delay, ...args) { return timeout(callback, delay, false, args); }
function gameSetInterval(callback, delay, ...args) { return timeout(callback, delay, true, args); }
function gameRequestAnimationFrame(callback) {
  const scope = currentMount;
  const id = globalThis.requestAnimationFrame(time => { if (scope?.active) callback(time); });
  scope?.frames.push(id); return id;
}
class GameResizeObserver {
  constructor(callback) {
    const scope = currentMount;
    this.observer = new globalThis.ResizeObserver((...args) => { if (scope?.active) callback(...args); });
    scope?.observers.push(this.observer);
  }
  observe(...args) { return this.observer.observe(...args); }
  unobserve(...args) { return this.observer.unobserve(...args); }
  disconnect() { return this.observer.disconnect(); }
}
export { gameSetTimeout as setTimeout, gameSetInterval as setInterval, gameRequestAnimationFrame as requestAnimationFrame, GameResizeObserver as ResizeObserver };

export function startPlicy(mount) {
  const host = globalThis.window, doc = globalThis.document;
  if (!host.__setDesignBlockPlicyRoute) initializeRoute(host);
  // Replace only our game DOM; leave the hosting page's controls/scripts alone.
  const root = doc.getElementById('plicyGameRoot');
  if (!root) throw new Error('Game root is missing');
  const template = root.cloneNode(true);
  const dispose = () => {
    if (!currentMount) return;
    currentMount.active = false;
    for (const [repeat, id] of currentMount.timers) (repeat ? globalThis.clearInterval : globalThis.clearTimeout)(id);
    for (const id of currentMount.frames) globalThis.cancelAnimationFrame(id);
    for (const observer of currentMount.observers) observer.disconnect();
    for (const [target, type, listener, options] of currentMount.listeners) target.removeEventListener(type, listener, options);
  };
  const render = (replaceRoot = true) => {
    dispose();
    if (replaceRoot) {
      doc.querySelectorAll('.processing-effect,#editorHelpPopup,#operationFloatingHelp').forEach(node => node.remove());
      doc.getElementById('plicyGameRoot').replaceWith(template.cloneNode(true));
    }
    const params = new URLSearchParams(host.__designBlockPlicyRouteSearch);
    doc.documentElement.classList.add('booting');
    doc.documentElement.classList.toggle('title-overlay-active', !params.get('drill') && params.get('mode') !== 'story');
    currentMount = { active: true, timers: [], frames: [], observers: [], listeners: [] };
    mount();
  };
  let queued = false;
  host.__designBlockPlicyNavigate = () => {
    if (queued) return;
    queued = true;
    globalThis.setTimeout(() => { queued = false; render(); }, 0);
  };
  render(false);
}
