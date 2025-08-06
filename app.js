
const express = require('express');
const unblocker = require('unblocker');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Decode Base64 hash to real URL
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

// Unblocker middleware
app.use('/proxy', unblocker({
  prefix: '/proxy/',
  requestMiddleware: []
}));

// Start server
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
