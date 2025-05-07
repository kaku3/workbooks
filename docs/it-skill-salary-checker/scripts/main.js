// 初期値取得
function getSkillValues() {
  return skillLabels.map(label => {
    const input = document.querySelector(`input[name='${label}']`);
    return input ? Number(input.value) : 0;
  });
}

let radarChart;

// グループ順・色定義
const groupOrder = [
  { key: 'ヒューマン', label: 'ヒューマンスキル', color: '#e3f0fc' },
  { key: '業務', label: '業務スキル', color: '#e6f7e6' },
  { key: '技術', label: '技術スキル', color: '#fff3e0' },
  { key: 'マネジメント', label: 'マネジメントスキル', color: '#f3e6fa' }
];

function criteriaListHtml(criteriaArr) {
  const labels = [
    '0 - 20 点:',
    '21 - 40 点:',
    '41 - 60 点:',
    '61 - 80 点:',
    '81 - 100 点:'
  ];
  return '<ul class="criteria-list">' + criteriaArr.map((c, i) =>
    `<li><span class="criteria-label">${labels[i] ?? ''}</span><span class="criteria-body">${c}</span></li>`
  ).join('') + '</ul>';
}

function learningsListHtml(learningsArr) {
  return '<ul class="learning-list">' + learningsArr.map(l => `<li class="learning-item"><span class="learning-label">・</span><span class="learning-body">${l}</span></li>`).join('') + '</ul>';
}

// テーブル生成（自己評価のみ、説明列なし）
function renderSkillTable(role, editable = false) {
  let html = '<table><thead><tr><th>スキル</th><th id="self-total-header-th">自己評価</th></tr></thead><tbody>';
  groupOrder.forEach(group => {
    // グループヘッダにidを付与
    html += `<tr class="group-header"><th colspan="2" id="group-total-header-${group.key}" style="background:${group.color}">${group.label}</th></tr>`;
    skillSet.filter(s => s.group === group.key).forEach((skill, idx) => {
      const value = skill.samples[role] ?? 0;
      // 危険(赤)～安全(緑)のグラデーション色を計算
      const safeColor = getSafeColor(value);
      html += `<tr class="skill-row" data-skill-index="${skillSet.indexOf(skill)}" style="background:${group.color}"><td>${skill.name}</td><td class="input-cell">`;
      if (editable) {
        html += `<input type="number" name="${skill.name}" min="0" max="100" value="${value}">`
              + `<input type="range" name="${skill.name}_slider" min="0" max="100" value="${value}" step="5" tabindex="-1" style="background:${safeColor};">`;
      } else {
        html += `<input type="number" value="${value}" disabled>`
              + `<input type="range" value="${value}" disabled tabindex="-1" style="background:${safeColor};">`;
      }
      html += `</td></tr>`;
    });
  });
  html += '</tbody></table>';
  return html;
}

// 危険(赤)～安全(緑)のグラデーション色を返す
function getSafeColor(val) {
  // 0=赤(255,60,60)→100=緑(60,180,75)
  const r1=255,g1=60,b1=60, r2=60,g2=180,b2=75;
  const t = Math.max(0, Math.min(100, Number(val))) / 100;
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `linear-gradient(90deg, rgb(${r1},${g1},${b1}) 0%, rgb(${r},${g},${b}) ${t*100}%, rgb(${r2},${g2},${b2}) 100%)`;
}

// skill-rowクリック時に説明を選択行の下に表示＋選択中はアングルを下向き、再クリックで解除
function setupSkillRowClick() {
  const rows = document.querySelectorAll('.skill-row');
  let lastInfoRow = null;
  let lastSelectedRow = null;
  rows.forEach(row => {
    // 左端にアングルを追加
    const td = row.querySelector('td:first-child');
    if (td && !td.querySelector('.angle-icon')) {
      const angle = document.createElement('span');
      angle.className = 'angle-icon';
      angle.textContent = '▶';
      angle.style.marginRight = '0.5em';
      angle.style.cursor = 'pointer';
      td.prepend(angle);
    }
    
    // 入力フィールドにフォーカスイベントを追加
    const numberInput = row.querySelector('input[type=number]');
    if (numberInput) {
      numberInput.addEventListener('focus', function() {
        // 行が未選択の場合のみクリックイベントをトリガー
        if (!row.classList.contains('selected')) {
          row.click();
        }
      });
    }

    row.addEventListener('click', function(e) {
      // input要素からのクリックの場合はtoggleしない
      if (e.target && (e.target.tagName === 'INPUT' || e.target.closest('input'))) {
        return;
      }
      // アングルクリックでも行クリックでも同じ挙動
      const isSameRow = lastSelectedRow === this;
      // 選択状態リセット
      rows.forEach(r => {
        r.classList.remove('selected');
        const icon = r.querySelector('.angle-icon');
        if (icon) icon.textContent = '▶';
      });
      // 既存の説明行を削除
      if (lastInfoRow && lastInfoRow.parentNode) {
        lastInfoRow.parentNode.removeChild(lastInfoRow);
        lastInfoRow = null;
      }
      if (isSameRow) {
        // すでに選択中の行を再クリック→選択解除＆ヒント非表示
        lastSelectedRow = null;
        return;
      }
      // 新たに選択
      this.classList.add('selected');
      const angleIcon = this.querySelector('.angle-icon');
      if (angleIcon) angleIcon.textContent = '▼';
      // 説明行を作成して挿入
      const idx = Number(this.getAttribute('data-skill-index'));
      const skill = skillSet[idx];
      let html = `<div id="skill-information">`;
      html += `<h4>${skill.name}</h4>`;
      if (skill.desc) {
        html += `<div>${skill.desc}</div>`;
      }
      if (skill.criteria) {
        html += `<h5 style='margin:1em 0 0.2em 0;'>採点基準</h5>`;
        if (Array.isArray(skill.criteria)) {
          html += '<div style="font-size:0.95em;">' + criteriaListHtml(skill.criteria) + '</div>';
        } else {
          html += `<div style='font-size:0.95em;'>${skill.criteria.replace(/\n/g, '<br>')}</div>`;
        }
      }
      if (skill.learnings) {
        html += `<h5 style='margin:1em 0 0.2em 0;'>学習方法</h5>`;
        if (Array.isArray(skill.learnings)) {
          html += '<div style="font-size:0.95em;">' + learningsListHtml(skill.learnings) + '</div>';
        } else {
          html += `<div style='font-size:0.95em;'>${skill.learnings.replace(/\n/g, '<br>')}</div>`;
        }
      }
      html += `</div>`;
      // 新しい説明行を作成
      const infoRow = document.createElement('tr');
      infoRow.className = 'skill-info-row';
      const infoTd = document.createElement('td');
      infoTd.colSpan = 2;
      infoTd.innerHTML = html;
      infoRow.appendChild(infoTd);
      // この行の直後に挿入
      this.parentNode.insertBefore(infoRow, this.nextSibling);
      lastInfoRow = infoRow;
      lastSelectedRow = this;
    });
  });
  // 初期化時は最初のスキルを選択しない
}

// 自己評価thの(n/m)部分だけ書き換える
function updateSelfTotalHeader() {
  const th = document.getElementById('self-total-header-th');
  if (!th) return;
  // 合計値計算
  const totalMax = skillSet.length * 100;
  let totalValue = 0;
  skillSet.forEach(s => {
    const input = document.querySelector(`input[name='${s.name}']`);
    totalValue += input ? Number(input.value) : (s.samples?.self ?? 0);
  });
  th.innerHTML = `自己評価 <span class="self-total-header">(${totalValue}/${totalMax})</span>`;
}

// グループごとのヘッダ(n/m)を更新
function updateSelfGroupHeader() {
  groupOrder.forEach(group => {
    const th = document.getElementById(`group-total-header-${group.key}`);
    if (!th) return;
    const groupSkills = skillSet.filter(s => s.group === group.key);
    const groupMax = groupSkills.length * 100;
    let groupValue = 0;
    groupSkills.forEach(s => {
      const input = document.querySelector(`input[name='${s.name}']`);
      groupValue += input ? Number(input.value) : (s.samples?.self ?? 0);
    });
    // ラベル部分だけ書き換え
    th.innerHTML = `${group.label} <span class="group-total-header">(${groupValue}/${groupMax})</span>`;
  });
}

// タブ・テーブル初期化
function getRoleAverage(role) {
  // skillSetからroleごとの平均点を算出
  if (role === 'self') {
    // 入力値を使って平均を算出
    const vals = skillSet.map(s => {
      const input = document.querySelector(`input[name='${s.name}']`);
      return input ? Number(input.value) : (s.samples.self ?? 0);
    });
    if (!vals.length) return 0;
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.round(avg * 10) / 10;
  } else {
    const vals = skillSet.map(s => s.samples[role] ?? 0);
    if (!vals.length) return 0;
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.round(avg * 10) / 10; // 小数1位で四捨五入
  }
}

// selfタブの平均点を更新
function updateSelfTabAverage() {
  const tabBar = document.querySelector('.tab-bar');
  if (!tabBar) return;
  const selfBtn = tabBar.querySelector('button[data-role="self"]');
  if (!selfBtn) return;
  const avg = getRoleAverage('self');
  // ボタンのラベル部分だけ書き換え
  selfBtn.innerHTML = `自己評価 (${avg})`;
}

function setupSkillTabs() {
  // 自己評価のみ表示
  const roles = [
    { key: 'self', label: '自己評価', editable: true }
  ];
  // タブバー生成なし
  // テーブル生成
  const form = document.getElementById('skillForm');
  form.innerHTML = `<div class="tab-content" data-role="self" style="display:block;">${renderSkillTable('self', true)}</div>`;
  setupSkillRowClick();
  updateSelfTotalHeader(); // 追加: 初期表示時にも呼ぶ
  updateSelfGroupHeader(); // 追加
}

// チェックボックスでグラフ表示切替
function setupChartToggles() {
  // チャートコントロールの再描画後にもイベントを再設定
  document.querySelectorAll('.chart-controls').forEach(ctrl => {
    ctrl.addEventListener('change', (e) => {
      if (e.target.classList.contains('chart-toggle')) {
        saveChartTogglesToLocalStorage();
        renderRadarChart();
      }
    });
  });
}

// chart-toggleの状態保存・復元
function saveChartTogglesToLocalStorage() {
  const checked = Array.from(document.querySelectorAll('.chart-toggle')).map(cb => cb.checked);
  localStorage.setItem('devStandardCareerPathSkillChartToggles', JSON.stringify(checked));
}
function loadChartTogglesFromLocalStorage() {
  const data = localStorage.getItem('devStandardCareerPathSkillChartToggles');
  if (!data) return;
  try {
    const checked = JSON.parse(data);
    document.querySelectorAll('.chart-toggle').forEach((cb, i) => {
      cb.checked = !!checked[i];
    });
  } catch(e) {}
}

// skillSetからラベル配列を生成
function getSkillLabels() {
  return skillSet.map(s => s.name);
}

// skillSetからグループ色配列を生成
function getSkillGroupColors() {
  return skillSet.map(s => {
    const group = groupOrder.find(g => g.key === s.group);
    return group ? group.color : '#fff';
  });
}

// skillSetから自己評価値を取得
function getSelfSkillValues() {
  return skillSet.map(s => {
    const input = document.querySelector(`input[name='${s.name}']`);
    return input ? Number(input.value) : (s.samples.self ?? 0);
  });
}

// skillSetから各職能サンプル値を取得
function getRoleSkillValues(role) {
  return skillSet.map(s => s.samples[role] ?? 0);
}

// チャート描画
function renderRadarChart() {
  renderChartControls();
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const checked = Array.from(document.querySelectorAll('.chart-toggle:checked')).map(cb => cb.value);
  const datasets = [];
  if (checked.includes('self')) {
    datasets.push({
      label: '自己評価',
      data: getSelfSkillValues(),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      pointBackgroundColor: '#64b5f6',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#64b5f6'
    });
  }
  const roleColors = {
    tester: '#388e3c', 'tester-adv': '#1976d2', pg: '#f57c00', se: '#0288d1', plpm: '#8e24aa', consultant: '#c62828'
  };
  ['tester','tester-adv','pg','se','plpm','consultant'].forEach(role => {
    if (checked.includes(role)) {
      datasets.push({
        label: roleLabel(role),
        data: getRoleSkillValues(role),
        backgroundColor: hexToRgba(roleColors[role],0.12),
        borderColor: roleColors[role],
        pointBackgroundColor: roleColors[role],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: roleColors[role]
      });
    }
  });
  const data = { labels: getSkillLabels(), datasets };
  const options = {
    responsive: false,
    scale: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 20 },
        pointLabels: {
          font: { size: 12 },
          color: getSkillGroupColors()
        }
      }
    },
    plugins: {
      legend: { display: true }
    },
    animation: {
      duration: 600,
      easing: 'easeOutQuart'
    }
  };

  if (window.radarChart && window.radarChart.data && window.radarChart.options) {
    window.radarChart.data.labels = data.labels;
    if (window.radarChart.data.datasets.length === data.datasets.length) {
      data.datasets.forEach((ds, i) => {
        window.radarChart.data.datasets[i].data = ds.data;
        window.radarChart.data.datasets[i].label = ds.label;
        window.radarChart.data.datasets[i].backgroundColor = ds.backgroundColor;
        window.radarChart.data.datasets[i].borderColor = ds.borderColor;
        window.radarChart.data.datasets[i].pointBackgroundColor = ds.pointBackgroundColor;
        window.radarChart.data.datasets[i].pointBorderColor = ds.pointBorderColor;
        window.radarChart.data.datasets[i].pointHoverBackgroundColor = ds.pointHoverBackgroundColor;
        window.radarChart.data.datasets[i].pointHoverBorderColor = ds.pointHoverBorderColor;
      });
    } else {
      window.radarChart.data.datasets = data.datasets;
    }
    window.radarChart.options.scale = options.scale;
    window.radarChart.options.plugins = options.plugins;
    window.radarChart.update({duration: 600, easing: 'easeOutQuart'});
  } else {
    window.radarChart = new Chart(ctx, { type: 'radar', data, options });
  }
}

// チャートコントロールのラベルを平均点付きで生成
function renderChartControls() {
  const chartControls = document.querySelector('.chart-controls');
  if (!chartControls) return;
  const roles = [
    { key: 'self', label: '自己評価' },
    { key: 'tester', label: 'テスター' },
    { key: 'tester-adv', label: '上級テスター' },
    { key: 'pg', label: 'PG' },
    { key: 'se', label: 'SE' },
    { key: 'plpm', label: 'PL/PM' },
    { key: 'consultant', label: 'ITコンサルタント' }
  ];
  chartControls.innerHTML = roles.map(r => {
    const avg = getRoleAverage(r.key);
    // チェック状態維持
    const checked = document.querySelector(`.chart-toggle[value='${r.key}']`)?.checked ? 'checked' : '';
    return `<label><input type="checkbox" class="chart-toggle" value="${r.key}" ${checked}>${r.label} <span class="chart-avg">(${avg})</span></label>`;
  }).join('');
}

// input[type=number]とinput[type=range]を同期＋localStorage保存
function saveSelfSkillToLocalStorage() {
  const values = {};
  skillSet.forEach(s => {
    const input = document.querySelector(`input[name='${s.name}']`);
    if (input) values[s.name] = Number(input.value);
  });
  localStorage.setItem('devStandardCareerPathSkill', JSON.stringify(values));
}

function loadSelfSkillFromLocalStorage() {
  const data = localStorage.getItem('devStandardCareerPathSkill');
  if (!data) return;
  try {
    const values = JSON.parse(data);
    skillSet.forEach(s => {
      if (typeof values[s.name] === 'number') {
        const numberInput = document.querySelector(`input[name='${s.name}']`);
        const rangeInput = document.querySelector(`input[name='${s.name}_slider']`);
        if (numberInput) numberInput.value = values[s.name];
        if (rangeInput) rangeInput.value = values[s.name];
      }
    });
    // ここで自己評価合計ヘッダも更新
    updateSelfTotalHeader();
    updateSelfGroupHeader(); // 追加
  } catch(e) {}
}

function setupInputSync() {
  skillSet.forEach(s => {
    const numberInput = document.querySelector(`input[name='${s.name}']`);
    const rangeInput = document.querySelector(`input[name='${s.name}_slider']`);
    if (numberInput && rangeInput) {
      // 値変更時にスライダー色も更新
      function updateRangeColor() {
        rangeInput.style.background = getSafeColor(rangeInput.value);
      }
      numberInput.addEventListener('input', () => {
        rangeInput.value = numberInput.value;
        updateRangeColor();
        saveSelfSkillToLocalStorage();
        renderRadarChart();
        updateSelfTabAverage();
        updateSelfTotalHeader(); // 追加
        updateSelfGroupHeader(); // 追加
      });
      rangeInput.addEventListener('input', () => {
        numberInput.value = rangeInput.value;
        updateRangeColor();
        saveSelfSkillToLocalStorage();
        renderRadarChart();
        updateSelfTabAverage();
        updateSelfTotalHeader(); // 追加
        updateSelfGroupHeader(); // 追加
      });
      // 初期色
      updateRangeColor();
    }
  });
  // 初期表示時もthを更新
  updateSelfTotalHeader();
  updateSelfGroupHeader(); // 追加
}

function roleLabel(role) {
  switch(role) {
    case 'tester': return 'テスター';
    case 'tester-adv': return '上級テスター';
    case 'pg': return 'PG';
    case 'se': return 'SE';
    case 'plpm': return 'PL/PM';
    case 'consultant': return 'ITコンサルタント';
    default: return role;
  }
}

function hexToRgba(hex, alpha) {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return hex;
  return `rgba(${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)},${alpha})`;
}

// スキル採点基準・学習方法の表示（グループごとにタブ切り替え対応）
function renderSkillCriteria() {
  const groupKeys = groupOrder.map(g => g.key);
  groupKeys.forEach(groupKey => {
    const groupDiv = document.querySelector(`.skill-criteria-group[data-group='${groupKey}']`);
    if (!groupDiv) return;
    let html = `<h3>${groupOrder.find(g => g.key === groupKey).label}の採点基準・学習方法</h3>`;
    html += '<div class="criteria-table"><table><thead><tr><th>スキル</th><th>採点基準</th><th>学習方法</th></tr></thead><tbody>';
    skillSet.filter(skill => skill.group === groupKey).forEach(skill => {
      html += `<tr><td>${skill.name}</td><td>`;
      if (Array.isArray(skill.criteria)) {
        html += criteriaListHtml(skill.criteria);
      } else if (skill.criteria) {
        html += skill.criteria.replace(/\n/g, '<br>');
      }
      html += `</td><td>`;
      if (Array.isArray(skill.learnings)) {
        html += learningsListHtml(skill.learnings);
      } else if (skill.learnings) {
        html += skill.learnings;
      }
      html += `</td></tr>`;
    });
    html += '</tbody></table></div>'; // --- ここまで ---
    groupDiv.innerHTML = html;
  });

  // タブ切り替えイベント
  const tabBtns = document.querySelectorAll('.skill-criteria-tab-btn');
  const groups = document.querySelectorAll('.skill-criteria-group');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      groups.forEach(g => {
        if (g.dataset.group === btn.dataset.group) {
          g.classList.add('active');
        } else {
          g.classList.remove('active');
        }
      });
    });
  });
}

// 評価結果を表示する関数
function showEvaluation() {
  const userValues = getSelfSkillValues();
  const evaluation = generateEvaluation(userValues);
  const evaluationHtml = generateEvaluationHTML(evaluation);
  
  const resultContainer = document.querySelector('#evaluation-result');
  if (resultContainer) {
    resultContainer.innerHTML = evaluationHtml;
    resultContainer.style.display = 'block';
  }
  // 共有ボタン表示
  showShareButton({
    role: 'self',
    scores: userValues
    // ...他の入力値があればここに追加...
  });
}

// 評価ボタンのイベントハンドラーを設定
function setupEvaluationButton() {
  const evaluateBtn = document.getElementById('evaluate-button');
  if (evaluateBtn) {
    evaluateBtn.addEventListener('click', () => {
      showEvaluation();
    });
  } else {
    console.error('評価ボタンが見つかりません');
  }
}

// 共有ボタンを診断結果下部に表示
function showShareButton(inputObj, isQueryMode = false) {
  let html = '';
  if (isQueryMode) {
    html = `<button id="try-diagnosis-btn" type="button" class="evaluate-btn" style="margin-top:16px;">
      診断してみる
    </button>`;
  } else {
    const shareUrl = generateShareUrl(inputObj);
    html = createShareButtonHtml(shareUrl)
  }
  let shareDiv = document.getElementById('share-area');
  if (!shareDiv) {
    shareDiv = document.createElement('div');
    shareDiv.id = 'share-area';
    shareDiv.style.marginTop = '1em';
    const evalCard = document.getElementById('evaluation');
    if (evalCard) evalCard.appendChild(shareDiv);
  }
  shareDiv.innerHTML = html;
  if (!isQueryMode) {
    setupShareButtonCopy();
  } else {
    // 「診断してみる」ボタンのクリックでトップページ遷移
    const tryBtn = document.getElementById('try-diagnosis-btn');
    if (tryBtn) {
      tryBtn.addEventListener('click', () => {
        window.location.href = window.location.pathname;
      });
    }
  }
}

// クエリストリングから入力値を復元しフォームに反映＆編集不可
function applyQueryInputIfExists() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (!q) return false;
  const inputObj = decodeInputFromQuery(q);
  if (!inputObj || !Array.isArray(inputObj.scores)) return false;

  // フォーム値を反映
  skillSet.forEach((s, i) => {
    const val = inputObj.scores[i] ?? 0;
    const numberInput = document.querySelector(`input[name='${s.name}']`);
    const rangeInput = document.querySelector(`input[name='${s.name}_slider']`);
    if (numberInput) {
      numberInput.value = val;
      numberInput.disabled = true;
    }
    if (rangeInput) {
      rangeInput.value = val;
      rangeInput.disabled = true;
    }
  });

  // グラフ・診断結果を表示
  renderRadarChart();
  const evaluation = generateEvaluation(inputObj.scores);
  const evaluationHtml = generateEvaluationHTML(evaluation);
  const resultContainer = document.querySelector('#evaluation-result');
  if (resultContainer) {
    resultContainer.innerHTML = evaluationHtml;
    resultContainer.style.display = 'block';
  }
  // 共有ボタンの代わりに「診断してみる」ボタン
  showShareButton(inputObj, true);

  // 診断ボタンを非表示
  const evaluateBtn = document.getElementById('evaluate-button');
  if (evaluateBtn) evaluateBtn.style.display = 'none';

  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  setupSkillTabs();
  setupChartToggles();
  setupInputSync();
  loadSelfSkillFromLocalStorage();
  loadChartTogglesFromLocalStorage();
  renderRadarChart();
  renderSkillCriteria();
  // クエリストリングがあれば共有表示・編集不可
  if (!applyQueryInputIfExists()) {
    setupEvaluationButton(); // 通常の診断ボタン
  }
});
