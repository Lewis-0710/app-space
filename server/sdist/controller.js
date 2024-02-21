'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _swagger = require('./swagger');

var _swagger2 = _interopRequireDefault(_swagger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _koaRouter2.default();
_swagger2.default.wrapper(router);

// 添加swagger的路由
router.swagger({
  title: 'App Space Server', description: 'API DOC', version: '1.0.0',
  // [optional] default is root path. prefix : '/api', [optional] default is
  // /swagger-html
  swaggerHtmlEndpoint: '/api/swagger',
  // [optional] default is /swagger-json
  swaggerJsonEndpoint: '/api/swagger.json',

  // [optional] additional options for building swagger doc eg. add api_key as
  // shown below
  swaggerOptions: {
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey', in: 'header',
        name: 'Authorization'
      }
    }
  }
});

(function () {
  let files = _fs2.default.readdirSync('./controllers');
  let js_files = files.filter(f => {
    return f.endsWith('.js');
  });

  for (let f of js_files) {
    console.log(`process controller: ${f}...`);
    let mapping = require('./controllers/' + f);
    console.log(mapping);
    router.map(mapping);
  }
})();

// router.get('/', async (ctx, next) => {
//   ctx.redirect("/index.html")
// });

exports.default = router;
//# sourceMappingURL=controller.js.map