const userService = require('service/user');
const util = require('common/util');

async function add(ctx, next) {
  const content = ctx.request.body;
  const user = await userService.findOne({ username: content.username });
  const password = util.encryptPassword(content.password);
  if (password === user.password) {
    const token = util.jwtSign({
      username: user.username,
      email: user.email,
    });
    ctx.status = 200;
    ctx.body = { token };
  } else {
    ctx.throw(401);
  }
};

module.exports = {
  '/token': {
    POST: add,
  }
};