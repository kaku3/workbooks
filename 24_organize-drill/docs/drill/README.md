# 問題別レビュー

このフォルダでは、問題を **1問＝1ファイル** で確認します。

各ファイルは `src/data/problems.json` から `node src/data/build-review-docs.mjs` で書き出しています（「レビュー・見直しメモ」の記入内容は再生成しても保持されます）。
問題文・段階開示資料・付箋・正解接続・解説を一画面で見比べ、問題の狙いや情報の粒度をレビューしやすくするための作業用ドキュメントです。

各問題は `src/index.html?drill=<問題ID>` で直接開けます（例：`?drill=zukai-payment-auth`）。

## レビューの観点

- **段階開示資料**：最初の3枚（外部設計1枚＋スコープ外2枚）だけで主題が分かるか。追加資料は、必要な情報とスコープ外が混ざっていて、開くかどうかを迷える内容か。接続の根拠が資料から導けるか。
- **要求の曖昧さ**：利用者・依頼者の言葉として自然か。何を実現したいのかが一意に決まりすぎていないか。
- **要件への具体化**：要求から、必要な機能や振る舞いが自然に導かれているか。
- **外部設計の断片**：図にしたい処理・状態・分岐・利用者とのやりとりが表現されているか。
- **図にする範囲**：今回の図の目的が明確で、必要な情報と不要な情報を見分けられるか。
- **ヒント**：答えを直接教えず、考える視点を与えているか。
- **正解接続**：資料の記述から接続関係を根拠をもって導けるか。

## 問題一覧

- [ネット注文の流れを整理する](./order-flow.md) (`order-flow`)
- [問い合わせ対応を整理する](./support-flow.md) (`support-flow`)
- [経費申請の確認を整理する](./expense-flow.md) (`expense-flow`)
- [サービス更新の流れを整理する](./release-flow.md) (`release-flow`)
- [学びを次につなげる](./learning-cycle.md) (`learning-cycle`)
- [ログインの流れ](./zukai-login.md) (`zukai-login`)
- [プロフィール更新](./zukai-profile-update.md) (`zukai-profile-update`)
- [ファイルアップロードと検証](./zukai-upload.md) (`zukai-upload`)
- [在庫連携バッチ](./zukai-stock-sync.md) (`zukai-stock-sync`)
- [決済オーソリ](./zukai-payment-auth.md) (`zukai-payment-auth`)
- [注文キャンセルと返金](./zukai-refund.md) (`zukai-refund`)
- [出荷依頼API連携](./zukai-shipping-api.md) (`zukai-shipping-api`)
- [経費精算フローの再設計](./zukai-expense-redesign.md) (`zukai-expense-redesign`)
- [問い合わせ対応の設計改善](./zukai-contact-improvement.md) (`zukai-contact-improvement`)
- [勤怠システムの責務分離](./zukai-attendance-role.md) (`zukai-attendance-role`)
- [パスワード再設定](./password-reset.md) (`password-reset`)
- [アカウント登録](./account-registration.md) (`account-registration`)
- [会議室の予約](./reservation-booking.md) (`reservation-booking`)
- [予約キャンセル待ち](./reservation-cancel.md) (`reservation-cancel`)
- [在庫不足の補充](./stock-reorder.md) (`stock-reorder`)
- [クーポン適用](./coupon-application.md) (`coupon-application`)
- [返品・交換の受付](./return-exchange.md) (`return-exchange`)
- [請求書の支払い](./invoice-payment.md) (`invoice-payment`)
- [備品購入の承認](./purchase-approval.md) (`purchase-approval`)
- [休暇申請](./leave-request.md) (`leave-request`)
- [新入社員の受け入れ](./employee-onboarding.md) (`employee-onboarding`)
- [採用選考](./recruiting.md) (`recruiting`)
- [作業依頼のレビュー](./task-review.md) (`task-review`)
- [文書の改訂](./document-revision.md) (`document-revision`)
- [問い合わせのエスカレーション](./support-escalation.md) (`support-escalation`)
- [障害発生時の初動](./incident-response.md) (`incident-response`)
- [バックアップからの復旧](./backup-restore.md) (`backup-restore`)
- [顧客データの一括取込](./data-import.md) (`data-import`)
- [アカウントの一時停止](./account-suspension.md) (`account-suspension`)
- [通知設定の変更](./notification-preference.md) (`notification-preference`)
- [サブスクリプション更新](./subscription-renewal.md) (`subscription-renewal`)
- [無料試用から有料プランへ](./trial-upgrade.md) (`trial-upgrade`)
- [システム権限の申請](./access-request.md) (`access-request`)
- [操作ログの定期確認](./audit-review.md) (`audit-review`)
- [テストから本番公開](./ci-deploy.md) (`ci-deploy`)
- [機能フラグの段階公開](./feature-flag.md) (`feature-flag`)
- [API利用上限の超過](./rate-limit.md) (`rate-limit`)
- [バッチ処理の再試行](./batch-retry.md) (`batch-retry`)
- [不審なログインの確認](./suspicious-login.md) (`suspicious-login`)
- [個人データの開示請求](./personal-data-export.md) (`personal-data-export`)
- [アンケート結果の公開](./survey-publish.md) (`survey-publish`)
- [施設利用の予約](./facility-reservation.md) (`facility-reservation`)
- [研修への参加登録](./workshop-registration.md) (`workshop-registration`)
- [オンライン学習の修了](./learning-completion.md) (`learning-completion`)
- [出張経費の精算](./reimbursement.md) (`reimbursement`)
