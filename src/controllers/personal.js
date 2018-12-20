const router = require('koa-router')();
const personal = require('../models/personal');
const RETCODE = require('../models/retcode');
const schema = require('../models/schema');

let personalUserInfo = async function (ctx) {
  try {
    let member_id = ctx.session.member.member_id || '';
    let options = {
      member_id: member_id
    };
    console.log(member_id);
    schema.validate(options, schema.personalUserInfo);
    let result = await personal.userInfo(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回用户信息成功'
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
      message: '返回用户信息失败，请重试'
    };
  }
};

let personalProvince = async function (ctx) {
  try {
    let result = await personal.province();
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回省份信息成功'
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
      message: '返回省份信息失败，请重试'
    };
  }
};


let personalCity = async function (ctx) {
  try {
    let province_id = ctx.request.body.province_id || '';
    let options = {
      province_id: province_id
    };
    schema.validate(options, schema.personalCity);
    let result = await personal.city(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回城市信息成功'
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
      message: '返回城市信息失败，请重试'
    };
  }
};


let personalCar = async function (ctx) {
  try {
    let result = await personal.porscheCar();
    console.log(111111111111)
    console.log(result)
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

let personalInfoUpdate = async function (ctx) {
  try {
    let avatar = ctx.request.body.avatar,
      nickname = ctx.request.body.nickname,
      gender = ctx.request.body.gender,
      firstname = ctx.request.body.firstname,
      surname = ctx.request.body.surname,
      province_id = ctx.request.body.province_id,
      city_id = ctx.request.body.city_id,
      district = ctx.request.body.district,
      detail_address = ctx.request.body.detail_address,
      email = ctx.request.body.email,
      purchase_willing = ctx.request.body.purchase_willing,
      car_id = ctx.request.body.car_id,
      have_car = ctx.request.body.have_car,
      // car_brand = ctx.request.body.car_brand,
      // car_model = ctx.request.body.car_model,
      brand_model = ctx.request.body.brand_model,
      interest = ctx.request.body.interest,
      member_id = ctx.session.member.member_id;
    let options = {
      avatar: avatar,
      nickname: nickname,
      gender: gender,
      firstname: firstname,
      surname: surname,
      province_id: province_id,
      city_id: city_id,
      district: district,
      detail_address: detail_address,
      email: email,
      purchase_willing: purchase_willing,
      car_id: car_id,
      have_car: have_car,
      // car_brand: car_brand,
      // car_model: car_model,
      brand_model: brand_model,
      interest: interest,
      member_id: member_id
    };
    await personal.infoChange(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '更新个人信息成功'
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
      message: '更新个人信息失败，请重试'
    };
  }
};

let personalBrowse = async function (ctx) {
  try {
    let member_id = ctx.session.member.member_id || '';
    let options = {
      member_id: member_id
    };
    schema.validate(options, schema.personalBrowse);
    let result = await personal.browse(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取浏览列表成功'
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
      message: '获取浏览列表失败，请重试'
    };
  }
};

let personalBrowseDelete = async function (ctx) {
  try {
    let id = ctx.request.body.id || '';
    let options = {
      id: id
    };
    schema.validate(options, schema.personalBrowseDelete);
    await personal.browseDelete(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '删除浏览记录成功'
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
      message: '删除浏览记录失败，请重试'
    };
  }
};

let personalActivityList = async function (ctx) {
  try {
    let member_id = ctx.session.member.member_id || '';
    let options = {
      member_id: member_id
    };
    schema.validate(options, schema.personalActivityList);
    let result = await personal.activityList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取参与活动列表成功'
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
      message: '获取参与活动列表失败，请重试'
    };
  }
};

let personalNotificationList = async function (ctx) {
  try {
    let member_id = ctx.session.member.member_id || '';
    let options = {
      member_id: member_id
    };
    schema.validate(options, schema.notificationList);
    let result = await personal.notificationList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取通知信息列表成功'
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
      message: '获取通知信息列表失败，请重试'
    };
  }
};

let personalNotificationRead = async function (ctx) {
  try {
    let notification_id = ctx.request.body.notification_id || '';
    let member_id = ctx.session.member.member_id;
    let options = {
      notification_id: notification_id,
      member_id: member_id
    };
    schema.validate(options, schema.notificationRead);
    let count = await personal.notificationRead(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: {
        is_read: 'Y',
        count: count
      },
      message: '阅读通知成功'
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
      message: '阅读通知失败，请重试'
    };
  }
};


let personalNotificationDelete = async function (ctx) {
  try {
    let notification_id = ctx.request.body.notification_id || '';
    let options = {
      notification_id: notification_id
    };
    schema.validate(options, schema.notificationDelete);
    await personal.notificationDelete(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '删除通知成功'
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
      message: '删除通知失败，请重试'
    };
  }
};

let personalNotificationReply = async function (ctx) {
  try {
    let member_id = ctx.session.member.member_id || '',
      content = ctx.request.body.content || '';
    let options = {
      member_id: member_id,
      content: content
    };
    schema.validate(options, schema.notificationReply);
    await personal.notificationReply(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '留言成功'
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
      message: '留言失败，请重试'
    };
  }
};


let personalPostList = async function (ctx) {
  try {
    let member_id = ctx.session.member.member_id || '';
    let options = {
      member_id: member_id
    };
    schema.validate(options, schema.postList);
    let result = await personal.postList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取帖子列表成功'
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
      message: '获取帖子列表失败，请重试'
    };
  }
};


let personalPostDelete = async function (ctx) {
  try {
    let post_id = ctx.request.body.post_id || '';
    let options = {
      post_id: post_id
    };
    schema.validate(options, schema.postDelete);
    await personal.postDelete(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '删除帖子成功'
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
      message: '删除帖子失败，请重试'
    };
  }
};

let personalPostRecover = async function (ctx) {
  try {
    let post_id = ctx.request.body.post_id || '';
    let options = {
      post_id: post_id
    };
    schema.validate(options, schema.postDelete);
    await personal.postRecover(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '恢复帖子成功'
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
      message: '恢复帖子失败，请重试'
    };
  }
};

let userMessage = async function (ctx) {
  try {
    let member_id = ctx.session.member.member_id || '';
    let options = {
      member_id: member_id
    };
    schema.validate(options, schema.notificationList);
    let result = await personal.userMessage(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回推送消息数量'
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
      message: '获取消息数量失败，请重试'
    };
  }
};

// 座驾品牌
let carBrand = async function (ctx) {
  try {
    let result = await personal.carBrand();
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回保时捷车型品牌信息成功'
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
      message: '返回车型品牌信息失败，请重试'
    };
  }
};

// 座驾型号
let carModel = async function(ctx){
  try {
    let brand_id = ctx.request.body.brand_id || '';
    let options = {
      brand_id: brand_id
    };
    let result = await personal.carType(options);
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
      message: '返回车型信息失败，请重试'
    };
  }
};

// 品牌模糊查询
let findBrand = async function(ctx){
  try {
    let brand_name = ctx.request.body.brand_name || '';
    let options = {
      brand_name: brand_name
    };
    schema.validate(options, schema.checkBrand);
    let result = await personal.findBrand(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回保时捷品牌信息成功'
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
      message: '返回品牌信息失败，请重试'
    };
  }
};



router
  .post('/member/user/info', personalUserInfo) // 返回用户信息
  .post('/member/user/province', personalProvince)//返回省份信息
  .post('/member/user/city', personalCity) //返回城市信息
  .post('/member/user/car', personalCar) //返回偏爱的保时捷类型
  .post('/member/user/info/update', personalInfoUpdate) // 更新用户信息
  .post('/member/user/browse', personalBrowse) // 返回用户浏览记录
  .post('/member/user/browse/delete', personalBrowseDelete) //  删除浏览记录
  .post('/member/user/activity/list', personalActivityList) // 参与活动列表
  .post('/member/user/notification/list', personalNotificationList) // 返回消息列表
  .post('/member/user/notification/read', personalNotificationRead)  // 返回消息已读
  .post('/member/user/notification/delete', personalNotificationDelete) //  删除消息
  .post('/member/user/notification/reply', personalNotificationReply) // 留言回复
  .post('/member/user/post/list', personalPostList) //  发帖列表
  .post('/member/user/post/delete', personalPostDelete) //  删除发帖
  .post('/member/user/post/recover', personalPostRecover)  // 恢复发帖
  .post('/member/user/message', userMessage) //返回推送消息数量

  .post('/member/user/car/brand', carBrand) // 座驾品牌
  .post('/member/user/car/model', carModel) // 座驾车型
  .post('/member/user/find/brand', findBrand);// 模糊查询品牌信息
module.exports = router;
