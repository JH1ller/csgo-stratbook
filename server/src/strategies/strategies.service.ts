import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Types, Model } from 'mongoose';
import SanitizeHtml from 'sanitize-html';
import * as MinifyHtml from 'html-minifier';

import { sortArrayDisplayOrder } from 'src/schemas';
import { GameMap } from 'src/schemas/enums';
import { Strategy, StrategyDocument } from 'src/schemas/strategy.schema';
import { StrategyData, StrategyDataDocument } from 'src/schemas/strategy-data.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

import { AddStrategyDto } from './dto/add-strategy.dto';
import { UpdateStrategyDto } from './dto/update-strategy.dto';

@Injectable()
export class StrategiesService {
  constructor(
    @InjectModel(Strategy.name) private readonly strategyModel: Model<StrategyDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  public findById(id: Types.ObjectId) {
    return this.strategyModel.findById(id).exec();
  }

  public findByTeamId(teamId: Types.ObjectId) {
    return this.strategyModel.find({ team: teamId }).exec();
  }

  public async findByTeamIdAndMap(teamId: Types.ObjectId, gameMap: GameMap) {
    const strategies = await this.strategyModel
      .aggregate<StrategyData>()
      .match({ team: teamId, gameMap })
      .unwind({
        path: '$strategies',
      })
      .replaceRoot('$strategies')
      .sort({
        displayPosition: 1,
      })
      .allowDiskUse(false);

    // now populate createdBy and modifiedBy with a sub query
    await this.userModel.populate(strategies, { path: 'createdBy' });
    await this.userModel.populate(strategies, { path: 'modifiedBy' });

    return strategies;
  }

  /**
   * Find document by utility (sub-document) id
   * @param strategyId sub-document id
   * @returns utility document
   */
  public findByStrategyId(strategyId: Types.ObjectId) {
    return this.strategyModel.findOne({ 'strategies._id': strategyId }).exec();
  }

  public async addStrategy(teamId: Types.ObjectId, userId: Types.ObjectId, model: AddStrategyDto) {
    let document = await this.strategyModel.findOne({
      team: teamId,
      gameMap: model.gameMap,
    });

    if (!document) {
      document = new this.strategyModel({
        team: teamId,
        gameMap: model.gameMap,
      });
    }

    // shift display position + 1
    for (const strategy of document.strategies) {
      strategy.displayPosition++;
    }

    document.strategies.push({
      displayPosition: 0,

      name: model.name,
      side: model.side,
      type: model.type,
      active: true,
      videoLink: model.videoLink,
      shared: false,
      note: model.note,
      content: '',

      modifiedBy: userId,
      createdBy: userId,

      createdAt: new Date(Date.now()),
      modifiedAt: new Date(Date.now()),
    });

    return await document.save();
  }

  public deleteById(id: Types.ObjectId) {
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

    const promises = strategies.map(async (mapStrategy) => {
      for (const strategy of mapStrategy.strategies) {
        // simply replace the content (for now)
        strategy.content = strategy.content.replace(oldUserName, newUserName);
      }

      await mapStrategy.save();
    });

    return Promise.allSettled(promises);
  }

  /**
   * Deletes (pulls) sub-document from strategies array
   * @param id id of sub-document
   * @returns updateOneResult
   */
  public async deleteStrategyById(id: Types.ObjectId) {
    return this.strategyModel
      .updateOne(
        {
          'strategies.id': id,
        },
        {
          $pull: {
            _id: id,
          },
        }
      )
      .exec();
  }

  public async updateStrategy(strategyId: Types.ObjectId, model: UpdateStrategyDto) {
    const diff: Partial<StrategyData> = {};
    if (model.name) {
      diff.name = model.name;
    }

    if (model.note) {
      diff.note = model.note;
    }

    if (model.side) {
      diff.side = model.side;
    }

    if (model.type) {
      diff.type = model.type;
    }

    if (model.active) {
      diff.active = model.active;
    }

    if (model.videoLink) {
      diff.videoLink = model.videoLink;
    }

    if (model.content) {
      diff.content = model.content;
    }

    if (model.shared) {
      diff.shared = model.shared;
    }

    // const setObject: Record<string, unknown> = {};

    // for (const i in diff) {
    //   setObject[`strategies.$.${i}`] = diff[i];
    // }

    return this.strategyModel
      .updateOne(
        {
          'strategies._id': strategyId,
        },
        {
          $set: {
            // 'strategies.$': diff,
            'strategies.$.content': model.content,
            'strategies.$.shared': model.shared,
            'strategies.$.note': model.note,
          },
        }
      )
      .exec();
  }

  /**
   *
   * @param id id of the dragged strategy
   * @param position new display position of the dragged strategy
   */
  public async updateDisplayPosition(id: Types.ObjectId, oldPosition: number, newPosition: number) {
    const strategies = await this.strategyModel
      .aggregate<StrategyDataDocument>()
      .match({ _id: id })
      .unwind({
        path: '$strategies',
      })
      .replaceRoot('$strategies')
      .sort({
        displayPosition: 1,
      })
      .allowDiskUse(false);

    // return if didn't found any utilities
    if (strategies.length <= 0) {
      return;
    }

    // find affected rows
    const affected = sortArrayDisplayOrder(strategies, oldPosition, newPosition);

    // prepare and execute update queries
    await this.strategyModel.bulkWrite(
      affected.map((item) => ({
        updateOne: {
          filter: {
            _id: id,
            'strategies._id': item.id,
          },
          update: {
            $set: {
              'strategies.$.displayPosition': item.displayPosition,
            },
          },
        },
      }))
    );
  }

  public sanitizeHtml(html: string) {
    return SanitizeHtml(html, {
      allowedTags: ['span', 'img', 'div'],
      allowedAttributes: {
        span: ['contenteditable', 'class', 'data-*', 'style'],
        img: ['class', 'src'],
      },
    });
  }

  public minifyHtml(html: string) {
    return MinifyHtml.minify(html, {
      continueOnParseError: true,
      keepClosingSlash: true,
      collapseWhitespace: true,
      quoteCharacter: '"',
    });
  }
}
