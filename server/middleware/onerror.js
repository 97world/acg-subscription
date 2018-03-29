const ERROR = require('common/constant').ERROR;

function middleware(logger) {
  return async function onerror(ctx, next) {
    try {
      await next();
    } catch (err) {
      const errInfo = ERROR[err.name.toUpperCase()];
      if (errInfo) {
        ctx.status = errInfo.CODE;
        ctx.body = errInfo.MSG;
      } else {
        ctx.status = 500;
        ctx.body = 'unknow error';
      }
      logger && logger.error(err);
    }
  };
};

module.exports = middleware;