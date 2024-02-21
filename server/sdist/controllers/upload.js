'use strict';

var _dec, _dec2, _dec3, _dec4, _desc, _value, _class;

var _swagger = require('../swagger');

var _util = require('../utils/util');

var _verify = require('../utils/verify');

var _verify2 = _interopRequireDefault(_verify);

var _versionManager = require('../services/version-manager');

var _versionManager2 = _interopRequireDefault(_versionManager);

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _koaMulter = require('koa-multer');

var _koaMulter2 = _interopRequireDefault(_koaMulter);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _common = require('../utils/common');

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

const log = _log4js2.default.getLogger("cps:upload");

let storageDir = _common2.default.getStorageDir();
const tempDir = _path2.default.join(storageDir, 'tmp');
const storage = _koaMulter2.default.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = (0, _koaMulter2.default)({ storage });
const tag = (0, _swagger.tags)(['上传']);

module.exports = (_dec = (0, _swagger.request)('post', '/api/apps/upload'), _dec2 = (0, _swagger.summary)("文件上传"), _dec3 = (0, _swagger.formData)({
    file: { type: 'file', required: true, description: '.apk、.ipa、.zip' },
    appId: { type: 'string', required: true, description: '项目ID' },
    platform: { type: 'string', required: true, enum: ['ios', 'android', 'rn'], description: '平台' },
    appVersion: { type: 'string', required: false, description: '目标版本' },
    active: { type: 'bool', required: false, description: '是否启用' },
    grayScaleSize: { type: 'number', required: false, default: 0, description: '是否启用' },
    changeLog: { type: 'string', required: false, description: '发布说明' },
    updateMode: {
        type: 'string',
        required: false,
        default: 'silent',
        enum: ['silent', 'normal', 'force'],
        description: '更新方式'
    }
}), _dec4 = (0, _swagger.middlewares)([upload.single('file')]), (_class = class PublishRouter {
    static async upload(ctx, next) {
        let file = ctx.req.file;
        console.log('file', file);
        let uid = ctx.state.user.data._id;
        let {
            appId,
            platform,
            appVersion,
            changeLog,
            grayScaleSize = 0,
            active = false,
            updateMode = 'normal'
        } = ctx.req.body;
        let appInfo = await _verify2.default.checkApp(appId);
        console.log('active', active);
        await _verify2.default.checkRole(uid, appId, 'manager');
        let version = await _versionManager2.default.releaseVersions(ctx.state.user.data, appInfo, {
            appId, platform, appVersion, changeLog, grayScaleSize, active, updateMode, file
        });
        log.debug(version);
        ctx.body = (0, _util.responseWrapper)(version);
    }

}, (_applyDecoratedDescriptor(_class, 'upload', [_dec, _dec2, tag, _dec3, _dec4], Object.getOwnPropertyDescriptor(_class, 'upload'), _class)), _class));
//# sourceMappingURL=upload.js.map