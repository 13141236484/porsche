const router = require('koa-router')();
const delearManage = require('../models/delear_manage');
const uuidv4 = require('uuid/v4');
const utils = require('../models/utils');
const RETCODE = require('../models/retcode');
const schema = require('../models/schema');
const xlsx = require('node-xlsx');

let dealerArea = async function (ctx) {
  try {
    let result = await delearManage.getArea();
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回地区接口成功'
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
      message: '返回地区接口失败，请重试'
    };
  }
};

let dealerCenter = async function (ctx) {
  try {
    let province_id = ctx.request.body.province_id || '';
    let options = {
      province_id: province_id
    };
    schema.validate(options, schema.dealerCenter);
    let result = await delearManage.getPorscheCenter(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回保时捷中心接口成功'
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
      message: '返回保时捷中心接口失败，请重试'
    };
  }
};


let dealerQueryUserList = async function (ctx) {
  try {
    console.log(ctx.request.body);
    let start_time = ctx.request.body.start_time || '';
    let end_time = ctx.request.body.end_time || '';
    let porsche_center_id = ctx.request.body.porsche_center_id || '';
    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let options = {
      start_time: start_time,
      end_time: end_time,
      porsche_center_id: porsche_center_id,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.dealerQueryUserList);
    let result = await delearManage.dealerQueryUserList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取经销商查询用户列表成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '获取经销商查询用户列表失败，请重试'
    };
  }
};

let dealerQueryUserDetail = async function (ctx) {
  try {
    let member_id = ctx.request.body.member_id || '';
    let options = {
      member_id: member_id
    };
    schema.validate(options, schema.dealerQueryUserDetail);
    let result = await delearManage.dealerQueryUserDetail(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '经销商查询用户信息成功'
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
      message: '经销商查询用户信息失败，请重试'
    };
  }
};
let dealerQueryMsgList = async function (ctx) {
  try {
    let offset = ctx.request.body.offset || 0,
      count = ctx.request.body.count || 10,
      member_id = ctx.request.body.member_id || '';
    let options = {
      member_id: member_id,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.dealerQueryMsgList);
    let result = await delearManage.dealerQueryPushList(options);
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
let dealerQueryMsgPush = async function (ctx) {
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
    console.log(options);
    schema.validate(options, schema.dealerQueryMsgPush);
    await delearManage.dealerQueryPushMsg(options);
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








let driveUserList = async function (ctx) {
  try {
    let start_time = ctx.request.body.start_time || '',
      end_time = ctx.request.body.end_time || '',
      trial_drive_start_time = ctx.request.body.trial_drive_start_time || '',
      trial_drive_end_time = ctx.request.body.trial_drive_end_time || '',
      porsche_center_id = ctx.request.body.porsche_center_id || '',
      offset = ctx.request.body.offset || 0,
      count = ctx.request.body.count || 10;
    console.log(111, ctx.request.body);
    let options = {
      start_time: start_time,
      end_time: end_time,
      trial_drive_start_time: trial_drive_start_time,
      trial_drive_end_time: trial_drive_end_time,
      porsche_center_id: porsche_center_id,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.driveUserList);
    let result = await delearManage.applyDriveList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取试驾申请列表成功'
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
      message: '获取试驾申请列表失败，请重试'
    };
  }
};

let driveUserDetail = async function (ctx) {
  try {
    let member_id = ctx.request.body.member_id || '';
    let options = {
      member_id: member_id
    };
    schema.validate(options, schema.driveUserDetail);
    let result = await delearManage.applyDriveUser(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '试驾用户信息成功'
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
      message: '试驾用户信息失败，请重试'
    };
  }
};

let driveMsgList = async function (ctx) {
  try {
    let offset = ctx.request.body.offset || 0,
      count = ctx.request.body.count || 10,
      member_id = ctx.request.body.member_id || '';
    let options = {
      member_id: member_id,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.driveMsgList);
    let result = await delearManage.applyDrivePushList(options);
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

let driveMsgPush = async function (ctx) {
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
    schema.validate(options, schema.driveMsgPush);
    await delearManage.applyDrivePushMsg(options);
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

let dealerQueryListExport = async function (ctx) {
  let start_time = ctx.query.start_time || '';
  let end_time = ctx.query.end_time || '';
  let porsche_center_id = ctx.query.porsche_center_id || '';
  let options = {
    start_time: start_time,
    end_time: end_time,
    porsche_center_id: porsche_center_id
  };
  let result = await delearManage.dealerQueryListExport(options);
  let data = [];
  let row = ['昵称', '名', '姓', '手机号', '性别', '近期是否想购买保时捷', '车型', '预约保时捷中心', '类型', '创建时间'];
  data.push(row);
  for (let i = 0; i < result.length; i++) {
    let nickname = result[i].nickname;
    let firstname = result[i].firstname;
    let surname = result[i].surname;
    let tel = result[i].tel;
    let gender = result[i].gender === 'MALE' ? '男' : '女';
    let purchase_willing = result[i].purchase_willing === 'N' ? '否' : '是';
    let car_id = result[i].car_id;
    let porsche_center_name = result[i].porsche_center_name;
    let type = result[i].type;
    let time = new Date(result[i].created_time);
    let row = [nickname, firstname, surname, tel, gender, purchase_willing, car_id, porsche_center_name, type, time];
    data.push(row);
  }
  let date = new Date();
  let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  var buffer = xlsx.build([{ name: "经销商查询", data: data }]); // Returns a buffer
  let headerValue = 'attachment;';
  let filename = '经销商查询' + time + '.xlsx';
  headerValue += ' filename="' + encodeURIComponent(filename) + '";';
  ctx.set('Content-Disposition', headerValue);
  ctx.set('Content-Type', 'application/octet-stream');
  ctx.body = buffer;
};


let dealerTrialListExport = async function (ctx) {
  let start_time = ctx.query.start_time || '';
  let end_time = ctx.query.end_time || '';
  let porsche_center_id = ctx.query.porsche_center_id || '';
  let options = {
    start_time: start_time,
    end_time: end_time,
    porsche_center_id: porsche_center_id
  };
  let result = await delearManage.dealerTrialListExport(options);
  let data = [];
  let row = ['昵称', '名', '姓', '手机号', '性别', '近期是否想购买保时捷', '车型', '预约保时捷中心', '试驾申请时间', '类型', '创建时间'];
  data.push(row);
  for (let i = 0; i < result.length; i++) {
    let nickname = result[i].nickname;
    let firstname = result[i].firstname;
    let surname = result[i].surname;
    let tel = result[i].tel;
    let gender = result[i].gender === 'MALE' ? '男' : '女';
    let purchase_willing = result[i].purchase_willing === 'N' ? '否' : '是';
    let car_id = result[i].car_id;
    let porsche_center_name = result[i].porsche_center_name;
    console.log(result[i].trial_drive_time,new Date(result[i].trial_drive_time));
    let trial_drive_time = new Date(result[i].trial_drive_time);
    let type = '试驾申请';
    let time = new Date(result[i].created_time);
    let row = [nickname, firstname, surname, tel, gender, purchase_willing, car_id, porsche_center_name, trial_drive_time, type, time];
    data.push(row);
  }
  let date = new Date();
  let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  var buffer = xlsx.build([{ name: "经销商查询", data: data }]); // Returns a buffer
  let headerValue = 'attachment;';
  let filename = '试驾申请' + time + '.xlsx';
  headerValue += ' filename="' + encodeURIComponent(filename) + '";';
  ctx.set('Content-Disposition', headerValue);
  ctx.set('Content-Type', 'application/octet-stream');
  ctx.body = buffer;
};

router
  .post('/manager/dealer/area', dealerArea)// 返回地区接口
  .post('/manager/dealer/center', dealerCenter)//返回保时捷中心
  .post('/manager/dealer/query/user/list', dealerQueryUserList) //经销商查询用户列表
  .get('/dealer/query/list/export', dealerQueryListExport)  //导出经销商查询用户
  .get('/dealer/trial/list/export', dealerTrialListExport)  //导出经销商查询用户
  .post('/manager/dealer/query/user/detail', dealerQueryUserDetail) //经销商查询用户列表详情
  .post('/manager/dealer/query/notification/list', dealerQueryMsgList) //经销商查询推送消息列表
  .post('/manager/dealer/query/notification/push', dealerQueryMsgPush) //经销商查询推送消息
  .post('/manager/dealer/drive/user/list', driveUserList) //申请试驾列表
  .post('/manager/dealer/drive/user/detail', driveUserDetail) //申请试驾用户
  .post('/manager/dealer/drive/notification/list', driveMsgList) //申请试驾推送消息列表
  .post('/manager/dealer/drive/notification/push', driveMsgPush); //申请试驾推送消息


module.exports = router;
