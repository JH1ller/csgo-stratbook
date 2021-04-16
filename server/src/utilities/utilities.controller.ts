import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors, Body, Request } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { Express } from 'express';

import { UtilitiesService } from './utilities.service';
import { AddUtilityDto } from './dto/add-utility.dto';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

import { ImageUploaderService } from 'src/services/image-uploader/image-uploader.service';

@Controller('utilities')
// @UseGuards(AuthenticatedGuard)
export class UtilitiesController {
  constructor(
    private readonly utilitiesService: UtilitiesService,
    private readonly imageUploaderService: ImageUploaderService
  ) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 3 }]))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Creates a new utility' })
  @ApiBody({ description: 'Add Utility', type: AddUtilityDto })
  public async addUtility(
    @UploadedFiles() files: { images: Express.Multer.File[] },
    @Body() model: AddUtilityDto,
    @Request req: Express.Request
  ) {
    if (files) {
      const result = await Promise.all(
        files.images.map((file) => this.imageUploaderService.addJob({ source: file.path }))
      );

      for (const i of result) {
        console.log('uploaded: ', i);
      }
    }
  }
}
