const router = require('koa-router')();
const analysis = require('../models/analysis');
const RETCODE = require('../models/retcode');

let getUsersInfo = async function (ctx) {
  try {
    let time = ctx.query.time || '';
    let options = {
      time: time
    };
    let result = await analysis.getUsers(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取用户信息成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '获取用户信息失败'
    };
  }
};

let getArticlesInfo = async function (ctx) {
  try {
    let time = ctx.query.time || '';
    let options = {
      time: time
    };
    let result = await analysis.getArticles(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取文章信息成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '获取文章信息失败'
    };
  }
};

let getOperation = async function (ctx) {
  try {
    let userID = ctx.query.userID || '';
    let time = ctx.query.time || '';
    let action = ctx.query.action || '';
    let options = {
      userID: userID,
      time: time,
      action: action
    };
    let result = await analysis.getOperateRecord(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取用户行为列表成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '获取用户行为列表失败'
    };
  }
};

let getComment = async function (ctx) {
  try {
    let userID = ctx.query.userID || '';
    let time = ctx.query.time || '';
    let options = {
      userID: userID,
      time: time
    };
    let commentInfo = await analysis.getCommentRecord(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: commentInfo,
      message: '获取评论信息成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '获取评论信息失败'
    };
  }
};

let getMessage = async function (ctx) {
  try {
    let time = ctx.query.time || '';
    let options = {
      time: time
    };
    let result = await analysis.getMessage(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取站内信消息成功'
    };

  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '获取站内信消息失败'
    };
  }
};

router
  .get('/porsche/users', getUsersInfo)
  .get('/porsche/articles', getArticlesInfo)
  .get('/porsche/operation', getOperation)
  .get('/porsche/comment', getComment)
  .get('/porsche/message', getMessage);



module.exports = router;
