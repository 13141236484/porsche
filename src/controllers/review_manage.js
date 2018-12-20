const router = require('koa-router')();
const reviewManage = require('../models/review_manage');
const RETCODE = require('../models/retcode');
const utils = require('../models/utils');
const uuidv4 = require('uuid/v4');
const KnownErrors = require('../models/error');
const schema = require('../models/schema');


let reviewShowList = async function (ctx) {
  try {
    let second_type = ctx.request.body.second_type || '';
    let nickname = ctx.request.body.nickname || '';
    let title = ctx.request.body.title || '';
    let stay_at_top = ctx.request.body.stay_at_top || 0;
    let start_time = ctx.request.body.start_time || '';
    let end_time = ctx.request.body.end_time || '';
    let status = ctx.request.body.status || '';

    let offset = parseInt(ctx.request.body.offset) || 0;
    let count = parseInt(ctx.request.body.count) || 10;
    let options = {
      second_type:second_type,
      nickname:nickname,
      title:title,
      stay_at_top:stay_at_top,
      start_time:start_time,
      end_time:end_time,
      status:status,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.reviewShowList);
    let result = await reviewManage.reviewShowList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取挚享者说列表成功'
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
      message: '返回挚享者说列表失败，请重试'
    };
  }
};


let reviewShowPass = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let options = {
      article_id: article_id
    };
    // schema.validate(options, schema.reviewArticle);
    await reviewManage.reviewShowPass(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '挚享者说审核成功'
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
      message: '挚享者说审核失败，请重试'
    };
  }
};

let reviewShowDelete = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let options = {
      article_id: article_id
    };
    await reviewManage.deleteArticle(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '删除文章成功'
    };
  } catch (e) {
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '删除文章失败，请重试'
    };
  }
};


let reviewShowDetail = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let options = {
      article_id: article_id
    };
    let result = await reviewManage.reviewShowDetail(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回文章详情成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '获取文章详情失败，请重试'
    };
  }
};


let reviewShowEdit = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let title = ctx.request.body.title || '';
    let content = ctx.request.body.content || '';
    let status = ctx.request.body.status || '';
    let options = {
      article_id: article_id,
      title: title,
      content: content,
      status: status
    };
    await reviewManage.reviewShowEdit(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '编辑文章成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '编辑文章失败，请重试'
    };
  }
};



let reviewShowTop = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let options = {
      article_id: article_id
    };
    const result = await reviewManage.reviewShowTop(options);
    return ctx.body = {
      code: RETCODE.OK,
      result: result,
      message: '挚享者说文章置顶/取消成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '挚享者说文章置顶/取消失败，请重试'
    };
  }
};
//news 评论置顶
let commentTop = async function (ctx) {
    try {
        let id = ctx.request.body.id || '';
        let options = {
            id: id
        };
        const result = await reviewManage.commentTop(options);
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


let showCommentList = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let options = {
      article_id: article_id,
      offset: offset,
      count: count
    };
    // schema.validate(options, schema.activityCommentList);
    let result = await reviewManage.commentList(options);
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

let showCommentReply = async function (ctx) {
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
    await reviewManage.commentReply(options);
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

let showCommentDelete = async function (ctx) {
  try {
    let comment_id = ctx.request.body.comment_id || '';
    let options = {
      comment_id: comment_id
    };
    await reviewManage.deleteComment(options);
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

let showCommentReplyDelete = async function (ctx) {
  try {
    let to_comment_id = ctx.request.body.to_comment_id || '';
    let options = {
      to_comment_id: to_comment_id
    };
    console.log(options);
    await reviewManage.deleteReply(options);
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




let reviewDriverList = async function (ctx) {
  try {
    let offset = parseInt(ctx.request.body.offset) || 0;
    let count = parseInt(ctx.request.body.count) || 0;
    let options = {
      offset: offset,
      count: count
    };
    schema.validate(options, schema.reviewShowList);
    
    let result = await reviewManage.reviewdriverList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取审核列表成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回审核列表失败，请重试'
    };
  }
};

let reviewDriverDetail = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id;
    let options = {
      article_id: article_id
    };
    let result = await reviewManage.driverDetail(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回试驾详情成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回试驾详情失败'
    };
  }
};



let reviewDriverEdit = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let title = ctx.request.body.title || '';
    let picture_path = ctx.request.body.picture_path || '';
    let content = ctx.request.body.content || '';
    let status = ctx.request.body.status || '';

    let options = {
      article_id: article_id,
      title: title,
      picture_path: picture_path,
      content: content,
      status: status
    };
    console.log(options);
    // schema.validate(options, schema.activityEdit);
    await reviewManage.driverEdit(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '极致驾客编辑成功'
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
      message: '极致驾客编辑失败，请重试'
    };
  }
};

let driverCommentList = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let options = {
      article_id: article_id,
      offset: offset,
      count: count
    };
    // schema.validate(options, schema.activityCommentList);
    let result = await reviewManage.commentList(options);
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

let driverCommentReply = async function (ctx) {
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
    await reviewManage.commentReply(options);
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

let driverCommentDelete = async function (ctx) {
  try {
    let comment_id = ctx.request.body.comment_id || '';
    let options = {
      comment_id: comment_id
    };
    await reviewManage.deleteComment(options);
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

let driverCommentReplyDelete = async function (ctx) {
  try {
    let to_comment_id = ctx.request.body.to_comment_id || '';
    let options = {
      to_comment_id: to_comment_id
    };
    await reviewManage.deleteReply(options);
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

let reviewDriverAdd = async function (ctx) {
  try {
    let tel = ctx.request.body.tel || '';
    let title = ctx.request.body.title || '';
    let picture_path = ctx.request.body.picture_path || '';
    let content = ctx.request.body.content || '';

    let options = {
      tel: tel,
      title: title,
      picture_path: picture_path,
      content: content
    };
    console.log(options);
    // schema.validate(options, schema.activityEdit);
    await reviewManage.driverAdd(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '极致驾客申请提交已经成功'
    };
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    } else if (e instanceof KnownErrors.ErrorNotFound) {
      return ctx.body = {
        code: RETCODE.NOT_FOUND,
        message: '该手机号未注册'
      };
    } else if (e instanceof KnownErrors.ErrorAlreadyExist) {
      return ctx.body = {
        code: RETCODE.ALREADY_EXIST,
        message: '极致驾客申请提交已经成功'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '极致驾客添加失败，请重试'
    };
  }
};

let reviewDriverDelete = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let options = {
      article_id: article_id
    };
    await reviewManage.deleteDriver(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '删除极致驾客成功'
    };
  } catch (e) {
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '删除极致驾客失败，请重试'
    };
  }
};
//news 评论置顶
let driverCommentTop = async function (ctx) {
    try {
        let uuid = ctx.request.body.uuid || '';
        let type = ctx.request.body.type || '';
        let options = {
            uuid: uuid,
            type: type
        };
        const result = await reviewManage.driverCommentTop(options);
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

let reviewShowNoPass = async function(ctx){
  try{
    let token = ctx.req.headers.accesstoken || '';
    let tokenValue = await utils.redisClient.get(token);
    let manager = JSON.parse(tokenValue);
    let manager_id = manager.manager_id || '';

    let article_id = ctx.request.body.article_id || '';
    let content = ctx.request.body.content || '';
    let options = {
      manager_id: manager_id,
      article_id: article_id,
      content: content
    };
    // schema.validate(options, schema.reviewArticle);
    await reviewManage.reviewShowNoPass(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '挚享者说审核驳回成功'
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
      message: '挚享者说审核驳回失败，请重试'
    };

  }
};





router
  .post('/manager/review/show/list', reviewShowList) //我要分享列表
  .post('/manager/review/show/pass', reviewShowPass) //文章审核
  .post('/manager/review/show/no_pass', reviewShowNoPass) // new add 审核不通过
  .post('/manager/review/show/delete', reviewShowDelete)  //文章删除

  .post('/manager/review/show/detail', reviewShowDetail)  //文章详情
  .post('/manager/review/show/edit', reviewShowEdit)  //文章编辑

  .post('/manager/review/show/top', reviewShowTop)    //文章置顶
    //news
    .post('/manager/review/show/commenttop', commentTop)    //评论置顶

  .post('/manager/review/show/comment/list', showCommentList)   // 挚享者说评论列表
  .post('/manager/review/show/comment/reply', showCommentReply) //挚享者回复评论
  .post('/manager/review/show/comment/delete', showCommentDelete) //挚享者说删除评论
  .post('/manager/review/show/comment/reply/delete', showCommentReplyDelete) //挚享者说删除回复

  .post('/manager/review/driver/list', reviewDriverList)   //极致驾客列表
  .post('/manager/review/driver/detail', reviewDriverDetail) // 获取极致驾客详细信息
  .post('/manager/review/driver/edit', reviewDriverEdit)  //极致驾客编辑
  //news
  .post('/manager/review/driver/comment/top', driverCommentTop)  // 极致驾客评论置顶
    .post('/manager/review/driver/comment/list', driverCommentList)  // 极致驾客评论列表
  .post('/manager/review/driver/comment/reply', driverCommentReply) //极致驾客回复评论
  .post('/manager/review/driver/comment/delete', driverCommentDelete) //极致驾客删除评论
  .post('/manager/review/driver/comment/reply/delete', driverCommentReplyDelete) //极致驾客删除回复

  .post('/manager/review/driver/add', reviewDriverAdd)  //极致驾客添加
  .post('/manager/review/driver/delete', reviewDriverDelete); // 极致驾客删除

module.exports = router;









