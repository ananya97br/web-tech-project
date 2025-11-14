const express = require("express");
const { run } = require("./database");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    const db = await run();
    const users = db.collection("users");
    const existingUser = await users.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    await users.insertOne({ username, password });
    res.json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
