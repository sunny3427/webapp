const express = require('express');
const request = require('request');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

function decodeBase64Url(encoded) {
  return Buffer.from(encoded, 'base64').toString('utf8');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/encoded/:url', (req, res) => {
  try {
    const decodedUrl = decodeBase64Url(req.params.url);
    req.pipe(request(decodedUrl)).pipe(res);
  } catch (e) {
    res.status(400).send('Invalid encoded URL');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
