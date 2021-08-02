const { err, success } = require('@cyber_patrick/colorfullog');
const { MongoClient } = require('mongodb');

const client = new MongoClient(`mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/telegram-panel?retryWrites=true&w=majority`);

const dbName = process.env.DB_NAME;

async function connect() {
  if (!dbName) err('No dbName');
  try {
    await client.connect();
    success('Connected to database');
    return client.db(dbName);
  } catch(error) {
    err('Unable to connect to database');
  }
}

module.exports = connect;