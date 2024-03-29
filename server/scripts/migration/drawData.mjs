import path from 'path';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import fs from 'fs';
import { exec } from 'child_process';
import { StratModel } from '../../dist_server/models/strat.js';
import mongoose from 'mongoose';
import pqueue from 'p-queue';
dotenv.config({ path: path.resolve('../../', '.env') });

const queue = new pqueue({ concurrency: 4 });

const transform = (input) => {
  try {
    const parsed = JSON.parse(input);
    const lines =
      parsed?.objects
        ?.filter((obj) => obj.path)
        .map((object) => {
          const points = object.path.reduce((acc, curr) => {
            const [, x, y] = curr;
            acc.push(x * 2, y * 2);
            return acc;
          }, []);
          return {
            id: nanoid(10),
            color: object.stroke,
            points,
          };
        }) ?? [];
    return {
      lines,
    };
  } catch (error) {
    console.log('error:::', error.message);
    const fileName = 'drawdata_migrate.json';

    fs.writeFile(fileName, input, () => {
      console.log('wrote input to file');
      exec(`start ${fileName}`, () => process.exit());
    });
  }
};

(async () => {
  await mongoose.connect(process.env.DATABASE_URL);

  const allStrats = await StratModel.find({ drawData: new RegExp('version', 'i') });
  let counter = 0;
  let skipped = 0;

  console.log('Found: ', allStrats.length);
  await Promise.all(
    allStrats.map(async (strat) => {
      if (typeof strat.drawData === 'string' && strat.drawData.includes('3.4.0')) {
        //const transformed = transform(strat.drawData);
        //if (!transformed?.lines.length) return;
        console.log(`found - "${strat.name}" - "${strat.drawData}"`);
        strat.drawData = null;
        await queue.add(() => strat.save());
        counter++;
      } else {
        skipped++;
        console.log(`skipped - "${strat.name}"`);
      }
    }),
  );
  console.log(`\nSuccessfully migrated ${counter} strats. Skipped ${skipped} strats.`);
  process.exit();
})();
