import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Body,
  Req,
  Delete,
  BadRequestException,
  Param,
  Patch,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiOkResponse,
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { Request, Express } from 'express';
import Mongoose, { Types } from 'mongoose';

import { UtilitiesService } from './utilities.service';

import { AddUtilityDto } from './dto/add-utility.dto';
import { DeleteUtilityDto } from './dto/delete-utility.dto';
import { GetUtilityParamsDto } from './dto/get-utility-params.dto';
import { UpdateUtilityPositionDto } from './dto/update-utility-position.dto';

import { GetUtilityResponse } from './responses/get-utility.response';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { HasTeamGuard } from 'src/common/guards/has-team.guard';

import { ImageProcessorService } from 'src/services/image-processor/image-processor.service';

@Controller('utilities')
@UseGuards(AuthenticatedGuard)
@UseGuards(HasTeamGuard)
@ApiTags('Utilities')
export class UtilitiesController {
  constructor(
    private readonly utilitiesService: UtilitiesService,
    private readonly imageProcessorService: ImageProcessorService
  ) {}

  @Get('/:gameMap')
  @ApiOkResponse({ description: 'Gets utility data for a specified team and map', type: [GetUtilityResponse] })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  public async getUtility(@Param() params: GetUtilityParamsDto, @Req() req: Request) {
    const teamId = req.user.team;
    const result = await this.utilitiesService.findByTeamIdAndMap(teamId, params.gameMap);

    console.log(result);

    // transform to response array
    const response: GetUtilityResponse[] = [];
    for (const i of result) {
      // any cast is required as type reflection doesn't work correctly
      response.push(new GetUtilityResponse(i as any));
    }

    return response;
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 3 }]))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Creates a new utility' })
  @ApiBadRequestResponse()
  @ApiBody({ description: 'Add Utility', type: AddUtilityDto })
  public async addUtility(
    @UploadedFiles() files: { images: Express.Multer.File[] },
    @Body() model: AddUtilityDto,
    @Req() req: Request
  ) {
    let images: string[] = [];
    if (files && files.images) {
      const tasks = files.images.map((file) => this.imageProcessorService.uploadImage(file.path));
      images = await Promise.all(tasks);
    }

    const userId = req.user._id;
    const teamId = req.user.team;

    await this.utilitiesService.addUtility(teamId, userId, model, images);
  }

  @Delete()
  @ApiOkResponse()
  @ApiBadRequestResponse({ description: 'Invalid model or no utility found under the specified id' })
  @ApiUnauthorizedResponse()
  public async deleteUtility(@Body() model: DeleteUtilityDto, @Req() req: Request) {
    const teamId = req.user.team;

    const id = new Mongoose.Types.ObjectId(model.id);
    const utility = await this.utilitiesService.findByUtilityId(id);
    if (utility === null) {
      throw new BadRequestException('Invalid utility id');
    }

    if (utility.team !== teamId) {
      throw new BadRequestException('Cannot delete a utility of another team.');
    }

    await this.utilitiesService.deleteById(utility._id);
  }

  @Patch('/position')
  @ApiOkResponse({ description: 'Moves the selected utility from oldPosition to newPosition' })
  @ApiBadRequestResponse()
  public async updateUtilityPosition(@Body() model: UpdateUtilityPositionDto) {
    const { id, oldPosition, newPosition } = model;

    if (oldPosition === newPosition) {
      return;
    }

    await this.utilitiesService.updateDisplayPosition(new Types.ObjectId(id), oldPosition, newPosition);
  }

  @Patch()
  @ApiOkResponse()
  public async updateUtility() {
    //
  }
}
