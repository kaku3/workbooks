const escape=text=>text.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('ja',{granularity:'grapheme'}):null;
const letters=text=>segmenter?[...segmenter.segment(text)].map(item=>item.segment):Array.from(text);
export function dialogueParts(text){
  text=String(text).replace(/<br\s*\/?\s*>/gi,'\n');
  const parts=[];let start=0;
  for(const match of text.matchAll(/\*\*([^*]+)\*\*/g)){
    if(match.index>start)parts.push({text:text.slice(start,match.index),strong:false});
    parts.push({text:match[1],strong:true});start=match.index+match[0].length;
  }
  if(start<text.length)parts.push({text:text.slice(start),strong:false});
  return parts;
}
export const plainDialogue=text=>dialogueParts(text).map(part=>part.text).join('');
export const dialogueLength=text=>dialogueParts(text).reduce((n,part)=>n+letters(part.text).length,0);
export function dialogueHTML(text,limit=Infinity){
  return dialogueParts(text).map(part=>{
    const chars=letters(part.text),shown=chars.slice(0,Math.max(0,limit)).join('');limit-=chars.length;
    if(!shown)return '';
    const html=escape(shown);return part.strong?`<strong>${html}</strong>`:html;
  }).join('');
}
export function setDialogue(target,text,limit=Infinity){
  target.innerHTML=dialogueHTML(text,limit);target.setAttribute('aria-label',plainDialogue(text));
}
