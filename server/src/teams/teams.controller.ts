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
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { Express, Request } from 'express';

import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { HasTeamGuard } from 'src/common/guards/has-team.guard';

import { ImageProcessorService } from 'src/services/image-processor/image-processor.service';

import { TeamsService } from './teams.service';
import { UsersService } from 'src/users/users.service';

import { CreateTeamDto } from './dto/create-team.dto';
import { DeleteTeamDto } from './dto/delete-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';

import { GetTeamResponse } from './responses/get-team.response';

@ApiTags('Teams')
@Controller('teams')
@UseGuards(AuthenticatedGuard)
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly usersService: UsersService,
    private readonly imageProcessorService: ImageProcessorService
  ) {}

  @Get()
  @UseGuards(HasTeamGuard)
  @ApiOkResponse({ type: GetTeamResponse })
  @ApiBadRequestResponse()
  public async getTeamInfo(@Req() req: Express.Request) {
    const team = await this.teamsService.findById(req.user.team);

    if (!team) {
      throw new InternalServerErrorException('team not found!');
    }

    return new GetTeamResponse(team.toObject());
  }

  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Creates and joins a new Team', type: CreateTeamDto })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async createTeam(
    @Req() req: Request,
    @Body() model: CreateTeamDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    let avatar: string;
    if (file) {
      avatar = await this.imageProcessorService.uploadImage(file.path, {
        width: 256,
        height: 256,
      });
    }

    const { name, website, serverIp, serverPassword } = model;

    const team = await this.teamsService.createTeam(name, website, serverIp, serverPassword, req.user, avatar);
    await this.usersService.assignTeam(req.user.id, team.id);
  }

  @Delete('/delete')
  @UseGuards(HasTeamGuard)
  public async deleteTeam(@Req() req: Request, @Body() model: DeleteTeamDto) {
    const team = await this.teamsService.findById(req.user.team);

    if (team.name !== model.teamName) {
      throw new BadRequestException('teamName does not equal model name!');
    }

    await this.usersService.removeTeamMembers(team.id);
    await this.teamsService.deleteTeam(team.id);
  }

  @Patch('/leave')
  @UseGuards(HasTeamGuard)
  public async leaveTeam(@Req() req: Request) {
    const { _id, team } = req.user;

    await this.teamsService.leaveTeam(team, _id, false);
    await this.usersService.unassignTeam(_id);
  }

  @Get('/players')
  public async getPlayers(@Req() req: Request) {
    const teamId = req.user.team;

    const users = await this.usersService.getTeamMembers(teamId);
    console.log(users);
  }

  @Patch('/join')
  public async joinTeam(@Req() req: Request, @Body() model: JoinTeamDto) {
    const joinedTeamId = req.user.team;

    if (joinedTeamId) {
      throw new BadRequestException('You have already joined a team');
    }

    const team = await this.teamsService.findByJoinCode(model.joinCode);
    if (!team) {
      throw new BadRequestException('Invalid join code');
    }

    if (team._id === joinedTeamId) {
      throw new BadRequestException('You already joined this team');
    }

    const memberCount = await this.usersService.getTeamMemberCount(team._id);
    if (memberCount >= 16) {
      throw new BadRequestException('Too many members are in this team');
    }

    await this.usersService.assignTeam(req.user._id, team._id);
  }
}
