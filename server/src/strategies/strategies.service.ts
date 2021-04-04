import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import Mongoose, { Model } from 'mongoose';

import { Strategy, StrategyDocument } from 'src/schemas/strategy.schema';

@Injectable()
export class StrategiesService {
  constructor(@InjectModel(Strategy.name) private readonly strategyModel: Model<StrategyDocument>) {}

  public async addStrategy() {
    const createdStrategy = new this.strategyModel({});

    return await createdStrategy.save();
  }

  public findById(id: Mongoose.Types.ObjectId) {
    return this.strategyModel.findById(id).exec();
  }
}
