import { bold, Color, cyan, gray, green, red, yellow } from 'colors';
export class Logger {
  private namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  static log(colorFunction: Color, ns: string, ...data: unknown[]): void {
    console.log(`[${gray(new Date().toLocaleTimeString())} ${bold(colorFunction(ns))}]`, ...data);
  }

  success(...data: unknown[]): void {
    Logger.log(green, this.namespace, ...data);
  }

  error(...data: unknown[]): void {
    Logger.log(red, this.namespace, ...data);
  }

  warn(...data: unknown[]): void {
    Logger.log(yellow, this.namespace, ...data);
  }

  info(...data: unknown[]): void {
    Logger.log(cyan, this.namespace, ...data);
  }

  debug(...data: unknown[]): void {
    Logger.log(gray, this.namespace, ...data);
  }
}
