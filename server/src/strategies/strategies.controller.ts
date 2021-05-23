import { Controller, Delete, Get, UseGuards, Param, Req, Post, Body, Patch, NotFoundException } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Types } from 'mongoose';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { HasTeamGuard } from 'src/common/guards/has-team.guard';

import { StrategiesService } from './strategies.service';
import { AddStrategyDto } from './dto/add-strategy.dto';
import { GetStrategiesDto } from './dto/get-strategies.dto';
import { UpdateStrategyPositionDto } from './dto/update-strategy-position.dto';
import { DeleteStrategyDto } from './dto/delete-strategy.dto';
import { UpdateStrategyDto } from './dto/update-strategy.dto';
import { AddSharedStrategyDto } from './dto/add-shared-strategy.dto';

import { StrategyItemResponse } from './responses/strategy-item.response';

@Controller('strategies')
@UseGuards(AuthenticatedGuard)
@UseGuards(HasTeamGuard)
@ApiTags('Strategies')
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  @Get('/:gameMap')
  @ApiOkResponse({ description: 'Gets all strategies for a specified team and map', type: [StrategyItemResponse] })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  public async getStrategy(@Req() req: Request, @Param() param: GetStrategiesDto) {
    const teamId = req.user.team;

    const strategies = await this.strategiesService.findByTeamIdAndMap(teamId, param.gameMap);

    return strategies.map((strategy) => new StrategyItemResponse(strategy as any));
  }

  @Post()
  @ApiBody({ description: 'Adds a new strategy', type: StrategyItemResponse })
  public async addStrategy(@Req() req: Request, @Body() model: AddStrategyDto) {
    const teamId = req.user.team;

    const strategy = await this.strategiesService.addStrategy(teamId, req.user._id, model);
    return new StrategyItemResponse(strategy);
  }

  @Patch()
  @ApiBody({ description: 'Updates strategy' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  public async updateStrategy(@Req() req: Request, @Body() model: UpdateStrategyDto) {
    const id = new Types.ObjectId(model.id);
    const teamId = req.user.team;

    const strategy = await this.strategiesService.findByStrategyId(id);
    if (!strategy || strategy.team !== teamId) {
      throw new NotFoundException('strategy not found!');
    }
  }

  @Delete('/:id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  public async deleteStrategy(@Param() model: DeleteStrategyDto, @Req() req: Request) {
    const id = new Types.ObjectId(model.id);
    const teamId = req.user.team;

    const strategy = await this.strategiesService.findById(id);
    if (!strategy || strategy.team !== teamId) {
      throw new NotFoundException('strategy was not found');
    }

    await this.strategiesService.deleteStrategyById(id);
  }

  @Patch('/position')
  @ApiOkResponse({ description: 'Moves the selected strategy from oldPosition to newPosition' })
  @ApiBadRequestResponse()
  public async updateUtilityPosition(@Req() req: Request, @Body() model: UpdateStrategyPositionDto) {
    const { oldPosition, newPosition } = model;
    const id = new Types.ObjectId(model.id);
    const teamId = req.user.team;

    if (oldPosition === newPosition) {
      return;
    }

    const strategy = await this.strategiesService.findByStrategyId(id);
    if (!strategy || strategy.team !== teamId) {
      throw new NotFoundException('strategy not found!');
    }

    await this.strategiesService.updateDisplayPosition(id, oldPosition, newPosition);
  }

  @Post('/share/:id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  public async addSharedStrategy(@Req() req: Request, @Param() param: AddSharedStrategyDto) {
    // const id = new Types.ObjectId(param.id);
    // const teamId = req.user.team;
    // const strategy = await this.strategiesService.findById(id);
    // if (!strategy ||  ) {
    //   throw new NotFoundException('strategy not found!');
    // }
  }
}
