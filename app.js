const express = require("express");
const { createUnblocker } = require("unblocker");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 8080;

// Create Unblocker middleware
const unblocker = createUnblocker({
  prefix: '/_proxy_', // internal routing
  requestMiddleware: [
    (req, res, next) => {
      res.setHeader("x-unblocker", "yes");
      next();
    }
  ]
});

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Endpoint to convert a URL to Base64
app.post("/hash", (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid URL" });
  }
  const encoded = Buffer.from(url).toString("base64");
  res.json({ encoded });
});

// Route to decode Base64 URL and pipe to Unblocker
app.use("/proxy/:encodedUrl", (req, res, next) => {
  try {
    const decodedUrl = Buffer.from(req.params.encodedUrl, "base64").toString("utf-8");
    req.url = "/_proxy_/" + decodedUrl;
    unblocker(req, res, next);
  } catch (err) {
    res.status(400).send("Invalid encoded URL");
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
