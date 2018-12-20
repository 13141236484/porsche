const router = require('koa-router')();
const pictureManage = require('../models/picture_manage');
const RETCODE = require('../models/retcode');
// const schema = require('../models/schema');


let pictureList = async function (ctx) {
  try {
    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let options = {
      offset: offset,
      count: count
    };
    let result = await pictureManage.pictureList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取图片列表成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回图片列表失败，请重试'
    };
  }
};

let pictureDetail = async function (ctx) {
  try {
    let id = ctx.request.body.id;
    let options = {
      id: id
    };
    let result = await pictureManage.pictureDetail(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取图片详情成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回图片详情失败，请重试'
    };
  }
};


let pictureUpdate = async function (ctx) {
  try {
    let id = ctx.request.body.id,
      picture_path = ctx.request.body.picture_path,
      picture_order = ctx.request.body.picture_order,
      type = ctx.request.body.type,
      status = ctx.request.body.status,
      picture_path_app = ctx.request.body.picture_path_app,
      content = ctx.request.body.content;
    let options = {
      id: id,
      picture_path: picture_path,
      picture_order: picture_order,
      type: type,
      status: status,
      picture_path_app: picture_path_app,
      content: content
    };

    await pictureManage.pictureUpdate(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '图片修改成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '图片修改失败，请重试'
    };
  }
};

let pictureAdd = async function (ctx) {
  try {
    let picture_path = ctx.request.body.picture_path,
      picture_order = ctx.request.body.picture_order,
      type = ctx.request.body.type,
      status = ctx.request.body.status,
      picture_path_app = ctx.request.body.picture_path_app,
      content = ctx.request.body.content;
    let options = {
      picture_path: picture_path,
      picture_order: picture_order,
      type: type,
      status: status,
      picture_path_app: picture_path_app,
      content: content
    };

    await pictureManage.pictureAdd(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '图片添加成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '图片添加失败，请重试'
    };
  }
};




router
  .post('/manager/picture/list', pictureList) //获取图片列表
  .post('/manager/picture/detail', pictureDetail) //获取图片
  .post('/manager/picture/update', pictureUpdate) //修改图片
  .post('/manager/picture/add', pictureAdd); //添加图片



module.exports = router;









