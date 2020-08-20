import { Location } from 'vue-router';

export enum RouteNames {
  Home = 'Home',
  Strats = 'Strats',
  Login = 'Login',
  Register = 'Register',
  Team = 'Team',
  Profile = 'Profile'
}

export const Routes: Record<RouteNames, Location> = {
  Home: { name: RouteNames.Home },
  Strats: { name: RouteNames.Strats },
  Login: { name: RouteNames.Login },
  Register: { name: RouteNames.Register },
  Team: { name: RouteNames.Team },
  Profile: { name: RouteNames.Profile }
};
