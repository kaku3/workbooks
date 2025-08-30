// REACTORゲーム
class ReactorGame extends TrainingGameBase {
    constructor() {
        super('reactor');
        this.keyboard = null;
        this.targetKey = null;
        this.previousTargetKey = null; // 前回のキーを記憶
        this.timeLeft = 30;
        this.gameTimer = null;
        this.countdownTimer = null;
        this.timerStarted = false; // タイマー開始フラグ
        this.keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        this.keyboardInitRetries = 0;
        this.maxKeyboardInitRetries = 10;
        this.keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        this.keyboardInitRetries = 0;
        this.maxKeyboardInitRetries = 10;
        
        // DOMが完全に読み込まれてからキーボード初期化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.initKeyboard(), 300);
            });
        } else {
            setTimeout(() => this.initKeyboard(), 300);
        }
    }
    
    // 既存game-keyboard.jsを流用
    initKeyboard() {
        if (typeof GameKeyboard !== 'undefined') {
            try {
                this.keyboard = new GameKeyboard('game-keyboard-container');
                
                // キーボードが正しく初期化されているか確認
                if (this.keyboard && this.keyboard.keyElements) {
                    const keyCount = Object.keys(this.keyboard.keyElements).length;
                    
                    if (keyCount > 0) {
                        return; // 成功
                    }
                }
                
            } catch (error) {
                console.error('Error creating GameKeyboard:', error);
            }
        } else {
            console.error('GameKeyboard class not available');
        }
        
        // リトライ処理
        this.keyboardInitRetries++;
        if (this.keyboardInitRetries < this.maxKeyboardInitRetries) {
            setTimeout(() => this.initKeyboard(), 500);
        } else {
            console.error('Failed to initialize keyboard after maximum retries');
            alert('キーボードの初期化に失敗しました。ページを再読み込みしてください。');
        }
    }
    
    startGame() {
        // キーボードが初期化されるまで待機
        if (!this.keyboard || !this.keyboard.keyElements) {
            setTimeout(() => this.startGame(), 200);
            return;
        }
        
        this.score = 0;
        this.timeLeft = 30;
        this.isPlaying = true;
        
        this.showScreen('game-screen');
        this.updateScoreDisplay();
        this.updateTimeDisplay();
        
        // フォーカスを確保
        if (document.body) {
            document.body.focus();
        }
        
        this.nextTarget();
        // タイマーは最初のキー押下時に開始（startGameTimerは呼ばない）
        this.timerStarted = false;
        this.playSound('bgm-game');
    }
    
    startGameTimer() {
        // 既存のタイマーをクリア
        if (this.gameTimer) clearInterval(this.gameTimer);
        if (this.countdownTimer) clearInterval(this.countdownTimer);
        
        // 0.1秒ごとにタイムを更新
        this.countdownTimer = setInterval(() => {
            this.timeLeft -= 0.1;
            this.updateTimeDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 100);
    }
    
    updateTimeDisplay() {
        const timeElement = document.getElementById('time-left');
        if (timeElement) {
            timeElement.textContent = Math.max(0, this.timeLeft).toFixed(1);
        }
    }
    
    nextTarget() {
        if (!this.keyboard) {
            console.error('Keyboard not initialized in nextTarget!');
            return;
        }
        
        if (!this.keyboard.keyElements) {
            console.error('Keyboard keyElements not available in nextTarget!');
            return;
        }
        
        // 前のキーの光る効果をクリア
        this.clearPreviousGlow();
        
        // 基本的なアルファベットキーのみに制限
        const basicKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const availableBasicKeys = [];
        
        for (let key of basicKeys) {
            if (this.keyboard.keyElements[key]) {
                availableBasicKeys.push(key);
            }
        }
        
        if (availableBasicKeys.length === 0) {
            console.error('No basic alphabet keys available!');
            return;
        }
        
        // 前回のキーを避けて選択（連続回避）
        let candidateKeys = availableBasicKeys.slice(); // コピー作成
        if (this.targetKey && candidateKeys.length > 1) {
            // 現在のキー（前回のキー）を候補から除外（ただし候補が1つだけの場合は除外しない）
            candidateKeys = candidateKeys.filter(key => key !== this.targetKey);
        }
        
        // 新しいキーを選択
        const newTargetKey = candidateKeys[Math.floor(Math.random() * candidateKeys.length)];
        
        // 前回のキーを保存（次回用）
        this.previousTargetKey = this.targetKey;
        this.targetKey = newTargetKey;
        
        // 対象キーを光らせる
        this.glowTargetKey();
    }
    
    // 前のキーの光る効果をクリア
    clearPreviousGlow() {
        if (!this.keyboard || !this.keyboard.keyElements) return;
        
        const basicKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let key of basicKeys) {
            const keyElementData = this.keyboard.keyElements[key];
            if (keyElementData && keyElementData.group) {
                const groupElement = keyElementData.group;
                try {
                    if (groupElement.classList) {
                        groupElement.classList.remove('reactor-key-glow');
                        groupElement.classList.remove('reactor-correct-effect');
                        groupElement.classList.remove('reactor-error-effect');
                    } else {
                        // classList非対応の場合
                        this.removeClassFromAttribute(groupElement, 'reactor-key-glow');
                        this.removeClassFromAttribute(groupElement, 'reactor-correct-effect');
                        this.removeClassFromAttribute(groupElement, 'reactor-error-effect');
                    }
                } catch (error) {
                    // エラーは無視（SVG要素の場合は正常）
                }
            }
        }
    }
    
    glowTargetKey() {
        if (!this.keyboard) {
            console.warn('Keyboard not initialized');
            return;
        }
        
        if (!this.keyboard.keyElements) {
            console.warn('Keyboard keyElements not available');
            return;
        }
        
        if (!this.keyboard.keyElements[this.targetKey]) {
            console.warn(`Cannot find key element for: ${this.targetKey}`);
            return;
        }
        
        const keyElement = this.keyboard.keyElements[this.targetKey];
        
        // GameKeyboardのキー要素はオブジェクト形式 {rect, text, group}
        const groupElement = keyElement.group;
        
        if (!groupElement) {
            console.error('Key group element not found:', keyElement);
            return;
        }
        
        // SVG要素にclass属性を設定
        try {
            if (groupElement.classList) {
                groupElement.classList.add('reactor-key-glow');
            } else {
                // classList非対応の場合の代替手段
                const currentClass = groupElement.getAttribute('class') || '';
                if (!currentClass.includes('reactor-key-glow')) {
                    groupElement.setAttribute('class', currentClass + ' reactor-key-glow');
                }
            }
            
        } catch (error) {
            console.error('Error applying glow effect:', error);
        }
    }
    
    clearKeyEffects() {
        if (!this.keyboard || !this.keyboard.keyElements) return;
        
        // すべてのキーからエフェクトを削除
        Object.values(this.keyboard.keyElements).forEach(keyElementData => {
            if (keyElementData && keyElementData.group) {
                const groupElement = keyElementData.group;
                try {
                    if (groupElement.classList) {
                        groupElement.classList.remove('reactor-key-glow', 'reactor-correct-effect', 'reactor-error-effect');
                    } else {
                        // classList非対応の場合
                        this.removeClassFromAttribute(groupElement, 'reactor-key-glow');
                        this.removeClassFromAttribute(groupElement, 'reactor-correct-effect');
                        this.removeClassFromAttribute(groupElement, 'reactor-error-effect');
                    }
                } catch (error) {
                    console.warn('Error clearing key effects:', error);
                }
            }
        });
    }
    
    handleKeyPress(key) {
        // 最初のキー押下時にタイマーを開始
        if (!this.timerStarted && this.isPlaying) {
            this.startGameTimer();
            this.timerStarted = true;
        }
        
        if (!this.isPlaying) {
            return;
        }
        
        if (!this.keyboard) {
            return;
        }
        
        // タイピング音再生
        const typingSounds = ['type01', 'type02', 'type03'];
        const randomSound = typingSounds[Math.floor(Math.random() * typingSounds.length)];
        this.playSound(randomSound);
        
        if (key === this.targetKey) {
            // 正解
            this.score += 10;
            this.updateScoreDisplay();
            
            // GameKeyboardのデフォルトエフェクトを無効化
            if (this.keyboard && this.keyboard.clearKeyEffect) {
                this.keyboard.clearKeyEffect(key);
            }
            
            // 正解エフェクト
            const keyElementData = this.keyboard.keyElements[key];
            if (keyElementData && keyElementData.group) {
                const groupElement = keyElementData.group;
                try {
                    if (groupElement.classList) {
                        groupElement.classList.remove('reactor-key-glow');
                        groupElement.classList.add('reactor-correct-effect');
                        setTimeout(() => groupElement.classList.remove('reactor-correct-effect'), 300);
                    } else {
                        // classList非対応の場合
                        this.removeClassFromAttribute(groupElement, 'reactor-key-glow');
                        this.addClassToAttribute(groupElement, 'reactor-correct-effect');
                        setTimeout(() => this.removeClassFromAttribute(groupElement, 'reactor-correct-effect'), 300);
                    }
                } catch (error) {
                    console.warn('Error applying correct effect:', error);
                }
            } else {
                console.warn(`Key element not found or invalid for: ${key}`, keyElementData);
            }
            
            this.playSound('se-ok');
            
            // 次のターゲットへ（即座に）
            this.nextTarget();
            
        } else {
            // 不正解 - タイム-2秒
            this.timeLeft = Math.max(0, this.timeLeft - 2);
            this.updateTimeDisplay();
            
            // GameKeyboardのデフォルトエフェクトを無効化
            if (this.keyboard && this.keyboard.clearKeyEffect) {
                this.keyboard.clearKeyEffect(key);
            }
            
            // エラーエフェクト
            const keyElementData = this.keyboard.keyElements[key];
            if (keyElementData && keyElementData.group) {
                const groupElement = keyElementData.group;
                try {
                    if (groupElement.classList) {
                        groupElement.classList.add('reactor-error-effect');
                        setTimeout(() => groupElement.classList.remove('reactor-error-effect'), 400);
                    } else {
                        // classList非対応の場合
                        this.addClassToAttribute(groupElement, 'reactor-error-effect');
                        setTimeout(() => this.removeClassFromAttribute(groupElement, 'reactor-error-effect'), 400);
                    }
                } catch (error) {
                    console.warn('Error applying error effect:', error);
                }
            } else {
                console.warn(`Key element not found or invalid for: ${key}`, keyElementData);
            }
            
            // タイム表示にペナルティエフェクト
            const timeDisplay = document.querySelector('.time-display');
            if (timeDisplay) {
                timeDisplay.classList.add('time-penalty');
                setTimeout(() => timeDisplay.classList.remove('time-penalty'), 500);
            }
            
            this.playSound('se-ng');
        }
    }
    
    endGame() {
        this.isPlaying = false;
        
        // タイマーをクリア
        if (this.gameTimer) clearInterval(this.gameTimer);
        if (this.countdownTimer) clearInterval(this.countdownTimer);
        
        // BGM停止
        this.stopSound('bgm-game');
        
        // キーボードエフェクトをクリア
        this.clearKeyEffects();
        
        // スコア保存
        this.saveScore(this.score);
        
        // 最終スコア表示
        const finalScoreElement = document.getElementById('final-score');
        if (finalScoreElement) {
            finalScoreElement.textContent = this.score;
        }
        
        // ゲームオーバー画面表示
        this.showScreen('gameover-screen');
        
        // ハイスコア更新チェック
        const isNewRecord = this.updateHighScore(this.score);
        if (isNewRecord) {
            // 新記録の場合の演出
            this.playSound('se-ok');
        }
    }
    
    // iframe内から直接呼ばれるキーハンドラー
    handleGlobalKeyDown(e) {
        // 重複処理防止
        if (e.reactorProcessed) {
            return;
        }
        e.reactorProcessed = true;
        
        // タイトル画面でのスペースキー押下でゲーム開始
        if ((this.currentScreen === 'title-screen' || this.currentScreen === 'title') && !this.isPlaying) {
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                this.startGame();
            }
            return;
        }
        
        // ゲーム中のキー処理 - currentScreenの値に応じて条件を調整
        if (this.isPlaying && (this.currentScreen === 'game-screen' || this.currentScreen === 'game')) {
            e.preventDefault();
            const key = e.key.toUpperCase();
            
            // アルファベットのみ受け付け
            if (/^[A-Z]$/.test(key)) {
                this.handleKeyPress(key);
            }
        }
    }
    
    // SVG要素のclass属性操作ヘルパーメソッド
    addClassToAttribute(element, className) {
        const currentClass = element.getAttribute('class') || '';
        if (!currentClass.includes(className)) {
            element.setAttribute('class', (currentClass + ' ' + className).trim());
        }
    }
    
    removeClassFromAttribute(element, className) {
        const currentClass = element.getAttribute('class') || '';
        const newClass = currentClass.replace(new RegExp('\\b' + className + '\\b', 'g'), '').replace(/\s+/g, ' ').trim();
        element.setAttribute('class', newClass);
    }
    
    updateGame() {
        // 定期的な更新処理（必要に応じて実装）
    }
}

// ゲーム初期化
document.addEventListener('DOMContentLoaded', () => {
    window.reactorGame = new ReactorGame();
});
