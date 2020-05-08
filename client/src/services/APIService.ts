import axios from 'axios';
import urljoin from 'url-join';
import { Map, Strat, Step, Player } from '@/services/models';

const url = 'http://localhost:3000/'; //TODO: put in .env

const ytOembedUrl =
  'https://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3DM3r2XDceM6A&format=json';

enum Endpoints {
  MAPS = 'maps',
  STRATS = 'strats',
  PLAYERS = 'players',
  STEPS = 'steps',
}

enum Actions {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  DELETE_ALL = 'deleteAll',
}

class APIService {
  static async getAllMaps() {
    const target = urljoin(url, Endpoints.MAPS);
    console.log(target);
    try {
      const res = await axios.get(target);
      const data = res.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  static async createMap(map: Map) {
    const target = urljoin(url, Endpoints.MAPS, Actions.CREATE);
    try {
      return await axios.post(target, map);
    } catch (error) {
      console.error(error);
    }
  }

  static async getStratsOfMap(mapId: string) {
    const target = urljoin(url, Endpoints.STRATS);
    try {
      const res = await axios.get(target, {
        params: {
          map: mapId,
        },
      });
      const data = res.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteStrat(stratId: string) {
    const target = urljoin(url, Endpoints.STRATS, stratId, Actions.DELETE);
    try {
      const res = await axios.delete(target);
      const data = res.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  static async createStrat(strat: Strat, mapId: string) {
    const newStrat = { ...strat, map: mapId };
    console.log(newStrat);
    const target = urljoin(url, Endpoints.STRATS, Actions.CREATE);
    try {
      return await axios.post(target, newStrat);
    } catch (error) {
      console.error(error);
    }
  }

  static async getStepsOfStrat(stratId: string) {
    const target = urljoin(url, Endpoints.STEPS);
    try {
      const res = await axios.get(target, {
        params: {
          strat: stratId,
        },
      });
      const data = res.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default APIService;
