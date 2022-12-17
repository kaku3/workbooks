const fs = require('fs')
const { getGamesJapan } = require('nintendo-switch-eshop');

// game 一覧を取得して保存
async function main() {
    const games = await getGamesJapan();
    fs.writeFileSync('./data/games.json', JSON.stringify(games), 'utf-8');
}

main();
