import { red, blue, green, yellow, gray, Color, bold, cyan } from 'colors';
export class Log {
  private static log(colorFunc: Color, ns: string, ...data: unknown[]): void {
    console.log(`[${gray(new Date().toLocaleTimeString())} ${bold(colorFunc(ns))}]`, ...data);
  }

  static success(namespace?: string, ...data: unknown[]): void {
    this.log(green, namespace ?? 'log::success', ...data);
  }

  static error(namespace?: string, ...data: unknown[]): void {
    this.log(red, namespace ?? 'log::error', ...data);
  }

  static warn(namespace?: string, ...data: unknown[]): void {
    this.log(yellow, namespace ?? 'log::warn', ...data);
  }

  static info(namespace?: string, ...data: unknown[]): void {
    this.log(cyan, namespace ?? 'log::info', ...data);
  }

  static debug(namespace?: string, ...data: unknown[]): void {
    this.log(gray, namespace ?? 'log::info', ...data);
  }
}
