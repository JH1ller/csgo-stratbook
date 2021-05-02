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
      .findOne(
        {
          team: teamId,
          gameMap,
        },
        {
          // only project utilities for this query
          utilities: 1,
        },
        {
          sort: {
            'utilities.displayPosition': 1,
          },
        }
      )
      .populate('utilities.createdBy')
      .exec();
  }

  public async addUtility(
    teamId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    model: AddUtilityDto,
    images: string[]
  ) {
    let document = await this.utilityModel.findOne({
      team: teamId,
      gameMap: model.gameMap,
    });

    if (!document) {
      document = new this.utilityModel({
        team: teamId,
        gameMap: model.gameMap,
      });
    }

    // shift display position + 1
    for (const utility of document.utilities) {
      utility.displayPosition++;
    }

    document.utilities.push({
      displayPosition: 0,
      name: model.name,
      type: model.type,
      mouseButton: model.mouseButton,
      crouch: model.crouch,
      jump: model.jump,
      movement: model.movement,
      images,

      description: model.description,
      side: model.side,
      videoLink: model.videoLink,
      createdBy: userId,

      createdAt: new Date(Date.now()),
      modifiedAt: new Date(Date.now()),
      shared: false,
    });

    await document.save();
  }

  /**
   * Removes all utilities from a team. This includes shared utilities.
   * @param teamId Target team id.
   */
  public async deleteAllByTeamId(teamId: Schema.Types.ObjectId) {
    const utilities = await this.findByTeamId(teamId);

    const tasks = utilities.map(async (utility) => {
      for (const entry of utility.utilities) {
        for (const image of entry.images) {
          await this.resourceManagerService.deleteImage(image);
        }
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
