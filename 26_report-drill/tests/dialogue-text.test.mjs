import test from 'node:test';
import assert from 'node:assert/strict';
import {dialogueHTML,dialogueLength,plainDialogue} from '../src/dialogue-text.mjs';
test('emphasis types visible letters without exposing markup, including emphasis across line breaks',()=>{
 const text='まず**修正\n範囲**を確認';
 assert.equal(dialogueHTML(text,3),'まず<strong>修</strong>');
 assert.equal(dialogueHTML(text,5),'まず<strong>修正\n</strong>');
 assert.equal(plainDialogue(text),'まず修正\n範囲を確認');
 assert.equal(dialogueLength(text),10);
});
test('HTML is escaped except the supported line-break notation',()=>{
 assert.equal(dialogueHTML('**<img src=x onerror=alert(1)>**<br />続き'),'<strong>&lt;img src=x onerror=alert(1)&gt;</strong>\n続き');
 assert.equal(dialogueHTML('未完の**強調'),'未完の**強調');
});
test('typing does not split emoji graphemes',()=>{
 assert.equal(dialogueLength('**👩‍💻**さん'),3);
 assert.equal(dialogueHTML('**👩‍💻**さん',1),'<strong>👩‍💻</strong>');
});
