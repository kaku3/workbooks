// data/unlock_conditions.js
// 各問題の解放条件を定義
// id: 問題ID, required: [{type: 'rank'|'play', targetId: 問題ID, value: 'A'|3 など, desc: 表示用説明}]
window.UNLOCK_CONDITIONS = [
  // 1問目は常に解放
  { id: 1, required: [] },
  // 2問目: 1問目Dランク以上 or 3回プレイ
  { id: 2, required: [
    { type: 'rank', targetId: 1, value: 'D', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 1, value: 3, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 3問目: 2問目Dランク以上 or 5回プレイ
  { id: 3, required: [
    { type: 'rank', targetId: 2, value: 'D', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 2, value: 5, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 4問目: 3問目Cランク以上 or 7回プレイ
  { id: 4, required: [
    { type: 'rank', targetId: 3, value: 'C', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 3, value: 7, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 5問目: 4問目Cランク以上 or 10回プレイ
  { id: 5, required: [
    { type: 'rank', targetId: 4, value: 'C', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 4, value: 10, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 6問目: 5問目Bランク以上 or 12回プレイ
  { id: 6, required: [
    { type: 'rank', targetId: 5, value: 'B', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 5, value: 12, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 7問目: 6問目Bランク以上 or 15回プレイ
  { id: 7, required: [
    { type: 'rank', targetId: 6, value: 'B', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 6, value: 15, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 8問目: 7問目Aランク以上 or 18回プレイ
  { id: 8, required: [
    { type: 'rank', targetId: 7, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 7, value: 18, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 9問目: 8問目Aランク以上 or 20回プレイ
  { id: 9, required: [
    { type: 'rank', targetId: 8, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 8, value: 20, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 10問目: 9問目Aランク以上 & 8問目Bランク以上
  { id: 10, required: [
    { type: 'rank', targetId: 9, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'rank', targetId: 8, value: 'B', desc: '{targetId}問目で{value}ランク以上' }
  ] },
  // 11問目: 10問目Aランク以上 or 25回プレイ
  { id: 11, required: [
    { type: 'rank', targetId: 10, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 10, value: 25, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 12問目: 11問目Aランク以上 & 9問目Aランク以上
  { id: 12, required: [
    { type: 'rank', targetId: 11, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'rank', targetId: 9, value: 'A', desc: '{targetId}問目で{value}ランク以上' }
  ] },
  // 13問目: 12問目Aランク以上 or 30回プレイ
  { id: 13, required: [
    { type: 'rank', targetId: 12, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 12, value: 30, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 14問目: 13問目Aランク以上 & 11問目Aランク以上
  { id: 14, required: [
    { type: 'rank', targetId: 13, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'rank', targetId: 11, value: 'A', desc: '{targetId}問目で{value}ランク以上' }
  ] },
  // 15問目: 14問目Aランク以上 or 35回プレイ
  { id: 15, required: [
    { type: 'rank', targetId: 14, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 14, value: 35, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 16問目: 15問目Aランク以上 & 13問目Aランク以上
  { id: 16, required: [
    { type: 'rank', targetId: 15, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'rank', targetId: 13, value: 'A', desc: '{targetId}問目で{value}ランク以上' }
  ] },
  // 17問目: 16問目Aランク以上 or 40回プレイ
  { id: 17, required: [
    { type: 'rank', targetId: 16, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 16, value: 40, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 18問目: 17問目Aランク以上 & 15問目Aランク以上
  { id: 18, required: [
    { type: 'rank', targetId: 17, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'rank', targetId: 15, value: 'A', desc: '{targetId}問目で{value}ランク以上' }
  ] },
  // 19問目: 18問目Aランク以上 or 50回プレイ
  { id: 19, required: [
    { type: 'rank', targetId: 18, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'play', targetId: 18, value: 50, desc: '{targetId}問目を{value}回プレイ' }
  ] },
  // 20問目: 19問目Aランク以上 & 17問目Aランク以上
  { id: 20, required: [
    { type: 'rank', targetId: 19, value: 'A', desc: '{targetId}問目で{value}ランク以上' },
    { type: 'rank', targetId: 17, value: 'A', desc: '{targetId}問目で{value}ランク以上' }
  ] },
];
