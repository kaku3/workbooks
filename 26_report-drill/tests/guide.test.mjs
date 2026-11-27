import test from 'node:test';
import assert from 'node:assert/strict';
import {createGuideHistory,guideStorageKey,guideDefinitions} from '../src/guide.mjs';

function storage(){const values=new Map();return {getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};}
test('the overview is the first guide, waits for the desk, and is remembered separately',()=>{
  const overview=guideDefinitions[0];
  assert.equal(overview.id,'overview');
  assert.equal(overview.ready({desk:false}),false);
  assert.equal(overview.ready({desk:true}),true);
  assert.deepEqual(overview.targets(),[]);
  assert.equal(overview.ack,'了解した');
  const saved=storage(),history=createGuideHistory(saved);
  history.show('overview');
  assert.equal(createGuideHistory(saved).eligible('overview'),true);
  history.complete('overview');
  const restored=createGuideHistory(saved);
  assert.equal(restored.eligible('overview'),false);
  assert.equal(restored.eligible('task-start'),true);
});
test('guides are shown once, resume pending operations, and survive chapter retries',()=>{
  const saved=storage(),first=createGuideHistory(saved);
  assert.equal(first.eligible('task-start'),true);
  first.show('task-start');
  assert.equal(createGuideHistory(saved).eligible('task-start'),true,'reload resumes the pending operation');
  first.complete('task-start');
  assert.equal(createGuideHistory(saved).eligible('task-start'),false);
  first.show('clue');first.complete('clue');
  assert.equal(createGuideHistory(saved).eligible('clue'),false);
  first.reset();
  assert.equal(saved.getItem(guideStorageKey),undefined);
  assert.equal(createGuideHistory(saved).eligible('task-start'),true);
});
test('corrupt or unavailable storage does not prevent guiding in this session',()=>{
  for(const saved of [undefined,{getItem(){throw Error('denied');},setItem(){throw Error('denied');},removeItem(){throw Error('denied');}},{getItem:()=>'{broken'},{getItem:()=>JSON.stringify({seen:'invalid',pending:{}})}]){
    const history=createGuideHistory(saved);history.show('clue');history.complete('clue');assert.equal(history.eligible('clue'),false);history.reset();assert.equal(history.eligible('clue'),true);
  }
});
test('sharing guide waits for the request; selecting requires three available clues',()=>{
  const share=guideDefinitions.find(def=>def.id==='share'),select=guideDefinitions.find(def=>def.id==='select');
  const context={report:true,meeting:{phase:'speaking',requestReady:false,share:false},selected:0,clueCount:2};
  assert.equal(share.ready(context),false);
  context.meeting.requestReady=true;assert.equal(share.ready(context),true);
  context.meeting.share=true;assert.equal(share.ready(context),false);assert.equal(select.ready(context),false);
  context.clueCount=3;assert.equal(select.ready(context),true);
  context.selected=3;assert.equal(select.ready(context),false);
});
test('history guidance requires a completed task and adapts its explanation to the visible panel',()=>{
  const history=guideDefinitions.find(def=>def.id==='history');
  assert.equal(history.ready({historyReady:false,historyEntry:{}}),false);
  assert.equal(history.ready({historyReady:true,historyEntry:null}),false);
  assert.equal(history.ready({historyReady:true,historyEntry:{}}),true);
  assert.ok(history.text({chatShown:false}).includes('チャットアイコン'));
  assert.ok(history.text({chatShown:true}).includes('chatbot'));
  assert.ok(guideDefinitions.indexOf(history)>guideDefinitions.findIndex(def=>def.id==='task-done'));
  assert.ok(guideDefinitions.indexOf(history)<guideDefinitions.findIndex(def=>def.id==='report-tab'));
});
test('return guidance is only for an insufficient report and precedes meeting entry on reload',()=>{
  const back=guideDefinitions.find(def=>def.id==='back-to-investigate');
  assert.equal(back.ready({report:false,reportRejected:true}),false,'dialogue and ending screens never show it');
  assert.equal(back.ready({report:true,reportRejected:false}),false,'fresh meetings and accepted reports never show it');
  assert.equal(back.ready({report:true,reportRejected:true}),true);
  assert.deepEqual(back.actions,['investigate']);
  assert.ok(guideDefinitions.indexOf(back)<guideDefinitions.findIndex(def=>def.id==='join'));
});
test('task completion guides clicking the working card and then the popup Done button',()=>{
  const guide=guideDefinitions.find(def=>def.id==='task-done');
  const card={dataset:{action:'investigate:wm.purpose-check'}},done={dataset:{action:'task-status:done'}};
  const context={desk:true,doneCards:[card],taskDoneButton:null};
  assert.equal(guide.drop,undefined);
  assert.equal(guide.ready(context),true);
  assert.deepEqual(guide.targets(context),[card]);
  assert.deepEqual(guide.actions(context),['investigate:wm.purpose-check']);
  context.taskDoneButton=done;
  assert.deepEqual(guide.targets(context),[done]);
  assert.deepEqual(guide.actions(context),['task-status:done']);
  assert.ok(guide.text(context).includes('ポップアップ'));
});
