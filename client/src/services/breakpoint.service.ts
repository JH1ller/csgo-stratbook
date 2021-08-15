export enum Breakpoints {
  MQ1 = 'MQ1',
  MQ2 = 'MQ2',
  MQ3 = 'MQ3',
  MQ4 = 'MQ4',
  MQ5 = 'MQ5',
  MQ6 = 'MQ6',
}

export enum BreakpointMapping {
  MQ1 = 0,
  MQ2 = 480,
  MQ3 = 768,
  MQ4 = 1024,
  MQ5 = 1280,
  MQ6 = 1440,
}

export interface MediaQuery {
  MQ: string;
  query: string;
}

export class BreakpointService {
  private callback: (MQ: string) => void;

  constructor(callback: (MQ: string) => void) {
    this.callback = callback;

    this.initListeners();
  }

  private get mediaQueries(): MediaQuery[] {
    return Object.entries(BreakpointMapping).reduce<MediaQuery[]>((acc, [key, value], i, arr) => {
      if (i === arr.length - 1) {
        acc.push({
          MQ: key,
          query: `(min-width: ${value}px)`,
        });
      } else {
        acc.push({
          MQ: key,
          query: `(min-width: ${value}px) and (max-width: ${Number(arr[i + 1][1]) - 1}px)`,
        });
      }
      return acc;
    }, []);
  }

  private initListeners() {
    for (const mediaQuery of this.mediaQueries) {
      const matcher: MediaQueryList = window.matchMedia(mediaQuery.query);

      matcher.addEventListener('change', (event) => {
        if (event.matches) {
          this.callback(mediaQuery.MQ);
        }
      });

      if (matcher.matches) {
        this.callback(mediaQuery.MQ);
      }
    }
  }
}
