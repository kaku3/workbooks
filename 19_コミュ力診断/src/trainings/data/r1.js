'use strict';

window.TRAINING_PAGE_PARTS = window.TRAINING_PAGE_PARTS || {};

const R1_CHECK_TEXT = [
  '受けた指示を自分の言葉で1回復唱した',
  '指示を「何を・いつまでに・どこまで」の3点でメモした',
  '不明点を1つ以上その場で確認した',
  '復唱を「目的→作業→期限」の順で言えた',
  '復唱後に相手からOKをもらってから着手した',
  '聞き漏れが出た場面を1件メモした',
  '作業前に前日メモを30秒見返した',
  '見返しで気づいた修正点を1つ反映した',
  '終了時に明日の確認ポイントを1行残した',
  '口頭指示を受けた直後に3行で要約した',
  '要約を相手に送り認識ズレを確認した',
  '要約をタスクと紐づけて保存した',
  '着手前に確認質問を1つした',
  '質問の回答をメモに追記した',
  '追記後に実行内容を1行で再確認した',
  '作業終了前に明日の最初の行動を1行書いた',
  '翌日に参照するメモの場所を固定した',
  '見返し結果をメンターへ1行共有した',
  '「復唱→3点メモ→質問」を順に実行した',
  '自分の受信手順を1分で説明した',
  '聞き返しが必要になった場面を1つ記録した',
  'その原因を「早口/量/曖昧語」から1つ選んだ',
  '次回の対策を1行で書いた',
  '受信内容を自分で整理して着手前に確認した',
  'ズレが出た箇所を分類して記録した',
  '明日の改善アクションを1行で決めた',
  '【自走】今日の指示を再説明なしで実行完了した',
  '【説明】受信手順を自分の言葉で説明した',
  '【再現】今日の新しい指示でも同じ受信手順を使えた'
];

const R1_WEEK_GOALS = [
  '毎日、指示を復唱してから着手できた。',
  '毎日、復唱テンプレで受け取りミスを減らせた。',
  '毎日、前日の指示を見返してから作業開始できた。',
  '毎日、口頭指示を文字で残して作業できた。',
  '毎日、着手前質問で認識ズレを防げた。',
  '毎日、翌日の見返しで指示抜けを減らせた。',
  '毎日、受信手順を同じ順序で再現できた。',
  '毎日、受信ミスの予兆を1件記録できた。',
  '毎日、受信サイクルを自分だけで完了できた。',
  '毎日、卒業3基準を実タスクで満たせた。'
];

const R1_GUIDE_TEXT = [
  'R1型は「受け取りの確認」が抜けやすい。必ずその場で復唱させ、指示を3点メモに短文化する。評価は速さより、再説明なしで実行できたかを軸にする。',
  'R1は「聞いたつもり」で進みやすい。受信内容を復唱して短く残すだけで、実行ズレは減らせる。完璧な理解より、確認を1回挟むことを優先する。',
  '評価軸は速さより再現性。復唱とメモと質問が回っていれば改善として認め、継続意欲を保つ。',
  '声に出すと視覚野と音声野が同時に動き、黙って読むより盲点に気づきやすくなる。慣れてくれば心の中で言うだけでもOK。まず1週間、必ず声に出してみる。',
  'ここは「本人が自分で前提漏れを拾えるか」の確認週。見つけ方を言語化させ、再現可能な手順に固定する。',
  '短いメモでも効果は大きい。完璧な記録より、翌日に見返せる形で1行残す習慣を優先する。',
  '補足手順を固定できると再現性が上がる。「誰を想定→何を補足→どこに書く」の順で本人の型を確定させる。',
  '最初は少なくて問題ない。「できた瞬間」を拾うほど再現しやすくなる。できなかった日も「なぜ抜けたか」を一言残すと次が改善しやすい。',
  'この期間は「助言より記録」。詰まり分類と改善アクションが自分で回っていれば合格。細かい添削は減らして自走性を優先する。',
  '3つ全部YESなら卒業。未達がある場合は「復唱/記録/質問」のどこが抜けたかを特定して翌日に戻す。'
];
window.TRAINING_PAGE_PARTS['r1'] = {
  label: "R1",
  title: "R1型 10週間トレーニング｜コミュ力診断",
  tone: { bg: "#e8f1ff", border: "#ccddfb", text: "#3A3832" },
  mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">R1 — 聴き方グループ</div>
    <div class="type-hero-title">「聞けていない」型</div>
    <div class="type-hero-sub">
      指示を聞いたつもりでも、時間がたつと内容が抜けやすいタイプです。<br>
      確認せずに着手すると、同じ指摘が繰り返されやすくなります。<br>
      このトレーニングでは、<strong>復唱と短文化で受信を安定させる型</strong>を90日で身につけます。
    </div>
    <div class="type-hero-bg-icon"><span class="material-icons-round">hearing_disabled</span></div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title"><span class="material-icons-round icon-sm">hearing_disabled</span> 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon"><span class="material-icons-round">hearing</span></div>
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
        <div class="insight-gap-label"><span class="material-icons-round" style="font-size:11px;color:var(--red)">link_off</span> 確認 不足</div>
      </div>
      <div class="insight-node">
        <div class="node-icon"><span class="material-icons-round">error_outline</span></div>
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
        <div class="week-title">指示を受け切る</div>
        <div class="week-sub">聞いた内容をその場で固定する</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${R1_WEEK_GOALS[0]}
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[0]}</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[1]}</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[2]}</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        ${R1_GUIDE_TEXT[0]}
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${R1_WEEK_GOALS[1]}
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[3]}</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[4]}</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[5]}</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 復唱が効く理由</div>
        ${R1_GUIDE_TEXT[1]}
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${R1_WEEK_GOALS[2]}
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[6]}</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[7]}</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[8]}</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        ${R1_GUIDE_TEXT[2]}
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${R1_WEEK_GOALS[3]}
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[9]}</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[10]}</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[11]}</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 声に出す理由</div>
        ${R1_GUIDE_TEXT[3]}
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${R1_WEEK_GOALS[4]}
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[12]}</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[13]}</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[14]}</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        ${R1_GUIDE_TEXT[4]}
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${R1_WEEK_GOALS[5]}
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[15]}</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[16]}</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[17]}</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 記録は短くてよい</div>
        ${R1_GUIDE_TEXT[5]}
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${R1_WEEK_GOALS[6]}
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[18]}</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[19]}</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        ${R1_GUIDE_TEXT[6]}
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${R1_WEEK_GOALS[7]}
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[20]}</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[21]}</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[22]}</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 変化は小さくていい</div>
        ${R1_GUIDE_TEXT[7]}
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${R1_WEEK_GOALS[8]}
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[23]}</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[24]}</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[25]}</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        ${R1_GUIDE_TEXT[8]}
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>${R1_WEEK_GOALS[9]}
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[26]}</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[27]}</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">${R1_CHECK_TEXT[28]}</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        ${R1_GUIDE_TEXT[9]}
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
      指示を聞いて終わりではなく、受け取って残す習慣を作れました。<br>
      これからは、再説明に頼らず安定して動けます。
    </div>
  </div>
`
};


