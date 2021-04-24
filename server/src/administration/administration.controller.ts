import { Controller, UseGuards } from '@nestjs/common';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

@Controller('administration')
@UseGuards(AuthenticatedGuard)
export class AdministrationController {}
