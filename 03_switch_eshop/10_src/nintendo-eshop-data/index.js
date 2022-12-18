// eshop 情報収集ツール
// 【使い方】
// node index.js
// 
// {OUT_FOLDER} にゲーム一覧、各ゲーム詳細情報を出力
//   games.json             # ゲーム一覧
//   details/
//     {InitialCode}.json   # 各ゲーム詳細情報
//
// {THUMBNAIL_FOLDER} にサムネイルを保存
//   {InitialCode}.jpg      # 320x サムネイル

const fs = require('fs')
const { getGamesJapan } = require('nintendo-switch-eshop');
const got = require('got');
const cheerio = require('cheerio');

const axios = require('axios');
const sharp = require('sharp');

const OUT_FOLDER = '../nintendo-eshop/assets/eshop/'
const THUMBNAIL_FOLDER = '../nintendo-eshop/static/images/eshop/games/'
const BASE_URL = 'https://store-jp.nintendo.com/list/software/';

function gameUrl(game) {
  return BASE_URL + game.LinkURL.replace('/titles/', '') + '.html';
}

// ゲーム一覧取得
async function getGames() {
  const games = await getGamesJapan();
  fs.writeFileSync(OUT_FOLDER + 'games.json', JSON.stringify(games), 'utf-8');
  return games;
}

// ゲーム詳細情報取得
// ※存在しないファイルだけ取得
async function getGameDetail(i, game) {
  const file = `${OUT_FOLDER}details/${game.InitialCode}.json`;

  if(fs.existsSync(file)) {
    console.log(`# skip : getGameDetail(${i}, ${game.InitialCode}, ${game.TitleName})`);
    return;
  }

  const response = await got(gameUrl(game));
  const $ = cheerio.load(response.body);

  const categories = []
  const players = []

  const _categories = $('ul.productDetail--tag > li.productDetail--tag__item > a.productDetail--tag__link');
  _categories.each((i, e) => {
    categories.push($(e).text().trim());
  });
  const _players = $('table.productDetail--spec tr.productDetail--spec__player')
  _players.each((i, e) => {
    players.push({
      key: $('th', e).text(),
      value: $('td', e).text()
    });
  });

  const o = {
    InitialCode: game.InitialCode,
    categories,
    players
  }
  fs.writeFileSync(file, JSON.stringify(o), 'utf-8');
  console.log(`# saved : getGameDetail(${i}, ${game.InitialCode}, ${game.TitleName})`);
}

// ゲームサムネイル取得
// ※存在しないファイルだけ取得
async function getGameThumbnail(i, game) {
  const file = THUMBNAIL_FOLDER + game.InitialCode + '.jpg';

  if(fs.existsSync(file)) {
    console.log(`# skip : getGameThumbnail(${i}, ${game.InitialCode}, ${game.TitleName})`);
    return;
  }

  // screen shot を取得してリサイズして保存
  const res = await axios.get(game.ScreenshotImgURL, { responseType: 'arraybuffer' });
  const thumbnail = await sharp(res.data)
    .resize(320)
    .jpeg()
    .toBuffer();
  fs.writeFileSync(file, thumbnail, 'binary');
  console.log(`# saved : getGameThumbnail(${i}, ${game.InitialCode}, ${game.TitleName})`);
}

async function main() {
  // ゲーム一覧取得
  const games = await getGames()
  console.log(games.length);

  // ゲーム詳細情報取得
  for(let i in games) {
    await getGameDetail(i, games[i]);
  }
  // サムネイル画像取得
  for(let i in games) {
    await getGameThumbnail(i, games[i]);
  }
}
main();
