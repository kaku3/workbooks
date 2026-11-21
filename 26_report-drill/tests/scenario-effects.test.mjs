import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSceneLines} from '../scripts/scenario-lines.mjs';
import {cases} from '../src/data/content.mjs';
import {createEngine} from '../src/engine.mjs';

test('blackout directives are distinct from dialogue and preserve their order',()=>{
  assert.deepEqual(parseSceneLines('- player: 前の台詞\n- effect: blackout\n- player [thought]: 次の台詞\\n続き','test'),[
    {speaker:'player',text:'前の台詞'},
    {effect:'blackout'},
    {speaker:'player',kind:'thought',text:'次の台詞\n続き'}
  ]);
  assert.throws(()=>parseSceneLines('- effect: typo','test'),/unknown effect: typo/);
});

test('effects at scene boundaries advance without changing time or dropping dialogue',()=>{
  const {problem,scenario:original}=cases.watermark,scenario=structuredClone(original);
  scenario.scenes[scenario.events.intro].lines=parseSceneLines('- effect: blackout\n- player: 前\n- effect: blackout\n- player: 後\n- effect: blackout','test');
  const engine=createEngine(problem,scenario),state=engine.start(),time=state.time;
  for(let index=0;index<5;index++){
    assert.equal(state.conversation.line,index);
    engine.advance(state);
    assert.equal(state.time,time);
  }
  assert.equal(state.phase,'briefing');
  assert.equal(state.history.length,1);
});

test('skipping a scene also skips its effect directives',()=>{
  const {problem,scenario:original}=cases.watermark,scenario=structuredClone(original);
  scenario.scenes[scenario.events.intro].lines=parseSceneLines('- effect: blackout\n- player: 台詞\n- effect: blackout','test');
  const engine=createEngine(problem,scenario),state=engine.start();
  engine.advance(state,true);
  assert.equal(state.phase,'briefing');
  assert.equal(state.conversation,null);
});
