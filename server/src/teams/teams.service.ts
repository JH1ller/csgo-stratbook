import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schema, Model } from 'mongoose';

import { Team, TeamDocument } from 'src/schemas/team.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private readonly teamsModel: Model<TeamDocument>) {}

  public findById(id: Schema.Types.ObjectId) {
    return this.teamsModel.findById(id);
  }

  public async createTeam(
    name: string,
    website: string,
    serverIp: string,
    serverPassword: string,
    createdBy: User,
    avatar: string
  ) {
    const code = await this.generateTeamCode();

    const team = new this.teamsModel({
      name,
      website,
      server: {
        ip: serverIp,
        password: serverPassword,
      },

      code,
      avatar,
      createdBy,
      manager: createdBy,
    });

    return await team.save();
  }

  public async updateJoinCode(id: Schema.Types.ObjectId) {
    const code = await this.generateTeamCode();

    return this.teamsModel.updateOne({ _id: id }, { code }).exec();
  }

  private async generateTeamCode() {
    while (true) {
      const code = crypto.randomBytes(3).toString('hex');

      const result = await this.teamsModel.exists({ code });
      if (!result) {
        return code;
      }
    }
  }
}
