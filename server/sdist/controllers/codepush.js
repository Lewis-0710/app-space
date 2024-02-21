'use strict';

var _dec, _dec2, _dec3, _desc, _value, _class;

var _swagger = require('../swagger');

var _util = require('../utils/util');

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _model = require('../model');

var _model2 = _interopRequireDefault(_model);

var _common = require('../utils/common');

var _common2 = _interopRequireDefault(_common);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

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

const log = _log4js2.default.getLogger("cps:apps");

const tag = (0, _swagger.tags)(['CodePush']);

module.exports = (_dec = (0, _swagger.request)('get', '/api/v0.1/public/codepush/update_check'), _dec2 = (0, _swagger.summary)("CodePush检查更新"), _dec3 = (0, _swagger.query)({
    deployment_key: { type: 'string', required: true },
    app_version: { type: 'string', required: true },
    label: { type: 'string', required: false },
    package_hash: { type: 'string', required: false },
    client_unique_id: { type: 'string', required: false }
}), (_class = class CodePushRouter {
    static async updateCheck(ctx, next) {
        let { deployment_key: appId, app_version, label, package_hash, client_unique_id } = ctx.validatedQuery;

        let versions = _common2.default.parseVersion(app_version);
        log.debug("versions", versions);
        let tempVersion = {};
        //正常
        let version = await _model2.default.Version.findOne({
            appId: appId,
            active: true,
            grayScaleLimit: false,
            minVersion: { "$lte": versions },
            maxVersion: { '$gt': versions }
        });

        //灰度版本
        let grayVersion = await _model2.default.Version.findOne({
            appId: appId,
            active: true,
            grayScaleLimit: true,
            minVersion: { "$lte": versions },
            maxVersion: { '$gt': versions },
            '$expr': { //大于等于
                '$gte': ['$grayScaleSize', '$downloadCount']
            }
        });

        if (grayVersion && version) {
            if (version.versionCode > version.grayVersion) {
                tempVersion = version;
            } else {
                tempVersion = grayVersion;
            }
        } else if (!grayVersion && version) {
            tempVersion = version;
        } else if (grayVersion && !version) {
            tempVersion = grayVersion;
        }
        //强制
        let forceVersion = await _model2.default.Version.findOne({
            appId: appId,
            active: true,
            updateMode: 'force',
            grayScaleLimit: true,
            minVersion: { "$lte": versions },
            maxVersion: { '$gt': versions }
        });

        if (tempVersion && forceVersion) {
            tempVersion.updateMode = 'force';
        }

        let rs = {
            packageId: 0,
            downloadURL: "",
            downloadUrl: "",
            description: "",
            isAvailable: false,
            isDisabled: true,
            isMandatory: false,
            appVersion: app_version,
            targetBinaryRange: "",
            packageHash: "",
            label: "",
            packageSize: 0,
            updateAppVersion: false,
            shouldRunBinaryVersion: false,
            rollout: 100
        };
        if (tempVersion && !_lodash2.default.eq(tempVersion.packageHash, package_hash)) {
            delete rs.packageId;
            delete rs.rollout;
            // rs.packageId = tempVersion._id;
            rs.targetBinaryRange = tempVersion.appVersion;
            rs.downloadUrl = rs.downloadURL = _common2.default.getBlobDownloadUrl(tempVersion.downloadPath);
            rs.description = tempVersion.changeLog;
            rs.isAvailable = tempVersion.active;
            rs.isDisabled = !tempVersion.active;
            rs.isMandatory = tempVersion.updateMode == 'force';
            rs.appVersion = tempVersion.appVersion;
            rs.packageHash = tempVersion.packageHash;
            rs.label = '';
            rs.packageSize = tempVersion.size;
            // rs.rollout = 100;
        }
        if (!tempVersion) {
            ctx.body = (0, _util.responseWrapper)(false, "您已经是最新版本了");
        } else {
            ctx.body = (0, _util.responseWrapper)({ "update_info": rs });
        }
    }

}, (_applyDecoratedDescriptor(_class, 'updateCheck', [_dec, _dec2, tag, _dec3], Object.getOwnPropertyDescriptor(_class, 'updateCheck'), _class)), _class));
//# sourceMappingURL=codepush.js.map