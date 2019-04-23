const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
var subscribers = {};

router.get('/subscribe', async (ctx, next) => {
    if (ctx.method !== 'GET') return next();

    var id = Math.random();

    await new Promise(resolve => {
        ctx.req.on('close', () => {
            resolve();
        });
        ctx.resolve = resolve;
        subscribers[id] = ctx;
    });
});

router.post('/publish', async (ctx, next) => {
    if (ctx.method !== 'POST') return next();
    if (ctx.request.body == 'undefined' || JSON.stringify(ctx.request.body) == '{}') return next();

    var message = ctx.request.body.message;
    if (message === '') return next();
    ctx.body = message;

    for (var id in subscribers) {
        var ctx = subscribers[id];
        ctx.body = message;
        ctx.resolve();
    }

    subscribers = {};
});

app.use(router.routes());

module.exports = app;
