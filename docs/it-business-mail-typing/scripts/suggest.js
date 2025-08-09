// サジェスト管理（アイドル時に次キーを提示）
// 構成はそのまま（JS/CSS/HTML）で、game.js から初期化・通知します。
(function () {
	'use strict';

	// 簡易かな→ローマ字（先頭と残り）
	function kanaToRomaji(k) {
		if (!k) return null;
		const base = {
			'あ':'a','い':'i','う':'u','え':'e','お':'o',
			'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
			'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
			'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
			'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
			'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
			'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
			'や':'ya','ゆ':'yu','よ':'yo',
			'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
			'わ':'wa','を':'wo','ん':'n',
			'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
			'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
			'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
			'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
			'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
			'ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o',
			'ゃ':'ya','ゅ':'yu','ょ':'yo','っ':'xtsu',
			'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
			'カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
			'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so',
			'タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
			'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no',
			'ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
			'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo',
			'ヤ':'ya','ユ':'yu','ヨ':'yo',
			'ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro',
			'ワ':'wa','ヲ':'wo','ン':'n',
			'ガ':'ga','ギ':'gi','グ':'gu','ゲ':'ge','ゴ':'go',
			'ザ':'za','ジ':'ji','ズ':'zu','ゼ':'ze','ゾ':'zo',
			'ダ':'da','ヂ':'ji','ヅ':'zu','デ':'de','ド':'do',
			'バ':'ba','ビ':'bi','ブ':'bu','ベ':'be','ボ':'bo',
			'パ':'pa','ピ':'pi','プ':'pu','ペ':'pe','ポ':'po',
			'ァ':'a','ィ':'i','ゥ':'u','ェ':'e','ォ':'o',
			'ャ':'ya','ュ':'yu','ョ':'yo','ッ':'xtsu'
		};
		const r = base[k];
		if (r) return r;
		// ASCII はそのまま
		if (/^[A-Za-z0-9]$/.test(k)) return k.toLowerCase();
		if (k === ' ') return 'space';
		return null;
	}

	function romajiHead(ch) {
		const map = {
			'あ':'a','い':'i','う':'u','え':'e','お':'o',
			'か':'k','き':'k','く':'k','け':'k','こ':'k',
			'さ':'s','し':'s','す':'s','せ':'s','そ':'s',
			'た':'t','ち':'c','つ':'t','て':'t','と':'t',
			'な':'n','に':'n','ぬ':'n','ね':'n','の':'n',
			'は':'h','ひ':'h','ふ':'f','へ':'h','ほ':'h',
			'ま':'m','み':'m','む':'m','め':'m','も':'m',
			'や':'y','ゆ':'y','よ':'y',
			'ら':'r','り':'r','る':'r','れ':'r','ろ':'r',
			'わ':'w','を':'w','ん':'n',
			'が':'g','ぎ':'g','ぐ':'g','げ':'g','ご':'g',
			'ざ':'z','じ':'j','ず':'z','ぜ':'z','ぞ':'z',
			'だ':'d','ぢ':'j','づ':'z','で':'d','ど':'d',
			'ば':'b','び':'b','ぶ':'b','べ':'b','ぼ':'b',
			'ぱ':'p','ぴ':'p','ぷ':'p','ぺ':'p','ぽ':'p',
			'ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o',
			'ゃ':'y','ゅ':'y','ょ':'y','っ':'t',
			'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
			'カ':'k','キ':'k','ク':'k','ケ':'k','コ':'k',
			'サ':'s','シ':'s','ス':'s','セ':'s','ソ':'s',
			'タ':'t','チ':'c','ツ':'t','テ':'t','ト':'t',
			'ナ':'n','ニ':'n','ヌ':'n','ネ':'n','ノ':'n',
			'ハ':'h','ヒ':'h','フ':'f','ヘ':'h','ホ':'h',
			'マ':'m','ミ':'m','ム':'m','メ':'m','モ':'m',
			'ヤ':'y','ユ':'y','ヨ':'y',
			'ラ':'r','リ':'r','ル':'r','レ':'r','ロ':'r',
			'ワ':'w','ヲ':'w','ン':'n',
			'ガ':'g','ギ':'g','グ':'g','ゲ':'g','ゴ':'g',
			'ザ':'z','ジ':'j','ズ':'z','ゼ':'z','ゾ':'z',
			'ダ':'d','ヂ':'j','ヅ':'z','デ':'d','ド':'d',
			'バ':'b','ビ':'b','ブ':'b','ベ':'b','ボ':'b',
			'パ':'p','ピ':'p','プ':'p','ペ':'p','ポ':'p',
			'ァ':'a','ィ':'i','ゥ':'u','ェ':'e','ォ':'o',
			'ャ':'y','ュ':'y','ョ':'y','ッ':'t'
		};
		if (!ch) return null;
		const m = map[ch];
		if (m) return m;
		const c = String(ch).trim();
		if (!c) return null;
		const head = c[0];
		if (/[A-Za-z]/.test(head)) return head.toLowerCase();
		if (head === ' ') return 'Space';
		return null;
	}

	function defaultNextKeyResolver() {
		// lines/currentLineIndex/inputArea は game.js 側のグローバルを参照
		try {
			const arr = (typeof window.lines !== 'undefined') ? window.lines : null;
			const idx = (typeof window.currentLineIndex === 'number') ? window.currentLineIndex : 0;
			const line = arr && arr[idx] ? arr[idx] : '';
			const typed = (window.inputArea && typeof window.inputArea.value === 'string') ? window.inputArea.value : '';
			const committed = (typeof window.correctChars === 'number' && window.correctChars >= 0) ? window.correctChars : typed.length;
			if (!line || committed >= line.length) return null;

			// 1) まず ruby.js が使えるなら読み仮名から推定（漢字対応）
			const cq = (typeof window.currentQuestion !== 'undefined' && window.currentQuestion) ? window.currentQuestion : (typeof currentQuestion !== 'undefined' ? currentQuestion : null);
			if (typeof window.getExpandedLineCharacters === 'function' && cq && cq.id != null) {
				const chars = window.getExpandedLineCharacters(cq.id, idx) || [];
				const next = chars[committed];
				if (next) {
					const reading = next.ruby || next.char || '';
					const k = reading ? reading[0] : '';
					const romaji = kanaToRomaji(k);
					if (romaji && romaji.length > 0) {
						const composing = !!(window.isComposing || window.isComposingText);
						const last = (typeof window.lastPhysicalKey === 'string') ? window.lastPhysicalKey.toLowerCase() : null;
						// 安全策: 1打目が直近で入力済みなら、誤サジェストを避けるため何も出さない
						if (composing && last && last === romaji[0]) {
							return null;
						}
						// 常に先頭1文字のみを提示
						return romaji[0];
					}
					const head = romajiHead(k);
					if (head) return head.toLowerCase();
				}
			}

			// 2) フォールバック: 表示行テキストから推定（かなは対応、英数/記号はそのまま、スペースは Space）
			const nextChar = line[committed];
			const key = romajiHead(nextChar) || nextChar;
			return key && key.length ? (key.toLowerCase ? key.toLowerCase() : key) : null;
		} catch (e) {
			return null;
		}
	}

	function SuggestController(options) {
		options = options || {};
		this.keyboard = options.keyboard || null;
		this.inputEl = options.inputEl || null;
		this.idleMs = typeof options.idleMs === 'number' ? options.idleMs : 1200;
		this.repeatMs = typeof options.repeatMs === 'number' ? options.repeatMs : 900;
		this.getNextKey = typeof options.getNextKey === 'function' ? options.getNextKey : defaultNextKeyResolver;
		this._idleTimer = null;
		this._repeatTimer = null;
		this._lastInputAt = (window.performance && performance.now) ? performance.now() : Date.now();
		this._boundReset = this.notifyInput.bind(this);
		// 同じ位置での再サジェスト抑止（1打目済みなら位置が進むまで出さない）
		this._suppressIndex = null;
	}

	SuggestController.prototype.start = function () {
		if (this.inputEl) {
			const el = this.inputEl;
			el.addEventListener('input', this._boundReset);
			el.addEventListener('compositionstart', this._boundReset);
			el.addEventListener('compositionupdate', this._boundReset);
			el.addEventListener('compositionend', this._boundReset);
			el.addEventListener('keydown', this._boundReset);
		}
		this._armIdle();
	};

	SuggestController.prototype.stop = function () {
		if (this.inputEl) {
			const el = this.inputEl;
			el.removeEventListener('input', this._boundReset);
			el.removeEventListener('compositionstart', this._boundReset);
			el.removeEventListener('compositionupdate', this._boundReset);
			el.removeEventListener('compositionend', this._boundReset);
			el.removeEventListener('keydown', this._boundReset);
		}
		if (this._idleTimer) { clearTimeout(this._idleTimer); this._idleTimer = null; }
		if (this._repeatTimer) { clearInterval(this._repeatTimer); this._repeatTimer = null; }
		this._suppressIndex = null;
	};

	SuggestController.prototype.notifyInput = function () {
		this._lastInputAt = (window.performance && performance.now) ? performance.now() : Date.now();
		if (this._idleTimer) { clearTimeout(this._idleTimer); this._idleTimer = null; }
		if (this._repeatTimer) { clearInterval(this._repeatTimer); this._repeatTimer = null; }
		// 入力があれば既存のサジェストをすぐに消す
		if (this.keyboard && typeof this.keyboard.clearNextKeySuggestion === 'function') {
			try { this.keyboard.clearNextKeySuggestion(); } catch (_) {}
		}
		// 位置が進んだら抑制解除
		const committed = (typeof window.correctChars === 'number' && window.correctChars >= 0)
			? window.correctChars
			: ((window.inputArea && typeof window.inputArea.value === 'string') ? window.inputArea.value.length : 0);
		if (this._suppressIndex !== null && committed > this._suppressIndex) {
			this._suppressIndex = null;
		}
		this._armIdle();
	};

	SuggestController.prototype._armIdle = function () {
		this._idleTimer = setTimeout(() => {
			this._idleTimer = null;
			this._fireOnce();
			this._repeatTimer = setInterval(() => {
				const now = (window.performance && performance.now) ? performance.now() : Date.now();
				if (now - this._lastInputAt < Math.min(this.repeatMs, this.idleMs)) {
					clearInterval(this._repeatTimer);
					this._repeatTimer = null;
					return;
				}
				this._fireOnce();
			}, this.repeatMs);
		}, this.idleMs);
	};

	SuggestController.prototype._fireOnce = function () {
		if (!this.keyboard) return;

		const composingNow = !!(window.isComposing || window.isComposingText);
		// IME編集中は提示しない（2打目や次文字の誤サジェスト防止）
		if (composingNow) {
			if (typeof this.keyboard.clearNextKeySuggestion === 'function') this.keyboard.clearNextKeySuggestion();
			return;
		}
		const committed = (typeof window.correctChars === 'number' && window.correctChars >= 0)
			? window.correctChars
			: ((window.inputArea && typeof window.inputArea.value === 'string') ? window.inputArea.value.length : 0);

		// サジェスト対象の行情報
		const arr = (typeof window.lines !== 'undefined') ? window.lines : null;
		const lineIdx = (typeof window.currentLineIndex === 'number') ? window.currentLineIndex : 0;
		const line = arr && arr[lineIdx] ? arr[lineIdx] : '';
		if (!line || committed >= line.length) {
			if (typeof this.keyboard.clearNextKeySuggestion === 'function') this.keyboard.clearNextKeySuggestion();
			return;
		}

		// 参照位置は常に committed（IME中の前進はしない）
		let pos = committed;

		// pos の文字のローマ字頭を計算
		let head = null;
		const cq = (typeof window.currentQuestion !== 'undefined' && window.currentQuestion) ? window.currentQuestion : (typeof currentQuestion !== 'undefined' ? currentQuestion : null);
		if (typeof window.getExpandedLineCharacters === 'function' && cq && cq.id != null) {
			const chars = window.getExpandedLineCharacters(cq.id, lineIdx) || [];
			const ch = chars[pos];
			if (ch) {
				const reading = ch.ruby || ch.char || '';
				const k = reading ? reading[0] : '';
				const r = kanaToRomaji(k);
				head = r ? r[0] : (romajiHead(k) || null);
			}
		}
		if (!head) {
			const nextChar = line[pos];
			head = romajiHead(nextChar) || (nextChar ? String(nextChar)[0].toLowerCase() : null);
		}

		if (!head) {
			if (typeof this.keyboard.clearNextKeySuggestion === 'function') this.keyboard.clearNextKeySuggestion();
			return;
		}

		// 直近の物理キーと同じなら、現在位置を抑制（IME中は次の文字に進めるトリガーにもなる）
		const last = (typeof window.lastPhysicalKey === 'string') ? window.lastPhysicalKey.toLowerCase() : null;
		if (last && last === head.toLowerCase()) {
			this._suppressIndex = committed;
			if (typeof this.keyboard.clearNextKeySuggestion === 'function') this.keyboard.clearNextKeySuggestion();
			return;
		}

		if (typeof this.keyboard.showHintRipple === 'function') this.keyboard.showHintRipple(head);
		if (typeof this.keyboard.showNextKeySuggestion === 'function') this.keyboard.showNextKeySuggestion(head.length === 1 ? head.toUpperCase() : head);
	};

	// export
	window.SuggestController = SuggestController;
	window.SuggestUtils = { romajiHead: romajiHead };
})();

