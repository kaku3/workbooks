// Game用キーボード表示クラス
// svg でキーボードのキーを描画。
// ユーザーがタイプしたキーに応じて、エフェクト表示を行う。

/**
 * 1. キーボードインスタンス作成
 * const keyboard = new GameKeyboard('keyboard-container');
 * 
 * 2. 次に入力するキーのサジェスト表示
 * keyboard.showNextKeySuggestion('A');
 * 
 * 3. キー押下エフェクト
 * keyboard.showKeyPress('A');
 * 
 * 4. 正解・エラーエフェクト
 * keyboard.showCorrectKeyEffect('A');
 * keyboard.showErrorKeyEffect('B');
 * 
 * 5. リセット
 * keyboard.reset();
 *
 */
function GameKeyboard(containerId) {
  this.container = document.getElementById(containerId);
  this.svg = null;
  this.keyElements = {};
  this.nextKey = null;
  // パフォーマンス制御用
  this._activeEffects = 0;
  this._lastRippleAt = 0;
  
  // キーボードレイアウト定義（日本語キーボード）
  this.keyLayout = [
    [
      {key: '1', x: 0, y: 0, width: 40}, {key: '2', x: 45, y: 0, width: 40}, 
      {key: '3', x: 90, y: 0, width: 40}, {key: '4', x: 135, y: 0, width: 40}, 
      {key: '5', x: 180, y: 0, width: 40}, {key: '6', x: 225, y: 0, width: 40}, 
      {key: '7', x: 270, y: 0, width: 40}, {key: '8', x: 315, y: 0, width: 40}, 
      {key: '9', x: 360, y: 0, width: 40}, {key: '0', x: 405, y: 0, width: 40},
      {key: '-', x: 450, y: 0, width: 40}, {key: '^', x: 495, y: 0, width: 40},
      {key: '\\', x: 540, y: 0, width: 40}, {key: 'Backspace', x: 585, y: 0, width: 65}
    ],
    [
      {key: 'Tab', x: 0, y: 45, width: 65}, {key: 'Q', x: 70, y: 45, width: 40}, 
      {key: 'W', x: 115, y: 45, width: 40}, {key: 'E', x: 160, y: 45, width: 40}, 
      {key: 'R', x: 205, y: 45, width: 40}, {key: 'T', x: 250, y: 45, width: 40}, 
      {key: 'Y', x: 295, y: 45, width: 40}, {key: 'U', x: 340, y: 45, width: 40}, 
      {key: 'I', x: 385, y: 45, width: 40}, {key: 'O', x: 430, y: 45, width: 40},
      {key: 'P', x: 475, y: 45, width: 40}, {key: '@', x: 520, y: 45, width: 40},
      {key: '[', x: 565, y: 45, width: 40}, {key: 'Enter', x: 610, y: 45, width: 40, height: 85}
    ],
    [
      {key: 'Caps', x: 0, y: 90, width: 75}, {key: 'A', x: 80, y: 90, width: 40}, 
      {key: 'S', x: 125, y: 90, width: 40}, {key: 'D', x: 170, y: 90, width: 40}, 
      {key: 'F', x: 215, y: 90, width: 40}, {key: 'G', x: 260, y: 90, width: 40}, 
      {key: 'H', x: 305, y: 90, width: 40}, {key: 'J', x: 350, y: 90, width: 40}, 
      {key: 'K', x: 395, y: 90, width: 40}, {key: 'L', x: 440, y: 90, width: 40},
      {key: ';', x: 485, y: 90, width: 40}, {key: ':', x: 530, y: 90, width: 40},
      {key: ']', x: 575, y: 90, width: 35}
    ],
    [
      {key: 'Shift', x: 0, y: 135, width: 90}, {key: 'Z', x: 95, y: 135, width: 40}, 
      {key: 'X', x: 140, y: 135, width: 40}, {key: 'C', x: 185, y: 135, width: 40}, 
      {key: 'V', x: 230, y: 135, width: 40}, {key: 'B', x: 275, y: 135, width: 40}, 
      {key: 'N', x: 320, y: 135, width: 40}, {key: 'M', x: 365, y: 135, width: 40}, 
      {key: ',', x: 410, y: 135, width: 40}, {key: '.', x: 455, y: 135, width: 40},
      {key: '/', x: 500, y: 135, width: 40}, {key: '_', x: 545, y: 135, width: 40},
      {key: 'Shift', x: 590, y: 135, width: 60}
    ],
    [
      {key: 'Ctrl', x: 0, y: 180, width: 60}, {key: 'Win', x: 65, y: 180, width: 50}, 
      {key: 'Alt', x: 120, y: 180, width: 50}, {key: '無変換', x: 175, y: 180, width: 60},
      {key: 'Space', x: 240, y: 180, width: 180}, {key: '変換', x: 425, y: 180, width: 60},
      {key: 'ひら', x: 490, y: 180, width: 50}, {key: 'Alt', x: 545, y: 180, width: 50},
      {key: 'Ctrl', x: 600, y: 180, width: 50}
    ]
  ];
  
  this.init();
}
GameKeyboard.prototype.init = function () {
  if (!this.container) return;

  // SVG要素を作成
  this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  this.svg.setAttribute('width', '670');
  this.svg.setAttribute('height', '240');
  this.svg.setAttribute('viewBox', '0 0 670 240');
  this.svg.style.width = '100%';
  this.svg.style.height = 'auto';
  this.svg.style.maxWidth = '670px';
  this.svg.style.display = 'block';
  this.svg.style.margin = '0 auto';

  // 背景
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', '670');
  bg.setAttribute('height', '240');
  bg.setAttribute('fill', '#2c3e50');
  bg.setAttribute('rx', '8');
  this.svg.appendChild(bg);

  // 追加: エフェクト用の定義を準備
  this.ensureDefs();

  // キーボードのキーを描画
  this.createKeys();

  this.container.appendChild(this.svg);
};

GameKeyboard.prototype.createKeys = function () {
  this.keyLayout.forEach(row => {
    row.forEach(keyData => {
      this.createKey(keyData);
    });
  });
};

// エフェクト用フィルタ・定義を用意（1回だけ）
GameKeyboard.prototype.ensureDefs = function () {
  if (!this.svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  let defs = this.svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS(NS, 'defs');
    this.svg.appendChild(defs);
  }

  // リップル用のぼかしグロー
  if (!this.svg.querySelector('#ripple-glow')) {
    const filter = document.createElementNS(NS, 'filter');
    filter.setAttribute('id', 'ripple-glow');
    filter.setAttribute('x', '-30%');
    filter.setAttribute('y', '-30%');
    filter.setAttribute('width', '160%');
    filter.setAttribute('height', '160%');

    const blur = document.createElementNS(NS, 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('stdDeviation', '2.5');

    const merge = document.createElementNS(NS, 'feMerge');
    const m1 = document.createElementNS(NS, 'feMergeNode');
    m1.setAttribute('in', 'SourceGraphic');
    const m2 = document.createElementNS(NS, 'feMergeNode');
    m2.setAttribute('in', 'SourceGraphic');

    merge.appendChild(m1);
    merge.appendChild(m2);

    filter.appendChild(blur);
    filter.appendChild(merge);
    defs.appendChild(filter);
  }

  // スパーク用の軽いぼかし
  if (!this.svg.querySelector('#sparkle-blur')) {
    const filter = document.createElementNS(NS, 'filter');
    filter.setAttribute('id', 'sparkle-blur');
    const blur = document.createElementNS(NS, 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('stdDeviation', '0.7');
    filter.appendChild(blur);
    defs.appendChild(filter);
  }
};

GameKeyboard.prototype.createKey = function (keyData) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('class', 'key-group');

  // キーの背景（中央寄せのため10pxオフセット + 垂直位置調整10px）
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', keyData.x + 12);
  rect.setAttribute('y', keyData.y + 10);
  rect.setAttribute('width', keyData.width - 4);
  rect.setAttribute('height', (keyData.height || 40) - 4);
  rect.setAttribute('rx', '4');
  rect.setAttribute('fill', '#ecf0f1');
  rect.setAttribute('stroke', '#bdc3c7');
  rect.setAttribute('stroke-width', '1');
  rect.setAttribute('class', 'key-bg');

  // キーのテキスト（中央寄せのため10pxオフセット + 垂直位置調整10px）
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', keyData.x + keyData.width / 2 + 10);
  text.setAttribute('y', keyData.y + (keyData.height || 40) / 2 + 12);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('font-family', 'Arial, sans-serif');
  text.setAttribute('font-size', keyData.key.length > 3 ? '10' : '12');
  text.setAttribute('font-weight', 'bold');
  text.setAttribute('fill', '#2c3e50');
  text.textContent = keyData.key;

  group.appendChild(rect);
  group.appendChild(text);
  this.svg.appendChild(group);

  // キー要素を保存（アルファベットは大文字小文字両方で登録）
  this.keyElements[keyData.key] = {
    rect,
    text,
    group
  };
  if (keyData.key.match(/^[A-Z]$/)) {
    this.keyElements[keyData.key.toLowerCase()] = {
      rect,
      text,
      group
    };
  }
};

// キーを押したときのエフェクト
GameKeyboard.prototype.showKeyPress = function (key) {
  const keyElement = this.keyElements[key];
  if (!keyElement) return;

  const rect = keyElement.rect;

  // 既存のエフェクトを強制的にクリア
  this.clearKeyEffect(key);

  // キーを押した状態にする
  rect.setAttribute('fill', '#3498db');
  rect.setAttribute('stroke', '#2980b9');

  // 少し遅れて元に戻す
  keyElement.resetTimer = setTimeout(() => {
    rect.setAttribute('fill', '#ecf0f1');
    rect.setAttribute('stroke', '#bdc3c7');
    keyElement.resetTimer = null;
  }, 150);
  // 通常タイピング時も中立色のリップルを発火（IME入力でも毎回出るように）
  this.createRippleEffect(keyElement, { theme: 'neutral' });
};

// リップルエフェクト作成（巨大リップル + 花火スパーク）
// opts.theme: 'neutral' | 'correct' | 'error'
GameKeyboard.prototype.createRippleEffect = function (keyElement, opts) {
  const NS = 'http://www.w3.org/2000/svg';
  const rect = keyElement.rect;
  const cx = parseFloat(rect.getAttribute('x')) + parseFloat(rect.getAttribute('width')) / 2;
  const cy = parseFloat(rect.getAttribute('y')) + parseFloat(rect.getAttribute('height')) / 2;

  // SVGの大きさ（viewBox優先）
  const vb = this.svg.viewBox && this.svg.viewBox.baseVal ? this.svg.viewBox.baseVal : null;
  const svgW = vb && vb.width ? vb.width : (parseFloat(this.svg.getAttribute('width')) || 670);
  const svgH = vb && vb.height ? vb.height : (parseFloat(this.svg.getAttribute('height')) || 240);

  // 最遠コーナーまで届く半径
  const d1 = Math.hypot(cx - 0,    cy - 0);
  const d2 = Math.hypot(cx - svgW, cy - 0);
  const d3 = Math.hypot(cx - 0,    cy - svgH);
  const d4 = Math.hypot(cx - svgW, cy - svgH);
  const maxR = Math.max(d1, d2, d3, d4);

  // まとめ用グループ（同時発生OK）
  const group = document.createElementNS(NS, 'g');
  group.setAttribute('class', 'ripple-burst');
  this.svg.appendChild(group);

  // テーマ別パレット
  const theme = (opts && opts.theme) ? opts.theme : 'neutral';

  // スロットリング（通常タイピングの連打は20ms未満でスキップ）
  const now = (window.performance && performance.now) ? performance.now() : Date.now();
  const dt = now - (this._lastRippleAt || 0);
  if (theme === 'neutral' && dt < 20) {
    return;
  }
  this._lastRippleAt = now;
  const palettes = {
    neutral: ['#6EC1FF', '#3DA5FF', '#2F89FF'],
    correct: ['#6EC1FF', '#3DA5FF', '#2F89FF'],
    error:   ['#FF7A7A', '#FF5A5A', '#E74C3C']
  };
  const list = palettes[theme] || palettes.neutral;
  const baseColor = list[Math.floor(Math.random() * list.length)];

  // 同時エフェクトが多いときは簡略化
  const congested = this._activeEffects > 8 || dt < 25;
  const ringCount = congested ? 2 : 3;
  const streakCount = congested ? 8 : 18;
  const sparkleCount = congested ? 6 : 12;

  // 同時エフェクト数を管理し、溢れたら古いものを捨てる
  this._activeEffects++;
  const maxGroups = 14;
  const groups = this.svg.querySelectorAll('g.ripple-burst');
  if (groups.length > maxGroups) {
    const old = groups[0];
    if (old && old.parentNode) old.parentNode.removeChild(old);
    // 古いものを消すのでカウントも補正（安全側）
    this._activeEffects = Math.max(0, this._activeEffects - 1);
  }

  // 中心フラッシュ（一瞬光って消える）
  const flash = document.createElementNS(NS, 'circle');
  flash.setAttribute('cx', cx);
  flash.setAttribute('cy', cy);
  flash.setAttribute('r', '0');
  flash.setAttribute('fill', '#ffffff');
  flash.setAttribute('opacity', '1');
  flash.setAttribute('filter', 'url(#ripple-glow)');
  group.appendChild(flash);

  const flashR = document.createElementNS(NS, 'animate');
  flashR.setAttribute('attributeName', 'r');
  flashR.setAttribute('values', '0;16;0');
  flashR.setAttribute('keyTimes', '0;0.4;1');
  flashR.setAttribute('dur', congested ? '0.28s' : '0.35s');
  flashR.setAttribute('fill', 'freeze');
  flashR.setAttribute('begin', 'indefinite');

  const flashO = document.createElementNS(NS, 'animate');
  flashO.setAttribute('attributeName', 'opacity');
  flashO.setAttribute('values', '1;0.9;0');
  flashO.setAttribute('keyTimes', '0;0.4;1');
  flashO.setAttribute('dur', congested ? '0.28s' : '0.35s');
  flashO.setAttribute('fill', 'freeze');
  flashO.setAttribute('begin', 'indefinite');

  flash.appendChild(flashR);
  flash.appendChild(flashO);
  // 即時開始
  if (typeof flashR.beginElement === 'function') {
    setTimeout(() => { try { flashR.beginElement(); flashO.beginElement(); } catch(e){} }, 0);
  }

  // 巨大リップル（リングを時間差で重ねる）
  for (let i = 0; i < ringCount; i++) {
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', '0');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', baseColor);
    circle.setAttribute('stroke-width', String(8 - i * 2));
    circle.setAttribute('opacity', '0.9');
    circle.setAttribute('filter', 'url(#ripple-glow)');
    group.appendChild(circle);

    const delay = 0.08 * i; // 秒
  const dur = congested ? 0.55 : 0.7;        // 秒

    const aR = document.createElementNS(NS, 'animate');
    aR.setAttribute('attributeName', 'r');
    aR.setAttribute('from', '0');
    aR.setAttribute('to', String(maxR));
    aR.setAttribute('dur', `${dur}s`);
    aR.setAttribute('begin', 'indefinite');
    aR.setAttribute('fill', 'freeze');

    const aO = document.createElementNS(NS, 'animate');
    aO.setAttribute('attributeName', 'opacity');
    aO.setAttribute('from', '0.9');
    aO.setAttribute('to', '0');
    aO.setAttribute('dur', `${dur}s`);
    aO.setAttribute('begin', 'indefinite');
    aO.setAttribute('fill', 'freeze');

    const aSW = document.createElementNS(NS, 'animate');
    aSW.setAttribute('attributeName', 'stroke-width');
    aSW.setAttribute('from', circle.getAttribute('stroke-width'));
    aSW.setAttribute('to', '0');
    aSW.setAttribute('dur', `${dur}s`);
    aSW.setAttribute('begin', 'indefinite');
    aSW.setAttribute('fill', 'freeze');

    circle.appendChild(aR);
    circle.appendChild(aO);
    circle.appendChild(aSW);

    // 遅延開始
    if (typeof aR.beginElement === 'function') {
      setTimeout(() => { try { aR.beginElement(); aO.beginElement(); aSW.beginElement(); } catch(e){} }, Math.max(0, delay * 1000));
    }
  }

  // 放射状のストリーク（光の筋）
  for (let k = 0; k < streakCount; k++) {
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', cx);
    line.setAttribute('y2', cy);
    line.setAttribute('stroke', baseColor);
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('opacity', '1');
    if (!congested) {
      line.setAttribute('filter', 'url(#ripple-glow)');
    }
    group.appendChild(line);

    const angle = Math.random() * Math.PI * 2;
    const len = 30 + Math.random() * 120;
    const tx = cx + Math.cos(angle) * len;
    const ty = cy + Math.sin(angle) * len;
    const delay = Math.random() * 0.06;
  const dur = (congested ? 0.4 : 0.5) + Math.random() * 0.12;

  const aX2 = document.createElementNS(NS, 'animate');
    aX2.setAttribute('attributeName', 'x2');
    aX2.setAttribute('from', String(cx));
    aX2.setAttribute('to', String(tx));
    aX2.setAttribute('dur', `${dur}s`);
  aX2.setAttribute('begin', 'indefinite');
    aX2.setAttribute('fill', 'freeze');

    const aY2 = document.createElementNS(NS, 'animate');
    aY2.setAttribute('attributeName', 'y2');
    aY2.setAttribute('from', String(cy));
    aY2.setAttribute('to', String(ty));
    aY2.setAttribute('dur', `${dur}s`);
  aY2.setAttribute('begin', 'indefinite');
    aY2.setAttribute('fill', 'freeze');

    const aSW = document.createElementNS(NS, 'animate');
    aSW.setAttribute('attributeName', 'stroke-width');
    aSW.setAttribute('from', '3');
    aSW.setAttribute('to', '0');
    aSW.setAttribute('dur', `${dur}s`);
  aSW.setAttribute('begin', 'indefinite');
    aSW.setAttribute('fill', 'freeze');

    const aO = document.createElementNS(NS, 'animate');
    aO.setAttribute('attributeName', 'opacity');
    aO.setAttribute('from', '1');
    aO.setAttribute('to', '0');
    aO.setAttribute('dur', `${dur}s`);
  aO.setAttribute('begin', 'indefinite');
    aO.setAttribute('fill', 'freeze');

    line.appendChild(aX2);
    line.appendChild(aY2);
    line.appendChild(aSW);
    line.appendChild(aO);

    if (typeof aX2.beginElement === 'function') {
      setTimeout(() => { try { aX2.beginElement(); aY2.beginElement(); aSW.beginElement(); aO.beginElement(); } catch(e){} }, Math.max(0, delay * 1000));
    }
  }

  // スパーク（花火の粒）
  for (let j = 0; j < sparkleCount; j++) {
    const sparkle = document.createElementNS(NS, 'circle');
    sparkle.setAttribute('cx', cx);
    sparkle.setAttribute('cy', cy);
    sparkle.setAttribute('r', String(1.6 + Math.random() * 1.2));
    sparkle.setAttribute('fill', baseColor);
    sparkle.setAttribute('opacity', '1');
    if (!congested) {
      sparkle.setAttribute('filter', 'url(#sparkle-blur)');
    }
    group.appendChild(sparkle);

    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 140;
    const tx = cx + Math.cos(angle) * dist;
    const ty = cy + Math.sin(angle) * dist;
    const delay = Math.random() * 0.05;
  const dur = (congested ? 0.45 : 0.55) + Math.random() * 0.16;

  const aX = document.createElementNS(NS, 'animate');
    aX.setAttribute('attributeName', 'cx');
    aX.setAttribute('from', String(cx));
    aX.setAttribute('to', String(tx));
    aX.setAttribute('dur', `${dur}s`);
  aX.setAttribute('begin', 'indefinite');
    aX.setAttribute('fill', 'freeze');

  const aY = document.createElementNS(NS, 'animate');
  aY.setAttribute('attributeName', 'cy');
  // 少し落下するキーアニメ調（重力風）
  const fall = ty + 5 + Math.random() * 20;
  aY.setAttribute('values', `${cy};${ty};${fall}`);
  aY.setAttribute('keyTimes', '0;0.8;1');
  aY.setAttribute('calcMode', 'spline');
  aY.setAttribute('keySplines', '0.3 0 0.7 1;0.2 0 1 1');
  aY.setAttribute('dur', `${dur}s`);
  aY.setAttribute('begin', 'indefinite');
  aY.setAttribute('fill', 'freeze');

    const aO = document.createElementNS(NS, 'animate');
    aO.setAttribute('attributeName', 'opacity');
    aO.setAttribute('from', '1');
    aO.setAttribute('to', '0');
    aO.setAttribute('dur', `${dur}s`);
  aO.setAttribute('begin', 'indefinite');
    aO.setAttribute('fill', 'freeze');

    const aR = document.createElementNS(NS, 'animate');
    aR.setAttribute('attributeName', 'r');
    aR.setAttribute('from', sparkle.getAttribute('r'));
    aR.setAttribute('to', '0');
    aR.setAttribute('dur', `${dur}s`);
  aR.setAttribute('begin', 'indefinite');
    aR.setAttribute('fill', 'freeze');

    sparkle.appendChild(aX);
    sparkle.appendChild(aY);
    sparkle.appendChild(aO);
    sparkle.appendChild(aR);

    if (typeof aX.beginElement === 'function') {
      setTimeout(() => { try { aX.beginElement(); aY.beginElement(); aO.beginElement(); aR.beginElement(); } catch(e){} }, Math.max(0, delay * 1000));
    }
  }

  // 後片付け
  setTimeout(() => {
    if (group.parentNode) group.parentNode.removeChild(group);
    this._activeEffects = Math.max(0, this._activeEffects - 1);
  }, congested ? 900 : 1200);
};

// 次に入力するキーのサジェスト表示
GameKeyboard.prototype.showNextKeySuggestion = function (key) {
  // 前のサジェストをクリア
  this.clearNextKeySuggestion();

  const keyElement = this.keyElements[key];
  if (!keyElement) return;

  const rect = keyElement.rect;

  // サジェスト用のハイライト効果
  rect.setAttribute('fill', '#f39c12');
  rect.setAttribute('stroke', '#e67e22');
  rect.style.filter = 'drop-shadow(0 0 8px rgba(243, 156, 18, 0.6))';

  // パルス効果用のアニメーション
  const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
  pulse.setAttribute('attributeName', 'opacity');
  pulse.setAttribute('values', '1;0.6;1');
  pulse.setAttribute('dur', '1.5s');
  pulse.setAttribute('repeatCount', 'indefinite');
  rect.appendChild(pulse);

  this.nextKey = key;
};

// 次キーサジェストをクリア
GameKeyboard.prototype.clearNextKeySuggestion = function () {
  if (this.nextKey && this.keyElements[this.nextKey]) {
    const rect = this.keyElements[this.nextKey].rect;
    rect.setAttribute('fill', '#ecf0f1');
    rect.setAttribute('stroke', '#bdc3c7');
    rect.style.filter = '';

    // パルスアニメーションを削除
    const pulse = rect.querySelector('animate');
    if (pulse) {
      pulse.remove();
    }
  }
  this.nextKey = null;
};

// 正解時のエフェクト
GameKeyboard.prototype.showCorrectKeyEffect = function (key) {
  const keyElement = this.keyElements[key];
  if (!keyElement) return;

  const rect = keyElement.rect;

  // 既存のエフェクトを強制的にクリア
  this.clearKeyEffect(key);

  // 正解時は青系
  rect.setAttribute('fill', '#2F89FF');
  rect.setAttribute('stroke', '#1F6FD6');

  keyElement.resetTimer = setTimeout(() => {
    rect.setAttribute('fill', '#ecf0f1');
    rect.setAttribute('stroke', '#bdc3c7');
    keyElement.resetTimer = null;
  }, 200);

  // 青系の花火リップル
  this.createRippleEffect(keyElement, { theme: 'correct' });

  this.createCorrectEffect(keyElement);
};

// 正解エフェクト（星や光る効果）
GameKeyboard.prototype.createCorrectEffect = function (keyElement) {
  const rect = keyElement.rect;
  const x = parseFloat(rect.getAttribute('x')) + parseFloat(rect.getAttribute('width')) / 2;
  const y = parseFloat(rect.getAttribute('y')) + parseFloat(rect.getAttribute('height')) / 2;

  // 星形のエフェクト
  const star = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  star.setAttribute('points', '0,-8 2,-2 8,-2 3,1 5,7 0,4 -5,7 -3,1 -8,-2 -2,-2');
  star.setAttribute('transform', `translate(${x}, ${y})`);
  // 正解は青い星
  star.setAttribute('fill', '#3DA5FF');
  star.setAttribute('stroke', '#2F89FF');
  star.setAttribute('opacity', '0');

  this.svg.appendChild(star);

  // 星のアニメーション
  const scaleAnim = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
  scaleAnim.setAttribute('attributeName', 'transform');
  scaleAnim.setAttribute('type', 'scale');
  scaleAnim.setAttribute('values', '0;1.5;0');
  scaleAnim.setAttribute('dur', '0.5s');
  scaleAnim.setAttribute('additive', 'sum');

  const opacityAnim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
  opacityAnim.setAttribute('attributeName', 'opacity');
  opacityAnim.setAttribute('values', '0;1;0');
  opacityAnim.setAttribute('dur', '0.5s');

  star.appendChild(scaleAnim);
  star.appendChild(opacityAnim);

  setTimeout(() => {
    if (star.parentNode) {
      star.parentNode.removeChild(star);
    }
  }, 500);
};

// 間違いキーのエフェクト
GameKeyboard.prototype.showErrorKeyEffect = function (key) {
  const keyElement = this.keyElements[key];
  if (!keyElement) return;

  const rect = keyElement.rect;

  // 既存のエフェクトを強制的にクリア
  this.clearKeyEffect(key);

  // エラー時の赤色エフェクト
  rect.setAttribute('fill', '#e74c3c');
  rect.setAttribute('stroke', '#c0392b');

  // 震えるエフェクト
  const shake = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
  shake.setAttribute('attributeName', 'transform');
  shake.setAttribute('type', 'translate');
  shake.setAttribute('values', '0,0; 2,0; -2,0; 0,0');
  shake.setAttribute('dur', '0.1s');
  shake.setAttribute('repeatCount', '3');

  keyElement.group.appendChild(shake);

  keyElement.resetTimer = setTimeout(() => {
    rect.setAttribute('fill', '#ecf0f1');
    rect.setAttribute('stroke', '#bdc3c7');
    keyElement.resetTimer = null;
    if (shake.parentNode) {
      shake.parentNode.removeChild(shake);
    }
  }, 300);

  // 赤系の花火リップル
  this.createRippleEffect(keyElement, { theme: 'error' });
};

// キーボード全体をリセット
GameKeyboard.prototype.reset = function () {
  this.clearNextKeySuggestion();

  // すべてのキーを初期状態に戻す
  Object.keys(this.keyElements).forEach(key => {
    const keyElement = this.keyElements[key];
    if (keyElement) {
      // タイマーをクリア
      if (keyElement.resetTimer) {
        clearTimeout(keyElement.resetTimer);
        keyElement.resetTimer = null;
      }
      
      // キーの外観をリセット
      keyElement.rect.setAttribute('fill', '#ecf0f1');
      keyElement.rect.setAttribute('stroke', '#bdc3c7');
      keyElement.rect.style.filter = '';
    }
  });
};

// 特定のキーのエフェクトを強制的にクリア
GameKeyboard.prototype.clearKeyEffect = function (key) {
  const keyElement = this.keyElements[key];
  if (!keyElement) return;
  
  // タイマーをクリア
  if (keyElement.resetTimer) {
    clearTimeout(keyElement.resetTimer);
    keyElement.resetTimer = null;
  }
  
  // キーの外観をリセット
  keyElement.rect.setAttribute('fill', '#ecf0f1');
  keyElement.rect.setAttribute('stroke', '#bdc3c7');
  keyElement.rect.style.filter = '';
  
  // グループ内の全てのアニメーション要素を削除
  const animations = keyElement.group.querySelectorAll('animateTransform, animate');
  animations.forEach(anim => {
    if (anim.parentNode) {
      anim.parentNode.removeChild(anim);
    }
  });
  
  // rect内のアニメーション要素も削除
  const rectAnimations = keyElement.rect.querySelectorAll('animate');
  rectAnimations.forEach(anim => {
    if (anim.parentNode) {
      anim.parentNode.removeChild(anim);
    }
  });
};