// scripts/ui.js

const inboxBtn = document.getElementById('inbox-btn');
const historyBtn = document.getElementById('history-btn');
const inboxListPanel = document.getElementById('inbox-list-panel');
const historyListPanel = document.getElementById('history-list-panel');
const receivedEmailFull = document.getElementById('received-email-full');
const gameView = document.getElementById('game-view');
const replyBtn = document.getElementById('reply-btn');

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
        receivedEmailFull.classList.add('hidden');
        gameView.classList.remove('hidden');
        // ゲーム開始の準備
        prepareGame();
    });
}

function updateQuestionList(questions, onSelect) {
    const questionSelector = document.getElementById('question-selector');
    questionSelector.innerHTML = '';
    questions.forEach(q => {
        const li = document.createElement('li');
        li.textContent = q.title;
        li.dataset.questionId = q.id;
        li.addEventListener('click', () => {
            onSelect(q.id);
            // アクティブな項目をハイライト
            document.querySelectorAll('#question-selector li').forEach(item => item.classList.remove('active'));
            li.classList.add('active');
        });
        questionSelector.appendChild(li);
    });
}

function displayQuestionDetails(question) {
    const userInfo = loadUserInfo() || {};
    const receivedSubject = document.getElementById('received-subject-full');
    const receivedBody = document.getElementById('received-body-full');

    receivedSubject.textContent = question.from_customer.subject;
    receivedBody.innerHTML = replacePlaceholders(question.from_customer.body, userInfo).replace(/\n/g, '<br>');

    receivedEmailFull.classList.remove('hidden');
    gameView.classList.add('hidden');
}

function replacePlaceholders(text, userInfo) {
    return text
        .replace(/{{user_company}}/g, userInfo.company || 'あなたの会社名')
        .replace(/{{user_name}}/g, userInfo.name || 'あなたの名前')
        .replace(/{{customer_company}}/g, userInfo.customer_company || '相手の会社名')
        .replace(/{{customer_name}}/g, userInfo.customer_name || '相手の名前');
}
