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
SoundManager.prototype._typingSeThresholds = [2, 5, 10, 20, 50]; // 追加タイミング
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
    // 閾値到達でSEリスト拡張
    for (let i = 0; i < this._typingSeThresholds.length; i++) {
        if (this._typingSeCombo === this._typingSeThresholds[i] && this._typingSeList.length < i + 2) {
            this._typingSeList.push(this._typingSeFiles[i + 1]);
        }
    }
    // 順番に再生
    const seName = this._typingSeList[this._typingSeIndex % this._typingSeList.length];
    this.play(seName);
    this._typingSeIndex++;
};

// ミス時に呼ぶ: comboリセット
SoundManager.prototype.resetTypingSeCombo = function() {
    this._typingSeCombo = 0;
    this._typingSeList = ['type01'];
    this._typingSeIndex = 0;
};
