const express = require('express');
const { Unblocker } = require('unblocker');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'views')));

// Base64 decode the hashed URL
app.use('/proxy/:hash', (req, res, next) => {
  try {
    const hash = req.params.hash;
    const decoded = Buffer.from(hash, 'base64').toString('utf-8');
    req.url = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid URL encoding.");
  }
});

// Initialize Unblocker middleware
app.use('/proxy', Unblocker({
  prefix: '/proxy',
  responseMiddleware: [],
  requestMiddleware: []
}));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
