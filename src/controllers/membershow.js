const router = require('koa-router')();
const uuidv4 = require('uuid/v4');
const show = require('../models/membershow');
const RETCODE = require('../models/retcode');
const schema = require('../models/schema');
const multer = require('koa-multer');

// 通过 filename 属性定制
var storage = multer.diskStorage({
  destination: function (ctx, file, cb) {
    cb(null, 'static/uploads/');
  },
  filename: function (ctx, file, cb) {
    let origin = file.originalname.split('.');
    let format = origin[origin.length - 1];
    cb(null, uuidv4() + '.' + format);
  }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({
  storage: storage
});
// const upload = multer({
//   dest: 'static/uploads/',
//   filename:uuidv4()+
// });
// 获取光影放映厅列表 projection  // 获取燃情赛道 track  //获取911模型街  modelstreet
// 光影放映厅列表
let showList = async function (ctx) {
  try {
    let type = ctx.request.body.type || '';
    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let options = {
      type: type,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.showList);
    let result = await show.memberShowList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回挚享者说列表成功'
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

//news  推荐亲友成为车主页面记数
let showDreamCountAdd = async function (ctx) {
    try {
        let result = await show.memberDreamCountAdd();
        return ctx.body = {
            code: RETCODE.OK,
            data: result,
            message: '记数成功'
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
            message: '记数失败，请重试'
        };
    }
};


// 光影放映厅详细信息
let showDetail = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let member_id = ctx.session.member.member_id || '';
      let type = ctx.request.body.type || '';
    let options = {
      article_id: article_id,
      member_id: member_id
    };
      let optionsE = {
          type: type
      };
      schema.validate(options, schema.showDetail);
      let results = await show.memberShowLists(optionsE);
// console.log(results)
    schema.validate(options, schema.showDetail);
    let result = await show.memberShowDetail(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
        data2: results,
      message: '返回挚享者说详情成功'
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
      message: '返回挚享者说详情失败，请重试'
    };
  }
};

// 光影放映厅文章点赞
let showArticleUpvote = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let member_id = ctx.session.member.member_id || '';
    let visit_url = ctx.request.body.visit_url || '';
    let options = {
      article_id: article_id,
      member_id: member_id,
      visit_url: visit_url
    };
    schema.validate(options, schema.showArticleUpvote);
    let result = await show.memberShowUpvote(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '挚享者说点赞/取消点赞成功'
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
      message: '挚享者说点赞/取消点赞失败，请重试'
    };
  }
};


// 光影放映厅对评论进行点赞
let showCommentUpvote = async function (ctx) {
  try {
    let member_id = ctx.session.member.member_id || '';
    let comment_id = ctx.request.body.comment_id || '';
    let options = {
      member_id: member_id,
      comment_id: comment_id
    };
    schema.validate(options, schema.showCommentUpvote);
    let result = await show.commentUpvote(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '挚享者说评论点赞/取消点赞成功'
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
      message: '挚享者说评论点赞/取消点赞失败，请重试'
    };
  }
};

let showReplyComment = async function (ctx) {
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
    schema.validate(options, schema.showReplyComment);

    // 验证挚享者说回复唯一  start
    const huifuData = await show.replyCommentOnly(options);
      if(huifuData.length>0){
          return ctx.body = {
              code: RETCODE.PARAM_ERROR,
              message: '评论不可重复'
          };
      }
    // 验证挚享者说回复唯一  end

    await show.replyComment(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '挚享者说评论回复成功'
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

let showCommentList = async function (ctx) {
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
    schema.validate(options, schema.showCommentList);
    let result = await show.memberShowComment(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回挚享者说评论列表成功'
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
      message: '返回挚享者说评论列表失败，请重试'
    };
  }
};

// 评论添加
let showCommentAdd = async function (ctx) {
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
      schema.validate(options, schema.showCommentAdd);
      const pinglunData = await show.memberShowCommentOnly(options);
      // console.log(pinglunData.length)
      if(pinglunData.length>0){
          return ctx.body = {
              code: RETCODE.PARAM_ERROR,
              message: '评论不可重复'
          };
      }

    schema.validate(options, schema.showCommentAdd);
    await show.memberShowCommentAdd(options);
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


// 我要分享
let showShareAdd = async function (ctx) {
  try {
    let uuid = uuidv4();
    let member_id = ctx.session.member.member_id || '';
    let title = ctx.request.body.title || '';
    let content = ctx.request.body.content || '';
    let picture_path = ctx.request.body.picture_path || '';
    let type = ctx.request.body.type || '';
      //news 正文
      let body_text = ctx.request.body.body_text || '';
    let options = {
      uuid: uuid,
      member_id: member_id,
      title: title,
      content: content,
      picture_path: picture_path,
      type: type,
        //news 正文
        body_text: body_text
    };
    console.log(options)
    schema.validate(options, schema.showShareAdd);
    await show.memberShowAdd(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '挚享者说分享成功'
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
      message: '挚享者说分享失败，请重试'
    };
  }
};
let fileupload = async function (ctx) {
  try {
    console.log(1111, ctx.req.file);
    return ctx.body = {
      code: RETCODE.OK,
      data: {
        picture_path: '/uploads/' + ctx.req.file.filename //返回文件名
      },
      message: '上传文件成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '上传文件失败'
    };
  }
};

let visitRecordAdd = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '';
    let member_id = ctx.session.member.member_id || '';
    let visit_url = ctx.request.body.visit_url || '';
    let options = {
      article_id: article_id,
      member_id: member_id,
      visit_url: visit_url
    };
    await show.visitRecordAdd(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '添加访问记录成功'
    };

  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '添加访问记录失败'
    };
  }
};

router
  .post('/fileupload', upload.single('file'), fileupload) //上传图片文件
  .post('/member/visit/record/add', visitRecordAdd) // 添加文章访问记录
  .post('/member/show/list', showList) // 光影放映厅列表
  .post('/member/show/detail', showDetail) // 光影放映厅个人详细信息
  .post('/member/show/article/upvote', showArticleUpvote) // 光影放映厅文章点赞
  .post('/member/show/comment/upvote', showCommentUpvote) // 光影放映厅对评论进行点赞
  .post('/member/show/reply/comment', showReplyComment) // 回复评论
  .post('/member/show/comment/list', showCommentList) // 评论列表
  .post('/member/show/comment/add', showCommentAdd) // 评论添加
  .post('/member/show/share/add', showShareAdd) // 我要分享
  //news
  .post('/member/show/dream/countAdd', showDreamCountAdd); // 推荐亲友成为车主页面记数


module.exports = router;
