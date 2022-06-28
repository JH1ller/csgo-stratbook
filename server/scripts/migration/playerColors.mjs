import path from 'path';
import dotenv from 'dotenv';
import { TeamModel } from '../../dist_server/models/team.js';
import { PlayerModel } from '../../dist_server/models/player.js';
import mongoose from 'mongoose';
import pqueue from 'p-queue';
import fs from 'fs/promises';
import { exec } from 'child_process';

dotenv.config({ path: path.resolve('../../', '.env') });

const COLORS = ['#1EBC9C', '#3298DB', '#F2C512', '#A463BF', '#E84B3C', '#e467da', '#4a61b5', '#41b971'];

const queue = new pqueue({ concurrency: 4 });

(async () => {
  await mongoose.connect(process.env.DATABASE_URL);

  const teams = await TeamModel.find();

  let counter = 0;
  let skipped = 0;
  const result = [];

  await Promise.all(
    teams.map(async (team) => {
      const members = await PlayerModel.find({ team: team._id });
      if (members.length === 0) return;

      for (const member of members) {
        if (member.color) {
          skipped++;
          result.push({ name: member.name, skipped: true });
          console.log(`Skipped player "${member.name}". Already has a color.`);
        } else {
          const targetColor = COLORS.find((color) => !members.some((member) => member.color === color)) || '#1EBC9C';
          member.color = targetColor;
          await queue.add(() => member.save());
          console.log(`Added color ${targetColor} to member "${member.name}"`);
          result.push({ name: member.name, skipped: false, color: targetColor, team: team.name });
          counter++;
        }
      }
    }),
  );
  console.log(`\nSuccessfully migrated ${counter} players. Skipped ${skipped} players.`);

  const fileName = 'playercolor-migrate.json';

  await fs.writeFile(fileName, JSON.stringify(result, null, 2));
  console.log('wrote result to file');
  exec(`start ${fileName}`, () => process.exit());
})();
