import assert from 'node:assert/strict';
import { initializeRoute, gameURL, location as route, history as routeHistory } from '../scripts/plicy-navigation.mjs';
const physical = 'https://html5.example.test/play/index.html?gameId=123&token=host-value';
const local = new Map(), session = new Map();
const storage = map => ({ getItem:key=>map.get(key)||null, setItem:(key,value)=>map.set(key,value), removeItem:key=>map.delete(key) });
let renders = 0;
function host(sessionMap = session) {
  const location = Object.freeze({ href:physical, search:'?gameId=123&token=host-value', hash:'', reload(){throw new Error('Page reload is forbidden');} });
  return { document:{baseURI:physical}, location, localStorage:storage(local), sessionStorage:storage(sessionMap), __designBlockPlicyNavigate(){renders++;} };
}
let current=host();globalThis.window=current;initializeRoute(current);
assert.equal(route.search,'');
route.assign('https://html5.example.test/play/index.html?drill=order-basics&mode=story&replay=1');
assert.equal(renders,1);assert.equal(current.location.href,physical);
assert.equal(current.location.hash,'');
// Model the platform recreating the iframe, with session storage unavailable.
current=host(new Map());globalThis.window=current;initializeRoute(current);
assert.equal(new URLSearchParams(route.search).get('drill'),'order-basics');
assert.equal(new URLSearchParams(route.search).get('mode'),'story');
assert.equal(new URLSearchParams(route.search).get('replay'),'1');
assert.equal(local.has(current.__designBlockPlicyRouteKey+'.pending'),false,'pending route must be consumed');
route.assign('https://html5.example.test/play/index.html?drill=security-lock');
current=host(new Map());current.document.baseURI='https://html5.example.test/recreated/entry.html';globalThis.window=current;initializeRoute(current);
assert.equal(new URLSearchParams(route.search).get('drill'),'security-lock','host entry path changes must not lose pending state');
route.assign('https://html5.example.test/play/index.html?drill=order-basics&mode=story&replay=1');
current=host(new Map());globalThis.window=current;initializeRoute(current);
const cleaned=new URL(route.href);cleaned.searchParams.delete('replay');routeHistory.replaceState(null,'',cleaned.href);
assert.equal(new URLSearchParams(route.search).has('replay'),false);
assert.equal(current.location.href,physical);
route.assign('https://html5.example.test/play/index.html');
current=host();globalThis.window=current;initializeRoute(current);
assert.equal(route.search,'');assert.equal(current.location.href,physical);
assert.equal(gameURL(physical,'?drill=security-login').searchParams.get('drill'),'security-login');
assert.equal(gameURL(physical,'').search,'');
// Stale pending data must not unexpectedly open a stage in a later session.
const key=current.__designBlockPlicyRouteKey;
local.set(key+'.pending',JSON.stringify({search:'?drill=security-system',at:Date.now()-120000}));
current=host(new Map());initializeRoute(current);assert.equal(current.__designBlockPlicyRouteSearch,'');
delete globalThis.window;
console.log('PASS: URL unchanged, stored routing, recreated iframe, replay cleanup, title return and expired pending data');
