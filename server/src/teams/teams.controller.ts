import { Controller, UseGuards, Get, Req, Post, Body } from '@nestjs/common';
import { Express } from 'express';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';

import { TeamsService } from './teams.service';
import { UsersService } from 'src/users/users.service';

import { CreateTeamDto } from './dto/create-team.dto';

@Controller('teams')
@UseGuards(AuthenticatedGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService, private readonly usersService: UsersService) {}

  @Get()
  public get(@Req() req: Express.Request) {
    console.log(req);
  }

  @Post()
  public createTeam(@Body() model: CreateTeamDto) {
    console.log(model);
  }

  @Get('players')
  public getPlayers() {
    // this.usersService.
  }

  // @Patch('join')
  // public joinTeam(@Body() model: JoinTeamDto) {

  // }
}
