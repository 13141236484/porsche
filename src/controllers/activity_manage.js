const router = require('koa-router')();
const activityManage = require('../models/activity_manage');
const RETCODE = require('../models/retcode');
const utils = require('../models/utils');
const schema = require('../models/schema');
const uuidv4 = require('uuid/v4');
const xlsx = require('node-xlsx');

let activityCreate = async function (ctx) {
  try {
    let token = ctx.req.headers.accesstoken || '';
    let tokenValue = await utils.redisClient.get(token);
    let manager = JSON.parse(tokenValue);
    let user_id = manager.manager_id || '';
    let uuid = uuidv4();
    let first_type = ctx.request.body.first_type || '';
    let second_type = ctx.request.body.second_type || '';
    let title = ctx.request.body.title || '';
    let picture_path = ctx.request.body.picture_path || '';
    let content = ctx.request.body.content || '';
    // let address = ctx.request.body.address || '';
    let start_time = ctx.request.body.start_time=='NaN' ? 0:ctx.request.body.start_time;
    let end_time = ctx.request.body.end_time=='NaN' ? 0:ctx.request.body.end_time;
    // let city = ctx.request.body.city || '';
    //news 小标题
    let small_title = ctx.request.body.small_title || '';
    //news 主办方
    let sponsor = ctx.request.body.sponsor || '';
    //news 活动限制人数
    let maximum = parseInt(ctx.request.body.maximum) || 0;
    //news 起始报名时间
    const start_registration_time = ctx.request.body.start_registration_time=='NaN' ? 0:ctx.request.body.start_registration_time;
    //news 结束报名时间
    let end_registration_time = ctx.request.body.end_registration_time=='NaN' ? 0:ctx.request.body.end_registration_time;
    //news 报名须知
    let notes = ctx.request.body.notes || '';
    //news 报名弹窗状态
    let popup_status = ctx.request.body.popup_status || '';
    //news 到场人数
    let present = parseInt(ctx.request.body.present) || 0;
    // gzq
    let set_join_count = parseInt(ctx.request.body.set_join_count) || 0;
    let set_maximum = parseInt(ctx.request.body.set_maximum) || 0;
    // new 是否开启报名
    let is_start_signup = ctx.request.body.is_start_signup || '';
    // new 报名提示
    let sign_tips = ctx.request.body.sign_tips || '';
    // new 全部地点时间
    let allurban_data = ctx.request.body.allurban_data || '';
    // 地点
    let place = parseInt(ctx.request.body.place) || 0;
    // 场次日期
    let field_date = parseInt(ctx.request.body.field_date) || 0;
    // 微信号
    let wechat_number = parseInt(ctx.request.body.wechat_number) || 0;
    // e-mail
    let email = parseInt(ctx.request.body.email) || 0;
    // 邮寄地址
    let mailing_address = parseInt(ctx.request.body.mailing_address) || 0;
    // 协同人员姓名
    let personnel_surname = parseInt(ctx.request.body.personnel_surname) || 0;
    // 系统人员名
    // let personnel_name = parseInt(ctx.request.body.personnel_name) || 0;
    // 协同人员手机号
    // let personnel_phone = parseInt(ctx.request.body.personnel_phone) || 0;
    // 意向车型
    let intentional_vehicle = parseInt(ctx.request.body.intentional_vehicle) || 0;
    // 所有地点时间
    let all_site_limit = ctx.request.body.all_site_limit || '';
    if(allurban_data!='[]'||allurban_data!=''){
        var city = JSON.parse(allurban_data).map(function(modle){
            return modle.city;
        });
    }
    let options = {
      uuid: uuid,
      user_id: user_id,
      first_type: first_type,
      second_type: second_type,
      title: title,
      picture_path: picture_path,
      content: content,
      // address: address,
      start_time: start_time,
      end_time: end_time,
      city: city.join('/'),
      //news
      small_title: small_title,
      sponsor: sponsor,
      maximum: maximum,
      start_registration_time: start_registration_time,
      end_registration_time: end_registration_time,
      notes: notes,
      popup_status: popup_status,
      present:present,
      // gzq
      set_join_count:set_join_count,
      set_maximum:set_maximum,
      is_start_signup: is_start_signup,
      sign_tips: sign_tips,
      allurban_data: allurban_data,

      place: place,
      field_date: field_date,
      wechat_number: wechat_number,
      email: email,
      mailing_address: mailing_address,
      personnel_surname: personnel_surname,
      // personnel_name: personnel_name,
      // personnel_phone: personnel_phone,
      intentional_vehicle: intentional_vehicle,

      all_site_limit: all_site_limit
    };
    // console.log(options);return;
    schema.validate(options, schema.activityCreate);
    let result = await activityManage.activityCreate(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '活动创建成功'
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
      message: '活动创建失败，请重试'
    };
  }
};


let activityList = async function (ctx) {
  try {
    let first_type = ctx.request.body.first_type || '';
    let second_type = ctx.request.body.second_type || '';
    let title = ctx.request.body.title || '';
    let city = ctx.request.body.city || '';
    let start_time = ctx.request.body.start_time || '';
    let end_time = ctx.request.body.end_time || '';
    let stay_at_top = ctx.request.body.stay_at_top || '';
    let is_show = ctx.request.body.is_show  || '';

    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let options = {
      first_type:first_type,
      second_type:second_type,
      title:title,
      city:city,
      start_time:start_time,
      end_time:end_time,
      stay_at_top:stay_at_top,
      is_show:is_show,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.activityList);
    let result = await activityManage.activityList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取活动列表成功'
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
      message: '返回活动列表失败，请重试'
    };
  }
};

let activityDetail = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id;
    let options = {
      article_id: article_id
    };
    let result = await activityManage.activityDetail(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回活动详情成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回活动详情失败'
    };
  }
};


let activityUserList = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let nickname = ctx.request.body.nickname || '';
    let tel = ctx.request.body.tel || '';
    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let options = {
      article_id: article_id,
      nickname: nickname,
      tel: tel,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.activityUserList);
    let result = await activityManage.activityUserList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取用户列表成功'
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
      message: '返回用户列表失败，请重试'
    };
  }
};


let activityCommentList = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let options = {
      article_id: article_id,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.activityCommentList);
    let result = await activityManage.activityCommentList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取评论列表成功'
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
//news 评论置顶
let commentTop = async function (ctx) {
    try {
        let uuid = ctx.request.body.uuid || '';
        let type = ctx.request.body.type || '';
        let options = {
            uuid: uuid,
            type: type
        };
        const result = await activityManage.commentTop(options);
        return ctx.body = {
            code: RETCODE.OK,
            result: result,
            message: '评论置顶/取消成功'
        };
    } catch (e) {
        console.log(e);
        return ctx.body = {
            code: RETCODE.ERROR,
            message: '评论置顶/取消失败，请重试'
        };
    }
};
//news fm置顶
let fmTop = async function (ctx) {
    try {
        let uuid = ctx.request.body.uuid || '';
        let type = ctx.request.body.type || '';
        let options = {
            uuid: uuid,
            type: type
        };
        const result = await activityManage.fmTop(options);
        return ctx.body = {
            code: RETCODE.OK,
            result: result,
            message: 'fm置顶/取消成功'
        };
    } catch (e) {
        console.log(e);
        return ctx.body = {
            code: RETCODE.ERROR,
            message: '评论置顶/取消失败，请重试'
        };
    }
};


let activityEdit = async function (ctx) {
  try {
    let token = ctx.req.headers.accesstoken || '';
    let tokenValue = await utils.redisClient.get(token);
    let manager = JSON.parse(tokenValue);
    let user_id = manager.manager_id || '';
    let article_id = ctx.request.body.article_id || '';
    let first_type = ctx.request.body.first_type || '';
    let second_type = ctx.request.body.second_type || '';
    let title = ctx.request.body.title || '';
    let picture_path = ctx.request.body.picture_path || '';
    let content = ctx.request.body.content || '';
    // let address = ctx.request.body.address || '';
    let start_time = ctx.request.body.start_time || '';
    let end_time = ctx.request.body.end_time || '';
    //news
    // let city = ctx.request.body.city || '';
    //news 小标题
    let small_title = ctx.request.body.small_title || '';
    //news 主办方
    let sponsor = ctx.request.body.sponsor || '';
    //news 活动限制人数
    let maximum = parseInt(ctx.request.body.maximum) || 0;
    //news 起始报名时间
    const start_registration_time = ctx.request.body.start_registration_time=='0' ? 0:ctx.request.body.start_registration_time;
    //news 结束报名时间
    let end_registration_time = ctx.request.body.end_registration_time=='0' ? 0:ctx.request.body.end_registration_time;
    //news 报名须知
    let notes = ctx.request.body.notes || '';
    //news 报名弹窗状态
    let popup_status = ctx.request.body.popup_status || '';
    //news 到场人数
    let present = parseInt(ctx.request.body.present) || 0;
    // gzq
    let set_join_count = parseInt(ctx.request.body.set_join_count) || 0;
    let set_maximum = parseInt(ctx.request.body.set_maximum) || 0;
    // new 是否开启报名
    let is_start_signup = ctx.request.body.is_start_signup || '';
    // new 报名提示
    let sign_tips = ctx.request.body.sign_tips || '';
    // new 全部地点时间
    let allurban_data = ctx.request.body.allurban_data || '';
    // 地点
    let place = parseInt(ctx.request.body.place) || 0;
    // 场次日期
    let field_date = parseInt(ctx.request.body.field_date) || 0;
    // 微信号
    let wechat_number = parseInt(ctx.request.body.wechat_number) || 0;
    // e-mail
    let email = parseInt(ctx.request.body.email) || 0;
    // 邮寄地址
    let mailing_address = parseInt(ctx.request.body.mailing_address) || 0;
    // 协同人员姓
    let personnel_surname = parseInt(ctx.request.body.personnel_surname) || 0;
    // 系统人员名
    // let personnel_name = parseInt(ctx.request.body.personnel_name) || 0;
    // 协同人员手机号
    // let personnel_phone = parseInt(ctx.request.body.personnel_phone) || 0;
    // 意向车型
    let intentional_vehicle = parseInt(ctx.request.body.intentional_vehicle) || 0;
    // 所有地点时间
    let all_site_limit = ctx.request.body.all_site_limit || '';
    if(allurban_data!='[]'||allurban_data!=''){
        var city = JSON.parse(allurban_data).map(function(modle){
            return modle.city;
        });
    }
    // let options = {
    //   article_id: article_id,
    //   user_id: user_id,
    //   first_type: first_type,
    //   second_type: second_type,
    //   title: title,
    //   picture_path: picture_path,
    //   content: content,
    //   address: address,
    //   start_time: start_time,
    //   end_time: end_time
    //   // custom:custom
    // };
      let options = {
          article_id: article_id,
          user_id: user_id,
          first_type: first_type,
          second_type: second_type,
          title: title,
          picture_path: picture_path,
          content: content,
          // address: address,
          start_time: start_time,
          end_time: end_time,
          city: city.join('/'),
          //news
          small_title: small_title,
          sponsor: sponsor,
          maximum: maximum,
          start_registration_time: start_registration_time,
          end_registration_time: end_registration_time,
          notes: notes,
          popup_status: popup_status,
          present: present,
          set_join_count: set_join_count,
          set_maximum: set_maximum,
          is_start_signup: is_start_signup,
          sign_tips: sign_tips,
          allurban_data,allurban_data,

          place: place,
          field_date: field_date,
          wechat_number: wechat_number,
          email: email,
          mailing_address: mailing_address,
          personnel_surname: personnel_surname,
          // personnel_name: personnel_name,
          // personnel_phone: personnel_phone,
          intentional_vehicle: intentional_vehicle,

          all_site_limit: all_site_limit
      };
    // console.log(options);
    schema.validate(options, schema.activityEdit);
    let result = await activityManage.activityEdit(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '活动编辑成功'
    };
  } catch (e) {
    // console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '活动编辑失败，请重试'
    };
  }
};


let activityDelete = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let options = {
      article_id: article_id
    };
    schema.validate(options, schema.activityDelete);
    await activityManage.activityDelete(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '删除活动成功'
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
      message: '删除活动失败，请重试'
    };
  }
};

let commentReply = async function (ctx) {
  try {
    let token = ctx.req.headers.accesstoken || '';
    let tokenValue = await utils.redisClient.get(token);
    let manager = JSON.parse(tokenValue);
    let user_id = manager.manager_id || '';
    let uuid = uuidv4();
    let article_id = ctx.request.body.article_id || '';
    let to_comment_id = ctx.request.body.to_comment_id || '';
    let content = ctx.request.body.content || '';
    let type = ctx.request.body.type || '';
    let options = {
      uuid: uuid,
      article_id: article_id,
      user_id: user_id,
      to_comment_id: to_comment_id,
      content: content,
      type: type
    };
    await activityManage.commentReply(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '评论回复成功'
    };
  } catch (e) {
    console.log(e);
    // if (e.name === 'ValidationError') {
    //   return ctx.body = {
    //     code: RETCODE.PARAM_ERROR,
    //     message: '参数错误'
    //   };
    // }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '回复评论失败，请重试'
    };
  }
};

let commentDelete = async function (ctx) {
  try {
    let comment_id = ctx.request.body.comment_id || '';
    let options = {
      comment_id: comment_id
    };
    await activityManage.commentDelete(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '删除评论成功'
    };
  } catch (e) {
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '回复删除失败，请重试'
    };
  }
};

let commentReplyDelete = async function (ctx) {
  try {
    let comment_id = ctx.request.body.comment_id || '';
    let options = {
      comment_id: comment_id
    };
    await activityManage.commentDelete(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '评论回复删除成功'
    };
  } catch (e) {
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '评论回复删除失败，请重试'
    };
  }
};

let activityUserExport = async function (ctx) {
  let article_id = ctx.query.article_id || '';
  let options = {
    article_id: article_id
  };
  let result = await activityManage.activityUserExport(options);
  let data = [];
  let row = ['昵称', '名', '姓', '手机号','性别', '参与时间'];
  data.push(row);
  for (let i = 0; i < result.length; i++) {
    let nickname = result[i].nickname;
    let firstname = result[i].firstname;
    let surname = result[i].surname;
    let tel = result[i].tel;
    let gender = result[i].gender === 'MALE' ? '男' : '女';
    let time = new Date(result[i].created_time);
    let row = [nickname, firstname, surname, tel, gender, time];
    data.push(row);
  }
  let date = new Date();
  let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  var buffer = xlsx.build([{ name: "参与人员", data: data }]); // Returns a buffer
  let headerValue = 'attachment;';
  let filename = '参与人员' + time + '.xlsx';
  headerValue += ' filename="' + encodeURIComponent(filename) + '";';
  ctx.set('Content-Disposition', headerValue);
  ctx.set('Content-Type', 'application/octet-stream');
  ctx.body = buffer;
};
let activityCommentExport = async function (ctx) {

  let article_id = ctx.query.article_id || '';
  let options = {
    article_id: article_id
  };
  let result = await activityManage.activityCommentExport(options);
  let data = [];
  let row = ['昵称', '名', '姓', '手机号', '性别', '活动留言', '留言时间'];
  data.push(row);
  for (let i = 0; i < result.length; i++) {
    let nickname = result[i].nickname;
    let firstname = result[i].firstname;
    let surname = result[i].surname;
    let tel = result[i].tel;
    let gender = result[i].gender === 'MALE' ? '男' : '女';
    let content = result[i].content;
    let time = new Date(result[i].created_time);
    let row = [nickname, firstname, surname, tel, gender, content, time];
    data.push(row);
  }
  let date = new Date();
  let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  var buffer = xlsx.build([{ name: "评论内容", data: data }]); // Returns a buffer
  let headerValue = 'attachment;';
  let filename = '评论内容' + time + '.xlsx';
  headerValue += ' filename="' + encodeURIComponent(filename) + '";';
  ctx.set('Content-Disposition', headerValue);
  ctx.set('Content-Type', 'application/octet-stream');
  ctx.body = buffer;
};

let showOrHide = async function(ctx){
  try {
    let article_id = ctx.request.body.article_id || '';
    let options = {
      article_id: article_id
    };
    schema.validate(options, schema.showOrHide);
    let result = await activityManage.showOrHide(options);
      return ctx.body = {
        code: RETCODE.OK,
        data: result,
        message: '隐藏显示成功'
      };
  } catch (e) {
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '隐藏显示失败，请重试'
    };
  }
};

router
  .post('/manager/activity/create', activityCreate) //活动创建
  .post('/manager/activity/list', activityList) //活动列表
  .post('/manager/activity/detail', activityDetail)
  .post('/manager/activity/user/list', activityUserList) //活动参与用户列表
  .post('/manager/activity/comment/list', activityCommentList) //活动评论列表
  .post('/manager/activity/edit', activityEdit) //活动编辑
  .post('/manager/activity/delete', activityDelete) //活动删除
  .post('/manager/activity/comment/reply', commentReply) //回复评论
  .post('/manager/activity/comment/delete', commentDelete) //删除评论
  .post('/manager/activity/comment/reply/delete', commentReplyDelete) //删除回复
  .get('/activity/user/export', activityUserExport)     //导出活动参与人员
  .get('/activity/comment/export', activityCommentExport)    // 导出文章评论内容
    //news
    .post('/manager/activity/fm/commenttop', commentTop) //评论置顶
    .post('/manager/activity/fm/fmlisttop', fmTop) //FM置顶
    // gzq
    .post('/manager/activity/show_hide', showOrHide);// 文章显示隐藏

module.exports = router;
