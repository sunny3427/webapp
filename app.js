
const express = require('express');
const unblocker = require('unblocker');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Decode Base64 and redirect
app.use('/proxy/:hash', (req, res, next) => {
  try {
    const hash = req.params.hash;
    const decoded = Buffer.from(hash, 'base64').toString('utf-8');
    req.url = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid Base64 URL.");
  }
});

// Proxy middleware
app.use('/proxy', unblocker({ prefix: '/proxy/' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
