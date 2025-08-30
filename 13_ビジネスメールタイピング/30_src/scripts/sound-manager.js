// サウンド制御用クラス
// BGM・SEの再生、停止、音量管理、ミュート対応

// サウンド制御用クラス（グローバルwindow.soundManagerとして利用）
function SoundManager() {
    this.sounds = {};
    this.bgm = null;
    this.bgmVolume = 1.0;
    this.seVolume = 1.0;
    this.muted = false;
}
SoundManager.prototype.load = function(name, src, isBgm = false) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    if (isBgm) {
        audio.loop = true;
    }
    this.sounds[name] = { audio, isBgm };
};
SoundManager.prototype.play = function(name) {
    const sound = this.sounds[name];
    if (!sound) return;
    if (this.muted) return;
    if (sound.isBgm) {

console.log(`Playing BGM: ${name}`, sound);

        // すでに再生中なら何もしない（頭出し防止）
        if (!sound.audio.paused && !sound.audio.ended && sound.audio.currentTime > 0) {
            return;
        }
        if (this.bgm && this.bgm !== sound.audio) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
        }
        this.bgm = sound.audio;
        this.bgm.volume = this.bgmVolume;
        this.bgm.currentTime = 0;
        this.bgm.play();
    } else {
        sound.audio.volume = this.seVolume;
        sound.audio.currentTime = 0;
        sound.audio.play();
    }
};
SoundManager.prototype.stop = function(name) {
    const sound = this.sounds[name];
    if (!sound) return;
    sound.audio.pause();
    sound.audio.currentTime = 0;
    if (sound.isBgm && this.bgm === sound.audio) {
        this.bgm = null;
    }
};
SoundManager.prototype.setBgmVolume = function(vol) {
    this.bgmVolume = vol;
    if (this.bgm) this.bgm.volume = vol;
};
SoundManager.prototype.setSeVolume = function(vol) {
    this.seVolume = vol;
};
SoundManager.prototype.mute = function() {
    this.muted = true;
    if (this.bgm) this.bgm.pause();
};
SoundManager.prototype.unmute = function() {
    this.muted = false;
    if (this.bgm) this.bgm.play();
};
SoundManager.prototype.isMuted = function() {
    return this.muted;
};

window.soundManager = new SoundManager();
// 使い方例:
// window.soundManager.load('bgm', 'sounds/bgm.mp3', true);
// window.soundManager.load('se-ok', 'sounds/se-ok.mp3');
// window.soundManager.play('bgm');
// window.soundManager.play('se-ok');
// window.soundManager.setBgmVolume(0.5);
// window.soundManager.setSeVolume(0.8);
// window.soundManager.mute();
// window.soundManager.unmute();


// --- タイピングSE（効果音）コンボ・順次再生機能 ---
SoundManager.prototype._typingSeFiles = ['type01', 'type02', 'type03', 'type04', 'type05'];
SoundManager.prototype._typingSeThresholds = [10, 25, 50, 100]; // 追加タイミング
SoundManager.prototype._typingSeCombo = 0;
SoundManager.prototype._typingSeList = ['type01'];
SoundManager.prototype._typingSeIndex = 0;

// タイピングSE用ファイルを事前ロードする（必要に応じて呼び出し）
SoundManager.prototype.loadTypingSe = function() {
    for (let i = 1; i <= 5; i++) {
        this.load('type0' + i, 'sounds/type0' + i + '.mp3');
    }
};

// 正打時に呼ぶ: combo加算＆SE再生
SoundManager.prototype.playTypingSe = function() {
    this._typingSeCombo++;
    // 閾値到達でSEリスト拡張（従来通り）
    for (let i = 0; i < this._typingSeThresholds.length; i++) {
        if (this._typingSeCombo === this._typingSeThresholds[i] && this._typingSeList.length < i + 2) {
            this._typingSeList.push(this._typingSeFiles[i + 1]);
        }
    }

    let seName = 'type01';
    // type01, type02は交互
    if (this._typingSeList.length >= 2) {
        seName = (this._typingSeIndex % 2 === 0) ? 'type01' : 'type02';
    }
    // type05: 15回に1回
    if (this._typingSeList.includes('type05') && this._typingSeCombo % 15 === 0) {
        seName = 'type05';
    }
    // type04: 10回に1回
    else if (this._typingSeList.includes('type04') && this._typingSeCombo % 10 === 0) {
        seName = 'type04';
    }
    // type03: 5回に1回
    else if (this._typingSeList.includes('type03') && this._typingSeCombo % 5 === 0) {
        seName = 'type03';
    }
    this.play(seName);
    this._typingSeIndex++;
};

// ミス時に呼ぶ: comboリセット
SoundManager.prototype.resetTypingSeCombo = function() {
    this._typingSeCombo = 0;
    this._typingSeList = ['type01'];
    this._typingSeIndex = 0;
};
