
import moment from 'moment-timezone'

export class Logger {

  private static instance: Logger;

  private constructor(private apiName: string) { }

  /**
   * Initializes the singleton instance of the Logger
   */
  static init(apiName?: string): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(apiName ?? "ToteN");
    }
    return Logger.instance;
  }

  /**
   * Gets the singleton instance of the Logger
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      throw new Error("Logger instance not initialized. Call Logger.init(apiName) first.");
    }
    return Logger.instance;
  }

  /**
   * This method logs a generic message
   * Log level can be 'info', 'debug', 'error', 'warn'
   */
  compute(correlationId: string | string[] | undefined, message: string, logLevel?: string) {

    let ts = moment().tz('Europe/Rome').format('YYYY-MM-DD HH:mm:ss.SSS');

    logLevel = logLevel ?? "info"

    if (logLevel == 'error') console.error(`[${ts}] - [${correlationId}] - [${this.apiName}] - [error] - ${message}`)
    else if (logLevel == 'warn') console.warn(`[${ts}] - [${correlationId}] - [${this.apiName}] - [warn] - ${message}`)
    else console.info(`[${ts}] - [${correlationId}] - [${this.apiName}] - [info] - ${message}`)

  }
}

