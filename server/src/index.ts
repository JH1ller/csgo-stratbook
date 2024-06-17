import dotenv from 'dotenv';
dotenv.config();

import { appService } from './services/app.service';
import { socketService } from './services/socket.service';

socketService.initialize(appService.httpServer);

appService.start();
