// 両モード共通処理
class TrainingGameBase {
    constructor(gameType) {
        this.gameType = gameType;
        this.currentScreen = 'title';
        this.score = 0;
        this.isPlaying = false;
        this.soundManager = null;
        this.initSoundManager();
        this.initializeEventListeners();
        this.loadHighScore();
        this.loadHistory();
    }
    
    // サウンドマネージャー初期化
    initSoundManager() {
        if (typeof SoundManager !== 'undefined') {
            this.soundManager = new SoundManager();
            
            // 必要なサウンドをロード
            this.soundManager.load('bgm-game', 'sounds/bgm-game.mp3', true);
            this.soundManager.load('se-ok', 'sounds/se-ok.mp3');
            this.soundManager.load('se-ng', 'sounds/se-ng.mp3');
            this.soundManager.load('type01', 'sounds/type01.mp3');
            this.soundManager.load('type02', 'sounds/type02.mp3');
            this.soundManager.load('type03', 'sounds/type03.mp3');
        }
    }
    
    // 既存sound-manager.jsを流用
    playSound(soundName) {
        if (this.soundManager) {
            this.soundManager.play(soundName);
        }
    }
    
    stopSound(soundName) {
        if (this.soundManager) {
            this.soundManager.stop(soundName);
        }
    }
    
    // LocalStorage活用（既存パターン流用）
    saveScore(score) {
        const key = `training_${this.gameType}_history`;
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        history.unshift({
            score: score,
            timestamp: new Date().toISOString(),
            date: new Date().toISOString().slice(0, 10)
        });
        if (history.length > 50) history.pop();
        localStorage.setItem(key, JSON.stringify(history));
        
        // ハイスコア更新チェック
        this.updateHighScore(score);
    }
    
    // ハイスコア管理
    loadHighScore() {
        const key = `training_${this.gameType}_high_score`;
        const highScore = parseInt(localStorage.getItem(key) || '0', 10);
        const scoreElement = document.getElementById('high-score');
        if (scoreElement) {
            scoreElement.textContent = highScore;
        }
        return highScore;
    }
    
    updateHighScore(score) {
        const key = `training_${this.gameType}_high_score`;
        const currentHigh = parseInt(localStorage.getItem(key) || '0', 10);
        if (score > currentHigh) {
            localStorage.setItem(key, score.toString());
            const scoreElement = document.getElementById('high-score');
            if (scoreElement) {
                scoreElement.textContent = score;
            }
            return true; // 新記録
        }
        return false;
    }
    
    // 履歴読み込みとグラフ描画
    loadHistory() {
        const key = `training_${this.gameType}_history`;
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        
        const canvas = document.getElementById('score-graph');
        if (!canvas) return;
        
        if (history.length === 0) {
            // 履歴がない場合はcanvasを非表示
            canvas.style.display = 'none';
        } else {
            // 履歴がある場合はcanvasを表示してグラフを描画
            canvas.style.display = 'block';
            this.drawScoreGraph(history.slice(0, 20).reverse()); // 最新20件を古い順で描画
        }
    }
    
    drawScoreGraph(scores) {
        const canvas = document.getElementById('score-graph');
        if (!canvas || scores.length === 0) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 背景を描画（データがある場合は枠付き）
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, width, height);
        
        // 枠を描画
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, width, height);
        
        // グラフ描画
        if (scores.length > 1) {
            const maxScore = Math.max(...scores.map(s => s.score));
            const minScore = Math.min(...scores.map(s => s.score));
            const scoreRange = maxScore - minScore || 1;
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            scores.forEach((score, index) => {
                const x = (index / Math.max(1, scores.length - 1)) * (width - 20) + 10;
                const y = height - 10 - ((score.score - minScore) / scoreRange) * (height - 20);
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // データポイント描画
            ctx.fillStyle = '#00ff00';
            scores.forEach((score, index) => {
                const x = (index / Math.max(1, scores.length - 1)) * (width - 20) + 10;
                const y = height - 10 - ((score.score - minScore) / scoreRange) * (height - 20);
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
    }
    
    // 画面切り替え
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
        this.currentScreen = screenId;
    }
    
    // イベントリスナー初期化
    initializeEventListeners() {
        // キーボードイベント（windowとdocumentの両方に登録）
        document.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));
        window.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));
        
        // フォーカス確保
        if (document.body) {
            document.body.tabIndex = -1;
            document.body.focus();
        }
        
        // ボタンイベント
        document.addEventListener('click', (e) => {
            if (e.target.id === 'title-btn') {
                this.goToTitle();
            } else if (e.target.id === 'retry-btn') {
                this.startGame();
            }
        });
        
        // 画面クリック時にフォーカスを確保
        document.addEventListener('click', () => {
            if (document.body) {
                document.body.focus();
            }
        });
    }
    
    // グローバルキーダウンハンドラー
    handleGlobalKeyDown(e) {
        // タイトル画面でのキー押下でゲーム開始
        if (this.currentScreen === 'title' && !this.isPlaying) {
            // REACTORモードはスペースキーのみ、CHARACTER DROPモードもスペースキーのみ
            if (e.key === ' ') {
                e.preventDefault();
                this.startGame();
            }
            return;
        }
        
        // ゲーム中のキー処理
        if (this.isPlaying && this.currentScreen === 'game') {
            e.preventDefault();
            this.handleGameKeyDown(e);
        }
    }
    
    // ゲーム中のキーダウン処理
    handleGameKeyDown(e) {
        const key = e.key.toUpperCase();
        
        // アルファベットのみ受け付け（数字や特殊キーは除外）
        if (/^[A-Z]$/.test(key)) {
            this.handleKeyPress(key);
        }
    }
    
    // タイトルに戻る
    goToTitle() {
        this.stopSound('bgm-game');
        this.isPlaying = false;
        this.showScreen('title-screen');
        this.loadHistory(); // グラフを更新
    }
    
    // スコア表示更新
    updateScoreDisplay() {
        const scoreElement = document.getElementById('current-score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
            
            // スコアアップアニメーション
            const display = scoreElement.parentElement;
            display.classList.add('score-up');
            setTimeout(() => display.classList.remove('score-up'), 300);
        }
    }
    
    // 抽象メソッド（各ゲームで実装）
    startGame() { throw new Error('startGame must be implemented'); }
    updateGame() { throw new Error('updateGame must be implemented'); }
    endGame() { throw new Error('endGame must be implemented'); }
    handleKeyPress(key) { throw new Error('handleKeyPress must be implemented'); }
}
