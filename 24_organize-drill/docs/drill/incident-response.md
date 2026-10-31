# 障害発生時の初動

- 問題ID：`incident-response`
- 直接開く：`src/index.html?drill=incident-response`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

障害の影響と緊急度を把握し、担当チームによる回避策と利用者への状況案内を行いたい。 今回の図の対象：障害のアラートを受けてから、影響を確認して対応し、利用者へ知らせるまでの初動の流れ。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 影響の調査では、受信したアラートが示すサービスと時刻を手がかりにする。（内部種別：要件・要求／根拠：障害アラートを受信 → 影響範囲を確認）
2. 緊急度は影響を受ける利用者や業務の範囲から判断する。（内部種別：要件・要求／根拠：影響範囲を確認 → 緊急度を判定）
3. 当番表は印刷しても名前と連絡先が1枚に収まるようにしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| incident-response-doc-04 | 担当チームへの連絡には、判断した緊急度を添える。 | 要件・要求 | 緊急度を判定 → 担当チームへ連絡 |
| incident-response-doc-05 | 回避策の実施は、連絡を受けた担当チームが担う。 | 要件・要求 | 担当チームへ連絡 → 回避策を実施 |
| incident-response-doc-06 | 利用者への告知には、実施した回避策と現在の状況を載せたい。 | 要件・要求 | 回避策を実施 → 状況を利用者へ告知 |

## ヒント

アラートを受けたらすぐに対応するのではなく、影響と緊急度を見極めます。判断の後に誰が何をするか整理しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `incident-response-n1` | 必要 | 障害アラートを受信 |
| `incident-response-n2` | 必要 | 影響範囲を確認 |
| `incident-response-n3` | 必要 | 緊急度を判定 |
| `incident-response-n4` | 必要 | 担当チームへ連絡 |
| `incident-response-n5` | 必要 | 回避策を実施 |
| `incident-response-n6` | 必要 | 状況を利用者へ告知 |
| `incident-response-x1` | 余分・参考 | 当番表の印刷方法 |

## グループ

- **検知と判断**：`incident-response-n1`, `incident-response-n2`, `incident-response-n3`
- **初動対応**：`incident-response-n4`, `incident-response-n5`, `incident-response-n6`

## 正解の接続

- `incident-response-n1` → `incident-response-n2`
- `incident-response-n2` → `incident-response-n3`
- `incident-response-n3` → `incident-response-n4`
- `incident-response-n4` → `incident-response-n5`
- `incident-response-n5` → `incident-response-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `incident-response-n1` | 0.18 | 0.25 |
| `incident-response-n2` | 0.18 | 0.75 |
| `incident-response-n3` | 0.5 | 0.25 |
| `incident-response-n4` | 0.5 | 0.75 |
| `incident-response-n5` | 0.82 | 0.25 |
| `incident-response-n6` | 0.82 | 0.75 |

## 解説

この図では、障害アラートを受信 → 影響範囲を確認 → 緊急度を判定 → 担当チームへ連絡 → 回避策を実施 → 状況を利用者へ告知の関係を整理します。影響と緊急度を確認してから担当へ連絡します。「当番表の印刷方法」は今回の流れに含めません。

## レビュー・見直しメモ

### 問題の狙い

_（記入）_

### 要求仕様として自然か

_（記入）_

### 要件・外部設計の粒度は適切か

_（記入）_

### 図にする範囲・正解接続に無理がないか

_（記入）_

### ヒントの改善案

_（記入）_
