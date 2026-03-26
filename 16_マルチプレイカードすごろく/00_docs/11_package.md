# パッケージ

## 世界観の確立

提案のアイデアを整理・統合する前に、「このゲームがどんな空気感のものか」を一行で定義しておきます。  
バラバラに施策を打つと見た目がちぐはぐになるため、世界観が土台です。

---

### 採用世界観：「深夜の都市、疑惑の手札」

**コンセプト：都市型ノワールサスペンス**

> 時刻は深夜。人が行き交う大都市の路地裏で、  
> 誰かが街を吹き飛ばそうとしている。  
> あなたの隣に座っている、その人物が——そうでないとは言い切れない。

**なぜこの世界観か：**

2025年のボードゲームトレンドを調査すると、海外では *Blood on the Clocktower*（正体隠匿デダクション）や *Nemesis*（SF + 裏切者要素）が上位を占める。日本市場でも「正体隠匿 × ブラフ」ジャンルは安定した人気がある（東京湾奥ボードゲームなど）。

一方、トレンドの方向性は **「キャラクターに感情移入できる世界観」＋「リアルに想像できるシチュエーション」** にある。  
ファンタジーやSFより、「今夜、自分の周りで起きているかもしれない」という現実に近い方が共感を引きやすい。

この世界観が選ばれた理由：

| 観点 | 採用理由 |
|------|----------|
| ターゲット感情 | 「疑う快感」「疑われる緊張感」がゲームの芯とぴったり合致する |
| 差別化 | パーティゲームに多い「ポップ・かわいい」路線との差が出る |
| 実装コスト | 色とテキストを変えるだけで雰囲気が作れる |
| SNS映え | ダーク × シンプルなUIはスクショが映える |

**ビジュアルの基準軸：**

- 背景：ダーク（黒〜濃紺）に都市のシルエット
- アクセントカラー：**爆弾魔 = くすんだ赤・琥珀**、**解除班 = コールドブルー**
- フォント：丸ゴシック（現在）から、やや無機質・縦組みでも映えるゴシック体へ
- テイスト：「Cinema4Dのアートポスター」や「ミニマルノワール映画ポスター」を参考にする

---

## パッケージ提案（実装難易度: 低→高 順）

---

### Lv.1 ［テキスト変更のみ・0コスト］

#### 1-A. キャッチコピーの差し替え

現在の「3〜6人で遊べるパーティゲーム」は説明であって、**「手に取る動機」ではない**。  
「この5分間で、誰かを疑うことになる」という感情への期待に言葉を変える。

| 案 | コピー | 狙い |
|----|--------|------|
| 短文 | 「その手助けは、起爆の準備ですか？」 | 一行で世界観を伝える |
| 感情訴求 | 「善人面した爆弾魔は、隣のアイツかもしれない。——5分で始まる、正体隠匿すごろく。」 | 「もめる」想像を先にさせる |
| ゲーム性訴求 | 「パーツを揃えるか。正体を隠すか。運とブラフが交錯する心理戦。」 | ゲームをやったことない層に刺さる |

#### 1-B. SNSシェア定型文の変更

シェアボタンの文言を事実のログではなく、**感情のログ**に変える。

```
変更前：「爆弾魔 vs 解除班をプレイしました」

変更後（爆弾魔で勝利）：
「爆弾魔になって、全員を騙して爆破成功した。最高に気持ちよかった。 #爆弾魔vs解除班」

変更後（解除班で勝利）：
「解除班でギリギリ確保成功。隣の人を30分疑い続けた #爆弾魔vs解除班」
```

#### 1-C. ゲームログの演出テキスト

「Aさんが Bさんからカードを奪った」→「【強奪】A が B のコートから部品をかっさらった」  
ログが「ドラマの実況」になるだけで、プレイ後の感想戦の熱量が変わる。

---

### Lv.2 ［CSS変更 → デザイン刷新・低コスト］

#### 2-A. カラースキームをダークモードに統一

現在のベースカラー（白・明るい）を**ダーク基調**に切り替える。

```
背景：  #0d0f14（ほぼ黒）
爆弾魔アクセント：  #c0392b（落ち着いた赤）
解除班アクセント：  #2980b9（コールドブルー）
テキスト：  #e0e0e0（オフホワイト）
カード面：  #1a1d24（濃いグレー）
```

変更箇所は `css/base.css` と `css/lobby.css` がメイン。

#### 2-B. フォントの差し替え

現在の M PLUS Rounded（丸ゴシック）は親しみやすいが、ノワール感と相性が薄い。  
Google Fonts で無料で使えるフォントへの切り替え候補：

| フォント | 雰囲気 | 用途 |
|----------|--------|------|
| Noto Sans JP（Bold） | シャープ・モダン | 本文・UI全般 |
| Dela Gothic One | インパクト・都市的 | タイトル・役職名 |
| BIZ UDGothic | 情報的・官僚的 | ログ・テキスト（「事務的な緊張感」演出） |

#### 2-C. トップ画面の世界観テキスト追加

ロビー画面のタイトル直下に一文を置く。

```html
<p class="flavor-text">
  深夜の都市——誰がパーツを隠し持っているのか、誰にもわからない。
</p>
```

これだけで画面に「設定」が生まれる。

---

### Lv.3 ［アセット制作 → ブランド感の確立・中コスト］

#### 3-A. OGPサムネイルの刷新（最優先）

SNSでシェアされたときに表示される1枚絵。現状がゲームの「第一印象」になる。  
スクショ一枚で「これやってみたい」と思わせるデザインを目指す。

**素材イメージ：**  
- 夜景シルエット + 中央にタイトル文字  
- 爆弾魔側：琥珀色の炎シルエット、解除班側：青い光  
- Figmaや Canva の「映画ポスターテンプレート」を流用するのが最速

**画像生成プロンプト（DALL·E / Midjourney / Stable Diffusion 共通）：**

```
A cinematic movie poster in dark noir style.
Night cityscape silhouette as background, deep black sky with faint amber glow on one side and cold blue on the other.
Center: bold Japanese title text "爆弾魔 vs 解除班" in glowing golden letters.
Left side: a shadowy figure holding a briefcase, surrounded by ember sparks.
Right side: a silhouette of a detective with a flashlight, cold blue rim light.
Dramatic lighting, high contrast, minimalist composition.
Aspect ratio 1200x630 (OGP banner).
No text other than the title. No watermark. Cinematic, moody, stylized.
```

**日本語で指示する場合（Canva AI など）：**

```
ダークノワール映画ポスター風。夜の都市シルエットを背景に、左半分は琥珀色・右半分はコールドブルーの光。
中央に「爆弾魔 vs 解除班」のゴールド発光タイトル文字。
左に旅行鞄を持つ闇の人影、右に懐中電灯を構える探偵シルエット。
横長 1200×630px、タイトル以外の文字なし、高コントラスト・ミニマル。
```

---

**ロビー背景画像（map.png 差し替え用）プロンプト：**

ロビー画面の背景に敷くマップ画像。テキストやUIが上に重なるため、**中心部はやや暗く・周縁部に都市感**を出すグラデーション構成が理想。

```
A top-down city map illustration in dark noir style.
Viewed from directly above, depicting an abstract urban grid at night.
Streets rendered as faint amber or cold blue glowing lines on a near-black background (#0d0f14).
Building footprints as dark grey silhouettes with subtle edge glow.
No labels, no text, no compass rose. No people.
The center of the image is darker and emptier (for UI overlay),
with denser urban detail toward the edges.
Overall mood: surveillance, tension, noir thriller.
Seamless-tile-friendly composition. Square or 16:9 aspect ratio.
```

**日本語で指示する場合：**

```
ダークノワール風・真俯瞰の夜間都市マップ。
黒に近い背景（#0d0f14）に、琥珀色またはコールドブルーに発光した街路線と、
暗いグレーのビルシルエットが並ぶ抽象的な都市グリッド。
文字・テキスト・コンパス・人物なし。
中央は暗め・余白多め（UIテキストを重ねるため）、周縁部はやや密な都市描写。
監視・緊張・ノワールスリラーの空気感。正方形または横長16:9。
```

**使用上の注意：**  
- CSS側で `background-size: cover` + `opacity: 0.18〜0.25` 程度に抑えるとUIと干渉しにくい  
- 現在の `background: linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.72)), url(../assets/map.png)` の透明度は調整可能

#### 3-B. アイコンの統一（💣→イラスト系に差し替え）

現在の絵文字はOSによって見た目がブレる。  
[Google Fonts Icons](https://fonts.google.com/icons) の Material Symbols や、  
[Flaticon](https://www.flaticon.com/) の無料素材でアイコンを統一するだけで一気にブランド感が出る。

候補テーマ：「都市・捜査」系アイコン（手錠、スーツケース、電話、ビル）

---

### Lv.4 ［体験設計 → UXの磨き込み・中〜高コスト］

#### 4-A. 役職開示演出の追加

現在：テキストで「あなたは爆弾魔です」と表示

提案：役職開示時に1〜2秒のフェードイン + フレーバーテキスト

```
【爆弾魔】
今夜、この街の灯りを消せ。
誰にも気づかれてはならない——
```

```
【解除班】
市民の命が、あなたの判断にかかっている。
疑え。観察しろ。そして動け。
```

コード的には `overlay.css` と `overlay.js` へのアニメーション追加のみ。

#### 4-B. 「10秒で分かる」GIF or 静止画の追加

ロビー上部に「ルールを読む前に雰囲気をつかむ」1枚 or GIFを置く。

「インストール不要、URLだけで遊べる」という強みを絵で伝えることが目的。

---

**Veo3（Gemini）動画生成プロンプト：**

```
A short cinematic loop, approximately 8–10 seconds, in dark noir style.

Scene: A top-down view (bird's eye) of a dimly lit city at night.
Shadowy figures — silhouettes only, no faces — are seated around a circular table
with cards in their hands. The table is lit by a single overhead amber lamp.

Beat 1 (0–3s):
A hand reaches slowly across the table and steals a card from another silhouette.
Reaction: one figure leans back slightly. Another glances sideways.

Beat 2 (3–6s):
A piece — glowing faintly amber — is placed on a stylized city map at the center of the table.
The camera zooms slightly toward the glowing piece.

Beat 3 (6–10s):
Tension builds. One silhouette raises a hand as if making a declaration.
The screen flickers — a flash of orange light illuminates the faces (still stylized silhouettes),
then fades to near-black.
Final frame holds on the dim amber glow of the table.

Visual style:
- Color palette: near-black background, amber (#f5c842) accents, cold blue (#2980b9) rim light
- No text, no UI, no labels
- Cinematic grain, shallow depth of field
- Mood: suspense, mistrust, calm before the explosion
- Aspect ratio: 16:9, seamless loop preferred
- No music cues needed (silent video)
```

**日本語で指示する場合：**

```
10秒前後のシネマティックなダークノワール映像ループ。

シーン：深夜の都市を見下ろす俯瞰視点。
薄暗い部屋の中、円テーブルを囲む人影（シルエットのみ、顔は見えない）がカードを持っている。
テーブルは琥珀色のランプ1灯で照らされている。

・0〜3秒：手が伸び、別の人影のカードをそっと奪う。周囲の人影が微かに反応する。
・3〜6秒：中央の都市マップの上に、かすかに光るパーツ（琥珀色）が置かれる。カメラがわずかに寄る。
・6〜10秒：緊張が高まる。1人の人影が手を挙げ宣言するような動作をする。
　オレンジの閃光が一瞬走り、暗転。琥珀色の光だけが残るカットでループ終了。

スタイル：
- 背景は黒に近い深夜色、琥珀アクセント、コールドブルーのリムライト
- テキスト・UI・ラベルなし
- シネマティックな粒子感、ボケ感あり
- 空気感：疑念・緊張・爆発直前の静けさ
- アスペクト比：16:9、ループ可能な構成
```

**使用上のヒント：**
- 生成した動画は `assets/intro.mp4`（または `.webm`）として配置し、`<video autoplay loop muted playsinline>` で埋め込む
- `.lobby-thumbnail` の代わりに、または直上に置くと効果的
- ファイルサイズが大きい場合は ffmpeg で `gif` に変換（`-vf "fps=12,scale=480:-1"` 程度）

---

## まとめ：優先度マトリクス

| 施策 | コスト | 効果 | 優先度 |
|------|--------|------|--------|
| キャッチコピー変更（1-A） | ★☆☆ | ★★★ | **最優先** |
| SNS定型文変更（1-B） | ★☆☆ | ★★☆ | 高 |
| ダークモードCSS（2-A） | ★★☆ | ★★★ | 高 |
| OGPサムネイル刷新（3-A） | ★★☆ | ★★★ | 高 |
| ゲームログ演出（1-C） | ★☆☆ | ★★☆ | 中 |
| フォント差し替え（2-B） | ★☆☆ | ★★☆ | 中 |
| 役職開示演出（4-A） | ★★☆ | ★★★ | 中 |
| アイコン統一（3-B） | ★★☆ | ★★☆ | 中 |
| 10秒GIF（4-B） | ★★★ | ★★☆ | 低 |