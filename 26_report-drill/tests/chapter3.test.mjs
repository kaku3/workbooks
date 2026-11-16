import test from 'node:test';
import assert from 'node:assert/strict';
import {cases} from '../src/data/content.mjs';
import {createEngine} from '../src/engine.mjs';
const {problem,scenario}=cases['bulk-import'],e=createEngine(problem,scenario);
const finish=s=>{for(let i=0;s.phase==='scene'&&i<30;i++)e.advance(s,true);assert.notEqual(s.phase,'scene');};
const start=()=>{const s=e.start();finish(s);e.beginWork(s);return s;};
const run=(s,id,question)=>{const action=problem.investigations.find(a=>a.id==='bi.'+id);question??=action?.questionOptions?.filter(q=>e.matches(q.unlock,s)).at(-1)?.id;assert.equal(e.investigate(s,'bi.'+id,question),true,id);finish(s);};
const walk=(s,ids)=>{for(const entry of ids){const [id,q]=entry.split('/');run(s,id,q);}return s;};
const businessResearch=['business','workbook','screen','mapping','prototype','related','notification','retry','csv-preparation','operations'];
const business=[...businessResearch,'plan/a','estimate','plan-more/b','estimate-update'];
const source=['source','related','notification','retry','plan/a','workbook','mapping','csv-preparation','operations','plan-more/b','estimate/a','estimate-update'];
const screen=['screen','prototype','retry','notification','related','business','workbook','mapping','csv-preparation','operations','plan/a','estimate','plan-more/b','estimate-update'];
const answers=['bi.business','bi.a','bi.b'];
function report(s,cards=answers){s.phase='report';s.selected=cards;e.report(s);const id=s.conversation.ids[0];finish(s);return id;}
test('initial tickets expose the job rather than the eventual solution',()=>{
 const s=start(),visible=problem.investigations.filter(a=>e.matches(a.unlock,s));
 for(const id of ['business','workbook','screen','source','spec','ask-makabe'])assert.ok(visible.some(a=>a.id==='bi.'+id),id);
 assert.doesNotMatch(visible.map(a=>a.title+' '+a.description).join(''),/失敗行|重複防止|全件取消|A案|B案/);
 const intro=scenario.scenes['03.intro'].lines;
 assert.equal(intro[1].speaker,'sales');assert.match(intro[1].text,/10万円/);assert.equal(intro.at(-1).speaker,'lead');
 assert.doesNotMatch(intro.map(l=>l.text).join(''),/正常な行|失敗した行|二つの方式/);
});
test('Excel alone is not operational knowledge; either first-contact route discovers the actual work',()=>{
 const s=start();run(s,'workbook');assert.ok(!s.evidence.includes('bi.work'));
 assert.doesNotMatch(problem.evidence.find(c=>c.id==='bi.workbook').text,/20〜30|50件/);
 walk(s,['screen','mapping']);assert.equal(e.preview(s,'bi.csv-preparation').minutes,35);
 run(s,'csv-preparation');assert.ok(s.evidence.includes('bi.work'));assert.ok(s.evidence.includes('bi.csv-ready'));assert.ok(!s.evidence.includes('bi.business'));
 const t=walk(start(),['business','screen','mapping']);assert.equal(e.preview(t,'bi.csv-preparation').minutes,25);
 run(t,'csv-preparation');run(t,'prototype');run(t,'operations');assert.ok(t.evidence.includes('bi.business'));
});
test('specification shortens source reading and targeted source inspection is enough after the screen',()=>{
 const s=start();assert.equal(e.preview(s,'bi.source').minutes,45);run(s,'spec');assert.equal(e.preview(s,'bi.source').minutes,30);
 run(s,'source');assert.equal(e.preview(s,'bi.related').minutes,20);
 const t=start();assert.equal(e.preview(t,'bi.prototype'),null);run(t,'screen');assert.equal(e.preview(t,'bi.related').minutes,30);assert.ok(e.preview(t,'bi.prototype'));
});
test('trial evidence and source inference stay distinct; later notification correlation is ten minutes',()=>{
 const s=walk(start(),['source','related','notification']);
 assert.ok(!s.evidence.includes('bi.prototype'));assert.ok(!s.evidence.includes('bi.notification-trial'));
 const text=s.history.flatMap(h=>h.ids).flatMap(id=>scenario.scenes[id].lines).map(l=>l.text).join('');
 assert.doesNotMatch(text,/試作で残った|試作の登録番号/);
 run(s,'prototype');assert.equal(e.preview(s,'bi.notification-followup').minutes,10);run(s,'notification-followup');assert.ok(s.evidence.includes('bi.notification-trial'));
 const t=walk(start(),['screen','prototype','notification','related']);
 assert.ok(t.evidence.includes('bi.notification-trial'));assert.equal(t.investigationResults['bi.related'],'03.related-prototype');
 assert.equal(e.preview(t,'bi.notification-followup'),null,'no additional correlation ticket is needed when the trial was already checked');
 assert.match(scenario.scenes['03.prototype'].lines.map(l=>l.text).join(''),/検証用/);
});
test('consultation-first route still reaches a grounded comparison and does not require adopting the macro',()=>{
 const s=walk(start(),['ask-makabe/general','workbook','screen','ask-makabe/excel','mapping','csv-preparation','prototype','related','notification','retry','operations','plan/a','estimate','plan-more/b','estimate-update']);
 assert.equal(s.time,895);assert.ok(s.evidence.includes('bi.macro'));assert.ok(!s.evidence.includes('bi.macro-check'));
 run(s,'lunch');report(s);assert.equal(s.phase,'complete');assert.equal(s.time,965);
});
for(const [name,route,research] of [['business',business,320],['source',source,285],['screen',screen,320]])test(`${name} entry reaches comparison without compulsory consultation or a failed report`,()=>{
 const s=walk(start(),route);assert.equal(s.time,540+research);assert.ok(!s.done.some(k=>k.includes('makabe')));assert.equal(s.chatRead,undefined);
 assert.ok(problem.investigations.some(a=>e.matches(a.unlock,s)&&e.cardStatus(s,a.id)==='todo'));
 run(s,'lunch');assert.equal(report(s),'03.report-3');assert.equal(s.phase,'complete');assert.equal(s.time,540+research+70);
 const ending=scenario.scenes['03.report-3'].lines;
 assert.match(ending.find(l=>l.speaker==='client').text,/持ち帰って/);assert.match(ending.map(l=>l.text).join(''),/概算/);
 if(name==='source')assert.ok(!s.evidence.includes('bi.prototype'));
 if(name==='screen')assert.ok(!s.evidence.includes('bi.source'));
});
test('A-only report is stopped by Makabe, leaves investigations available, then becomes a comparison',()=>{
 const s=walk(start(),['source','related','notification','plan/a','estimate']);
 assert.ok(s.evidence.includes('bi.a'));assert.ok(!s.evidence.includes('bi.b'));
 assert.equal(report(s,['bi.a','bi.source','bi.related']),'03.report-only-a');assert.equal(s.phase,'report');
 assert.ok(scenario.scenes['03.report-only-a'].lines.some(l=>l.speaker==='lead'));
 s.phase='desk';assert.ok(e.preview(s,'bi.workbook'));assert.ok(e.preview(s,'bi.retry'));
 walk(s,['retry','workbook','mapping','csv-preparation','operations','plan-more/b','estimate-update']);
 assert.ok(s.evidence.includes('bi.a')&&s.evidence.includes('bi.b'));run(s,'lunch');assert.equal(report(s),'03.report-3');assert.equal(s.time,905);
});
test('B-only report meets customer cost resistance; A is not generated until explicitly examined',()=>{
 const s=walk(start(),[...businessResearch,'plan/b','estimate']);
 assert.ok(s.evidence.includes('bi.b'));assert.ok(!s.evidence.includes('bi.a'));
 assert.equal(report(s,['bi.b','bi.business','bi.retry']),'03.report-only-b');assert.equal(s.phase,'report');
 assert.ok(scenario.scenes['03.report-only-b'].lines.some(l=>l.speaker==='client'&&/(十日|10日)/.test(l.text.normalize('NFKC'))));
 s.phase='desk';run(s,'plan-more','a');assert.ok(!s.evidence.includes('bi.a'));assert.equal(e.preview(s,'bi.estimate-update','a').minutes,15);run(s,'estimate-update');
 run(s,'lunch');report(s);assert.equal(s.phase,'complete');assert.equal(s.time,940);
});
test('either single proposal can independently continue to both proposals without report-trigger flags',()=>{
 for(const first of ['a','b']){
  const s=walk(start(),[...businessResearch,'plan/'+first,'estimate']);
  run(s,'plan-more',first==='a'?'b':'a');run(s,'estimate-update');report(s);assert.equal(s.phase,'complete');
  assert.equal(s.history.filter(h=>h.label.startsWith('報告 ')).length,1);
 }
});
test('rough estimates require technical grounds but not departmental scope or a completed detailed design',()=>{
 const s=walk(start(),['screen','prototype','plan/b','estimate']);
 assert.ok(!s.evidence.includes('bi.a'));assert.ok(!s.evidence.includes('bi.b'));
 walk(s,['related','notification']);run(s,'estimate-update');assert.ok(!s.evidence.includes('bi.b'));
 run(s,'retry');run(s,'estimate-update');assert.ok(s.evidence.includes('bi.b'));assert.ok(!s.evidence.includes('bi.business'));
 assert.equal(problem.evidence.find(c=>c.id==='bi.b').kind,'proposal');
 assert.match(problem.evidence.find(c=>c.id==='bi.b').text,/概算|程度/);
});
test('technical quotes without operations cannot clear and the three-card report uses actual evidence',()=>{
 const s=walk(start(),['source','related','notification','retry','plan/a','plan-more/b','estimate/a','estimate-update']);
 assert.equal(report(s,['bi.a','bi.b','bi.source']),'03.report-operation');assert.equal(s.completed,false);
 s.phase='desk';walk(s,['workbook','mapping','csv-preparation','operations']);assert.equal(report(s),'03.report-3');assert.equal(s.completed,true);
});
test('each planning and estimate action acquires at most one alternative, even with every technical fact',()=>{
 for(const first of ['a','b']){
  const s=walk(start(),businessResearch);
  assert.equal(e.preview(s,'bi.plan','both'),null,'combined planning is not selectable');
  run(s,'plan',first);assert.ok(!s.evidence.includes('bi.plan-'+(first==='a'?'b':'a')));
  run(s,'plan-more',first==='a'?'b':'a');
  run(s,'estimate',first);assert.ok(s.evidence.includes('bi.'+first));assert.ok(!s.evidence.includes('bi.'+(first==='a'?'b':'a')));
  run(s,'estimate-update');assert.ok(s.evidence.includes('bi.a')&&s.evidence.includes('bi.b'));
 }
 for(const a of problem.investigations)for(const o of a.outcomes)assert.ok((o.evidence||[]).filter(id=>['bi.a','bi.b'].includes(id)).length<=1);
});
test('consultation reacts to selected topic and schedule; experience never confirms scope or a price',()=>{
 const s=start();assert.equal(e.preview(s,'bi.ask-makabe','general').minutes,35);run(s,'ask-makabe','general');run(s,'workbook');
 assert.equal(e.preview(s,'bi.ask-makabe','excel').result.id,'macro');s.time=640;assert.equal(e.preview(s,'bi.ask-makabe','excel').result.id,'busy');
 s.time=840;run(s,'ask-makabe','excel');assert.ok(s.evidence.includes('bi.macro'));assert.ok(!s.evidence.includes('bi.csv-ready'));
 assert.equal(e.preview(s,'bi.ask-makabe','excel').result.id,'excel-again');walk(s,['screen','prototype']);
 assert.equal(e.preview(s,'bi.ask-makabe','technical').result.id,'incident');run(s,'ask-makabe','technical');
 assert.equal(e.preview(s,'bi.ask-makabe','technical').result.id,'incident-again');assert.ok(!s.evidence.includes('bi.a'));
});
test('first lunch is normal, exhausted research is explicit, and repeating it grants nothing',()=>{
 const s=start();run(s,'lunch');assert.deepEqual(s.history.at(-1).ids,['03.lunch']);run(s,'workbook');const before=structuredClone(s);run(s,'workbook');
 assert.deepEqual(s.evidence,before.evidence);assert.deepEqual(s.knowledge,before.knowledge);assert.equal(s.time,before.time+20);
 assert.match(s.history.at(-1).ids.flatMap(id=>scenario.scenes[id].lines).map(l=>l.text).join(''),/これ以上は調べても|意味あるかな/);
});
test('completed tasks are manual; further detail and detours do not select a solution or finish the game',()=>{
 const s=walk(start(),source);for(const id of ['source','related','plan','estimate'])assert.equal(e.cardStatus(s,'bi.'+id),'working');
 run(s,'tables');run(s,'detail');assert.ok(s.evidence.includes('bi.tables'));assert.equal(s.completed,false);assert.equal(s.question,0);
 e.moveCard(s,'bi.source','done');assert.equal(e.cardStatus(s,'bi.source'),'done');assert.equal(s.completed,false);
});
test('interim reports always cost thirty minutes and preserve research into a second day, even when busy',()=>{
 for(const route of [[],['workbook'],['screen','prototype'],source]){
  const s=walk(start(),route);const before=s.time;run(s,'progress');assert.equal(s.time,before+30);assert.equal(s.progressReported,true);
  const cards=[...s.evidence];s.time=1079;run(s,'request');assert.equal(s.phase,'loop');
  const next=e.start(e.restore(JSON.stringify(s)),true);finish(next);assert.deepEqual(next.evidence,cards);assert.equal(next.progressReported,false);
 }
 const s=start();s.time=640;assert.equal(e.preview(s,'bi.progress').result.id,'busy');run(s,'progress');assert.equal(s.time,670);assert.equal(s.progressReported,true);
});
test('new saves resume research, incompatible old chapter-three saves are rejected, other cases stay isolated',()=>{
 const s=walk(start(),source);assert.deepEqual(e.restore(JSON.stringify(s)),s);
 const old={...s,contentVersion:'1:1'};assert.throws(()=>e.restore(JSON.stringify(old)),/版/);
 for(const id of ['watermark','approval-button'])assert.throws(()=>e.restore(JSON.stringify(createEngine(cases[id].problem,cases[id].scenario).start())));
 const late=start();late.time=1079;run(late,'source');assert.equal(late.phase,'gameover');assert.ok(!late.evidence.includes('bi.source'));
});
