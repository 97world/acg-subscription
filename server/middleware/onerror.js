const ERROR = require('common/constant').ERROR;

function middleware(logger) {
  return async function onerror(ctx, next) {
    try {
      await next();
    } catch (err) {
      logger && logger.error(JSON.stringify(err));
      err.originalError && (err = err.originalError);
      const errInfo = ERROR[err.name.toUpperCase()];
      if (errInfo) {
        ctx.status = errInfo.CODE;
        ctx.body = errInfo.MSG;
      } else {
        ctx.status = 500;
        ctx.body = 'unknow error';
      }
    }
  };
};

module.exports = middleware;