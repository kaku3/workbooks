import test from 'node:test';
import assert from 'node:assert/strict';
import {updateChatRead} from '../src/chat-read.mjs';
import {buildChatFeed} from '../src/chat-feed.mjs';
import {cases} from '../src/data/content.mjs';
import {createEngine} from '../src/engine.mjs';
for(const [id,{scenario,problem}] of Object.entries(cases))test(`${id}: unread identity survives saves, counts every new post and clears consistently`,()=>{
 const e=createEngine(problem,scenario),s=e.start();while(s.phase==='scene')e.advance(s,true);e.beginWork(s);
 const old=buildChatFeed(scenario,s);assert.equal(updateChatRead(s,old).count,0);
 s.time=14*60;const feed=buildChatFeed(scenario,s),fresh=feed.filter(item=>!old.some(prior=>prior.key===item.key));
 const result=updateChatRead(s,feed);assert.equal(result.count,fresh.length);assert.equal(result.first,fresh[0].key);
 const restored=e.restore(JSON.stringify(s));assert.equal(updateChatRead(restored,feed).count,fresh.length);assert.equal(updateChatRead(restored,feed).arrivals,0);
 assert.equal(updateChatRead(restored,feed,{acknowledge:true}).count,0);assert.equal(updateChatRead(restored,feed).count,0);
 assert.deepEqual(s.evidence,restored.evidence);assert.deepEqual(s.knowledge,restored.knowledge);assert.deepEqual(s.flags,restored.flags);
});
test('old saves establish a baseline without marking all historical posts unread',()=>{
 const s={};assert.equal(updateChatRead(s,[{key:'old-1'},{key:'old-2'}]).count,0);
 const result=updateChatRead(s,[{key:'old-1'},{key:'old-2'},{key:'casual'},{key:'hint'}]);assert.equal(result.count,2);assert.deepEqual(s.chatRead.unread,['casual','hint']);
});
