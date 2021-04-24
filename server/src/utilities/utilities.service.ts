import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AddUtilityDto } from './dto/add-utility.dto';

import { Utility, UtilityDocument } from 'src/schemas/utility.schema';

@Injectable()
export class UtilitiesService {
  constructor(@InjectModel(Utility.name) private readonly utilityModel: Model<UtilityDocument>) {}

  public addUtility(model: AddUtilityDto) {
    const utility = new this.utilityModel({
      name: model.name,
      describe: model.description,
      videoLink: model.videoLink,
      type: model.type,
      gameMap: model.gameMap,
      side: model.side,
      mouseButton: model.mouseButton,
      crouch: model.crouch,
      jump: model.jump,
      movement: model.movement,

      // team: res.player.team,
    });

    return utility.save();
  }
}
