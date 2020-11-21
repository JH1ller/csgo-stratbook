import { Location } from 'vue-router';

export enum RouteNames {
  Home = 'Home',
  Strats = 'Strats',
  Login = 'Login',
  Register = 'Register',
  Team = 'Team',
  JoinTeam = 'JoinTeam',
  Profile = 'Profile',
  Share = 'Share'
}

export const Routes: Record<RouteNames, Location> = {
  Home: { name: RouteNames.Home },
  Strats: { name: RouteNames.Strats },
  Login: { name: RouteNames.Login },
  Register: { name: RouteNames.Register },
  Team: { name: RouteNames.Team },
  JoinTeam: { name: RouteNames.JoinTeam },
  Profile: { name: RouteNames.Profile },
  Share: { name: RouteNames.Share }
};
