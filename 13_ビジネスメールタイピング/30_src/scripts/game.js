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
    setTimeout(() => inputArea.focus(), 100);
}


function startGame() {
    if (gameStartTime) return; // ゲームが既に始まっている場合は何もしない
    gameStartTime = new Date();

    timerInterval = setInterval(updateTimer, 100);
}


function stopGame() {
    clearInterval(timerInterval);

    timerInterval = null;
}


function resetGameStats() {
    stopGame();
    gameStartTime = null;
    typedChars = 0;
    correctChars = 0;
    incorrectChars = 0;
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
    // calculateWPM(elapsedTime); // WPMは非表示
}



function calculateAccuracy() {
    const totalTyped = correctChars + incorrectChars;
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
    accuracyEl.textContent = accuracy;
    return accuracy;
}


window.handleTyping = function(e) {
    const gameModal = document.getElementById('game-modal');
    if (!currentQuestion || gameModal.style.display !== 'flex') return;

    if (!gameStartTime) {
        startGame();
        // 2行目以降のプレースホルダを切り替え
        if (currentLineIndex === 0) {
            inputArea.placeholder = '２行目を入力';
        }
    } else {
        // 現在の行に応じてプレースホルダを更新
        inputArea.placeholder = `${currentLineIndex + 1}行目を入力`;
    }

    // 現在の行のみ判定
    const currentLine = lines[currentLineIndex] || '';
    const typedText = (window.inputArea && window.inputArea.value !== undefined) ? window.inputArea.value : inputArea.value;
    const lineDivs = gameReplyBodyEl.querySelectorAll('.game-line');
    if (!lineDivs[currentLineIndex]) return;
    const spans = lineDivs[currentLineIndex].querySelectorAll('span');

    typedChars = typedText.length;
    let currentCorrectCount = 0;
    for (let i = 0; i < currentLine.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === currentLine[i]) {
                spans[i].className = 'correct';
                currentCorrectCount++;
            } else {
                spans[i].className = 'incorrect';
            }
        } else {
            spans[i].className = 'untyped';
        }
    }
    correctChars = currentCorrectCount;
    incorrectChars = typedChars - currentCorrectCount;
    calculateAccuracy();

    // 表示制御: 入力済み行と現在行は表示、それ以外は非表示
    lineDivs.forEach((div, idx) => {
        if (idx < currentLineIndex) {
            div.style.display = '';
            div.classList.add('confirmed');
            div.classList.remove('current');
        } else if (idx === currentLineIndex) {
            div.style.display = '';
            div.classList.add('current');
            div.classList.remove('confirmed');
        } else {
            div.style.display = 'none';
            div.classList.remove('confirmed');
            div.classList.remove('current');
        }
        // 余白リセット
        div.style.marginTop = '';
        div.style.marginBottom = '';
    });
    // 入力行が一番下に来るように、flexbox順序を調整
    // すべての行のorderをリセット
    lineDivs.forEach((div, idx) => {
        div.style.order = idx;
    });
    // 入力済み行と現在行だけを下に寄せる
    // 表示されている行のうち、最初の行のorderを調整
    const shown = Array.from(lineDivs).filter((div, idx) => idx <= currentLineIndex);
    const total = shown.length;
    shown.forEach((div, i) => {
        div.style.order = i + (lineDivs.length - total);
    });
    // 入力行が見切れた場合はスクロール
    lineDivs[currentLineIndex].scrollIntoView({block: 'end', behavior: 'smooth'});
}

function finishGame() {
    stopGame();
    inputArea.disabled = true; // 入力エリアを無効化

    const elapsedTime = (new Date() - gameStartTime) / 1000;
    const finalAccuracy = calculateAccuracy();
    const finalRank = calculateRank(currentQuestion.difficulty, elapsedTime);
    saveHistory(elapsedTime, finalAccuracy, finalRank, elapsedTime);
}

function loadHighScore() {
    const score = localStorage.getItem(HIGHSCORE_KEY);
    return score ? parseFloat(score) : 0;
}

/* function updateHighScore(wpm) {
    const currentHighScore = loadHighScore();
    if (wpm > currentHighScore) {
        localStorage.setItem(HIGHSCORE_KEY, wpm.toFixed(2));
        if (highscoreEl) {
            highscoreEl.textContent = wpm.toFixed(2);
        }
    }
} */

/* function displayHighScore() {
    if (highscoreEl) {
        highscoreEl.textContent = loadHighScore().toFixed(2);
    }
} */


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
    inputArea.setAttribute('type', 'text');
    inputArea.setAttribute('autocomplete', 'off');
    inputArea.setAttribute('spellcheck', 'false');
    inputArea.value = '';
    // 既存のkeydownイベントを全て解除
    const newInputArea = inputArea.cloneNode(true);
    inputArea.parentNode.replaceChild(newInputArea, inputArea);
    window.inputArea = newInputArea;
    // 入力時にリアルタイム判定
    window.inputArea.addEventListener('input', function(e) {
        window.handleTyping(e);
    });
    // Enterで行送り
    window.inputArea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const currentLine = lines[currentLineIndex] || '';
            const typedText = window.inputArea.value;
            // 空行（currentLineが空文字）の場合は、入力も空文字ならOK
            if (typedText === currentLine || (currentLine === '' && typedText === '')) {
                if (currentLineIndex < lines.length - 1) {
                    currentLineIndex++;
                    window.inputArea.value = '';
                    window.inputArea.focus();
                    // プレースホルダを次の行に
                    window.inputArea.placeholder = `${currentLineIndex + 1}行目を入力`;
                    window.handleTyping();
                } else {
                    finishGame();
                }
            }
            e.preventDefault();
        }
    });
}
