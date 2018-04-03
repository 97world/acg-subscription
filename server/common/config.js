module.exports = {
  server: {
    port: 3000,
  },
  token: {
    secret: 'acg-subscription',
    expiresIn: '1h',
    unless: {
      path: [],
    },
  },
  database: {
    address: '127.0.0.1',
    dbname: 'acg-subscription',
    port: 5011,
    user: 'acg',
    pwd: 'acg',
  },
  mail: {
    user: 'no-reply@dtoweb.com',
    pass: 'YDn9uxr8cfYxPdLR',
    host: 'smtp.exmail.qq.com',
    port: 465,
    secureConnection: true,
  }
};