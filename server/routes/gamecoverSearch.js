const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const { title } = req.query;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const steamRes = await fetch(
      `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&cc=us&l=en`
    );
    const data = await steamRes.json();

    if (data.items && data.items.length > 0) {
      const appId = data.items[0].id;
      const coverImage = `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
      return res.json({ coverImage });
    }

    res.json({ coverImage: "" });
  } catch (err) {
    console.error("Cover search error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;