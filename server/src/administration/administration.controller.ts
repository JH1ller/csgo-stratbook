import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

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
