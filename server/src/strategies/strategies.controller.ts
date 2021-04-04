import { Controller, Delete, Get, UseGuards, Param, BadRequestException } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import Mongoose from 'mongoose';

import { StrategiesService } from './strategies.service';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

@Controller('strategies')
@UseGuards(AuthenticatedGuard)
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  @Get()
  public getStrategy() {
    console.log('test');
  }

  @Delete('delete/:id')
  @ApiOkResponse()
  public async deleteStrategy(@Param('id') id: string) {
    const strategy = await this.strategiesService.findById(new Mongoose.Types.ObjectId(id));
    if (strategy === null) {
      throw new BadRequestException('strategy was not found');
    }

    return 'hello test :)';
  }
}
