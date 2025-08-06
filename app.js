const express = require("express");
const fetch = require("node-fetch");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/proxy/*", async (req, res) => {
  const targetUrl = req.params[0];

  if (!targetUrl || !targetUrl.startsWith("http")) {
    return res.status(400).send("Invalid or missing target URL.");
  }

  try {
    const response = await fetch(targetUrl);
    const body = await response.text();

    res.set("Content-Type", response.headers.get("content-type") || "text/plain");
    res.send(body);
  } catch (err) {
    res.status(500).send("Error fetching target: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
