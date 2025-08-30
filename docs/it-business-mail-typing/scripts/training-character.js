// CHARACTER DROP ゲーム
class CharacterGame extends TrainingGameBase {
    constructor() {
        super('character');
        this.level = 1;
        this.difficulty = 'easy'; // easy, normal, hard
        this.dropSpeed = 1; // 基本落下速度 (px per frame)
        this.gameArea = null;
        this.dropContainer = null;
        this.characters = []; // 落下中の文字配列
        this.animationId = null;
        this.spawnTimer = 0;
        this.spawnInterval = 80; // フレーム数を短縮（より多くの文字）
        this.keyTypedCount = 0; // タイプしたキー数
        this.gameHeight = 500;
        this.groundHeight = 50;
        this.characterSizes = ['small', 'medium', 'large'];
        this.lastSpawnX = null; // 前回のスポーン位置
        this.lastSpawnLetter = null; // 前回の文字
        this.spawnCount = 0; // スポーン回数カウンター（レベル20超え用）
        
        // DOMが完全に読み込まれてから初期化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.initGame(), 100);
            });
        } else {
            setTimeout(() => this.initGame(), 100);
        }
    }
    
    initGame() {
        this.gameArea = document.getElementById('game-area');
        this.dropContainer = document.getElementById('drop-container');
        
        if (!this.gameArea || !this.dropContainer) {
            setTimeout(() => this.initGame(), 100);
            return;
        }
        
        // 各難易度の履歴とハイスコアを読み込み
        this.loadAllDifficultyData();
    }
    
    startGame() {
        this.score = 0;
        this.level = 1;
        this.keyTypedCount = 0;
        this.dropSpeed = 1;
        this.characters = [];
        this.spawnTimer = 0;
        this.isPlaying = true;
        this.lastSpawnX = null; // スポーン位置をリセット
        this.lastSpawnLetter = null; // 前回文字をリセット
        this.spawnCount = 0; // スポーン回数カウンターをリセット
        
        // 既存の文字をクリア
        this.dropContainer.innerHTML = '';
        
        this.showScreen('game-screen');
        this.updateDisplay();
        this.startGameLoop();
        
        this.playSound('bgm-game');
    }
    
    startGameLoop() {
        const gameLoop = () => {
            if (!this.isPlaying) return;
            
            this.updateGame();
            this.animationId = requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
    
    updateGame() {
        // 新しい文字をスポーン
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnCharacter();
            this.spawnCount++; // スポーン回数をカウント

            if(this.level < 20) {
                // 偶数レベルでは2つずつスポーン
                if (this.level % 2 === 0) {
                    this.spawnCharacter();
                }
            } else {
                // レベル20超えの追加スポーン
                // ・5レベルに1回 
                // ・スポーン2回に1回
                if (this.level % 5 === 0) {
                    
                    if (this.spawnCount % 2 === 0) {
                        this.spawnCharacter();
                    }
                }
            }
            this.spawnTimer = 0;
        }
        
        // 文字の位置更新
        this.updateCharacters();
        
        // 地面に到達した文字をチェック
        this.checkGameOver();
    }
    
    spawnCharacter() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        // 前回と異なる文字を選択
        let randomLetter;
        let attempts = 0;
        do {
            randomLetter = letters[Math.floor(Math.random() * letters.length)];
            attempts++;
        } while (randomLetter === this.lastSpawnLetter && attempts < 10);
        
        this.lastSpawnLetter = randomLetter;
        
        // レベルに応じたサイズ確率調整
        let smallThreshold, mediumThreshold;
        
        if (this.level >= 21) {
            // レベル21以上: small 85%, medium 13%, large 2%
            smallThreshold = 0.85;
            mediumThreshold = 0.98;
        } else if (this.level >= 11) {
            // レベル11-20: small 80%, medium 16%, large 4%
            smallThreshold = 0.80;
            mediumThreshold = 0.96;
        } else {
            // レベル1-10: small 75%, medium 20%, large 5% （従来通り）
            smallThreshold = 0.75;
            mediumThreshold = 0.95;
        }
        
        // サイズ選択：レベルに応じた確率調整
        const sizeRandom = Math.random();
        let randomSize;
        if (sizeRandom < smallThreshold) {
            randomSize = 'small';   // 基本の1打文字
        } else if (sizeRandom < mediumThreshold) {
            randomSize = 'medium';  // たまに出る2打文字
        } else {
            randomSize = 'large';   // 稀に出る3打文字（連打要求）
        }
        
        // 前回と離れた位置を選択
        const containerWidth = this.dropContainer.offsetWidth;
        const marginSize = 200; // 左右200pxずつマージンを確保（largeサイズ200px対応）
        const availableWidth = containerWidth - (marginSize * 2);
        
        let randomX;
        if (this.lastSpawnX !== null) {
            // 前回の位置から最低でも画面幅の1/3以上離れた位置を選択
            const minDistance = availableWidth / 3;
            let attempts = 0;
            
            do {
                randomX = Math.random() * availableWidth + marginSize;
                attempts++;
            } while (Math.abs(randomX - this.lastSpawnX) < minDistance && attempts < 20);
        } else {
            // 初回は任意の位置
            randomX = Math.random() * availableWidth + marginSize;
        }
        
        this.lastSpawnX = randomX;
        
        // サイズに応じて初期Y座標を調整（画面上部に十分な余裕を持たせる）
        const startYOffset = { small: -50, medium: -80, large: -120 };
        const initialY = startYOffset[randomSize] || -50;
        
        const character = {
            letter: randomLetter,
            size: randomSize,
            x: randomX,
            y: initialY,
            element: this.createCharacterElement(randomLetter, randomSize, randomX)
        };
        
        this.characters.push(character);
        this.dropContainer.appendChild(character.element);
    }
    
    createCharacterElement(letter, size, x) {
        const element = document.createElement('div');
        element.className = `drop-character ${size}`;
        element.textContent = letter;
        
        // 中央基準で配置するため、サイズに応じてオフセットを調整
        const sizeMap = { small: 20, medium: 60, large: 100 }; // 半径
        const offset = sizeMap[size] || 20;
        
        // サイズに応じて初期位置を調整（大きい文字ほど上からスタート）
        const startYOffset = { small: -50, medium: -80, large: -120 };
        const initialY = startYOffset[size] || -50;
        
        element.style.left = (x - offset) + 'px';
        element.style.top = initialY + 'px';
        return element;
    }
    
    updateCharacters() {
        this.characters = this.characters.filter(character => {
            character.y += this.dropSpeed;
            character.element.style.top = character.y + 'px';
            
            // 画面外に出た文字を削除
            if (character.y > this.gameHeight) {
                character.element.remove();
                return false;
            }
            return true;
        });
    }
    
    checkGameOver() {
        const groundY = this.gameHeight - this.groundHeight;
        for (let character of this.characters) {
            if (character.y >= groundY - 40) { // 文字の高さを考慮
                this.triggerGameOver(character);
                return;
            }
        }
    }
    
    triggerGameOver(character) {
        this.isPlaying = false;
        cancelAnimationFrame(this.animationId);
        
        // 爆発エフェクト
        this.showExplosionEffect(character.x, this.gameHeight - this.groundHeight);
        
        // 絶望的なゲームオーバーエフェクトを発動（ミスした文字の位置を渡す）
        this.showDespairEffect(character);
        
        this.playSound('se-ng');
        this.stopSound('bgm-game');
        
        setTimeout(() => {
            this.endGame();
        }, 3000); // エフェクト時間を延長
    }
    
    showExplosionEffect(x, y) {
        const explosion = document.createElement('div');
        explosion.className = 'explosion-effect';
        explosion.style.left = x + 'px';
        explosion.style.top = y + 'px';
        this.gameArea.appendChild(explosion);
        
        setTimeout(() => {
            explosion.remove();
        }, 1000);
    }
    
    // 絶望的なゲームオーバーエフェクト
    showDespairEffect(character) {
        const effect = document.getElementById('gameover-effect');
        if (effect) {
            // ミスした文字の接地位置を計算
            const gameAreaRect = this.gameArea.getBoundingClientRect();
            const containerRect = this.dropContainer.getBoundingClientRect();
            
            // 文字の中央X座標を取得
            const characterCenterX = character.x + (character.size === 'small' ? 20 : character.size === 'medium' ? 60 : 100);
            
            // 上半円エフェクトの位置を設定（接地点を中心に）
            const despairTop = effect.querySelector('.despair-top');
            if (despairTop) {
                // コンテナ幅に対する相対位置として計算
                const relativeX = (characterCenterX / this.dropContainer.offsetWidth) * 100;
                despairTop.style.setProperty('left', relativeX + '%', 'important');
                despairTop.style.transform = 'translateX(-50%)'; // 中央揃え
            }
            
            effect.classList.add('show');
            
            // エフェクト終了後に非表示
            setTimeout(() => {
                effect.classList.remove('show');
            }, 4000);
        }
    }
    
    handleKeyPress(key) {
        if (!this.isPlaying) return;
        
        const hitCharacter = this.findCharacterByLetter(key);
        
        if (hitCharacter) {
            this.hitCharacter(hitCharacter);
            this.keyTypedCount++;
            this.checkLevelUp();
        } else {
            this.missedKey();
        }
    }
    
    findCharacterByLetter(letter) {
        return this.characters.find(character => character.letter === letter);
    }
    
    hitCharacter(character) {
        // スコア加算（サイズに応じて）
        const scoreMap = { small: 10, medium: 20, large: 30 };
        this.score += scoreMap[character.size] || 10;
        
        // 砕け散るエフェクト
        this.showShatterEffect(character);
        
        // サイズに応じた処理
        if (character.size === 'large') {
            // 大→中：中央を保持しながらサイズ変更
            this.resizeCharacterCentered(character, 'medium');
            this.showSizeChangeEffect(character);
        } else if (character.size === 'medium') {
            // 中→小：中央を保持しながらサイズ変更
            this.resizeCharacterCentered(character, 'small');
            this.showSizeChangeEffect(character);
        } else {
            // 小→削除（確実に1回で削除）
            this.removeCharacter(character);
        }
        
        this.playSound('se-ok');
        this.updateDisplay();
    }
    
    resizeCharacterCentered(character, newSize) {
        const oldSizeMap = { small: 20, medium: 60, large: 100 };
        const newSizeMap = { small: 20, medium: 60, large: 100 };
        
        const oldRadius = oldSizeMap[character.size];
        const newRadius = newSizeMap[newSize];
        const offset = oldRadius - newRadius;
        
        // 現在の位置を取得して中央調整
        const currentLeft = parseInt(character.element.style.left);
        character.element.style.left = (currentLeft + offset) + 'px';
        
        // サイズクラスを変更
        character.size = newSize;
        character.element.className = `drop-character ${newSize}`;
    }
    
    showSizeChangeEffect(character) {
        // サイズ変更時の視覚効果 - ●全体が光る
        character.element.style.transform = 'scale(1.3)';
        character.element.style.boxShadow = '0 0 20px #ffff00';
        character.element.style.borderColor = '#ffff00';
        
        setTimeout(() => {
            character.element.style.transform = 'scale(1)';
            character.element.style.boxShadow = 'none';
            character.element.style.borderColor = '#ffffff';
        }, 300);
    }
    
    showShatterEffect(character) {
        const shatter = document.createElement('div');
        shatter.className = 'shatter-effect';
        
        // ●の中央に配置するための正確な計算
        const currentLeft = parseInt(character.element.style.left);
        const currentTop = parseInt(character.element.style.top);
        
        // 各サイズの実際の幅・高さ
        const sizeMap = { small: 40, medium: 120, large: 200 };
        const characterSize = sizeMap[character.size] || 40;
        
        // characterの中央座標を計算（左上座標 + サイズの半分）
        const characterCenterX = currentLeft + (characterSize / 2);
        const characterCenterY = currentTop + (characterSize / 2);
        
        // エフェクトコンテナをキャラクター右側に配置（パーティクル1つ分=8px右にずらし）
        shatter.style.left = (characterCenterX + 8) + 'px';
        shatter.style.top = characterCenterY + 'px';
        shatter.style.transform = 'translate(-50%, -50%)'; // 正確な中央配置
        
        // 6個の■パーティクルを作成
        for (let i = 1; i <= 6; i++) {
            const particle = document.createElement('div');
            particle.className = `shatter-particle shatter-particle-${i}`;
            particle.textContent = '■';
            shatter.appendChild(particle);
        }
        
        this.gameArea.appendChild(shatter);
        
        setTimeout(() => {
            shatter.remove();
        }, 1000);
    }
    
    removeCharacter(character) {
        const index = this.characters.indexOf(character);
        if (index !== -1) {
            this.characters.splice(index, 1);
            character.element.remove();
        }
    }
    
    missedKey() {
        // すべての文字を10px下に落下
        this.characters.forEach(character => {
            character.y += 10;
            character.element.style.top = character.y + 'px';
        });
        
        this.playSound('se-ng');
    }
    
    checkLevelUp() {
        // 難易度に応じた基準レベル設定
        let baseLevel;
        switch(this.difficulty) {
            case 'easy': baseLevel = 1; break;
            case 'normal': baseLevel = 10; break;
            case 'hard': baseLevel = 20; break;
            default: baseLevel = 1;
        }
        
        const newLevel = Math.floor(this.keyTypedCount / 10) + baseLevel;
        if (newLevel > this.level) {
            const oldLevel = this.level;
            this.level = newLevel;
            this.updateDropSpeed();
            this.updateDisplay();
            
            // レベルアップエフェクト表示
            this.showLevelUpEffect();
            
            // レベルアップサウンド（se-okを使用）
            this.playSound('se-ok');
        }
    }
    
    updateDropSpeed() {
        // 基本速度を4%増加（レベル25で頭打ち）
        const effectiveLevel = Math.min(this.level, 25);
        this.dropSpeed = 1 + (effectiveLevel - 1) * 0.03;
        
        // レベルが4の倍数の時、10%減速
        if (this.level % 4 === 0) {
            this.dropSpeed *= 0.92;
        }
        
        // スポーン間隔を太鼓の達人風に調整（より多くの文字を画面に）
        // 基本60フレーム間隔から開始し、レベルアップで短縮
        this.spawnInterval = Math.max(30, 80 - this.level * 2);
    }
    
    updateDisplay() {
        const levelElement = document.getElementById('current-level');
        const scoreElement = document.getElementById('current-score');
        
        if (levelElement) levelElement.textContent = this.level;
        if (scoreElement) scoreElement.textContent = this.score;
        
        // スコア増加アニメーション
        if (scoreElement && scoreElement.parentElement) {
            scoreElement.parentElement.classList.add('score-up');
            setTimeout(() => {
                scoreElement.parentElement.classList.remove('score-up');
            }, 300);
        }
    }
    
    endGame() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // 全ての文字をクリア
        this.characters = [];
        this.dropContainer.innerHTML = '';
        
        this.saveScore(this.score);
        // 難易度別にスコア保存
        this.saveScoreForDifficulty(this.difficulty, this.score);
        
        document.getElementById('final-score').textContent = this.score;
        this.showScreen('gameover-screen');
        
        this.stopSound('bgm-game');
    }
    
    // iframe内から直接呼ばれるキーハンドラー（REACTORモードと同じ実装）
    handleGlobalKeyDown(e) {
        // 重複処理防止
        if (e.characterProcessed) {
            return;
        }
        e.characterProcessed = true;
        
        // タイトル画面でのスペースキー無効化（カードクリック方式に変更）
        // ゲーム中の処理のみ有効
        
        // ゲーム中のキー処理 - currentScreenの値に応じて条件を調整
        if (this.isPlaying && (this.currentScreen === 'game-screen' || this.currentScreen === 'game')) {
            e.preventDefault();
            
            // アルファベットキーのみ処理
            const key = e.key.toUpperCase();
            if (/^[A-Z]$/.test(key)) {
                this.handleKeyPress(key);
            }
        }
    }
    
    // タイトルに戻る（グラフ更新付き）
    goToTitle() {
        this.stopSound('bgm-game');
        this.isPlaying = false;
        this.showScreen('title-screen');
        this.loadAllDifficultyData(); // 全難易度のデータを更新
    }
    
    // 全難易度のデータ読み込み
    loadAllDifficultyData() {
        ['easy', 'normal', 'hard'].forEach(difficulty => {
            this.loadHighScoreForDifficulty(difficulty);
            this.loadHistoryForDifficulty(difficulty);
        });
    }
    
    // 難易度別ハイスコア読み込み
    loadHighScoreForDifficulty(difficulty) {
        const key = `training_character_${difficulty}_high_score`;
        const highScore = parseInt(localStorage.getItem(key) || '0', 10);
        const scoreElement = document.getElementById(`high-score-${difficulty}`);
        if (scoreElement) {
            scoreElement.textContent = highScore;
        }
        return highScore;
    }
    
    // 難易度別履歴読み込みとグラフ描画
    loadHistoryForDifficulty(difficulty) {
        const key = `training_character_${difficulty}_history`;
        const historyJson = localStorage.getItem(key);
        const history = historyJson ? JSON.parse(historyJson) : [];
        
        console.log(`${difficulty}の履歴データを読み込み:`, history);
        console.log(`${difficulty}の履歴データ数:`, history.length);
        
        // グラフを描画（データが2個以上ある場合のみ）
        const canvas = document.getElementById(`score-graph-${difficulty}`);
        if (canvas && history.length >= 2) {
            this.drawScoreGraph(canvas, history);
        } else if (canvas && history.length === 1) {
            // データが1個の場合は単一ポイント表示
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#4299e1';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Score: ${history[0].score}`, canvas.width / 2, canvas.height / 2);
        } else if (canvas) {
            // データが少ない場合は「No Data」を表示
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No Data', canvas.width / 2, canvas.height / 2);
        }
        
        return history;
    }
    
    // グラフ描画メソッド（training-commonから移植・調整）
    drawScoreGraph(canvas, history) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40; // Y軸ラベル用に左パディングを増加
        const rightPadding = 10;
        
        ctx.clearRect(0, 0, width, height);
        
        if (history.length < 2) return;
        
        // デバッグ：履歴データをコンソールに出力
        console.log('グラフ描画データ:', history.map(h => h.score));
        console.log('履歴データの最初の3つ:', history.slice(0, 3));
        
        // スコア値の配列を取得
        const scores = history.map(h => {
            const score = typeof h.score === 'number' ? h.score : parseInt(h.score || 0, 10);
            console.log('スコア変換:', h.score, '->', score);
            return score;
        });
        
        // 最大値・最小値を取得
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        const range = maxScore - minScore || 1;
        
        console.log('変換後スコア配列:', scores);
        console.log('最大スコア:', maxScore, '最小スコア:', minScore);
        
        // Y軸の範囲を適切に設定（minScoreが0でない場合も考慮）
        let displayMinScore = minScore;
        let displayMaxScore = maxScore;
        
        // 範囲が小さい場合は少し余裕を持たせる
        if (range < 100) {
            const margin = Math.max(10, range * 0.1);
            displayMinScore = Math.max(0, minScore - margin);
            displayMaxScore = maxScore + margin;
        }
        
        const displayRange = displayMaxScore - displayMinScore;
        
        console.log(`スコア範囲: ${displayMinScore} - ${displayMaxScore} (range: ${displayRange})`);
        
        // グリッド＆Y軸ラベル描画
        ctx.strokeStyle = '#333';
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 4; i++) {
            const y = padding + (height - padding - 10) * i / 4;
            const scoreValue = Math.round(displayMaxScore - (displayMaxScore - displayMinScore) * i / 4);
            
            // グリッドライン
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - rightPadding, y);
            ctx.stroke();
            
            // Y軸ラベル
            ctx.fillText(scoreValue.toString(), padding - 5, y + 4);
        }
        
        // ライン描画
        ctx.strokeStyle = '#4299e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const recent = history.slice(0, 10).reverse(); // 最新10回分を逆順にして右端が最新に
        recent.forEach((entry, i) => {
            const x = padding + (width - padding - rightPadding) * i / Math.max(1, recent.length - 1);
            const entryScore = typeof entry.score === 'number' ? entry.score : parseInt(entry.score || 0, 10);
            const normalizedScore = displayRange > 0 ? (entryScore - displayMinScore) / displayRange : 0.5;
            const y = (height - 10) - (height - padding - 10) * normalizedScore;
            
            console.log(`ポイント${i}: score=${entryScore}, normalized=${normalizedScore}, y=${y}`);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // ポイント描画
        ctx.fillStyle = '#4299e1';
        recent.forEach((entry, i) => {
            const x = padding + (width - padding - rightPadding) * i / Math.max(1, recent.length - 1);
            const entryScore = typeof entry.score === 'number' ? entry.score : parseInt(entry.score || 0, 10);
            const normalizedScore = displayRange > 0 ? (entryScore - displayMinScore) / displayRange : 0.5;
            const y = (height - 10) - (height - padding - 10) * normalizedScore;
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // 最新スコアをハイライト表示
        if (recent.length > 0) {
            const lastEntry = recent[recent.length - 1]; // reverse後は末尾が最新データ
            const x = padding + (width - padding - rightPadding) * (recent.length - 1) / Math.max(1, recent.length - 1); // 右端
            const lastScore = typeof lastEntry.score === 'number' ? lastEntry.score : parseInt(lastEntry.score || 0, 10);
            const normalizedScore = displayRange > 0 ? (lastScore - displayMinScore) / displayRange : 0.5;
            const y = (height - 10) - (height - padding - 10) * normalizedScore;
            
            // 最新ポイントを大きく表示
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
            
            // スコアを表示
            ctx.fillStyle = '#333';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(lastScore.toString(), x, y - 10);
        }
    }
    
    // 難易度別データ保存（ゲーム終了時）
    saveScoreForDifficulty(difficulty, score) {
        console.log(`${difficulty}でスコア${score}を保存中...`);
        
        // ハイスコア更新
        const highScoreKey = `training_character_${difficulty}_high_score`;
        const currentHigh = parseInt(localStorage.getItem(highScoreKey) || '0', 10);
        if (score > currentHigh) {
            localStorage.setItem(highScoreKey, score.toString());
            console.log(`${difficulty}のハイスコアを${score}に更新`);
        }
        
        // 履歴追加
        const historyKey = `training_character_${difficulty}_history`;
        const historyJson = localStorage.getItem(historyKey);
        const history = historyJson ? JSON.parse(historyJson) : [];
        
        const newEntry = {
            score: score,
            level: this.level,
            date: new Date().toISOString().slice(0, 10)
        };
        
        history.unshift(newEntry);
        
        if (history.length > 50) history.pop();
        localStorage.setItem(historyKey, JSON.stringify(history));
        
        console.log(`${difficulty}の履歴に追加:`, newEntry);
        console.log(`${difficulty}の全履歴:`, history);
    }
    
    // 難易度選択画面を表示（不要になったが残しておく）
    showDifficultySelection() {
        this.showScreen('difficulty-screen');
    }
    
    // 難易度を設定してゲームを開始
    startGameWithDifficulty(difficulty) {
        this.difficulty = difficulty;
        
        // 難易度に応じた初期レベル設定
        switch(difficulty) {
            case 'easy':
                this.level = 1;
                break;
            case 'normal':
                this.level = 10;
                break;
            case 'hard':
                this.level = 20;
                break;
        }
        
        this.startGame();
    }
    
    // レベルアップエフェクトを表示
    showLevelUpEffect() {
        const effect = document.getElementById('levelup-effect');
        const levelNum = document.getElementById('levelup-level-num');
        
        if (effect && levelNum) {
            levelNum.textContent = this.level;
            effect.classList.add('show');
            
            // 2秒後にエフェクトを非表示
            setTimeout(() => {
                effect.classList.remove('show');
            }, 2000);
        }
    }
}

// ゲームインスタンス作成
document.addEventListener('DOMContentLoaded', () => {
    window.characterGame = new CharacterGame();
    
    // 難易度カードのクリックイベント
    document.querySelectorAll('.difficulty-card').forEach(card => {
        card.addEventListener('click', () => {
            const difficulty = card.dataset.difficulty;
            window.characterGame.startGameWithDifficulty(difficulty);
        });
    });
    
    // STARTボタンのクリックイベント（カード内のボタン）
    document.querySelectorAll('.start-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // カードのクリックイベントと重複しないように
            const card = btn.closest('.difficulty-card');
            const difficulty = card.dataset.difficulty;
            window.characterGame.startGameWithDifficulty(difficulty);
        });
    });
});
