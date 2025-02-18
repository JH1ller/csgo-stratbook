import { init, type Mixpanel } from 'mixpanel';

import { Logger } from '@/utils/logger';

import { configService } from './config.service';

const logger = new Logger('TrackingService');

class TrackingService {
  private readonly mp: Mixpanel;

  constructor() {
    const { MIXPANEL_TOKEN } = configService.env;
    this.mp = init(MIXPANEL_TOKEN);
    logger.success('initialized');
  }

  track(eventName: string, properties: Record<string, unknown>) {
    this.mp.track(eventName, properties);
    logger.info(`tracking event: ${eventName}`);
  }

  setUser(id: string, properties: Record<string, unknown>) {
    this.mp.people.set(id, properties);
    logger.info(`set user: ${id}`);
  }
}

const trackingService = new TrackingService();

export { trackingService };
