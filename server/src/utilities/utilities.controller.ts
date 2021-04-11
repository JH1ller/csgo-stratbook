import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors, Body, Request } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { Express } from 'express';

import { UtilitiesService } from './utilities.service';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

import { AddUtilityDto } from './dto/add-utility.dto';

@Controller('utilities')
@UseGuards(AuthenticatedGuard)
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 3 }]))
  public addUtility(
    @UploadedFiles() files: Express.Multer.File,
    @Body() model: AddUtilityDto,
    @Request req: Express.Request
  ) {
    if (!req.user.team) {
      throw new Error('user has no team');
    }

    console.log(files);
  }
}
