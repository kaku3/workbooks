// scripts/settings.js

const settingsModal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const userCompanyInput = document.getElementById('user-company');
const userNameInput = document.getElementById('user-name');
const customerCompanyInput = document.getElementById('customer-company');
const customerNameInput = document.getElementById('customer-name');

// 音量設定要素
const bgmVolumeSlider = document.getElementById('bgm-volume');
const bgmVolumeValue = document.getElementById('bgm-volume-value');
const seVolumeSlider = document.getElementById('se-volume');
const seVolumeValue = document.getElementById('se-volume-value');

const USER_INFO_KEY = 'typingGameUserInfo';
const VOLUME_SETTINGS_KEY = 'typingGameVolumeSettings';

function saveUserInfo(info) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
}

function loadUserInfo() {
    const info = localStorage.getItem(USER_INFO_KEY);
    return info ? JSON.parse(info) : null;
}

function saveVolumeSettings(settings) {
    localStorage.setItem(VOLUME_SETTINGS_KEY, JSON.stringify(settings));
}

function loadVolumeSettings() {
    const settings = localStorage.getItem(VOLUME_SETTINGS_KEY);
    return settings ? JSON.parse(settings) : { bgm: 30, se: 80 };
}

function showSettingsModal() {
    const userInfo = loadUserInfo();
    if (userInfo) {
        userCompanyInput.value = userInfo.company || '';
        userNameInput.value = userInfo.name || '';
        customerCompanyInput.value = userInfo.customer_company || '';
        customerNameInput.value = userInfo.customer_name || '';
    }
    
    // 音量設定を読み込み
    const volumeSettings = loadVolumeSettings();
    bgmVolumeSlider.value = volumeSettings.bgm;
    seVolumeSlider.value = volumeSettings.se;
    bgmVolumeValue.textContent = volumeSettings.bgm + '%';
    seVolumeValue.textContent = volumeSettings.se + '%';
    
    settingsModal.classList.add('active');
}

function hideSettingsModal() {
    settingsModal.classList.remove('active');
}

function initSettings() {
    settingsBtn.addEventListener('click', showSettingsModal);
    
    // 音量スライダーのイベントリスナー
    bgmVolumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        bgmVolumeValue.textContent = value + '%';
        // リアルタイムでBGM音量を反映
        if (window.soundManager) {
            window.soundManager.setBgmVolume(value / 100);
        }
    });
    
    seVolumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        seVolumeValue.textContent = value + '%';
        // リアルタイムでSE音量を反映
        if (window.soundManager) {
            window.soundManager.setSeVolume(value / 100);
        }
    });
    
    saveSettingsBtn.addEventListener('click', () => {
        const userInfo = {
            company: userCompanyInput.value,
            name: userNameInput.value,
            customer_company: customerCompanyInput.value,
            customer_name: customerNameInput.value,
        };
        saveUserInfo(userInfo);
        
        // 音量設定を保存
        const volumeSettings = {
            bgm: parseInt(bgmVolumeSlider.value),
            se: parseInt(seVolumeSlider.value)
        };
        saveVolumeSettings(volumeSettings);
        
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

    // アプリ起動時に保存された音量設定を適用
    const volumeSettings = loadVolumeSettings();
    if (window.soundManager) {
        window.soundManager.setBgmVolume(volumeSettings.bgm / 100);
        window.soundManager.setSeVolume(volumeSettings.se / 100);
    }

    // 初回起動チェック（game.jsで処理するため無効化）
    // if (!loadUserInfo()) {
    //     showSettingsModal();
    // }
}
