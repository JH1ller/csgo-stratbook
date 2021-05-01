import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schema, Model } from 'mongoose';

import { AddUtilityDto } from './dto/add-utility.dto';

import { Utility, UtilityDocument } from 'src/schemas/utility.schema';
import { GameMap } from 'src/schemas/enums';

import { ResourceManagerService } from 'src/services/resource-manager/resource-manager.service';

@Injectable()
export class UtilitiesService {
  constructor(
    @InjectModel(Utility.name) private readonly utilityModel: Model<UtilityDocument>,
    private readonly resourceManagerService: ResourceManagerService
  ) {}

  public findById(id: Schema.Types.ObjectId) {
    return this.utilityModel.findById(id).exec();
  }

  public findByTeamId(teamId: Schema.Types.ObjectId) {
    return this.utilityModel.find({ team: teamId }).exec();
  }

  public findByTeamIdAndMap(teamId: Schema.Types.ObjectId, gameMap: GameMap) {
    return this.utilityModel
      .find(
        {
          team: teamId,
          gameMap,
        },
        null,
        {
          sort: {
            displayPosition: 'desc',
          },
        }
      )
      .populate('createdBy')
      .exec();
  }

  public async addUtility(
    teamId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    model: AddUtilityDto,
    images: string[]
  ) {
    const document = await this.utilityModel.findOne({
      team: teamId,
      gameMap: model.gameMap,
    });

    if (document.$isEmpty) {
      await this.utilityModel.updateOne({ team: teamId, gameMap: model.gameMap }, {}).exec();
    } else {
      const utility = new this.utilityModel({
        name: model.name,
        description: model.description,
        videoLink: model.videoLink,
        type: model.type,
        gameMap: model.gameMap,
        side: model.side,
        mouseButton: model.mouseButton,
        crouch: model.crouch,
        jump: model.jump,
        movement: model.movement,

        team: teamId,
        createdBy: userId,
        images,
      });

      await utility.save();
    }
  }

  /**
   * Removes all utilities from a team. This includes shared utilities.
   * @param teamId Target team id.
   */
  public async deleteAllByTeamId(teamId: Schema.Types.ObjectId) {
    const utilities = await this.findByTeamId(teamId);

    const tasks = utilities.map(async (utility) => {
      for (const image of utility.images) {
        await this.resourceManagerService.deleteImage(image);
      }
    });

    await Promise.allSettled(tasks);

    await this.utilityModel.deleteMany({
      team: teamId,
    });
  }

  public deleteById(id: Schema.Types.ObjectId) {
    return this.utilityModel.deleteOne({ _id: id }).exec();
  }
}
