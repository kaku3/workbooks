# 第2章共通仕様：経費精算・承認

状態：実装済み。`src/approval.mjs` と `src/approval-drills.mjs` に状態・操作・配置権限を実装し、第2章24ケースの修正後全成功を検証済み。実際の金融機関には接続せず、振込はシミュレーション内の副作用とする。

## 公開する業務ルール

申請者本人による承認は禁止。承認者には上長権限が必要。上長が承認し、領収書などの経理確認を通過した申請だけを振込対象にする。却下・差戻しでは振り込まず、振込済みの再実行でも振込・完了通知を重複させない。改訂前の承認は改訂後に流用しない。

決定的FIFO、1荷物1操作、操作成功時の原子的更新、失敗時の状態不変、ブロック単位の成功／失敗遷移、最大200ステップは第1章と同じ。後出しの権限・金額制限は設けない。

## データ

`requests` を申請IDで保持する。各申請は `applicantId`、`amount`（整数円）、`revision`（初期1）、`approvalStatus`（pending / approved / rejected / returned）、`approvedRevision`（初期null）、`accountingStatus`（pending / verified）、`verifiedRevision`（初期null）、`paymentStatus`（unpaid / paid）、`paidRevision`（初期null）を持つ。

ユーザー権限は `users[id].roles`（employee / manager / accountant）。入力イベントは `requestId`、`actorId`、`type`、必要に応じて `decision`・`receiptValid` を保持する。荷物ごとにイベントを保持し、権限や承認結果を別の荷物から借りない。副作用は `effects` に種類・申請ID・版・金額を記録する。

## 操作契約

| 操作ID | 名前・成功条件 | 状態・副作用 | 失敗 |
|---|---|---|---|
| `recordDecision` | 判断を記録。未振込、decisionがapprove/reject/return | approveはapprovedと現版を記録。reject/returnは該当状態にし承認版をnullにする。経理確認もpending/nullへ戻す | 振込済み・不正なdecision |
| `checkApprover` | 承認者を確認。actorがmanagerかつ申請者本人ではない | 更新なし | 権限不足・本人承認 |
| `requireApproved` | 現版の承認を確認。approvedかつapprovedRevision＝revision | 更新なし | 却下・差戻し・未承認・旧版承認 |
| `verifyReceipt` | 経理確認。現版承認済み、receiptValid＝true | verified、verifiedRevision＝revision | 承認なし・領収書不備 |
| `transfer` | 振込を実行。paymentStatus＝unpaid | paid、paidRevision＝revision、transfer副作用1件 | 振込済み。二重実行の防止は失敗経路でも検証する |
| `paymentCompleted` | 振込済みを確認。paid | 更新なし | 未振込 |
| `requireVerified` | 現版の経理確認。verifiedかつverifiedRevision＝revision | 更新なし | 未確認・旧版確認 |
| `sendPaid` | 振込完了通知。追加の自動条件確認なし | paidEmail副作用1件 | なし。誤通知も実際に発生させる |
| `returnRequest` | 差戻しを記録。未振込 | returned、承認・経理確認とその版を解除 | 振込済み |
| `reviseRequest` | 再申請。未振込、直前状態returned | revision＋1、承認・経理確認を初期化 | 差戻し前・振込済み |
| `audit` | 監査を記録 | actor・decision・申請ID・版のaudit副作用1件。申請内容は変更しない | なし |

`recordDecision` と `transfer` は単独では権限・承認・経理を全部確認しない。必要なゲートを設計に組み込む教材であり、エンジンが違反を自動救済しない。実行はイベントごとに完了まで行うので、確認と副作用の間の真の並列競合は扱わない。

## 入力と再実行

- `approve` イベントは上長判断の入口、`pay` は経理処理の入口、`revise` は再申請の入口へ入る。`pay` の実行者は経理担当とし、今回のテストでは全件その条件を満たす。経理権限自体の編集問題は対象外。
- approve/reject/return は同じ入口からdecisionで変わる。通常は承認者確認→判断記録→現版承認確認とする。承認確認の失敗は正常終了させてよい。
- 振込済み確認は通常のsuccess/failure分岐。確認成功なら終了、未振込なら承認・経理ゲートを経て振込へ進める。no_opによるエンジン側の特別終了に依存しない。
- `revise` は入力金額をそのまま変更する機能は初期版に入れず、同じ金額で版を更新する。版の整合性に集中する。

## 配置ルール

第2章は既存ブロックの移動と、パレットからの配置を解放する。カード操作は既存と同じ。パレットのブロックはステージに明示されたものだけ、各1個まで配置できる。未配置ブロックには接続できない。入口ブロックは削除不可。配置したブロックはパレットへ戻せるが、つながる辺を未設定に戻すことを明示する。

初級は必要なブロック1個だけ、中級以降も候補を少数にする。不要候補の混在は第3章まで行わない。グラフの形・配置数は採点しない。テストの全期待値と禁止副作用で判定する。

## 共通検証

各テストは完全な初期状態から開始し、表の「入力順」内だけ共有状態を保持する。期待値に加え、振込先ID・金額・版、通知数、振込前の承認／経理確認ログ、全荷物正常終了を検証する。未設定・ループ上限・待機残存は不合格。違反操作が後で帳尻合わせされても、振込時点の監査情報で検出する。
