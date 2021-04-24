import {
  Controller,
  Delete,
  Get,
  UseGuards,
  Param,
  BadRequestException,
  Req,
  Post,
  Body,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Schema } from 'mongoose';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { HasTeamGuard } from 'src/common/guards/has-team.guard';

import { StrategiesService } from './strategies.service';
import { CreateStrategyDto } from './dto/create-strategy.dto';

import { TeamsService } from 'src/teams/teams.service';

@Controller('strategies')
@UseGuards(AuthenticatedGuard)
@ApiTags('Strategies')
export class StrategiesController {
  constructor(
    private readonly strategiesService: StrategiesService,
    @Inject(forwardRef(() => TeamsService))
    private readonly teamsService: TeamsService
  ) {}

  @Get()
  @UseGuards(HasTeamGuard)
  public getStrategy(@Req() req: Request) {
    console.log('hello world');
  }

  @Post('add')
  @UseGuards(HasTeamGuard)
  public async addStrategy(@Req() req: Request, @Body() model: CreateStrategyDto) {
    const { name, type, map, side, active, videoLink, note } = model;

    const team = await this.teamsService.findById(req.user.team);

    const strategy = await this.strategiesService.addStrategy(
      name,
      type,
      map,
      side,
      active,
      videoLink,
      note,
      team,
      req.user
    );

    return strategy;
  }

  @Delete('delete/:id')
  @ApiOkResponse()
  public async deleteStrategy(@Param('id') id: string) {
    const strategy = await this.strategiesService.findById(new Schema.Types.ObjectId(id));
    if (strategy === null) {
      throw new BadRequestException('strategy was not found');
    }

    return 'hello world :)';
  }
}
