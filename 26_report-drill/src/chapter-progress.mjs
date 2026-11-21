const progressKey='report-drill.cleared-chapters.v1';
export const chapterSaveKey=id=>id==='watermark'?'report-drill.pdf-incident.v1':`report-drill.${id}.v1`;

export function clearedChapters(storage,ids){
  const cleared=new Set();
  try {
    const stored=JSON.parse(storage.getItem(progressKey)||'[]');
    if(Array.isArray(stored))for(const id of stored)if(ids.includes(id))cleared.add(id);
  } catch {}
  // Recognize completion records saved before chapter unlocking was introduced.
  for(const id of ids){
    try {
      const save=JSON.parse(storage.getItem(chapterSaveKey(id))||'null');
      if(save?.completed===true||save?.phase==='complete')cleared.add(id);
    } catch {}
  }
  return cleared;
}

export function unlockedChapters(storage,ids){
  const cleared=clearedChapters(storage,ids);
  const unlocked=[];
  for(const id of ids){unlocked.push(id);if(!cleared.has(id))break;}
  return unlocked;
}

export function recordChapterClear(storage,ids,id){
  const cleared=clearedChapters(storage,ids);
  cleared.add(id);
  storage.setItem(progressKey,JSON.stringify([...cleared]));
}

export function eraseChapterClear(storage,ids,id){
  const cleared=clearedChapters(storage,ids);
  cleared.delete(id);
  storage.setItem(progressKey,JSON.stringify([...cleared]));
}
