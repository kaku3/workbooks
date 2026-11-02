import { initialGraph, tests } from './data.mjs';
import { approvalDrills } from './approval-drills.mjs';
import { operations } from './engine.mjs';
const copy = value => structuredClone(value);
function make(id, title, difficulty, summary, ids, mutate, nodes) {
  const graph = copy(initialGraph);
  mutate(graph);
  if (nodes) graph.nodes = graph.nodes.filter(n => nodes.includes(n.id));
  const selectedTests = ids.map(id => copy(tests.find(t => t.id === id)));
  graph.entries = Object.fromEntries(Object.entries(graph.entries).filter(([, id]) => graph.nodes.some(n => n.id === id)));
  return { id, title, difficulty, summary, initialGraph: graph, tests: selectedTests };
}
const block = (g, id) => g.nodes.find(n => n.id === id);
export const drills = [
  make('order-system', '注文システムの設計修正', '総合', '注文の在庫引当・決済・出荷とキャンセルを扱うシステムです。接続と処理順序を見直し、すべてのテストを通してください。', tests.map(t => t.id), g => {
    block(g, 'stock').success = 'shipping';
    block(g, 'cleanup').operations = ['confirm', 'release', 'refund'];
  }),
  make('order-basics', '決済を飛ばす注文フロー', '初級', '注文を受け付けましたが、出荷に必要な決済が行われません。在庫不足時にも処理が止まります。成功・失敗の接続先を修正してください。', ['TC-01', 'TC-02'], g => {
    block(g, 'stock').success = 'shipping';
    block(g, 'stock').failure = '';
  }, ['stock', 'payment', 'shipping', 'shortage']),
  make('cancel-consistency', '後処理と完了通知', '中級', 'キャンセルの確定が早すぎるため、後処理が成立しません。失敗時の誤通知と二重要求にも対応してください。', ['TC-03', 'TC-04', 'TC-05'], g => {
    block(g, 'request').operations = ['recordCancel'];
    block(g, 'cleanup').operations = ['confirm', 'release', 'refund'];
  }, ['request', 'cleanup', 'notify', 'failed']),
  make('shared-stock', '共有在庫と出荷の確定点', '上級', '複数注文が同じ在庫を利用します。通常注文・在庫不足・キャンセルを同時に満たすよう、失敗分岐と操作の不足・順序を修正してください。', tests.map(t => t.id), g => {
    block(g, 'stock').failure = 'payment';
    block(g, 'payment').operations = ['ship', 'pay'];
    block(g, 'cleanup').operations = ['release', 'confirm'];
  }),
];
for (const drill of drills) Object.assign(drill, { chapter: 1, allowMove: false, allowPlace: false, availableBlocks: [], allowedOperations: Object.keys(operations).filter(id => !approvalDrills[3].allowedOperations.includes(id)) });
drills.push(...approvalDrills);
