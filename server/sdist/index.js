'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _verify = require('./utils/verify');

var _verify2 = _interopRequireDefault(_verify);

var _MiddleHelper = require('./utils/MiddleHelper');

var _MiddleHelper2 = _interopRequireDefault(_MiddleHelper);

var _util = require('util');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _common = require('./utils/common');

var _common2 = _interopRequireDefault(_common);

var _auth = require('./controllers/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
// 导入controller middleware:
const rest = require('./utils/rest');
const serve = require('koa-static');
const cors = require('koa-cors');
const koajwt = require('koa-jwt');

const log4js = require('log4js');
const log = log4js.getLogger("cps:index");

const app = new Koa();
log4js.configure(_lodash2.default.get(_config2.default, 'log4js', {
    appenders: { console: { type: 'console' } },
    categories: { default: { appenders: ['console'], level: 'info' } }
}));
log4js.getLogger("startup");

const helper = new _MiddleHelper2.default();
// 中间件 自定义了 401 响应，将用户验证失败的相关信息返回给浏览器
app.use(function (ctx, next) {
    return next().catch(err => {
        if (401 == err.status) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else {
            throw err;
        }
    });
});
app.use(cors());
app.use(bodyParser());
// app.use(serve(path.join(__dirname, 'public')));
// app.use(serve(path.resolve(config.fileDir)))
app.use(serve(_path2.default.join(__dirname, '..', 'client/dist')));
_common2.default.initStorageDir().then(r => log.debug('storage dir=', r));
app.use(serve(_common2.default.getStorageDir()));
app.use(function (ctx, next) {
    console.log('ctx.request', ctx.request.path);
    // 不是以 api 开头的请求, 返回前端页面.
    if (ctx.request.path.split('/').filter(item => item !== '').shift() !== 'api') {
        console.log('ctx.request', 'html...');
        ctx.response.type = 'html';
        ctx.response.body = _fs2.default.readFileSync(_path2.default.join(__dirname, '..', 'client/dist/index.html'), 'utf8');
    } else {
        ctx.set("Access-Control-Allow-Origin", "*");
        ctx.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CodePush-Plugin-Version, X-CodePush-Plugin-Name, X-CodePush-SDK-Version");
        ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,PATCH,DELETE,OPTIONS");
        log.debug("use set Access-Control Header");
        return next();
    }
});

let middleware = koajwt({ secret: _config2.default.secret, debug: true }).unless({
    path: ['/api/user/register', '/api/user/login', '/api/user/resetPassword', '/api/swagger', '/api/swagger.json',
    // /\/v0.1\/public\/.+/,
    /\/api\/plist\/.+/, /\/api\/count\/.+/, /\/api\/app\/.+/]
});

app.use(helper.skip(middleware).if(ctx => {
    let key = ctx.request.headers['apikey'];
    return !(0, _util.isUndefined)(key);
}));

app.use(async (ctx, next) => {
    let key = ctx.request.headers['apikey'];
    if (!(0, _util.isUndefined)(key)) {
        let user = await _verify2.default.auth(key).catch(error => {
            throw error;
        });
        ctx.state.user = { data: user };
        await next();
    } else {
        await next();
    }
});

app.use(rest.restify());
app.use(_controller2.default.routes());

//https

if (_config2.default.iosInstallUrl) {
    const https = require('https');
    const enforceHttps = require('koa-sslify').default;
    app.use(enforceHttps);
    const options = {
        key: _fs2.default.readFileSync('./ssl/server.key'),
        cert: _fs2.default.readFileSync('./ssl/server.crt')
    };
    https.createServer(options, app.callback()).listen(_config2.default.iosInstallPort);
}
_auth2.default.initAdminAccount().then(r => {
    // console.log('初始化用户完成...')
});
exports.default = app.listen(_config2.default.port, () => {
    console.log(`App is listening on ${_config2.default.port}.`);
});
//# sourceMappingURL=index.js.map