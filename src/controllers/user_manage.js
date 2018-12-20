const router = require('koa-router')();
const userManage = require('../models/user_manage');
const RETCODE = require('../models/retcode');
const uuidv4 = require('uuid/v4');
const schema = require('../models/schema');
const utils = require('../models/utils');
const xlsx = require('node-xlsx');
const path = require('path');
const KnownErrors = require('../models/error');

const multer = require('koa-multer');

// 通过 filename 属性定制
var storage = multer.diskStorage({
  destination: function (ctx, file, cb) {
    cb(null, 'static/uploads/');
  },
  filename: function (ctx, file, cb) {
    let origin = file.originalname.split('.');
    let format = origin[origin.length - 1];
    cb(null, 'user' + '.' + format);
  }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({
  storage: storage
});

let userCount = async function (ctx) {
  try {
    let result = await userManage.personCount();
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取统计人数成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '获取统计人数失败，请重试'
    };
  }
};

let userCar = async function (ctx) {
  try {
    let result = await userManage.porscheCar();
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回保时捷车型信息成功'
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
      message: '返回车型信息信息失败，请重试'
    };
  }
};

let registerUserList = async function (ctx) {
  try {
    let nickname = ctx.request.body.nickname || '';
    let tel = ctx.request.body.tel || '';
    let complete = ctx.request.body.complete || '';
    let purchase_willing = ctx.request.body.purchase_willing || '';
    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let car_id = ctx.request.body.car_id || '';
    let willing_change_start_time = ctx.request.body.willing_change_start_time || '';
    let willing_change_end_time = ctx.request.body.willing_change_end_time || '';
    let interest_id = ctx.request.body.interest_id || '';
    let options = {
      nickname: nickname,
      tel: tel,
      complete: complete,
      purchase_willing: purchase_willing,
      car_id: car_id,
      willing_change_start_time: willing_change_start_time,
      willing_change_end_time: willing_change_end_time,
      interest_id: interest_id,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.registerUserList);
    let result = await userManage.registerUserList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取注册用户列表成功'
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
      message: '返回注册列表失败，请重试'
    };
  }
};


let userListExport = async function (ctx) {
  try {
    console.log(1111, ctx.query);
    let nickname = ctx.query.nickname || '';
    let tel = ctx.query.tel || '';
    let complete = ctx.query.complete || '';
    let purchase_willing = ctx.query.purchase_willing || '';
    let car_id = ctx.query.car_id || '';
    let willing_change_start_time = ctx.query.willing_change_start_time || '';
    let willing_change_end_time = ctx.query.willing_change_end_time || '';
    let interest_id = ctx.query.interest_id || '';
    let options = {
      nickname: nickname,
      tel: tel,
      complete: complete,
      purchase_willing: purchase_willing,
      car_id: car_id,
      willing_change_start_time: willing_change_start_time,
      willing_change_end_time: willing_change_end_time,
      interest_id: interest_id
    };
    console.log(options);
    let userList = await userManage.userListExport(options);
    let data = [];
    let row = ['昵称', '名', '姓', '手机号', '性别', '邮箱', '省', '市', '区', '地址', '来源', '登录次数', '近期是否想购买保时捷', '车型', '你现在是否已有车驾', '座驾品牌', '座驾型号', '创建时间'];
    data.push(row);
    for (let i = 0; i < userList.length; i++) {
      let nickname = userList[i].nickname;
      let firstname = userList[i].firstname;
      let surname = userList[i].surname;
      let tel = userList[i].tel;
      let gender = userList[i].gender === 'MALE' ? '男' : '女';
      let email = userList[i].email;
      let province = userList[i].province;
      let city = userList[i].city;
      let district = userList[i].district;
      let detail_address = userList[i].detail_address;
      let referral = userList[i].referral;
      let login_time = userList[i].login_time;
      let purchase_willing = userList[i].purchase_willing;
      let car_id = userList[i].car_id;
      let have_car = userList[i].have_car === 'N' ? '否' : '是';
      let car_brand = userList[i].car_brand;
      let car_model = userList[i].car_model;
      let time = new Date(userList[i].created_time);
      let row = [nickname, firstname, surname, tel, gender, email, province, city, district, detail_address, referral, login_time, purchase_willing, car_id, have_car, car_brand, car_model, time];
      data.push(row);
    }
    let date = new Date();
    let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var buffer = xlsx.build([{ name: "mySheetName", data: data }]); // Returns a buffer
    let headerValue = 'attachment;';
    let filename = '注册用户' + time + '.xlsx';
    headerValue += ' filename="' + encodeURIComponent(filename) + '";';
    ctx.set('Content-Disposition', headerValue);
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.body = buffer;
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
      message: '下载失败，请重试'
    };
  }
};

let registerUserDetail = async function (ctx) {
  try {
    let member_id = ctx.request.body.member_id || '';
    let options = {
      member_id: member_id
    };
    schema.validate(options, schema.registerUserDetail);
    let result = await userManage.registerUserDetail(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回注册用户详情成功'
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
      message: '返回注册用户详情失败，请重试'
    };
  }
};

let userNotificationList = async function (ctx) {
  try {
    let member_id = ctx.request.body.member_id || '',
      offset = ctx.request.body.offset || 0,
      count = ctx.request.body.count || 10;
    let options = {
      member_id: member_id,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.userNotificationList);
    let result = await userManage.notificationList(options);
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

let userAllListExport = async function (ctx) {
  try {
    let userAllList = await userManage.userAllListExport();
    let data = [];
    let row = ['姓名', '手机号', '来源', '用户状态'];
    data.push(row);
    for (let i = 0; i < userAllList.length; i++) {
      let username = userAllList[i].username;
      let tel = userAllList[i].tel;
      let referral = userAllList[i].referral;
      let status = userAllList[i].status;
      let row = [username, tel, referral, status];
      data.push(row);
    }
    let date = new Date();
    let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var buffer = xlsx.build([{ name: "mySheetName", data: data }]); // Returns a buffer
    let headerValue = 'attachment;';
    let filename = '全部用户' + time + '.xlsx';
    headerValue += ' filename="' + encodeURIComponent(filename) + '";';
    ctx.set('Content-Disposition', headerValue);
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.body = buffer;
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
      message: '下载失败，请重试'
    };
  }
};

let userNotificationPush = async function (ctx) {
  try {
    let token = ctx.req.headers.accesstoken || '';
    let tokenValue = await utils.redisClient.get(token);
    let manager = JSON.parse(tokenValue);
    let manager_id = manager.manager_id || '';
    let uuid = uuidv4();
    let member_id = ctx.request.body.member_id || '',
      content = ctx.request.body.content || '';
    let options = {
      uuid: uuid,
      manager_id: manager_id,
      member_id: member_id,
      content: content
    };
    schema.validate(options, schema.userNotificationPush);
    await userManage.notificationPush(options);
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

let invitedUserList = async function (ctx) {
  try {
    let tel = ctx.request.body.tel || '',
      offset = ctx.request.body.offset || 0,
      count = ctx.request.body.count || 10;
    let options = {
      tel: tel,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.invitedUserList);
    let result = await userManage.invitedUserList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取全部用户列表成功'
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
      message: '获取全部用户列表失败，请重试'
    };
  }
};


let invitedUserAdd = async function (ctx) {
  try {
    let username = ctx.request.body.username || '';
    let tel = ctx.request.body.tel || '';
    let referral = ctx.request.body.referral || '';
    let options = {
      username: username,
      tel: tel,
      referral: referral
    };
    schema.validate(options, schema.invitedUserAdd);
    await userManage.invitedUserAdd(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '邀请用户添加成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    } else if (e instanceof KnownErrors.ErrorAlreadyExist) {
      return ctx.body = {
        code: RETCODE.ALREADY_EXIST,
        message: '该用户已经添加过，请不要重复添加'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '邀请用户添加失败，请重试'
    };
  }
};

let invitedUserExcelAdd = async function (ctx) {
  try {
    let obj = xlsx.parse(path.join(__dirname, '../../static/uploads/user.xlsx'));
    let data = obj[0].data;
    data.shift();//将excel的头移除
    console.log(JSON.stringify(obj[0].data));
    await userManage.excelUserAdd(data);
    return ctx.body = {
      code: RETCODE.OK,
      message: 'Excel添加用户成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '文件格式出错，请注意格式'
    };
  }
};

let userUpdateList = async function (ctx) {
  try {
    let nickname = ctx.request.body.nickname || '',
      tel = ctx.request.body.tel || '',
      offset = ctx.request.body.offset || 0,
      count = ctx.request.body.count || 10;
    let options = {
      nickname: nickname,
      tel: tel,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.userUpdateList);
    let result = await userManage.userUpdateList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取更新信息列表成功'
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
      message: '获取更新信息列表失败，请重试'
    };
  }
};

let userUpdateDetail = async function (ctx) {
  try {
    let id = ctx.request.body.id || '';
    let options = {
      id: id
    };
    schema.validate(options, schema.userUpdateDetail);
    let result = await userManage.userUpdateDetail(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取用户详细更新信息成功'
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
      message: '获取用户详细更新信息失败，请重试'
    };
  }
};

let present = async function (ctx) {
  try {
    let member_id = ctx.request.body.member_id || '';
    let options = {
      member_id: member_id
    };
    await userManage.present(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '用户领取礼物状态修改成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '用户领取礼物状态修改失败，请重试'
    };
  }
};
let interest = async function (ctx) {
  try {
    let result = await userManage.interest();
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回兴趣爱好信息成功'
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
      message: '返回兴趣爱好信息信息失败，请重试'
    };
  }
};

router
  .post('/manager/user/count', userCount)
  .post('/manager/user/car', userCar) //返回偏爱的保时捷类型
  .post('/manager/user/registeruser/list', registerUserList) // 注册用户列表
  .get('/user/list/export', userListExport) //导出用户excel表格
  .post('/manager/user/registeruser/detail', registerUserDetail) //  注册用户详情
  .post('/manager/user/notification/list', userNotificationList) //  用户推送消息列表
  .post('/manager/user/notification/push', userNotificationPush) // 向注册用户推送消息
  .get('/user/all/list/export', userAllListExport) //导出用户excel表格
  .post('/manager/user/inviteduser/list', invitedUserList) // 全部用户列表
  .post('/manager/user/invited/add', invitedUserAdd) //  添加邀请用户(单个添加)
  .post('/manager/user/invited/exceladd', upload.single('file'), invitedUserExcelAdd) // 添加邀请用户(excel)
  .post('/manager/user/update/list', userUpdateList) // 获取更新信息列表
  .post('/manager/user/update/detail', userUpdateDetail) // 获取更新信息详情
  .post('/manager/user/present', present) // 修改领取礼物状态
  .post('/manager/user/interest', interest); //获取兴趣爱好


module.exports = router;
