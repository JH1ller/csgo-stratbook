import {
  Controller,
  UseGuards,
  Get,
  Req,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';

import { Express, Request } from 'express';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { HasTeamGuard } from 'src/common/guards/has-team.guard';

import { TeamsService } from './teams.service';
import { UsersService } from 'src/users/users.service';

import { CreateTeamDto } from './dto/create-team.dto';
import { DeleteTeamDto } from './dto/delete-team.dto';

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
    await this.usersService.setTeam(req.user.id, team.id);
  }

  @Delete('delete')
  @UseGuards(HasTeamGuard)
  public async deleteTeam(@Req() req: Request, @Body() model: DeleteTeamDto) {
    const team = await this.teamsService.findById(req.user.team);

    if (team.name !== model.teamName) {
      throw new BadRequestException('TeamName does not equal model name!');
    }

    await this.usersService.removeTeamMembers(team.id);
    await this.teamsService.deleteTeam(team.id);
  }

  @Patch('leave')
  @UseGuards(HasTeamGuard)
  public async leaveTeam(@Req() req: Request) {
    console.log(req.user);

    const teamId = req.user.team;
    const team = await this.teamsService.findById(teamId);

    const memberCount = await this.usersService.getTeamMemberCount(teamId);
    if (memberCount > 1) {
      if (team.manager.toString() === req.user._id.toString()) {
        throw new BadRequestException('You need to transfer leadership first.');
      }

      await this.teamsService.updateJoinCode(teamId);
    } else {
      await this.teamsService.deleteTeam(teamId);
    }

    await this.usersService.leaveTeam(req.user._id);
  }

  @Get('players')
  public getPlayers() {
    // this.usersService.
  }
}
