const router = require('koa-router')();
const uuidv4 = require('uuid/v4');
const driver = require('../models/driver');
const RETCODE = require('../models/retcode');
const KnownErrors = require('../models/error');
const schema = require('../models/schema');

let driverList = async function (ctx) {
  try {
    let result = await driver.getDriveStarList();
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回极致驾客列表成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回极致驾客列表失败，请重试'
    };
  }
};

let driverDetail = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let options = {
      article_id: article_id
    };
    schema.validate(options, schema.driverDetail);
    let result = await driver.getDriveStarDetail(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回极致驾客详情成功'
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
      message: '返回极致驾客详情失败，请重试'
    };
  }
};



// 对评论进行点赞
let driverCommentUpvote = async function (ctx) {
  try {
    let member_id = ctx.session.member.member_id || '';
    let comment_id = ctx.request.body.comment_id || '';
    let options = {
      member_id: member_id,
      comment_id: comment_id
    };
    schema.validate(options, schema.driverCommentUpvote);
    await driver.driverCommentUpvote(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '评论点赞/取消点赞成功'
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
      message: '评论点赞/取消点赞失败，请重试'
    };
  }
};

let driverReplyComment = async function (ctx) {
  try {
    let uuid = uuidv4();
    let article_id = ctx.request.body.article_id || '';
    let member_id = ctx.session.member.member_id || '';
    let to_comment_id = ctx.request.body.to_comment_id || '';
    let content = ctx.request.body.content || '';
    let picture_path = ctx.request.body.picture_path || '';
    let type = ctx.request.body.type || '';
    let options = {
      uuid: uuid,
      article_id: article_id,
      member_id: member_id,
      to_comment_id: to_comment_id,
      content: content,
      picture_path: picture_path,
      type: type
    };
    schema.validate(options, schema.driverReplyComment);
    await driver.driverReplyComment(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '评论回复成功'
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
      message: '回复评论失败，请重试'
    };
  }
};

// 评论列表

let driverCommentList = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let member_id = ctx.session.member.member_id || '';
    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let options = {
      article_id: article_id,
      member_id: member_id,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.driverCommentList);
    let result = await driver.driverComment(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回评论列表成功'
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
      message: '返回评论列表失败，请重试'
    };
  }
};

// 评论添加
let driverCommentAdd = async function (ctx) {
  try {
    let uuid = uuidv4();
    let article_id = ctx.request.body.article_id || '';
    let member_id = ctx.session.member.member_id || '';
    let content = ctx.request.body.content || '';
    let picture_path = ctx.request.body.picture_path || '';
    let type = ctx.request.body.type || '';
    let options = {
      uuid: uuid,
      article_id: article_id,
      member_id: member_id,
      content: content,
      picture_path: picture_path,
      type: type
    };

      //yan zheng wei yi
      schema.validate(options, schema.driverCommentAdd);
      const pinglunData = await driver.memberDriverCommentOnly(options);
      console.log(pinglunData.length)
      if(pinglunData.length>0){
          return ctx.body = {
              code: RETCODE.PARAM_ERROR,
              message: '评论不可重复'
          };
      }

    schema.validate(options, schema.driverCommentAdd);
    await driver.driverCommentAdd(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '评论添加成功'
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
      message: '评论添加失败，请重试'
    };
  }
};






let driverApply = async function (ctx) {
  try {
    let uuid = uuidv4();
    let member_id = ctx.session.member.member_id || '';
    let options = {
      uuid: uuid,
      member_id: member_id
    };
    schema.validate(options, schema.driverApply);
    await driver.apply(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '申请极致驾客已提交，请等待审核'
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
        message: '请不要重复申请'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '申请极致驾客提交失败，请重试'
    };
  }
};



router
  .post('/member/driver/list', driverList) // 极致驾客列表
  .post('/member/driver/detail', driverDetail) //  极致驾客详情
  .post('/member/driver/comment/upvote', driverCommentUpvote) // 对评论进行点赞
  .post('/member/driver/reply/comment', driverReplyComment) // 回复评论
  .post('/member/driver/comment/list', driverCommentList) // 评论列表
  .post('/member/driver/comment/add', driverCommentAdd) // 评论添加
  .post('/member/driver/apply', driverApply); // 申请参与


module.exports = router;
