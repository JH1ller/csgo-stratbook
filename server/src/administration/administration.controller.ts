import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

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
