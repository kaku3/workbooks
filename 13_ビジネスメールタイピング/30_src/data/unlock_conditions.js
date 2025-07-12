// data/unlock_conditions.js
// 各問題の解放条件を定義
// id: 問題ID, required: [{type: 'rank'|'play', targetId: 問題ID, value: 'A'|3 など, desc: 表示用説明}]
// すべての解放条件を満たした問題を「次の解放候補」として全て表示する
// 出題一覧表示時は「1. 問題タイトル」のようにidを先頭につけて表示すること（UI側で利用）

// --- 開発用: 全出題を常時アンロックするdebugフラグ ---
// window.DEBUG_UNLOCK_ALL = true; で全問題が常に解放されます（UI側で判定してください）
window.DEBUG_UNLOCK_ALL = true;
window.UNLOCK_CONDITIONS = [
  { id: 1, required: [] },
  { id: 2, required: [
    { type: 'rank', targetId: 1, value: 'D', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 1, value: 3, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 3, required: [
    { type: 'rank', targetId: 1, value: 'D', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 1, value: 3, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 4, required: [
    { type: 'rank', targetIds: [2, 3], value: 'C', desc: '{targetIds}問目で{value}ランク以上' },
    { type: 'play', targetIds: [2, 3], value: 4, desc: '{targetIds}問目を{value}回プレイ' }
  ] },
  { id: 5, required: [
    { type: 'rank', targetId: 4, value: 'C', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 4, value: 10, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 6, required: [
    { type: 'rank', targetId: 4, value: 'C', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 4, value: 10, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 7, required: [
    { type: 'rank', targetId: 4, value: 'C', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 4, value: 10, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 8, required: [
    { type: 'rank', targetId: 4, value: 'C', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 4, value: 10, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 9, required: [
    { type: 'rank', targetId: 5, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 5, value: 10, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 10, required: [
    { type: 'rank', targetId: 6, value: 'B', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 6, value: 10, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 11, required: [
    { type: 'rank', targetId: 7, value: 'C', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 7, value: 10, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 12, required: [
    { type: 'rank', targetId: 8, value: 'D', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 8, value: 10, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 13, required: [
    { type: 'rank', targetId: 9, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 9, value: 20, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 14, required: [
    { type: 'rank', targetId: 10, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 10, value: 20, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 15, required: [
    { type: 'rank', targetId: 11, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 11, value: 20, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 16, required: [
    { type: 'rank', targetId: 12, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 12, value: 20, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  { id: 17, required: [
    { type: 'rank', targetIds: [13,14,15,16], value: 'D', desc: '{targetIds}問目で{value}ランク以上' },
    { type: 'play', targetIds: [13,14,15,16], value: 5, desc: '{targetIds}問目を{value}回プレイ' }
  ] },
  { id: 18, required: [
    { type: 'rank', targetIds: [13,14,15,16], value: 'C', desc: '{targetIds}問目で{value}ランク以上' },
    { type: 'play', targetIds: [13,14,15,16], value: 10, desc: '{targetIds}問目を{value}回プレイ' }
  ] },
  { id: 19, required: [
    { type: 'rank', targetIds: [13,14,15,16], value: 'B', desc: '{targetIds}問目で{value}ランク以上' },
    { type: 'play', targetIds: [13,14,15,16], value: 20, desc: '{targetIds}問目を{value}回プレイ' }
  ] },
  { id: 20, required: [
    { type: 'rank', targetIds: [17,18,19], value: 'C', desc: '{targetIds}問目で{value}ランク以上' },
    { type: 'play', targetIds: [17,18,19], value: 10, desc: '{targetIds}問目を{value}回プレイ' }
  ] },
];
