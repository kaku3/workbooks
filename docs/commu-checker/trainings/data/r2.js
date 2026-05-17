'use strict';

window.TRAINING_PAGE_PARTS = window.TRAINING_PAGE_PARTS || {};
window.TRAINING_PAGE_PARTS['r2'] = {
  label: "R2",
  title: "R2型 10週間トレーニング｜コミュ力診断",
  tone: { bg: "#e8f1ff", border: "#ccddfb", text: "#7A2006" },
  mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">R2 — 聴き方グループ</div>
    <div class="type-hero-title">「止まれない」型</div>
    <div class="type-hero-sub">
      相手の話を聞ける力はあるのに、話し始める衝動を止めにくいタイプです。<br>
      間を埋めようとして先に話すと、聞くべき情報を取りこぼしやすくなります。<br>
      このトレーニングでは、<strong>待つ・要約する・話すの順を守る型</strong>を90日で身につけます。
    </div>
    <div class="type-hero-bg-icon"><span class="material-icons-round">waves</span></div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title"><span class="material-icons-round icon-sm">waves</span> 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon"><span class="material-icons-round">record_voice_over</span></div>
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
        <div class="insight-gap-label"><span class="material-icons-round" style="font-size:11px;color:var(--red)">link_off</span> 待機 不足</div>
      </div>
      <div class="insight-node">
        <div class="node-icon"><span class="material-icons-round">forum</span></div>
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
        <div class="week-title">3秒待ってから話す</div>
        <div class="week-sub">相手の最後まで聞き切る</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、相手に必要な前提を先に置いてから本文を書けた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">書く前に「相手が知らない前提」を1つ書き出した</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">本文の冒頭に前提条件を1行追加してから書き始めた</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、要約してから話し始めることができた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">相手の発話を1文で要約してから話した</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">話す前に「今話してよいか」を確認した</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">会話後に割り込みの有無を1件メモした</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> なぜ「言い換え」が効くのか</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、沈黙を保って相手の最後まで聞けた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">相手が話し終えるまで3秒待てた</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">途中で話し始めそうになった場面を1件記録した</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">待てた場面を1つ振り返った</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        話量より、最後まで聞けた回数を評価する。できた場面を具体的に褒める。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、会話の占有率を測って調整できた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">1対話で自分の発話時間をざっくり記録した</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">相手の発話を遮った回数を記録した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">次の対話で減らす行動を1つ決めた</div>
          <div class="check-date" id="date-week-4-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 声に出す理由</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、割り込みを減らして最後まで聞けた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">相手の最後の一言まで待ってから話した</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">質問を1つして理解を確認した</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">待てなかった場面の原因を1つ書いた</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、解決策を急がず理解を返せた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">相手の話を要約して返した</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">助言は相手の同意を得てから伝えた</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">急ぎ過ぎた場面を1件メモした</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 先回りは小さくてよい</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、待つ→要約→質問を同じ順番で回せた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">待つ→要約→質問を1セット実行した</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">自分の聞く手順を1分で説明した</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        聞く手順を固定できると再現性が上がる。「待つ→要約→質問」の順で本人の型を確定させる。
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
        <div class="week-title">暴走の予兆を記録する</div>
        <div class="week-sub">話したくなる瞬間を掴む</div>
      </div>
      <div class="week-check-count" id="cnt-week-8">0/3</div>
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、暴走の予兆を1件記録できた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">話したくなる瞬間を1つ記録した</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">その原因を1つ選んでメモした</div>
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
        <div class="week-title">メンターなしで会話制御</div>
        <div class="week-sub">自分で止まって聞く</div>
      </div>
      <div class="week-check-count" id="cnt-week-10">0/3</div>
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、会話制御を自分だけで完了できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">会話前に待つ意識を1回確認した</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">割り込みの有無を分類してメモした</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業3基準を実タスクで満たせた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">【自走】相手の話を最後まで聞いてから発言した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">【説明】待つ理由を自分の言葉で説明した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">【再現】今日の新しい場面でも「待つ→要約→質問」を使えた</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        3つ全部YESなら卒業。未達項目がある場合は、詰まり分類（前提/用語/順序）のどこで崩れたかを特定して翌日タスクに戻す。
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
      話す力に加えて、止まって聞く力を習慣にできました。<br>
      これからは、対話の質を自分で安定させられます。
    </div>
  </div>
`
};
