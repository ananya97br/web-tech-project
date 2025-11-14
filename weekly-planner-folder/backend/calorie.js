

const express = require("express");
const { MongoClient } = require("mongodb");

const router = express.Router();
const url = "mongodb://localhost:27017"; // Adjust MongoDB URI
const dbName = "plannerDB";

async function getDb() {
  const client = new MongoClient(url);
  await client.connect();
  return client.db(dbName);
}

// Add calorie entry
router.post("/", async (req, res) => {
  try {
    const { username, calories } = req.body;
    if (!username || !calories) {
      return res.status(400).json({ message: "Username and calories required" });
    }

    const db = await getDb();
    const collection = db.collection("calories");

    await collection.insertOne({
      username,
      calories: Number(calories),
      date: new Date(),
    });

    res.json({ message: "Calorie entry added" });
  } catch (error) {
    console.error("Failed saving calorie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get calorie entries by username
router.get("/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const db = await getDb();
    const collection = db.collection("calories");

    const entries = await collection.find({ username }).sort({ date: -1 }).toArray();
    res.json(entries);
  } catch (error) {
    console.error("Failed fetching calories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

