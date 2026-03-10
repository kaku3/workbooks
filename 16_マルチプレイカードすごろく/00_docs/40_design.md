# design

## bg

### 用途
- ロビー画面の全面背景
- ゲーム画面のマップ領域

### 仕様メモ

| 項目 | 値 |
|------|----|
| 形式 | 1枚絵（タイル不要） |
| 推奨サイズ | 1920 × 1080 px（横長）または 1024 × 1024 px |
| アートスタイル | 手描き風アート地図・トップダウン・ボードゲームマップ風 |
| 濃淡 | 薄め（前景テキスト・UIが視認しやすいよう低コントラスト） |
| カラーパレット | アイボリー・クリーム・淡いグリーン・薄いグレー。ウォームトーン |

### 画像生成プロンプト（英語）

```
An artistic top-down city map illustration for a board game background, inspired by Scotland Yard board game aesthetics.
Strictly overhead view, no perspective angle, no isometric tilt.
Organic, hand-drawn-feeling city layout with gently curving roads and winding streets — not a rigid grid.
Mix of large open city blocks and tight narrow alleys, a few small parks or plazas, simple building footprint shapes.
Warm, light color palette: soft ivory and cream for roads, pale sage green for parks, light warm gray for building blocks, gentle stone beige for open areas.
Very low contrast — washed-out pastel tones throughout — so overlaid UI text and game elements stay clearly legible.
Slightly loose hand-illustrated line quality, like an artistic board game map. Subtle paper texture warmth.
No characters, no vehicles, no text labels, no compass rose, no numbered nodes.
Style: illustrative board-game map art, soft vintage warmth, painterly but clean.
1920x1080px.
```

### 使い方メモ

- CSS: `background-image: url('bg_city_map.png'); background-size: cover; background-position: center;`
- 透過レイヤーを重ねて濃淡を調整する場合: `rgba(255,255,255,0.3)` のホワイトオーバーレイを推奨（明るさキープ）

---

## card

### カードサイズ

**80 × 110 px**（標準的なトレーディングカードサイズ）

---

### カードイラスト 一覧タイル画像 生成プロンプト

ユニークなイラスト種別：計31種（移動12・アクション12・アイテム7）を 8列×4行のタイルグリッドに並べた 1枚の画像を生成する。

#### 画像仕様メモ

| 項目 | 値 |
|------|----|
| 全体構成 | 8列 × 4行 = 32枚（1枠はプレースホルダー） |
| 1枚サイズ比 | 80:110（縦長） |
| 全体サイズ | 3200 × 2200 px 相当（余白込み） |
| アートスタイル | ポップ・都市クライム風・フラットイラスト風（ボードゲームカード向け） |
| カラーパレット | ネオン＋パステル混合。夜の都市、薄暗い路地、カラフルなアクセント |

width: 80px
height: 96px
gap: 0

---

#### 画像生成プロンプト（英語）

```
A flat-design illustration sheet for a card game called "Bomber vs Defuser".
An 8-column × 4-row tile grid of 32 individual card illustrations (each card is 80×110 portrait ratio), no card frames, just the artwork.
Pop art meets urban crime aesthetic, bold outlines, vibrant neon & pastel colors on a dark city background.
All 31 illustrations (slot 32 is blank):

Row 1 — Move cards 1–8 (speed progression, city-at-night background):
[1]  A person tiptoeing very carefully through a dark alley (Move 1)
[2]  A person walking with hands in pockets under a streetlight (Move 2)
[3]  A person jogging along a sidewalk (Move 3)
[4]  A person sprinting at full speed, legs blurred (Move 4)
[5]  A bicycle weaving through a city street (Move 5)
[6]  A scooter / moped zipping through traffic (Move 6)
[7]  A yellow taxi drifting around an intersection (Move 7)
[8]  A sports car speeding on a highway at night (Move 8)

Row 2 — Move cards 9–12 + Action cards 取引・強奪・横流し・ポイ捨て:
[9]  A bus barreling through a tunnel at speed (Move 9)
[10] A subway train rushing underground, sparks flying (Move 10)
[11] An express train seen from platform blurring past (Move 11)
[12] A Shinkansen bullet train at full speed against city skyline (Move 12)
[13] Two suited hands shaking a deal, playing cards being exchanged on a table (取引 Trade)
[14] A gloved hand snatching a card from another person's hand (強奪 Steal)
[15] Four people in a circle each passing a card to the next person (横流し Pass)
[16] A hand flicking a card into an overflowing trash can (ポイ捨て Dump)

Row 3 — Action cards: 尋問・公開捜査・密談・足止め・通行止め・探知機・ダッシュ・煙幕:
[17] A detective interrogating a suspect under a single bare bulb in a dark room (尋問 Peek)
[18] A wanted poster pinned to a wall with a card illustration circled in red marker (公開捜査 Expose)
[19] Two shady figures in a dark alley corner whispering and showing each other a card (密談 Whisper)
[20] A person tied tightly to a chair with thick rope, frustrated expression (足止め Skip)
[21] An urban road blocked by police barricades, traffic cones, and yellow police tape (通行止め Block)
[22] A handheld metal detector device glowing red with an alarm indicator (探知機 Detect)
[23] A figure in a trenchcoat running at extreme speed with strong motion blur trails (ダッシュ Dash)
[24] A dark back alley entrance obscured by thick billowing green smoke clouds (煙幕 Smoke)

Row 4 — Item cards: パーツA/B/C・キットX/Y/Z・ダミー + 1 blank:
[25] A glowing red printed circuit board component with a bold "A" marking (爆弾パーツA)
[26] A glowing orange countdown timer module with a bold "B" marking (爆弾パーツB)
[27] A glowing yellow detonator trigger device with a bold "C" marking (爆弾パーツC)
[28] A sleek blue wire-cutting plier set in an open case, labeled "X" (解除キットX)
[29] A green electronic analysis tool with probes and a small screen, labeled "Y" (解除キットY)
[30] A purple compact circuit-board decoder module with blinking LEDs, labeled "Z" (解除キットZ)
[31] A suspicious component wrapped in generic packaging with large "?" symbols all over it (ダミー Dummy)
[32] (blank — game logo or empty)

Consistent flat-icon style across all 31 cards, each illustration clearly distinct, bright vivid colors, subtle drop shadows, 8px white gutters between tiles.
No text labels in the image.
```

---

#### 各カード種別 イラスト一覧（日本語メモ）

| # | カード種別 | ラベル | イラストモチーフ |
|---|-----------|--------|----------------|
| 1 | 移動 | 1 | 暗い路地を忍び足で歩く人 |
| 2 | 移動 | 2 | 街灯の下を手をポケットに入れて歩く人 |
| 3 | 移動 | 3 | 歩道をジョギングする人 |
| 4 | 移動 | 4 | 全力疾走する人（足がブレる） |
| 5 | 移動 | 5 | 街中を縫うように走る自転車 |
| 6 | 移動 | 6 | 交通渋滞をすり抜けるスクーター |
| 7 | 移動 | 7 | 交差点をドリフトする黄色いタクシー |
| 8 | 移動 | 8 | 夜の高速道路を疾走するスポーツカー |
| 9 | 移動 | 9 | トンネルを爆走するバス |
| 10 | 移動 | 10 | 火花を散らして地下を走る電車 |
| 11 | 移動 | 11 | ホームを猛スピードで通過する特急電車 |
| 12 | 移動 | 12 | 都市スカイラインを駆け抜ける新幹線 |
| 13 | アクション | 取引 | テーブル越しの握手・カード交換 |
| 14 | アクション | 強奪 | グローブの手がカードをひったくる |
| 15 | アクション | 横流し | 4人がカードを輪で回す |
| 16 | アクション | ポイ捨て | カードをゴミ箱に投げ捨てる手 |
| 17 | アクション | 尋問 | 裸電球の下で尋問するシーン |
| 18 | アクション | 公開捜査 | 指名手配ポスターに赤丸 |
| 19 | アクション | 密談 | 暗がりで耳打ちする2人 |
| 20 | アクション | 足止め | 椅子に縛られた人物 |
| 21 | アクション | 通行止め | バリケードと工事テープの封鎖路 |
| 22 | アクション | 探知機 | 赤く点滅する爆弾探知器 |
| 23 | アクション | ダッシュ | モーションブラー付きで疾走する人 |
| 24 | アクション | 煙幕 | 緑の煙が漂う路地裏 |
| 25 | アイテム | パーツA | 赤く光る爆弾回路基板「A」 |
| 26 | アイテム | パーツB | オレンジ色のタイマーモジュール「B」 |
| 27 | アイテム | パーツC | 黄色く光る起爆装置「C」 |
| 28 | アイテム | キットX | 青いワイヤーカッター＆工具セット「X」 |
| 29 | アイテム | キットY | 緑の電子解析ツール「Y」 |
| 30 | アイテム | キットZ | 紫の回路解除モジュール「Z」 |
| 31 | アイテム | ダミー | ？マーク付きの偽パーツ |
| 32 | — | （空白） | ゲームロゴ or プレースホルダー |
