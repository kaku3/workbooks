// scripts/settings.js

const settingsModal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const userCompanyInput = document.getElementById('user-company');
const userNameInput = document.getElementById('user-name');
const customerCompanyInput = document.getElementById('customer-company');
const customerNameInput = document.getElementById('customer-name');

const USER_INFO_KEY = 'typingGameUserInfo';

function saveUserInfo(info) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
}

function loadUserInfo() {
    const info = localStorage.getItem(USER_INFO_KEY);
    return info ? JSON.parse(info) : null;
}

function showSettingsModal() {
    const userInfo = loadUserInfo();
    if (userInfo) {
        userCompanyInput.value = userInfo.company || '';
        userNameInput.value = userInfo.name || '';
        customerCompanyInput.value = userInfo.customer_company || '';
        customerNameInput.value = userInfo.customer_name || '';
    }
    settingsModal.classList.add('active');
}

function hideSettingsModal() {
    settingsModal.classList.remove('active');
}

function initSettings() {
    settingsBtn.addEventListener('click', showSettingsModal);
    saveSettingsBtn.addEventListener('click', () => {
        const userInfo = {
            company: userCompanyInput.value,
            name: userNameInput.value,
            customer_company: customerCompanyInput.value,
            customer_name: customerNameInput.value,
        };
        saveUserInfo(userInfo);
        hideSettingsModal();
        // 設定変更をUIに即時反映させるため、必要に応じて再描画処理を呼び出す
        // 例: location.reload(); や、特定のUI更新関数を呼び出す
    });

    // モーダル外クリックで閉じる
    window.addEventListener('click', (event) => {
        if (event.target == settingsModal) {
            hideSettingsModal();
        }
    });

    // 初回起動チェック（game.jsで処理するため無効化）
    // if (!loadUserInfo()) {
    //     showSettingsModal();
    // }
}
