import { red, blue, green, yellow, gray, Color, bold, cyan } from 'colors';
export class Log {
  private static log(colorFunc: Color, ns: string, ...data: any[]): void {
    console.log(`[${gray(new Date().toLocaleTimeString())} ${bold(colorFunc(ns))}] -`, ...data);
  }

  static success(namespace?: string, ...data: any[]): void {
    this.log(green, namespace ?? 'log::success', ...data);
  }

  static error(namespace?: string, ...data: any[]): void {
    this.log(red, namespace ?? 'log::error', ...data);
  }

  static warn(namespace?: string, ...data: any[]): void {
    this.log(yellow, namespace ?? 'log::warn', ...data);
  }

  static info(namespace?: string, ...data: any[]): void {
    this.log(cyan, namespace ?? 'log::info', ...data);
  }

  static debug(namespace?: string, ...data: any[]): void {
    this.log(gray, namespace ?? 'log::info', ...data);
  }
}
