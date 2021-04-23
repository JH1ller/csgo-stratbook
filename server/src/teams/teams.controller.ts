import { Controller, UseGuards, Get, Req, Post, Body, UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';

import { Express, Request } from 'express';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { HasTeamGuard } from 'src/common/guards/has-team.guard';

import { TeamsService } from './teams.service';
import { UsersService } from 'src/users/users.service';

import { CreateTeamDto } from './dto/create-team.dto';

import { ImageUploaderService } from 'src/services/image-uploader/image-uploader.service';

@Controller('teams')
@UseGuards(AuthenticatedGuard)
@ApiTags('Teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly usersService: UsersService,
    private readonly imageUploaderService: ImageUploaderService
  ) {}

  @Get()
  public get(@Req() req: Express.Request) {
    console.log(req);
  }

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Create new Team', type: CreateTeamDto })
  @UseInterceptors(FileInterceptor('avatar'))
  public async createTeam(
    @Req() req: Request,
    @Body() model: CreateTeamDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    let avatar: string;
    if (file) {
      avatar = await this.imageUploaderService.addJob({
        source: file.path,
        resize: {
          width: 256,
          height: 256,
        },
      });
    }

    const { name, website, serverIp, serverPassword } = model;

    const team = await this.teamsService.createTeam(name, website, serverIp, serverPassword, req.user, avatar);
    await this.usersService.joinTeam(req.user.id, team);
  }

  @Patch('leave')
  @UseGuards(HasTeamGuard)
  public async leaveTeam(@Req() req: Request) {
    console.log(req.user);

    await this.usersService.leaveTeam(req.user._id);
  }

  @Get('players')
  public getPlayers() {
    // this.usersService.
  }
}
