'use strict';

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _desc, _value, _class;

var _swagger = require('../swagger');

var _user2 = require('../model/user');

var _user3 = _interopRequireDefault(_user2);

var _util = require('../utils/util');

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _fawn = require('fawn');

var _fawn2 = _interopRequireDefault(_fawn);

var _mail = require('../utils/mail');

var _mail2 = _interopRequireDefault(_mail);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _ldap = require('../utils/ldap');

var _ldap2 = _interopRequireDefault(_ldap);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _verify = require('../utils/verify');

var _verify2 = _interopRequireDefault(_verify);

var _model = require('../model');

var _model2 = _interopRequireDefault(_model);

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

const jwt = require('jsonwebtoken');

const tag = (0, _swagger.tags)(['认证']);

let loginSchema = {
    username: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    }
};

let registerSchema = {
    username: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        required: true
    }
};

module.exports = (_dec = (0, _swagger.request)('post', '/api/user/apitoken'), _dec2 = (0, _swagger.summary)('生成apitoken'), _dec3 = (0, _swagger.request)('post', '/api/user/login'), _dec4 = (0, _swagger.summary)('登录'), _dec5 = (0, _swagger.body)(loginSchema), _dec6 = (0, _swagger.request)('post', '/api/user/register'), _dec7 = (0, _swagger.summary)('注册用户'), _dec8 = (0, _swagger.body)(registerSchema), _dec9 = (0, _swagger.request)('post', '/api/user/password/modify'), _dec10 = (0, _swagger.summary)('修改用户密码'), _dec11 = (0, _swagger.body)({
    oldpwd: {
        type: 'string',
        require: true
    },
    newpwd: {
        type: 'string',
        require: true
    }
}), _dec12 = (0, _swagger.request)('post', '/api/user/modify'), _dec13 = (0, _swagger.summary)('修改用户资料'), _dec14 = (0, _swagger.body)({
    mobile: {
        type: 'string'
    },
    qq: {
        type: 'string'
    },
    company: {
        type: 'string'
    },
    career: {
        type: 'string'
    }
}), _dec15 = (0, _swagger.request)('get', '/api/user/info'), _dec16 = (0, _swagger.summary)('获取用户资料'), _dec17 = (0, _swagger.request)('get', '/api/user/accounts'), _dec18 = (0, _swagger.summary)('获取全部账号'), _dec19 = (0, _swagger.request)('delete', '/api/user/{userId}'), _dec20 = (0, _swagger.summary)("删除账号"), _dec21 = (0, _swagger.path)({
    userId: { type: 'string', description: '用户id', required: true }
}), _dec22 = (0, _swagger.request)('post', '/api/user/resetPassword'), _dec23 = (0, _swagger.summary)('管理员重置密码'), _dec24 = (0, _swagger.body)({
    userId: {
        type: 'string',
        description: '用户id',
        required: true
    },
    newPassword: {
        type: 'string',
        description: '新密码',
        required: true
    }
}), (_class = class AuthRouter {
    static async apiToken(ctx, next) {
        let _user = ctx.state.user.data;
        let user = await _user3.default.findOne({ _id: _user._id });
        if (user) {
            // var key = await bcrypt.hash(user.email, 10)
            let md5 = _crypto2.default.createHash('md5');
            let salt = user.email + Date();
            let key = md5.update(user.email + salt).digest('hex');
            await _user3.default.findByIdAndUpdate(user._id, { apiToken: key });
            ctx.body = (0, _util.responseWrapper)(key);
        } else {
            throw new Error('授权失败，请重新登录后重试');
        }
    }

    static async login(ctx, next) {
        const { body } = ctx.request;
        console.log(body);
        // 判断是否开放 ldap，如果开放ldap,
        // 根据ldap的用户信息生成新用户
        if (_config2.default.openLdap) {
            // let auth = await Ldap.auth(body.username, body.password)
            let ldapUser = await _ldap2.default.auth(body.username, body.password).catch(error => {
                console.log(error);
            });
            let user = await _user3.default.findOne({ username: body.username });
            if (ldapUser && (!user || user.username !== ldapUser.name)) {
                console.log('user' + ldapUser);
                let password = await _bcrypt2.default.hash(body.password, 10);
                let newUser = new _user3.default({ username: ldapUser.name, password: password, email: ldapUser.mail });

                let task = _fawn2.default.Task();
                let result = await task.save(newUser).run({ useMongoose: true });
            }
        }

        const user = await _user3.default.findOne({ username: body.username });
        if (user) {
            let valide = await _bcrypt2.default.compare(body.password, user.password);
            if (!valide) {
                throw new Error('用户名或密码错误');
            }
        } else {
            throw new Error('用户名或密码错误');
        }
        user.token = jwt.sign({
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                permission: user.permission
            },
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
        }, _config2.default.secret);
        ctx.body = (0, _util.responseWrapper)(user);
    }

    static async register(ctx, next) {
        let { body } = ctx.request;
        if (!_config2.default.allowRegister && ctx.state.user.data.permission != 'root') {
            throw new Error("不允许注册用户,联系管理员.");
        }
        body.password = await _bcrypt2.default.hash(body.password, 10); // 10是 hash加密的级别, 默认是10，数字越大加密级别越高
        let user = await _user3.default.find({ username: body.username });
        if (!user.length) {
            let newUser = new _user3.default(body);

            let task = _fawn2.default.Task();
            let result = await task.save(newUser).run({ useMongoose: true });
            ctx.body = (0, _util.responseWrapper)(newUser);
        } else {
            throw new Error("用户已存在");
        }
    }

    static async initAdminAccount() {
        let username = _config2.default.adminAccount;
        let adminPassword = _config2.default.adminPassword;
        if (!username || !adminPassword) {
            console.error('init admin', "未设置初始化账号");
        }
        let password = await _bcrypt2.default.hash(_config2.default.adminPassword, 10); // 10是 hash加密的级别, 默认是10，数字越大加密级别越高
        let user = await _user3.default.find({ username: username });
        if (!user.length) {
            let newUser = new _user3.default({
                username: username,
                password: password,
                permission: 'root'
            });
            let task = _fawn2.default.Task();
            await task.save(newUser).run({ useMongoose: true });
            console.log('init admin', "成功...");
        } else {
            console.log('init admin', "用户已存在");
        }
    }

    static async modifyPassword(ctx, next) {
        let user = ctx.state.user.data;
        let body = ctx.request.body;
        let userData = await _user3.default.findById(user._id, "password");
        if (!userData) {
            throw new Error("用户不存在");
        }
        let valide = await _bcrypt2.default.compare(body.oldpwd, userData.password);
        if (!valide) {
            throw new Error("密码错误");
        }
        body.password = await _bcrypt2.default.hash(body.newpwd, 10); // 10是 hash加密的级别, 默认是10，数字越大加密级别越高
        await _user3.default.findByIdAndUpdate(user._id, { password: body.password });
        ctx.body = (0, _util.responseWrapper)(true, "密码修改成功");
    }

    static async changeUserInfo(ctx, next) {
        let user = ctx.state.user.data;
        let body = ctx.request.body;
        let userData = await _user3.default.findById(user._id, "username");
        if (!userData) {
            throw new Error("用户不存在");
        }
        await _user3.default.updateOne({
            username: user.username
        }, {
            mobile: body.mobile,
            qq: body.qq,
            company: body.company,
            career: body.career
        });
        ctx.body = (0, _util.responseWrapper)(true, "用户资料修改成功");
    }

    static async getUserInfo(ctx, next) {
        let user = ctx.state.user.data;
        let userInfo = await _user3.default.findById(user._id, "-password");
        if (!userInfo) {
            throw new Error("用户不存在");
        }
        ctx.body = (0, _util.responseWrapper)(userInfo);
    }

    // @request('get', '/api/user/collaborators')
    // @summary('获取用户团队成员列表')
    // @tag
    // static async getUserCollaborators(ctx, next) {
    //     let user = ctx.state.user.data
    //     let collaborators = await Collaborator.findById(user._id, "teams");
    //     if (!user) {
    //         throw new Error("用户不存在");
    //     }
    //     ctx.body = responseWrapper(user)
    // }
    //
    // @request('post', '/api/user/resetPassword')
    // @summary('通过邮箱重置密码')
    // @tag
    // @body({
    //     email: {
    //         type: 'string',
    //         required: true
    //     }
    // })
    // static async resetPassword(ctx, next) {
    //     let body = ctx.request.body
    //
    //     let user = await User.findOne({
    //         email: body.email
    //     }, "-password");
    //     if (!user) {
    //         throw new Error("邮箱有误,没有该用户");
    //     }
    //
    //     let newPassword = Math
    //         .random()
    //         .toString(36)
    //         .substring(2, 5) + Math
    //         .random()
    //         .toString(36)
    //         .substring(2, 5);
    //     let hashPassword = await bcrypt.hash(newPassword, 10); // 10是 hash加密的级别, 默认是10，数字越大加密级别越高
    //     await User.findByIdAndUpdate(user._id, { password: hashPassword })
    //     Mail.send([body.email], "AppSpace密码重置邮件", `您的密码已重置${newPassword}`)
    //     ctx.body = responseWrapper("密码已重置,并通过邮件发送到您的邮箱")
    // }

    static async geAccounts(ctx, next) {
        let user = ctx.state.user.data;
        let users = [];
        console.log('user', user);
        if (user.permission == 'root') {
            users = await _user3.default.find();
            // console.log('geAccounts', users);
        }
        ctx.body = (0, _util.responseWrapper)(users);
    }

    static async deleteUser(ctx, next) {
        let user = ctx.state.user.data;
        if (user.permission != 'root') {
            throw new Error(`权限不足`);
        }
        let { userId } = ctx.validatedParams;
        await _model2.default.User.deleteMany({ _id: userId });
        await _model2.default.Collaborator.deleteMany({ _id: userId });
        ctx.body = (0, _util.responseWrapper)(true, "成功");
    }

    static async resetPassword(ctx, next) {
        let body = ctx.request.body;
        let user = await _user3.default.findOne({
            _id: body.userId
        }, "-password");
        if (!user) {
            throw new Error("邮箱有误,没有该用户");
        }
        let hashPassword = await _bcrypt2.default.hash(body.newPassword, 10); // 10是 hash加密的级别, 默认是10，数字越大加密级别越高
        await _user3.default.findByIdAndUpdate(user._id, { password: hashPassword });
        ctx.body = (0, _util.responseWrapper)("密码已重置");
    }

}, (_applyDecoratedDescriptor(_class, 'apiToken', [_dec, _dec2, tag], Object.getOwnPropertyDescriptor(_class, 'apiToken'), _class), _applyDecoratedDescriptor(_class, 'login', [_dec3, _dec4, tag, _dec5], Object.getOwnPropertyDescriptor(_class, 'login'), _class), _applyDecoratedDescriptor(_class, 'register', [_dec6, _dec7, _dec8, tag], Object.getOwnPropertyDescriptor(_class, 'register'), _class), _applyDecoratedDescriptor(_class, 'modifyPassword', [_dec9, _dec10, _dec11, tag], Object.getOwnPropertyDescriptor(_class, 'modifyPassword'), _class), _applyDecoratedDescriptor(_class, 'changeUserInfo', [_dec12, _dec13, _dec14, tag], Object.getOwnPropertyDescriptor(_class, 'changeUserInfo'), _class), _applyDecoratedDescriptor(_class, 'getUserInfo', [_dec15, _dec16, tag], Object.getOwnPropertyDescriptor(_class, 'getUserInfo'), _class), _applyDecoratedDescriptor(_class, 'geAccounts', [_dec17, _dec18, tag], Object.getOwnPropertyDescriptor(_class, 'geAccounts'), _class), _applyDecoratedDescriptor(_class, 'deleteUser', [_dec19, _dec20, tag, _dec21], Object.getOwnPropertyDescriptor(_class, 'deleteUser'), _class), _applyDecoratedDescriptor(_class, 'resetPassword', [_dec22, _dec23, tag, _dec24], Object.getOwnPropertyDescriptor(_class, 'resetPassword'), _class)), _class));
//# sourceMappingURL=auth.js.map