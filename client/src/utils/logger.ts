export class Log {
  private static log(color: string, ns: string, ...data: any[]): void {
    if ((window as any).debugMode)
      console.log(
        `%c${new Date().toLocaleTimeString()}%c${ns.padEnd(15, ' ')} >>`,
        `color: #c3c3c3; background: #141418; border: 1px solid ${color}; border-right: none; padding: 2px 8px;`,
        `color: ${color}; background: #141418; border: 1px solid ${color}; padding: 2px 8px;`,
        ...data
      );
  }

  static success(namespace?: string, ...data: any[]): void {
    this.log('#41b883', namespace ?? 'log::success', ...data);
  }

  static error(namespace?: string, ...data: any[]): void {
    this.log('#ff8484', namespace ?? 'log::error', ...data);
  }

  static info(namespace?: string, ...data: any[]): void {
    this.log('#9fd1ff', namespace ?? 'log::info', ...data);
  }
}
