import { Team, TeamDocument } from '@/models/team';

export type TeamDto = Omit<Team, 'deleted' | 'deletedAt' | 'createdBy' | 'createdAt' | 'modifiedBy' | 'modifiedAt'> & {
  _id: string;
};

export const toTeamDto = (team: TeamDocument): TeamDto => {
  return {
    _id: team._id.toString(),
    name: team.name,
    website: team.website,
    server: team.server,
    avatar: team.avatar,
    manager: team.manager,
    code: team.code,
  };
};
