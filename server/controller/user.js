const userService = require('service/user');

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
};