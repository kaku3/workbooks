// --- 遊び方モーダル ---
function showHowtoModal() {
    if (document.getElementById('howto-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'howto-modal';
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
    inner.style.borderRadius = '12px';
    inner.style.boxShadow = '0 2px 24px rgba(0,0,0,0.18)';
    inner.style.overflow = 'hidden';
    inner.style.width = '80%';
    inner.style.height = '96vh';
    inner.style.maxWidth = 'none';
    inner.style.maxHeight = '100vh';
    inner.style.position = 'relative';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '閉じる';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '18px';
    closeBtn.style.right = '32px';
    closeBtn.style.zIndex = '10';
    closeBtn.style.background = '#1976d2';
    closeBtn.style.color = '#fff';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.padding = '10px 28px';
    closeBtn.style.fontSize = '1.1em';
    closeBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
        document.body.removeChild(modal);
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
// --- 遊び方ボタンイベント登録 ---
document.addEventListener('DOMContentLoaded', () => {
    const howtoBtn = document.getElementById('howto-btn');
    if (howtoBtn) {
        howtoBtn.addEventListener('click', showHowtoModal);
    }
    
    // 勤怠ボタンイベント登録
    const timecardBtn = document.getElementById('timecard-btn');
    if (timecardBtn) {
        timecardBtn.addEventListener('click', showTimecardModal);
    }

    // ログインボーナス時のタイムカード自動表示
    try {
        if (localStorage.getItem('show_timecard_on_startup') === 'true') {
            showTimecardModal();
            localStorage.removeItem('show_timecard_on_startup');
        }
    } catch(e) {}
});
// scripts/ui.js


const inboxBtn = document.getElementById('inbox-btn');
const inboxListPanel = document.getElementById('inbox-list-panel');
const receivedEmailFull = document.getElementById('received-email-full');
const replyBtn = document.getElementById('reply-btn');

// Game Modal elements
const gameModal = document.getElementById('game-modal');
const cancelGameBtn = document.getElementById('cancel-game-btn');
const sendBtn = document.getElementById('send-btn');
const modalReceivedSubject = document.getElementById('modal-received-subject');
const modalReceivedBody = document.getElementById('modal-received-body');



function setupUIEventListeners() {
    if (inboxBtn) {
        inboxBtn.addEventListener('click', () => {
            inboxListPanel.classList.remove('hidden');
            // 履歴パネル削除済みのため、他は何もしない
            inboxBtn.classList.add('active');
        });
    }


    if (replyBtn) {
        replyBtn.addEventListener('click', () => {
            if (currentQuestion) {
                showGameModal(currentQuestion);
            }
        });
    }


    // モーダルを閉じてメイン画面に戻す共通処理
    function handleModalClose() {
        document.getElementById('result-modal').style.display = 'none';
        // ゲーム完了後にお題リストの表示を更新
        updateQuestionList(window.questions, (questionId) => {
            currentQuestion = window.questions.find(q => q.id === questionId);
            if (currentQuestion) {
                displayQuestionDetails(currentQuestion);
            }
        });
        // 選択状態を復元
        if (currentQuestion) {
            // 一覧のli要素でcurrentQuestion.idと一致するものにactiveを付与
            document.querySelectorAll('#question-selector li').forEach(item => {
                if (item.dataset.questionId === String(currentQuestion.id)) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            showHistoryPanel(currentQuestion.id);
        }
        // メイン画面のBGMを再生
        if (window.soundManager) {
            window.soundManager.play('bgm-main');
        }
    }

    cancelGameBtn.addEventListener('click', () => {
        if (confirm('ゲームを中断して閉じますか？記録は保存されません。')) {
            hideGameModal();
            stopGame();
            resetGameStats();
            // メイン画面の選択状態・詳細も復元
            handleModalClose();
        }
    });

    sendBtn.addEventListener('click', () => {
        // このボタンはゲームクリア後にのみ有効化される
        hideGameModal();
        // 結果モーダル表示
        showResultModal();
    });
    // 結果モーダル閉じる
    const resultCloseBtn = document.getElementById('result-close-btn');
    if (resultCloseBtn) {
        resultCloseBtn.addEventListener('click', handleModalClose);
    }
    // リトライボタン
    const resultRetryBtn = document.getElementById('result-retry-btn');
    if (resultRetryBtn) {
        resultRetryBtn.addEventListener('click', () => {
            document.getElementById('result-modal').style.display = 'none';
            // ゲームモーダルを再表示
            if (currentQuestion) {
                showGameModal(currentQuestion);
            }
        });
    }
}

// 結果モーダル表示処理
function showResultModal() {
    // 最新履歴から情報取得
    const history = JSON.parse(localStorage.getItem('typingGameHistory')) || [];
    const last = history[0];
    if (!last) return;
    // ランク・時間・設問ID
    const { rank, time, questionId } = last;
    // コメント取得
    let comment = '';
    let questionTitle = '';
    if (window.QUESTION_RATINGS) {
        const q = window.QUESTION_RATINGS.find(q => q.id === questionId);
        if (q && q.ratings) {
            const r = q.ratings.find(r => r.rank === rank);
            if (r) comment = r.comment;
        }
    }
    // お題名取得
    if (window.questions) {
        const qObj = window.questions.find(q => q.id === questionId);
        if (qObj && qObj.title) questionTitle = qObj.title;
    }
    // セット
    document.getElementById('result-rank').textContent = rank;
    document.getElementById('result-time').textContent = Number(time).toFixed(2);
    document.getElementById('result-comment').textContent = comment || '';
    // シェアボタンURL
    const url = encodeURIComponent(location.href.replace(/#.*$/, ''));
    const text = encodeURIComponent(`香ばしビジメ - 極タイピング\n${rank}ランク (${Number(time).toFixed(2)}秒)\n「${questionTitle}」でクリア！`);
    document.getElementById('result-share-fb').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    document.getElementById('result-share-x').href = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;

    // ランクに応じたリザルトSE再生
    if (window.soundManager && typeof rank === 'string') {
        const lowerRank = rank.toLowerCase();
        const seMap = { 's': 'result-s', 'a': 'result-a', 'b': 'result-b', 'c': 'result-c', 'd': 'result-d', 'e': 'result-e' };
        if (seMap[lowerRank]) {
            window.soundManager.play(seMap[lowerRank]);
        }
    }
    // モーダル表示
    document.getElementById('result-modal').style.display = 'flex';
    // 昇給通知があれば表示
    try {
        const notice = JSON.parse(localStorage.getItem('wage_up_notice'));
        if (notice && notice.up && notice.now) {
            showWageUpNotice(notice.up, notice.now);
            // 一度表示したら削除
            localStorage.removeItem('wage_up_notice');
        }
    } catch(e) {}
}


function showGameModal(question) {
    // メインBGMを停止
    if (window.soundManager) {
        window.soundManager.stop('bgm-main');
    }
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
        // IMEをONにする
        window.inputArea.style.imeMode = 'active';
        setTimeout(() => {
            window.inputArea.focus();
        }, 50);
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
        // ランク順序定義
        const rankOrder = ['E','D','C','B','A','S'];
        // いずれかの条件を満たせば解放
        return cond.required.some(req => {
            if (req.type === 'rank') {
                if (req.targetIds && Array.isArray(req.targetIds)) {
                    // targetIdsのすべてで条件を満たせばOK（AND）
                    return req.targetIds.every(tid => {
                        const h = history.filter(h => {
                            if (h.questionId !== tid || !h.rank) return false;
                            // Cランク以上: rankOrder.indexOf(h.rank) >= rankOrder.indexOf(req.value)
                            return rankOrder.indexOf(h.rank) >= rankOrder.indexOf(req.value);
                        });
                        return h.length > 0;
                    });
                } else if (req.targetId) {
                    const h = history.filter(h => {
                        if (h.questionId !== req.targetId || !h.rank) return false;
                        return rankOrder.indexOf(h.rank) >= rankOrder.indexOf(req.value);
                    });
                    return h.length > 0;
                }
            } else if (req.type === 'play') {
                if (req.targetIds && Array.isArray(req.targetIds)) {
                    // targetIdsのすべてで条件を満たせばOK（AND）
                    return req.targetIds.every(tid => {
                        const h = history.filter(h => h.questionId === tid);
                        return h.length >= req.value;
                    });
                } else if (req.targetId) {
                    const h = history.filter(h => h.questionId === req.targetId);
                    return h.length >= req.value;
                }
            }
            return false;
        });
    }

    questions.forEach(q => {
        const unlocked = window.DEBUG_UNLOCK_ALL || isUnlocked(q);
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
        // ★評価: 今までで一番良かったランク（S > A > ... > E）
        const rankOrder = ['S','A','B','C','D','E'];
        const bestRank = playCount > 0 ? questionHistory.reduce((best, current) => {
            const bestIdx = rankOrder.indexOf(best);
            const currIdx = rankOrder.indexOf(current.rank);
            return (currIdx !== -1 && (bestIdx === -1 || currIdx < bestIdx)) ? current.rank : best;
        }, 'E') : '-';

        // ここでidをタイトルの先頭に表示
        li.innerHTML = `
            <span class="question-title"><span class="question-id">${q.id}.</span> ${q.title}</span>
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
    // 次に解放される問題の条件をすべて表示（複数同時ロック対応・現時点で達成可能なもののみ）
    const nextLockedList = questions.filter(q => {
        if (isUnlocked(q)) return false; // 既に解放済みは除外
        // 依存する前提問題が未解放なら除外
        const cond = unlocks.find(u => u.id === q.id);
        if (!cond || !cond.required || cond.required.length === 0) return true;
        // すべてのrequired条件のtargetId/targetIdsが解放済みか判定
        return cond.required.some(r => {
            // rank/play両対応
            let targets = [];
            if (r.targetIds && Array.isArray(r.targetIds)) {
                targets = r.targetIds;
            } else if (Array.isArray(r.targetId)) {
                targets = r.targetId;
            } else if (r.targetId) {
                targets = [r.targetId];
            }
            // 依存先がすべて解放済みならtrue
            return targets.every(tid => {
                const qDep = questions.find(q2 => q2.id === tid);
                return qDep && isUnlocked(qDep);
            });
        });
    });
    if (nextLockedList.length > 0) {
        function renderDesc(r) {
            let desc = r.desc;
            if (r.targetIds && Array.isArray(r.targetIds)) {
                desc = desc.replace(/\{targetIds\}/g, r.targetIds.join(','));
                desc = desc.replace(/\{targetId\}/g, r.targetIds.join(','));
            } else if (Array.isArray(r.targetId)) {
                desc = desc.replace(/\{targetIds\}/g, r.targetId.join(','));
                desc = desc.replace(/\{targetId\}/g, r.targetId.join(','));
            } else if (r.targetId) {
                desc = desc.replace(/\{targetId\}/g, r.targetId);
            }
            desc = desc.replace(/\{value\}/g, r.value);
            return desc;
        }
        let html = '<div style="color:#888; font-weight:bold; margin-bottom:0.3em;">次の問題の解放条件：</div>';
        html += nextLockedList.map(q => {
            const cond = unlocks.find(u => u.id === q.id);
            if (cond && cond.required && cond.required.length > 0) {
                return `<div class=\"unlock-cond-group\"><span class=\"unlock-cond-title\">${q.id}問目：</span>` +
                    cond.required.map(r => `<span class=\"unlock-cond\">${renderDesc(r)}</span>`).join('<span style=\"color:#aaa;\"> または </span>') +
                    '</div>';
            } else {
                return '';
            }
        }).filter(Boolean).join('');
        condDiv.innerHTML = html;
    } else {
        condDiv.innerHTML = '';
    }
}

// 履歴グラフ描画
function showHistoryPanel(questionId) {
    const historyPanel = document.getElementById('history-panel');
    const canvas = document.getElementById('history-graph');
    const emptyMsg = document.getElementById('history-empty-msg');
    if (!historyPanel || !canvas || !emptyMsg) return;
    // 履歴取得
    const history = JSON.parse(localStorage.getItem('typingGameHistory')) || [];
    const qHistory = history.filter(h => h.questionId === questionId && typeof h.time === 'number');
    historyPanel.style.display = '';
    if (qHistory.length === 0) {
        canvas.style.display = 'none';
        emptyMsg.style.display = '';
        return;
    }
    canvas.style.display = '';
    emptyMsg.style.display = 'none';
    // グラフ描画（新しいものが右になるよう逆順）
    drawHistoryGraph(canvas, qHistory.map(h => h.time).reverse());
}

function drawHistoryGraph(canvas, times) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!times.length) return;
    // 軸
    const w = canvas.width, h = canvas.height;
    const padding = 32;
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);
    // 軸線
    ctx.strokeStyle = '#bbb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding);
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();
    // 折れ線
    ctx.strokeStyle = '#2a7a6c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    times.forEach((t, i) => {
        const x = padding + (w - 2 * padding) * (i / Math.max(1, times.length - 1));
        const y = h - padding - (h - 2 * padding) * ((t - minTime) / Math.max(0.01, maxTime - minTime));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    // 点
    ctx.fillStyle = '#6bbdb7';
    times.forEach((t, i) => {
        const x = padding + (w - 2 * padding) * (i / Math.max(1, times.length - 1));
        const y = h - padding - (h - 2 * padding) * ((t - minTime) / Math.max(0.01, maxTime - minTime));
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    // ラベル
    ctx.fillStyle = '#444';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('秒', padding - 4, padding + 2);
    ctx.textAlign = 'center';
    ctx.fillText('回数', w / 2, h - 4);
    // 最大・最小値
    ctx.textAlign = 'left';
    ctx.fillText(maxTime.toFixed(2), padding + 2, padding + 12);
    ctx.fillText(minTime.toFixed(2), padding + 2, h - padding);
}

// ランク条件を表示
function showRankPanel(questionId) {
    const rankPanel = document.getElementById('rank-panel');
    if (!rankPanel) return;
    // QUESTION_RATINGSから該当問題のランク条件を取得
    const ratingObj = (window.QUESTION_RATINGS || []).find(r => r.id === questionId);
    if (!ratingObj || !ratingObj.ratings) {
        rankPanel.style.display = 'none';
        return;
    }
    // S~E条件をセット
    const conds = ratingObj.ratings.map(r => r.time);
    const labels = ['s','a','b','c','d','e'];
    for (let i=0; i<labels.length; ++i) {
        const el = document.getElementById(`rank-${labels[i]}-cond`);
        if (!el) continue;
        el.textContent = `～${conds[i]}秒`;
    }
    rankPanel.style.display = '';
}

function displayQuestionDetails(question) {
    const userInfo = loadUserInfo() || {};
    const receivedSubject = document.getElementById('received-subject-full');
    const receivedBody = document.getElementById('received-body-full');
    const replyPointPanel = document.getElementById('reply-point-panel');
    const replyPointText = document.getElementById('reply-point-text');
    const historyPanel = document.getElementById('history-panel');

    receivedSubject.textContent = question.from_customer.subject;
    receivedBody.innerHTML = replacePlaceholders(question.from_customer.body, userInfo).replace(/\n/g, '<br>');

    // 返信のポイント表示
    if (replyPointPanel && replyPointText && question.point) {
        replyPointText.textContent = question.point;
        replyPointPanel.style.display = '';
    } else if (replyPointPanel) {
        replyPointPanel.style.display = 'none';
    }
    // 評価パネル表示
    showRankPanel(question.id);
    // 履歴パネル表示
    if (historyPanel) showHistoryPanel(question.id);
    receivedEmailFull.classList.remove('hidden');
}

function replacePlaceholders(text, userInfo) {
    return text
        .replace(/{{user_company}}/g, userInfo.company || 'あなたの会社名')
        .replace(/{{user_name}}/g, userInfo.name || 'あなたの名前')
        .replace(/{{customer_company}}/g, userInfo.customer_company || '相手の会社名')
        .replace(/{{customer_name}}/g, userInfo.customer_name || '相手の名前');
}