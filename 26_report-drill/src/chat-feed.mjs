const minutes=text=>{const [hours,mins]=text.split(':').map(Number);return hours*60+mins;};

// Publish the result and newly reached chat messages only after its event ends.
export function buildChatFeed(scenario,state) {
  const active=state.phase==='scene'?(state.conversation?.historyIndex??state.history.length-1):-1;
  const pending=state.history[active];
  const currentCutoff=pending?pending.time-(pending.changes?.minutes||0):state.time;
  const feed=[];
  for(let day=1;day<=state.loop;day++) {
    const cutoff=day===state.loop?currentCutoff:Math.max(0,...state.history.filter(item=>(item.day||1)===day).map(item=>item.time));
    for(const [index,message] of scenario.chat.entries())if(minutes(message.at)<=cutoff) {
      feed.push({key:`chat:${day}:${message.id}`,day,time:minutes(message.at),kind:'message',index,message});
    }
  }
  state.history.forEach((item,index)=>{
    if(index!==active && item.ids.length)feed.push({key:`history:${index}`,day:item.day||1,time:item.time,kind:'history',index,item});
  });
  return feed.sort((a,b)=>a.day-b.day||a.time-b.time||(a.kind===b.kind?0:a.kind==='message'?-1:1)||a.index-b.index);
}
