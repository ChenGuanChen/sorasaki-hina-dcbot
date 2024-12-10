import {appendFileSync} from 'fs';
import moment from 'moment-timezone';

import {config} from './configs/gen_config';

enum LogLevel{
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  DEBUG = 'DEBUG',
  LOG = 'LOG',
  INFO = 'INFO',
}

class Logger{
  constructor(readonly logFile?: string){
    this.debug('logger initialized');
  }
  private currentTime(): string{
    return '[' + moment().tz('Asia/Taipei').format('YYYY/MM/DD hh:mm:ss') + ']';
  }
  private writeLog(content: string, logLevel: LogLevel): void{
    const line = `${this.currentTime()} ${logLevel}: ${content}`;
    console.log(line);
    if(this.logFile !== undefined){
      appendFileSync(this.logFile, line + '\n');
    }
  }
  error(content: string): void{
    this.writeLog(content, LogLevel.ERROR);
  }
  warning(content: string): void{
    this.writeLog(content, LogLevel.WARNING);
  }
  debug(content: string): void{
    this.writeLog(content, LogLevel.DEBUG);
  }
  log(content: string): void{
    this.writeLog(content, LogLevel.LOG);
  }
  info(content: string): void{
    this.writeLog(content, LogLevel.INFO);
  }
}

export const logger = new Logger(config.logger.logFile);
