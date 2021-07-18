import crypto from 'crypto';
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';

import { Team, TeamDocument } from 'src/schemas/team.schema';
import { User } from 'src/schemas/user.schema';

import { UsersService } from 'src/users/users.service';
import { StrategiesService } from 'src/strategies/strategies.service';
import { UtilitiesService } from 'src/utilities/utilities.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private readonly teamsModel: Model<TeamDocument>,
    private readonly usersService: UsersService,
    private readonly strategiesService: StrategiesService,
    private readonly utilitiesService: UtilitiesService
  ) {}

  public findById(id: Types.ObjectId) {
    return this.teamsModel.findById(id).exec();
  }

  public findByJoinCode(joinCode: string) {
    return this.teamsModel.findOne({ joinCode }).exec();
  }

  public async createTeam(
    name: string,
    website: string,
    serverIp: string,
    serverPassword: string,
    createdBy: User,
    avatar: string
  ) {
    const joinCode = await this.generateTeamCode();

    const team = new this.teamsModel({
      name,
      website,
      server: {
        ip: serverIp,
        password: serverPassword,
      },

      joinCode,
      avatar,
      createdBy,
      manager: createdBy,
    });

    return await team.save();
  }

  public async updateJoinCode(id: Types.ObjectId) {
    const joinCode = await this.generateTeamCode();

    return this.teamsModel.updateOne({ _id: id }, { joinCode }).exec();
  }

  private updateTeam(id: Types.ObjectId, data: Partial<Team>) {
    return this.teamsModel.updateOne({ _id: id }, data).exec();
  }

  /**
   * Deletes a team with all resources and removes all team members.
   * @param teamId Team to be removed
   */
  public async deleteTeam(teamId: Types.ObjectId) {
    const members = await this.usersService.getTeamMembers(teamId);
    for (const member of members) {
      await this.usersService.unassignTeam(member._id);
    }

    await this.strategiesService.deleteAllByTeamId(teamId);
    await this.utilitiesService.deleteAllByTeamId(teamId);

    await this.teamsModel.deleteOne({ _id: teamId }).exec();
  }

  /**
   * Removes a user from the team specified in @name teamId
   * @param teamId target team
   * @param userId userId to be removed
   * @param force True if the user account is being deleted through user action, false prompts the user
   * to transfer the team leadership first.
   */
  public async leaveTeam(teamId: Types.ObjectId, userId: Types.ObjectId, force: boolean) {
    const team = await this.findById(teamId);

    const memberCount = await this.usersService.getTeamMemberCount(teamId);
    if (memberCount > 1) {
      const teamDiff: Partial<Team> = {};

      if (force) {
        // assign ownership to next team member
        const members = (await this.usersService.getTeamMembers(teamId)).filter(
          (member) => member._id.toString() !== userId.toString()
        );

        if (members.length <= 0) {
          throw new Error('Invalid member count');
        }

        teamDiff.owner = members[0]._id;
      } else {
        if (team.manager.toString() === userId.toString()) {
          throw new BadRequestException('You need to transfer leadership first.');
        }
      }

      teamDiff.joinCode = await this.generateTeamCode();
      await this.updateTeam(teamId, teamDiff);
    } else {
      // delete the now empty team
      await this.deleteTeam(teamId);
    }
  }

  private async generateTeamCode() {
    for (let i = 0; i < 5; i++) {
      const joinCode = crypto.randomBytes(3).toString('hex');

      const result = await this.teamsModel.exists({ joinCode });
      if (!result) {
        return joinCode;
      }
    }

    // safety abort so we don't endlessly poll the database
    throw new InternalServerErrorException('Too many attempts for generating a join code!');
  }
}
