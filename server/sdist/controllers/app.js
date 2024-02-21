'use strict';

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _dec49, _dec50, _dec51, _dec52, _dec53, _dec54, _dec55, _dec56, _dec57, _desc, _value, _class;

var _swagger = require('../swagger');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _rest = require('../utils/rest');

var _util = require('../utils/util');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _model = require('../model');

var _model2 = _interopRequireDefault(_model);

var _verify = require('../utils/verify');

var _verify2 = _interopRequireDefault(_verify);

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

const tag = (0, _swagger.tags)(['AppsResource']);

module.exports = (_dec = (0, _swagger.request)('post', '/api/apps/create'), _dec2 = (0, _swagger.summary)("创建应用"), _dec3 = (0, _swagger.body)({
    appName: { type: 'string', required: true, description: '应用名称' },
    platform: { type: 'string', required: true, enum: ['ios', 'android', 'rn'], description: '平台 ios/android/rn' },
    describe: { type: 'string', required: false, description: '应用描述' },
    icon: { type: 'string', description: '应用图标' }
}), _dec4 = (0, _swagger.request)('get', '/api/apps'), _dec5 = (0, _swagger.summary)("获取App列表"), _dec6 = (0, _swagger.query)({
    page: { type: 'number', default: 0, description: '分页页码(可选)' },
    size: { type: 'number', default: 10, description: '每页条数(可选)' }
}), _dec7 = (0, _swagger.request)('get', '/api/apps/{appId}'), _dec8 = (0, _swagger.summary)("获取某个应用详情"), _dec9 = (0, _swagger.path)({
    appId: { type: 'string', description: '应用id' }
}), _dec10 = (0, _swagger.request)('delete', '/api/apps/{appId}'), _dec11 = (0, _swagger.summary)("删除某个应用"), _dec12 = (0, _swagger.path)({
    appId: { type: 'string', description: '应用id' }
}), _dec13 = (0, _swagger.request)('get', '/api/apps/{appId}/versions'), _dec14 = (0, _swagger.summary)("获取某个应用的版本列表(分页)"), _dec15 = (0, _swagger.path)({
    appId: { type: 'string', description: '应用id' }
}), _dec16 = (0, _swagger.query)({
    page: { type: 'number', default: 0, description: '分页页码(可选)' },
    size: { type: 'number', default: 10, description: '每页条数(可选)' }
}), _dec17 = (0, _swagger.request)('get', '/api/apps/{appId}/versions/{versionId}'), _dec18 = (0, _swagger.summary)("获取某个应用的某个版本详情"), _dec19 = (0, _swagger.path)({
    appId: { type: 'string', description: '应用id' },
    versionId: { type: 'string', description: '版本id' }
}), _dec20 = (0, _swagger.request)('delete', '/api/apps/{appId}/versions/{versionId}'), _dec21 = (0, _swagger.summary)("删除某个版本"), _dec22 = (0, _swagger.path)({
    appId: { type: 'string', description: '应用id' },
    versionId: { type: 'string', description: '版本id' }
}), _dec23 = (0, _swagger.request)('post', '/api/apps/{appId}/updateMode'), _dec24 = (0, _swagger.summary)("设置应用或版发布更新方式/静默/强制/普通"), _dec25 = (0, _swagger.body)({
    updateMode: { type: 'string', require: true },
    versionId: { type: 'string', description: "如果传入了versionId则表示设置某个版本的更新方式" }
}), _dec26 = (0, _swagger.path)({ appId: { type: 'string', require: true } }), _dec27 = (0, _swagger.request)('post', '/api/apps/{appId}/profile'), _dec28 = (0, _swagger.summary)("更新应用设置"), _dec29 = (0, _swagger.body)({
    'appName': 'string', //应用短连接
    'shortUrl': 'string', //应用短连接
    'installWithPwd': 'boolean', //应用安装是否需要密码
    'installPwd': 'string', //应用安装的密码
    'autoPublish': 'boolean', //新版本自动发布
    'showHistory': 'boolean', //显示历史版本
    'mergeAppId': 'string' //关联应用
}), _dec30 = (0, _swagger.path)({ appId: { type: 'string', required: true } }), _dec31 = (0, _swagger.request)('post', '/api/apps/{appId}/{versionId}/profile'), _dec32 = (0, _swagger.summary)("更新版本设置设置"), _dec33 = (0, _swagger.body)({
    // 'installUrl':  { type: 'string', require: false,description:'更新文件的安装地址' },
    'changeLog': { type: 'string', require: false, description: '更新描述' },
    'appVersion': { type: 'string', require: false, description: 'RN支持版本' },
    'active': { type: 'bool', require: false, default: false, description: '是否激活' },
    'grayScaleLimit': { type: 'bool', require: false, description: '是否灰度' },
    'grayScaleSize': { type: 'number', default: 0, require: false, description: '灰度上限' },
    'updateMode': { type: 'string', default: 'normal', enum: ['silent', 'normal', 'force'], description: '更新模式' }
}), _dec34 = (0, _swagger.path)({ appId: { type: 'string', required: true }, versionId: { type: 'string', required: true } }), _dec35 = (0, _swagger.request)('post', '/api/apps/{appId}/release'), _dec36 = (0, _swagger.summary)("发布或者取消发布某个版本"), _dec37 = (0, _swagger.path)({ appId: { type: 'string', require: true } }), _dec38 = (0, _swagger.body)({
    versionId: { type: 'string', require: true },
    active: { type: 'bool', require: true }
}), _dec39 = (0, _swagger.request)('get', '/api/app/checkupdate/{appId}/{currentVersionCode}'), _dec40 = (0, _swagger.summary)("检查版本更新"), _dec41 = (0, _swagger.path)({
    appId: String,
    currentVersionCode: String
}), _dec42 = (0, _swagger.request)('post', '/api/app/shortUrl'), _dec43 = (0, _swagger.summary)("通过短链接获取应用最新版本"), _dec44 = (0, _swagger.path)({ appShortUrl: { type: 'string', require: true } }), _dec45 = (0, _swagger.body)({
    appShortUrl: { type: 'string', require: true },
    password: { type: 'string', require: false }
}), _dec46 = (0, _swagger.request)('get', '/api/plist/{appId}/{versionId}'), _dec47 = (0, _swagger.summary)("获取应用的plist文件"), _dec48 = (0, _swagger.path)({ appId: { type: 'string', require: true }, versionId: { type: 'string', require: true } }), _dec49 = (0, _swagger.request)('get', '/api/count/{versionId}'), _dec50 = (0, _swagger.summary)("增加一次下载次数"), _dec51 = (0, _swagger.path)({ versionId: { type: 'string', require: true } }), _dec52 = (0, _swagger.request)('post', '/api/v0.1/public/codepush/report_status/download'), _dec53 = (0, _swagger.summary)("增加一次下载次数 兼容code_push"), _dec54 = (0, _swagger.body)({
    label: { type: 'string', require: true, description: 'versionId' }
}), _dec55 = (0, _swagger.request)('post', '/api/v0.1/public/codepush/report_status/deploy'), _dec56 = (0, _swagger.summary)("版本激活状态更新 兼容code_push"), _dec57 = (0, _swagger.body)({
    label: { type: 'string', require: true, description: 'versionId' },
    status: { type: 'string', require: true, description: 'DeploymentSucceeded/DeploymentFailed' }
}), (_class = class AppRouter {
    static async createApp(ctx, next) {
        let user = ctx.state.user.data;
        let body = ctx.request.body;
        let app = new _model2.default.App({
            appName: body.appName,
            platform: body.platform,
            describe: body.describe,
            icon: body.icon,
            shortUrl: Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5),
            creator: user.username,
            ownerId: user._id
        });
        await app.save();
        let collaborator = new _model2.default.Collaborator({
            appId: app._id,
            uid: user._id,
            role: 'owner'
        });
        await collaborator.save();
        ctx.body = (0, _util.responseWrapper)(true, "创建应用成功");
    }

    static async getApps(ctx, next) {
        let page = ctx.query.page || 0;
        let size = ctx.query.size || 10;
        const user = ctx.state.user.data;
        let collaborators = await _model2.default.Collaborator.find({ uid: user._id });
        if (!_lodash2.default.isEmpty(collaborators)) {
            let appIds = _lodash2.default.map(collaborators, v => {
                return v.appId;
            });
            // console.log('appIds',appIds)
            let result = await _model2.default.App.find({ _id: { '$in': appIds } }); //.limit(size).skip(page * size);
            ctx.body = (0, _util.responseWrapper)(result);
        } else {
            ctx.body = (0, _util.responseWrapper)([]);
        }
    }

    static async getAppDetail(ctx, next) {
        let uid = ctx.state.user.data._id;
        let { appId } = ctx.validatedParams;
        let appInfo = await _verify2.default.checkApp(appId);
        await _verify2.default.checkRole(uid, appId, 'manager');
        ctx.body = (0, _util.responseWrapper)(appInfo);
    }

    static async deleteApp(ctx, next) {
        let uid = ctx.state.user.data._id;
        let { appId } = ctx.validatedParams;
        let appInfo = await _verify2.default.checkApp(appId);
        if (appInfo.mergeAppId) {
            await _model2.default.App.updateOne({ _id: appInfo.mergeAppId }, { mergeAppId: '' });
        }
        await _verify2.default.checkRole(uid, appId, 'manager');
        await _model2.default.Version.deleteMany({ appId: appId });
        await _model2.default.App.deleteOne({ _id: appId });
        ctx.body = (0, _util.responseWrapper)(true, "应用已删除");
    }

    static async getAppVersions(ctx, next) {
        let { page, size } = ctx.query;
        let uid = ctx.state.user.data._id;
        let { appId } = ctx.validatedParams;
        await _verify2.default.checkApp(appId);
        await _verify2.default.checkRole(uid, appId, 'manager');
        let versions = await _model2.default.Version.find({ appId: appId }).sort({ createdAt: -1 }).limit(size).skip(page * size);
        // let metrics = await models.PackagesMetrics.find({package_id:{'$in':versions.map((v)=>v._id)}})
        // if (versions && metrics) {
        //     versions = versions.map(item => {
        //         for (const p of metrics) {
        //             if (item._id == p.package_id) {
        //                 item.downloadCount = p.downloaded
        //                 break
        //             }
        //         }
        //         return item
        //     });
        //     // console.log('metrics',metrics)
        //     // console.log('packages',versions)
        // }
        ctx.body = (0, _util.responseWrapper)(versions);
    }

    static async getAppVersionDetail(ctx, next) {
        let uid = ctx.state.user.data._id;
        let { appId, versionId } = ctx.validatedParams;
        await _verify2.default.checkApp(appId);
        await _verify2.default.checkRole(uid, appId, 'manager');
        let version = await _model2.default.Version.findById({ _id: versionId });
        if (!version) {
            throw new Error("应用不存在");
        }
        ctx.body = (0, _util.responseWrapper)(version);
    }

    static async deleteAppVersion(ctx, next) {
        let uid = ctx.state.user.data._id;
        let { appId, versionId } = ctx.validatedParams;
        await _verify2.default.checkApp(appId);
        await _verify2.default.checkRole(uid, appId, 'manager');

        // todo
        // try {
        //     let findOne = await models.Version.findById({_id:versionId})
        //     // 删除对应版本的文件
        //     fs.unlinkSync(fpath.join(config.fileDir, findOne.downloadUrl))
        // } catch(err) {
        //     console.error(err)
        // }

        await _model2.default.Version.deleteOne({ _id: versionId });
        ctx.body = (0, _util.responseWrapper)(true, "版本已删除");
    }

    static async setUpdateMode(ctx, next) {
        let uid = ctx.state.user.data._id;
        let { appId } = ctx.validatedParams;
        await _verify2.default.checkApp(appId);
        await _verify2.default.checkRole(uid, appId, 'manager');
        let { versionId, updateMode } = ctx.request.body;
        await _model2.default.Version.findByIdAndUpdate(versionId, {
            updateMode: updateMode
        });
        ctx.body = (0, _util.responseWrapper)(true, "版本发布策略设置成功");
    }

    static async setAppProfile(ctx, next) {
        let uid = ctx.state.user.data._id;
        let { appId } = ctx.validatedParams;
        let appInfo = await _verify2.default.checkApp(appId);
        await _verify2.default.checkRole(uid, appId, 'manager');
        let { shortUrl, installWithPwd, appName, installPwd, autoPublish, showHistory, mergeAppId } = ctx.request.body;
        console.log('mergeAppId=', mergeAppId);
        await _model2.default.App.findByIdAndUpdate(appId, { shortUrl, appName, installWithPwd, installPwd, autoPublish, showHistory, mergeAppId });
        if (mergeAppId) {
            await _model2.default.App.findByIdAndUpdate(mergeAppId, { mergeAppId: appId });
        } else if (appInfo.mergeAppId) {
            await _model2.default.App.findByIdAndUpdate(appInfo.mergeAppId, { mergeAppId: '' });
        }
        ctx.body = (0, _util.responseWrapper)(true, "应用设置已更新");
    }

    static async setVersionProfile(ctx, next) {
        let uid = ctx.state.user.data._id;
        let { appId, versionId } = ctx.validatedParams;
        await _verify2.default.checkApp(appId);
        await _verify2.default.checkRole(uid, appId, 'manager');
        console.log('setVersionProfile', ctx.request.body);
        ctx.request.body.uploadAt = Date.now();
        let update = ctx.request.body;
        if (ctx.request.body.appVersion) {
            let versionInfo = _common2.default.validatorVersion(ctx.request.body.appVersion);
            if (!versionInfo[0]) {
                throw new Error(`--targetBinaryVersion ${ctx.request.body.appVersion} not support.`);
            }
            update.minVersion = versionInfo[1];
            update.maxVersion = versionInfo[2];
        }
        await _model2.default.Version.findByIdAndUpdate(versionId, update);
        ctx.body = (0, _util.responseWrapper)(true, "版本设置已更新");
    }

    static async releaseVersion(ctx, next) {
        let uid = ctx.state.user.data._id;
        let { appId } = ctx.validatedParams;
        await _verify2.default.checkApp(appId);
        await _verify2.default.checkRole(uid, appId, 'manager');
        let version = await _model2.default.Version.findById(ctx.request.body.versionId);
        if (!version) {
            throw new Error("版本不存在");
        }
        await _model2.default.Version.updateOne({ _id: ctx.request.body.versionId }, { active: ctx.request.body.active });
        ctx.body = (0, _util.responseWrapper)(true, ctx.request.body.active ? "版本已发布" : "版本已关闭");
    }

    static async checkUpdate(ctx, next) {
        let { appId, currentVersionCode } = ctx.validatedParams;
        await _verify2.default.checkApp(appId);

        let tempVersion = {};
        //正常
        let version = await _model2.default.Version.findOne({
            appId: appId,
            active: true,
            grayScaleLimit: false,
            versionCode: { '$gt': currentVersionCode }
        }).sort({ 'versionCode': -1 });

        //灰度版本
        let grayVersion = await _model2.default.Version.findOne({
            appId: appId,
            active: true,
            grayScaleLimit: true,
            versionCode: { '$gt': currentVersionCode },
            '$expr': { //大于等于
                '$gte': ['$grayScaleSize', '$downloadCount']
            }
        }).sort({ 'versionCode': -1 });

        if (grayVersion && version) {
            if (version.versionCode > grayVersion.versionCode) {
                tempVersion = version;
            } else {
                tempVersion = grayVersion;
            }
        } else if (!grayVersion && version) {
            tempVersion = version;
        } else if (grayVersion && !version) {
            tempVersion = grayVersion;
        } else {
            ctx.body = (0, _util.responseWrapper)(false, "您已经是最新版本了");
            return;
        }

        //强制
        let forceVersion = await _model2.default.Version.findOne({
            appId: appId,
            active: true,
            updateMode: 'force',
            grayScaleLimit: false,
            versionCode: { '$gt': currentVersionCode }
        });
        if (!forceVersion) {
            forceVersion = await _model2.default.Version.findOne({
                appId: appId,
                active: true,
                grayScaleLimit: true,
                updateMode: 'force',
                versionCode: { '$gt': currentVersionCode },
                '$expr': { //大于等于
                    '$gte': ['$grayScaleSize', '$downloadCount']
                }
            });
        }

        if (tempVersion && forceVersion) {
            tempVersion.updateMode = 'force';
        }

        if (!tempVersion) {
            ctx.body = (0, _util.responseWrapper)(false, "您已经是最新版本了");
        } else {
            ctx.body = (0, _util.responseWrapper)(tempVersion);
        }
    }

    static async getAppByShort(ctx, next) {
        let { appShortUrl, password } = ctx.request.body;
        console.log('password', password);
        let appInfo = await _model2.default.App.findOne({ shortUrl: appShortUrl });
        if (!appInfo) {
            throw new Error("应用不存在");
        }
        if (password && appInfo.installWithPwd == 1 && appInfo.installPwd !== password) {
            throw new Error("密码不正确");
        }
        let mergeApp;
        let mergeHistory;
        if (appInfo.mergeAppId) {
            mergeApp = await _model2.default.App.findOne({ _id: appInfo.mergeAppId });
            mergeHistory = await _model2.default.Version.find({
                '$and': [{
                    appId: appInfo.mergeAppId,
                    active: true
                }, {
                    '$or': [{ //激活没限制
                        grayScaleLimit: false
                    }, { //激活没到限制
                        grayScaleLimit: true,
                        '$expr': { //大于等于
                            '$gte': ['$grayScaleSize', '$downloadCount']
                        }
                    }]
                }]
            }).sort({ 'createdAt': -1 }).limit(10);
        }
        let history = (await _model2.default.Version.find({
            '$and': [{
                appId: appInfo._id,
                active: true
            }, {
                '$or': [{ //激活没限制
                    grayScaleLimit: false
                }, { //激活没到限制
                    grayScaleLimit: true,
                    '$expr': { //大于等于
                        '$gte': ['$grayScaleSize', '$downloadCount']
                    }
                }]
            }]
        }).sort({ 'createdAt': -1 }).limit(10)) || [];
        if (appInfo.installWithPwd == 1 && !password) {
            history.map(item => {
                item.downloadPath = '';
                item.downloadUrl = '';
                item.installUrl = '';
                return item;
            });
        }

        let tempResult = [{
            'appInfo': appInfo,
            'versionInfo': history && history.length > 0 ? history[0] : [],
            'history': appInfo.showHistory == true ? history : []
        }];
        if (mergeApp) {
            if (appInfo.installWithPwd == 1 && !password) {
                mergeHistory.map(item => {
                    item.downloadPath = '';
                    item.downloadUrl = '';
                    item.installUrl = '';
                    return item;
                });
            }
            mergeApp.installPwd = '';
            tempResult.push({
                'appInfo': mergeApp,
                'versionInfo': mergeHistory && mergeHistory.length > 0 ? mergeHistory[0] : [],
                'history': mergeApp.showHistory == true ? mergeHistory : []
            });
        }
        let needAuth = appInfo.installWithPwd == 1 && appInfo.installPwd != password;
        console.log('installPwd', appInfo.installPwd);
        appInfo.installPwd = '';
        console.log('installPwd', appInfo.installPwd);
        console.log('needAuth', needAuth);
        ctx.body = (0, _util.responseWrapper)({ 'needAuth': needAuth, 'list': tempResult });
    }

    static async getAppPlist(ctx, next) {
        let { appId, versionId } = ctx.validatedParams;
        let app = await _verify2.default.checkApp(appId);
        let version = await _model2.default.Version.findOne({ _id: versionId });
        if (!version) {
            throw new Error("版本不存在");
        }
        // let url = common.getBlobDownloadUrl(version.downloadPath)
        let result = _fs2.default.readFileSync(_path2.default.join(__dirname, "..", 'templates') + '/template.plist');
        let template = result.toString();
        let rendered = _mustache2.default.render(template, {
            appName: app.appName,
            bundleID: version.bundleId,
            versionName: version.versionName,
            downloadUrl: version.downloadUrl,
            fileSize: version.size,
            iconUrl: _common2.default.getBlobDownloadUrl(app.icon)
        });
        ctx.set('Content-Type', 'text/xml; charset=utf-8');
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = rendered;
    }

    static async addDownloadCount(ctx, next) {
        let { versionId } = ctx.validatedParams;

        let version = await _model2.default.Version.findById(versionId);
        if (version) {
            await _model2.default.Version.updateOne({ _id: versionId }, { 'downloadCount': version.downloadCount + 1 });
        }

        let metric = await _model2.default.PackagesMetrics.findOne({ package_id: versionId });
        console.log('addDownloadCount downloaded...', metric);
        if (!metric) {
            console.log('addDownloadCount create...');
            await _model2.default.PackagesMetrics.create({ package_id: versionId, downloaded: 1 });
            await _model2.default.Version.create({ package_id: versionId, downloaded: 1 });
        } else {
            let downloaded = metric.downloaded || 0;
            console.log('addDownloadCount downloaded...', downloaded);
            await _model2.default.PackagesMetrics.updateOne({ package_id: versionId }, { downloaded: downloaded + 1,
                updated_at: Date.now()
            });
        }
        ctx.body = (0, _util.responseWrapper)(true, '下载次数已更新');
    }

    //兼容 code push

    static async reportStatusDownload(ctx, next) {
        let { label } = ctx.request.body;

        let version = await _model2.default.Version.findById(label);
        if (version) {
            await _model2.default.Version.updateOne({ _id: label }, { 'downloadCount': version.downloadCount + 1 });
        }

        let metric = await _model2.default.PackagesMetrics.findById({ package_id: label });
        if (!metric) {
            await _model2.default.PackagesMetrics.create({ package_id: label, downloaded: 1 });
        } else {
            await _model2.default.PackagesMetrics.updateOne({ package_id: label }, { downloaded: metric.downloaded + 1 });
        }
        ctx.body = (0, _util.responseWrapper)(true, '下载次数已更新');
    }

    //兼容 code push

    static async reportStatusDeploy(ctx, next) {
        let { label, status } = ctx.request.body;
        let statusInt = 0;
        if (status == 'DeploymentSucceeded') {
            statusInt = 1;
        } else if (status == 'DeploymentFailed') {
            statusInt = 2;
        }
        if (statusInt > 0) {}
        let metric = await _model2.default.PackagesMetrics.findById({ package_id: label });
        if (!metric) {
            if (statusInt == 1) {
                await _model2.default.PackagesMetrics.updateOne({ package_id: label,
                    downloaded: 1, installed: 1, active: 1 });
            } else {
                await _model2.default.PackagesMetrics.updateOne({ package_id: label,
                    downloaded: 1, installed: 1, failed: 1 });
            }
        } else {
            if (statusInt == 1) {
                await _model2.default.PackagesMetrics.updateOne({ package_id: label }, { installed: metric.installed + 1, active: metric.active + 1 });
            } else {
                await _model2.default.PackagesMetrics.updateOne({ package_id: label }, { installed: metric.installed + 1, failed: metric.failed + 1 });
            }
        }
        ctx.body = (0, _util.responseWrapper)(true, 'ok');
    }
}, (_applyDecoratedDescriptor(_class, 'createApp', [_dec, _dec2, tag, _dec3], Object.getOwnPropertyDescriptor(_class, 'createApp'), _class), _applyDecoratedDescriptor(_class, 'getApps', [_dec4, _dec5, _dec6, tag], Object.getOwnPropertyDescriptor(_class, 'getApps'), _class), _applyDecoratedDescriptor(_class, 'getAppDetail', [_dec7, _dec8, tag, _dec9], Object.getOwnPropertyDescriptor(_class, 'getAppDetail'), _class), _applyDecoratedDescriptor(_class, 'deleteApp', [_dec10, _dec11, tag, _dec12], Object.getOwnPropertyDescriptor(_class, 'deleteApp'), _class), _applyDecoratedDescriptor(_class, 'getAppVersions', [_dec13, _dec14, _dec15, _dec16, tag], Object.getOwnPropertyDescriptor(_class, 'getAppVersions'), _class), _applyDecoratedDescriptor(_class, 'getAppVersionDetail', [_dec17, _dec18, tag, _dec19], Object.getOwnPropertyDescriptor(_class, 'getAppVersionDetail'), _class), _applyDecoratedDescriptor(_class, 'deleteAppVersion', [_dec20, _dec21, tag, _dec22], Object.getOwnPropertyDescriptor(_class, 'deleteAppVersion'), _class), _applyDecoratedDescriptor(_class, 'setUpdateMode', [_dec23, _dec24, tag, _dec25, _dec26], Object.getOwnPropertyDescriptor(_class, 'setUpdateMode'), _class), _applyDecoratedDescriptor(_class, 'setAppProfile', [_dec27, _dec28, tag, _dec29, _dec30], Object.getOwnPropertyDescriptor(_class, 'setAppProfile'), _class), _applyDecoratedDescriptor(_class, 'setVersionProfile', [_dec31, _dec32, tag, _dec33, _dec34], Object.getOwnPropertyDescriptor(_class, 'setVersionProfile'), _class), _applyDecoratedDescriptor(_class, 'releaseVersion', [_dec35, _dec36, tag, _dec37, _dec38], Object.getOwnPropertyDescriptor(_class, 'releaseVersion'), _class), _applyDecoratedDescriptor(_class, 'checkUpdate', [_dec39, _dec40, tag, _dec41], Object.getOwnPropertyDescriptor(_class, 'checkUpdate'), _class), _applyDecoratedDescriptor(_class, 'getAppByShort', [_dec42, _dec43, tag, _dec44, _dec45], Object.getOwnPropertyDescriptor(_class, 'getAppByShort'), _class), _applyDecoratedDescriptor(_class, 'getAppPlist', [_dec46, _dec47, tag, _dec48], Object.getOwnPropertyDescriptor(_class, 'getAppPlist'), _class), _applyDecoratedDescriptor(_class, 'addDownloadCount', [_dec49, _dec50, tag, _dec51], Object.getOwnPropertyDescriptor(_class, 'addDownloadCount'), _class), _applyDecoratedDescriptor(_class, 'reportStatusDownload', [_dec52, _dec53, tag, _dec54], Object.getOwnPropertyDescriptor(_class, 'reportStatusDownload'), _class), _applyDecoratedDescriptor(_class, 'reportStatusDeploy', [_dec55, _dec56, tag, _dec57], Object.getOwnPropertyDescriptor(_class, 'reportStatusDeploy'), _class)), _class));
//# sourceMappingURL=app.js.map