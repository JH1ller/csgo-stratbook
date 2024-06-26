import { Player, PlayerDocument } from '@/models/player';

export type PlayerDto = Omit<Player, 'password' | 'confirmed' | 'isAdmin'> & {
  _id: string;
};

export const toPlayerDto = (player: PlayerDocument): PlayerDto => {
  return {
    _id: player._id.toString(),
    email: player.email,
    completedTutorial: player.completedTutorial,
    name: player.name,
    createdAt: player.createdAt,
    avatar: player.avatar,
    team: player.team,
    color: player.color,
    role: player.role,
    isOnline: player.isOnline,
    lastOnline: player.lastOnline,
    accountType: player.accountType,
    steamId: player.steamId,
  };
};
