// game 画面でも使えるように公開
window.updateCurrentTitle = function() {
    const { playCount, currentWage } = loadCareer();
    window.currentTitle = getCurrentTitle(playCount, currentWage);
}

// キャリア画面の JavaScript

function initCareerPage() {
    // 現在のプレイデータを取得
    const { playCount, currentWage } = loadCareer();

    // 現在の状態を表示
    updateCurrentStatus(playCount, currentWage);
    
    // 次の称号情報を表示
    updateNextTitleInfo(playCount, currentWage);
    
    // 称号一覧を表示
    displayTitles(playCount, currentWage);
    
    // フィルターボタンのイベント設定
    setupFilterButtons();
    
    // モーダルの設定
    setupModal();
}

function loadCareer() {
    const playCount = parseInt(localStorage.getItem('wage_play_count') || '0', 10);
    const currentWage = parseInt(localStorage.getItem('wage') || '0', 10);
    return { playCount, currentWage };
}

function updateCurrentStatus(playCount, currentWage) {
    document.getElementById('play-count').textContent = playCount;
    document.getElementById('current-wage').textContent = `¥${currentWage.toLocaleString()}`;
    
    // 現在の称号を取得
    const currentTitle = getCurrentTitle(playCount, currentWage);
    document.getElementById('current-title').textContent = currentTitle ? currentTitle.name : '未経験エンジニア';
}

function getCurrentTitle(playCount, currentWage) {
    // 解放済みの称号の中で最も高いものを取得
    let unlockedTitles = window.titles.filter(title => {
        return playCount >= title.unlockCondition.playCount && 
               currentWage >= title.unlockCondition.hourlyWage;
    });
    
    // ID順でソートして最後（最高）の称号を返す
    unlockedTitles.sort((a, b) => a.id - b.id);
    return unlockedTitles.length > 0 ? unlockedTitles[unlockedTitles.length - 1] : null;
}

function getNextTitle(playCount, currentWage) {
    // まだ解放されていない称号の中で最も低いものを取得
    let lockedTitles = window.titles.filter(title => {
        return playCount < title.unlockCondition.playCount || 
               currentWage < title.unlockCondition.hourlyWage;
    });
    
    // ID順でソートして最初（最低）の称号を返す
    lockedTitles.sort((a, b) => a.id - b.id);
    return lockedTitles.length > 0 ? lockedTitles[0] : null;
}

function updateNextTitleInfo(playCount, currentWage) {
    const nextTitle = getNextTitle(playCount, currentWage);
    const nextTitleSection = document.querySelector('.next-title-section');
    
    if (!nextTitle) {
        // 全ての称号を解放済み
        nextTitleSection.innerHTML = `
            <h2>🎉 おめでとうございます！</h2>
            <div class="completion-message">
                <p>あなたは真の「ITの覇者」です！</p>
            </div>
        `;
        return;
    }
    
    // 次の称号情報を更新 : ネタバレしないようにタイトルは表示しない
    // document.getElementById('next-title-name').textContent = nextTitle.name;
    document.getElementById('required-play-count').textContent = `${nextTitle.unlockCondition.playCount}回`;
    document.getElementById('required-wage').textContent = `¥${nextTitle.unlockCondition.hourlyWage.toLocaleString()}`;
    
    // プログレスバーを更新
    updateProgressBars(playCount, currentWage, nextTitle);
}

function updateProgressBars(playCount, currentWage, nextTitle) {
    // プレイ回数のプログレス
    const playProgress = Math.min(100, (playCount / nextTitle.unlockCondition.playCount) * 100);
    document.getElementById('play-progress').style.width = playProgress + '%';
    document.getElementById('play-progress-text').textContent = `${playCount}/${nextTitle.unlockCondition.playCount}`;
    
    // 時給のプログレス
    const wageProgress = Math.min(100, (currentWage / nextTitle.unlockCondition.hourlyWage) * 100);
    document.getElementById('wage-progress').style.width = wageProgress + '%';
    document.getElementById('wage-progress-text').textContent = `¥${currentWage.toLocaleString()}/¥${nextTitle.unlockCondition.hourlyWage.toLocaleString()}`;
}

function displayTitles(playCount, currentWage, filterCategory = 'all') {
    const titlesGrid = document.getElementById('titles-grid');
    titlesGrid.innerHTML = '';
    
    // フィルタリング
    let filteredTitles = window.titles;
    if (filterCategory !== 'all') {
        filteredTitles = window.titles.filter(title => title.category === filterCategory);
    }
    
    filteredTitles.forEach(title => {
        const isUnlocked = playCount >= title.unlockCondition.playCount && 
                          currentWage >= title.unlockCondition.hourlyWage;
        
        const titleCard = createTitleCard(title, isUnlocked);
        titlesGrid.appendChild(titleCard);
    });
}

function createTitleCard(title, isUnlocked) {
    const card = document.createElement('div');
    card.className = `title-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    card.setAttribute('data-title-id', title.id);
    
    card.innerHTML = `
        <div class="title-rarity rarity-${title.rarity}">${getRarityText(title.rarity)}</div>
        <div class="title-name">${isUnlocked ? title.name : '<未収得>'}</div>
        <div class="title-description">${isUnlocked ? title.description : ''}</div>
        <div class="unlock-status ${isUnlocked ? 'unlocked' : 'locked'}">
            ${isUnlocked ? '' : `プレイ${title.unlockCondition.playCount}回・時給¥${title.unlockCondition.hourlyWage.toLocaleString()}`}
        </div>
    `;
    
    // クリックイベント（解放済みの場合のみ）
    if (isUnlocked) {
        card.addEventListener('click', () => showTitleModal(title));
    }
    
    return card;
}

function getRarityText(rarity) {
    const rarityMap = {
        'common': '初級',
        'uncommon': 'ジュニア',
        'rare': '中級',
        'epic': 'シニア',
        'legendary': 'エキスパート',
        'mythical': '神話級'
    };
    return rarityMap[rarity] || rarity;
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // アクティブなボタンを更新
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // フィルタリングして再表示
            const category = button.getAttribute('data-category');
            const playCount = parseInt(localStorage.getItem('wage_play_count') || '0', 10);
            const currentWage = parseInt(localStorage.getItem('wage') || '0', 10);
            displayTitles(playCount, currentWage, category);
        });
    });
}

function setupModal() {
    const modal = document.getElementById('title-modal');
    const closeBtn = document.getElementById('modal-close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // モーダル外をクリックしたら閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showTitleModal(title) {
    const modal = document.getElementById('title-modal');
    
    // モーダルの内容を更新
    document.getElementById('modal-title').textContent = title.name;
    document.getElementById('modal-rarity').className = `title-rarity rarity-${title.rarity}`;
    document.getElementById('modal-rarity').textContent = getRarityText(title.rarity);
    document.getElementById('modal-description').textContent = title.description;
    document.getElementById('modal-real-value').textContent = title.realValue;
    document.getElementById('modal-unlock-condition').textContent = 
        `プレイ回数: ${title.unlockCondition.playCount}回以上、時給: ¥${title.unlockCondition.hourlyWage.toLocaleString()}以上`;
    
    // モーダルを表示
    modal.style.display = 'block';
}

// キーボードでモーダルを閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('title-modal');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
});
