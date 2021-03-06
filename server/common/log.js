const winston = require('winston');
const path = require('path');
const moment = require('moment');
require('winston-daily-rotate-file');

const consoleTransport = new winston.transports.Console();
const dailyRotateFileTransport = {
  server: new winston.transports.DailyRotateFile({
    filename: 'server-%DATE%.log',
    dirname: path.join(__dirname, '../../log/'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
  }),
  spider: new winston.transports.DailyRotateFile({
    filename: 'spider-%DATE%.log',
    dirname: path.join(__dirname, '../../log/'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
  }),
  monitor: new winston.transports.DailyRotateFile({
    filename: 'monitor-%DATE%.log',
    dirname: path.join(__dirname, '../../log/'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
  }),
};

const printfFormatter = winston.format.printf;
const customFormatter = printfFormatter(info => {
  return `${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} [${info.label}] ${info.level}: ${info.message}`;
});

const loggerKey = ['server', 'spider', 'monitor'];

loggerKey.forEach(key => {
  winston.loggers.add(key, {
    format: winston.format.combine(
      winston.format.label({ label: key }),
      winston.format.splat(),
      customFormatter,
    ),
    level: 'debug',
    transports: [
      consoleTransport,
      dailyRotateFileTransport[key],
    ],
    exceptionHandlers: [
      consoleTransport,
      dailyRotateFileTransport[key],
    ],
  });
});

const logger = winston.loggers.get('server');

async function middleware(ctx, next) {
  const startAt = new Date().getTime();
  await next();
  let logLevel = '';
  const responseTime = new Date().getTime() - startAt;
  const message = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${responseTime + 'ms'} ${ctx.message}`;
  const statusCode = ctx.status;
  if (statusCode >= 500) {
    logLevel = 'error';
  }
  if (statusCode >= 400) {
    logLevel = 'warn';
  }
  if (statusCode >= 100) {
    logLevel = 'info';
  }
  logger.log(logLevel, message);
};

module.exports = {
  loggers: winston.loggers,
  middleware,
};