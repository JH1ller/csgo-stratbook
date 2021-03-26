import { Controller, Get } from '@nestjs/common';

@Controller('strategies')
export class StrategiesController {
  @Get()
  public getStrategy() {
    console.log('test');
  }
}
