import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import Mongoose, { Model } from 'mongoose';

import { StrategyType, StrategyMap, StrategySide } from 'src/schemas/enums/strategy';
import { Strategy, StrategyDocument } from 'src/schemas/strategy.schema';
import { Team } from 'src/schemas/team.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class StrategiesService {
  constructor(@InjectModel(Strategy.name) private readonly strategyModel: Model<StrategyDocument>) {}

  public findById(id: Mongoose.Types.ObjectId) {
    return this.strategyModel.findById(id).exec();
  }

  public addStrategy(
    name: string,
    type: StrategyType,
    map: StrategyMap,
    side: StrategySide,
    active: boolean,
    videoLink: string,
    note: string,
    team: Team,
    createdBy: User
  ) {
    const strategy = new this.strategyModel({
      name,
      type,
      map,
      side,
      active,
      videoLink,
      note,
      team,
      createdBy,
    });

    return strategy.save();
  }

  public deleteStrategy(id: Mongoose.Types.ObjectId) {
    return this.strategyModel.deleteOne({ _id: id }).exec();
  }
}