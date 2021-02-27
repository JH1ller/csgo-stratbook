import { Log } from '@/utils/logger';
import splitbee from '@splitbee/web';

export default class TrackingService {
  private static instance: TrackingService;

  private constructor() {
    // private to prevent instantiation
  }

  static getInstance(): TrackingService {
    if (!TrackingService.instance) {
      TrackingService.instance = new TrackingService();
    }
    return TrackingService.instance;
  }

  init(disableCookie = false) {
    splitbee.init({ disableCookie, token: 'J3KX6SRRBPBD' });
  }

  track(event: string, data?: Record<string, string | number | boolean>) {
    if (window.splitbee) {
      window.splitbee.track(event, data);
      Log.info('tracking:track', event, data);
    }
  }

  setUser(data: Record<string, string | number | boolean>) {
    if (window.splitbee) {
      window.splitbee.user.set({ ...data, appContext: window.desktopMode ? 'Desktop App' : 'Web App' });
      Log.info('tracking:setuser', data);
    }
  }
}
