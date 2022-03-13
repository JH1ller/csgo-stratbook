export interface Boards {
  [roomId: string]: Room;
}

export interface Room {
  stratName?: string;
  stratId?: string;
  clients: Record<string, Client>;
  data: {
    images: unknown[];
    lines: unknown[];
    texts: unknown[];
  };
}

export interface Client {
  userName?: string;
  position: {
    x: number;
    y: number;
  };
}
