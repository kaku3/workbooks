# 上級：再申請と二重振込

ID：`approval-retry`／第2章ステージ3。[共通仕様](02-00_approval-rules.md)。

## 出題・初期設計

経理処理の再実行と差戻し後の再申請が増えました。同じ申請へ二重通知せず、改訂前の承認で振り込まない設計にしてください。

初期配置：経理入口（audit）→振込（transfer）→通知（sendPaid）。振込の失敗先も通知。再申請入口（reviseRequest）は完了。承認入口はcheckApprover→recordDecisionで完了。パレットに振込済み確認（paymentCompleted）、現版承認確認（requireApproved）、経理確認（verifyReceipt）の3個。すべての操作候補を利用できる。

## テスト

金額は1,200円。実行者は経理A-01（accountant）、上長判断はM-01、申請者E-01。特記しない版記録はnull。

| ID | 初期状態・入力順 | 期待 |
|---|---|---|
| AT-01 | R-01、版1、approved/承認版1、unpaid → pay（領収書正常） | paid/振込版1、経理verified/版1、振込1・通知1 |
| AT-02 | 同上 → pay（正常）→pay（正常） | 振込1・通知1のまま、paid。2回目も正常終了 |
| AT-03 | 版1、returned/unpaid → revise→pay（正常） | 版2、pending、承認版null、unpaid、振込0・通知0 |
| AT-04 | 同上 → revise→approve（承認・正常）→pay（正常） | 版2、approved/承認版2、経理verified/版2、paid/振込版2、振込1・通知1 |
| AT-05 | 版2、approved/承認版1、経理verified/確認版1、unpaid → pay（正常） | 旧版承認を拒否、unpaid、振込0・通知0 |

AT-05の旧版データは連携取り込み時点の不整合として冒頭で説明する。通常のreviseRequestが不正な状態を生成したことにはしない。

## 作者向け修正例

経理入口→振込済み確認。成功は完了、失敗は現版承認確認→経理確認→振込→通知。承認確認・経理確認・振込の失敗は完了。再申請は共通操作で承認・確認を解除する。初期はAT-01も現版経理未確認なので不合格、AT-02は重複通知、AT-03・05は不正振込、AT-04は確認不足で不合格。

単にtransferが二重振込を拒否することだけに頼ると、失敗経路の通知でAT-02を落とす。通知前の副作用確認など、同じ期待を満たす別解を許容する。
