import { Log } from '@/utils/logger';
import splitbee from '@splitbee/web';
import pkg from '../../package.json';
import { MXP_TOKEN, SPLITBEE_ID } from '@/config';
import mixpanel from 'mixpanel-browser';
import { Breakpoints } from './breakpoint.service';
export default class TrackingService {
  private static instance: TrackingService;
  private initialized = false;
  private breakpoint!: Breakpoints;
  private team!: string;

  private constructor() {
    // private to prevent instantiation
  }

  static getInstance(): TrackingService {
    if (!TrackingService.instance) {
      TrackingService.instance = new TrackingService();
    }
    return TrackingService.instance;
  }

  init(disableCookie = false, meta: { breakpoint: Breakpoints; team: string }) {
    this.breakpoint = meta.breakpoint;
    this.team = meta.team;

    splitbee.init({ disableCookie, token: SPLITBEE_ID });

    mixpanel.init(MXP_TOKEN, {
      debug: process.env.NODE_ENV === 'development',
      disable_cookie: disableCookie,
      disable_persistence: disableCookie,
    });

    Log.info('tracking:init', 'Tracking initialized');

    this.initialized = true;
  }

  track(event: string, data?: Record<string, string | number | boolean>) {
    if (!this.initialized) return;

    Log.info('tracking:track', event, data);

    window.splitbee?.track(event, {
      version: pkg.version,
      appContext: window.desktopMode ? 'Electron' : 'Web',
      breakpoint: this.breakpoint,
      ...(this.team && { team: this.team }),
      ...data,
    });

    mixpanel.track(event, {
      version: pkg.version,
      appContext: window.desktopMode ? 'Electron' : 'Web',
      breakpoint: this.breakpoint,
      ...(this.team && { team: this.team }),
      ...data,
    });
  }

  identify(id: string, name: string, data?: Record<string, unknown>) {
    if (!this.initialized) return;

    Log.info('tracking:identify', data);

    window.splitbee?.user.set({
      name,
      userId: id,
      appContext: window.desktopMode ? 'Desktop App' : 'Web App',
      breakpoint: this.breakpoint,
      ...(this.team && { team: this.team }),
      ...data,
    });

    mixpanel.identify(id);
  }
}
