
const formatTimestamp = (): string => {

  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00';
  const ms = now.getMilliseconds().toString().padStart(3, '0');

  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}.${ms}`;
};

export class Logger {

  private static instance: Logger;

  private constructor(private apiName: string) { }

  /**
   * Initializes the singleton instance of the Logger
   */
  static init(apiName?: string): Logger {

    if (!Logger.instance) Logger.instance = new Logger(apiName ?? "ToteN");

    return Logger.instance;
  }

  /**
   * Gets the singleton instance of the Logger
   */
  static getInstance(): Logger {

    if (!Logger.instance) Logger.instance = new Logger("ToteN");

    return Logger.instance;
  }

  /**
   * This method logs a generic message
   * Log level can be 'info', 'debug', 'error', 'warn'
   */
  compute(correlationId: string | string[] | undefined, message: string, logLevel?: string) {

    const ts = formatTimestamp();
    const level = logLevel ?? "info";

    if (level === 'error') return console.error(`[${ts}] - [${correlationId}] - [${this.apiName}] - [error] - ${message}`);
    if (level === 'warn') return console.warn(`[${ts}] - [${correlationId}] - [${this.apiName}] - [warn] - ${message}`);

    console.info(`[${ts}] - [${correlationId}] - [${this.apiName}] - [info] - ${message}`);
  }
}

