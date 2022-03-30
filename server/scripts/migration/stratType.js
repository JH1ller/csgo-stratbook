const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../', '.env') });
const Strat = require('../../src/models/strat');
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const allStrats = await Strat.find();
  await Promise.all(
    allStrats.map(async (strat) => {
      strat.types = [strat.type];
      await strat.save();
      console.log(`migrated - "${strat.name}"`);
    })
  );
  console.log(`\nSuccessfully migrated ${allStrats.length} strats.`);
})();
