import test from 'node:test';
import assert from 'node:assert/strict';
import {chapterSaveKey,unlockedChapters,recordChapterClear,eraseChapterClear} from '../src/chapter-progress.mjs';
const ids=['watermark','approval-button','bulk-import'];
const storage=()=>{
  const values=new Map();
  return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
};

test('new players see only chapter one; each clear unlocks the next chapter',()=>{
  const saves=storage();
  assert.deepEqual(unlockedChapters(saves,ids),ids.slice(0,1));
  recordChapterClear(saves,ids,ids[0]);
  assert.deepEqual(unlockedChapters(saves,ids),ids.slice(0,2));
  recordChapterClear(saves,ids,ids[1]);
  assert.deepEqual(unlockedChapters(saves,ids),ids);
});
test('older completed saves unlock chapters and remain unlocked after replay starts',()=>{
  const saves=storage();
  saves.setItem(chapterSaveKey(ids[0]),JSON.stringify({completed:true,phase:'complete'}));
  assert.deepEqual(unlockedChapters(saves,ids),ids.slice(0,2));
  recordChapterClear(saves,ids,ids[0]);
  saves.setItem(chapterSaveKey(ids[0]),JSON.stringify({completed:false,phase:'desk'}));
  assert.deepEqual(unlockedChapters(saves,ids),ids.slice(0,2));
});
test('in-progress and failed saves do not unlock the next chapter',()=>{
  for(const phase of ['desk','scene','loop','gameover']){
    const saves=storage();
    saves.setItem(chapterSaveKey(ids[0]),JSON.stringify({completed:false,phase}));
    assert.deepEqual(unlockedChapters(saves,ids),ids.slice(0,1));
  }
});
test('a later clear cannot bypass an uncleared earlier chapter',()=>{
  const saves=storage();recordChapterClear(saves,ids,ids[1]);
  assert.deepEqual(unlockedChapters(saves,ids),ids.slice(0,1));
});
test('erasing chapter one completion hides later chapters again',()=>{
  const saves=storage();recordChapterClear(saves,ids,ids[0]);recordChapterClear(saves,ids,ids[1]);
  eraseChapterClear(saves,ids,ids[0]);saves.removeItem(chapterSaveKey(ids[0]));
  assert.deepEqual(unlockedChapters(saves,ids),ids.slice(0,1));
});
test('corrupt or unavailable storage keeps only chapter one available',()=>{
  const saves=storage();saves.setItem(chapterSaveKey(ids[0]),'{broken');
  assert.deepEqual(unlockedChapters(saves,ids),ids.slice(0,1));
  assert.deepEqual(unlockedChapters(undefined,ids),ids.slice(0,1));
});
