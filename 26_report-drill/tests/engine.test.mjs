import test from 'node:test';
import assert from 'node:assert/strict';
import {createEngine,minutes} from '../src/engine.mjs';
import {cases,problem,scenario} from '../src/data/content.mjs';
import {findTimeSavings} from '../src/cost-effects.mjs';
import {buildChatFeed} from '../src/chat-feed.mjs';
const e=createEngine(problem,scenario);
const finish=s=>{for(let i=0;s.phase==='scene'&&i<30;i++)e.advance(s,true);assert.notEqual(s.phase,'scene');};
const start=()=>{const s=e.start();finish(s);e.beginWork(s);return s;};
const run=(s,id,q)=>{assert.equal(e.investigate(s,id,q),true,id);finish(s);};
const route=['wm.purpose-check','wm.design','wm.docs-external','wm.docs-detail','wm.source','wm.logs','wm.source-backend','wm.source-pdf','wm.settings','wm.debugger','wm.verify','wm.response'];
const ready=()=>{const s=start();route.forEach(id=>run(s,id));return s;};
const answers=[['wm.case','wm.retired','wm.logs'],['wm.defaults','wm.debug','wm.repro'],['wm.defaults','wm.impact','wm.response']];
const submit=(s,cards)=>{s.phase='report';s.selected=cards;assert.equal(e.report(s),true);finish(s);};
const available=s=>problem.investigations.filter(a=>e.matches(a.unlock,s)).map(a=>a.id);

test('opening conversation leads to a saved overview and work starts explicitly',()=>{
 const s=e.start();finish(s);assert.equal(s.phase,'briefing');
 assert.equal(e.elapse(s,300000),false);assert.equal(s.time,540);
 assert.equal(e.investigate(s,'wm.source'),false);
 const restored=e.restore(JSON.stringify(s));assert.equal(restored.phase,'briefing');
 assert.equal(e.beginWork(restored),true);assert.equal(restored.phase,'desk');
 assert.equal(e.beginWork(restored),false);assert.equal(restored.time,540);
 const oldOpening=e.start();oldOpening.conversation.after='desk';
 const migrated=e.restore(JSON.stringify(oldOpening));finish(migrated);assert.equal(migrated.phase,'briefing');
});

test('manual completion and reopening preserve time, with repeats charging time and no duplicate rewards',()=>{
 const s=start();run(s,'wm.source');assert.equal(e.cardStatus(s,'wm.source'),'working');
 assert.ok(!s.history.at(-1).ids.includes(scenario.events.noProgress));
 e.moveCard(s,'wm.source','done');const completed=e.restore(JSON.stringify(s));assert.equal(e.cardStatus(completed,'wm.source'),'done');
 const before=structuredClone(s);run(s,'wm.source');assert.equal(s.time,before.time+120);
 assert.deepEqual(s.evidence,before.evidence);assert.deepEqual(s.knowledge,before.knowledge);
 assert.ok(s.history.at(-1).ids.includes(scenario.events.noProgress));assert.equal(e.cardStatus(s,'wm.source'),'working');
});

test('real time advances one hour per five minutes, preserving fractional minutes across events and saves',()=>{
 const s=start();
 assert.equal(e.elapse(s,2500),false);assert.equal(s.time,540);
 const restored=e.restore(JSON.stringify(s));
 e.elapse(restored,2500);assert.equal(restored.time,541);
 e.elapse(restored,300000);assert.equal(restored.time,601);
 e.investigate(restored,'wm.lunch');const before=restored.time;
 e.elapse(restored,300000);assert.equal(restored.time,before);
 finish(restored);e.elapse(restored,5000);assert.equal(restored.time,before+1);
 restored.phase='report';const reportTime=restored.time,remainder=restored.timerRemainder;
 assert.equal(e.elapse(restored,300000),false);assert.equal(restored.time,reportTime);assert.equal(restored.timerRemainder,remainder);
 restored.phase='desk';e.elapse(restored,5000);assert.equal(restored.time,reportTime+1);
});

test('lunch costs one hour and Makabe progress costs thirty minutes and earns a second day',()=>{
 const s=start();run(s,'wm.lunch');assert.equal(s.time,600);
 run(s,'wm.progress');assert.equal(s.time,630);assert.equal(s.progressReported,true);
 e.elapse(s,3000000);assert.equal(s.time,e.deadline);
 assert.ok(s.conversation.ids.includes(scenario.events.extension));
 finish(s);assert.equal(s.phase,'loop');
 const next=e.start(s,true);finish(next);
 assert.equal(next.loop,2);assert.equal(next.progressReported,false);
 assert.equal(e.cardStatus(next,'wm.lunch'),'todo');
 assert.equal(e.preview(next,'wm.progress').replay,false);
});

test('timer expiry without progress queues Makabe reprimand and game over, once only',()=>{
 const s=start();s.time=e.deadline-1;
 e.elapse(s,5000);assert.equal(s.phase,'scene');
 assert.ok(s.conversation.ids.includes(scenario.events.gameover));
 const count=s.history.length;e.elapse(s,300000);assert.equal(s.history.length,count);
 finish(s);assert.equal(s.phase,'gameover');
 e.elapse(s,300000);assert.equal(s.time,e.deadline);
});

test('report reactions depend on explanation elements, not the number of cards',()=>{
 for(const [level,cards] of [
  [0,['wm.screen','wm.architecture','wm.detail']],
  [1,['wm.defaults','wm.debug','wm.response']],
  [2,['wm.case','wm.retired','wm.logs']],
  [3,['wm.defaults','wm.impact','wm.response']],
 ]){
  const s=start();s.evidence=problem.evidence.map(card=>card.id);s.phase='report';s.selected=cards;
  assert.equal(e.evaluateReport(s).level,level);const time=s.time;
  assert.equal(e.report(s),true);assert.equal(s.time-time,10);
  assert.equal(s.history.at(-1).report.level,level);
  assert.equal(s.conversation.ids[0],`01.report-${level}`);
  const lines=scenario.scenes[s.conversation.ids[0]].lines;
  assert.equal(lines[0].speaker,'player');assert.ok(lines.some(line=>line.speaker==='client'));
  finish(s);assert.equal(s.phase,level===3?'complete':'report');
 }
});

test('old report progress migrates while retaining investigation evidence',()=>{
 const s=ready();delete s.reportModel;s.question=2;
 const restored=e.restore(JSON.stringify(s));assert.equal(restored.question,0);
 assert.deepEqual(restored.evidence,s.evidence);assert.equal(restored.reportModel,2);
});

test('rejected report retains the hand and resumes reporting, including after reload',()=>{
 const s=ready();s.phase='report';s.selected=['wm.case','wm.retired','wm.logs'];s.reportSlots=[...s.selected];
 const cards=[...s.selected];assert.equal(e.report(s),true);
 assert.equal(s.conversation.after,'report');
 const restored=e.restore(JSON.stringify(s));finish(restored);
 assert.equal(restored.phase,'report');assert.deepEqual(restored.selected,cards);assert.deepEqual(restored.reportSlots,cards);
 restored.time=1070;assert.equal(e.report(restored),true);finish(restored);
 assert.equal(restored.phase,'gameover','a rejected report at the deadline still terminates');
});

test('documents and source entry reveal three branches; PDF requires backend first',()=>{
 const s=start(),initial=available(s);run(s,'wm.design');
 assert.deepEqual(available(s).filter(id=>!initial.includes(id)),['wm.docs-screen','wm.docs-external','wm.docs-detail']);
 const before=available(s),time=s.time;run(s,'wm.source');assert.equal(s.time-time,30);
 assert.deepEqual(available(s).filter(id=>!before.includes(id)),['wm.source-backend','wm.source-frontend','wm.source-common']);
 assert.equal(e.preview(s,'wm.source-pdf'),null);run(s,'wm.docs-detail');assert.equal(e.preview(s,'wm.source-pdf'),null);
 run(s,'wm.source-backend');assert.ok(available(s).includes('wm.source-pdf'));assert.ok(available(s).includes('wm.settings'));
});
test('old specifications shorten corresponding source reading without proving the cause',()=>{
 const s=start();run(s,'wm.source');run(s,'wm.design');
 assert.equal(e.preview(s,'wm.source-frontend').minutes,120);assert.equal(e.preview(s,'wm.source-backend').minutes,180);
 run(s,'wm.docs-screen');assert.equal(e.preview(s,'wm.source-frontend').minutes,20);
 run(s,'wm.docs-external');assert.equal(e.preview(s,'wm.source-backend').minutes,60);
 run(s,'wm.source-backend');assert.equal(e.preview(s,'wm.source-pdf').minutes,120);
 run(s,'wm.docs-detail');assert.equal(e.preview(s,'wm.source-pdf').minutes,20);
 assert.equal(s.evidence.includes('wm.defaults'),false);assert.equal(e.preview(s,'wm.verify'),null);
});
test('logs remain working and preparation changes repeated results',()=>{
 const s=start();run(s,'wm.logs');assert.equal(s.time,585);assert.equal(s.evidence.length,0);assert.equal(e.cardStatus(s,'wm.logs'),'working');
 run(s,'wm.logs');assert.equal(s.time,630);assert.equal(s.done.filter(k=>k==='wm.logs:default').length,1);
 run(s,'wm.purpose-check');run(s,'wm.logs');assert.ok(s.evidence.includes('wm.logs'));assert.equal(e.cardStatus(s,'wm.logs'),'working');
 const before=structuredClone(s);run(s,'wm.logs');assert.equal(s.time-before.time,30);assert.deepEqual(s.evidence,before.evidence);assert.deepEqual(s.knowledge,before.knowledge);
});
test('debugger remains working after a saved miss and can be retried after narrowing the path',()=>{
 const s=start();e.investigate(s,'wm.debugger');const next=e.restore(JSON.stringify(s));finish(next);
 assert.equal(e.cardStatus(next,'wm.debugger'),'working');assert.equal(next.evidence.length,0);
 run(next,'wm.purpose-check');run(next,'wm.logs');run(next,'wm.debugger');assert.ok(next.evidence.includes('wm.debug'));
 const before=structuredClone(next);run(next,'wm.debugger');assert.equal(next.time-before.time,30);assert.deepEqual(next.knowledge,before.knowledge);
});
test('useful and unhelpful work both remain working until manually moved',()=>{
 const s=start();run(s,'wm.source');assert.equal(e.cardStatus(s,'wm.source'),'working');
 const before=structuredClone(s);run(s,'wm.source-common');assert.equal(s.time-before.time,45);assert.deepEqual(s.evidence,before.evidence);assert.deepEqual(s.knowledge,before.knowledge);assert.equal(e.cardStatus(s,'wm.source-common'),'working');
 assert.ok(!s.history.at(-1).ids.includes(scenario.events.noProgress));
 run(s,'wm.source-common');assert.ok(s.history.at(-1).ids.includes(scenario.events.noProgress));
 run(s,'wm.legacy');assert.equal(e.cardStatus(s,'wm.legacy'),'working');
});
test('history records real gains, discoveries and final status without inventing capped gains',()=>{
 const s=start();run(s,'wm.source');const row=s.history.at(-1);
 assert.equal(row.changes.minutes,120);assert.equal(row.changes.knowledge.system,1);assert.equal(row.changes.unlocked.length,3);assert.equal(row.changes.board[0].to,'working');
 assert.deepEqual(e.restore(JSON.stringify(s)).history.at(-1).changes,row.changes);
 run(s,'wm.source-common');assert.equal(s.history.at(-1).changes.board[0].to,'working');
 const capped=start();capped.knowledge.system=8;run(capped,'wm.source');assert.deepEqual(capped.history.at(-1).changes.knowledge,{});
});
test('root-cause route reproduces the incident and completes on the first day',()=>{
 const s=ready();assert.ok(s.evidence.includes('wm.repro'));assert.ok(s.evidence.includes('wm.impact'));
 answers.forEach(cards=>submit(s,cards));assert.equal(s.phase,'complete');assert.equal(s.completed,true);assert.equal(s.loop,1);assert.ok(s.time<=1080);assert.equal(s.helpUsed.length,0);
});
test('general hypotheses, duplicate clues and forged clues cannot replace evidence',()=>{
 const s=ready();run(s,'wm.ai');submit(s,['wm.case','wm.retired','wm.cache']);assert.equal(s.question,0);assert.equal(s.history.at(-1).ids[0],'01.report-1');
 s.phase='report';s.selected=['wm.case','wm.case','wm.logs'];assert.equal(e.report(s),false);
 s.selected=['wm.case','wm.retired','unknown'];assert.equal(e.report(s),false);s.selected=[];submit(s,answers[0]);assert.equal(s.question,0);
});
test('discarding is free and does not grant clues; completed one-time investigations do not duplicate rewards',()=>{
 const s=start();e.moveCard(s,'wm.purpose-check','done');assert.equal(s.time,540);assert.deepEqual(s.evidence,[]);
 e.moveCard(s,'wm.purpose-check','todo');e.moveCard(s,'wm.purpose-check','working');finish(s);assert.equal(e.cardStatus(s,'wm.purpose-check'),'working');assert.equal(s.time,560);
 const before=structuredClone(s);run(s,'wm.purpose-check');assert.equal(s.time,before.time+20);assert.equal(s.history.length,before.history.length+1);assert.deepEqual(s.knowledge,before.knowledge);assert.ok(s.history.at(-1).ids.includes(scenario.events.noProgress));
});
test('interim report earns one extra day, keeping clues, knowledge, work and accepted answers',()=>{
 const s=ready();submit(s,answers[0]);e.statusReport(s,'progress');finish(s);e.statusReport(s,'cannot');assert.ok(s.conversation.ids.includes(scenario.events.extension));assert.ok(!s.conversation.ids.includes(scenario.events.dream));finish(s);assert.equal(s.phase,'loop');
 const next=e.start(s,true);assert.deepEqual(next.conversation.ids,[scenario.events.nextDay]);finish(next);assert.equal(next.loop,2);assert.equal(next.time,540);assert.equal(next.question,0);
 assert.deepEqual(next.evidence,s.evidence);assert.deepEqual(next.knowledge,s.knowledge);assert.deepEqual(next.board,s.board);assert.equal(next.progressReported,false);
 e.statusReport(next,'progress');finish(next);e.timeout(next);finish(next);assert.equal(next.phase,'gameover');
});
test('missing clues or no time still allow a terminal report; first report at deadline cannot earn extension',()=>{
 for(const time of [540,1079,1080]){const s=start();s.phase='report';s.time=time;assert.equal(e.report(s),false);e.statusReport(s,'cannot');finish(s);assert.equal(s.phase,'gameover');assert.equal(e.restore(JSON.stringify(s)).phase,'gameover');}
 const late=start();late.time=1080;e.statusReport(late,'progress');finish(late);assert.equal(late.phase,'gameover');
 const early=start();early.time=1079;e.statusReport(early,'progress');finish(early);assert.equal(early.phase,'loop');
});
test('success at exact deadline wins over timeout',()=>{
 const s=ready();submit(s,answers[0]);submit(s,answers[1]);s.time=1070;submit(s,answers[2]);assert.equal(s.phase,'complete');assert.equal(s.time,1080);
 const late=start();late.time=1079;assert.equal(e.preview(late,'wm.logs').allowed,true);
});
test('workday is nine to eighteen, with one hour of lunch and eight hours of work',()=>{
 assert.equal(minutes(problem.clock.start),540);assert.equal(e.deadline,1080);
 const lunch=problem.investigations.find(action=>action.id==='wm.lunch').outcomes[0].minutes;
 assert.equal(lunch,60);assert.equal(e.deadline-minutes(problem.clock.start)-lunch,480);
});
test('an investigation that crosses closing time immediately times out without granting its result',()=>{
 const s=start();s.time=e.deadline-1;
 const before=structuredClone(s);
 assert.equal(e.preview(s,'wm.purpose-check').allowed,true);
 assert.equal(e.investigate(s,'wm.purpose-check'),true);
 assert.equal(s.time,e.deadline);assert.deepEqual(s.conversation.ids,[scenario.events.timeout,scenario.events.gameover]);
 assert.deepEqual(s.evidence,before.evidence);assert.deepEqual(s.knowledge,before.knowledge);assert.deepEqual(s.done,before.done);
 assert.equal(s.history.at(-1).changes.minutes,1);
 finish(s);assert.equal(s.phase,'gameover');assert.equal(e.restore(JSON.stringify(s)).phase,'gameover');
});
test('crossing closing time honours an earlier progress report, but an unfinished progress task earns no extension',()=>{
 const s=start();run(s,'wm.progress');s.time=e.deadline-10;
 assert.equal(e.moveCard(s,'wm.lunch','working'),true);
 assert.deepEqual(s.conversation.ids,[scenario.events.timeout,scenario.events.extension]);
 assert.equal(e.cardStatus(s,'wm.lunch'),'todo');finish(s);assert.equal(s.phase,'loop');
 const late=start();late.time=e.deadline-10;e.investigate(late,'wm.progress');
 assert.equal(late.progressReported,false);finish(late);assert.equal(late.phase,'gameover');
});
test('a report crossing closing time starts timeout rather than succeeding',()=>{
 const s=ready();s.phase='report';s.selected=answers[2];s.time=e.deadline-1;
 assert.equal(e.report(s),true);assert.equal(s.question,0);assert.equal(s.time,e.deadline);
 assert.deepEqual(s.conversation.ids,[scenario.events.timeout,scenario.events.gameover]);finish(s);assert.equal(s.phase,'gameover');
});
test('Makabe offers a grounded hint after log correlation, without exposing PDF internals',()=>{
 const s=start();run(s,'wm.ask-makabe','general');assert.equal(e.cardStatus(s,'wm.ask-makabe'),'working');
 run(s,'wm.purpose-check');run(s,'wm.logs');s.time=minutes('11:00');assert.equal(e.preview(s,'wm.ask-makabe','pdf-location').result.id,'specific');
 run(s,'wm.ask-makabe','pdf-location');assert.ok(s.flags.includes('wm.source-hint'));assert.equal(e.preview(s,'wm.source-pdf'),null);
});
test('coffee is limited; save data and chat remain consistent',()=>{
 const s=start();run(s,'wm.coffee');assert.deepEqual(s.evidence,[]);assert.equal(e.preview(s,'wm.coffee').allowed,false);
 s.time=minutes('11:00');assert.equal(e.chat(s).length,7);assert.deepEqual(e.chat(e.restore(JSON.stringify(s))),e.chat(s));
 assert.throws(()=>e.restore('{bad'));s.contentVersion='1:1';assert.throws(()=>e.restore(JSON.stringify(s)));
});
test('time-saving effects detect real discounts, including locked future tasks',()=>{
 const s=start();run(s,'wm.source');run(s,'wm.design');
 const before=structuredClone(s);run(s,'wm.docs-external');
 const savings=findTimeSavings(e,problem,before,s);
 assert.deepEqual(savings.map(({id,from,to,saved,revealed})=>({id,from,to,saved,revealed})),[{id:'wm.source-backend',from:180,to:60,saved:120,revealed:true}]);
 const beforeDetail=structuredClone(s);run(s,'wm.docs-detail');
 const pdf=findTimeSavings(e,problem,beforeDetail,s).find(item=>item.id==='wm.source-pdf');
 assert.equal(pdf.saved,100);assert.equal(pdf.revealed,false);
 const clockOnly=structuredClone(s);clockOnly.time=800;
 assert.deepEqual(findTimeSavings(e,problem,s,clockOnly),[],'schedule changes do not masquerade as learning effects');
});
test('completing work is not a cost reduction, nor is a discount on an already completed task',()=>{
 const s=start(),before=structuredClone(s);run(s,'wm.source');
 assert.equal(findTimeSavings(e,problem,before,s).some(item=>item.id==='wm.source'),false);
 run(s,'wm.source-frontend');run(s,'wm.design');const read=structuredClone(s);run(s,'wm.docs-screen');
 assert.equal(findTimeSavings(e,problem,read,s).some(item=>item.id==='wm.source-frontend'),false);
});
test('chat publishes results and reached messages only after the event finishes',()=>{
 const s=e.start();assert.equal(buildChatFeed(scenario,s).some(item=>item.kind==='history'),false);
 finish(s);assert.equal(buildChatFeed(scenario,s).filter(item=>item.kind==='history').length,1);e.beginWork(s);
 const before=buildChatFeed(scenario,s);e.investigate(s,'wm.logs');
 assert.equal(s.time,585);assert.deepEqual(buildChatFeed(scenario,s).map(item=>item.key),before.map(item=>item.key));
 const restored=e.restore(JSON.stringify(s));assert.deepEqual(buildChatFeed(scenario,restored).map(item=>item.key),before.map(item=>item.key));
 finish(restored);const feed=buildChatFeed(scenario,restored);
 assert.ok(feed.some(item=>item.kind==='history' && item.index===1));
 assert.ok(feed.some(item=>item.kind==='message' && item.time===585));
 assert.equal(new Set(feed.map(item=>item.key)).size,feed.length);
});
test('chat history retains the cost reduction as part of the completed event',()=>{
 const s=start();run(s,'wm.source');run(s,'wm.design');e.investigate(s,'wm.docs-external');
 const index=s.conversation.historyIndex;assert.equal(buildChatFeed(scenario,s).some(item=>item.key===`history:${index}`),false);
 finish(s);const entry=buildChatFeed(scenario,s).find(item=>item.key===`history:${index}`);
 assert.ok(entry.item.changes.savings.some(saving=>saving.id==='wm.source-backend'&&saving.saved===120));
});

test('reading a document pays for itself even with its initial overview cost',()=>{
 for(const [document,target] of [['wm.design','wm.source'],['wm.docs-screen','wm.source-frontend'],['wm.docs-external','wm.source-backend'],['wm.docs-detail','wm.source-pdf']]){
  const s=start();run(s,'wm.source');run(s,'wm.source-backend');
  const raw=e.preview(s,target).minutes,before=s.time;
  if(document!=='wm.design')run(s,'wm.design');run(s,document);
  const prepared=e.preview(s,target).minutes;
  assert.ok(raw-(s.time-before)-prepared>=60,`${document} must save at least one hour after paying for preparation`);
 }
});
test('logs and external design each save time, and using both is better than either alone',()=>{
 const raw=180,s=start();run(s,'wm.purpose-check');run(s,'wm.source');
 const beforeLogs=s.time;run(s,'wm.logs');assert.equal(e.preview(s,'wm.source-backend').minutes,90);
 assert.ok(raw-90>s.time-beforeLogs);
 const beforeDocs=s.time;run(s,'wm.design');run(s,'wm.docs-external');
 assert.equal(e.preview(s,'wm.source-backend').minutes,20);
 assert.ok(90-20>s.time-beforeDocs);
 const other=start();run(other,'wm.design');run(other,'wm.docs-external');run(other,'wm.source');run(other,'wm.purpose-check');
 const before=other.time;run(other,'wm.logs');assert.ok(60-e.preview(other,'wm.source-backend').minutes>other.time-before);
});
test('prepared route leaves time for lunch and thought, while brute force runs out before reporting',()=>{
 const prepared=ready();run(prepared,'wm.lunch');submit(prepared,answers[2]);assert.equal(prepared.phase,'complete');assert.equal(prepared.time,895);
 const brute=start();
 for(const id of ['wm.purpose-check','wm.source','wm.source-backend','wm.source-pdf','wm.settings','wm.debugger','wm.verify','wm.response']){
  if(brute.phase!=='desk')break;run(brute,id);
 }
 assert.equal(brute.phase,'gameover');assert.ok(!brute.evidence.includes('wm.response'));
 for(const [skip,expected] of [['wm.docs-detail',975],['wm.docs-external',945]]){
  const s=start();route.filter(id=>id!==skip).forEach(id=>run(s,id));run(s,'wm.lunch');submit(s,answers[2]);assert.equal(s.phase,'complete');assert.equal(s.time,expected);
 }
});


for(const [id,{scenario,problem}] of Object.entries(cases))test(`${id}: first daily lunch and first coffee never receive a repeated-work thought`,()=>{
 const e=createEngine(problem,scenario),s=e.start();
 const finish=state=>{while(state.phase==='scene')e.advance(state,true);};
 finish(s);e.beginWork(s);
 const lunch=problem.lunchAction||'wm.lunch',coffee=problem.coffeeAction||'wm.coffee';
 e.investigate(s,lunch);assert.ok(!s.conversation.ids.includes(scenario.events.noProgress));finish(s);
 e.investigate(s,lunch);assert.ok(s.conversation.ids.includes(scenario.events.noProgress));finish(s);
 e.investigate(s,coffee);assert.ok(!s.conversation.ids.includes(scenario.events.noProgress));finish(s);
 e.statusReport(s,'progress');finish(s);e.timeout(s);finish(s);assert.equal(s.phase,'loop');
 const next=e.start(s,true);finish(next);
 const lunchScene=problem.investigations.find(action=>action.id===lunch).outcomes.find(result=>result.id==='default').scene;
 assert.ok(!next.flags.includes(lunch));assert.equal(e.cardStatus(next,lunch),'todo');
 const before=next.time;e.investigate(next,lunch);
 assert.deepEqual(next.conversation.ids,[lunchScene]);assert.equal(next.time,before+60);finish(next);
 const restored=e.restore(JSON.stringify(next));
 assert.ok(restored.done.includes(`${lunch}:default`),'a real second-day lunch stays consumed after reload');
});

test('an existing second-day save with only the previous lunch flag can take lunch normally',()=>{
 const {problem,scenario}=cases['bulk-import'],e=createEngine(problem,scenario);
 const s=e.fresh();s.loop=2;s.flags=['bi.lunch','bi.source'];
 s.done=['bi.lunch:recheck'];s.board['bi.lunch']='working';s.investigationResults['bi.lunch']='03.recheck';
 const restored=e.restore(JSON.stringify(s));
 assert.ok(restored.flags.includes('bi.source'));assert.equal(e.cardStatus(restored,'bi.lunch'),'todo');
 e.investigate(restored,'bi.lunch');assert.deepEqual(restored.conversation.ids,['03.lunch']);assert.equal(restored.time,600);
});
