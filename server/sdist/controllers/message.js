"use strict";

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _desc, _value, _class;

var _swagger = require("../swagger");

var _message = require("../model/message");

var _message2 = _interopRequireDefault(_message);

var _util = require("../utils/util");

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _fawn = require("fawn");

var _fawn2 = _interopRequireDefault(_fawn);

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

const tag = (0, _swagger.tags)(["消息"]);

module.exports = (_dec = (0, _swagger.request)("get", "/api/messages"), _dec2 = (0, _swagger.summary)("获取该用户未读消息列表"), _dec3 = (0, _swagger.query)({
  page: { type: "number", default: 0, description: "分页页码(可选)" },
  size: { type: "number", default: 10, description: "每页条数(可选)" }
}), _dec4 = (0, _swagger.request)("get", "/api/messages/count"), _dec5 = (0, _swagger.summary)("获取消息总条数和未读条数"), _dec6 = (0, _swagger.request)("get", "/api/messages/markread"), _dec7 = (0, _swagger.summary)("把消息全部标记为已读"), _dec8 = (0, _swagger.request)("delete", "/api/messages"), _dec9 = (0, _swagger.summary)("清空消息列表"), _dec10 = (0, _swagger.query)({
  page: { type: "number", default: 0, description: "分页页码(可选)" },
  size: { type: "number", default: 10, description: "每页条数(可选)" }
}), (_class = class MessageRouter {
  static async getMessages(ctx, next) {
    let page = ctx.query.page || 0;
    let size = ctx.query.size || 10;
    let user = ctx.state.user.data;

    let result = await _message2.default.find({ receiver: user._id }).limit(size).skip(page * size);
    ctx.body = (0, _util.responseWrapper)(result);
  }

  static async getMessageCount(ctx, next) {
    let user = ctx.state.user.data;
    let count = await _message2.default.count({ receiver: user._id });
    let unread = await _message2.default.count({ receiver: user._id, status: "unread" });
    ctx.body = (0, _util.responseWrapper)({ total: count, unread: unread });
  }

  static async markMessageRead(ctx, next) {
    let user = ctx.state.user.data;
    let result = await _message2.default.update({ receiver: user._id, status: 'unread' }, {
      status: "hasread"
    });
    ctx.body = (0, _util.responseWrapper)(true, '所有消息已标记已读');
  }

  static async clearMessages(ctx, next) {
    let page = ctx.query.page || 0;
    let size = ctx.query.size || 10;
    let user = ctx.state.user.data;
    await _message2.default.deleteMany({ receiver: user._id });
    ctx.body = (0, _util.responseWrapper)(true, "消息已清空");
  }
}, (_applyDecoratedDescriptor(_class, "getMessages", [_dec, _dec2, _dec3, tag], Object.getOwnPropertyDescriptor(_class, "getMessages"), _class), _applyDecoratedDescriptor(_class, "getMessageCount", [_dec4, _dec5, tag], Object.getOwnPropertyDescriptor(_class, "getMessageCount"), _class), _applyDecoratedDescriptor(_class, "markMessageRead", [_dec6, _dec7, tag], Object.getOwnPropertyDescriptor(_class, "markMessageRead"), _class), _applyDecoratedDescriptor(_class, "clearMessages", [_dec8, _dec9, _dec10, tag], Object.getOwnPropertyDescriptor(_class, "clearMessages"), _class)), _class));
//# sourceMappingURL=message.js.map