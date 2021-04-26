import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schema, Model } from 'mongoose';

import { AddUtilityDto } from './dto/add-utility.dto';

import { Utility, UtilityDocument } from 'src/schemas/utility.schema';

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

  public addUtility(
    teamId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    model: AddUtilityDto,
    images: string[]
  ) {
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

    return utility.save();
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
