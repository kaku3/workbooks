import assert from 'node:assert/strict';
import { dialogueParts } from '../src/typewriter.mjs';
assert.deepEqual(dialogueParts('早く、**今中に直せますか？！**'), [{ text: '早く、', strong: false }, { text: '今中に直せますか？！', strong: true }]);
assert.deepEqual(dialogueParts('**一つ**と**二つ**'), [{ text: '一つ', strong: true }, { text: 'と', strong: false }, { text: '二つ', strong: true }]);
assert.deepEqual(dialogueParts('<img onerror=alert(1)>'), [{ text: '<img onerror=alert(1)>', strong: false }]);
assert.deepEqual(dialogueParts('**閉じ忘れ'), [{ text: '**閉じ忘れ', strong: false }]);
console.log('PASS: dialogue emphasis, multiple segments, literal HTML and unmatched markers');
