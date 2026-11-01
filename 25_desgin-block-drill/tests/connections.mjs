import assert from 'node:assert/strict';
import { connectionPath } from '../src/connections.mjs';
import { snapPosition } from '../src/snap.mjs';
assert.match(connectionPath({ x: 40, y: 70 }, { x: 40, y: 220 }), /^M138,118 .*150,220$/);
assert.match(connectionPath({ x: 40, y: 220 }, { x: 40, y: 70 }), /^M138,220 .*150,118$/);
assert.match(connectionPath({ x: 40, y: 70 }, { x: 40, y: 220 }, true), /^M162,118/);
assert.match(connectionPath({ x: 330, y: 70 }, { x: 40, y: 70 }), /^M330,/);
assert.equal(snapPosition(900, 80, [], 'a').x, 690);
console.log('PASS: downward/upward/leftward edges, separate branch ports and extended right bound');
