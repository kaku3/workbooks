# 中級：差戻しなのに完了メール

ID：`approval-return`／第2章ステージ2。[共通仕様](02-00_approval-rules.md)。

## 出題・初期設計

領収書に不備がある申請を差し戻すはずが、振込完了メールが届いています。承認の取消しと失敗時の通知を修正してください。

配置済み：判断（checkApprover→recordDecision）→承認確認（requireApproved）→経理（verifyReceipt）→振込（transfer）→通知（sendPaid）。経理の失敗先が通知、承認確認の失敗先も通知。他の失敗先は完了。パレットには差戻し（returnRequest）が1個。使用カードは共通仕様のうちreviseRequest・paymentCompleted以外。

## テスト

初期はR-01・1,200円・版1、申請者E-01、上長M-01、pending/unpaid、経理pending、版記録null。1件のapproveイベントを投入する。

| ID | 入力 | 最終状態 | 振込 | 通知 |
|---|---|---|---|---|
| AR-01 | M-01、approve、領収書正常 | approved、現版verified、paid | 1件 | 1件 |
| AR-02 | M-01、approve、領収書不備 | returned、approvedRevision=null、経理pending、確認版null、unpaid | 0件 | 0件 |
| AR-03 | M-01、return、領収書正常 | returned、承認・経理版null、unpaid | 0件 | 0件 |
| AR-04 | M-01、reject、領収書正常 | rejected、承認・経理版null、unpaid | 0件 | 0件 |

初期は正常だけ成功し、AR-02〜04で誤通知。AR-02では差戻し状態も不足する。

## 作者向け修正例

経理失敗→差戻し→完了。承認確認失敗→完了。正常経路のみ振込→通知。差戻しを通っただけで失敗メールを送る課題にはしない。sendPaidの前にpaymentCompletedを使う別解は本問では候補外なので、成功・失敗経路を読む練習となる。

AR-04も公開し、却下を差戻しに上書きして帳尻を合わせる設計を検出する。AR-02の状態更新は必ずreturnRequestで行い、ケース定義から失敗後に直接書き換えない。
