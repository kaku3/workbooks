// scripts/ui.js

const inboxBtn = document.getElementById('inbox-btn');
const historyBtn = document.getElementById('history-btn');
const inboxListPanel = document.getElementById('inbox-list-panel');
const historyListPanel = document.getElementById('history-list-panel');
const receivedEmailFull = document.getElementById('received-email-full');
const replyBtn = document.getElementById('reply-btn');

// Game Modal elements
const gameModal = document.getElementById('game-modal');
const cancelGameBtn = document.getElementById('cancel-game-btn');
const sendBtn = document.getElementById('send-btn');
const modalReceivedSubject = document.getElementById('modal-received-subject');
const modalReceivedBody = document.getElementById('modal-received-body');


function setupUIEventListeners() {
    inboxBtn.addEventListener('click', () => {
        inboxListPanel.classList.remove('hidden');
        historyListPanel.classList.add('hidden');
        inboxBtn.classList.add('active');
        historyBtn.classList.remove('active');
    });

    historyBtn.addEventListener('click', () => {
        inboxListPanel.classList.add('hidden');
        historyListPanel.classList.remove('hidden');
        inboxBtn.classList.remove('active');
        historyBtn.classList.add('active');
        // TODO: 履歴表示機能の実装
    });

    replyBtn.addEventListener('click', () => {
        if (currentQuestion) {
            showGameModal(currentQuestion);
        }
    });

    cancelGameBtn.addEventListener('click', () => {
        if (confirm('ゲームを中断して閉じますか？記録は保存されません。')) {
            hideGameModal();
            stopGame();
            resetGameStats();
        }
    });

    sendBtn.addEventListener('click', () => {
        // このボタンはゲームクリア後にのみ有効化される
        hideGameModal();
        alert('メールを送信しました！');
        // ゲーム完了後にお題リストの表示を更新
        updateQuestionList(window.questions, (questionId) => {
            currentQuestion = window.questions.find(q => q.id === questionId);
            if (currentQuestion) {
                displayQuestionDetails(currentQuestion);
                resetGameStats();
            }
        });
    });
}

function showGameModal(question) {
    // currentQuestionを必ずセット
    currentQuestion = question;

    const userInfo = loadUserInfo() || {};

    // モーダルの内容をセット
    modalReceivedSubject.textContent = question.from_customer.subject;
    modalReceivedBody.innerHTML = replacePlaceholders(question.from_customer.body, userInfo).replace(/\n/g, '<br>');

    // ゲームの準備
    prepareGame();

    // タイマーバーをリセット
    const bar = document.getElementById('time-progress-bar');
    if (bar) bar.style.width = '0%';
    // ランクラベル位置も初期化（updateTimeProgressBarで再配置される）
    updateTimeProgressBar(0); // ←ここでラベルを正しい位置に初期化

    // 入力欄リセット
    if (window.inputArea) {
        window.inputArea.value = '';
        window.inputArea.disabled = false;
    }
    // 送信ボタンを無効化
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) sendBtn.disabled = true;

    // モーダルを表示
    gameModal.style.display = 'flex';
}

function hideGameModal() {
    gameModal.style.display = 'none';
}


function updateQuestionList(questions, onSelect) {
    const questionSelector = document.getElementById('question-selector');
    const history = JSON.parse(localStorage.getItem('typingGameHistory')) || [];
    questionSelector.innerHTML = '';

    // 解放条件データ
    const unlocks = window.UNLOCK_CONDITIONS || [];
    // どの問題が解放済みかを判定
    function isUnlocked(q) {
        const cond = unlocks.find(u => u.id === q.id);
        if (!cond || !cond.required || cond.required.length === 0) return true; // 1問目など
        // いずれかの条件を満たせば解放
        return cond.required.some(req => {
            if (req.type === 'rank') {
                // 指定問題で指定ランク以上
                const h = history.filter(h => h.questionId === req.targetId && h.rank && h.rank <= req.value);
                return h.length > 0;
            } else if (req.type === 'play') {
                // 指定問題で指定回数以上プレイ
                const h = history.filter(h => h.questionId === req.targetId);
                return h.length >= req.value;
            }
            return false;
        });
    }

    questions.forEach(q => {
        const unlocked = isUnlocked(q);
        if (!unlocked) return; // ロックされている問題は非表示

        const li = document.createElement('li');
        li.dataset.questionId = q.id;

        // このお題に関連する履歴を取得
        const questionHistory = history.filter(h => h.questionId === q.id);

        // 3桁固定表示（最大999）
        let playCount = questionHistory.length;
        if (playCount > 999) playCount = 999;
        let playCountStr = playCount.toString().padStart(3, '0');

        let bestTime = playCount > 0 ? Math.min(...questionHistory.map(h => h.time)).toFixed(2) : '-';
        if (bestTime !== '-') {
            // 小数点以下切り捨て、最大999
            let bestTimeInt = Math.floor(Number(bestTime));
            if (bestTimeInt > 999) bestTimeInt = 999;
            bestTime = bestTimeInt.toString().padStart(3, '0');
        }
        const bestRank = playCount > 0 ? questionHistory.reduce((best, current) => current.rank < best ? current.rank : best, 'E') : '-';

        li.innerHTML = `
            <span class="question-title">${q.title}</span>
            <div class="question-stats">
                <span title="挑戦回数">
                  <svg width="16" height="16" viewBox="0 0 16 16" style="vertical-align:middle; margin-right:2px;"><rect x="2" y="3" width="12" height="2" rx="1" fill="#888"/><rect x="2" y="7" width="12" height="2" rx="1" fill="#888"/><rect x="2" y="11" width="8" height="2" rx="1" fill="#888"/></svg><span style="font-variant-numeric: tabular-nums; min-width:2.5em; display:inline-block; text-align:right;">${playCountStr}</span>
                </span>
                <span title="最短タイム">
                  <svg width="16" height="16" viewBox="0 0 16 16" style="vertical-align:middle; margin-right:2px;"><circle cx="8" cy="8" r="7" stroke="#888" stroke-width="2" fill="none"/><path d="M8 4v4l3 2" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round"/></svg><span style="font-variant-numeric: tabular-nums; min-width:2.5em; display:inline-block; text-align:right;">${bestTime !== '-' ? bestTime : '---'}</span>
                </span>
                <span title="最高ランク">
                  <svg width="16" height="16" viewBox="0 0 16 16" style="vertical-align:middle; margin-right:2px;"><polygon points="8,2 10,7 15,7 11,10 12,15 8,12 4,15 5,10 1,7 6,7" fill="#f5c518" stroke="#888" stroke-width="1"/></svg>${bestRank}
                </span>
            </div>
        `;

        li.addEventListener('click', () => {
            if (onSelect) {
                onSelect(q.id);
            }
            // アクティブな項目をハイライト
            document.querySelectorAll('#question-selector li').forEach(item => item.classList.remove('active'));
            li.classList.add('active');
        });
        questionSelector.appendChild(li);
    });
    // 2段目: 解放条件表示
    let condDiv = document.getElementById('unlock-conditions-row');
    if (!condDiv) {
        condDiv = document.createElement('div');
        condDiv.id = 'unlock-conditions-row';
        condDiv.style.margin = '0.5em 0 0.5em 0';
        questionSelector.parentNode.insertBefore(condDiv, questionSelector.nextSibling);
    }
    // 次に解放される問題の条件を表示
    const nextLocked = questions.find(q => !isUnlocked(q));
    if (nextLocked) {
        const cond = unlocks.find(u => u.id === nextLocked.id);
        if (cond && cond.required && cond.required.length > 0) {
            // descのテンプレートを置換
            function renderDesc(r) {
                let desc = r.desc;
                desc = desc.replace(/\{targetId\}/g, r.targetId).replace(/\{value\}/g, r.value);
                return desc;
            }
            condDiv.innerHTML = '<span style="color:#888;">次の問題の解放条件：</span>' +
                cond.required.map(r => `<span class=\"unlock-cond\">${renderDesc(r)}</span>`).join('<span style="color:#aaa;"> または </span>');
        } else {
            condDiv.innerHTML = '';
        }
    } else {
        condDiv.innerHTML = '';
    }
}

function displayQuestionDetails(question) {
    const userInfo = loadUserInfo() || {};
    const receivedSubject = document.getElementById('received-subject-full');
    const receivedBody = document.getElementById('received-body-full');

    receivedSubject.textContent = question.from_customer.subject;
    receivedBody.innerHTML = replacePlaceholders(question.from_customer.body, userInfo).replace(/\n/g, '<br>');

    receivedEmailFull.classList.remove('hidden');
}

function replacePlaceholders(text, userInfo) {
    return text
        .replace(/{{user_company}}/g, userInfo.company || 'あなたの会社名')
        .replace(/{{user_name}}/g, userInfo.name || 'あなたの名前')
        .replace(/{{customer_company}}/g, userInfo.customer_company || '相手の会社名')
        .replace(/{{customer_name}}/g, userInfo.customer_name || '相手の名前');
}