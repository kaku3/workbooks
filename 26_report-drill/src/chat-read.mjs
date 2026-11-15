// Track feed identities, rather than counts, so reloads and withheld event posts stay consistent.
export function updateChatRead(state,feed,{acknowledge=false}={}){
  const keys=feed.map(item=>item.key),valid=new Set(keys);
  if(!state.chatRead){state.chatRead={seen:keys,unread:[]};return {changed:true,count:0,first:null,arrivals:0};}
  const old=JSON.stringify(state.chatRead);
  const seen=new Set(state.chatRead.seen),unread=new Set(state.chatRead.unread.filter(key=>valid.has(key)));
  let arrivals=0;
  for(const key of keys)if(!seen.has(key)){unread.add(key);arrivals++;}
  const first=keys.find(key=>unread.has(key))||null;
  state.chatRead={seen:keys,unread:acknowledge?[]:keys.filter(key=>unread.has(key))};
  return {changed:old!==JSON.stringify(state.chatRead),count:state.chatRead.unread.length,first,arrivals};
}
