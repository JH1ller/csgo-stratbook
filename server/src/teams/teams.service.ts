import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model } from 'mongoose';

import { Team, TeamDocument } from 'src/schemas/team.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private readonly teamsModel: Model<TeamDocument>) {}

  public findById(id: Mongoose.Types.ObjectId) {
    return this.teamsModel.findById(id);
  }

  public async createTeam(
    name: string,
    website: string,
    serverIp: string,
    serverPassword: string,
    createdBy: User,
    manager: User
  ) {
    const code = await this.generateTeamCode();

    // team avatar

    const team = new this.teamsModel({
      name,
      website,
      server: {
        ip: serverIp,
        password: serverPassword,
      },

      code,
      createdBy,
      manager,
    });

    return await team.save();
  }

  private async generateTeamCode() {
    while (true) {
      const code = crypto.randomBytes(3).toString('hex');
      const team = await this.teamsModel.findOne({ code }).exec();

      if (team == null) {
        return code;
      }
    }
  }
}
