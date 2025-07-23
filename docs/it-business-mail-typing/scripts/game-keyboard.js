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

  // リップルエフェクト
  this.createRippleEffect(keyElement);
};

// リップルエフェクト作成
GameKeyboard.prototype.createRippleEffect = function (keyElement) {
  const rect = keyElement.rect;
  const x = parseFloat(rect.getAttribute('x')) + parseFloat(rect.getAttribute('width')) / 2;
  const y = parseFloat(rect.getAttribute('y')) + parseFloat(rect.getAttribute('height')) / 2;

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', '0');
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', '#3498db');
  circle.setAttribute('stroke-width', '2');
  circle.setAttribute('opacity', '0.8');

  this.svg.appendChild(circle);

  // アニメーション
  const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
  animate.setAttribute('attributeName', 'r');
  animate.setAttribute('from', '0');
  animate.setAttribute('to', '20');
  animate.setAttribute('dur', '0.3s');
  animate.setAttribute('fill', 'freeze');

  const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
  animateOpacity.setAttribute('attributeName', 'opacity');
  animateOpacity.setAttribute('from', '0.8');
  animateOpacity.setAttribute('to', '0');
  animateOpacity.setAttribute('dur', '0.3s');
  animateOpacity.setAttribute('fill', 'freeze');

  circle.appendChild(animate);
  circle.appendChild(animateOpacity);

  // アニメーション終了後に要素を削除
  setTimeout(() => {
    if (circle.parentNode) {
      circle.parentNode.removeChild(circle);
    }
  }, 300);
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

  // 正解時の緑色エフェクト
  rect.setAttribute('fill', '#27ae60');
  rect.setAttribute('stroke', '#229954');

  keyElement.resetTimer = setTimeout(() => {
    rect.setAttribute('fill', '#ecf0f1');
    rect.setAttribute('stroke', '#bdc3c7');
    keyElement.resetTimer = null;
  }, 200);

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
  star.setAttribute('fill', '#f1c40f');
  star.setAttribute('stroke', '#f39c12');
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