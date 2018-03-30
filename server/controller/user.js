const userService = require('service/user');
const util = require('common/util');

async function put(ctx, next) {
  const id = ctx.params.id;
  let content = ctx.request.body;
  content.id || (content.id = id);
  ctx.body = await userService.update(content);
  ctx.status = 200;
};

async function get(ctx, next) {
  ctx.body = await userService.get(ctx.params.id);
};

async function del(ctx, next) {
  const id = ctx.params.id;
  await userService.del(id);
  ctx.status = 204;
};

async function find(ctx, next) {
  ctx.body = await userService.find();
};

async function post(ctx, next) {
  let content = ctx.request.body;
  ctx.body = await userService.add(content);
  ctx.status = 201;
};

async function login(ctx, next) {
  let content = ctx.request.body;
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
  '/user/:id': {
    GET: get,
    DEL: del,
    PUT: put,
  },
  '/user': {
    GET: find,
    POST: post,
  },
  '/user/login': {
    POST: login,
  },
};