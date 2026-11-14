import { findTimeSavings } from './cost-effects.mjs';

export const minutes = text => { const [h, m] = text.split(':').map(Number); return h * 60 + m; };
export const clock = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
export const duration = value => `${value >= 60 ? `${Math.floor(value / 60)}h` : ''}${value % 60 || value === 0 ? `${value % 60}m` : ''}`;

export function createEngine(problem, scenario) {
  const deadline = minutes(problem.clock.deadline);
  const allCards = new Set(problem.evidence.map(card => card.id));
  function fresh(previous = {}, nextLoop = false) {
    return {
      saveVersion: 1, reportModel: 2, caseId:problem.caseId, contentVersion: `${problem.version}:${scenario.version}`, phase: 'desk',
      time: minutes(problem.clock.start), loop: nextLoop ? (previous.loop || 1) + 1 : 1,
      knowledge: Object.fromEntries(Object.entries(problem.knowledge).map(([key, value]) => [key, value.initial])),
      intuition: 0, memories: [],
      grown: [], completed: false, seen: previous.seen || [],
      settings: previous.settings || { instant: false, reduced: false },
      evidence: [], acquired: {}, flags: [], done: [], helpUsed: [], question: 0, selected: [], history: [],
      conversation: null, settled: false, board: {}, investigationResults: {}, progressReported: false,
    };
  }
  function matches(condition, state, context = {}) {
    return Object.entries(condition || {}).every(([key, value]) => {
      switch (key) {
        case 'all': return value.every(item => matches(item, state, context));
        case 'any': return value.some(item => matches(item, state, context));
        case 'evidenceAll': return value.every(id => state.evidence.includes(id));
        case 'memoryAny': return value.some(id => state.memories.includes(id));
        case 'knowledgeAtLeast': return Object.entries(value).every(([key, n]) => state.knowledge[key] >= n);
        case 'intuitionAtLeast': return state.intuition >= value;
        case 'flagsAll': return value.every(id => state.flags.includes(id));
        case 'flagAbsent': return !state.flags.includes(value);
        case 'availabilityIn': return value.includes(scenario.schedules.lead.find(item => minutes(item.from) <= state.time && state.time < minutes(item.to))?.state);
        case 'questionIs': return context.questionId === value;
        case 'selectedAll': return value.every(id => state.selected.includes(id));
        case 'selectedAny': return value.some(id => state.selected.includes(id));
        default: throw new Error(`Unknown condition: ${key}`);
      }
    });
  }
  function snapshot(state) { return structuredClone(state); }
  function changes(before, state) {
    if(!before)return {};
    return {
      minutes: state.time-before.time,
      knowledge: Object.fromEntries(Object.keys(state.knowledge).map(key=>[key,state.knowledge[key]-before.knowledge[key]]).filter(([,value])=>value)),
      evidence: state.evidence.filter(id=>!before.evidence.includes(id)),
      unlocked: problem.investigations.filter(action=>!matches(action.unlock,before)&&matches(action.unlock,state)).map(action=>action.id),
      board: problem.investigations.filter(action=>cardStatus(before,action.id)!==cardStatus(state,action.id)).map(action=>({id:action.id,from:cardStatus(before,action.id),to:cardStatus(state,action.id)})),
      questions: state.question-before.question,
      progressReported: !before.progressReported && state.progressReported,
      intuition: state.intuition-before.intuition,
      savings: findTimeSavings({matches},problem,before,state),
    };
  }
  function queue(state, ids, after = 'desk', label = '', replay = false, before = null) {
    state.conversation = { ids, scene: 0, line: 0, after, label, replay };
    state.phase = 'scene';
    if (!replay) {
      state.history.push({ day:state.loop, time: state.time, ids: [...ids], label, selected: [...state.selected], changes:changes(before,state) });
      state.conversation.historyIndex=state.history.length-1;
    }
  }
  function settle(state) {
    if (state.settled) return;
    const remembered = problem.loop.memoryCandidates.filter(id => state.memories.includes(id) || state.evidence.includes(id)).slice(0, problem.loop.maxMemories);
    const newlyGrown = remembered.filter(id => !state.grown.includes(id));
    if (newlyGrown.length) state.intuition = Math.min(problem.intuition.max, state.intuition + problem.loop.intuitionGainPerNewMemoryLoop);
    state.grown = [...new Set([...state.grown, ...newlyGrown])];
    state.memories = remembered;
    state.settled = true;
  }
  function timeout(state, before=snapshot(state)) {
    state.time = deadline;
    endAttempt(state,[scenario.events.timeout],'期限を迎えた',before);
  }
  // One game minute passes per five real seconds; events never consume real time.
  function elapse(state, elapsedMs) {
    if (state.phase !== 'desk' || !Number.isFinite(elapsedMs) || elapsedMs <= 0) return false;
    const total = (state.timerRemainder || 0) + elapsedMs;
    const elapsedMinutes = Math.floor(total / 5000);
    state.timerRemainder = total % 5000;
    if (!elapsedMinutes) return false;
    state.time = Math.min(deadline, state.time + elapsedMinutes);
    if (state.time >= deadline) timeout(state);
    return true;
  }
  function endAttempt(state, ids, label, before) {
    const extend=Boolean(state.progressReported && state.loop===1);
    const scene=extend?scenario.events.extension:state.loop>1?scenario.events.extensionUsed:scenario.events.gameover;
    queue(state,[...ids,scene],extend?'loop':'gameover',label,false,before);
  }
  function advance(state, skip = false) {
    if (state.phase !== 'scene') return;
    const c = state.conversation;
    const id = c.ids[c.scene];
    const scene = scenario.scenes[id];
    if (!skip && c.line + 1 < scene.lines.length) { c.line++; return; }
    const seen = `${id}:${scene.version}`;
    if (!state.seen.includes(seen)) state.seen.push(seen);
    c.line = 0; c.scene++;
    if (c.scene < c.ids.length) return;
    const actionId=c.actionId||c.completedActionId;
    if (actionId) {
      const target=c.returnStatus||'done';
      (state.board ??= {})[actionId] = target;
      const entry=state.history[c.historyIndex];
      if(entry) {
        entry.changes ??= {};
        entry.changes.board ??= [];
        const change=entry.changes.board.find(item=>item.id===actionId);
        if(change)change.to=target;else entry.changes.board.push({id:actionId,from:'working',to:target});
      }
    }
    state.conversation = null;
    state.phase = c.after;
    if (['loop', 'complete'].includes(state.phase)) {
      const intuition=state.intuition;settle(state);
      if(state.history[c.historyIndex] && state.intuition>intuition) {
        const entry=state.history[c.historyIndex];entry.changes??={};entry.changes.intuition=(entry.changes.intuition||0)+state.intuition-intuition;
      }
      if (state.phase === 'complete') state.completed = true;
    }
    if (['desk','report'].includes(state.phase) && state.time >= deadline && !c.replay) timeout(state);
  }
  function preview(state, id, questionId, rerun = false) {
    const action = problem.investigations.find(item => item.id === id) || problem.help.cards.find(item => item.id === id);
    if (!action || !matches(action.unlock, state)) return null;
    if (action.questionOptions && !action.questionOptions.some(item => item.id === questionId && matches(item.unlock, state))) return null;
    const result = action.outcomes.find(item => matches(item.when, state, { questionId }));
    const key = `${action.id}:${result.id}`;
    const isHelp = problem.help.cards.some(item => item.id === id);
    const repeatable=Boolean(action.repeatable || result.complete===false);
    const replay = !rerun && !isHelp && !repeatable && state.done.includes(key);
    const exhausted = isHelp && state.helpUsed.filter(item => item === id).length >= action.usesPerLoop;
    return { action, result, key, replay, canRerun: repeatable || !state.done.includes(key), minutes: replay ? 0 : result.minutes, allowed: !exhausted };
  }
  function investigate(state, id, questionId, rerun = false) {
    if (state.phase !== 'desk') return false;
    const plan = preview(state, id, questionId, rerun);
    if (!plan?.allowed) return false;
    const { action, result, replay } = plan;
    if (replay) return true;
    if (rerun && !plan.canRerun) return false;
    const before=snapshot(state);
    if(state.time+result.minutes>deadline){timeout(state,before);return true;}
    if (!replay) {
      state.time += result.minutes;
      if (result.progressReported) state.progressReported = true;
      if (problem.help.cards.some(item => item.id === id)) state.helpUsed.push(id);
      if (!state.done.includes(plan.key)) {
        state.done.push(plan.key);
        for (const [key, value] of Object.entries(result.gain || {})) state.knowledge[key] = Math.min(problem.knowledge[key].max, state.knowledge[key] + value);
        for (const card of result.evidence || []) {
          if (!state.evidence.includes(card)) { state.evidence.push(card); state.acquired[card] = state.time; }
        }
        state.flags = [...new Set([...state.flags, ...(result.flags || [])])];
      }
    }
    for(const card of problem.derivedEvidence||[]) {
      if(!state.evidence.includes(card.id)&&matches(card.when,state)){state.evidence.push(card.id);state.acquired[card.id]=state.time;}
    }
    if (problem.investigations.some(item=>item.id===id)) {
      (state.board ??= {})[id] = 'working';
      (state.investigationResults ??= {})[id] = result.scene;
    }
    const summary = replay ? `${action.title} · 再読` : `${action.title} · ${duration(result.minutes)}経過`;
    queue(state, [result.scene], 'desk', summary, replay,before);
    if (problem.investigations.some(item=>item.id===id)) {
      state.conversation.actionId=id;
      state.conversation.returnStatus=result.complete===false||action.repeatable?'todo':'done';
    }
    return true;
  }
  function cardStatus(state, id) {
    return state.board?.[id] || (state.done.some(key=>key.startsWith(`${id}:`)) ? 'done' : 'todo');
  }
  function moveCard(state, id, target) {
    if (state.phase !== 'desk' || !['todo','working','done'].includes(target)) return false;
    const action = problem.investigations.find(item=>item.id===id);
    if (!action || !matches(action.unlock,state)) return false;
    if (cardStatus(state,id) === target) return true;
    const before=snapshot(state);
    if (target === 'working') {
      const question = action.questionOptions?.filter(item=>matches(item.unlock,state)).at(-1)?.id;
      if (preview(state,id,question)?.replay) {
        (state.board ??= {})[id]=target;
        state.history.push({day:state.loop,time:state.time,ids:[],label:`${action.title} · 移動`,selected:[],changes:changes(before,state)});
        return true;
      }
      return investigate(state,id,question);
    }
    (state.board ??= {})[id] = target;
    state.history.push({day:state.loop,time:state.time,ids:[],label:`${action.title} · 移動`,selected:[],changes:changes(before,state)});
    return true;
  }
  function evaluateReport(state, q = problem.questions[state.question]) {
    if (!q?.elements) return null;
    const elements=Object.fromEntries(q.elements.map(element=>[element.id,matches(element.when,state)]));
    const conflict=Boolean(q.conflict && matches(q.conflict,state));
    const primary=q.primaryElement||q.elements[0].id;
    const relevant=q.relevant?matches(q.relevant,state):Object.values(elements).some(Boolean);
    const primaryMet=q.primaryWhen?matches(q.primaryWhen,state):elements[primary];
    const level=conflict ? 1 : Object.values(elements).every(Boolean) ? 3 : primaryMet ? 2 : relevant ? 1 : 0;
    return {level,elements,conflict};
  }
  function report(state) {
    if (state.phase !== 'report') return false;
    const q = problem.questions[state.question];
    if (!q || state.selected.length !== q.slots || new Set(state.selected).size !== q.slots || !state.selected.every(id => state.evidence.includes(id))) return false;
    const before=snapshot(state);
    if(state.time+q.minutes>deadline){timeout(state,before);return true;}
    const evaluation=evaluateReport(state,q);
    const rejected = q.reject.find(item => matches(item.when, state));
    const accepted = !rejected && q.accept.find(item => matches(item.when, state));
    state.time += q.minutes;
    const missing=evaluation&&q.elements.find(element=>!evaluation.elements[element.id]);
    const feedback=evaluation&&evaluation.level>0&&missing?q.missingReactions?.[missing.id]:null;
    const ids = [evaluation ? feedback||q.reactions[evaluation.level] : rejected?.scene || accepted?.scene || q.fallback];
    const label = `報告 ${state.question + 1} · ${duration(q.minutes)}経過`;
    if (evaluation ? evaluation.level===3 : accepted) state.question++;
    const complete = state.question === problem.questions.length;
    if (complete) ids.push(scenario.events.clear);
    queue(state, ids, complete ? 'complete' : 'report', label,false,before);
    if(evaluation)state.history.at(-1).report=evaluation;
    if(complete)state.selected = [];
    return true;
  }
  function statusReport(state, mode) {
    if (!['desk','report'].includes(state.phase) || !['progress','cannot'].includes(mode)) return false;
    const before=snapshot(state);
    const cost = Math.min(5, Math.max(0, deadline-state.time));
    state.time += cost;
    if(mode==='progress' && before.time<deadline)state.progressReported=true;
    const end = mode === 'cannot' || state.time >= deadline;
    const ids=[mode==='cannot'?scenario.events.cannot:scenario.events.progress];
    const label=mode==='cannot'?'終わりません報告':'途中経過の報告';
    if(end)endAttempt(state,ids,label,before);else queue(state,ids,'desk',label,false,before);
    state.selected = [];
    return true;
  }
  function restore(text) {
    const state = JSON.parse(text);
    if(state?.caseId && state.caseId!==problem.caseId)throw new Error('別の案件の保存データです。');
    if(state && state.reportModel!==2){
      state.question=state.completed||state.phase==='complete'?problem.questions.length:0;
      state.selected=[];state.reportModel=2;
      if(state.phase==='scene' && state.conversation?.ids?.some(id=>/^01\.q[123]-/.test(id))){state.phase='desk';state.conversation=null;}
    }
    if (!state || state.saveVersion !== 1 || state.contentVersion !== `${problem.version}:${scenario.version}`) throw new Error('保存データの版が現在の原稿と異なります。');
    if (!['desk','report','scene','loop','complete','gameover'].includes(state.phase) || !Number.isInteger(state.time) || state.time < minutes(problem.clock.start) || state.time > deadline || !Number.isInteger(state.question) || state.question < 0 || state.question > problem.questions.length) throw new Error('保存データの進行状態を読み取れません。');
    state.progressReported ??= state.history?.some(entry=>entry.label==='途中経過の報告' && (entry.day??1)===state.loop) || false;
    if(state.phase==='loop' && (!state.progressReported || state.loop>1))state.phase='gameover';
    if(state.phase==='scene' && state.conversation?.ids?.includes(scenario.events.dream)) {
      const c=state.conversation,extend=state.progressReported&&state.loop===1;
      if(c.ids[c.scene]===scenario.events.dream)c.line=0;
      c.ids=c.ids.map(id=>id===scenario.events.dream?(extend?scenario.events.extension:state.loop>1?scenario.events.extensionUsed:scenario.events.gameover):id);
      c.after=extend?'loop':'gameover';
    }
    for (const key of ['evidence','selected','memories','grown','seen','flags','done','helpUsed','history']) if (!Array.isArray(state[key])) throw new Error('保存データの形式が正しくありません。');
    state.board ??= {};
    for(const action of problem.investigations)if(action.repeatable&&state.board[action.id]==='done')state.board[action.id]='todo';
    state.investigationResults ??= {};
    // Earlier saves used one source-analysis task for both overview and PDF location.
    if(state.done.some(key=>['wm.source:prepared','wm.source:default'].includes(key))) {
      state.done=state.done.filter(key=>!['wm.source:prepared','wm.source:default'].includes(key));
      state.done.push('wm.source:overview');
      state.flags=[...new Set([...state.flags,'wm.source-map'])];
      state.board['wm.source']='done';state.investigationResults['wm.source']='01.source-overview';
      if(state.flags.includes('wm.source-located')) {
        state.done.push('wm.source-pdf:default');state.board['wm.source-pdf']='done';state.investigationResults['wm.source-pdf']='01.source-ready';
      }
    }
    if(typeof state.progressReported!=='boolean')throw new Error('途中報告の状態を読み取れません。');
    if (typeof state.board !== 'object' || Array.isArray(state.board) || Object.entries(state.board).some(([id,status])=>!problem.investigations.some(action=>action.id===id)||!['todo','working','done'].includes(status))) throw new Error('調査ボードの状態を読み取れません。');
    if (typeof state.investigationResults !== 'object' || Array.isArray(state.investigationResults) || Object.entries(state.investigationResults).some(([id,scene])=>!problem.investigations.some(action=>action.id===id && action.outcomes.some(outcome=>outcome.scene===scene)))) throw new Error('調査結果を読み取れません。');
    if (![...state.evidence,...state.memories,...state.selected].every(id => allCards.has(id)) || !state.selected.every(id => state.evidence.includes(id)) || new Set(state.selected).size !== state.selected.length) throw new Error('保存データの証拠品を読み取れません。');
    if (!state.knowledge || !state.acquired || !state.settings || !Number.isInteger(state.loop) || state.loop < 1 || !Number.isInteger(state.intuition) || state.intuition < 0 || state.intuition > problem.intuition.max) throw new Error('保存データの状態を読み取れません。');
    for (const [key, value] of Object.entries(problem.knowledge)) if (!Number.isInteger(state.knowledge[key]) || state.knowledge[key] < 0 || state.knowledge[key] > value.max) throw new Error('知識の値が不正です。');
    if (state.phase === 'scene') {
      const c = state.conversation;
      if (!c || !Array.isArray(c.ids) || !c.ids.length || !c.ids.every(id => scenario.scenes[id]) || !Number.isInteger(c.scene) || c.scene < 0 || c.scene >= c.ids.length || !Number.isInteger(c.line) || c.line < 0 || c.line >= scenario.scenes[c.ids[c.scene]].lines.length || !['desk','report','complete','loop','gameover'].includes(c.after)) throw new Error('会話の保存位置が不正です。');
      if (c.completedActionId && !problem.investigations.some(action=>action.id===c.completedActionId)) throw new Error('完了する調査を読み取れません。');
      if (c.actionId && (!problem.investigations.some(action=>action.id===c.actionId)||!['todo','done'].includes(c.returnStatus))) throw new Error('調査後の戻り先を読み取れません。');
      if (!c.completedActionId && !c.actionId && !c.replay) {
        const action=problem.investigations.find(item=>item.outcomes.some(outcome=>c.ids.includes(outcome.scene) && outcome.complete!==false));
        if(action)c.completedActionId=action.id;
      }
    }
    return state;
  }
  return { fresh, matches, queue, advance, preview, investigate, cardStatus, moveCard, report, evaluateReport, statusReport, restore, timeout, elapse, deadline, settle,
    start(previous={}, nextLoop = false) {
      if(nextLoop && previous.phase==='loop') {
        const state=structuredClone(previous);
        state.loop++;state.time=minutes(problem.clock.start);state.phase='desk';state.selected=[];state.conversation=null;state.settled=false;state.progressReported=false;
        state.timerRemainder=0;
        for (const id of problem.dailyActions||['wm.lunch','wm.progress']) {
          delete state.board[id];delete state.investigationResults[id];
          state.done=state.done.filter(key=>!key.startsWith(`${id}:`));
        }
        queue(state,[scenario.events.nextDay],'desk','翌日の調査を開始');return state;
      }
      const state=fresh(previous);queue(state,[scenario.events.intro],'desk','依頼を受けた');return state;
    },
    chat(state) { return scenario.chat.filter(item => minutes(item.at) <= state.time); },
  };
}
