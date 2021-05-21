import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Types, Model } from 'mongoose';

import { GameMap, PlayerSide } from 'src/schemas/enums';
import { StrategyType } from 'src/schemas/enums/strategy';

import { Strategy, StrategyDocument } from 'src/schemas/strategy.schema';
import { Team } from 'src/schemas/team.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class StrategiesService {
  constructor(@InjectModel(Strategy.name) private readonly strategyModel: Model<StrategyDocument>) {}

  public findById(id: Types.ObjectId) {
    return this.strategyModel.findById(id).exec();
  }

  public findByTeamId(teamId: Types.ObjectId) {
    return this.strategyModel.find({ team: teamId }).exec();
  }

  public addStrategy(
    name: string,
    type: StrategyType,
    gameMap: GameMap,
    side: PlayerSide,
    active: boolean,
    videoLink: string,
    note: string,
    team: Team,
    createdBy: User
  ) {
    const strategy = new this.strategyModel({
      name,
      type,
      gameMap,
      side,
      active,
      videoLink,
      note,
      team,
      createdBy,
    });

    return strategy.save();
  }

  public deleteStrategy(id: Types.ObjectId) {
    return this.strategyModel.deleteOne({ _id: id }).exec();
  }

  public deleteAllByTeamId(teamId: Types.ObjectId) {
    return this.strategyModel
      .deleteMany({
        team: teamId,
      })
      .exec();
  }

  public async replaceUserName(teamId: Types.ObjectId, oldUserName: string, newUserName: string) {
    const strategies = await this.findByTeamId(teamId);

    const promises = strategies.map(async (strategy) => {
      // simply replace the content (for now)
      strategy.content = strategy.content.replace(oldUserName, newUserName);
      await strategy.save();
    });

    return Promise.allSettled(promises);
  }
}
