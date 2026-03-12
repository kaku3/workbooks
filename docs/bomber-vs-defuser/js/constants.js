// ============================================================
// constants.js  ゲーム定数・カード・ロケーション定義
// ============================================================

export const ROLES = {
  BOMBER: 'bomber',
  DEFUSER: 'defuser',
};

export const CARD_TYPES = {
  MOVE: 'move',
  ACTION: 'action',
  ITEM: 'item',
};

export const ITEM_SUBTYPES = {
  BOMB_PART: 'bomb_part',   // 爆弾パーツ A/B/C
  DEFUSE_KIT: 'defuse_kit', // 解除キット X/Y/Z
  DUMMY: 'dummy',           // ダミー
};

// 山札に含まれる全カード定義
export const CARD_DEFINITIONS = [
  // --- 移動カード (数字1〜12, 低い数字を多めに) ---
  { id: 'm1a',  type: CARD_TYPES.MOVE, value: 1,  emoji: '🚶', label: '1',  desc: '1マス進む' },
  { id: 'm1b',  type: CARD_TYPES.MOVE, value: 1,  emoji: '🚶', label: '1',  desc: '1マス進む' },
  { id: 'm1c',  type: CARD_TYPES.MOVE, value: 1,  emoji: '🚶', label: '1',  desc: '1マス進む' },
  { id: 'm2a',  type: CARD_TYPES.MOVE, value: 2,  emoji: '🏃', label: '2',  desc: '2マス進む' },
  { id: 'm2b',  type: CARD_TYPES.MOVE, value: 2,  emoji: '🏃', label: '2',  desc: '2マス進む' },
  { id: 'm2c',  type: CARD_TYPES.MOVE, value: 2,  emoji: '🏃', label: '2',  desc: '2マス進む' },
  { id: 'm3a',  type: CARD_TYPES.MOVE, value: 3,  emoji: '🏃', label: '3',  desc: '3マス進む' },
  { id: 'm3b',  type: CARD_TYPES.MOVE, value: 3,  emoji: '🏃', label: '3',  desc: '3マス進む' },
  { id: 'm4a',  type: CARD_TYPES.MOVE, value: 4,  emoji: '🚕', label: '4',  desc: '4マス進む' },
  { id: 'm4b',  type: CARD_TYPES.MOVE, value: 4,  emoji: '🚕', label: '4',  desc: '4マス進む' },
  { id: 'm5a',  type: CARD_TYPES.MOVE, value: 5,  emoji: '🚕', label: '5',  desc: '5マス進む' },
  { id: 'm5b',  type: CARD_TYPES.MOVE, value: 5,  emoji: '🚕', label: '5',  desc: '5マス進む' },
  { id: 'm6a',  type: CARD_TYPES.MOVE, value: 6,  emoji: '🚕', label: '6',  desc: '6マス進む' },
  { id: 'm6b',  type: CARD_TYPES.MOVE, value: 6,  emoji: '🚕', label: '6',  desc: '6マス進む' },
  { id: 'm7a',  type: CARD_TYPES.MOVE, value: 7,  emoji: '🚃', label: '7',  desc: '7マス進む' },
  { id: 'm7b',  type: CARD_TYPES.MOVE, value: 7,  emoji: '🚃', label: '7',  desc: '7マス進む' },
  { id: 'm8a',  type: CARD_TYPES.MOVE, value: 8,  emoji: '🚃', label: '8',  desc: '8マス進む' },
  { id: 'm8b',  type: CARD_TYPES.MOVE, value: 8,  emoji: '🚃', label: '8',  desc: '8マス進む' },
  { id: 'm9a',  type: CARD_TYPES.MOVE, value: 9,  emoji: '🚃', label: '9',  desc: '9マス進む' },
  { id: 'm9b',  type: CARD_TYPES.MOVE, value: 9,  emoji: '🚃', label: '9',  desc: '9マス進む' },
  { id: 'm10a', type: CARD_TYPES.MOVE, value: 10, emoji: '🚅', label: '10', desc: '10マス進む' },
  { id: 'm10b', type: CARD_TYPES.MOVE, value: 10, emoji: '🚅', label: '10', desc: '10マス進む' },
  { id: 'm11a', type: CARD_TYPES.MOVE, value: 11, emoji: '🚅', label: '11', desc: '11マス進む' },
  { id: 'm12a', type: CARD_TYPES.MOVE, value: 12, emoji: '🚅', label: '12', desc: '12マス進む' },

  // --- アクションカード: 手札操作・撹乱 ---
  { id: 'act_trade_a', type: CARD_TYPES.ACTION, action: 'trade',   label: '取引',       desc: '相手を指名して手札を1枚ずつ交換する' },
  { id: 'act_trade_b', type: CARD_TYPES.ACTION, action: 'trade',   label: '取引',       desc: '相手を指名して手札を1枚ずつ交換する' },
  { id: 'act_trade_c', type: CARD_TYPES.ACTION, action: 'trade',   label: '取引',       desc: '相手を指名して手札を1枚ずつ交換する' },
  { id: 'act_steal_a', type: CARD_TYPES.ACTION, action: 'steal',   label: '強奪',       desc: '相手の手札からランダムに1枚奔う' },
  { id: 'act_steal_b', type: CARD_TYPES.ACTION, action: 'steal',   label: '強奪',       desc: '相手の手札からランダムに1枚奔う' },
  { id: 'act_steal_c', type: CARD_TYPES.ACTION, action: 'steal',   label: '強奪',       desc: '相手の手札からランダムに1枚奔う' },
  { id: 'act_pass_a',  type: CARD_TYPES.ACTION, action: 'pass',    label: '横流し',     desc: '全員が手札を1枚選び次のプレイヤーへ渡す' },
  { id: 'act_pass_b',  type: CARD_TYPES.ACTION, action: 'pass',    label: '横流し',     desc: '全員が手札を1枚選び次のプレイヤーへ渡す' },
  { id: 'act_dump_a',  type: CARD_TYPES.ACTION, action: 'dump',    label: 'ポイ捨て',   desc: '相手の手札を1枚ランダムに捨てさせる' },
  { id: 'act_dump_b',  type: CARD_TYPES.ACTION, action: 'dump',    label: 'ポイ捨て',   desc: '相手の手札を1枚ランダムに捨てさせる' },

  // --- アクションカード: 情報収集・推理 ---
  { id: 'act_peek_a',    type: CARD_TYPES.ACTION, action: 'peek',    label: '尋問',     desc: '相手の手札を1枚だけこっそり見る' },
  { id: 'act_peek_b',    type: CARD_TYPES.ACTION, action: 'peek',    label: '尋問',     desc: '相手の手札を1枚だけこっそり見る' },
  { id: 'act_expose_a',  type: CARD_TYPES.ACTION, action: 'expose',  label: '公開捜査', desc: '相手の手札を1枚全員に公開させる' },
  { id: 'act_whisper_a', type: CARD_TYPES.ACTION, action: 'whisper', label: '密談',     desc: '相手と手札を1枚ずつ見せ合う（自分だけ確認）' },

  // --- アクションカード: 妨害 ---
  { id: 'act_skip_a',  type: CARD_TYPES.ACTION, action: 'skip',  label: '足止め',   desc: '任意のプレイヤーの手番を1回飛ばす' },
  { id: 'act_skip_b',  type: CARD_TYPES.ACTION, action: 'skip',  label: '足止め',   desc: '任意のプレイヤーの手番を1回飛ばす' },
  { id: 'act_block_a', type: CARD_TYPES.ACTION, action: 'block', label: '通行止め', desc: '指定したロケーションを次のターン使用不可にする' },

  // --- 追加カード ---
  { id: 'act_detect_a', type: CARD_TYPES.ACTION, action: 'detect', label: '探知機', desc: '爆弾を探知する' },
  { id: 'act_detect_b', type: CARD_TYPES.ACTION, action: 'detect', label: '探知機', desc: '爆弾を探知する' },
  { id: 'act_dash_a',   type: CARD_TYPES.ACTION, action: 'dash',   label: 'ダッシュ', desc: '手持ちの移動カードを選んで移動量+2で移動' },
  { id: 'act_dash_b',   type: CARD_TYPES.ACTION, action: 'dash',   label: 'ダッシュ', desc: '手持ちの移動カードを選んで移動量+2で移動' },
  { id: 'act_smoke_a',  type: CARD_TYPES.ACTION, action: 'smoke',  label: '煙幕',    desc: '相手の手札から移動カード1枚をランダム破棄' },
  { id: 'act_smoke_b',  type: CARD_TYPES.ACTION, action: 'smoke',  label: '煙幕',    desc: '相手の手札から移動カード1枚をランダム破棄' },

];

// アイテムパイル定義（通常デッキとは別に管理。工場・ジャンク屋でのみ取得可能）
// 各パーツ・キットは2枚ずつ（計16枚）。family フィールドで種類を判定
export const ITEM_DEFINITIONS = [
  // 爆弾パーツ：各2枚
  { id: 'item_bomb_a',  type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.BOMB_PART,  family: 'bomb_a', emoji: '💣', label: 'パーツA', desc: '爆弾パーツA' },
  { id: 'item_bomb_a2', type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.BOMB_PART,  family: 'bomb_a', emoji: '💣', label: 'パーツA', desc: '爆弾パーツA' },
  { id: 'item_bomb_b',  type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.BOMB_PART,  family: 'bomb_b', emoji: '💣', label: 'パーツB', desc: '爆弾パーツB' },
  { id: 'item_bomb_b2', type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.BOMB_PART,  family: 'bomb_b', emoji: '💣', label: 'パーツB', desc: '爆弾パーツB' },
  { id: 'item_bomb_c',  type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.BOMB_PART,  family: 'bomb_c', emoji: '💣', label: 'パーツC', desc: '爆弾パーツC' },
  { id: 'item_bomb_c2', type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.BOMB_PART,  family: 'bomb_c', emoji: '💣', label: 'パーツC', desc: '爆弾パーツC' },
  // 解除キット：各3枚
  { id: 'item_kit_x',   type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DEFUSE_KIT, family: 'kit_x', emoji: '🔧', label: 'キットX', desc: '解除キットX' },
  { id: 'item_kit_x2',  type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DEFUSE_KIT, family: 'kit_x', emoji: '🔧', label: 'キットX', desc: '解除キットX' },
  { id: 'item_kit_x3',  type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DEFUSE_KIT, family: 'kit_x', emoji: '🔧', label: 'キットX', desc: '解除キットX' },
  { id: 'item_kit_y',   type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DEFUSE_KIT, family: 'kit_y', emoji: '🔧', label: 'キットY', desc: '解除キットY' },
  { id: 'item_kit_y2',  type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DEFUSE_KIT, family: 'kit_y', emoji: '🔧', label: 'キットY', desc: '解除キットY' },
  { id: 'item_kit_y3',  type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DEFUSE_KIT, family: 'kit_y', emoji: '🔧', label: 'キットY', desc: '解除キットY' },
  { id: 'item_kit_z',   type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DEFUSE_KIT, family: 'kit_z', emoji: '🔧', label: 'キットZ', desc: '解除キットZ' },
  { id: 'item_kit_z2',  type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DEFUSE_KIT, family: 'kit_z', emoji: '🔧', label: 'キットZ', desc: '解除キットZ' },
  { id: 'item_kit_z3',  type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DEFUSE_KIT, family: 'kit_z', emoji: '🔧', label: 'キットZ', desc: '解除キットZ' },
  // ダミー
  { id: 'item_dummy_a', type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DUMMY, emoji: '❓', label: 'ダミー', desc: '探知機の精度を下げる' },
  { id: 'item_dummy_b', type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DUMMY, emoji: '❓', label: 'ダミー', desc: '探知機の精度を下げる' },
  { id: 'item_dummy_c', type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DUMMY, emoji: '❓', label: 'ダミー', desc: '探知機の精度を下げる' },
  { id: 'item_dummy_d', type: CARD_TYPES.ITEM, subtype: ITEM_SUBTYPES.DUMMY, emoji: '❓', label: 'ダミー', desc: '探知機の精度を下げる' },
];

// 爆弾パーツ揃い判定用
export const BOMB_PART_IDS     = ['item_bomb_a', 'item_bomb_b', 'item_bomb_c'];
export const DEFUSE_KIT_IDS    = ['item_kit_x', 'item_kit_y', 'item_kit_z'];

// ============================================================
// ロケーション定義  (14マス: インデックス0〜13)
// ============================================================
export const LOCATIONS = [
  { id: 0,  name: 'スタート',           type: 'start',      emoji: '🏁', desc: 'スタート地点' },
  { id: 1,  name: 'ジャンク屋',         type: 'junk',       emoji: '🔩', desc: 'アイテムパイルからランダムに1枚引く' },
  { id: 2,  name: '酒場',               type: 'pub',        emoji: '🍺', desc: '強制的に誰かと手札1枚交換（ランダム）' },
  { id: 3,  name: '探偵事務所',         type: 'detective',  emoji: '🕵️', desc: '誰かの手札を1枚こっそり見る' },
  { id: 4,  name: 'パーツ工場',         type: 'factory',    emoji: '🏭', desc: 'アイテムパイルを全て見て1枚選んで引く（サーチ）' },
  { id: 5,  name: 'カジノ',             type: 'casino',     emoji: '🎰', desc: 'サイコロ：偶数→2枚ドロー、奇数→1枚没収' },
  { id: 6,  name: 'タワー',             type: 'tower',      emoji: '🗼', desc: '山札を見て1枚選んで引く。爆弾魔はパーツ3種揃いで起爆可能！' },
  { id: 7,  name: 'スクランブル交差点', type: 'crossing',   emoji: '🚦', desc: '全員が手札を1枚ずつ次プレイヤーに回す' },
  { id: 8,  name: '交番',               type: 'police_box', emoji: '🚔', desc: '相手を指名して手札を1枚ランダムに捨てさせる' },
  { id: 9,  name: '闇市',               type: 'black_mkt',  emoji: '🥷', desc: '捨て札から好きなカードを1枚拾う' },
  { id: 10, name: '放送局',             type: 'broadcast',  emoji: '📺', desc: '自分の手札1枚を全員に公開し、その後1枚引く' },
  { id: 11, name: '工事現場',           type: 'construct',  emoji: '🚧', desc: '1回休み（次のターン移動できない）' },
  { id: 12, name: '廃材置き場',         type: 'salvage',    emoji: '🪨', desc: 'アイテムパイルからランダムに1枚引く' },
  { id: 13, name: '病院',               type: 'hospital',   emoji: '🏥', desc: '手札を全て捨て、山札から5枚引き直す' },
  { id: 14, name: '警察本部',           type: 'police_hq',  emoji: '🚓', desc: '誰かの陣営（爆弾魔/解除班）をこっそり知る' },
  { id: 15, name: '裏路地',             type: 'alley',      emoji: '🌃', desc: '捨て札3枚からランダムに1枚選んで拾う' },
];

export const TOTAL_LOCATIONS = LOCATIONS.length; // 16
