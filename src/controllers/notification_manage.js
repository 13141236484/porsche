const router = require('koa-router')();
const msgManage = require('../models/notification_manage');
const RETCODE = require('../models/retcode');
const uuidv4 = require('uuid/v4');
const schema = require('../models/schema');
const utils = require('../models/utils');
let notificationPush = async function (ctx) {
  try {
    let token = ctx.req.headers.accesstoken || '';
    let tokenValue = await utils.redisClient.get(token);
    let manager = JSON.parse(tokenValue);
    let manager_id = manager.manager_id || '';
    let content = ctx.request.body.content || '';
    let options = {
      manager_id: manager_id,
      content: content
    };
    console.log(options);
    schema.validate(options, schema.notificationPush);
    await msgManage.notificationPush(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '向所有用户推送信息成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '向所有用户推送信息失败，请重试'
    };
  }
};

let feedbackMsgList = async function (ctx) {
  try {
    let start_time = ctx.request.body.start_time || '';
    let end_time = ctx.request.body.end_time || '';
    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let options = {
      start_time: start_time,
      end_time: end_time,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.feedbackMsgList);
    let result = await msgManage.feedbackMsgList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取反馈信息成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '获取反馈信息失败，请重试'
    };
  }
};

let pushMsgList = async function (ctx) {
  try {
    let offset = ctx.request.body.offset || 0,
      count = ctx.request.body.count || 10,
      member_id = ctx.request.body.member_id || '';
    let options = {
      member_id: member_id,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.pushMsgList);
    let result = await msgManage.notificationList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取推送消息列表成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '获取推送消息列表失败，请重试'
    };
  }
};
let replyMsg = async function (ctx) {
  try {
    let token = ctx.req.headers.accesstoken || '';
    let tokenValue = await utils.redisClient.get(token);
    let manager = JSON.parse(tokenValue);
    let manager_id = manager.manager_id || '';
    let uuid = uuidv4();
    let member_id = ctx.request.body.member_id || '';
    let content = ctx.request.body.content || '';
    let options = {
      uuid: uuid,
      manager_id: manager_id,
      member_id: member_id,
      content: content
    };
    schema.validate(options, schema.replyMsg);
    await msgManage.replyMsg(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '推送消息成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '推送消息失败，请重试'
    };
  }
};
let userDetail = async function (ctx) {
  try {
    let member_id = ctx.request.body.member_id || '';
    let options = {
      member_id: member_id
    };
    schema.validate(options, schema.registerUserDetail);
    let result = await msgManage.userDetail(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回用户详情成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回用户详情失败，请重试'
    };
  }
};

router
  .post('/manager/notification/push', notificationPush) //消息推送
  .post('/manager/notification/feedback/list', feedbackMsgList) //反馈消息列表
  .post('/manager/notification/push/list', pushMsgList) //推送消息列表
  .post('/manager/notification/reply', replyMsg) //回复消息
  .post('/manager/notification/user/detail', userDetail); //用户详情


module.exports = router;
