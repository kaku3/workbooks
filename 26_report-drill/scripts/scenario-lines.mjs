export function parseSceneLines(text,name){
  return text.split(/\r?\n/).filter(line=>line.trim()).map(line=>{
    const effect=line.match(/^- effect: (.+)$/);
    if(effect){
      const value=effect[1].trim();
      if(value!=='blackout')throw new Error(`${name}: unknown effect: ${value}`);
      return {effect:value};
    }
    const match=line.match(/^- (\w+)( \[thought\])?: (.+)$/);
    if(!match)throw new Error(`${name}: invalid dialogue: ${line}`);
    return {speaker:match[1],...(match[2]?{kind:'thought'}:{}),text:match[3].replace(/\\n/g,'\n')};
  });
}
