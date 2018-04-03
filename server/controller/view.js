async function home(ctx, next) {
  await ctx.render('home.html', {
    name: 'Ward',
  });
};

module.exports = {
  '/home': {
    jwtUnless: true,
    GET: home,
  },
};