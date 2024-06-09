const axios = require('axios');
const fs = require('fs');

const config = require('./config');

function getUserArticlesUrl(user, page) {
  return `https://qiita.com/api/v2/users/${user}/items?page=${page}&per_page=100`;
}

const articles = [];

async function fetch(token, user) {
  console.group('+ fetch', token, user);
  for(let page = 1; page <= 5; page++) {
    const url = getUserArticlesUrl(user, page);    

    const res = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const items = res.data;

    console.info(url, items.length);

    if(items.length > 0) {
      articles.push(...items);
    } else {
      break;
    }
  }
  console.groupEnd();
  console.info(articles.length);
  fs.writeFileSync(
    'templates/data/articles.js',
    'const ARTICLES = ' + JSON.stringify(articles, null, 2),
    'utf-8'
  );
}

(async () => {
  await fetch(config.token, 'kaku3');
})();
