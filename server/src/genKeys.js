require('dotenv').config();

const argv = require('minimist')(process.argv.slice(2));
const Key = require('./models/key');
const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.connect(argv.dev ? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
const amount = argv.amount || 1;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log(`Generating ${amount} Key(s)`));

generatePromise();

async function generatePromise () {
  try {
    for (let i = 0; i < amount; i++) {
      const keyHash = crypto.randomBytes(10).toString('hex').toUpperCase();
      const keyDoc = new Key({
        key: keyHash,
        remainingUses: 6
      });
      await keyDoc.save();
    }
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
}

