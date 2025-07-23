// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
    // 各モジュールの初期化
    initSettings();
    setupUIEventListeners();
    initGame();

    // GameKeyboardインスタンスの作成
    if (typeof GameKeyboard !== 'undefined') {
        window.gameKeyboard = new GameKeyboard('game-keyboard-container');
    }

    // お題リストの読み込みと表示
    updateQuestionList(window.questions, (questionId) => {
        currentQuestion = window.questions.find(q => q.id === questionId);
        if (currentQuestion) {
            displayQuestionDetails(currentQuestion);
            resetGameStats(); // 新しい問題が選択されたらゲーム状態をリセット
        }
    });

    // 初期表示
    if (window.questions.length > 0) {
        // 最初の問題を選択状態にする
        const firstQuestionId = window.questions[0].id;
        currentQuestion = window.questions.find(q => q.id === firstQuestionId);
        if (currentQuestion) {
            displayQuestionDetails(currentQuestion);
            document.querySelector('#question-selector li').classList.add('active');
        }
    }
});
