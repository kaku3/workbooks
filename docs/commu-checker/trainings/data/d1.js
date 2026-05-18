'use strict';

window.TRAINING_PAGE_PARTS = window.TRAINING_PAGE_PARTS || {};

const D1_CHECK_TEXT = [
  'メンターとの問答で「なぜそう判断したか」を言語化した',
  '今日の問答後に「自分が言いたかったこと」を3行以内でメモした',
  '今日のやり取りで「言われれば確かに」と思った瞬間を1つメモした',
  '報告・文章を書く前に「誰が読むか」を紙またはメモに書いた',
  '書いた後で「最初に伝えたいこと」を3秒で言い直して確認した',
  'WK1との違い（書く前の視点や出来ばえ）を1行メモした',
  'メンターの「良い例」と自分の例を1つ並べて見比べた',
  '差分を「何が違うか」の1文で口頭説明した',
  '差分のポイントを自分のメモに1〜2行で書いた',
  '報告・文章の提出前に「ズレてない？」と声に出して確認した',
  '声出し確認のあとにズレを1点以上修正した',
  '実施した声出しチェックの結果をメンターに共有した',
  '書いた文章を1つ選び、良い例と並べて比較した',
  'メンターの助けなしで「どこが違うか」を1〜2行メモした',
  '差分メモをメンターに短く報告した',
  '提出前に「読む人の名前」を思い浮かべてから確認した',
  '指摘を受ける前に自分で1点以上修正した',
  '「自分で気づいた瞬間」をメンターに共有した',
  'WK4〜6で学んだアプローチを2つ組み合わせて使った',
  '「どれが自分に一番効いたか」をメンターに話した',
  '意識しなくても「読み手視点」が出た場面を1つ見つけた',
  'その瞬間を「いつ・何の文章・何が出た」の3点でメモした',
  '今日のメモを次回1on1で使えるよう保存した',
  '困ったことや気になったことを記録した（何もなければ「なし」と記録）',
  '指摘を受けた場合はその内容を自分でメモした',
  '今日の振り返りをメンターへ報告できる形に1行で整理した',
  '【自走】今日のタスクで、指摘前に自分で修正して完了した',
  '【自覚】「なぜ読み手視点が必要か」を自分の言葉で説明した',
  '【再現】今日の新しいタスクでも同じアプローチを再現して使った'
];

const D1_WEEK_GOALS = [
  '毎日、問答で出た気づきをその日のうちに短く外部化できた。',
  '毎日、書き始める前に読み手視点へ切り替える準備ができた。',
  '毎日、良い例との差分を1つ見つけて言葉にできた。',
  '毎日、提出前のセルフチェックを声出しで実行できた。',
  '毎日、メンターなしでも差分の自己診断を回せた。',
  '毎日、指摘前に自分で気づいて直す流れを1回作れた。',
  '毎日、複数アプローチを使い分けて自分の型を言語化できた。',
  '毎日、無意識にできた読み手視点の行動を記録できた。',
  '毎日、自走で振り返りと修正を完了できた。',
  '毎日、卒業3基準（自走・自覚・再現）をその日の行動で確認できた。'
];

const D1_GUIDE_TEXT = [
  '「なぜそう判断したか」「読む人は何を知らないと思う？」と繰り返し問う。答えが出てきたら「それが書ければ合格です」と伝える。答えを教えず、引き出すことだけに集中する。',
  '「読む人の名前」を書いた瞬間に、思考が「自分視点」から「相手視点」に切り替わる人が多い。バカバカしく感じても、まずやってみることが大事。1週間続けると効果を実感できる。',
  'D1型は比較させると差分を正確に言語化できる。ここで出てきた言語化を「それが今あなたに足りていること」と伝える。責めるのではなく、「見えた」ことを一緒に喜ぶトーンで。',
  '声に出すと視覚野と音声野が同時に動き、黙って読むより盲点に気づきやすくなる。慣れてくれば心の中で言うだけでもOK。まず1週間、必ず声に出してみる。',
  'WK3では一緒にやったが今週は本人が自分で選ぶことが重要。「どうやって選んだか」も聞く。言語化の精度が上がっているかを確認し、上がっていれば「一人でできた」と明確に評価する。',
  '1回でも「言われる前に気づけた」経験があれば十分。完璧にできなくていい。その瞬間が「回路が繋がった証拠」。何回あったかより、あったかどうかが大事。',
  '3つのアプローチ（問答・比較・声出し）のどれが本人に合っているかを一緒に整理する。PHASE 3ではその方法を中心に定着させる。全部やろうとさせず、絞ることが重要。',
  '最初はめったにないかもしれないが、週を重ねるほど増えてくる。「なかった」も正直に記録してOK。記録する習慣自体が観察力を育てる。',
  'ここは「様子を見る期間」。連絡があっても最小限の応答にとどめ、記録させることに集中させる。報告会の場で「どうでしたか？」と聞くだけで十分。自走できたかどうかを一緒に確認する。',
  '3つ全部YESなら卒業。2つ以下の場合は足りない項目を具体的に伝え、WK10-11に戻るか新しい課題を設定する。「合格か不合格か」でなく「次のステップ」として話す。'
];
window.TRAINING_PAGE_PARTS['d1'] = {
  label: "D1",
  title: "D1型 10週間トレーニング｜コミュ力診断",
  tone: { bg: "#eaf6fb", border: "#d0e7f2", text: "#0C447C" },
  mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">D1 — 組み立てグループ</div>
    <div class="type-hero-title">「見えてるけど気づかない」型</div>
    <div class="type-hero-sub">
      認知はできているが、判断・行動に変換するステップが抜けている。<br>
      一緒に考えると答えが出てくるのに、一人に任せると出てこない。<br>
      このトレーニングでは、<strong>頭の中にある気づきを「出力」につなげる回路</strong>を90日かけて育てます。
    </div>
    <div class="type-hero-bg-icon"><span class="material-icons-round">link_off</span></div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title"><span class="material-icons-round icon-sm">link_off</span> 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon"><span class="material-icons-round">lightbulb</span></div>
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
        <div class="insight-gap-label"><span class="material-icons-round" style="font-size:11px;color:var(--red)">link_off</span> 回路 未接続</div>
      </div>
      <div class="insight-node">
        <div class="node-icon"><span class="material-icons-round">edit_note</span></div>
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
      <div class="phase-done-mark"><span class="material-icons-round">task_alt</span></div>
    </div>
    <div class="phase-chip" id="chip-2" onclick="scrollToPhase(2)">
      <div class="phase-chip-label">PHASE 2</div>
      <div class="phase-chip-week">4〜7週</div>
      <div class="phase-chip-name">一人で試す</div>
      <div class="phase-done-mark"><span class="material-icons-round">task_alt</span></div>
    </div>
    <div class="phase-chip" id="chip-3" onclick="scrollToPhase(3)">
      <div class="phase-chip-label">PHASE 3</div>
      <div class="phase-chip-week">8〜11週</div>
      <div class="phase-chip-name">定着させる</div>
      <div class="phase-done-mark"><span class="material-icons-round">task_alt</span></div>
    </div>
    <div class="phase-chip" id="chip-4" onclick="scrollToPhase(4)">
      <div class="phase-chip-label">PHASE 4</div>
      <div class="phase-chip-week">12〜13週</div>
      <div class="phase-chip-name">手離れ確認</div>
      <div class="phase-done-mark"><span class="material-icons-round">task_alt</span></div>
    </div>
  </div>

  <!-- HEATMAP -->
  <div class="heatmap-box">
    <div class="heatmap-header">
      <div class="heatmap-title"><span class="material-icons-round icon-sm">calendar_month</span> 90日のチェック記録</div>
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
      <span class="material-icons-round icon-sm">share</span> メンターに共有
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${D1_WEEK_GOALS[0]}
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[0]}</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[1]}</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[2]}</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        ${D1_GUIDE_TEXT[0]}
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${D1_WEEK_GOALS[1]}
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[3]}</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[4]}</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[5]}</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> なぜ「名前を先に書く」のか</div>
        ${D1_GUIDE_TEXT[1]}
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${D1_WEEK_GOALS[2]}
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[6]}</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[7]}</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[8]}</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        ${D1_GUIDE_TEXT[2]}
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${D1_WEEK_GOALS[3]}
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[9]}</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[10]}</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[11]}</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 声に出す理由</div>
        ${D1_GUIDE_TEXT[3]}
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${D1_WEEK_GOALS[4]}
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[12]}</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[13]}</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[14]}</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        ${D1_GUIDE_TEXT[4]}
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${D1_WEEK_GOALS[5]}
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[15]}</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[16]}</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[17]}</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 1回でいい</div>
        ${D1_GUIDE_TEXT[5]}
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${D1_WEEK_GOALS[6]}
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[18]}</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[19]}</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        ${D1_GUIDE_TEXT[6]}
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${D1_WEEK_GOALS[7]}
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[20]}</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[21]}</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[22]}</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 変化は小さくていい</div>
        ${D1_GUIDE_TEXT[7]}
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${D1_WEEK_GOALS[8]}
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[23]}</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[24]}</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[25]}</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        ${D1_GUIDE_TEXT[8]}
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${D1_WEEK_GOALS[9]}
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[26]}</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[27]}</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${D1_CHECK_TEXT[28]}</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        ${D1_GUIDE_TEXT[9]}
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-4">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
    <div>
      <div class="phase-banner-title">PHASE 4 完了！</div>
      <div class="phase-banner-sub">卒業判定の準備ができました。メンターと最終確認をしましょう。</div>
    </div>
  </div>

  <!-- GRADUATION -->
  <div class="grad-section" id="grad-section">
    <div class="grad-icon"><span class="material-icons-round">workspace_premium</span></div>
    <div class="grad-title">10週間、お疲れさまでした！</div>
    <div class="grad-sub">
      「見えていること」を「出力」に変える回路が繋がりました。<br>
      これからは、一人でも「誰が読むか」を考えながら動ける自分がいます。
    </div>
  </div>
`
};


