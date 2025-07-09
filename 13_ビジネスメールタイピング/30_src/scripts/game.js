// scripts/game.js

let currentQuestion = null;
let gameStartTime;
let timerInterval;
let typedChars = 0;
let correctChars = 0;
let incorrectChars = 0;

const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const highscoreEl = document.getElementById('highscore');
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
    
    // ゲーム用の表示を生成
    gameReplyBodyEl.innerHTML = replyText.split('').map(char => `<span class="untyped">${char}</span>`).join('');
    
    resetGameStats();
    inputArea.value = '';
    inputArea.focus();
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
    wpmEl.textContent = '0';
    accuracyEl.textContent = '100';
    inputArea.value = '';
    inputArea.classList.remove('incorrect-line');
}

function updateTimer() {
    if (!gameStartTime) return;
    const elapsedTime = (new Date() - gameStartTime) / 1000;
    timeEl.textContent = elapsedTime.toFixed(2);
    calculateWPM(elapsedTime);
}

function calculateWPM(elapsedTime) {
    const minutes = elapsedTime / 60;
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    wpmEl.textContent = wpm;
    return wpm;
}

function calculateAccuracy() {
    const totalTyped = correctChars + incorrectChars;
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
    accuracyEl.textContent = accuracy;
    return accuracy;
}

function handleTyping(e) {
    if (!currentQuestion || !gameView.classList.contains('hidden') === false) return;

    if (!gameStartTime) {
        startGame();
    }

    const userInfo = loadUserInfo() || {};
    const fullText = replacePlaceholders(currentQuestion.to_customer.body, userInfo);
    const typedText = inputArea.value;
    const spans = gameReplyBodyEl.querySelectorAll('span');

    typedChars = typedText.length;

    let currentCorrectCount = 0;
    for (let i = 0; i < fullText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === fullText[i]) {
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
    incorrectChars = typedChars - correctChars;

    calculateAccuracy();

    if (typedText.length === fullText.length) {
        finishGame();
    }
}

function finishGame() {
    stopGame();
    const elapsedTime = (new Date() - gameStartTime) / 1000;
    const finalWPM = calculateWPM(elapsedTime);
    const finalAccuracy = calculateAccuracy();

    updateHighScore(finalWPM);
    saveHistory(finalWPM, finalAccuracy);

    setTimeout(() => {
        alert(`完了!\nTime: ${elapsedTime.toFixed(2)}s\nWPM: ${finalWPM}\nAccuracy: ${finalAccuracy}%`);
        // 次の動作を促す
        receivedEmailFull.classList.remove('hidden');
        gameView.classList.add('hidden');
        resetGameStats();
    }, 100);
}

function loadHighScore() {
    const score = localStorage.getItem(HIGHSCORE_KEY);
    return score ? parseFloat(score) : 0;
}

function updateHighScore(wpm) {
    const currentHighScore = loadHighScore();
    if (wpm > currentHighScore) {
        localStorage.setItem(HIGHSCORE_KEY, wpm.toFixed(2));
        highscoreEl.textContent = wpm.toFixed(2);
    }
}

function displayHighScore() {
    highscoreEl.textContent = loadHighScore().toFixed(2);
}

function saveHistory(wpm, accuracy) {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    const newRecord = {
        questionId: currentQuestion.id,
        title: currentQuestion.title,
        wpm: wpm,
        accuracy: accuracy,
        date: new Date().toISOString()
    };
    history.unshift(newRecord); // 新しいものを先頭に
    if (history.length > 20) { // 履歴は最新20件まで
        history.pop();
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function initGame() {
    inputArea.addEventListener('input', handleTyping);
    displayHighScore();
}
