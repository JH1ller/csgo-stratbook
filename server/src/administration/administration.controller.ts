import { Controller, UseGuards, Get, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

@ApiTags('Administration')
@Controller('administration')
// @UseGuards(AuthenticatedGuard)
export class AdministrationController {
  @Get()
  @ApiOkResponse()
  public getNumber() {
    return 25;
  }
}
