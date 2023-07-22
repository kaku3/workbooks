const express = require('express');
const request = require('request');

const app = express();
const port = 3001; // プロキシサーバーのポート番号

app.use('/', (req, res) => {
  const url = 'https://webservice.recruit.co.jp' + req.url;
  req.pipe(request(url)).pipe(res);
});

app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
