async function home(ctx, next) {
  await ctx.render('home.html', {
    name: 'Ward',
  });
};

module.exports = {
  '/': {
    jwtUnless: true,
    GET: home,
  },
  '/home': {
    jwtUnless: true,
    GET: home,
  },
};