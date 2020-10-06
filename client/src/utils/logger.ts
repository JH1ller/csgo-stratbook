export class log {
  private static log(color: string, ns: string, ...data: any[]): void {
    if (process.env.NODE_ENV === 'development')
      console.log(
        `%c${new Date().toLocaleTimeString()} | ${ns.padEnd(15, ' ')} >>`,
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
