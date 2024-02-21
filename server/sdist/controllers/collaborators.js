'use strict';

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _desc, _value, _class;

var _swagger = require('../swagger');

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _message = require('../model/message');

var _message2 = _interopRequireDefault(_message);

var _collaborator = require('../model/collaborator');

var _collaborator2 = _interopRequireDefault(_collaborator);

var _app_model = require('../model/app_model');

var _app_model2 = _interopRequireDefault(_app_model);

var _util = require('../utils/util');

var _fawn = require('fawn');

var _fawn2 = _interopRequireDefault(_fawn);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator = require('../utils/validator');

var _validator2 = _interopRequireDefault(_validator);

var _mail = require('../utils/mail');

var _mail2 = _interopRequireDefault(_mail);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

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

const tag = (0, _swagger.tags)(['团队成员']);

module.exports = (_dec = (0, _swagger.request)('post', '/api/collaborator/{appId}/role'), _dec2 = (0, _swagger.summary)('修改用户角色'), _dec3 = (0, _swagger.path)({
    appId: {
        type: 'string',
        required: true
    }
}), _dec4 = (0, _swagger.body)({ memberId: { type: 'string', required: true }, role: { type: 'string', required: true, description: "传入manager或者guest" } }), _dec5 = (0, _swagger.request)('post', '/api/collaborator/{appId}/invite'), _dec6 = (0, _swagger.summary)('邀请某成员加入项目'), _dec7 = (0, _swagger.body)({
    emailList: {
        type: 'array',
        items: {
            type: 'string'
        },
        description: "邮箱列表",
        required: true
    },
    role: { type: 'string', required: true, description: "成员角色manager/guest" }
}), _dec8 = (0, _swagger.path)({
    appId: {
        type: 'string',
        required: true
    }
}), _dec9 = (0, _swagger.request)('delete', '/api/collaborator/{appId}/member/{userId}'), _dec10 = (0, _swagger.summary)('移除某个成员,或者自己离开团队'), _dec11 = (0, _swagger.path)({
    appId: {
        type: 'string',
        required: true
    },
    userId: {
        type: 'string',
        required: true
    }
}), _dec12 = (0, _swagger.request)('get', '/api/collaborator/{appId}/members'), _dec13 = (0, _swagger.summary)('获取团队成员列表'), _dec14 = (0, _swagger.path)({
    appId: {
        type: 'string',
        required: true
    }
}), (_class = class CollaboratorRouter {
    static async changeMemberRole(ctx, next) {
        let { appId } = ctx.validatedParams;
        let user = ctx.state.user.data;
        let body = ctx.request.body;
        let team = _validator2.default.userInTeamIsManager(user._id, appId);
        if (!team) {
            throw new Error("没有权限修改该用户角色");
        }
        if (body.role != 'manager' && body.role != 'guest') {
            throw new Error("请传入正确的角色参数");
        }
        await _collaborator2.default.updateOne({ uid: body.memberId, appId: appId }, {
            role: body.role
        });
        ctx.body = (0, _util.responseWrapper)(true, "用户角色已更新");
    }

    static async addMember(ctx, next) {
        let { appId } = ctx.validatedParams;
        let user = ctx.state.user.data;
        let { emailList, role } = ctx.request.body;
        let collaborator = _validator2.default.userInTeamIsManager(user._id, appId);
        if (!collaborator) {
            throw new Error("您没有权限邀请用户加入");
        }
        console.log('role', role);
        if (!(role === 'manager' || role === 'guest')) {
            throw new Error("请传入正确的用户角色");
        }

        let app = await _app_model2.default.findOne({ _id: appId });
        console.log("app", app);
        let userList = await _user2.default.find({
            email: { $in: emailList }
        });

        // 如果用户不存在则发送邮件邀请
        let dif = _lodash2.default.difference(emailList, _lodash2.default.map(userList, 'email'));
        if (dif.length != 0) {
            _mail2.default.send(dif, `${user.username}邀请您加入${app.appName}`, `${user.username}邀请您加入${app.appName}".如果您还没有注册发布平台，请点击${_config2.default.baseUrl}注册`);
        }

        let addedMembers = await _collaborator2.default.find({ appId: appId, uid: { '$in': userList.map(v => v._id) } }, "uid");
        let unAddMembers = [];
        for (let member of userList) {
            if (!_lodash2.default.find(addedMembers, o => {
                return o == member._id;
            })) {
                unAddMembers.push({
                    appId: appId,
                    uid: member._id,
                    role: role
                });
            }
        }
        console.log("unAddMembers", unAddMembers);
        await _collaborator2.default.insertMany(unAddMembers);

        for (let u of unAddMembers) {
            let message = new _message2.default();
            message.category = "INVITE";
            message.content = user.username + "邀请您加入" + app.appName + "项目.";
            message.sender = user._id;
            message.receiver = u.uid;
            await message.save();
        }
        ctx.body = (0, _util.responseWrapper)(true, "已发送邀请");
    }

    static async removeMember(ctx, next) {
        let { appId, userId } = ctx.validatedParams;
        let user = ctx.state.user.data;
        //如果传入的id和当前登录用户的id相等 表示是自己离开团队
        let collaborator = _validator2.default.userInTeamIsManager(user._id, appId);

        if (!collaborator) {
            throw new Error("该用户没有权限删除用户");
        }
        let collaboratorOne = await _collaborator2.default.findOne({ appId: appId, uid: userId });
        if (collaboratorOne.role == 'owner') {
            throw new Error("管理员用户无法删除用户");
        }
        await _collaborator2.default.deleteMany({ appId: appId, uid: userId });

        ctx.body = (0, _util.responseWrapper)(true, "删除成功");
    }

    static async getMembers(ctx, next) {
        let { appId } = ctx.validatedParams;
        let user = ctx.state.user.data;
        //如果传入的id和当前登录用户的id相等 表示是自己离开团队
        let collaborators = await _collaborator2.default.find({
            appId: appId });
        if (!collaborators) {
            throw new Error("成员不存在");
        }
        console.log("collaborators", collaborators);
        let users = await _user2.default.find({ _id: { $in: collaborators.map(i => i.uid) } });
        let members = [];
        for (let member of collaborators) {
            for (let u of users) {
                if (member.uid == u._id) {
                    members.push({
                        username: u.username,
                        email: u.email,
                        _id: member._id,
                        uid: member.uid,
                        appId: member.appId,
                        role: member.role,
                        createAt: member.createAt,
                        updateAt: member.updateAt
                    });
                }
            }
        }
        ctx.body = (0, _util.responseWrapper)(members);
    }

}, (_applyDecoratedDescriptor(_class, 'changeMemberRole', [_dec, _dec2, tag, _dec3, _dec4], Object.getOwnPropertyDescriptor(_class, 'changeMemberRole'), _class), _applyDecoratedDescriptor(_class, 'addMember', [_dec5, _dec6, tag, _dec7, _dec8], Object.getOwnPropertyDescriptor(_class, 'addMember'), _class), _applyDecoratedDescriptor(_class, 'removeMember', [_dec9, _dec10, tag, _dec11], Object.getOwnPropertyDescriptor(_class, 'removeMember'), _class), _applyDecoratedDescriptor(_class, 'getMembers', [_dec12, _dec13, tag, _dec14], Object.getOwnPropertyDescriptor(_class, 'getMembers'), _class)), _class));
//# sourceMappingURL=collaborators.js.map