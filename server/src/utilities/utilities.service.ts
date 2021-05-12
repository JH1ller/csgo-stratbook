import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Schema, Model } from 'mongoose';

import { AddUtilityDto } from './dto/add-utility.dto';

import { Utility, UtilityDocument } from 'src/schemas/utility.schema';
import { UtilityData } from 'src/schemas/utility-data.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

import { GameMap } from 'src/schemas/enums';

import { ResourceManagerService } from 'src/services/resource-manager/resource-manager.service';

@Injectable()
export class UtilitiesService {
  constructor(
    @InjectModel(Utility.name) private readonly utilityModel: Model<UtilityDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly resourceManagerService: ResourceManagerService
  ) {}

  public findById(id: Schema.Types.ObjectId) {
    return this.utilityModel.findById(id).exec();
  }

  public findByTeamId(teamId: Schema.Types.ObjectId) {
    return this.utilityModel.find({ team: teamId }).exec();
  }

  public async findByTeamIdAndMap(teamId: Schema.Types.ObjectId, gameMap: GameMap) {
    const utilities = await this.utilityModel
      .aggregate<UtilityData>()
      .match({ team: teamId, gameMap })
      .unwind({
        path: '$utilities',
      })
      .replaceRoot('$utilities')
      .sort({
        displayPosition: 1,
      })
      .allowDiskUse(false);

    // now populate createdBy with a sub query
    await this.userModel.populate(utilities, { path: 'createdBy' });

    return utilities;
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

  /**
   *
   * @param id id of the dragged strategy
   * @param position new display position of the dragged strategy
   */
  public async updateDisplayPosition(id: Mongoose.Types.ObjectId, newPosition: number, oldPosition: number) {
    const sortDirection = newPosition < oldPosition ? 1 : -1;

    const utilities = await this.utilityModel
      .aggregate<UtilityData>()
      .match({ _id: id })
      .unwind({
        path: '$utilities',
      })
      .replaceRoot('$utilities')
      .sort({
        displayPosition: sortDirection,
      })
      .allowDiskUse(false);

    console.log(utilities);
  }
}
