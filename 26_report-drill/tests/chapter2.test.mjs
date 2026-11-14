import test from 'node:test';
import assert from 'node:assert/strict';
import {cases} from '../src/data/content.mjs';
import {createEngine} from '../src/engine.mjs';
import {buildChatFeed} from '../src/chat-feed.mjs';
const {problem,scenario}=cases['approval-button'],e=createEngine(problem,scenario);
const finish=s=>{for(let i=0;s.phase==='scene'&&i<30;i++)e.advance(s,true);assert.notEqual(s.phase,'scene');};
const start=()=>{const s=e.start();finish(s);return s;};
const run=(s,id)=>{assert.equal(e.investigate(s,`ab.${id}`),true,id);finish(s);};
const answers=['ab.purpose-summary','ab.return-flow','ab.impact-summary'];
const prepare=(last='permission')=>{const s=start();for(const id of ['business','workflow','reapply','state',last,'confirm-scope'])run(s,id);return s;};
test('v2 introduction explains why to investigate before estimating without revealing the answer cards',()=>{
 const intro=scenario.scenes[scenario.events.intro].lines;
 const thoughts=intro.filter(line=>line.kind==='thought').map(line=>line.text).join('\n');
 assert.match(thoughts,/経理に何をしたい/);assert.match(thoughts,/修正範囲を確定/);assert.match(thoughts,/見積もり根拠/);
 assert.doesNotMatch(thoughts,/ab\.|3枚|３枚|要約カード/);
 assert.match(problem.requestPurpose,/適正な見積もりの根拠/);
 const reply=scenario.scenes['02.report-purpose'].lines.find(line=>line.speaker==='sales').text;
 assert.match(reply,/ボタン一個分の見積もり/);
 assert.match(scenario.scenes['02.report-scope'].lines.find(line=>line.speaker==='sales').text,/どこまで含める見積もり/);
});
test('Makabe responds to his schedule and the preparation of the question',()=>{
 const s=start();assert.equal(e.preview(s,'ab.ask-makabe').result.id,'busy');
 s.time=11*60;assert.equal(e.preview(s,'ab.ask-makabe').minutes,45);
 run(s,'business');run(s,'reapply');s.time=14*60;
 assert.equal(e.preview(s,'ab.ask-makabe').result.id,'prepared');assert.equal(e.preview(s,'ab.ask-makabe').minutes,10);
});
test('technical research gives useful evidence and knowledge but no successful report',()=>{
 const s=start();for(const id of ['screen','source','api','ui','ai'])run(s,id);
 assert.ok(s.knowledge.system>=5);assert.ok(s.evidence.includes('ab.api'));
 s.phase='report';s.selected=['ab.screen','ab.api','ab.ui'];assert.ok(e.evaluateReport(s).level<3);
 const before=s.time;assert.equal(e.report(s),true);finish(s);assert.equal(s.time,before+10);assert.deepEqual(s.selected,['ab.screen','ab.api','ab.ui']);
});
test('business and workflow alone do not settle scope; repeated reports have the same reaction',()=>{
 const s=start();for(const id of ['business','workflow','reapply'])run(s,id);
 assert.ok(s.evidence.includes('ab.purpose-summary'));assert.ok(!s.evidence.includes('ab.impact-summary'));
 s.phase='report';s.selected=['ab.purpose-summary','ab.return-flow','ab.current'];
 for(let i=0;i<2;i++){assert.equal(e.evaluateReport(s).level,2);const before=s.time;e.report(s);assert.equal(s.conversation.ids[0],'02.report-scope');finish(s);assert.equal(s.time,before+10);}
});
test('a list of possible changes is not a scoped estimate until Mita confirms what is included',()=>{
 const s=start();for(const id of ['business','workflow','reapply','state','permission'])run(s,id);
 s.phase='report';s.selected=['ab.purpose-summary','ab.return-flow','ab.access'];
 assert.equal(e.evaluateReport(s).level,2);assert.ok(!s.evidence.includes('ab.impact-summary'));
 s.phase='desk';run(s,'confirm-scope');s.phase='report';s.selected=answers;
 assert.equal(e.evaluateReport(s).level,3);
 const restored=e.restore(JSON.stringify(s));assert.ok(restored.flags.includes('ab.scope-agreed'));
});
for(const route of ['permission','notification'])test(`three summary cards succeed through ${route}, without implementation comparison`,()=>{
 const s=prepare(route);assert.ok(!s.flags.includes('ab.design'));
 s.phase='report';s.selected=['ab.current','ab.return-flow','ab.impact-summary'];assert.ok(e.evaluateReport(s).level<3,'owning the answer cards alone does not succeed');
 s.selected=answers;assert.equal(e.evaluateReport(s).level,3);e.report(s);finish(s);assert.equal(s.phase,'complete');
 assert.ok(problem.investigations.some(action=>e.cardStatus(s,action.id)==='todo'),'unfinished research is compatible with a successful first report');
});
test('case saves are isolated and second-day work is retained with daily tasks reset',()=>{
 const s=prepare();run(s,'progress');const evidence=[...s.evidence];s.time=e.deadline-1;
 e.investigate(s,'ab.lunch');assert.ok(s.conversation.ids.includes('02.extension'));finish(s);
 const next=e.start(e.restore(JSON.stringify(s)),true);finish(next);assert.equal(next.loop,2);assert.deepEqual(next.evidence,evidence);
 assert.equal(e.preview(next,'ab.progress').replay,false);assert.equal(e.preview(next,'ab.lunch').replay,false);
 const first=createEngine(cases.watermark.problem,cases.watermark.scenario).start();assert.throws(()=>e.restore(JSON.stringify(first)));
});
test('overdue report grants no success and timed chat publishes multiple posts',()=>{
 const s=prepare();assert.ok(buildChatFeed(scenario,s).filter(item=>item.kind==='message').length>3);
 s.phase='report';s.selected=answers;s.time=e.deadline-1;e.report(s);
 assert.equal(s.question,0);assert.ok(s.conversation.ids.includes('02.gameover'));finish(s);assert.equal(s.phase,'gameover');
});
test('equivalent detail cards form a report without requiring the three summary identities',()=>{
 const s=prepare();s.phase='report';s.selected=['ab.pain','ab.flow','ab.agreed-scope'];
 assert.equal(e.evaluateReport(s).level,3);e.report(s);finish(s);assert.equal(s.phase,'complete');
 const other=prepare('notification');other.phase='report';other.selected=['ab.purpose-summary','ab.flow','ab.agreed-scope'];assert.equal(e.evaluateReport(other).level,3);
});
test('technical rechecks remain available, cost time and grant no repeated rewards',()=>{
 let s;
 for(const id of ['screen','source','api','ui','design','ai']){
  s=start();run(s,'screen');run(s,'source');if(id==='design')run(s,'api');
  if(!['screen','source'].includes(id))run(s,id);assert.equal(e.cardStatus(s,'ab.'+id),'todo');
  const before=structuredClone(s),plan=e.preview(s,'ab.'+id);assert.equal(plan.replay,false);assert.equal(plan.result.id,'recheck');
  run(s,id);assert.equal(s.time,before.time+plan.minutes);assert.deepEqual(s.evidence,before.evidence);assert.deepEqual(s.knowledge,before.knowledge);
  assert.equal(scenario.scenes[plan.result.scene].lines.at(-1).text,'これ以上は調べても何も分からなそうだ。');
 }
 const old=structuredClone(s);old.board['ab.api']='done';assert.equal(e.cardStatus(e.restore(JSON.stringify(old)),'ab.api'),'todo');
});
test('report feedback identifies the missing explanation in ordinary customer language',()=>{
 const s=prepare();s.phase='report';s.selected=['ab.current','ab.flow','ab.access'];e.report(s);assert.equal(s.conversation.ids[0],'02.report-purpose');finish(s);
 s.selected=['ab.pain','ab.current','ab.access'];e.report(s);assert.equal(s.conversation.ids[0],'02.report-workflow');
});
