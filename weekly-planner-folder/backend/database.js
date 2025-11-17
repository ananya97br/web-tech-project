const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";//MongoDB connection string
const dbName = "plannerDB";

let client; 

async function run() {
  if (!client || !client.topology?.isConnected()) {
    client = new MongoClient(url);
    await client.connect();
  }
  return client.db(dbName);
}

module.exports = { run };
