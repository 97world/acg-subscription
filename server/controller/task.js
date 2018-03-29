const taskService = require('service/task');

async function put(ctx, next) {
  const id = ctx.params.id;
  let content = ctx.request.body;
  content.id || (content.id = id);
  ctx.body = await taskService.update(content);
  ctx.status = 200;
};

async function get(ctx, next) {
  ctx.body = await taskService.get(ctx.params.id);
};

async function del(ctx, next) {
  const id = ctx.params.id;
  await taskService.del(id);
  ctx.status = 204;
};

async function find(ctx, next) {
  ctx.body = await taskService.find();
};

async function post(ctx, next) {
  let content = ctx.request.body;
  ctx.body = await taskService.add(content);
  ctx.status = 201;
};

module.exports = {
  '/task/:id': {
    GET: get,
    DEL: del,
    PUT: put,
  },
  '/task': {
    GET: find,
    POST: post,
  },
};