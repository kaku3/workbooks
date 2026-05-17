'use strict';

window.TRAINING_PAGE_PARTS = window.TRAINING_PAGE_PARTS || {};
window.TRAINING_PAGE_PARTS['s2'] = {
  label: "S2",
  title: "S2型 10週間トレーニング｜コミュ力診断",
  tone: { bg: "#f4eefb", border: "#dfd0f2", text: "#4a2a78" },
  mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">S2 — 構造グループ</div>
    <div class="type-hero-title">「頭の中にあるけど出ない」型</div>
    <div class="type-hero-sub">
      頭の中には考えがあるのに、言葉にすると長くなったり詰まったりしやすいタイプです。<br>
      とくに「結論を先に言う」「短く言う」で止まりやすくなります。<br>
      このトレーニングでは、<strong>一言で言ってから広げる型</strong>を90日で身につけます。
    </div>
    <div class="type-hero-bg-icon"><span class="material-icons-round">psychology</span></div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title"><span class="material-icons-round icon-sm">psychology</span> 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon"><span class="material-icons-round">lightbulb</span></div>
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
        <div class="insight-gap-label"><span class="material-icons-round" style="font-size:11px;color:var(--red)">link_off</span> 出口 詰まり</div>
      </div>
      <div class="insight-node">
        <div class="node-icon"><span class="material-icons-round">chat</span></div>
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
        <div class="week-title">一言で先に言う</div>
        <div class="week-sub">長くなる前に結論を出す</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、相手に必要な結論を先に置いてから本文を書けた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">書く前に「相手が知らない結論」を1つ書き出した</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">本文の冒頭に結論条件を1行追加してから書き始めた</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">「この人は何を知らないか」をメンターに口頭共有した</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、専門用語や略語を聞き手向けに言い換えられた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">専門用語・略語を1つ以上やさしい表現に言い換えた</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">略語を初出時に正式名称または注釈つきで書いた</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">言い換え後に「この文で伝わるか」を1文で自己確認した</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> なぜ「言い換え」が効くのか</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、結論不足を1つ見つけて言い換えできた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">自分の文章を見直して「結論が飛んでいる箇所」を1つ見つけた</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">その箇所に背景説明または条件説明を1行補った</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">言い換え後の文章を「初見の人に伝わるか」で再確認した</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        「説明が長い/短い」ではなく「結論が埋まっているか」を軸に評価する。1文でも結論が入れば改善として認め、継続意欲を保つ。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、提出前に聞き手目線のテストを実施できた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">提出前に「この文章は初見でも分かるか？」を声に出して確認した</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">確認後に結論不足または用語不足を1点以上修正した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">修正前後の差分をメンターに1行で共有した</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 一言を先に言う理由</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、結論チェックを自分だけで回せた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">書いた文章を1つ選び「聞き手が知らない結論」を1つ抽出した</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">抽出した結論を1〜2行で言い換えした</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">言い換え後の文章を自分で読み直し「詰まらないか」を確認した</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指摘前に結論言い換えを1回以上実行できた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">提出前に「この人は何を知らないか」を1つ書き出した</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">結論不足を自分で1点以上言い換えしてから提出した</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">「先回りで言い換えできた箇所」をメンターに共有した</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 先回りは小さくてよい</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、自分に効く言い換え手順を同じ順番で回せた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">WK4〜6で効いた手順を2つ以上組み合わせて使った</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">「自分の言い換え手順」をメンターに1分で説明した</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        言い換え手順を固定できると再現性が上がる。「誰を想定→何を言い換え→どこに書く」の順で本人の型を確定させる。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、無意識でできた結論言い換えの行動を記録できた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">意識しなくても相手視点で言い換えできた場面を1つ見つけた</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">その瞬間を「いつ・何の文・どの結論を補ったか」でメモした</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">今日のメモを次回1on1で共有できる場所に保存した</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 変化は小さくていい</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、結論言い換えのサイクルを自走で完了できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">相手が詰まりそうな箇所を1つ記録した（なければ「なし」と記録）</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">受けた指摘を「結論不足/用語不足/順序不足」に分類してメモした</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">明日の改善アクションを1行で決めた</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        この期間は「助言より記録」。詰まり分類と改善アクションが自分で回っていれば合格。細かい添削は減らして自走性を優先する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業3基準を実タスクで満たせた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">【自走】今日のタスクで、結論不足を自分で補って完了した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">【自覚】「なぜ結論共有が必要か」を自分の言葉で説明した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">【再現】今日の新しいタスクでも結論言い換えの手順を再現して使った</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        3つ全部YESなら卒業。未達項目がある場合は、詰まり分類（結論/用語/順序）のどこで崩れたかを特定して翌日タスクに戻す。
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
    <div class="grad-title">90日間、お疲れさまでした！</div>
    <div class="grad-sub">
      自分視点だけで書く癖から、相手視点で結論を補う習慣へ進化できました。<br>
      これからは、誰が読んでも迷いにくい説明を自分で組み立てられます。
    </div>
  </div>
`
};
