// --- 時給処理 ---
const WAGE_KEY = 'wage';
const WAGE_DATE_KEY = 'wage_last_login';
const WAGE_PLAY_KEY = 'wage_play_count';

function getWage() {
    // 初期値400円
    const val = localStorage.getItem(WAGE_KEY);
    return val === null ? 400 : parseInt(val, 10);
}
function setWage(val) {
    localStorage.setItem(WAGE_KEY, val);
    const el = document.getElementById('wage-value');
    if (el) el.textContent = val;
    // 人月単価も更新（万円単位、切り捨て）
    const elm = document.getElementById('wage-monthly');
    if (elm) {
        const man = Math.floor(val * 160) / 10000;
        elm.textContent = man.toFixed(1).replace(/\.0$/, '') + '万';
    }
}
function addWage(val) {
    setWage(getWage() + val);
}

// デイリーログイン昇給
function dailyLoginWageUp() {
    const today = new Date().toISOString().slice(0,10);
    if (localStorage.getItem(WAGE_DATE_KEY) !== today) {
        addWage(1);
        localStorage.setItem(WAGE_DATE_KEY, today);
        
        // タイムカード記録（出勤時刻を記録）
        recordTimecard('login');
        
        // ログインボーナス発生フラグを設定
        localStorage.setItem('show_timecard_on_startup', 'true');
    }
}

// 10プレイごと昇給
function playCountWageUp() {
    let cnt = parseInt(localStorage.getItem(WAGE_PLAY_KEY) || '0', 10) + 1;
    localStorage.setItem(WAGE_PLAY_KEY, cnt);
    if (cnt % 10 === 0) addWage(1);
}

// ランク昇給
// 職能給：お題ごとに最高ランクを保存し、ランクが上がった時だけ加算
function rankWageUp(rank) {
    const table = { 'E':10, 'D':20, 'C':50, 'B':100, 'A':150, 'S':200 };
    if (!currentQuestion || !currentQuestion.id) return;
    const key = 'wage_rank_' + currentQuestion.id;
    const prev = localStorage.getItem(key) || 'E';
    const rankOrder = ['E','D','C','B','A','S'];
    if (rankOrder.indexOf(rank) > rankOrder.indexOf(prev)) {
        if (table[rank]) addWage(table[rank]);
        localStorage.setItem(key, rank);
    }
    // 初回クリア時も加算
    if (prev === 'E' && rank !== 'E') {
        localStorage.setItem(key, rank);
    }
}

// 初期化

// 初回ログイン時ガイド表示 & BGMロード
document.addEventListener('DOMContentLoaded', () => {
    setWage(getWage());
    
    // タイムカードの月表示を初期化
    currentTimecardMonth = new Date().getMonth();
    currentTimecardYear = new Date().getFullYear();
    
    dailyLoginWageUp();

    // BGMロード（重複ロード防止）
    if (window.soundManager) {
        if (!window.soundManager.sounds['bgm']) {
            window.soundManager.load('bgm', 'sounds/bgm.mp3', true);
        }
        // タイピングSEロード（重複ロード防止）
        if (!window.soundManager.sounds['type01']) {
            window.soundManager.loadTypingSe();
        }
        // se-ok, se-ngロード
        if (!window.soundManager.sounds['se-ok']) {
            window.soundManager.load('se-ok', 'sounds/se-ok.mp3');
        }
        if (!window.soundManager.sounds['se-ng']) {
            window.soundManager.load('se-ng', 'sounds/se-ng.mp3');
        }
        // result-s～result-eロード
        const resultSounds = ['result-s','result-a','result-b','result-c','result-d','result-e'];
        resultSounds.forEach(function(name) {
            if (!window.soundManager.sounds[name]) {
                window.soundManager.load(name, 'sounds/' + name + '.mp3');
            }
        });
    }

    // 初回ログイン判定
    if (!localStorage.getItem('guide_shown')) {
        showGuideModal();
        localStorage.setItem('guide_shown', '1');
    }
});

// guide.html を iframe で表示するモーダル生成・表示
function showGuideModal() {
    // 既に存在する場合は何もしない
    if (document.getElementById('guide-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'guide-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';

    const inner = document.createElement('div');
    inner.style.background = '#fff';
    inner.style.borderRadius = '8px';
    inner.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
    inner.style.overflow = 'hidden';
    inner.style.width = '96vw';
    inner.style.height = '96vh';
    inner.style.maxWidth = '1200px';
    inner.style.maxHeight = '100vh';
    inner.style.position = 'relative';


    const closeBtn = document.createElement('button');
    closeBtn.textContent = '開始する';
    closeBtn.style.position = 'absolute';
    closeBtn.style.right = '24px';
    closeBtn.style.bottom = '24px';
    closeBtn.style.zIndex = '10';
    closeBtn.style.background = '#1976d2';
    closeBtn.style.color = '#fff';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.padding = '12px 32px';
    closeBtn.style.fontSize = '1.1em';
    closeBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
        document.body.removeChild(modal);
        
        // 初回起動時のフロー: 登場人物設定 → タイムカード
        setTimeout(() => {
            showInitialSetup();
        }, 100);
    };

    const iframe = document.createElement('iframe');
    iframe.src = 'guide.html';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    inner.appendChild(closeBtn);
    inner.appendChild(iframe);
    modal.appendChild(inner);
    document.body.appendChild(modal);
}

// ゲーム終了時に呼び出す処理例
function onGameFinish(rank) {
    playCountWageUp();
    rankWageUp(rank);
}
// --- ここまで時給処理 ---
let currentQuestion = null;
let gameStartTime;
let timerInterval;

let typedChars = 0;
let correctChars = 0;
let incorrectChars = 0;
let currentLineIndex = 0;
let lines = [];

const timeEl = document.getElementById('time');
// const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const replySubjectGameEl = document.getElementById('reply-subject-game');
const gameReplyBodyEl = document.getElementById('game-reply-body');
const inputArea = document.getElementById('input-area');

const HIGHSCORE_KEY = 'typingGameHighScore';
const HISTORY_KEY = 'typingGameHistory';

function prepareGame() {
    if (!currentQuestion) return;

    const userInfo = loadUserInfo() || {};
    const replyText = replacePlaceholders(currentQuestion.to_customer.body, userInfo);
    replySubjectGameEl.textContent = currentQuestion.to_customer.subject;

    // 行ごとに分割
    lines = replyText.split(/\r?\n/);
    currentLineIndex = 0;

    // ゲーム用の表示を生成（各行をdivでラップ）
    gameReplyBodyEl.innerHTML = lines.map((line, idx) => {
        let style = '';
        // 最初は現在の行以外は非表示
        if (idx !== 0) style = ' style="display:none"';
        if (line === '') {
            return `<div class="game-line empty-line" data-line="${idx}"${style}><span class="empty-mark">↵</span></div>`;
        } else {
            return `<div class="game-line" data-line="${idx}"${style}>` +
                line.split('').map(char => `<span class="untyped">${char}</span>`).join('') +
                `</div>`;
        }
    }).join('');
    // スクロール位置をリセット
    gameReplyBodyEl.scrollTop = gameReplyBodyEl.scrollHeight;

    resetGameStats();
    inputArea.value = '';
    inputArea.setAttribute('maxlength', 200);
    // プレースホルダを1行目用に
    inputArea.placeholder = '１行目を入力してスタート';
    // 入力欄をリセット（前回のinputArea参照をクリア）
    if (window.inputArea && window.inputArea !== inputArea) {
        window.inputArea.value = '';
        window.inputArea.placeholder = '１行目を入力してスタート';
    }
    setTimeout(() => inputArea.focus(), 100);
}


function startGame() {
    if (gameStartTime) return; // ゲームが既に始まっている場合は何もしない
    gameStartTime = new Date();


    // 1文字目入力時にBGM再生＆タイピングSEコンボリセット
    if (window.soundManager) {
        window.soundManager.play('bgm');
        window.soundManager.resetTypingSeCombo();
    }

    timerInterval = setInterval(updateTimer, 100);
}


function stopGame() {
    clearInterval(timerInterval);

    timerInterval = null;

    if (window.soundManager) {
        window.soundManager.stop('bgm');
    }    
}


function resetGameStats() {
    stopGame();
    gameStartTime = null;
    typedChars = 0;
    correctChars = 0;
    incorrectChars = 0;
    currentLineIndex = 0; // ここでリセット
    timeEl.textContent = '0.00';
    // wpmEl.textContent = '0';
    accuracyEl.textContent = '100';
    inputArea.value = '';
    inputArea.disabled = false; // 入力エリアを有効化
    inputArea.classList.remove('incorrect-line');
}


function updateTimer() {
    if (!gameStartTime) return;
    const elapsedTime = (new Date() - gameStartTime) / 1000;
    timeEl.textContent = elapsedTime.toFixed(2);
    updateTimeProgressBar(elapsedTime);
    // calculateWPM(elapsedTime); // WPMは非表示
}

// 時間経過バーの更新
function updateTimeProgressBar(elapsedTime) {
    const bar = document.getElementById('time-progress-bar');
    const labels = document.querySelectorAll('#time-progress-labels .rank-label');
    if (!bar || !currentQuestion || !window.QUESTION_RATINGS) {
        // ゲーム未開始時も、currentQuestionがあれば閾値位置にラベルを配置
        if (bar) bar.style.width = '0%';
        const labelParent = document.getElementById('time-progress-labels');
        const labels = document.querySelectorAll('#time-progress-labels .rank-label');
        if (labelParent) labelParent.style.position = 'relative';
        // currentQuestionがあれば閾値位置、なければ左端
        let qRating = null;
        if (window.QUESTION_RATINGS && currentQuestion) {
            qRating = window.QUESTION_RATINGS.find(q => q.id === currentQuestion.id);
        }
        if (qRating && qRating.ratings && labels.length === qRating.ratings.length) {
            const maxTime = qRating.ratings[qRating.ratings.length - 1].time;
            qRating.ratings.forEach((r, i) => {
                const pos = Math.min(100, (r.time / maxTime) * 100);
                labels[i].style.position = 'absolute';
                labels[i].style.left = `calc(${pos}% - 0.7em)`;
                labels[i].style.transform = 'none';
                labels[i].style.minWidth = '1.4em';
                labels[i].style.textAlign = 'center';
            });
        } else if (labels.length > 0) {
            // fallback: 全部左端
            for (let i = 0; i < labels.length; i++) {
                labels[i].style.position = 'absolute';
                labels[i].style.left = `calc(0% - 0.7em)`;
                labels[i].style.transform = 'none';
                labels[i].style.minWidth = '1.4em';
                labels[i].style.textAlign = 'center';
            }
        }
        return;
    }
    // 設問IDから評価データ取得
    const qRating = window.QUESTION_RATINGS.find(q => q.id === currentQuestion.id);
    if (!qRating || !qRating.ratings) return;
    // Eランクの最大時間
    const maxTime = qRating.ratings[qRating.ratings.length - 1].time;
    // 進捗率
    let percent = Math.min(100, (elapsedTime / maxTime) * 100);
    bar.style.width = percent + '%';
    // ランクラベルの位置を動的に配置
    if (labels.length === qRating.ratings.length) {
        qRating.ratings.forEach((r, i) => {
            const pos = Math.min(100, (r.time / maxTime) * 100);
            labels[i].style.position = 'absolute';
            labels[i].style.left = `calc(${pos}% - 0.7em)`;
            labels[i].style.transform = 'none';
            labels[i].style.minWidth = '1.4em';
            labels[i].style.textAlign = 'center';
        });
        // 親divのpositionをrelativeに
        const labelParent = document.getElementById('time-progress-labels');
        if (labelParent) labelParent.style.position = 'relative';
    }
}



function calculateAccuracy() {
    const totalTyped = correctChars + incorrectChars;
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
    accuracyEl.textContent = accuracy;
    return accuracy;
}


window.handleTyping = function(e) {
    const gameModal = document.getElementById('game-modal');
    if (!currentQuestion || gameModal.style.display !== 'flex') return false;

    if (!gameStartTime) {
        startGame();
        if (currentLineIndex === 0) {
            inputArea.placeholder = '２行目を入力';
        }
    } else {
        inputArea.placeholder = `${currentLineIndex + 1}行目を入力`;
    }

    // 必要最小限のDOM更新のみ
    const currentLine = lines[currentLineIndex] || '';
    const typedText = (window.inputArea && window.inputArea.value !== undefined) ? window.inputArea.value : inputArea.value;
    const lineDivs = gameReplyBodyEl.querySelectorAll('.game-line');
    if (!lineDivs[currentLineIndex]) return false;
    const currentDiv = lineDivs[currentLineIndex];
    const spans = currentDiv.querySelectorAll('span');

    // 入力中の行のspanのみclassを最小限で更新（完全一致・未入力は一括処理）
    typedChars = typedText.length;
    let currentCorrectCount = 0;
    let hasMistype = false;
    if (typedText === currentLine && currentLine.length > 0) {
        // 完全一致なら全span correct
        for (let i = 0; i < spans.length; i++) {
            if (spans[i].className !== 'correct') spans[i].className = 'correct';
        }
        currentCorrectCount = currentLine.length;
    } else if (typedText.length === 0 && currentLine.length > 0) {
        // 未入力なら全span untyped
        for (let i = 0; i < spans.length; i++) {
            if (spans[i].className !== 'untyped') spans[i].className = 'untyped';
        }
        currentCorrectCount = 0;
    } else {
        // 差分のみclass更新
        for (let i = 0; i < currentLine.length; i++) {
            if (i < typedText.length) {
                if (typedText[i] === currentLine[i]) {
                    if (spans[i].className !== 'correct') spans[i].className = 'correct';
                    currentCorrectCount++;
                } else {
                    if (spans[i].className !== 'incorrect') spans[i].className = 'incorrect';
                    hasMistype = true;
                }
            } else {
                if (spans[i].className !== 'untyped') spans[i].className = 'untyped';
            }
        }
    }
    correctChars = currentCorrectCount;
    incorrectChars = typedChars - currentCorrectCount;
    calculateAccuracy();

    // 行の表示・class切り替えは必要な行のみ
    // 前の行（currentLineIndex-1）、現在行、次の行（currentLineIndex+1）だけを更新
    for (let idx = 0; idx < lineDivs.length; idx++) {
        const div = lineDivs[idx];
        if (idx < currentLineIndex - 1 || idx > currentLineIndex + 1) continue; // それ以外は何もしない
        if (idx < currentLineIndex) {
            if (div.style.display !== '') div.style.display = '';
            if (!div.classList.contains('confirmed')) div.classList.add('confirmed');
            div.classList.remove('current');
        } else if (idx === currentLineIndex) {
            if (div.style.display !== '') div.style.display = '';
            if (!div.classList.contains('current')) div.classList.add('current');
            div.classList.remove('confirmed');
        } else if (idx === currentLineIndex + 1) {
            if (div.style.display !== 'none') div.style.display = 'none';
            div.classList.remove('confirmed');
            div.classList.remove('current');
        }
        div.style.marginTop = '';
        div.style.marginBottom = '';
    }

    // order調整も必要な行のみ
    // 入力済み行と現在行だけを下に寄せる
    const shown = Array.from(lineDivs).filter((div, idx) => idx <= currentLineIndex);
    const total = shown.length;
    shown.forEach((div, i) => {
        const newOrder = i + (lineDivs.length - total);
        if (div.style.order != newOrder) div.style.order = newOrder;
    });

    // 入力行が見切れた場合はスクロール（更新時のみ）
    if (e && e.type === 'keydown' && e.key === 'Enter') {
        currentDiv.scrollIntoView({block: 'end', behavior: 'smooth'});
    }
    return hasMistype;
}


// 指定した設問ID・経過時間からランク・コメントを取得
function getRatingByQuestionIdAndTime(questionId, elapsedTime) {
    if (!window.QUESTION_RATINGS) return { rank: 'E', comment: '評価データ未設定' };
    const qRating = window.QUESTION_RATINGS.find(q => q.id === questionId);
    if (!qRating || !qRating.ratings) return { rank: 'E', comment: '評価データ未設定' };
    // ratingsはtime昇順なので、最初に条件を満たしたものを返す
    for (const r of qRating.ratings) {
        if (elapsedTime <= r.time) {
            return { rank: r.rank, comment: r.comment };
        }
    }
    // どれにも該当しなければ一番下のランク
    const last = qRating.ratings[qRating.ratings.length - 1];
    return { rank: last.rank, comment: last.comment };
}

function finishGame() {
    // 退勤時刻を記録
    recordTimecard('logout');

    // BGM停止
    if (window.soundManager) {
        window.soundManager.stop('bgm');
    }

    stopGame();
    inputArea.disabled = true; // 入力エリアを無効化
    // 送信ボタンを有効化
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) sendBtn.disabled = false;

    const elapsedTime = (new Date() - gameStartTime) / 1000;
    const finalAccuracy = calculateAccuracy();
    // 新ロジック: 設問ID・経過時間からランク・コメント取得
    const ratingResult = getRatingByQuestionIdAndTime(currentQuestion.id, elapsedTime);
    const finalRank = ratingResult.rank;

    // --- 時給昇給処理 ---
    const beforeWage = getWage();
    onGameFinish(finalRank);
    const afterWage = getWage();
    if (afterWage > beforeWage) {
        // 昇給情報を一時保存（結果モーダルで通知表示用）
        localStorage.setItem('wage_up_notice', JSON.stringify({up: afterWage - beforeWage, now: afterWage}));
    } else {
        localStorage.removeItem('wage_up_notice');
    }

    // 必要に応じてコメントも保存や表示に利用可能
    saveHistory(elapsedTime, finalAccuracy, finalRank, elapsedTime);
    // 例: コメントを画面に表示したい場合はここでDOM操作を追加
}

// 時給アップ通知を表示
function showWageUpNotice(up, now) {
    const el = document.getElementById('wage-up-notice');
    if (!el) return;
    el.innerHTML = `💰 <span style="color:#e67e22;">時給UP!</span> +${up}円 → <span style="color:#1976d2;">${now}円</span>`;
    el.style.display = 'block';
    el.style.animation = 'none'; // リセット
    // 強制再描画
    void el.offsetWidth;
    el.style.animation = 'wageUpPop 1.2s cubic-bezier(.5,1.8,.5,1)';
    setTimeout(() => {
        el.style.display = 'none';
    }, 1400);
}

function saveHistory(time, accuracy, rank, elapsedTime) {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    const newRecord = {
        questionId: currentQuestion.id,
        title: currentQuestion.title,
        time: time,
        accuracy: accuracy,
        rank: rank,
        date: new Date().toISOString()
    };
    history.unshift(newRecord); // 新しいものを先頭に
    if (history.length > 100) { // 履歴は最新100件まで
        history.splice(100);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    updateQuestionList(window.questions); // 履歴保存後にリストを更新
}


window.initGame = function() {
    // 直前にse-okを鳴らした文字数
    window.lastSeOkLength = -1;
    inputArea.setAttribute('autocomplete', 'off');
    inputArea.setAttribute('spellcheck', 'false');
    inputArea.value = '';
    inputArea.style.height = 'auto';
    inputArea.style.removeProperty('height');
    // 既存のイベントを全て解除し、textarea用に再設定
    const newInputArea = inputArea.cloneNode(true);
    newInputArea.style.height = 'auto';
    newInputArea.style.removeProperty('height');
    inputArea.parentNode.replaceChild(newInputArea, inputArea);
    window.inputArea = newInputArea;
    // IME入力中フラグ
    window.isComposing = false;

    // --- イベント再登録 ---
    // input: タイピング音/BGM/タイマー/自動リサイズ
    window.inputArea.addEventListener('input', function(e) {
        window.handleTyping(e);
        // 1文字以上入力があれば必ずタイピング音を鳴らす（IME中も鳴らす）
        if (window.soundManager) {
            const typedText = this.value;
            const currentLine = lines[currentLineIndex] || '';
            if (typedText.length > 0 && typedText.length <= currentLine.length) {
                window.soundManager.playTypingSe();
            }
        }
        adjustTextareaHeight(this);
        this._prevValue = this.value;
    });
    // compositionstart: IME開始
    window.inputArea.addEventListener('compositionstart', function() {
        window.isComposing = true;
    });
    // compositionend: IME確定
    window.inputArea.addEventListener('compositionend', function(e) {
        window.isComposing = false;
        window.handleTyping(e);
        if (window.soundManager) {
            const currentLine = lines[currentLineIndex] || '';
            const typedText = window.inputArea.value;
            // 先頭一致ならOK、そうでなければNG
            if (typedText.length > 0 && typedText.length <= currentLine.length) {
                if (currentLine.indexOf(typedText) === 0) {
                    // 直前と同じ文字数なら鳴らさない
                    if (window.lastSeOkLength !== typedText.length) {
                        window.soundManager.play('se-ok');
                        window.lastSeOkLength = typedText.length;
                    }
                } else {
                    window.soundManager.resetTypingSeCombo();
                    window.soundManager.play('se-ng');
                }
            }
        }
    });
    // keydown: Enter処理
    window.inputArea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            // 通常のEnter処理（SEは一切鳴らさない）
            const currentLine = lines[currentLineIndex] || '';
            const typedText = window.inputArea.value;
            if (typedText === currentLine || (currentLine === '' && typedText === '')) {
                if (currentLineIndex < lines.length - 1) {
                    currentLineIndex++;
                    window.inputArea.value = '';
                    window.inputArea.focus();
                    window.inputArea.placeholder = `${currentLineIndex + 1}行目を入力`;
                    window.handleTyping({type:'keydown', key:'Enter'});
                    window.inputArea.style.height = 'auto';
                } else {
                    finishGame();
                }
            }
            e.preventDefault();
        }
    });
    // paste チート対策
    window.inputArea.addEventListener('paste', function(e) {
        e.preventDefault();
        // alert('ペーストは禁止されています');
    });
}

// 初回起動時の処理フロー
function showInitialSetup() {
    // 登場人物設定を表示
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
        settingsModal.classList.add('active');
        
        // 設定モーダルのクローズ処理を上書き
        const originalSaveBtn = document.getElementById('save-settings-btn');
        if (originalSaveBtn) {
            // 元のクリックイベントを削除
            originalSaveBtn.replaceWith(originalSaveBtn.cloneNode(true));
            const newSaveBtn = document.getElementById('save-settings-btn');
            
            newSaveBtn.onclick = () => {
                // 設定を保存
                const userInfo = {
                    company: document.getElementById('user-company').value,
                    name: document.getElementById('user-name').value,
                    customer_company: document.getElementById('customer-company').value,
                    customer_name: document.getElementById('customer-name').value,
                };
                localStorage.setItem('typingGameUserInfo', JSON.stringify(userInfo));
                
                // 設定モーダルを閉じる
                settingsModal.classList.remove('active');
                
                // タイムカードを表示（ログインボーナス発生時のみ）
                if (localStorage.getItem('show_timecard_on_startup') === 'true') {
                    setTimeout(() => {
                        showTimecardModal();
                        localStorage.removeItem('show_timecard_on_startup');
                    }, 100);
                }
            };
        }
    }
}

// タイムカード機能
let currentTimecardMonth = new Date().getMonth();
let currentTimecardYear = new Date().getFullYear();

// タイムカード記録
function recordTimecard(type) {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const timeString = now.toTimeString().slice(0, 8);
    
    // 月別のタイムカードデータを取得
    const monthKey = `timecard_${now.getFullYear()}_${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    let timecardData = JSON.parse(localStorage.getItem(monthKey) || '{}');
    
    if (!timecardData[today]) {
        timecardData[today] = {};
    }
    
    if (type === 'login') {
        // 出勤時刻を記録（その日の初回のみ）
        if (!timecardData[today].loginTime) {
            timecardData[today].loginTime = timeString;
        }
    } else if (type === 'logout') {
        // 退勤時刻を記録（最新の時刻で上書き）
        timecardData[today].logoutTime = timeString;
    }
    
    localStorage.setItem(monthKey, JSON.stringify(timecardData));
}

// タイムカード表示
function showTimecardModal() {
    const modal = document.getElementById('timecard-modal');
    if (modal) {
        modal.style.display = 'flex';
        updateTimecardDisplay();
    }
}

// タイムカード非表示
function hideTimecardModal() {
    const modal = document.getElementById('timecard-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// タイムカード月変更
function changeTimecardMonth(delta) {
    currentTimecardMonth += delta;
    if (currentTimecardMonth < 0) {
        currentTimecardMonth = 11;
        currentTimecardYear--;
    } else if (currentTimecardMonth > 11) {
        currentTimecardMonth = 0;
        currentTimecardYear++;
    }
    updateTimecardDisplay();
}

// タイムカード表示更新
function updateTimecardDisplay() {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const monthDisplay = document.getElementById('timecard-month-display');
    if (monthDisplay) {
        monthDisplay.textContent = `${currentTimecardYear}年${monthNames[currentTimecardMonth]}`;
    }
    
    // 月別のタイムカードデータを取得
    const monthKey = `timecard_${currentTimecardYear}_${(currentTimecardMonth + 1).toString().padStart(2, '0')}`;
    const timecardData = JSON.parse(localStorage.getItem(monthKey) || '{}');
    
    // テーブル作成
    const tableBody = document.getElementById('timecard-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // その月の日数を取得
    const daysInMonth = new Date(currentTimecardYear, currentTimecardMonth + 1, 0).getDate();
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentTimecardYear}-${(currentTimecardMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dayData = timecardData[dateStr];
        
        const row = document.createElement('tr');
        const isToday = dateStr === todayStr;
        if (isToday) {
            row.classList.add('timecard-today');
        }
        
        // 日付
        const dateCell = document.createElement('td');
        dateCell.textContent = `${day}日`;
        row.appendChild(dateCell);
        
        // 出勤時刻
        const loginCell = document.createElement('td');
        loginCell.textContent = dayData?.loginTime || '--:--:--';
        row.appendChild(loginCell);
        
        // 退勤時刻
        const logoutCell = document.createElement('td');
        logoutCell.textContent = dayData?.logoutTime || '--:--:--';
        row.appendChild(logoutCell);
        
        // 勤務時間
        const workTimeCell = document.createElement('td');
        if (dayData?.loginTime && dayData?.logoutTime) {
            const workHours = calculateWorkHours(dayData.loginTime, dayData.logoutTime);
            workTimeCell.textContent = workHours;
        } else {
            workTimeCell.textContent = '--:--';
        }
        row.appendChild(workTimeCell);
        
        // 備考
        const noteCell = document.createElement('td');
        let notes = [];
        if (dayData?.loginTime && dateStr === localStorage.getItem(WAGE_DATE_KEY)) {
            notes.push('<span class="timecard-bonus">出勤ボーナス +1円</span>');
        }
        noteCell.innerHTML = notes.join('<br>') || '';
        row.appendChild(noteCell);
        
        tableBody.appendChild(row);
    }
}

// 勤務時間計算
function calculateWorkHours(loginTime, logoutTime) {
    const login = new Date(`2000-01-01T${loginTime}`);
    const logout = new Date(`2000-01-01T${logoutTime}`);
    
    if (logout < login) {
        // 日をまたいだ場合
        logout.setDate(logout.getDate() + 1);
    }
    
    const diffMs = logout - login;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}:${diffMinutes.toString().padStart(2, '0')}`;
}

// --- ここから追記 ---
// 入力エリアのリサイズ処理を共通化
function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}
// --- ここまで追記 ---
