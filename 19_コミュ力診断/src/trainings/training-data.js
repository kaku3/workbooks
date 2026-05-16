'use strict';

const TRAINING_TYPES = [
  'd1',
  'd2',
  'm1',
  'm2',
  'r1',
  'r2',
  'r3',
  's1',
  's2',
  's3',
];

const TRAINING_PAGES = {
  d1: {
    label: 'D1',
    title: 'D1型 90日トレーニング｜コミュ力診断',
    tone: { bg: '#eaf6fb', border: '#d0e7f2', text: '#0C447C' },
    mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">D1 — 組み立てグループ</div>
    <div class="type-hero-title">🔌 「見えてるけど気づかない」型</div>
    <div class="type-hero-sub">
      認知はできているが、判断・行動に変換するステップが抜けている。<br>
      一緒に考えると答えが出てくるのに、一人に任せると出てこない。<br>
      このトレーニングでは、<strong>頭の中にある気づきを「出力」につなげる回路</strong>を90日かけて育てます。
    </div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title">📐 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon">💡</div>
        <div class="node-label">気づいている</div>
        <div class="node-sub">見えてる・感じてる</div>
      </div>
      <div class="insight-arrow broken">
        <div style="display:flex;align-items:center;gap:0">
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div style="width:10px;height:3px;border-top:3px dashed #E24B4A;"></div>
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div class="insight-arrow-head"></div>
        </div>
        <div class="insight-gap-label">⚡ 回路 未接続</div>
      </div>
      <div class="insight-node">
        <div class="node-icon">📝</div>
        <div class="node-label">伝えられない</div>
        <div class="node-sub">報告・文章・説明</div>
      </div>
    </div>
    <div class="insight-desc">
      問題は「分かっていない」のではなく、「分かっていることを出力するステップが抜けている」こと。<br>
      悪意や怠慢ではない。外部化のトレーニングで、回路は必ず繋がる。
    </div>
  </div>

  <!-- PROGRESS OVERVIEW -->
  <div class="progress-overview">
    <div class="phase-chip active" id="chip-1" onclick="scrollToPhase(1)">
      <div class="phase-chip-label">PHASE 1</div>
      <div class="phase-chip-week">1〜3週</div>
      <div class="phase-chip-name">知る・体験</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-2" onclick="scrollToPhase(2)">
      <div class="phase-chip-label">PHASE 2</div>
      <div class="phase-chip-week">4〜7週</div>
      <div class="phase-chip-name">一人で試す</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-3" onclick="scrollToPhase(3)">
      <div class="phase-chip-label">PHASE 3</div>
      <div class="phase-chip-week">8〜11週</div>
      <div class="phase-chip-name">定着させる</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-4" onclick="scrollToPhase(4)">
      <div class="phase-chip-label">PHASE 4</div>
      <div class="phase-chip-week">12〜13週</div>
      <div class="phase-chip-name">手離れ確認</div>
      <div class="phase-done-mark">✅</div>
    </div>
  </div>

  <!-- HEATMAP -->
  <div class="heatmap-box">
    <div class="heatmap-header">
      <div class="heatmap-title">📅 90日のチェック記録</div>
      <div class="heatmap-streak" id="heatmap-streak" style="display:none"></div>
    </div>
    <div class="heatmap-scroll">
      <div class="heatmap-grid" id="heatmap-grid"></div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-total" id="heatmap-total"></div>
      <div class="heatmap-legend">
        <span>少ない</span>
        <div class="heatmap-legend-cell" style="background:#EBEBEB"></div>
        <div class="heatmap-legend-cell" style="background:#9BE9C4"></div>
        <div class="heatmap-legend-cell" style="background:#40C28A"></div>
        <div class="heatmap-legend-cell" style="background:#1D9E75"></div>
        <div class="heatmap-legend-cell" style="background:#0e7a58"></div>
        <span>多い</span>
      </div>
    </div>
  </div>

  <!-- SHARE BUTTON -->
  <div class="share-wrap">
    <button class="share-btn" id="share-btn" onclick="shareProgress()">
      📤 メンターに共有
    </button>
  </div>

  <!-- ===== PHASE 1 ===== -->
  <div class="section-heading phase-1" id="phase-1">
    <span class="phase-tag">PHASE 1</span>
    知る・体験する（1〜3週）
  </div>

  <!-- WK1 -->
  <div class="week-block phase-1" id="week-1">
    <div class="week-head" onclick="toggleWeek('week-1')">
      <div class="week-num">WK 1</div>
      <div class="week-title-wrap">
        <div class="week-title">問答を体験する</div>
        <div class="week-sub">「一緒に考えると答えが出る」を実感する</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、問答で出た気づきをその日のうちに短く外部化できた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box">✓</div>
          <div class="check-text">メンターとの問答で「なぜそう判断したか」を言語化した</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box">✓</div>
          <div class="check-text">今日の問答後に「自分が言いたかったこと」を3行以内でメモした</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box">✓</div>
          <div class="check-text">今日のやり取りで「言われれば確かに」と思った瞬間を1つメモした</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        「なぜそう判断したか」「読む人は何を知らないと思う？」と繰り返し問う。答えが出てきたら「それが書ければ合格です」と伝える。答えを教えず、引き出すことだけに集中する。
      </div>
    </div>
  </div>

  <!-- WK2 -->
  <div class="week-block phase-1" id="week-2">
    <div class="week-head" onclick="toggleWeek('week-2')">
      <div class="week-num">WK 2</div>
      <div class="week-title-wrap">
        <div class="week-title">名前を書いてから書く</div>
        <div class="week-sub">「誰が読むか」を先に決めると視点が変わる</div>
      </div>
      <div class="week-check-count" id="cnt-week-2">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、書き始める前に読み手視点へ切り替える準備ができた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box">✓</div>
          <div class="check-text">報告・文章を書く前に「誰が読むか」を紙またはメモに書いた</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box">✓</div>
          <div class="check-text">書いた後で「最初に伝えたいこと」を3秒で言い直して確認した</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box">✓</div>
          <div class="check-text">WK1との違い（書く前の視点や出来ばえ）を1行メモした</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 なぜ「名前を先に書く」のか</div>
        「読む人の名前」を書いた瞬間に、思考が「自分視点」から「相手視点」に切り替わる人が多い。バカバカしく感じても、まずやってみることが大事。1週間続けると効果を実感できる。
      </div>
    </div>
  </div>

  <!-- WK3 -->
  <div class="week-block phase-1" id="week-3">
    <div class="week-head" onclick="toggleWeek('week-3')">
      <div class="week-num">WK 3</div>
      <div class="week-title-wrap">
        <div class="week-title">差分を言語化する</div>
        <div class="week-sub">「良い例と自分の例の違い」を口で説明できるか確認</div>
      </div>
      <div class="week-check-count" id="cnt-week-3">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、良い例との差分を1つ見つけて言葉にできた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box">✓</div>
          <div class="check-text">メンターの「良い例」と自分の例を1つ並べて見比べた</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box">✓</div>
          <div class="check-text">差分を「何が違うか」の1文で口頭説明した</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box">✓</div>
          <div class="check-text">差分のポイントを自分のメモに1〜2行で書いた</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        D1型は比較させると差分を正確に言語化できる。ここで出てきた言語化を「それが今あなたに足りていること」と伝える。責めるのではなく、「見えた」ことを一緒に喜ぶトーンで。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-emoji">🎉</div>
    <div>
      <div class="phase-banner-title">PHASE 1 完了！</div>
      <div class="phase-banner-sub">「見えていること」を外に出す体験ができました。次は一人でやってみましょう。</div>
    </div>
  </div>

  <!-- ===== PHASE 2 ===== -->
  <div class="section-heading phase-2" id="phase-2">
    <span class="phase-tag">PHASE 2</span>
    一人で試す（4〜7週）
  </div>

  <!-- WK4 -->
  <div class="week-block phase-2" id="week-4">
    <div class="week-head" onclick="toggleWeek('week-4')">
      <div class="week-num">WK 4</div>
      <div class="week-title-wrap">
        <div class="week-title">提出前に声に出す</div>
        <div class="week-sub">チェックを「仕組み」にして一人でもできるようにする</div>
      </div>
      <div class="week-check-count" id="cnt-week-4">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、提出前のセルフチェックを声出しで実行できた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box">✓</div>
          <div class="check-text">報告・文章の提出前に「ズレてない？」と声に出して確認した</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box">✓</div>
          <div class="check-text">声出し確認のあとにズレを1点以上修正した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box">✓</div>
          <div class="check-text">実施した声出しチェックの結果をメンターに共有した</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 声に出す理由</div>
        声に出すと視覚野と音声野が同時に動き、黙って読むより盲点に気づきやすくなる。慣れてくれば心の中で言うだけでもOK。まず1週間、必ず声に出してみる。
      </div>
    </div>
  </div>

  <!-- WK5 -->
  <div class="week-block phase-2" id="week-5">
    <div class="week-head" onclick="toggleWeek('week-5')">
      <div class="week-num">WK 5</div>
      <div class="week-title-wrap">
        <div class="week-title">自分で差分を見つける</div>
        <div class="week-sub">メンターの助けなしで比較・言語化できるか試す</div>
      </div>
      <div class="week-check-count" id="cnt-week-5">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、メンターなしでも差分の自己診断を回せた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box">✓</div>
          <div class="check-text">書いた文章を1つ選び、良い例と並べて比較した</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box">✓</div>
          <div class="check-text">メンターの助けなしで「どこが違うか」を1〜2行メモした</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box">✓</div>
          <div class="check-text">差分メモをメンターに短く報告した</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        WK3では一緒にやったが今週は本人が自分で選ぶことが重要。「どうやって選んだか」も聞く。言語化の精度が上がっているかを確認し、上がっていれば「一人でできた」と明確に評価する。
      </div>
    </div>
  </div>

  <!-- WK6 -->
  <div class="week-block phase-2" id="week-6">
    <div class="week-head" onclick="toggleWeek('week-6')">
      <div class="week-num">WK 6</div>
      <div class="week-title-wrap">
        <div class="week-title">指摘前に直す</div>
        <div class="week-sub">「言われれば確かに」から「言われる前に確かに」へ</div>
      </div>
      <div class="week-check-count" id="cnt-week-6">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指摘前に自分で気づいて直す流れを1回作れた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box">✓</div>
          <div class="check-text">提出前に「読む人の名前」を思い浮かべてから確認した</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box">✓</div>
          <div class="check-text">指摘を受ける前に自分で1点以上修正した</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box">✓</div>
          <div class="check-text">「自分で気づいた瞬間」をメンターに共有した</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 1回でいい</div>
        1回でも「言われる前に気づけた」経験があれば十分。完璧にできなくていい。その瞬間が「回路が繋がった証拠」。何回あったかより、あったかどうかが大事。
      </div>
    </div>
  </div>

  <!-- WK7 -->
  <div class="week-block phase-2" id="week-7">
    <div class="week-head" onclick="toggleWeek('week-7')">
      <div class="week-num">WK 7</div>
      <div class="week-title-wrap">
        <div class="week-title">アプローチを組み合わせる</div>
        <div class="week-sub">自分に合う方法を整理してPHASE 3の準備をする</div>
      </div>
      <div class="week-check-count" id="cnt-week-7">0/2</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、複数アプローチを使い分けて自分の型を言語化できた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box">✓</div>
          <div class="check-text">WK4〜6で学んだアプローチを2つ組み合わせて使った</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box">✓</div>
          <div class="check-text">「どれが自分に一番効いたか」をメンターに話した</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        3つのアプローチ（問答・比較・声出し）のどれが本人に合っているかを一緒に整理する。PHASE 3ではその方法を中心に定着させる。全部やろうとさせず、絞ることが重要。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-emoji">✨</div>
    <div>
      <div class="phase-banner-title">PHASE 2 完了！</div>
      <div class="phase-banner-sub">一人で動ける経験が増えてきました。次は「なんとなくできる」状態を目指しましょう。</div>
    </div>
  </div>

  <!-- ===== PHASE 3 ===== -->
  <div class="section-heading phase-3" id="phase-3">
    <span class="phase-tag">PHASE 3</span>
    定着させる（8〜11週）
  </div>

  <!-- WK8（8〜9週） -->
  <div class="week-block phase-3" id="week-8">
    <div class="week-head" onclick="toggleWeek('week-8')">
      <div class="week-num">WK 8–9</div>
      <div class="week-title-wrap">
        <div class="week-title">意識せず動けた瞬間を記録する</div>
        <div class="week-sub">「意識してやる」から「気がついたらやっていた」への変化を観察</div>
      </div>
      <div class="week-check-count" id="cnt-week-8">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、無意識にできた読み手視点の行動を記録できた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box">✓</div>
          <div class="check-text">意識しなくても「読み手視点」が出た場面を1つ見つけた</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box">✓</div>
          <div class="check-text">その瞬間を「いつ・何の文章・何が出た」の3点でメモした</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box">✓</div>
          <div class="check-text">今日のメモを次回1on1で使えるよう保存した</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 変化は小さくていい</div>
        最初はめったにないかもしれないが、週を重ねるほど増えてくる。「なかった」も正直に記録してOK。記録する習慣自体が観察力を育てる。
      </div>
    </div>
  </div>

  <!-- WK10（10〜11週） -->
  <div class="week-block phase-3" id="week-10">
    <div class="week-head" onclick="toggleWeek('week-10')">
      <div class="week-num">WK 10–11</div>
      <div class="week-title-wrap">
        <div class="week-title">メンターなしで自走する</div>
        <div class="week-sub">その日の振り返りと修正を自分だけで完結する</div>
      </div>
      <div class="week-check-count" id="cnt-week-10">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、自走で振り返りと修正を完了できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box">✓</div>
          <div class="check-text">困ったことや気になったことを記録した（何もなければ「なし」と記録）</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box">✓</div>
          <div class="check-text">指摘を受けた場合はその内容を自分でメモした</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box">✓</div>
          <div class="check-text">今日の振り返りをメンターへ報告できる形に1行で整理した</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        ここは「様子を見る期間」。連絡があっても最小限の応答にとどめ、記録させることに集中させる。報告会の場で「どうでしたか？」と聞くだけで十分。自走できたかどうかを一緒に確認する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-emoji">🌱</div>
    <div>
      <div class="phase-banner-title">PHASE 3 完了！</div>
      <div class="phase-banner-sub">習慣として定着してきました。最後の卒業判定に進みましょう。</div>
    </div>
  </div>

  <!-- ===== PHASE 4 ===== -->
  <div class="section-heading phase-4" id="phase-4">
    <span class="phase-tag">PHASE 4</span>
    手離れ確認（12〜13週）
  </div>

  <!-- WK12（12〜13週） -->
  <div class="week-block phase-4" id="week-12">
    <div class="week-head" onclick="toggleWeek('week-12')">
      <div class="week-num">WK 12–13</div>
      <div class="week-title-wrap">
        <div class="week-title">卒業判定</div>
        <div class="week-sub">自走・自覚・再現の3基準を双方で確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-12">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業3基準（自走・自覚・再現）をその日の行動で確認できた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box">✓</div>
          <div class="check-text">【自走】今日のタスクで、指摘前に自分で修正して完了した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box">✓</div>
          <div class="check-text">【自覚】「なぜ読み手視点が必要か」を自分の言葉で説明した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box">✓</div>
          <div class="check-text">【再現】今日の新しいタスクでも同じアプローチを再現して使った</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        3つ全部YESなら卒業。2つ以下の場合は足りない項目を具体的に伝え、WK10-11に戻るか新しい課題を設定する。「合格か不合格か」でなく「次のステップ」として話す。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-4">
    <div class="phase-banner-emoji">🎓</div>
    <div>
      <div class="phase-banner-title">PHASE 4 完了！</div>
      <div class="phase-banner-sub">卒業判定の準備ができました。メンターと最終確認をしましょう。</div>
    </div>
  </div>

  <!-- GRADUATION -->
  <div class="grad-section" id="grad-section">
    <div class="grad-emoji">🎓</div>
    <div class="grad-title">90日間、お疲れさまでした！</div>
    <div class="grad-sub">
      「見えていること」を「出力」に変える回路が繋がりました。<br>
      これからは、一人でも「誰が読むか」を考えながら動ける自分がいます。
    </div>
  </div>
`
  },
  d2: {
    label: 'D2',
    title: 'D2型 90日トレーニング｜コミュ力診断',
    tone: { bg: '#eaf6fb', border: '#d0e7f2', text: '#0C447C' },
    mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">D2 — 組み立てグループ</div>
    <div class="type-hero-title">🪟 「自分視点のまま」型</div>
    <div class="type-hero-sub">
      自分の中では筋が通っていても、読み手が知らない前提が抜けやすいタイプです。<br>
      その結果、説明が突然に見えたり、用語が難しすぎたりして伝達ロスが起きます。<br>
      このトレーニングでは、<strong>相手の前提を先に置く書き方</strong>を90日かけて身につけます。
    </div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title">📐 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon">🧠</div>
        <div class="node-label">送信者の頭の中</div>
        <div class="node-sub">前提を知っている</div>
      </div>
      <div class="insight-arrow broken">
        <div style="display:flex;align-items:center;gap:0">
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div style="width:10px;height:3px;border-top:3px dashed #E24B4A;"></div>
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div class="insight-arrow-head"></div>
        </div>
        <div class="insight-gap-label">⚡ 前提 未共有</div>
      </div>
      <div class="insight-node">
        <div class="node-icon">👀</div>
        <div class="node-label">受信者の頭の中</div>
        <div class="node-sub">前提が足りない</div>
      </div>
    </div>
    <div class="insight-desc">
      問題は能力不足ではなく、読み手の前提を先に想像する工程が抜けること。<br>
      書く前の一手間で、同じ内容でも伝わり方は大きく変えられます。
    </div>
  </div>

  <!-- PROGRESS OVERVIEW -->
  <div class="progress-overview">
    <div class="phase-chip active" id="chip-1" onclick="scrollToPhase(1)">
      <div class="phase-chip-label">PHASE 1</div>
      <div class="phase-chip-week">1〜3週</div>
      <div class="phase-chip-name">知る・体験</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-2" onclick="scrollToPhase(2)">
      <div class="phase-chip-label">PHASE 2</div>
      <div class="phase-chip-week">4〜7週</div>
      <div class="phase-chip-name">一人で試す</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-3" onclick="scrollToPhase(3)">
      <div class="phase-chip-label">PHASE 3</div>
      <div class="phase-chip-week">8〜11週</div>
      <div class="phase-chip-name">定着させる</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-4" onclick="scrollToPhase(4)">
      <div class="phase-chip-label">PHASE 4</div>
      <div class="phase-chip-week">12〜13週</div>
      <div class="phase-chip-name">手離れ確認</div>
      <div class="phase-done-mark">✅</div>
    </div>
  </div>

  <!-- HEATMAP -->
  <div class="heatmap-box">
    <div class="heatmap-header">
      <div class="heatmap-title">📅 90日のチェック記録</div>
      <div class="heatmap-streak" id="heatmap-streak" style="display:none"></div>
    </div>
    <div class="heatmap-scroll">
      <div class="heatmap-grid" id="heatmap-grid"></div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-total" id="heatmap-total"></div>
      <div class="heatmap-legend">
        <span>少ない</span>
        <div class="heatmap-legend-cell" style="background:#EBEBEB"></div>
        <div class="heatmap-legend-cell" style="background:#9BE9C4"></div>
        <div class="heatmap-legend-cell" style="background:#40C28A"></div>
        <div class="heatmap-legend-cell" style="background:#1D9E75"></div>
        <div class="heatmap-legend-cell" style="background:#0e7a58"></div>
        <span>多い</span>
      </div>
    </div>
  </div>

  <!-- SHARE BUTTON -->
  <div class="share-wrap">
    <button class="share-btn" id="share-btn" onclick="shareProgress()">
      📤 メンターに共有
    </button>
  </div>

  <!-- ===== PHASE 1 ===== -->
  <div class="section-heading phase-1" id="phase-1">
    <span class="phase-tag">PHASE 1</span>
    知る・体験する（1〜3週）
  </div>

  <!-- WK1 -->
  <div class="week-block phase-1" id="week-1">
    <div class="week-head" onclick="toggleWeek('week-1')">
      <div class="week-num">WK 1</div>
      <div class="week-title-wrap">
        <div class="week-title">読み手の前提を確認する</div>
        <div class="week-sub">書く前に「相手が知らないこと」を先に洗い出す</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、相手に必要な前提を先に置いてから本文を書けた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box">✓</div>
          <div class="check-text">書く前に「相手が知らない前提」を1つ書き出した</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box">✓</div>
          <div class="check-text">本文の冒頭に前提条件を1行追加してから書き始めた</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box">✓</div>
          <div class="check-text">「この人は何を知らないか」をメンターに口頭共有した</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        D2型は「本人には自明な前提」が抜けやすい。必ず「読む人は何を知らないか」を先に聞く。修正文は長さより、前提が補われているかだけを評価する。
      </div>
    </div>
  </div>

  <!-- WK2 -->
  <div class="week-block phase-1" id="week-2">
    <div class="week-head" onclick="toggleWeek('week-2')">
      <div class="week-num">WK 2</div>
      <div class="week-title-wrap">
        <div class="week-title">用語を翻訳してから書く</div>
        <div class="week-sub">相手の語彙レベルに合わせて言い換える</div>
      </div>
      <div class="week-check-count" id="cnt-week-2">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、専門用語や略語を読み手向けに言い換えられた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box">✓</div>
          <div class="check-text">専門用語・略語を1つ以上やさしい表現に言い換えた</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box">✓</div>
          <div class="check-text">略語を初出時に正式名称または注釈つきで書いた</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box">✓</div>
          <div class="check-text">言い換え後に「この文で伝わるか」を1文で自己確認した</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 なぜ「言い換え」が効くのか</div>
        D2は「自分には分かる言葉」をそのまま出しやすい。初見の人が分かる語に1つ言い換えるだけで、理解速度が大きく上がる。完璧な翻訳より、まず1語の置き換えを毎日続けることが効果的。
      </div>
    </div>
  </div>

  <!-- WK3 -->
  <div class="week-block phase-1" id="week-3">
    <div class="week-head" onclick="toggleWeek('week-3')">
      <div class="week-num">WK 3</div>
      <div class="week-title-wrap">
        <div class="week-title">前提の抜けを検出する</div>
        <div class="week-sub">読み手が躓くポイントを事前に潰す</div>
      </div>
      <div class="week-check-count" id="cnt-week-3">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、前提不足を1つ見つけて補足できた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box">✓</div>
          <div class="check-text">自分の文章を見直して「前提が飛んでいる箇所」を1つ見つけた</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box">✓</div>
          <div class="check-text">その箇所に背景説明または条件説明を1行補った</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box">✓</div>
          <div class="check-text">補足後の文章を「初見の人に伝わるか」で再確認した</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        「説明が長い/短い」ではなく「前提が埋まっているか」を軸に評価する。1文でも前提が入れば改善として認め、継続意欲を保つ。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-emoji">🎉</div>
    <div>
      <div class="phase-banner-title">PHASE 1 完了！</div>
      <div class="phase-banner-sub">前提を置く型ができました。次はメンターなしでも再現してみましょう。</div>
    </div>
  </div>

  <!-- ===== PHASE 2 ===== -->
  <div class="section-heading phase-2" id="phase-2">
    <span class="phase-tag">PHASE 2</span>
    一人で試す（4〜7週）
  </div>

  <!-- WK4 -->
  <div class="week-block phase-2" id="week-4">
    <div class="week-head" onclick="toggleWeek('week-4')">
      <div class="week-num">WK 4</div>
      <div class="week-title-wrap">
        <div class="week-title">提出前に読み手テストする</div>
        <div class="week-sub">初見の人が詰まる箇所を提出前に潰す</div>
      </div>
      <div class="week-check-count" id="cnt-week-4">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、提出前に読み手目線のテストを実施できた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box">✓</div>
          <div class="check-text">提出前に「この文章は初見でも分かるか？」を声に出して確認した</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box">✓</div>
          <div class="check-text">確認後に前提不足または用語不足を1点以上修正した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box">✓</div>
          <div class="check-text">修正前後の差分をメンターに1行で共有した</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 声に出す理由</div>
        声に出すと視覚野と音声野が同時に動き、黙って読むより盲点に気づきやすくなる。慣れてくれば心の中で言うだけでもOK。まず1週間、必ず声に出してみる。
      </div>
    </div>
  </div>

  <!-- WK5 -->
  <div class="week-block phase-2" id="week-5">
    <div class="week-head" onclick="toggleWeek('week-5')">
      <div class="week-num">WK 5</div>
      <div class="week-title-wrap">
        <div class="week-title">前提チェックを自走化する</div>
        <div class="week-sub">メンターなしで前提漏れを発見して補う</div>
      </div>
      <div class="week-check-count" id="cnt-week-5">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、前提チェックを自分だけで回せた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box">✓</div>
          <div class="check-text">書いた文章を1つ選び「読み手が知らない前提」を1つ抽出した</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box">✓</div>
          <div class="check-text">抽出した前提を1〜2行で補足した</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box">✓</div>
          <div class="check-text">補足後の文章を自分で読み直し「詰まらないか」を確認した</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        ここは「本人が自分で前提漏れを拾えるか」の確認週。見つけ方を言語化させ、再現可能な手順に固定する。
      </div>
    </div>
  </div>

  <!-- WK6 -->
  <div class="week-block phase-2" id="week-6">
    <div class="week-head" onclick="toggleWeek('week-6')">
      <div class="week-num">WK 6</div>
      <div class="week-title-wrap">
        <div class="week-title">先回りで補足する</div>
        <div class="week-sub">指摘される前に前提不足を埋める</div>
      </div>
      <div class="week-check-count" id="cnt-week-6">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指摘前に前提補足を1回以上実行できた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box">✓</div>
          <div class="check-text">提出前に「この人は何を知らないか」を1つ書き出した</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box">✓</div>
          <div class="check-text">前提不足を自分で1点以上補足してから提出した</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box">✓</div>
          <div class="check-text">「先回りで補足できた箇所」をメンターに共有した</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 先回りは小さくてよい</div>
        1文の前提補足でも効果は大きい。完璧な説明を狙うより、相手が詰まる一点を先に埋める意識を優先する。
      </div>
    </div>
  </div>

  <!-- WK7 -->
  <div class="week-block phase-2" id="week-7">
    <div class="week-head" onclick="toggleWeek('week-7')">
      <div class="week-num">WK 7</div>
      <div class="week-title-wrap">
        <div class="week-title">自分の補足パターンを固定する</div>
        <div class="week-sub">効く順番を決めて迷わず回す</div>
      </div>
      <div class="week-check-count" id="cnt-week-7">0/2</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、自分に効く補足手順を同じ順番で回せた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box">✓</div>
          <div class="check-text">WK4〜6で効いた手順を2つ以上組み合わせて使った</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box">✓</div>
          <div class="check-text">「自分の補足手順」をメンターに1分で説明した</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        補足手順を固定できると再現性が上がる。「誰を想定→何を補足→どこに書く」の順で本人の型を確定させる。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-emoji">✨</div>
    <div>
      <div class="phase-banner-title">PHASE 2 完了！</div>
      <div class="phase-banner-sub">自走の型ができました。次は無意識でも前提を補える状態へ進みます。</div>
    </div>
  </div>

  <!-- ===== PHASE 3 ===== -->
  <div class="section-heading phase-3" id="phase-3">
    <span class="phase-tag">PHASE 3</span>
    定着させる（8〜11週）
  </div>

  <!-- WK8（8〜9週） -->
  <div class="week-block phase-3" id="week-8">
    <div class="week-head" onclick="toggleWeek('week-8')">
      <div class="week-num">WK 8–9</div>
      <div class="week-title-wrap">
        <div class="week-title">無意識の相手視点を記録する</div>
        <div class="week-sub">自然に前提補足できた瞬間を可視化する</div>
      </div>
      <div class="week-check-count" id="cnt-week-8">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、無意識でできた前提補足の行動を記録できた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box">✓</div>
          <div class="check-text">意識しなくても相手視点で補足できた場面を1つ見つけた</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box">✓</div>
          <div class="check-text">その瞬間を「いつ・何の文・どの前提を補ったか」でメモした</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box">✓</div>
          <div class="check-text">今日のメモを次回1on1で共有できる場所に保存した</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 変化は小さくていい</div>
        最初は少なくて問題ない。「できた瞬間」を拾うほど再現しやすくなる。できなかった日も「なぜ抜けたか」を一言残すと次が改善しやすい。
      </div>
    </div>
  </div>

  <!-- WK10（10〜11週） -->
  <div class="week-block phase-3" id="week-10">
    <div class="week-head" onclick="toggleWeek('week-10')">
      <div class="week-num">WK 10–11</div>
      <div class="week-title-wrap">
        <div class="week-title">メンターなしで前提補足を回す</div>
        <div class="week-sub">自走で記録・修正・再提出まで完結する</div>
      </div>
      <div class="week-check-count" id="cnt-week-10">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、前提補足のサイクルを自走で完了できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box">✓</div>
          <div class="check-text">相手が詰まりそうな箇所を1つ記録した（なければ「なし」と記録）</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box">✓</div>
          <div class="check-text">受けた指摘を「前提不足/用語不足/順序不足」に分類してメモした</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box">✓</div>
          <div class="check-text">明日の改善アクションを1行で決めた</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        この期間は「助言より記録」。詰まり分類と改善アクションが自分で回っていれば合格。細かい添削は減らして自走性を優先する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-emoji">🌱</div>
    <div>
      <div class="phase-banner-title">PHASE 3 完了！</div>
      <div class="phase-banner-sub">相手視点の補足が定着しました。最後に卒業基準を日次で確認します。</div>
    </div>
  </div>

  <!-- ===== PHASE 4 ===== -->
  <div class="section-heading phase-4" id="phase-4">
    <span class="phase-tag">PHASE 4</span>
    手離れ確認（12〜13週）
  </div>

  <!-- WK12（12〜13週） -->
  <div class="week-block phase-4" id="week-12">
    <div class="week-head" onclick="toggleWeek('week-12')">
      <div class="week-num">WK 12–13</div>
      <div class="week-title-wrap">
        <div class="week-title">卒業判定</div>
        <div class="week-sub">自走・自覚・再現をその日の行動で確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-12">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業3基準を実タスクで満たせた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box">✓</div>
          <div class="check-text">【自走】今日のタスクで、前提不足を自分で補って完了した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box">✓</div>
          <div class="check-text">【自覚】「なぜ前提共有が必要か」を自分の言葉で説明した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box">✓</div>
          <div class="check-text">【再現】今日の新しいタスクでも前提補足の手順を再現して使った</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        3つ全部YESなら卒業。未達項目がある場合は、詰まり分類（前提/用語/順序）のどこで崩れたかを特定して翌日タスクに戻す。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-4">
    <div class="phase-banner-emoji">🎓</div>
    <div>
      <div class="phase-banner-title">PHASE 4 完了！</div>
      <div class="phase-banner-sub">卒業判定の準備ができました。メンターと最終確認をしましょう。</div>
    </div>
  </div>

  <!-- GRADUATION -->
  <div class="grad-section" id="grad-section">
    <div class="grad-emoji">🎓</div>
    <div class="grad-title">90日間、お疲れさまでした！</div>
    <div class="grad-sub">
      自分視点だけで書く癖から、相手視点で前提を補う習慣へ進化できました。<br>
      これからは、誰が読んでも迷いにくい説明を自分で組み立てられます。
    </div>
  </div>
`
  },
  m1: {
    label: 'M1',
    title: 'M1型 90日トレーニング｜コミュ力診断',
    tone: { bg: '#fff4ee', border: '#f3d8ca', text: '#7a2f13' },
    mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">M1 — メンタルグループ</div>
    <div class="type-hero-title">😶 「困っていない」型</div>
    <div class="type-hero-sub">
      問題を問題だと感じにくく、改善の優先度が上がらない状態です。<br>
      そのままだと、指摘を受けても行動が翌日に戻りやすくなります。<br>
      このトレーニングでは、<strong>意欲に依存しない実行ループ</strong>を90日かけて作ります。
    </div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title">📐 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon">👤</div>
        <div class="node-label">理解はしている</div>
        <div class="node-sub">でも優先しない</div>
      </div>
      <div class="insight-arrow broken">
        <div style="display:flex;align-items:center;gap:0">
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div style="width:10px;height:3px;border-top:3px dashed #E24B4A;"></div>
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div class="insight-arrow-head"></div>
        </div>
        <div class="insight-gap-label">⚡ 動機 欠如</div>
      </div>
      <div class="insight-node">
        <div class="node-icon">🔁</div>
        <div class="node-label">行動は元に戻る</div>
        <div class="node-sub">再発のループ</div>
      </div>
    </div>
    <div class="insight-desc">
      問題は「分かっていない」ことより、改善の優先順位が上がらないこと。<br>
      仕組みと評価軸を固定すると、行動は安定して変わります。
    </div>
  </div>

  <!-- PROGRESS OVERVIEW -->
  <div class="progress-overview">
    <div class="phase-chip active" id="chip-1" onclick="scrollToPhase(1)">
      <div class="phase-chip-label">PHASE 1</div>
      <div class="phase-chip-week">1〜3週</div>
      <div class="phase-chip-name">知る・体験</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-2" onclick="scrollToPhase(2)">
      <div class="phase-chip-label">PHASE 2</div>
      <div class="phase-chip-week">4〜7週</div>
      <div class="phase-chip-name">一人で試す</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-3" onclick="scrollToPhase(3)">
      <div class="phase-chip-label">PHASE 3</div>
      <div class="phase-chip-week">8〜11週</div>
      <div class="phase-chip-name">定着させる</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-4" onclick="scrollToPhase(4)">
      <div class="phase-chip-label">PHASE 4</div>
      <div class="phase-chip-week">12〜13週</div>
      <div class="phase-chip-name">手離れ確認</div>
      <div class="phase-done-mark">✅</div>
    </div>
  </div>

  <!-- HEATMAP -->
  <div class="heatmap-box">
    <div class="heatmap-header">
      <div class="heatmap-title">📅 90日のチェック記録</div>
      <div class="heatmap-streak" id="heatmap-streak" style="display:none"></div>
    </div>
    <div class="heatmap-scroll">
      <div class="heatmap-grid" id="heatmap-grid"></div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-total" id="heatmap-total"></div>
      <div class="heatmap-legend">
        <span>少ない</span>
        <div class="heatmap-legend-cell" style="background:#EBEBEB"></div>
        <div class="heatmap-legend-cell" style="background:#9BE9C4"></div>
        <div class="heatmap-legend-cell" style="background:#40C28A"></div>
        <div class="heatmap-legend-cell" style="background:#1D9E75"></div>
        <div class="heatmap-legend-cell" style="background:#0e7a58"></div>
        <span>多い</span>
      </div>
    </div>
  </div>

  <!-- SHARE BUTTON -->
  <div class="share-wrap">
    <button class="share-btn" id="share-btn" onclick="shareProgress()">
      📤 メンターに共有
    </button>
  </div>

  <!-- ===== PHASE 1 ===== -->
  <div class="section-heading phase-1" id="phase-1">
    <span class="phase-tag">PHASE 1</span>
    知る・体験する（1〜3週）
  </div>

  <!-- WK1 -->
  <div class="week-block phase-1" id="week-1">
    <div class="week-head" onclick="toggleWeek('week-1')">
      <div class="week-num">WK 1</div>
      <div class="week-title-wrap">
        <div class="week-title">今のままのデメリットを見る</div>
        <div class="week-sub">動かないと困ることをはっきりさせる</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、「このままだと困ること」を言葉にできた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box">✓</div>
          <div class="check-text">「このままだと困ること」を1行で書いた</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box">✓</div>
          <div class="check-text">「直したら良くなること」を1行で書いた</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box">✓</div>
          <div class="check-text">書いた内容をメンターに短く伝えた</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        M1は「気合いで頑張る」が続きにくい。毎日、短く確認して行動に落とす。
      </div>
    </div>
  </div>

  <!-- WK2 -->
  <div class="week-block phase-1" id="week-2">
    <div class="week-head" onclick="toggleWeek('week-2')">
      <div class="week-num">WK 2</div>
      <div class="week-title-wrap">
        <div class="week-title">やる時間と順番を決める</div>
        <div class="week-sub">迷わず着手できる形にする</div>
      </div>
      <div class="week-check-count" id="cnt-week-2">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、同じ流れでチェックできた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box">✓</div>
          <div class="check-text">決めた時間にチェックを始めた</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box">✓</div>
          <div class="check-text">チェックリストを上から順に実施した</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box">✓</div>
          <div class="check-text">できたかどうかを記録した</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 なぜ「時間と順番」が効くのか</div>
        気分が乗らない日でも、時間と順番が決まっていると始めやすい。
      </div>
    </div>
  </div>

  <!-- WK3 -->
  <div class="week-block phase-1" id="week-3">
    <div class="week-head" onclick="toggleWeek('week-3')">
      <div class="week-num">WK 3</div>
      <div class="week-title-wrap">
        <div class="week-title">サボりやすい所を見つける</div>
        <div class="week-sub">漏れやすい所を先に確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-3">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、漏れやすい所を見つけて直せた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box">✓</div>
          <div class="check-text">飛ばしやすい手順がないか確認した</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box">✓</div>
          <div class="check-text">見つけた問題をその場で直した</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box">✓</div>
          <div class="check-text">直した内容をもう一度確認した</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        責めるより、漏れる所を先に見つけて直す流れを作る。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-emoji">🎉</div>
    <div>
      <div class="phase-banner-title">PHASE 1 完了！</div>
      <div class="phase-banner-sub">実行の土台ができました。次は自走で回せるかを確認します。</div>
    </div>
  </div>

  <!-- ===== PHASE 2 ===== -->
  <div class="section-heading phase-2" id="phase-2">
    <span class="phase-tag">PHASE 2</span>
    一人で試す（4〜7週）
  </div>

  <!-- WK4 -->
  <div class="week-block phase-2" id="week-4">
    <div class="week-head" onclick="toggleWeek('week-4')">
      <div class="week-num">WK 4</div>
      <div class="week-title-wrap">
        <div class="week-title">自分から始める</div>
        <div class="week-sub">言われる前に動く</div>
      </div>
      <div class="week-check-count" id="cnt-week-4">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、声かけなしでチェックを完了できた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box">✓</div>
          <div class="check-text">言われる前にチェックを始めた</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box">✓</div>
          <div class="check-text">チェック結果を見て直した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box">✓</div>
          <div class="check-text">終わったことを決めた形で報告した</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 先に始めることが大事</div>
        完璧にやるより、まず始める。始めると続きやすくなる。
      </div>
    </div>
  </div>

  <!-- WK5 -->
  <div class="week-block phase-2" id="week-5">
    <div class="week-head" onclick="toggleWeek('week-5')">
      <div class="week-num">WK 5</div>
      <div class="week-title-wrap">
        <div class="week-title">やる理由をはっきりさせる</div>
        <div class="week-sub">行動と結果のつながりを見る</div>
      </div>
      <div class="week-check-count" id="cnt-week-5">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、行動すると何が良くなるかを確認できた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box">✓</div>
          <div class="check-text">この行動で何が良くなるかを書いた</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box">✓</div>
          <div class="check-text">やった結果を1行で記録した</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box">✓</div>
          <div class="check-text">明日のやることをメモした</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        難しい説明より「やるとどう良いか」を短く伝える。
      </div>
    </div>
  </div>

  <!-- WK6 -->
  <div class="week-block phase-2" id="week-6">
    <div class="week-head" onclick="toggleWeek('week-6')">
      <div class="week-num">WK 6</div>
      <div class="week-title-wrap">
        <div class="week-title">守るルールを毎日確認する</div>
        <div class="week-sub">ブレないように始める前に確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-6">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、守るルールどおりに行動できた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box">✓</div>
          <div class="check-text">守るルールを始める前に確認した</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box">✓</div>
          <div class="check-text">ルールから外れそうな行動を止めた</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box">✓</div>
          <div class="check-text">ルールどおりに終えたことを報告した</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 迷ったらルールを見る</div>
        先にルールを確認すると、気分でブレにくくなる。
      </div>
    </div>
  </div>

  <!-- WK7 -->
  <div class="week-block phase-2" id="week-7">
    <div class="week-head" onclick="toggleWeek('week-7')">
      <div class="week-num">WK 7</div>
      <div class="week-title-wrap">
        <div class="week-title">続けやすい形にする</div>
        <div class="week-sub">無理なく毎日続ける</div>
      </div>
      <div class="week-check-count" id="cnt-week-7">0/2</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、無理なく続けられた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box">✓</div>
          <div class="check-text">忙しい日でも決めたチェックを実施した</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box">✓</div>
          <div class="check-text">続けにくくなる行動をやめた</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        完璧を目指しすぎない。続けることを優先する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-emoji">✨</div>
    <div>
      <div class="phase-banner-title">PHASE 2 完了！</div>
      <div class="phase-banner-sub">継続の型が固まりました。最後は卒業基準を日次で満たせるかを確認します。</div>
    </div>
  </div>

  <!-- ===== PHASE 3 ===== -->
  <div class="section-heading phase-3" id="phase-3">
    <span class="phase-tag">PHASE 3</span>
    定着させる（8〜11週）
  </div>

  <!-- WK8（8〜9週） -->
  <div class="week-block phase-3" id="week-8">
    <div class="week-head" onclick="toggleWeek('week-8')">
      <div class="week-num">WK 8–9</div>
      <div class="week-title-wrap">
        <div class="week-title">卒業判定</div>
        <div class="week-sub">自分で動く・理由が言える・同じようにできるを確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-8">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業の3つの基準を満たせた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box">✓</div>
          <div class="check-text">【自分で動く】言われる前にチェックして終えた</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box">✓</div>
          <div class="check-text">【理由が言える】なぜ続けるかを自分の言葉で言えた</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box">✓</div>
          <div class="check-text">【同じようにできる】別の作業でも同じ流れでできた</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 卒業は「続けられるか」</div>
        その日だけできるより、毎日同じようにできることが大事。
      </div>
    </div>
  </div>

  <!-- WK10（10〜11週） -->
  <div class="week-block phase-3" id="week-10">
    <div class="week-head" onclick="toggleWeek('week-10')">
      <div class="week-num">WK 10–11</div>
      <div class="week-title-wrap">
        <div class="week-title">自走安定運用</div>
        <div class="week-sub">卒業後を見据えて運用を安定させる</div>
      </div>
      <div class="week-check-count" id="cnt-week-10">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業後も続けられる形で実行できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box">✓</div>
          <div class="check-text">決めた時間・順番・記録先で実行した</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box">✓</div>
          <div class="check-text">崩れそうな時に決めた流れへ戻せた</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box">✓</div>
          <div class="check-text">明日の開始タイミングを決めた</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        卒業直前は「続けられるか」を見る。難しい日でもゼロにしないことを重視する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-emoji">🌱</div>
    <div>
      <div class="phase-banner-title">PHASE 3 完了！</div>
      <div class="phase-banner-sub">運用が安定しました。卒業判定へ進みましょう。</div>
    </div>
  </div>

  <!-- ===== PHASE 4 ===== -->
  <div class="section-heading phase-4" id="phase-4">
    <span class="phase-tag">PHASE 4</span>
    手離れ確認（12〜13週）
  </div>

  <!-- WK12（12〜13週） -->
  <div class="week-block phase-4" id="week-12">
    <div class="week-head" onclick="toggleWeek('week-12')">
      <div class="week-num">WK 12–13</div>
      <div class="week-title-wrap">
        <div class="week-title">卒業判定</div>
        <div class="week-sub">最終確認（自分で動く・理由が言える・再現できる）</div>
      </div>
      <div class="week-check-count" id="cnt-week-12">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、最終3基準を満たして卒業判定を通過できた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box">✓</div>
          <div class="check-text">【自分で動く】声かけなしで必要なチェックを完了した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box">✓</div>
          <div class="check-text">【理由が言える】続ける理由を自分の言葉で説明した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box">✓</div>
          <div class="check-text">【再現できる】新しい場面でも同じ流れで実行した</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        3つ全部YESなら卒業。未達がある場合は、どこで崩れたかを確認して翌日にやり直す。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-4">
    <div class="phase-banner-emoji">🎓</div>
    <div>
      <div class="phase-banner-title">PHASE 4 完了！</div>
      <div class="phase-banner-sub">卒業判定の準備ができました。メンターと最終確認をしましょう。</div>
    </div>
  </div>

  <!-- GRADUATION -->
  <div class="grad-section" id="grad-section">
    <div class="grad-emoji">🎓</div>
    <div class="grad-title">90日間、お疲れさまでした！</div>
    <div class="grad-sub">
      改善を気分でやる状態から、仕組みで回す状態へ移行できました。<br>
      これからは、日々の実行を自分で維持しながら成果に結びつけられます。
    </div>
  </div>
`
  },
  m2: {
    label: 'M2',
    title: 'M2型 90日トレーニング｜コミュ力診断',
    tone: { bg: '#fff4ee', border: '#f3d8ca', text: '#7a2f13' },
    mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">M2 — メンタルグループ</div>
    <div class="type-hero-title">🦔 「防衛本能がつよい」型</div>
    <div class="type-hero-sub">
      指摘を自己否定として受け取りやすく、防衛反応が先に立つ状態です。<br>
      内容が正しくても伝え方が強いと、改善より反発が起きやすくなります。<br>
      このトレーニングでは、<strong>安全を確保しながら改善を受け取る回路</strong>を90日で育てます。
    </div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title">📐 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon">🗣️</div>
        <div class="node-label">フィードバック</div>
        <div class="node-sub">改善の提案</div>
      </div>
      <div class="insight-arrow broken">
        <div style="display:flex;align-items:center;gap:0">
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div style="width:10px;height:3px;border-top:3px dashed #E24B4A;"></div>
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div class="insight-arrow-head"></div>
        </div>
        <div class="insight-gap-label">⚡ 防衛 反応</div>
      </div>
      <div class="insight-node">
        <div class="node-icon">🛡️</div>
        <div class="node-label">受け取れない</div>
        <div class="node-sub">自己防衛が先行</div>
      </div>
    </div>
    <div class="insight-desc">
      問題は能力不足ではなく、受け取り方の安全が確保されていないこと。<br>
      事実と解釈を分け、選択肢を渡すと改善が入りやすくなります。
    </div>
  </div>

  <!-- PROGRESS OVERVIEW -->
  <div class="progress-overview">
    <div class="phase-chip active" id="chip-1" onclick="scrollToPhase(1)">
      <div class="phase-chip-label">PHASE 1</div>
      <div class="phase-chip-week">1〜3週</div>
      <div class="phase-chip-name">知る・体験</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-2" onclick="scrollToPhase(2)">
      <div class="phase-chip-label">PHASE 2</div>
      <div class="phase-chip-week">4〜7週</div>
      <div class="phase-chip-name">一人で試す</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-3" onclick="scrollToPhase(3)">
      <div class="phase-chip-label">PHASE 3</div>
      <div class="phase-chip-week">8〜11週</div>
      <div class="phase-chip-name">定着させる</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-4" onclick="scrollToPhase(4)">
      <div class="phase-chip-label">PHASE 4</div>
      <div class="phase-chip-week">12〜13週</div>
      <div class="phase-chip-name">手離れ確認</div>
      <div class="phase-done-mark">✅</div>
    </div>
  </div>

  <!-- HEATMAP -->
  <div class="heatmap-box">
    <div class="heatmap-header">
      <div class="heatmap-title">📅 90日のチェック記録</div>
      <div class="heatmap-streak" id="heatmap-streak" style="display:none"></div>
    </div>
    <div class="heatmap-scroll">
      <div class="heatmap-grid" id="heatmap-grid"></div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-total" id="heatmap-total"></div>
      <div class="heatmap-legend">
        <span>少ない</span>
        <div class="heatmap-legend-cell" style="background:#EBEBEB"></div>
        <div class="heatmap-legend-cell" style="background:#9BE9C4"></div>
        <div class="heatmap-legend-cell" style="background:#40C28A"></div>
        <div class="heatmap-legend-cell" style="background:#1D9E75"></div>
        <div class="heatmap-legend-cell" style="background:#0e7a58"></div>
        <span>多い</span>
      </div>
    </div>
  </div>

  <!-- SHARE BUTTON -->
  <div class="share-wrap">
    <button class="share-btn" id="share-btn" onclick="shareProgress()">
      📤 メンターに共有
    </button>
  </div>

  <!-- ===== PHASE 1 ===== -->
  <div class="section-heading phase-1" id="phase-1">
    <span class="phase-tag">PHASE 1</span>
    知る・体験する（1〜3週）
  </div>

  <!-- WK1 -->
  <div class="week-block phase-1" id="week-1">
    <div class="week-head" onclick="toggleWeek('week-1')">
      <div class="week-num">WK 1</div>
      <div class="week-title-wrap">
        <div class="week-title">安全な受け取り姿勢を作る</div>
        <div class="week-sub">反応する前に受け止める土台を整える</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指摘を攻撃ではなく情報として受け止められた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box">✓</div>
          <div class="check-text">フィードバック前に「能力否定ではない」と自分に言語化した</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box">✓</div>
          <div class="check-text">指摘を聞いた直後に反論せず3秒待った</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box">✓</div>
          <div class="check-text">聞いた内容を「要点1行」で復唱した</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        M2は「まず守る」が先に出る。冒頭で安全を確保し、短い復唱を入れるだけで受け取り率が上がる。
      </div>
    </div>
  </div>

  <!-- WK2 -->
  <div class="week-block phase-1" id="week-2">
    <div class="week-head" onclick="toggleWeek('week-2')">
      <div class="week-num">WK 2</div>
      <div class="week-title-wrap">
        <div class="week-title">事実と解釈を分ける</div>
        <div class="week-sub">人格評価に聞こえない受け取り方を練習する</div>
      </div>
      <div class="week-check-count" id="cnt-week-2">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指摘内容を事実ベースで整理できた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box">✓</div>
          <div class="check-text">受けた指摘を「事実」と「解釈」に分けて書いた</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box">✓</div>
          <div class="check-text">事実部分だけを使って改善点を1つ決めた</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box">✓</div>
          <div class="check-text">決めた改善を実行して結果を1行で記録した</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 なぜ「事実分離」が効くのか</div>
        感情が高いと内容が入らない。事実だけを先に扱うと、防衛反応を下げながら改善行動に移しやすくなる。
      </div>
    </div>
  </div>

  <!-- WK3 -->
  <div class="week-block phase-1" id="week-3">
    <div class="week-head" onclick="toggleWeek('week-3')">
      <div class="week-num">WK 3</div>
      <div class="week-title-wrap">
        <div class="week-title">言い訳の前に要約する</div>
        <div class="week-sub">反応より理解確認を先に行う</div>
      </div>
      <div class="week-check-count" id="cnt-week-3">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指摘内容を先に要約してから話せた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box">✓</div>
          <div class="check-text">言い訳や説明の前に相手の指摘を1文で要約した</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box">✓</div>
          <div class="check-text">要約が正しいか相手に確認してから発言した</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box">✓</div>
          <div class="check-text">改善の次アクションを1つ合意した</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        「まず要約」は防衛反応を下げる最短手段。理解確認を先にすると、対話が衝突ではなく調整になる。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-emoji">🎉</div>
    <div>
      <div class="phase-banner-title">PHASE 1 完了！</div>
      <div class="phase-banner-sub">受け取りの土台ができました。次は自走で安定させます。</div>
    </div>
  </div>

  <!-- ===== PHASE 2 ===== -->
  <div class="section-heading phase-2" id="phase-2">
    <span class="phase-tag">PHASE 2</span>
    一人で試す（4〜7週）
  </div>

  <!-- WK4 -->
  <div class="week-block phase-2" id="week-4">
    <div class="week-head" onclick="toggleWeek('week-4')">
      <div class="week-num">WK 4</div>
      <div class="week-title-wrap">
        <div class="week-title">選択肢で改善を決める</div>
        <div class="week-sub">自己決定感を保ちながら実行する</div>
      </div>
      <div class="week-check-count" id="cnt-week-4">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、A/Bの選択肢から自分で改善を選べた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box">✓</div>
          <div class="check-text">改善案を2択にしてどちらで直すか自分で選んだ</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box">✓</div>
          <div class="check-text">選んだ案で実際に1点修正した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box">✓</div>
          <div class="check-text">選んだ理由を1行で共有した</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 声に出す理由</div>
        声に出すと視覚野と音声野が同時に動き、黙って読むより盲点に気づきやすくなる。慣れてくれば心の中で言うだけでもOK。まず1週間、必ず声に出してみる。
      </div>
    </div>
  </div>

  <!-- WK5 -->
  <div class="week-block phase-2" id="week-5">
    <div class="week-head" onclick="toggleWeek('week-5')">
      <div class="week-num">WK 5</div>
      <div class="week-title-wrap">
        <div class="week-title">低刺激で対話を続ける</div>
        <div class="week-sub">感情を上げずに改善サイクルを維持する</div>
      </div>
      <div class="week-check-count" id="cnt-week-5">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、感情を荒らさずに改善会話を完了できた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box">✓</div>
          <div class="check-text">強い言い回しを避けて短い言葉で確認した</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box">✓</div>
          <div class="check-text">会話後に気持ちを落ち着かせる行動を1つ実施した</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box">✓</div>
          <div class="check-text">改善内容を翌日に持ち越さずその場で確定した</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        M2は会話の刺激量が高いと崩れやすい。短く・事実ベース・選択肢提示を固定し、毎日同じ型で回す。
      </div>
    </div>
  </div>

  <!-- WK6 -->
  <div class="week-block phase-2" id="week-6">
    <div class="week-head" onclick="toggleWeek('week-6')">
      <div class="week-num">WK 6</div>
      <div class="week-title-wrap">
        <div class="week-title">自走で受け取りを維持する</div>
        <div class="week-sub">メンターなしでも防衛反応を抑える</div>
      </div>
      <div class="week-check-count" id="cnt-week-6">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、受け取り→要約→修正の流れを自走で完了できた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box">✓</div>
          <div class="check-text">指摘を受けた直後に3秒待って要約した</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box">✓</div>
          <div class="check-text">要約後に改善アクションを1つ実行した</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box">✓</div>
          <div class="check-text">実行結果を記録して次回の型を維持した</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 先に落ち着く、次に直す</div>
        防衛反応は悪ではなく反射。反射を否定せず、順番だけ整えると改善は進められる。
      </div>
    </div>
  </div>

  <!-- WK7 -->
  <div class="week-block phase-2" id="week-7">
    <div class="week-head" onclick="toggleWeek('week-7')">
      <div class="week-num">WK 7</div>
      <div class="week-title-wrap">
        <div class="week-title">再現可能な会話型を固定する</div>
        <div class="week-sub">どの場面でも同じ順で対応する</div>
      </div>
      <div class="week-check-count" id="cnt-week-7">0/2</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、同じ受け取り手順を再現できた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box">✓</div>
          <div class="check-text check-text-tight">フィードバック時に「安全確認→要約→選択→実行」を順番どおり実施した</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box">✓</div>
          <div class="check-text">順番が崩れた場面を1つ記録し修正した</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        手順が固定されると、感情が揺れても行動は崩れにくい。順番を守ること自体を成果として評価する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-emoji">✨</div>
    <div>
      <div class="phase-banner-title">PHASE 2 完了！</div>
      <div class="phase-banner-sub">受け取りの型が固まりました。最後は卒業判定です。</div>
    </div>
  </div>

  <!-- ===== PHASE 3 ===== -->
  <div class="section-heading phase-3" id="phase-3">
    <span class="phase-tag">PHASE 3</span>
    定着させる（8〜11週）
  </div>

  <!-- WK8（8〜9週） -->
  <div class="week-block phase-3" id="week-8">
    <div class="week-head" onclick="toggleWeek('week-8')">
      <div class="week-num">WK 8–9</div>
      <div class="week-title-wrap">
        <div class="week-title">卒業判定</div>
        <div class="week-sub">安全・受容・再現をその日の行動で確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-8">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業3基準（安全・受容・再現）を満たせた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box">✓</div>
          <div class="check-text">【自走】促されずに日次チェックを開始して完了した</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box">✓</div>
          <div class="check-text">【動機】改善の損得を自分の言葉で1文説明した</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box">✓</div>
          <div class="check-text">【再現】別タスクでも同じ実行手順を再現した</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 卒業は「気分」ではなく「再現」</div>
        その日たまたまで終わらせず、同じ基準で繰り返せるかを重視する。再現できるなら卒業条件は満たせる。
      </div>
    </div>
  </div>

  <!-- WK10（10〜11週） -->
  <div class="week-block phase-3" id="week-10">
    <div class="week-head" onclick="toggleWeek('week-10')">
      <div class="week-num">WK 10–11</div>
      <div class="week-title-wrap">
        <div class="week-title">自走安定運用</div>
        <div class="week-sub">卒業後を見据えて運用を安定させる</div>
      </div>
      <div class="week-check-count" id="cnt-week-10">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業後も崩れない運用で実行できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box">✓</div>
          <div class="check-text">開始時刻・チェック順・記録先を固定運用できた</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box">✓</div>
          <div class="check-text">逸脱しそうな場面でも基準どおりに戻せた</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box">✓</div>
          <div class="check-text">翌日の実行計画を1行で確定した</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        卒業直前は「崩れない運用」の確認が最優先。高難度の日でも最低限の実行を維持できるかを見る。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-emoji">🌱</div>
    <div>
      <div class="phase-banner-title">PHASE 3 完了！</div>
      <div class="phase-banner-sub">運用が安定しました。卒業判定へ進みましょう。</div>
    </div>
  </div>

  <!-- ===== PHASE 4 ===== -->
  <div class="section-heading phase-4" id="phase-4">
    <span class="phase-tag">PHASE 4</span>
    手離れ確認（12〜13週）
  </div>

  <!-- WK12（12〜13週） -->
  <div class="week-block phase-4" id="week-12">
    <div class="week-head" onclick="toggleWeek('week-12')">
      <div class="week-num">WK 12–13</div>
      <div class="week-title-wrap">
        <div class="week-title">卒業判定</div>
        <div class="week-sub">最終確認（自走・動機・再現）</div>
      </div>
      <div class="week-check-count" id="cnt-week-12">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、最終3基準を満たして卒業判定を通過できた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box">✓</div>
          <div class="check-text">【安全】指摘の場で反応前に落ち着く手順を実行した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box">✓</div>
          <div class="check-text">【受容】指摘を要約し改善アクションへ変換した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box">✓</div>
          <div class="check-text">【再現】新しい場面でも同じ会話手順を再現した</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        3つ全部YESなら卒業。未達がある場合は、崩れた手順（安全確認/要約/選択/実行）を特定して翌日に戻す。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-4">
    <div class="phase-banner-emoji">🎓</div>
    <div>
      <div class="phase-banner-title">PHASE 4 完了！</div>
      <div class="phase-banner-sub">卒業判定の準備ができました。メンターと最終確認をしましょう。</div>
    </div>
  </div>

  <!-- GRADUATION -->
  <div class="grad-section" id="grad-section">
    <div class="grad-emoji">🎓</div>
    <div class="grad-title">90日間、お疲れさまでした！</div>
    <div class="grad-sub">
      防衛反応で止まる状態から、落ち着いて改善を選べる状態へ進めました。<br>
      これからは、指摘を材料にして自分で次の行動を選択できます。
    </div>
  </div>
`
  },
  r1: {
    label: 'R1',
    title: 'R1型 90日トレーニング｜コミュ力診断',
    tone: { bg: '#e8f1ff', border: '#ccddfb', text: '#3A3832' },
    mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">R1 — 聴き方グループ</div>
    <div class="type-hero-title">👂 「聞けていない」型</div>
    <div class="type-hero-sub">
      指示を聞いたつもりでも、時間がたつと内容が抜けやすいタイプです。<br>
      確認せずに着手すると、同じ指摘が繰り返されやすくなります。<br>
      このトレーニングでは、<strong>復唱と短文化で受信を安定させる型</strong>を90日で身につけます。
    </div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title">📐 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon">🧠</div>
        <div class="node-label">指示を受ける</div>
        <div class="node-sub">その場は理解</div>
      </div>
      <div class="insight-arrow broken">
        <div style="display:flex;align-items:center;gap:0">
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div style="width:10px;height:3px;border-top:3px dashed #E24B4A;"></div>
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div class="insight-arrow-head"></div>
        </div>
        <div class="insight-gap-label">⚡ 確認 不足</div>
      </div>
      <div class="insight-node">
        <div class="node-icon">👀</div>
        <div class="node-label">実行がずれる</div>
        <div class="node-sub">同じ指摘が続く</div>
      </div>
    </div>
    <div class="insight-desc">
      問題は意欲不足ではなく、受け取りを固定する手順がないこと。<br>
      復唱と3点メモを入れるだけで、理解のズレは大きく減らせます。
    </div>
  </div>

  <!-- PROGRESS OVERVIEW -->
  <div class="progress-overview">
    <div class="phase-chip active" id="chip-1" onclick="scrollToPhase(1)">
      <div class="phase-chip-label">PHASE 1</div>
      <div class="phase-chip-week">1〜3週</div>
      <div class="phase-chip-name">知る・体験</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-2" onclick="scrollToPhase(2)">
      <div class="phase-chip-label">PHASE 2</div>
      <div class="phase-chip-week">4〜7週</div>
      <div class="phase-chip-name">一人で試す</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-3" onclick="scrollToPhase(3)">
      <div class="phase-chip-label">PHASE 3</div>
      <div class="phase-chip-week">8〜11週</div>
      <div class="phase-chip-name">定着させる</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-4" onclick="scrollToPhase(4)">
      <div class="phase-chip-label">PHASE 4</div>
      <div class="phase-chip-week">12〜13週</div>
      <div class="phase-chip-name">手離れ確認</div>
      <div class="phase-done-mark">✅</div>
    </div>
  </div>

  <!-- HEATMAP -->
  <div class="heatmap-box">
    <div class="heatmap-header">
      <div class="heatmap-title">📅 90日のチェック記録</div>
      <div class="heatmap-streak" id="heatmap-streak" style="display:none"></div>
    </div>
    <div class="heatmap-scroll">
      <div class="heatmap-grid" id="heatmap-grid"></div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-total" id="heatmap-total"></div>
      <div class="heatmap-legend">
        <span>少ない</span>
        <div class="heatmap-legend-cell" style="background:#EBEBEB"></div>
        <div class="heatmap-legend-cell" style="background:#9BE9C4"></div>
        <div class="heatmap-legend-cell" style="background:#40C28A"></div>
        <div class="heatmap-legend-cell" style="background:#1D9E75"></div>
        <div class="heatmap-legend-cell" style="background:#0e7a58"></div>
        <span>多い</span>
      </div>
    </div>
  </div>

  <!-- SHARE BUTTON -->
  <div class="share-wrap">
    <button class="share-btn" id="share-btn" onclick="shareProgress()">
      📤 メンターに共有
    </button>
  </div>

  <!-- ===== PHASE 1 ===== -->
  <div class="section-heading phase-1" id="phase-1">
    <span class="phase-tag">PHASE 1</span>
    知る・体験する（1〜3週）
  </div>

  <!-- WK1 -->
  <div class="week-block phase-1" id="week-1">
    <div class="week-head" onclick="toggleWeek('week-1')">
      <div class="week-num">WK 1</div>
      <div class="week-title-wrap">
        <div class="week-title">指示を受け切る</div>
        <div class="week-sub">聞いた内容をその場で固定する</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指示を復唱してから着手できた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box">✓</div>
          <div class="check-text">受けた指示を自分の言葉で1回復唱した</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box">✓</div>
          <div class="check-text">指示を「何を・いつまでに・どこまで」の3点でメモした</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box">✓</div>
          <div class="check-text">不明点を1つ以上その場で確認した</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        R1型は「受け取りの確認」が抜けやすい。必ずその場で復唱させ、指示を3点メモに短文化する。評価は速さより、再説明なしで実行できたかを軸にする。
      </div>
    </div>
  </div>

  <!-- WK2 -->
  <div class="week-block phase-1" id="week-2">
    <div class="week-head" onclick="toggleWeek('week-2')">
      <div class="week-num">WK 2</div>
      <div class="week-title-wrap">
        <div class="week-title">復唱の型を決める</div>
        <div class="week-sub">毎回同じ順で確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-2">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、復唱テンプレで受け取りミスを減らせた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box">✓</div>
          <div class="check-text">復唱を「目的→作業→期限」の順で言えた</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box">✓</div>
          <div class="check-text">復唱後に相手からOKをもらってから着手した</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box">✓</div>
          <div class="check-text">聞き漏れが出た場面を1件メモした</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 復唱が効く理由</div>
        R1は「聞いたつもり」で進みやすい。受信内容を復唱して短く残すだけで、実行ズレは減らせる。完璧な理解より、確認を1回挟むことを優先する。
      </div>
    </div>
  </div>

  <!-- WK3 -->
  <div class="week-block phase-1" id="week-3">
    <div class="week-head" onclick="toggleWeek('week-3')">
      <div class="week-num">WK 3</div>
      <div class="week-title-wrap">
        <div class="week-title">翌日も残る受信にする</div>
        <div class="week-sub">記録して再確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-3">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、前日の指示を見返してから作業開始できた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box">✓</div>
          <div class="check-text">作業前に前日メモを30秒見返した</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box">✓</div>
          <div class="check-text">見返しで気づいた修正点を1つ反映した</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box">✓</div>
          <div class="check-text">終了時に明日の確認ポイントを1行残した</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        評価軸は速さより再現性。復唱とメモと質問が回っていれば改善として認め、継続意欲を保つ。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-emoji">🎉</div>
    <div>
      <div class="phase-banner-title">PHASE 1 完了！</div>
      <div class="phase-banner-sub">受信の基本手順ができました。次は自分だけで回せる状態へ進みます。</div>
    </div>
  </div>

  <!-- ===== PHASE 2 ===== -->
  <div class="section-heading phase-2" id="phase-2">
    <span class="phase-tag">PHASE 2</span>
    一人で試す（4〜7週）
  </div>

  <!-- WK4 -->
  <div class="week-block phase-2" id="week-4">
    <div class="week-head" onclick="toggleWeek('week-4')">
      <div class="week-num">WK 4</div>
      <div class="week-title-wrap">
        <div class="week-title">口頭を文字に残す</div>
        <div class="week-sub">聞いたらすぐに記録する</div>
      </div>
      <div class="week-check-count" id="cnt-week-4">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、口頭指示を文字で残して作業できた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box">✓</div>
          <div class="check-text">口頭指示を受けた直後に3行で要約した</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box">✓</div>
          <div class="check-text">要約を相手に送り認識ズレを確認した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box">✓</div>
          <div class="check-text">要約をタスクと紐づけて保存した</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 声に出す理由</div>
        声に出すと視覚野と音声野が同時に動き、黙って読むより盲点に気づきやすくなる。慣れてくれば心の中で言うだけでもOK。まず1週間、必ず声に出してみる。
      </div>
    </div>
  </div>

  <!-- WK5 -->
  <div class="week-block phase-2" id="week-5">
    <div class="week-head" onclick="toggleWeek('week-5')">
      <div class="week-num">WK 5</div>
      <div class="week-title-wrap">
        <div class="week-title">質問でズレを止める</div>
        <div class="week-sub">分からないまま進めない</div>
      </div>
      <div class="week-check-count" id="cnt-week-5">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、着手前質問で認識ズレを防げた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box">✓</div>
          <div class="check-text">着手前に確認質問を1つした</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box">✓</div>
          <div class="check-text">質問の回答をメモに追記した</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box">✓</div>
          <div class="check-text">追記後に実行内容を1行で再確認した</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        ここは「本人が自分で前提漏れを拾えるか」の確認週。見つけ方を言語化させ、再現可能な手順に固定する。
      </div>
    </div>
  </div>

  <!-- WK6 -->
  <div class="week-block phase-2" id="week-6">
    <div class="week-head" onclick="toggleWeek('week-6')">
      <div class="week-num">WK 6</div>
      <div class="week-title-wrap">
        <div class="week-title">翌日の抜けを防ぐ</div>
        <div class="week-sub">見返しの習慣を固定する</div>
      </div>
      <div class="week-check-count" id="cnt-week-6">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、翌日の見返しで指示抜けを減らせた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box">✓</div>
          <div class="check-text">作業終了前に明日の最初の行動を1行書いた</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box">✓</div>
          <div class="check-text">翌日に参照するメモの場所を固定した</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box">✓</div>
          <div class="check-text">見返し結果をメンターへ1行共有した</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 記録は短くてよい</div>
        短いメモでも効果は大きい。完璧な記録より、翌日に見返せる形で1行残す習慣を優先する。
      </div>
    </div>
  </div>

  <!-- WK7 -->
  <div class="week-block phase-2" id="week-7">
    <div class="week-head" onclick="toggleWeek('week-7')">
      <div class="week-num">WK 7</div>
      <div class="week-title-wrap">
        <div class="week-title">自分の受信手順を固定する</div>
        <div class="week-sub">毎回同じ流れで回す</div>
      </div>
      <div class="week-check-count" id="cnt-week-7">0/2</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、受信手順を同じ順序で再現できた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box">✓</div>
          <div class="check-text">「復唱→3点メモ→質問」を順に実行した</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box">✓</div>
          <div class="check-text">自分の受信手順を1分で説明した</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        補足手順を固定できると再現性が上がる。「誰を想定→何を補足→どこに書く」の順で本人の型を確定させる。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-emoji">✨</div>
    <div>
      <div class="phase-banner-title">PHASE 2 完了！</div>
      <div class="phase-banner-sub">自走の型ができました。次は習慣として無意識化します。</div>
    </div>
  </div>

  <!-- ===== PHASE 3 ===== -->
  <div class="section-heading phase-3" id="phase-3">
    <span class="phase-tag">PHASE 3</span>
    定着させる（8〜11週）
  </div>

  <!-- WK8（8〜9週） -->
  <div class="week-block phase-3" id="week-8">
    <div class="week-head" onclick="toggleWeek('week-8')">
      <div class="week-num">WK 8–9</div>
      <div class="week-title-wrap">
        <div class="week-title">受信ミスの予兆を記録する</div>
        <div class="week-sub">崩れる前に気づく</div>
      </div>
      <div class="week-check-count" id="cnt-week-8">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、受信ミスの予兆を1件記録できた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box">✓</div>
          <div class="check-text">聞き返しが必要になった場面を1つ記録した</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box">✓</div>
          <div class="check-text">その原因を「早口/量/曖昧語」から1つ選んだ</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box">✓</div>
          <div class="check-text">次回の対策を1行で書いた</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 変化は小さくていい</div>
        最初は少なくて問題ない。「できた瞬間」を拾うほど再現しやすくなる。できなかった日も「なぜ抜けたか」を一言残すと次が改善しやすい。
      </div>
    </div>
  </div>

  <!-- WK10（10〜11週） -->
  <div class="week-block phase-3" id="week-10">
    <div class="week-head" onclick="toggleWeek('week-10')">
      <div class="week-num">WK 10–11</div>
      <div class="week-title-wrap">
        <div class="week-title">メンターなしで受信を回す</div>
        <div class="week-sub">記録と確認を自走する</div>
      </div>
      <div class="week-check-count" id="cnt-week-10">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、受信サイクルを自分だけで完了できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box">✓</div>
          <div class="check-text">受信内容を自分で整理して着手前に確認した</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box">✓</div>
          <div class="check-text">ズレが出た箇所を分類して記録した</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box">✓</div>
          <div class="check-text">明日の改善アクションを1行で決めた</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        この期間は「助言より記録」。詰まり分類と改善アクションが自分で回っていれば合格。細かい添削は減らして自走性を優先する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-emoji">🌱</div>
    <div>
      <div class="phase-banner-title">PHASE 3 完了！</div>
      <div class="phase-banner-sub">相手視点の補足が定着しました。最後に卒業基準を日次で確認します。</div>
    </div>
  </div>

  <!-- ===== PHASE 4 ===== -->
  <div class="section-heading phase-4" id="phase-4">
    <span class="phase-tag">PHASE 4</span>
    手離れ確認（12〜13週）
  </div>

  <!-- WK12（12〜13週） -->
  <div class="week-block phase-4" id="week-12">
    <div class="week-head" onclick="toggleWeek('week-12')">
      <div class="week-num">WK 12–13</div>
      <div class="week-title-wrap">
        <div class="week-title">卒業判定</div>
        <div class="week-sub">自走・説明・再現をその日の行動で確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-12">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業3基準を実タスクで満たせた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box">✓</div>
          <div class="check-text">【自走】今日の指示を再説明なしで実行完了した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box">✓</div>
          <div class="check-text">【説明】受信手順を自分の言葉で説明した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box">✓</div>
          <div class="check-text">【再現】今日の新しい指示でも同じ受信手順を使えた</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        3つ全部YESなら卒業。未達がある場合は「復唱/記録/質問」のどこが抜けたかを特定して翌日に戻す。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-4">
    <div class="phase-banner-emoji">🎓</div>
    <div>
      <div class="phase-banner-title">PHASE 4 完了！</div>
      <div class="phase-banner-sub">卒業判定の準備ができました。メンターと最終確認をしましょう。</div>
    </div>
  </div>

  <!-- GRADUATION -->
  <div class="grad-section" id="grad-section">
    <div class="grad-emoji">🎓</div>
    <div class="grad-title">90日間、お疲れさまでした！</div>
    <div class="grad-sub">
      指示を聞いて終わりではなく、受け取って残す習慣を作れました。<br>
      これからは、再説明に頼らず安定して動けます。
    </div>
  </div>
`
  },
  r2: {
    label: 'R2',
    title: 'R2型 90日トレーニング｜コミュ力診断',
    tone: { bg: '#e8f1ff', border: '#ccddfb', text: '#7A2006' },
    mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">R2 — 聴き方グループ</div>
    <div class="type-hero-title">🌊 「止まれない」型</div>
    <div class="type-hero-sub">
      相手の話を聞ける力はあるのに、話し始める衝動を止めにくいタイプです。<br>
      間を埋めようとして先に話すと、聞くべき情報を取りこぼしやすくなります。<br>
      このトレーニングでは、<strong>待つ・要約する・話すの順を守る型</strong>を90日で身につけます。
    </div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title">📐 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon">🧠</div>
        <div class="node-label">相手が話す</div>
        <div class="node-sub">情報は来ている</div>
      </div>
      <div class="insight-arrow broken">
        <div style="display:flex;align-items:center;gap:0">
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div style="width:10px;height:3px;border-top:3px dashed #E24B4A;"></div>
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div class="insight-arrow-head"></div>
        </div>
        <div class="insight-gap-label">⚡ 待機 不足</div>
      </div>
      <div class="insight-node">
        <div class="node-icon">👀</div>
        <div class="node-label">会話が占有される</div>
        <div class="node-sub">相手の情報が減る</div>
      </div>
    </div>
    <div class="insight-desc">
      問題は悪意ではなく、発話を止める具体ルールがないこと。<br>
      「3秒待つ→要約する→話す」を徹底すると、会話の質は安定します。
    </div>
  </div>

  <!-- PROGRESS OVERVIEW -->
  <div class="progress-overview">
    <div class="phase-chip active" id="chip-1" onclick="scrollToPhase(1)">
      <div class="phase-chip-label">PHASE 1</div>
      <div class="phase-chip-week">1〜3週</div>
      <div class="phase-chip-name">知る・体験</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-2" onclick="scrollToPhase(2)">
      <div class="phase-chip-label">PHASE 2</div>
      <div class="phase-chip-week">4〜7週</div>
      <div class="phase-chip-name">一人で試す</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-3" onclick="scrollToPhase(3)">
      <div class="phase-chip-label">PHASE 3</div>
      <div class="phase-chip-week">8〜11週</div>
      <div class="phase-chip-name">定着させる</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-4" onclick="scrollToPhase(4)">
      <div class="phase-chip-label">PHASE 4</div>
      <div class="phase-chip-week">12〜13週</div>
      <div class="phase-chip-name">手離れ確認</div>
      <div class="phase-done-mark">✅</div>
    </div>
  </div>

  <!-- HEATMAP -->
  <div class="heatmap-box">
    <div class="heatmap-header">
      <div class="heatmap-title">📅 90日のチェック記録</div>
      <div class="heatmap-streak" id="heatmap-streak" style="display:none"></div>
    </div>
    <div class="heatmap-scroll">
      <div class="heatmap-grid" id="heatmap-grid"></div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-total" id="heatmap-total"></div>
      <div class="heatmap-legend">
        <span>少ない</span>
        <div class="heatmap-legend-cell" style="background:#EBEBEB"></div>
        <div class="heatmap-legend-cell" style="background:#9BE9C4"></div>
        <div class="heatmap-legend-cell" style="background:#40C28A"></div>
        <div class="heatmap-legend-cell" style="background:#1D9E75"></div>
        <div class="heatmap-legend-cell" style="background:#0e7a58"></div>
        <span>多い</span>
      </div>
    </div>
  </div>

  <!-- SHARE BUTTON -->
  <div class="share-wrap">
    <button class="share-btn" id="share-btn" onclick="shareProgress()">
      📤 メンターに共有
    </button>
  </div>

  <!-- ===== PHASE 1 ===== -->
  <div class="section-heading phase-1" id="phase-1">
    <span class="phase-tag">PHASE 1</span>
    知る・体験する（1〜3週）
  </div>

  <!-- WK1 -->
  <div class="week-block phase-1" id="week-1">
    <div class="week-head" onclick="toggleWeek('week-1')">
      <div class="week-num">WK 1</div>
      <div class="week-title-wrap">
        <div class="week-title">3秒待ってから話す</div>
        <div class="week-sub">相手の最後まで聞き切る</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、相手に必要な前提を先に置いてから本文を書けた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box">✓</div>
          <div class="check-text">書く前に「相手が知らない前提」を1つ書き出した</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box">✓</div>
          <div class="check-text">本文の冒頭に前提条件を1行追加してから書き始めた</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box">✓</div>
          <div class="check-text">「この人は何を知らないか」をメンターに口頭共有した</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        R2型は「待って聞く」が抜けやすい。必ず「3秒待つ→要約する→話す」を毎回確認する。評価は話量より、相手の発話を最後まで受け取れたかを軸にする。
      </div>
    </div>
  </div>

  <!-- WK2 -->
  <div class="week-block phase-1" id="week-2">
    <div class="week-head" onclick="toggleWeek('week-2')">
      <div class="week-num">WK 2</div>
      <div class="week-title-wrap">
        <div class="week-title">要約してから話す</div>
        <div class="week-sub">先に受け取りを確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-2">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、要約してから話し始めることができた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box">✓</div>
          <div class="check-text">相手の発話を1文で要約してから話した</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box">✓</div>
          <div class="check-text">話す前に「今話してよいか」を確認した</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box">✓</div>
          <div class="check-text">会話後に割り込みの有無を1件メモした</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 なぜ「言い換え」が効くのか</div>
        R2は「話したい衝動」が先に出やすい。要約してから発言するだけで、聞き漏れと衝突は減る。
      </div>
    </div>
  </div>

  <!-- WK3 -->
  <div class="week-block phase-1" id="week-3">
    <div class="week-head" onclick="toggleWeek('week-3')">
      <div class="week-num">WK 3</div>
      <div class="week-title-wrap">
        <div class="week-title">沈黙に慣れる</div>
        <div class="week-sub">間を埋めない</div>
      </div>
      <div class="week-check-count" id="cnt-week-3">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、沈黙を保って相手の最後まで聞けた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box">✓</div>
          <div class="check-text">相手が話し終えるまで3秒待てた</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box">✓</div>
          <div class="check-text">途中で話し始めそうになった場面を1件記録した</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box">✓</div>
          <div class="check-text">待てた場面を1つ振り返った</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        話量より、最後まで聞けた回数を評価する。できた場面を具体的に褒める。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-emoji">🎉</div>
    <div>
      <div class="phase-banner-title">PHASE 1 完了！</div>
      <div class="phase-banner-sub">待って聞く型ができました。次はメンターなしでも再現してみましょう。</div>
    </div>
  </div>

  <!-- ===== PHASE 2 ===== -->
  <div class="section-heading phase-2" id="phase-2">
    <span class="phase-tag">PHASE 2</span>
    一人で試す（4〜7週）
  </div>

  <!-- WK4 -->
  <div class="week-block phase-2" id="week-4">
    <div class="week-head" onclick="toggleWeek('week-4')">
      <div class="week-num">WK 4</div>
      <div class="week-title-wrap">
        <div class="week-title">会話の占有率を測る</div>
        <div class="week-sub">話し過ぎを可視化する</div>
      </div>
      <div class="week-check-count" id="cnt-week-4">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、会話の占有率を測って調整できた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box">✓</div>
          <div class="check-text">1対話で自分の発話時間をざっくり記録した</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box">✓</div>
          <div class="check-text">相手の発話を遮った回数を記録した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box">✓</div>
          <div class="check-text">次の対話で減らす行動を1つ決めた</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 声に出す理由</div>
        声に出すと視覚野と音声野が同時に動き、黙って読むより盲点に気づきやすくなる。慣れてくれば心の中で言うだけでもOK。まず1週間、必ず声に出してみる。
      </div>
    </div>
  </div>

  <!-- WK5 -->
  <div class="week-block phase-2" id="week-5">
    <div class="week-head" onclick="toggleWeek('week-5')">
      <div class="week-num">WK 5</div>
      <div class="week-title-wrap">
        <div class="week-title">割り込みを止める</div>
        <div class="week-sub">最後の一言まで待つ</div>
      </div>
      <div class="week-check-count" id="cnt-week-5">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、割り込みを減らして最後まで聞けた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box">✓</div>
          <div class="check-text">相手の最後の一言まで待ってから話した</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box">✓</div>
          <div class="check-text">質問を1つして理解を確認した</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box">✓</div>
          <div class="check-text">待てなかった場面の原因を1つ書いた</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        ここは「最後まで聞く」が自走できるかの確認週。待つ条件を具体化し、再現可能な手順に固定する。
      </div>
    </div>
  </div>

  <!-- WK6 -->
  <div class="week-block phase-2" id="week-6">
    <div class="week-head" onclick="toggleWeek('week-6')">
      <div class="week-num">WK 6</div>
      <div class="week-title-wrap">
        <div class="week-title">解決策を急がない</div>
        <div class="week-sub">まず理解を返す</div>
      </div>
      <div class="week-check-count" id="cnt-week-6">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、解決策を急がず理解を返せた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box">✓</div>
          <div class="check-text">相手の話を要約して返した</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box">✓</div>
          <div class="check-text">助言は相手の同意を得てから伝えた</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box">✓</div>
          <div class="check-text">急ぎ過ぎた場面を1件メモした</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 先回りは小さくてよい</div>
        完璧な返答より、相手を最後まで聞くことを優先する。
      </div>
    </div>
  </div>

  <!-- WK7 -->
  <div class="week-block phase-2" id="week-7">
    <div class="week-head" onclick="toggleWeek('week-7')">
      <div class="week-num">WK 7</div>
      <div class="week-title-wrap">
        <div class="week-title">聞く手順を固定する</div>
        <div class="week-sub">待つ→要約→質問</div>
      </div>
      <div class="week-check-count" id="cnt-week-7">0/2</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、待つ→要約→質問を同じ順番で回せた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box">✓</div>
          <div class="check-text">待つ→要約→質問を1セット実行した</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box">✓</div>
          <div class="check-text">自分の聞く手順を1分で説明した</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        聞く手順を固定できると再現性が上がる。「待つ→要約→質問」の順で本人の型を確定させる。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-emoji">✨</div>
    <div>
      <div class="phase-banner-title">PHASE 2 完了！</div>
      <div class="phase-banner-sub">自走の型ができました。次は習慣として無意識化します。</div>
    </div>
  </div>

  <!-- ===== PHASE 3 ===== -->
  <div class="section-heading phase-3" id="phase-3">
    <span class="phase-tag">PHASE 3</span>
    定着させる（8〜11週）
  </div>

  <!-- WK8（8〜9週） -->
  <div class="week-block phase-3" id="week-8">
    <div class="week-head" onclick="toggleWeek('week-8')">
      <div class="week-num">WK 8–9</div>
      <div class="week-title-wrap">
        <div class="week-title">暴走の予兆を記録する</div>
        <div class="week-sub">話したくなる瞬間を掴む</div>
      </div>
      <div class="week-check-count" id="cnt-week-8">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、暴走の予兆を1件記録できた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box">✓</div>
          <div class="check-text">話したくなる瞬間を1つ記録した</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box">✓</div>
          <div class="check-text">その原因を1つ選んでメモした</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box">✓</div>
          <div class="check-text">今日のメモを次回1on1で共有できる場所に保存した</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 変化は小さくていい</div>
        最初は少なくて問題ない。「できた瞬間」を拾うほど再現しやすくなる。できなかった日も「なぜ抜けたか」を一言残すと次が改善しやすい。
      </div>
    </div>
  </div>

  <!-- WK10（10〜11週） -->
  <div class="week-block phase-3" id="week-10">
    <div class="week-head" onclick="toggleWeek('week-10')">
      <div class="week-num">WK 10–11</div>
      <div class="week-title-wrap">
        <div class="week-title">メンターなしで会話制御</div>
        <div class="week-sub">自分で止まって聞く</div>
      </div>
      <div class="week-check-count" id="cnt-week-10">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、会話制御を自分だけで完了できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box">✓</div>
          <div class="check-text">会話前に待つ意識を1回確認した</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box">✓</div>
          <div class="check-text">割り込みの有無を分類してメモした</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box">✓</div>
          <div class="check-text">明日の改善アクションを1行で決めた</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        この期間は「助言より記録」。詰まり分類と改善アクションが自分で回っていれば合格。細かい添削は減らして自走性を優先する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-emoji">🌱</div>
    <div>
      <div class="phase-banner-title">PHASE 3 完了！</div>
      <div class="phase-banner-sub">止まって聞く習慣が定着しました。最後に卒業基準を日次で確認します。</div>
    </div>
  </div>

  <!-- ===== PHASE 4 ===== -->
  <div class="section-heading phase-4" id="phase-4">
    <span class="phase-tag">PHASE 4</span>
    手離れ確認（12〜13週）
  </div>

  <!-- WK12（12〜13週） -->
  <div class="week-block phase-4" id="week-12">
    <div class="week-head" onclick="toggleWeek('week-12')">
      <div class="week-num">WK 12–13</div>
      <div class="week-title-wrap">
        <div class="week-title">卒業判定</div>
        <div class="week-sub">自走・自覚・再現をその日の行動で確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-12">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業3基準を実タスクで満たせた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box">✓</div>
          <div class="check-text">【自走】相手の話を最後まで聞いてから発言した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box">✓</div>
          <div class="check-text">【説明】待つ理由を自分の言葉で説明した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box">✓</div>
          <div class="check-text">【再現】今日の新しい場面でも「待つ→要約→質問」を使えた</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        3つ全部YESなら卒業。未達項目がある場合は、詰まり分類（前提/用語/順序）のどこで崩れたかを特定して翌日タスクに戻す。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-4">
    <div class="phase-banner-emoji">🎓</div>
    <div>
      <div class="phase-banner-title">PHASE 4 完了！</div>
      <div class="phase-banner-sub">卒業判定の準備ができました。メンターと最終確認をしましょう。</div>
    </div>
  </div>

  <!-- GRADUATION -->
  <div class="grad-section" id="grad-section">
    <div class="grad-emoji">🎓</div>
    <div class="grad-title">90日間、お疲れさまでした！</div>
    <div class="grad-sub">
      話す力に加えて、止まって聞く力を習慣にできました。<br>
      これからは、対話の質を自分で安定させられます。
    </div>
  </div>
`
  },
  r3: {
    label: 'R3',
    title: 'R3型 90日トレーニング｜コミュ力診断',
    tone: { bg: '#e8f1ff', border: '#ccddfb', text: '#163080' },
    mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">R3 — 聴き方グループ</div>
    <div class="type-hero-title">🫧 「残らない」型</div>
    <div class="type-hero-sub">
      その場では理解できても、翌日には指示が抜けやすいタイプです。<br>
      メモが残らないと、同じ説明を何度も受ける状態になりやすくなります。<br>
      このトレーニングでは、<strong>記録と再確認で保持する型</strong>を90日で身につけます。
    </div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title">📐 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon">🧠</div>
        <div class="node-label">その場で理解</div>
        <div class="node-sub">直後はできる</div>
      </div>
      <div class="insight-arrow broken">
        <div style="display:flex;align-items:center;gap:0">
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div style="width:10px;height:3px;border-top:3px dashed #E24B4A;"></div>
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div class="insight-arrow-head"></div>
        </div>
        <div class="insight-gap-label">⚡ 保持 不足</div>
      </div>
      <div class="insight-node">
        <div class="node-icon">👀</div>
        <div class="node-label">翌日に抜ける</div>
        <div class="node-sub">再説明が必要</div>
      </div>
    </div>
    <div class="insight-desc">
      問題は怠慢ではなく、外部記憶を作る習慣が弱いこと。<br>
      指示直後の3行要約と定期見直しで、保持率は着実に上がります。
    </div>
  </div>

  <!-- PROGRESS OVERVIEW -->
  <div class="progress-overview">
    <div class="phase-chip active" id="chip-1" onclick="scrollToPhase(1)">
      <div class="phase-chip-label">PHASE 1</div>
      <div class="phase-chip-week">1〜3週</div>
      <div class="phase-chip-name">知る・体験</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-2" onclick="scrollToPhase(2)">
      <div class="phase-chip-label">PHASE 2</div>
      <div class="phase-chip-week">4〜7週</div>
      <div class="phase-chip-name">一人で試す</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-3" onclick="scrollToPhase(3)">
      <div class="phase-chip-label">PHASE 3</div>
      <div class="phase-chip-week">8〜11週</div>
      <div class="phase-chip-name">定着させる</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-4" onclick="scrollToPhase(4)">
      <div class="phase-chip-label">PHASE 4</div>
      <div class="phase-chip-week">12〜13週</div>
      <div class="phase-chip-name">手離れ確認</div>
      <div class="phase-done-mark">✅</div>
    </div>
  </div>

  <!-- HEATMAP -->
  <div class="heatmap-box">
    <div class="heatmap-header">
      <div class="heatmap-title">📅 90日のチェック記録</div>
      <div class="heatmap-streak" id="heatmap-streak" style="display:none"></div>
    </div>
    <div class="heatmap-scroll">
      <div class="heatmap-grid" id="heatmap-grid"></div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-total" id="heatmap-total"></div>
      <div class="heatmap-legend">
        <span>少ない</span>
        <div class="heatmap-legend-cell" style="background:#EBEBEB"></div>
        <div class="heatmap-legend-cell" style="background:#9BE9C4"></div>
        <div class="heatmap-legend-cell" style="background:#40C28A"></div>
        <div class="heatmap-legend-cell" style="background:#1D9E75"></div>
        <div class="heatmap-legend-cell" style="background:#0e7a58"></div>
        <span>多い</span>
      </div>
    </div>
  </div>

  <!-- SHARE BUTTON -->
  <div class="share-wrap">
    <button class="share-btn" id="share-btn" onclick="shareProgress()">
      📤 メンターに共有
    </button>
  </div>

  <!-- ===== PHASE 1 ===== -->
  <div class="section-heading phase-1" id="phase-1">
    <span class="phase-tag">PHASE 1</span>
    知る・体験する（1〜3週）
  </div>

  <!-- WK1 -->
  <div class="week-block phase-1" id="week-1">
    <div class="week-head" onclick="toggleWeek('week-1')">
      <div class="week-num">WK 1</div>
      <div class="week-title-wrap">
        <div class="week-title">指示を3行で残す</div>
        <div class="week-sub">聞いた直後に記録する</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、相手に必要な前提を先に置いてから本文を書けた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box">✓</div>
          <div class="check-text">書く前に「相手が知らない前提」を1つ書き出した</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box">✓</div>
          <div class="check-text">本文の冒頭に前提条件を1行追加してから書き始めた</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box">✓</div>
          <div class="check-text">「この人は何を知らないか」をメンターに口頭共有した</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        R3型は「保持の仕組み」が抜けやすい。必ず指示直後に3行要約を残し、翌日の再確認をセットにする。評価は記憶力より、記録を使って再現できたかを軸にする。
      </div>
    </div>
  </div>

  <!-- WK2 -->
  <div class="week-block phase-1" id="week-2">
    <div class="week-head" onclick="toggleWeek('week-2')">
      <div class="week-num">WK 2</div>
      <div class="week-title-wrap">
        <div class="week-title">メモの型を固定する</div>
        <div class="week-sub">日付・内容・期限で残す</div>
      </div>
      <div class="week-check-count" id="cnt-week-2">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、メモの型で指示を残せた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box">✓</div>
          <div class="check-text">指示を日付・内容・期限で記録した</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box">✓</div>
          <div class="check-text">記録した内容を1回見返した</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box">✓</div>
          <div class="check-text">見返しで抜けに気づいた点を1つ追記した</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 なぜ「言い換え」が効くのか</div>
        R3は「その場で分かって後で抜ける」が起きやすい。メモの型を固定すると保持率が上がる。
      </div>
    </div>
  </div>

  <!-- WK3 -->
  <div class="week-block phase-1" id="week-3">
    <div class="week-head" onclick="toggleWeek('week-3')">
      <div class="week-num">WK 3</div>
      <div class="week-title-wrap">
        <div class="week-title">翌日に見返す</div>
        <div class="week-sub">抜けを早く見つける</div>
      </div>
      <div class="week-check-count" id="cnt-week-3">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、翌日の見返しで抜けを早く見つけられた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box">✓</div>
          <div class="check-text">作業前に前日のメモを見返した</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box">✓</div>
          <div class="check-text">見返しで不足していた情報を1つ追記した</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box">✓</div>
          <div class="check-text">追記後に実行順を1回確認した</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        記憶力より、記録を使って再現できたかを評価する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-emoji">🎉</div>
    <div>
      <div class="phase-banner-title">PHASE 1 完了！</div>
      <div class="phase-banner-sub">保持の基本手順ができました。次はメンターなしでも再現してみましょう。</div>
    </div>
  </div>

  <!-- ===== PHASE 2 ===== -->
  <div class="section-heading phase-2" id="phase-2">
    <span class="phase-tag">PHASE 2</span>
    一人で試す（4〜7週）
  </div>

  <!-- WK4 -->
  <div class="week-block phase-2" id="week-4">
    <div class="week-head" onclick="toggleWeek('week-4')">
      <div class="week-num">WK 4</div>
      <div class="week-title-wrap">
        <div class="week-title">要約を共有する</div>
        <div class="week-sub">記憶を外部化する</div>
      </div>
      <div class="week-check-count" id="cnt-week-4">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、要約共有で保持を強化できた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box">✓</div>
          <div class="check-text">指示を3行で要約して共有した</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box">✓</div>
          <div class="check-text">共有後の修正点を1つ反映した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box">✓</div>
          <div class="check-text">要約を保管場所に保存した</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 声に出す理由</div>
        声に出すと視覚野と音声野が同時に動き、黙って読むより盲点に気づきやすくなる。慣れてくれば心の中で言うだけでもOK。まず1週間、必ず声に出してみる。
      </div>
    </div>
  </div>

  <!-- WK5 -->
  <div class="week-block phase-2" id="week-5">
    <div class="week-head" onclick="toggleWeek('week-5')">
      <div class="week-num">WK 5</div>
      <div class="week-title-wrap">
        <div class="week-title">週の指示を復唱する</div>
        <div class="week-sub">忘却を防ぐ</div>
      </div>
      <div class="week-check-count" id="cnt-week-5">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、週の指示を復唱して抜けを防げた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box">✓</div>
          <div class="check-text">今週の指示を1分で復唱した</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box">✓</div>
          <div class="check-text">抜けていた指示を1つ追記した</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box">✓</div>
          <div class="check-text">追記した内容をタスクに反映した</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        ここは「保持手順を自分で回せるか」の確認週。どこで抜けるかを言語化させ、再現可能な手順に固定する。
      </div>
    </div>
  </div>

  <!-- WK6 -->
  <div class="week-block phase-2" id="week-6">
    <div class="week-head" onclick="toggleWeek('week-6')">
      <div class="week-num">WK 6</div>
      <div class="week-title-wrap">
        <div class="week-title">タスクと指示を紐づける</div>
        <div class="week-sub">迷わない状態を作る</div>
      </div>
      <div class="week-check-count" id="cnt-week-6">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、タスクと指示の紐づけを維持できた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box">✓</div>
          <div class="check-text">タスクに対応する指示メモを確認した</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box">✓</div>
          <div class="check-text">不足情報を1件追記した</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box">✓</div>
          <div class="check-text">紐づけ結果をメンターへ1行共有した</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 先回りは小さくてよい</div>
        短い記録でも効果は大きい。完璧さより翌日に再利用できることを優先する。
      </div>
    </div>
  </div>

  <!-- WK7 -->
  <div class="week-block phase-2" id="week-7">
    <div class="week-head" onclick="toggleWeek('week-7')">
      <div class="week-num">WK 7</div>
      <div class="week-title-wrap">
        <div class="week-title">自分の保持手順を固定する</div>
        <div class="week-sub">記録→見返し→実行</div>
      </div>
      <div class="week-check-count" id="cnt-week-7">0/2</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、記録→見返し→実行を同じ順番で回せた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box">✓</div>
          <div class="check-text">記録→見返し→実行を1セット実行した</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box">✓</div>
          <div class="check-text">自分の保持手順を1分で説明した</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        保持手順を固定できると再現性が上がる。「記録→見返し→実行」の順で本人の型を確定させる。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-emoji">✨</div>
    <div>
      <div class="phase-banner-title">PHASE 2 完了！</div>
      <div class="phase-banner-sub">自走の型ができました。次は習慣として無意識化します。</div>
    </div>
  </div>

  <!-- ===== PHASE 3 ===== -->
  <div class="section-heading phase-3" id="phase-3">
    <span class="phase-tag">PHASE 3</span>
    定着させる（8〜11週）
  </div>

  <!-- WK8（8〜9週） -->
  <div class="week-block phase-3" id="week-8">
    <div class="week-head" onclick="toggleWeek('week-8')">
      <div class="week-num">WK 8–9</div>
      <div class="week-title-wrap">
        <div class="week-title">抜けパターンを記録する</div>
        <div class="week-sub">忘れやすい条件を知る</div>
      </div>
      <div class="week-check-count" id="cnt-week-8">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、抜けパターンを1件記録できた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box">✓</div>
          <div class="check-text">忘れやすい条件を1つ記録した</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box">✓</div>
          <div class="check-text">その条件への対策を1行で書いた</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box">✓</div>
          <div class="check-text">今日のメモを次回1on1で共有できる場所に保存した</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 変化は小さくていい</div>
        最初は少なくて問題ない。「できた瞬間」を拾うほど再現しやすくなる。できなかった日も「なぜ抜けたか」を一言残すと次が改善しやすい。
      </div>
    </div>
  </div>

  <!-- WK10（10〜11週） -->
  <div class="week-block phase-3" id="week-10">
    <div class="week-head" onclick="toggleWeek('week-10')">
      <div class="week-num">WK 10–11</div>
      <div class="week-title-wrap">
        <div class="week-title">メンターなしで保持運用</div>
        <div class="week-sub">記録と見返しを自走する</div>
      </div>
      <div class="week-check-count" id="cnt-week-10">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、保持運用を自分だけで完了できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box">✓</div>
          <div class="check-text">作業前に記録の見返しを実行した</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box">✓</div>
          <div class="check-text">抜けの種類を分類してメモした</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box">✓</div>
          <div class="check-text">明日の改善アクションを1行で決めた</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        この期間は「助言より記録」。詰まり分類と改善アクションが自分で回っていれば合格。細かい添削は減らして自走性を優先する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-emoji">🌱</div>
    <div>
      <div class="phase-banner-title">PHASE 3 完了！</div>
      <div class="phase-banner-sub">保持の再現性が定着しました。最後に卒業基準を日次で確認します。</div>
    </div>
  </div>

  <!-- ===== PHASE 4 ===== -->
  <div class="section-heading phase-4" id="phase-4">
    <span class="phase-tag">PHASE 4</span>
    手離れ確認（12〜13週）
  </div>

  <!-- WK12（12〜13週） -->
  <div class="week-block phase-4" id="week-12">
    <div class="week-head" onclick="toggleWeek('week-12')">
      <div class="week-num">WK 12–13</div>
      <div class="week-title-wrap">
        <div class="week-title">卒業判定</div>
        <div class="week-sub">自走・自覚・再現をその日の行動で確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-12">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業3基準を実タスクで満たせた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box">✓</div>
          <div class="check-text">【自走】記録を見返して再説明なしで実行した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box">✓</div>
          <div class="check-text">【説明】保持手順を自分の言葉で説明した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box">✓</div>
          <div class="check-text">【再現】今日の新しい指示でも「記録→見返し→実行」を使えた</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        3つ全部YESなら卒業。未達項目がある場合は、詰まり分類（前提/用語/順序）のどこで崩れたかを特定して翌日タスクに戻す。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-4">
    <div class="phase-banner-emoji">🎓</div>
    <div>
      <div class="phase-banner-title">PHASE 4 完了！</div>
      <div class="phase-banner-sub">卒業判定の準備ができました。メンターと最終確認をしましょう。</div>
    </div>
  </div>

  <!-- GRADUATION -->
  <div class="grad-section" id="grad-section">
    <div class="grad-emoji">🎓</div>
    <div class="grad-title">90日間、お疲れさまでした！</div>
    <div class="grad-sub">
      聞いた内容をその場で流さず、残して使う習慣を作れました。<br>
      これからは、時間が空いても指示を再現して進められます。
    </div>
  </div>
`
  },
  s1: {
    label: 'S1',
    title: 'S1型 90日トレーニング｜コミュ力診断',
    tone: { bg: '#f4eefb', border: '#dfd0f2', text: '#4a2a78' },
    mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">S1 — 構造グループ</div>
    <div class="type-hero-title">🧩 「整理できない」型</div>
    <div class="type-hero-sub">
      情報は持っているのに、順番と優先度の整理で止まりやすいタイプです。<br>
      そのまま書くと、要点と詳細が混ざって読み手が迷いやすくなります。<br>
      このトレーニングでは、<strong>短く整理して伝える型</strong>を90日で身につけます。
    </div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title">📐 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon">🧠</div>
        <div class="node-label">情報が多い</div>
        <div class="node-sub">材料はある</div>
      </div>
      <div class="insight-arrow broken">
        <div style="display:flex;align-items:center;gap:0">
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div style="width:10px;height:3px;border-top:3px dashed #E24B4A;"></div>
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div class="insight-arrow-head"></div>
        </div>
        <div class="insight-gap-label">⚡ 整理 不足</div>
      </div>
      <div class="insight-node">
        <div class="node-icon">👀</div>
        <div class="node-label">読み手が迷う</div>
        <div class="node-sub">順番が分からない</div>
      </div>
    </div>
    <div class="insight-desc">
      問題は能力不足ではなく、読み手の前提を先に想像する工程が抜けること。<br>
      書く前の一手間で、同じ内容でも伝わり方は大きく変えられます。
    </div>
  </div>

  <!-- PROGRESS OVERVIEW -->
  <div class="progress-overview">
    <div class="phase-chip active" id="chip-1" onclick="scrollToPhase(1)">
      <div class="phase-chip-label">PHASE 1</div>
      <div class="phase-chip-week">1〜3週</div>
      <div class="phase-chip-name">知る・体験</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-2" onclick="scrollToPhase(2)">
      <div class="phase-chip-label">PHASE 2</div>
      <div class="phase-chip-week">4〜7週</div>
      <div class="phase-chip-name">一人で試す</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-3" onclick="scrollToPhase(3)">
      <div class="phase-chip-label">PHASE 3</div>
      <div class="phase-chip-week">8〜11週</div>
      <div class="phase-chip-name">定着させる</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-4" onclick="scrollToPhase(4)">
      <div class="phase-chip-label">PHASE 4</div>
      <div class="phase-chip-week">12〜13週</div>
      <div class="phase-chip-name">手離れ確認</div>
      <div class="phase-done-mark">✅</div>
    </div>
  </div>

  <!-- HEATMAP -->
  <div class="heatmap-box">
    <div class="heatmap-header">
      <div class="heatmap-title">📅 90日のチェック記録</div>
      <div class="heatmap-streak" id="heatmap-streak" style="display:none"></div>
    </div>
    <div class="heatmap-scroll">
      <div class="heatmap-grid" id="heatmap-grid"></div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-total" id="heatmap-total"></div>
      <div class="heatmap-legend">
        <span>少ない</span>
        <div class="heatmap-legend-cell" style="background:#EBEBEB"></div>
        <div class="heatmap-legend-cell" style="background:#9BE9C4"></div>
        <div class="heatmap-legend-cell" style="background:#40C28A"></div>
        <div class="heatmap-legend-cell" style="background:#1D9E75"></div>
        <div class="heatmap-legend-cell" style="background:#0e7a58"></div>
        <span>多い</span>
      </div>
    </div>
  </div>

  <!-- SHARE BUTTON -->
  <div class="share-wrap">
    <button class="share-btn" id="share-btn" onclick="shareProgress()">
      📤 メンターに共有
    </button>
  </div>

  <!-- ===== PHASE 1 ===== -->
  <div class="section-heading phase-1" id="phase-1">
    <span class="phase-tag">PHASE 1</span>
    知る・体験する（1〜3週）
  </div>

  <!-- WK1 -->
  <div class="week-block phase-1" id="week-1">
    <div class="week-head" onclick="toggleWeek('week-1')">
      <div class="week-num">WK 1</div>
      <div class="week-title-wrap">
        <div class="week-title">情報を3点に絞る</div>
        <div class="week-sub">まず要点を短く決める</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、相手に必要な前提を先に置いてから本文を書けた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box">✓</div>
          <div class="check-text">書く前に「相手が知らない前提」を1つ書き出した</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box">✓</div>
          <div class="check-text">本文の冒頭に前提条件を1行追加してから書き始めた</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box">✓</div>
          <div class="check-text">「この人は何を知らないか」をメンターに口頭共有した</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        S1型は「情報の並び順」が崩れやすい。必ず「先に結論、次に理由」で話を並べる。評価は長さより、順番が整っているかを軸にする。
      </div>
    </div>
  </div>

  <!-- WK2 -->
  <div class="week-block phase-1" id="week-2">
    <div class="week-head" onclick="toggleWeek('week-2')">
      <div class="week-num">WK 2</div>
      <div class="week-title-wrap">
        <div class="week-title">テンプレで並べる</div>
        <div class="week-sub">同じ型で迷いを減らす</div>
      </div>
      <div class="week-check-count" id="cnt-week-2">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、専門用語や略語を読み手向けに言い換えられた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box">✓</div>
          <div class="check-text">専門用語・略語を1つ以上やさしい表現に言い換えた</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box">✓</div>
          <div class="check-text">略語を初出時に正式名称または注釈つきで書いた</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box">✓</div>
          <div class="check-text">言い換え後に「この文で伝わるか」を1文で自己確認した</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 なぜ「言い換え」が効くのか</div>
        S1は頭の中に情報が多く、順番が前後しやすい。1文目で結論を置くだけで伝わりやすさは大きく上がる。完璧より、毎日同じ順で話すことを優先する。
      </div>
    </div>
  </div>

  <!-- WK3 -->
  <div class="week-block phase-1" id="week-3">
    <div class="week-head" onclick="toggleWeek('week-3')">
      <div class="week-num">WK 3</div>
      <div class="week-title-wrap">
        <div class="week-title">順番をそろえる</div>
        <div class="week-sub">先に結論、次に理由で書く</div>
      </div>
      <div class="week-check-count" id="cnt-week-3">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、前提不足を1つ見つけて補足できた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box">✓</div>
          <div class="check-text">自分の文章を見直して「前提が飛んでいる箇所」を1つ見つけた</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box">✓</div>
          <div class="check-text">その箇所に背景説明または条件説明を1行補った</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box">✓</div>
          <div class="check-text">補足後の文章を「初見の人に伝わるか」で再確認した</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        「説明が長い/短い」ではなく「前提が埋まっているか」を軸に評価する。1文でも前提が入れば改善として認め、継続意欲を保つ。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-emoji">🎉</div>
    <div>
      <div class="phase-banner-title">PHASE 1 完了！</div>
      <div class="phase-banner-sub">前提を置く型ができました。次はメンターなしでも再現してみましょう。</div>
    </div>
  </div>

  <!-- ===== PHASE 2 ===== -->
  <div class="section-heading phase-2" id="phase-2">
    <span class="phase-tag">PHASE 2</span>
    一人で試す（4〜7週）
  </div>

  <!-- WK4 -->
  <div class="week-block phase-2" id="week-4">
    <div class="week-head" onclick="toggleWeek('week-4')">
      <div class="week-num">WK 4</div>
      <div class="week-title-wrap">
        <div class="week-title">箇条書きで先に出す</div>
        <div class="week-sub">文章化の前に整理する</div>
      </div>
      <div class="week-check-count" id="cnt-week-4">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、提出前に読み手目線のテストを実施できた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box">✓</div>
          <div class="check-text">提出前に「この文章は初見でも分かるか？」を声に出して確認した</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box">✓</div>
          <div class="check-text">確認後に前提不足または用語不足を1点以上修正した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box">✓</div>
          <div class="check-text">修正前後の差分をメンターに1行で共有した</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 声に出す理由</div>
        声に出すと視覚野と音声野が同時に動き、黙って読むより盲点に気づきやすくなる。慣れてくれば心の中で言うだけでもOK。まず1週間、必ず声に出してみる。
      </div>
    </div>
  </div>

  <!-- WK5 -->
  <div class="week-block phase-2" id="week-5">
    <div class="week-head" onclick="toggleWeek('week-5')">
      <div class="week-num">WK 5</div>
      <div class="week-title-wrap">
        <div class="week-title">前提チェックを自走化する</div>
        <div class="week-sub">メンターなしで前提漏れを発見して補う</div>
      </div>
      <div class="week-check-count" id="cnt-week-5">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、前提チェックを自分だけで回せた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box">✓</div>
          <div class="check-text">書いた文章を1つ選び「読み手が知らない前提」を1つ抽出した</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box">✓</div>
          <div class="check-text">抽出した前提を1〜2行で補足した</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box">✓</div>
          <div class="check-text">補足後の文章を自分で読み直し「詰まらないか」を確認した</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        ここは「本人が自分で前提漏れを拾えるか」の確認週。見つけ方を言語化させ、再現可能な手順に固定する。
      </div>
    </div>
  </div>

  <!-- WK6 -->
  <div class="week-block phase-2" id="week-6">
    <div class="week-head" onclick="toggleWeek('week-6')">
      <div class="week-num">WK 6</div>
      <div class="week-title-wrap">
        <div class="week-title">先回りで補足する</div>
        <div class="week-sub">指摘される前に前提不足を埋める</div>
      </div>
      <div class="week-check-count" id="cnt-week-6">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指摘前に前提補足を1回以上実行できた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box">✓</div>
          <div class="check-text">提出前に「この人は何を知らないか」を1つ書き出した</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box">✓</div>
          <div class="check-text">前提不足を自分で1点以上補足してから提出した</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box">✓</div>
          <div class="check-text">「先回りで補足できた箇所」をメンターに共有した</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 先回りは小さくてよい</div>
        1文の前提補足でも効果は大きい。完璧な説明を狙うより、相手が詰まる一点を先に埋める意識を優先する。
      </div>
    </div>
  </div>

  <!-- WK7 -->
  <div class="week-block phase-2" id="week-7">
    <div class="week-head" onclick="toggleWeek('week-7')">
      <div class="week-num">WK 7</div>
      <div class="week-title-wrap">
        <div class="week-title">自分の補足パターンを固定する</div>
        <div class="week-sub">効く順番を決めて迷わず回す</div>
      </div>
      <div class="week-check-count" id="cnt-week-7">0/2</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、自分に効く補足手順を同じ順番で回せた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box">✓</div>
          <div class="check-text">WK4〜6で効いた手順を2つ以上組み合わせて使った</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box">✓</div>
          <div class="check-text">「自分の補足手順」をメンターに1分で説明した</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        補足手順を固定できると再現性が上がる。「誰を想定→何を補足→どこに書く」の順で本人の型を確定させる。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-emoji">✨</div>
    <div>
      <div class="phase-banner-title">PHASE 2 完了！</div>
      <div class="phase-banner-sub">自走の型ができました。次は無意識でも前提を補える状態へ進みます。</div>
    </div>
  </div>

  <!-- ===== PHASE 3 ===== -->
  <div class="section-heading phase-3" id="phase-3">
    <span class="phase-tag">PHASE 3</span>
    定着させる（8〜11週）
  </div>

  <!-- WK8（8〜9週） -->
  <div class="week-block phase-3" id="week-8">
    <div class="week-head" onclick="toggleWeek('week-8')">
      <div class="week-num">WK 8–9</div>
      <div class="week-title-wrap">
        <div class="week-title">無意識の相手視点を記録する</div>
        <div class="week-sub">自然に前提補足できた瞬間を可視化する</div>
      </div>
      <div class="week-check-count" id="cnt-week-8">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、無意識でできた前提補足の行動を記録できた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box">✓</div>
          <div class="check-text">意識しなくても相手視点で補足できた場面を1つ見つけた</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box">✓</div>
          <div class="check-text">その瞬間を「いつ・何の文・どの前提を補ったか」でメモした</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box">✓</div>
          <div class="check-text">今日のメモを次回1on1で共有できる場所に保存した</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 変化は小さくていい</div>
        最初は少なくて問題ない。「できた瞬間」を拾うほど再現しやすくなる。できなかった日も「なぜ抜けたか」を一言残すと次が改善しやすい。
      </div>
    </div>
  </div>

  <!-- WK10（10〜11週） -->
  <div class="week-block phase-3" id="week-10">
    <div class="week-head" onclick="toggleWeek('week-10')">
      <div class="week-num">WK 10–11</div>
      <div class="week-title-wrap">
        <div class="week-title">メンターなしで前提補足を回す</div>
        <div class="week-sub">自走で記録・修正・再提出まで完結する</div>
      </div>
      <div class="week-check-count" id="cnt-week-10">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、前提補足のサイクルを自走で完了できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box">✓</div>
          <div class="check-text">相手が詰まりそうな箇所を1つ記録した（なければ「なし」と記録）</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box">✓</div>
          <div class="check-text">受けた指摘を「前提不足/用語不足/順序不足」に分類してメモした</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box">✓</div>
          <div class="check-text">明日の改善アクションを1行で決めた</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        この期間は「助言より記録」。詰まり分類と改善アクションが自分で回っていれば合格。細かい添削は減らして自走性を優先する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-emoji">🌱</div>
    <div>
      <div class="phase-banner-title">PHASE 3 完了！</div>
      <div class="phase-banner-sub">相手視点の補足が定着しました。最後に卒業基準を日次で確認します。</div>
    </div>
  </div>

  <!-- ===== PHASE 4 ===== -->
  <div class="section-heading phase-4" id="phase-4">
    <span class="phase-tag">PHASE 4</span>
    手離れ確認（12〜13週）
  </div>

  <!-- WK12（12〜13週） -->
  <div class="week-block phase-4" id="week-12">
    <div class="week-head" onclick="toggleWeek('week-12')">
      <div class="week-num">WK 12–13</div>
      <div class="week-title-wrap">
        <div class="week-title">卒業判定</div>
        <div class="week-sub">自走・自覚・再現をその日の行動で確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-12">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業3基準を実タスクで満たせた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box">✓</div>
          <div class="check-text">【自走】今日のタスクで、前提不足を自分で補って完了した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box">✓</div>
          <div class="check-text">【自覚】「なぜ前提共有が必要か」を自分の言葉で説明した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box">✓</div>
          <div class="check-text">【再現】今日の新しいタスクでも前提補足の手順を再現して使った</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        3つ全部YESなら卒業。未達項目がある場合は、詰まり分類（前提/用語/順序）のどこで崩れたかを特定して翌日タスクに戻す。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-4">
    <div class="phase-banner-emoji">🎓</div>
    <div>
      <div class="phase-banner-title">PHASE 4 完了！</div>
      <div class="phase-banner-sub">卒業判定の準備ができました。メンターと最終確認をしましょう。</div>
    </div>
  </div>

  <!-- GRADUATION -->
  <div class="grad-section" id="grad-section">
    <div class="grad-emoji">🎓</div>
    <div class="grad-title">90日間、お疲れさまでした！</div>
    <div class="grad-sub">
      自分視点だけで書く癖から、相手視点で前提を補う習慣へ進化できました。<br>
      これからは、誰が読んでも迷いにくい説明を自分で組み立てられます。
    </div>
  </div>
`
  },
  s2: {
    label: 'S2',
    title: 'S2型 90日トレーニング｜コミュ力診断',
    tone: { bg: '#f4eefb', border: '#dfd0f2', text: '#4a2a78' },
    mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">S2 — 構造グループ</div>
    <div class="type-hero-title">💭 「頭の中にあるけど出ない」型</div>
    <div class="type-hero-sub">
      頭の中には考えがあるのに、言葉にすると長くなったり詰まったりしやすいタイプです。<br>
      とくに「結論を先に言う」「短く言う」で止まりやすくなります。<br>
      このトレーニングでは、<strong>一言で言ってから広げる型</strong>を90日で身につけます。
    </div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title">📐 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon">🧠</div>
        <div class="node-label">頭の中はある</div>
        <div class="node-sub">考えは動いている</div>
      </div>
      <div class="insight-arrow broken">
        <div style="display:flex;align-items:center;gap:0">
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div style="width:10px;height:3px;border-top:3px dashed #E24B4A;"></div>
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div class="insight-arrow-head"></div>
        </div>
        <div class="insight-gap-label">⚡ 出口 詰まり</div>
      </div>
      <div class="insight-node">
        <div class="node-icon">👀</div>
        <div class="node-label">言葉が出ない</div>
        <div class="node-sub">長くなる/止まる</div>
      </div>
    </div>
    <div class="insight-desc">
      問題は能力不足ではなく、聞き手の結論を先に想像する工程が抜けること。<br>
      書く前の一手間で、同じ内容でも伝わり方は大きく変えられます。
    </div>
  </div>

  <!-- PROGRESS OVERVIEW -->
  <div class="progress-overview">
    <div class="phase-chip active" id="chip-1" onclick="scrollToPhase(1)">
      <div class="phase-chip-label">PHASE 1</div>
      <div class="phase-chip-week">1〜3週</div>
      <div class="phase-chip-name">知る・体験</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-2" onclick="scrollToPhase(2)">
      <div class="phase-chip-label">PHASE 2</div>
      <div class="phase-chip-week">4〜7週</div>
      <div class="phase-chip-name">一人で試す</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-3" onclick="scrollToPhase(3)">
      <div class="phase-chip-label">PHASE 3</div>
      <div class="phase-chip-week">8〜11週</div>
      <div class="phase-chip-name">定着させる</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-4" onclick="scrollToPhase(4)">
      <div class="phase-chip-label">PHASE 4</div>
      <div class="phase-chip-week">12〜13週</div>
      <div class="phase-chip-name">手離れ確認</div>
      <div class="phase-done-mark">✅</div>
    </div>
  </div>

  <!-- HEATMAP -->
  <div class="heatmap-box">
    <div class="heatmap-header">
      <div class="heatmap-title">📅 90日のチェック記録</div>
      <div class="heatmap-streak" id="heatmap-streak" style="display:none"></div>
    </div>
    <div class="heatmap-scroll">
      <div class="heatmap-grid" id="heatmap-grid"></div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-total" id="heatmap-total"></div>
      <div class="heatmap-legend">
        <span>少ない</span>
        <div class="heatmap-legend-cell" style="background:#EBEBEB"></div>
        <div class="heatmap-legend-cell" style="background:#9BE9C4"></div>
        <div class="heatmap-legend-cell" style="background:#40C28A"></div>
        <div class="heatmap-legend-cell" style="background:#1D9E75"></div>
        <div class="heatmap-legend-cell" style="background:#0e7a58"></div>
        <span>多い</span>
      </div>
    </div>
  </div>

  <!-- SHARE BUTTON -->
  <div class="share-wrap">
    <button class="share-btn" id="share-btn" onclick="shareProgress()">
      📤 メンターに共有
    </button>
  </div>

  <!-- ===== PHASE 1 ===== -->
  <div class="section-heading phase-1" id="phase-1">
    <span class="phase-tag">PHASE 1</span>
    知る・体験する（1〜3週）
  </div>

  <!-- WK1 -->
  <div class="week-block phase-1" id="week-1">
    <div class="week-head" onclick="toggleWeek('week-1')">
      <div class="week-num">WK 1</div>
      <div class="week-title-wrap">
        <div class="week-title">一言で先に言う</div>
        <div class="week-sub">長くなる前に結論を出す</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、相手に必要な結論を先に置いてから本文を書けた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box">✓</div>
          <div class="check-text">書く前に「相手が知らない結論」を1つ書き出した</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box">✓</div>
          <div class="check-text">本文の冒頭に結論条件を1行追加してから書き始めた</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box">✓</div>
          <div class="check-text">「この人は何を知らないか」をメンターに口頭共有した</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        S2型は「本人には自明な結論」が抜けやすい。必ず「聞く人は何を知らないか」を先に聞く。修正文は長さより、結論が補われているかだけを評価する。
      </div>
    </div>
  </div>

  <!-- WK2 -->
  <div class="week-block phase-1" id="week-2">
    <div class="week-head" onclick="toggleWeek('week-2')">
      <div class="week-num">WK 2</div>
      <div class="week-title-wrap">
        <div class="week-title">口頭→箇条書き→文章</div>
        <div class="week-sub">出しやすい順で言語化する</div>
      </div>
      <div class="week-check-count" id="cnt-week-2">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、専門用語や略語を聞き手向けに言い換えられた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box">✓</div>
          <div class="check-text">専門用語・略語を1つ以上やさしい表現に言い換えた</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box">✓</div>
          <div class="check-text">略語を初出時に正式名称または注釈つきで書いた</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box">✓</div>
          <div class="check-text">言い換え後に「この文で伝わるか」を1文で自己確認した</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 なぜ「言い換え」が効くのか</div>
        S2は考えがあっても言葉の出口で止まりやすい。まず一言で言ってから補足すると、伝達の流れが安定する。完璧さより、先に短く言い切る習慣を優先する。
      </div>
    </div>
  </div>

  <!-- WK3 -->
  <div class="week-block phase-1" id="week-3">
    <div class="week-head" onclick="toggleWeek('week-3')">
      <div class="week-num">WK 3</div>
      <div class="week-title-wrap">
        <div class="week-title">結論を先頭に固定する</div>
        <div class="week-sub">毎回同じ順で話す</div>
      </div>
      <div class="week-check-count" id="cnt-week-3">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、結論不足を1つ見つけて言い換えできた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box">✓</div>
          <div class="check-text">自分の文章を見直して「結論が飛んでいる箇所」を1つ見つけた</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box">✓</div>
          <div class="check-text">その箇所に背景説明または条件説明を1行補った</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box">✓</div>
          <div class="check-text">言い換え後の文章を「初見の人に伝わるか」で再確認した</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        「説明が長い/短い」ではなく「結論が埋まっているか」を軸に評価する。1文でも結論が入れば改善として認め、継続意欲を保つ。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-emoji">🎉</div>
    <div>
      <div class="phase-banner-title">PHASE 1 完了！</div>
      <div class="phase-banner-sub">結論を置く型ができました。次はメンターなしでも再現してみましょう。</div>
    </div>
  </div>

  <!-- ===== PHASE 2 ===== -->
  <div class="section-heading phase-2" id="phase-2">
    <span class="phase-tag">PHASE 2</span>
    一人で試す（4〜7週）
  </div>

  <!-- WK4 -->
  <div class="week-block phase-2" id="week-4">
    <div class="week-head" onclick="toggleWeek('week-4')">
      <div class="week-num">WK 4</div>
      <div class="week-title-wrap">
        <div class="week-title">30秒で話してから書く</div>
        <div class="week-sub">まず話してから文字化する</div>
      </div>
      <div class="week-check-count" id="cnt-week-4">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、提出前に聞き手目線のテストを実施できた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box">✓</div>
          <div class="check-text">提出前に「この文章は初見でも分かるか？」を声に出して確認した</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box">✓</div>
          <div class="check-text">確認後に結論不足または用語不足を1点以上修正した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box">✓</div>
          <div class="check-text">修正前後の差分をメンターに1行で共有した</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 一言を先に言う理由</div>
        声に出すと視覚野と音声野が同時に動き、黙って読むより盲点に気づきやすくなる。慣れてくれば心の中で言うだけでもOK。まず1週間、必ず声に出してみる。
      </div>
    </div>
  </div>

  <!-- WK5 -->
  <div class="week-block phase-2" id="week-5">
    <div class="week-head" onclick="toggleWeek('week-5')">
      <div class="week-num">WK 5</div>
      <div class="week-title-wrap">
        <div class="week-title">結論チェックを自走化する</div>
        <div class="week-sub">メンターなしで結論漏れを発見して補う</div>
      </div>
      <div class="week-check-count" id="cnt-week-5">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、結論チェックを自分だけで回せた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box">✓</div>
          <div class="check-text">書いた文章を1つ選び「聞き手が知らない結論」を1つ抽出した</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box">✓</div>
          <div class="check-text">抽出した結論を1〜2行で言い換えした</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box">✓</div>
          <div class="check-text">言い換え後の文章を自分で読み直し「詰まらないか」を確認した</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        ここは「本人が自分で結論漏れを拾えるか」の確認週。見つけ方を言語化させ、再現可能な手順に固定する。
      </div>
    </div>
  </div>

  <!-- WK6 -->
  <div class="week-block phase-2" id="week-6">
    <div class="week-head" onclick="toggleWeek('week-6')">
      <div class="week-num">WK 6</div>
      <div class="week-title-wrap">
        <div class="week-title">先回りで言い換えする</div>
        <div class="week-sub">指摘される前に結論不足を埋める</div>
      </div>
      <div class="week-check-count" id="cnt-week-6">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指摘前に結論言い換えを1回以上実行できた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box">✓</div>
          <div class="check-text">提出前に「この人は何を知らないか」を1つ書き出した</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box">✓</div>
          <div class="check-text">結論不足を自分で1点以上言い換えしてから提出した</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box">✓</div>
          <div class="check-text">「先回りで言い換えできた箇所」をメンターに共有した</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 先回りは小さくてよい</div>
        1文の結論言い換えでも効果は大きい。完璧な説明を狙うより、相手が詰まる一点を先に埋める意識を優先する。
      </div>
    </div>
  </div>

  <!-- WK7 -->
  <div class="week-block phase-2" id="week-7">
    <div class="week-head" onclick="toggleWeek('week-7')">
      <div class="week-num">WK 7</div>
      <div class="week-title-wrap">
        <div class="week-title">自分の言い換えパターンを固定する</div>
        <div class="week-sub">効く順番を決めて迷わず回す</div>
      </div>
      <div class="week-check-count" id="cnt-week-7">0/2</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、自分に効く言い換え手順を同じ順番で回せた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box">✓</div>
          <div class="check-text">WK4〜6で効いた手順を2つ以上組み合わせて使った</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box">✓</div>
          <div class="check-text">「自分の言い換え手順」をメンターに1分で説明した</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        言い換え手順を固定できると再現性が上がる。「誰を想定→何を言い換え→どこに書く」の順で本人の型を確定させる。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-emoji">✨</div>
    <div>
      <div class="phase-banner-title">PHASE 2 完了！</div>
      <div class="phase-banner-sub">自走の型ができました。次は無意識でも結論を補える状態へ進みます。</div>
    </div>
  </div>

  <!-- ===== PHASE 3 ===== -->
  <div class="section-heading phase-3" id="phase-3">
    <span class="phase-tag">PHASE 3</span>
    定着させる（8〜11週）
  </div>

  <!-- WK8（8〜9週） -->
  <div class="week-block phase-3" id="week-8">
    <div class="week-head" onclick="toggleWeek('week-8')">
      <div class="week-num">WK 8–9</div>
      <div class="week-title-wrap">
        <div class="week-title">無意識の相手視点を記録する</div>
        <div class="week-sub">自然に結論言い換えできた瞬間を可視化する</div>
      </div>
      <div class="week-check-count" id="cnt-week-8">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、無意識でできた結論言い換えの行動を記録できた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box">✓</div>
          <div class="check-text">意識しなくても相手視点で言い換えできた場面を1つ見つけた</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box">✓</div>
          <div class="check-text">その瞬間を「いつ・何の文・どの結論を補ったか」でメモした</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box">✓</div>
          <div class="check-text">今日のメモを次回1on1で共有できる場所に保存した</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 変化は小さくていい</div>
        最初は少なくて問題ない。「できた瞬間」を拾うほど再現しやすくなる。できなかった日も「なぜ抜けたか」を一言残すと次が改善しやすい。
      </div>
    </div>
  </div>

  <!-- WK10（10〜11週） -->
  <div class="week-block phase-3" id="week-10">
    <div class="week-head" onclick="toggleWeek('week-10')">
      <div class="week-num">WK 10–11</div>
      <div class="week-title-wrap">
        <div class="week-title">メンターなしで結論言い換えを回す</div>
        <div class="week-sub">自走で記録・修正・再提出まで完結する</div>
      </div>
      <div class="week-check-count" id="cnt-week-10">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、結論言い換えのサイクルを自走で完了できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box">✓</div>
          <div class="check-text">相手が詰まりそうな箇所を1つ記録した（なければ「なし」と記録）</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box">✓</div>
          <div class="check-text">受けた指摘を「結論不足/用語不足/順序不足」に分類してメモした</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box">✓</div>
          <div class="check-text">明日の改善アクションを1行で決めた</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        この期間は「助言より記録」。詰まり分類と改善アクションが自分で回っていれば合格。細かい添削は減らして自走性を優先する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-emoji">🌱</div>
    <div>
      <div class="phase-banner-title">PHASE 3 完了！</div>
      <div class="phase-banner-sub">相手視点の言い換えが定着しました。最後に卒業基準を日次で確認します。</div>
    </div>
  </div>

  <!-- ===== PHASE 4 ===== -->
  <div class="section-heading phase-4" id="phase-4">
    <span class="phase-tag">PHASE 4</span>
    手離れ確認（12〜13週）
  </div>

  <!-- WK12（12〜13週） -->
  <div class="week-block phase-4" id="week-12">
    <div class="week-head" onclick="toggleWeek('week-12')">
      <div class="week-num">WK 12–13</div>
      <div class="week-title-wrap">
        <div class="week-title">卒業判定</div>
        <div class="week-sub">自走・自覚・再現をその日の行動で確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-12">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業3基準を実タスクで満たせた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box">✓</div>
          <div class="check-text">【自走】今日のタスクで、結論不足を自分で補って完了した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box">✓</div>
          <div class="check-text">【自覚】「なぜ結論共有が必要か」を自分の言葉で説明した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box">✓</div>
          <div class="check-text">【再現】今日の新しいタスクでも結論言い換えの手順を再現して使った</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        3つ全部YESなら卒業。未達項目がある場合は、詰まり分類（結論/用語/順序）のどこで崩れたかを特定して翌日タスクに戻す。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-4">
    <div class="phase-banner-emoji">🎓</div>
    <div>
      <div class="phase-banner-title">PHASE 4 完了！</div>
      <div class="phase-banner-sub">卒業判定の準備ができました。メンターと最終確認をしましょう。</div>
    </div>
  </div>

  <!-- GRADUATION -->
  <div class="grad-section" id="grad-section">
    <div class="grad-emoji">🎓</div>
    <div class="grad-title">90日間、お疲れさまでした！</div>
    <div class="grad-sub">
      自分視点だけで書く癖から、相手視点で結論を補う習慣へ進化できました。<br>
      これからは、誰が読んでも迷いにくい説明を自分で組み立てられます。
    </div>
  </div>
`
  },
  s3: {
    label: 'S3',
    title: 'S3型 90日トレーニング｜コミュ力診断',
    tone: { bg: '#f4eefb', border: '#dfd0f2', text: '#4a2a78' },
    mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">S3 — 構造グループ</div>
    <div class="type-hero-title">🔭 「具体から動けない」型</div>
    <div class="type-hero-sub">
      作業の手順は書けるのに、「つまり何か」を短く言うところで止まりやすいタイプです。<br>
      時系列の記録は多いのに、要約や意味づけが空欄になりがちです。<br>
      このトレーニングでは、<strong>具体から要点を引き上げる型</strong>を90日で身につけます。
    </div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title">📐 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon">🧠</div>
        <div class="node-label">作業ログは多い</div>
        <div class="node-sub">具体は書ける</div>
      </div>
      <div class="insight-arrow broken">
        <div style="display:flex;align-items:center;gap:0">
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div style="width:10px;height:3px;border-top:3px dashed #E24B4A;"></div>
          <div style="width:14px;height:3px;background:var(--border)"></div>
          <div class="insight-arrow-head"></div>
        </div>
        <div class="insight-gap-label">⚡ 抽象化 不足</div>
      </div>
      <div class="insight-node">
        <div class="node-icon">👀</div>
        <div class="node-label">要約が出ない</div>
        <div class="node-sub">つまりが書けない</div>
      </div>
    </div>
    <div class="insight-desc">
      問題はやる気不足ではなく、具体を「一言の要点」に変える練習不足。<br>
      「一言で言うと？」を毎日入れると、要約力は着実に上がります。
    </div>
  </div>

  <!-- PROGRESS OVERVIEW -->
  <div class="progress-overview">
    <div class="phase-chip active" id="chip-1" onclick="scrollToPhase(1)">
      <div class="phase-chip-label">PHASE 1</div>
      <div class="phase-chip-week">1〜3週</div>
      <div class="phase-chip-name">知る・体験</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-2" onclick="scrollToPhase(2)">
      <div class="phase-chip-label">PHASE 2</div>
      <div class="phase-chip-week">4〜7週</div>
      <div class="phase-chip-name">一人で試す</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-3" onclick="scrollToPhase(3)">
      <div class="phase-chip-label">PHASE 3</div>
      <div class="phase-chip-week">8〜11週</div>
      <div class="phase-chip-name">定着させる</div>
      <div class="phase-done-mark">✅</div>
    </div>
    <div class="phase-chip" id="chip-4" onclick="scrollToPhase(4)">
      <div class="phase-chip-label">PHASE 4</div>
      <div class="phase-chip-week">12〜13週</div>
      <div class="phase-chip-name">手離れ確認</div>
      <div class="phase-done-mark">✅</div>
    </div>
  </div>

  <!-- HEATMAP -->
  <div class="heatmap-box">
    <div class="heatmap-header">
      <div class="heatmap-title">📅 90日のチェック記録</div>
      <div class="heatmap-streak" id="heatmap-streak" style="display:none"></div>
    </div>
    <div class="heatmap-scroll">
      <div class="heatmap-grid" id="heatmap-grid"></div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-total" id="heatmap-total"></div>
      <div class="heatmap-legend">
        <span>少ない</span>
        <div class="heatmap-legend-cell" style="background:#EBEBEB"></div>
        <div class="heatmap-legend-cell" style="background:#9BE9C4"></div>
        <div class="heatmap-legend-cell" style="background:#40C28A"></div>
        <div class="heatmap-legend-cell" style="background:#1D9E75"></div>
        <div class="heatmap-legend-cell" style="background:#0e7a58"></div>
        <span>多い</span>
      </div>
    </div>
  </div>

  <!-- SHARE BUTTON -->
  <div class="share-wrap">
    <button class="share-btn" id="share-btn" onclick="shareProgress()">
      📤 メンターに共有
    </button>
  </div>

  <!-- ===== PHASE 1 ===== -->
  <div class="section-heading phase-1" id="phase-1">
    <span class="phase-tag">PHASE 1</span>
    知る・体験する（1〜3週）
  </div>

  <!-- WK1 -->
  <div class="week-block phase-1" id="week-1">
    <div class="week-head" onclick="toggleWeek('week-1')">
      <div class="week-num">WK 1</div>
      <div class="week-title-wrap">
        <div class="week-title">情報を3点に絞る</div>
        <div class="week-sub">まず要点を短く決める</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、相手に必要な要点を先に置いてから本文を書けた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box">✓</div>
          <div class="check-text">書く前に「相手が知らない要点」を1つ書き出した</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box">✓</div>
          <div class="check-text">本文の冒頭に要点条件を1行追加してから書き始めた</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box">✓</div>
          <div class="check-text">「この人は何を知らないか」をメンターに口頭共有した</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        S3型は「本人には自明な要点」が抜けやすい。必ず「聞く人は何を知らないか」を先に聞く。修正文は長さより、要点が補われているかだけを評価する。
      </div>
    </div>
  </div>

  <!-- WK2 -->
  <div class="week-block phase-1" id="week-2">
    <div class="week-head" onclick="toggleWeek('week-2')">
      <div class="week-num">WK 2</div>
      <div class="week-title-wrap">
        <div class="week-title">テンプレで並べる</div>
        <div class="week-sub">同じ型で迷いを減らす</div>
      </div>
      <div class="week-check-count" id="cnt-week-2">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、専門用語や略語を聞き手向けに言い換えられた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box">✓</div>
          <div class="check-text">専門用語・略語を1つ以上やさしい表現に言い換えた</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box">✓</div>
          <div class="check-text">略語を初出時に正式名称または注釈つきで書いた</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box">✓</div>
          <div class="check-text">言い換え後に「この文で伝わるか」を1文で自己確認した</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 なぜ「言い換え」が効くのか</div>
        S3は具体は出せても要約で止まりやすい。まず「一言で言うと？」を置くだけで伝達の芯ができる。完璧さより、毎日1回の要約を優先する。
      </div>
    </div>
  </div>

  <!-- WK3 -->
  <div class="week-block phase-1" id="week-3">
    <div class="week-head" onclick="toggleWeek('week-3')">
      <div class="week-num">WK 3</div>
      <div class="week-title-wrap">
        <div class="week-title">順番をそろえる</div>
        <div class="week-sub">先に結論、次に理由で書く</div>
      </div>
      <div class="week-check-count" id="cnt-week-3">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、要点不足を1つ見つけて要約できた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box">✓</div>
          <div class="check-text">自分の文章を見直して「要点が飛んでいる箇所」を1つ見つけた</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box">✓</div>
          <div class="check-text">その箇所に背景説明または条件説明を1行補った</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box">✓</div>
          <div class="check-text">要約後の文章を「初見の人に伝わるか」で再確認した</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        「説明が長い/短い」ではなく「要点が埋まっているか」を軸に評価する。1文でも要点が入れば改善として認め、継続意欲を保つ。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-emoji">🎉</div>
    <div>
      <div class="phase-banner-title">PHASE 1 完了！</div>
      <div class="phase-banner-sub">要点を置く型ができました。次はメンターなしでも再現してみましょう。</div>
    </div>
  </div>

  <!-- ===== PHASE 2 ===== -->
  <div class="section-heading phase-2" id="phase-2">
    <span class="phase-tag">PHASE 2</span>
    一人で試す（4〜7週）
  </div>

  <!-- WK4 -->
  <div class="week-block phase-2" id="week-4">
    <div class="week-head" onclick="toggleWeek('week-4')">
      <div class="week-num">WK 4</div>
      <div class="week-title-wrap">
        <div class="week-title">箇条書きで先に出す</div>
        <div class="week-sub">文章化の前に整理する</div>
      </div>
      <div class="week-check-count" id="cnt-week-4">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、提出前に聞き手目線のテストを実施できた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box">✓</div>
          <div class="check-text">提出前に「この文章は初見でも分かるか？」を声に出して確認した</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box">✓</div>
          <div class="check-text">確認後に要点不足または用語不足を1点以上修正した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box">✓</div>
          <div class="check-text">修正前後の差分をメンターに1行で共有した</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 まず要点を言う理由</div>
        声に出すと視覚野と音声野が同時に動き、黙って読むより盲点に気づきやすくなる。慣れてくれば心の中で言うだけでもOK。まず1週間、必ず声に出してみる。
      </div>
    </div>
  </div>

  <!-- WK5 -->
  <div class="week-block phase-2" id="week-5">
    <div class="week-head" onclick="toggleWeek('week-5')">
      <div class="week-num">WK 5</div>
      <div class="week-title-wrap">
        <div class="week-title">要点チェックを自走化する</div>
        <div class="week-sub">メンターなしで要点漏れを発見して補う</div>
      </div>
      <div class="week-check-count" id="cnt-week-5">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、要点チェックを自分だけで回せた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box">✓</div>
          <div class="check-text">書いた文章を1つ選び「聞き手が知らない要点」を1つ抽出した</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box">✓</div>
          <div class="check-text">抽出した要点を1〜2行で要約した</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box">✓</div>
          <div class="check-text">要約後の文章を自分で読み直し「詰まらないか」を確認した</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        ここは「本人が自分で要点漏れを拾えるか」の確認週。見つけ方を言語化させ、再現可能な手順に固定する。
      </div>
    </div>
  </div>

  <!-- WK6 -->
  <div class="week-block phase-2" id="week-6">
    <div class="week-head" onclick="toggleWeek('week-6')">
      <div class="week-num">WK 6</div>
      <div class="week-title-wrap">
        <div class="week-title">先回りで要約する</div>
        <div class="week-sub">指摘される前に要点不足を埋める</div>
      </div>
      <div class="week-check-count" id="cnt-week-6">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指摘前に要点要約を1回以上実行できた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box">✓</div>
          <div class="check-text">提出前に「この人は何を知らないか」を1つ書き出した</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box">✓</div>
          <div class="check-text">要点不足を自分で1点以上要約してから提出した</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box">✓</div>
          <div class="check-text">「先回りで要約できた箇所」をメンターに共有した</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 先回りは小さくてよい</div>
        1文の要点要約でも効果は大きい。完璧な説明を狙うより、相手が詰まる一点を先に埋める意識を優先する。
      </div>
    </div>
  </div>

  <!-- WK7 -->
  <div class="week-block phase-2" id="week-7">
    <div class="week-head" onclick="toggleWeek('week-7')">
      <div class="week-num">WK 7</div>
      <div class="week-title-wrap">
        <div class="week-title">自分の要約パターンを固定する</div>
        <div class="week-sub">効く順番を決めて迷わず回す</div>
      </div>
      <div class="week-check-count" id="cnt-week-7">0/2</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、自分に効く要約手順を同じ順番で回せた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box">✓</div>
          <div class="check-text">WK4〜6で効いた手順を2つ以上組み合わせて使った</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box">✓</div>
          <div class="check-text">「自分の要約手順」をメンターに1分で説明した</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        要約手順を固定できると再現性が上がる。「誰を想定→何を要約→どこに書く」の順で本人の型を確定させる。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-emoji">✨</div>
    <div>
      <div class="phase-banner-title">PHASE 2 完了！</div>
      <div class="phase-banner-sub">自走の型ができました。次は無意識でも要点を補える状態へ進みます。</div>
    </div>
  </div>

  <!-- ===== PHASE 3 ===== -->
  <div class="section-heading phase-3" id="phase-3">
    <span class="phase-tag">PHASE 3</span>
    定着させる（8〜11週）
  </div>

  <!-- WK8（8〜9週） -->
  <div class="week-block phase-3" id="week-8">
    <div class="week-head" onclick="toggleWeek('week-8')">
      <div class="week-num">WK 8–9</div>
      <div class="week-title-wrap">
        <div class="week-title">無意識の相手視点を記録する</div>
        <div class="week-sub">自然に要点要約できた瞬間を可視化する</div>
      </div>
      <div class="week-check-count" id="cnt-week-8">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、無意識でできた要点要約の行動を記録できた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box">✓</div>
          <div class="check-text">意識しなくても相手視点で要約できた場面を1つ見つけた</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box">✓</div>
          <div class="check-text">その瞬間を「いつ・何の文・どの要点を補ったか」でメモした</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box">✓</div>
          <div class="check-text">今日のメモを次回1on1で共有できる場所に保存した</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label">💡 変化は小さくていい</div>
        最初は少なくて問題ない。「できた瞬間」を拾うほど再現しやすくなる。できなかった日も「なぜ抜けたか」を一言残すと次が改善しやすい。
      </div>
    </div>
  </div>

  <!-- WK10（10〜11週） -->
  <div class="week-block phase-3" id="week-10">
    <div class="week-head" onclick="toggleWeek('week-10')">
      <div class="week-num">WK 10–11</div>
      <div class="week-title-wrap">
        <div class="week-title">メンターなしで要点要約を回す</div>
        <div class="week-sub">自走で記録・修正・再提出まで完結する</div>
      </div>
      <div class="week-check-count" id="cnt-week-10">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、要点要約のサイクルを自走で完了できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box">✓</div>
          <div class="check-text">相手が詰まりそうな箇所を1つ記録した（なければ「なし」と記録）</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box">✓</div>
          <div class="check-text">受けた指摘を「要点不足/用語不足/順序不足」に分類してメモした</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box">✓</div>
          <div class="check-text">明日の改善アクションを1行で決めた</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        この期間は「助言より記録」。詰まり分類と改善アクションが自分で回っていれば合格。細かい添削は減らして自走性を優先する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-emoji">🌱</div>
    <div>
      <div class="phase-banner-title">PHASE 3 完了！</div>
      <div class="phase-banner-sub">相手視点の要約が定着しました。最後に卒業基準を日次で確認します。</div>
    </div>
  </div>

  <!-- ===== PHASE 4 ===== -->
  <div class="section-heading phase-4" id="phase-4">
    <span class="phase-tag">PHASE 4</span>
    手離れ確認（12〜13週）
  </div>

  <!-- WK12（12〜13週） -->
  <div class="week-block phase-4" id="week-12">
    <div class="week-head" onclick="toggleWeek('week-12')">
      <div class="week-num">WK 12–13</div>
      <div class="week-title-wrap">
        <div class="week-title">卒業判定</div>
        <div class="week-sub">自走・自覚・再現をその日の行動で確認する</div>
      </div>
      <div class="week-check-count" id="cnt-week-12">0/3</div>
      <div class="week-arrow">▾</div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業3基準を実タスクで満たせた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box">✓</div>
          <div class="check-text">【自走】今日のタスクで、要点不足を自分で補って完了した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box">✓</div>
          <div class="check-text">【自覚】「なぜ要点共有が必要か」を自分の言葉で説明した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box">✓</div>
          <div class="check-text">【再現】今日の新しいタスクでも要点要約の手順を再現して使った</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label">🧭 メンター向け</div>
        3つ全部YESなら卒業。未達項目がある場合は、詰まり分類（要点/用語/順序）のどこで崩れたかを特定して翌日タスクに戻す。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-4">
    <div class="phase-banner-emoji">🎓</div>
    <div>
      <div class="phase-banner-title">PHASE 4 完了！</div>
      <div class="phase-banner-sub">卒業判定の準備ができました。メンターと最終確認をしましょう。</div>
    </div>
  </div>

  <!-- GRADUATION -->
  <div class="grad-section" id="grad-section">
    <div class="grad-emoji">🎓</div>
    <div class="grad-title">90日間、お疲れさまでした！</div>
    <div class="grad-sub">
      自分視点だけで書く癖から、相手視点で要点を補う習慣へ進化できました。<br>
      これからは、誰が読んでも迷いにくい説明を自分で組み立てられます。
    </div>
  </div>
`
  },
};
