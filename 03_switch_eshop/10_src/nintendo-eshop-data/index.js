const fs = require('fs')
const { getGamesJapan } = require('nintendo-switch-eshop');
const got = require('got');
const cheerio = require('cheerio');

const BASE_URL = 'https://store-jp.nintendo.com/list/software/';

function gameUrl(game) {
  return BASE_URL + game.LinkURL.replace('/titles/', '') + '.html';
}

// ゲーム一覧取得
async function getGames() {
  const games = await getGamesJapan();
  fs.writeFileSync('./data/games.json', JSON.stringify(games), 'utf-8');
  return games;
}

// ゲーム情報詳細取得
// ※存在しないファイルだけ取得
async function getGameDetail(game) {
  console.log(`+ getGameDetail(${game.InitialCode}, ${game.TitleName})`)
  const file = `./data/games/${game.InitialCode}.json`;

  if(fs.existsSync(file)) {
    console.log(`- skip : getGameDetail(${game.InitialCode}, ${game.TitleName})`);
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
  console.log(`- saved : getGameDetail(${game.InitialCode}, ${game.TitleName})`);
}

// game 一覧を取得して保存
async function main() {
  const games = await getGames()
  console.log(games.length);
  for(let i in games) {
    console.log(i)
    await getGameDetail(games[i])
  }
}

main();
