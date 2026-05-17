'use strict';

window.TRAINING_PAGE_PARTS = window.TRAINING_PAGE_PARTS || {};
window.TRAINING_PAGE_PARTS['m2'] = {
  label: "M2",
  title: "M2型 10週間トレーニング｜コミュ力診断",
  tone: { bg: "#fff4ee", border: "#f3d8ca", text: "#7a2f13" },
  mainHtml: `
<!-- TYPE HERO -->
  <div class="type-hero">
    <div class="type-eyebrow">M2 — メンタルグループ</div>
    <div class="type-hero-title">「防衛本能がつよい」型</div>
    <div class="type-hero-sub">
      指摘を自己否定として受け取りやすく、防衛反応が先に立つ状態です。<br>
      内容が正しくても伝え方が強いと、改善より反発が起きやすくなります。<br>
      このトレーニングでは、<strong>安全を確保しながら改善を受け取る回路</strong>を90日で育てます。
    </div>
    <div class="type-hero-bg-icon"><span class="material-icons-round">shield</span></div>
  </div>

  <!-- INSIGHT BOX -->
  <div class="insight-box">
    <div class="insight-title"><span class="material-icons-round icon-sm">shield</span> 今起きていること</div>
    <div class="insight-diagram">
      <div class="insight-node">
        <div class="node-icon"><span class="material-icons-round">record_voice_over</span></div>
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
        <div class="insight-gap-label"><span class="material-icons-round" style="font-size:11px;color:var(--red)">link_off</span> 防衛 反応</div>
      </div>
      <div class="insight-node">
        <div class="node-icon"><span class="material-icons-round">shield</span></div>
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
        <div class="week-title">安全な受け取り姿勢を作る</div>
        <div class="week-sub">反応する前に受け止める土台を整える</div>
      </div>
      <div class="week-check-count" id="cnt-week-1">0/3</div>
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指摘を攻撃ではなく情報として受け止められた。
      </div>
      <div class="check-list" id="checks-week-1">
        <div class="check-item" onclick="toggleCheck(this,'week-1',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">フィードバック前に「能力否定ではない」と自分に言語化した</div>
          <div class="check-date" id="date-week-1-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">指摘を聞いた直後に反論せず3秒待った</div>
          <div class="check-date" id="date-week-1-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-1',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">聞いた内容を「要点1行」で復唱した</div>
          <div class="check-date" id="date-week-1-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指摘内容を事実ベースで整理できた。
      </div>
      <div class="check-list" id="checks-week-2">
        <div class="check-item" onclick="toggleCheck(this,'week-2',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">受けた指摘を「事実」と「解釈」に分けて書いた</div>
          <div class="check-date" id="date-week-2-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">事実部分だけを使って改善点を1つ決めた</div>
          <div class="check-date" id="date-week-2-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-2',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">決めた改善を実行して結果を1行で記録した</div>
          <div class="check-date" id="date-week-2-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> なぜ「事実分離」が効くのか</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、指摘内容を先に要約してから話せた。
      </div>
      <div class="check-list" id="checks-week-3">
        <div class="check-item" onclick="toggleCheck(this,'week-3',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">言い訳や説明の前に相手の指摘を1文で要約した</div>
          <div class="check-date" id="date-week-3-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">要約が正しいか相手に確認してから発言した</div>
          <div class="check-date" id="date-week-3-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-3',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">改善の次アクションを1つ合意した</div>
          <div class="check-date" id="date-week-3-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        「まず要約」は防衛反応を下げる最短手段。理解確認を先にすると、対話が衝突ではなく調整になる。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-1">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、A/Bの選択肢から自分で改善を選べた。
      </div>
      <div class="check-list" id="checks-week-4">
        <div class="check-item" onclick="toggleCheck(this,'week-4',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">改善案を2択にしてどちらで直すか自分で選んだ</div>
          <div class="check-date" id="date-week-4-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">選んだ案で実際に1点修正した</div>
          <div class="check-date" id="date-week-4-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-4',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">選んだ理由を1行で共有した</div>
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
        <div class="week-title">低刺激で対話を続ける</div>
        <div class="week-sub">感情を上げずに改善サイクルを維持する</div>
      </div>
      <div class="week-check-count" id="cnt-week-5">0/3</div>
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、感情を荒らさずに改善会話を完了できた。
      </div>
      <div class="check-list" id="checks-week-5">
        <div class="check-item" onclick="toggleCheck(this,'week-5',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">強い言い回しを避けて短い言葉で確認した</div>
          <div class="check-date" id="date-week-5-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">会話後に気持ちを落ち着かせる行動を1つ実施した</div>
          <div class="check-date" id="date-week-5-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-5',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">改善内容を翌日に持ち越さずその場で確定した</div>
          <div class="check-date" id="date-week-5-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、受け取り→要約→修正の流れを自走で完了できた。
      </div>
      <div class="check-list" id="checks-week-6">
        <div class="check-item" onclick="toggleCheck(this,'week-6',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">指摘を受けた直後に3秒待って要約した</div>
          <div class="check-date" id="date-week-6-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">要約後に改善アクションを1つ実行した</div>
          <div class="check-date" id="date-week-6-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-6',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">実行結果を記録して次回の型を維持した</div>
          <div class="check-date" id="date-week-6-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 先に落ち着く、次に直す</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、同じ受け取り手順を再現できた。
      </div>
      <div class="check-list" id="checks-week-7">
        <div class="check-item" onclick="toggleCheck(this,'week-7',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text check-text-tight">フィードバック時に「安全確認→要約→選択→実行」を順番どおり実施した</div>
          <div class="check-date" id="date-week-7-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-7',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">順番が崩れた場面を1つ記録し修正した</div>
          <div class="check-date" id="date-week-7-1"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        手順が固定されると、感情が揺れても行動は崩れにくい。順番を守ること自体を成果として評価する。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-2">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業3基準（安全・受容・再現）を満たせた。
      </div>
      <div class="check-list" id="checks-week-8">
        <div class="check-item" onclick="toggleCheck(this,'week-8',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">【自走】促されずに日次チェックを開始して完了した</div>
          <div class="check-date" id="date-week-8-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">【動機】改善の損得を自分の言葉で1文説明した</div>
          <div class="check-date" id="date-week-8-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-8',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">【再現】別タスクでも同じ実行手順を再現した</div>
          <div class="check-date" id="date-week-8-2"></div>
        </div>
      </div>
      <div class="tip-box">
        <div class="tip-label"><span class="material-icons-round icon-sm">lightbulb</span> 卒業は「気分」ではなく「再現」</div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、卒業後も崩れない運用で実行できた。
      </div>
      <div class="check-list" id="checks-week-10">
        <div class="check-item" onclick="toggleCheck(this,'week-10',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">開始時刻・チェック順・記録先を固定運用できた</div>
          <div class="check-date" id="date-week-10-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">逸脱しそうな場面でも基準どおりに戻せた</div>
          <div class="check-date" id="date-week-10-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-10',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">翌日の実行計画を1行で確定した</div>
          <div class="check-date" id="date-week-10-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        卒業直前は「崩れない運用」の確認が最優先。高難度の日でも最低限の実行を維持できるかを見る。
      </div>
    </div>
  </div>

  <div class="phase-banner" id="banner-3">
    <div class="phase-banner-icon"><span class="material-icons-round">celebration</span></div>
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
      <div class="week-arrow"><span class="material-icons-round">expand_more</span></div>
    </div>
    <div class="week-body">
      <div class="week-goal">
        <strong>今週のゴール：</strong>毎日、最終3基準を満たして卒業判定を通過できた。
      </div>
      <div class="check-list" id="checks-week-12">
        <div class="check-item" onclick="toggleCheck(this,'week-12',0)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">【安全】指摘の場で反応前に落ち着く手順を実行した</div>
          <div class="check-date" id="date-week-12-0"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',1)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">【受容】指摘を要約し改善アクションへ変換した</div>
          <div class="check-date" id="date-week-12-1"></div>
        </div>
        <div class="check-item" onclick="toggleCheck(this,'week-12',2)">
          <div class="check-box"><span class="material-icons-round">check</span></div>
          <div class="check-text">【再現】新しい場面でも同じ会話手順を再現した</div>
          <div class="check-date" id="date-week-12-2"></div>
        </div>
      </div>
      <div class="mentor-note">
        <div class="mentor-label"><span class="material-icons-round icon-sm">support_agent</span> メンター向け</div>
        3つ全部YESなら卒業。未達がある場合は、崩れた手順（安全確認/要約/選択/実行）を特定して翌日に戻す。
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
      防衛反応で止まる状態から、落ち着いて改善を選べる状態へ進めました。<br>
      これからは、指摘を材料にして自分で次の行動を選択できます。
    </div>
  </div>
`
};
