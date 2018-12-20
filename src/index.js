require('dotenv').config();
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-generic-session');
const RedisStore = require('koa-redis');
const router = require('koa-router')();
const colors = require('colors/safe');
const koaStatic = require('koa-static');
const path = require('path');
const app = new koa();
const { config } = require('./config');
const cors = require('koa2-cors');
app.use(async (ctx, next) => {
  try {
    console.log('文件url', ctx.url);
    console.log('文件路径', ctx.path);
    await next();
  } catch (e) {
    console.info('ex', e);
  }
});
app.use(cors());
app.use(bodyParser());

// 配置静态资源
app.use(koaStatic(path.join(__dirname, '../static')));

app.keys = [config.appName];

app.use(session({
  prefix: 'kang-porsche-fontend-',
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  })
}));


//error and other non-200 http status handle
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.info('catch exception', e);
    let status = e.status || 500;
    if (status === 405 || status === 501) {
      ctx.status === 404;
    } else {
      ctx.app.emit('error', e, ctx);
    }
  }
});

for (let i = 0; i < config.MODULES.length; i++) {
  router.use(require(path.join(__dirname, 'controllers', config.MODULES[i])).routes());
}

app
  .use(router.routes())
  .use(router.allowedMethods({ throw: true }));

// 500 handler
app.on('error', async (error) => {
  console.error('error', error);
});

let port = config.port || 3000;

app.listen(port);

console.info(colors.green('You can now visit ') + colors.blue.underline('http://localhost:' + config.port) +
  colors.green(' via your browser.'));
