import { Location } from 'vue-router';

export enum RouteNames {
  Home = 'Home',
  Strats = 'Strats',
  Login = 'Login',
  Register = 'Register',
  Team = 'Team',
  JoinTeam = 'JoinTeam',
  Profile = 'Profile',
  Share = 'Share',
  Faq = 'Faq',
  Utilities = 'Utilities',
  ResetPassword = 'ResetPassword',
  ForgotPassword = 'ForgotPassword',
  NotFound = 'NotFound',
  Map = 'Map',
}

export const Routes: Record<RouteNames, Location> = {
  Home: { name: RouteNames.Home },
  Strats: { name: RouteNames.Strats },
  Login: { name: RouteNames.Login },
  Register: { name: RouteNames.Register },
  Team: { name: RouteNames.Team },
  JoinTeam: { name: RouteNames.JoinTeam },
  Profile: { name: RouteNames.Profile },
  Share: { name: RouteNames.Share },
  Faq: { name: RouteNames.Faq },
  Utilities: { name: RouteNames.Utilities },
  ResetPassword: { name: RouteNames.ResetPassword },
  ForgotPassword: { name: RouteNames.ForgotPassword },
  NotFound: { name: RouteNames.NotFound },
  Map: { name: RouteNames.Map },
};
