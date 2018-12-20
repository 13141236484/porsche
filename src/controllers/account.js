const router = require('koa-router')();
const uuidv4 = require('uuid/v4');
const user = require('../models/user');
const utils = require('../models/utils');
const RETCODE = require('../models/retcode');
const KnownErrors = require('../models/error');
const schema = require('../models/schema');
const crypto = require('crypto');
const generateToken = function () {
  return crypto.createHash('md5').update(new Date().getTime() + '&(&#&$@#)' + Math.random()).digest('hex');
};
const expireTime = 15 * 24 * 3600;

//获取图片
let getPicture = async function (ctx) {
  try {
    var member_id = ctx.session.member.member_id || '';
    let notificats = await utils.notificat(member_id);
    let type = ctx.request.body.type || '';
    let options = {
      type: type
    };
    schema.validate(options, schema.getPicture);
    let pictures = await utils.getPicture(options);
    // console.log(pictures);return;
    return ctx.body = {
      code: RETCODE.OK,
      data: pictures,
      news: notificats,
      message: '获取图片成功'
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
      message: '获取图片失败'
    };
  }
};


//获取图片
let getPictures = async function (ctx) {
    try {
        let type = ctx.request.body.type || '';
        let options = {
            type: type
        };
        schema.validate(options, schema.getPicture);
        let pictures = await utils.getPicture(options);
        console.log(pictures);
        return ctx.body = {
            code: RETCODE.OK,
            data: pictures,
            message: '获取图片成功'
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
            message: '获取图片失败'
        };
    }
};



let interestAdd = async function (ctx) {
  try {
    let tel = ctx.request.body.tel;
    let interest = ctx.request.body.interest;
    let url = ctx.request.body.url || '';
    let options = {
      tel: tel,
      interest: interest
    };
    let checkUser = await user.checkUser(tel);
    if (checkUser.length === 0) throw new KnownErrors.ErrorNoPermission();
    else if (checkUser[0].status === 'UNREGISTERED') {
      return ctx.body = {
        code: RETCODE.NEED_REGITER,
        message: '请先注册'
      };
    } else if (checkUser[0].status === 'REGISTERED') {
      await user.interestAdd(options);
      ctx.session.member = {
        member_id: checkUser[0].uuid,
        nickname: checkUser[0].nickname,
        tel: checkUser[0].tel,
        role: 'MEMBER'
      };
      await user.loginHistory({ member_id: checkUser[0].uuid,url: url });//记录登录次数
      return ctx.body = {
        code: RETCODE.OK,
        data: {
          member_id: checkUser[0].uuid,
          avatar: checkUser[0].avatar,
          nickname: checkUser[0].nickname
        },
        message: '登录成功'
      };
    }
  } catch (e) {
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '登录失败'
    };
  }
};

// 会员登录
let memberSignin = async function (ctx) {
  try {
    let tel = ctx.request.body.tel || '';
    let url = ctx.request.body.url || '';
    // let codes = ctx.request.body.code || '';
    // let status = ctx.request.body.status || '';
    var options = {
      tel: tel
    };
    // console.log('aaaaaaaaaaa');return;

    // //news
    // var optionsA = {
    //     phone_tel: tel,
    //     code: codes
    // };




                  
                      

                        schema.validate(options, schema.memberSignin);
                        var checkUser = await user.checkUser(tel);

                        if (checkUser.length === 0) throw new KnownErrors.ErrorNoPermission();
                        else if (checkUser[0].status === 'UNREGISTERED') {
                          return ctx.body = {
                            code: RETCODE.NEED_REGITER,
                            message: '请先注册'
                          };
                        } else if (checkUser[0].status === 'REGISTERED') {


                        //news 验证码是否过期
                  //     schema.validate(optionsA, schema.duanxinMember);
                  //     let codeStatus = await user.codeOverdue(optionsA);
                  //     // console.log(codeStatus);return;
                  //   if(codeStatus == 2){
                  //     return ctx.body = {
                  //         code: RETCODE.PARAM_ERROR,
                  //         message: '验证码已过期'
                  //     };
                  // }
                  // //news 验证手机验证码
                  // var result = await user.codeData(optionsA);
                  // if(result.length > 0){



                          // console.log(checkUser[0])
                          if (!checkUser[0].interest) {
                            // console.log(11111);return;
                            return ctx.body = {
                              code: RETCODE.ADD_INTEREST,
                              message: '请先填写兴趣爱好'
                            };
                          }
                            // console.log(22222);return;
                          ctx.session.member = {
                            member_id: checkUser[0].uuid,
                            nickname: checkUser[0].nickname,
                            tel: checkUser[0].tel,
                            role: 'MEMBER'
                          };

                          await user.loginHistory({ member_id: checkUser[0].uuid,url: url });//记录登录次数
                          return ctx.body = {
                            code: RETCODE.OK,
                            data: {
                              member_id: checkUser[0].uuid,
                              avatar: checkUser[0].avatar,
                              nickname: checkUser[0].nickname
                            },
                            message: '登录成功'
                          };



                  // }else{
                  //     return ctx.body = {
                  //         code: RETCODE.PARAM_ERROR,
                  //         message: '验证码有误'
                  //     };
                  // }



                        }


                 




    
  } catch (e) {
    console.log(e);
    if (e.name === 'ValidationError') {
      return ctx.body = {
        code: RETCODE.PARAM_ERROR,
        message: '参数错误'
      };
    } else if (e instanceof KnownErrors.ErrorNoPermission) {
      return ctx.body = {
        code: RETCODE.NO_PERMISSION,
        message: '你没有权限进行登录'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '登录失败，请重试'
    };
  }
};

// 会员注册
let memberRegister = async function (ctx) {
  try {
    let uuid = uuidv4();
    let tel = ctx.request.body.tel || '';
    let gender = ctx.request.body.gender || '';
    let nickname = ctx.request.body.nickname || '';
    let interest = ctx.request.body.interest || '';
    let present = ctx.request.body.present || '';
    let firstname = ctx.request.body.firstname || '';
    let surname = ctx.request.body.surname || '';
    let referral = ctx.request.body.referral || '';
    // let codes = ctx.request.body.code || '';
    let options = {
      uuid: uuid,
      tel: tel,
      gender: gender,
      nickname: nickname,
      interest: interest,
      present: present,
      firstname: firstname,
      surname: surname,
      referral: referral
    };

    // console.log('aaaaaaaaaaa');return;


    schema.validate(options, schema.memberRegister);
    let checkUser = await user.checkUser(tel);
    if (checkUser.length === 0) throw new KnownErrors.ErrorNoPermission();
    else if (checkUser[0].status === 'REGISTERED') throw new KnownErrors.ErrorAlreadyExist();
    else if (checkUser[0].status === 'UNREGISTERED') {
      // //news
      // let optionsA = {
      //     phone_tel: tel,
      //     code: codes
      // };
      // //news 验证码是否过期
      // schema.validate(optionsA, schema.duanxinMember);
      // var codeStatus = await user.codeOverdue(optionsA);
      // // console.log(codeStatus);return;
      // if(codeStatus == 2){
      //     return ctx.body = {
      //         code: RETCODE.PARAM_ERROR,
      //         message: '验证码已过期'
      //     };
      // }
      // //news 验证手机验证码
      // var result = await user.codeData(optionsA);
      // console.log(result)
      // if(result.length > 0){

          await user.register(options);
          let url = ctx.request.body.url || '';
          await user.loginHistory({ member_id: uuid,url: url });//记录登录次数
          ctx.session.member = {
            member_id: uuid,
            nickname: nickname,
            tel: tel,
            role: 'MEMBER'
          };
          return ctx.body = {
            code: RETCODE.OK,
            data: {
              member_id: uuid,
              avatar: null,
              nickname: nickname
            },
            message: '欢迎加入挚享会，您有一份礼品还未领取，请去个人中心填写联系信息'
          };
        }

    //   }else{
    //     return ctx.body = {
    //         code: RETCODE.PARAM_ERROR,
    //         message: '验证码有误'
    //     };
    // }

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
        message: '该用户已经注册,请直接登录'
      };
    } else if (e instanceof KnownErrors.ErrorNoPermission) {
      return ctx.body = {
        code: RETCODE.NO_PERMISSION,
        message: '你没有权限进行注册'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '注册失败，请重试'
    };
  }
};


// 管理员登录
let managerSignin = async function (ctx) {
  try {
    let account = ctx.request.body.account || '';
    let password = ctx.request.body.password || '';
    let options = {
      account: account,
      password: password
    };
    schema.validate(options, schema.managerSignin);
    let manager = await user.managerLogin(options);
    let token = 'kang-porsche-backend-' + generateToken();
    let tokenValue = JSON.stringify({
      manager_id: manager.id,
      account: account,
      role: 'MANAGER'
    });
    await utils.redisClient.set(token, tokenValue, 'EX', expireTime);
    return ctx.body = {
      code: RETCODE.OK,
      data: {
        token: token,
        account: account
      },
      message: '登录成功'
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
        message: '该账户不存在'
      };
    } else if (e instanceof KnownErrors.ErrorInvalidPwd) {
      return ctx.body = {
        code: RETCODE.INVALID_PWD,
        message: '密码错误'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '登录失败，请重试'
    };
  }
};


let memberToken = async function (ctx, next) {
  if (ctx.session && ctx.session.member) {
    return ctx.body = {
      code: RETCODE.OK,
      message: 'session有效'
    };
  } else {
    return ctx.body = {
      code: RETCODE.NEED_LOGIN,
      message: 'session失效，请重新登录'
    };
  }
};
//会员检查
let memberCheck = async function (ctx, next) {
  if (ctx.session && ctx.session.member) {
    await next();
  } else {
    return ctx.body = {
      code: RETCODE.NEED_LOGIN,
      message: 'session失效，请重新登录'
    };
  }
};

let managerToken = async function (ctx, next) {
  let token = ctx.req.headers.accesstoken || '';
  let tokenValue = await utils.redisClient.get(token);
  if (tokenValue) {
    return ctx.body = {
      code: RETCODE.OK,
      message: 'token检查成功'
    };
  } else {
    return ctx.body = {
      code: RETCODE.NEED_LOGIN,
      message: 'token失效，请重新登录'
    };
  }
};

let managerCheck = async function (ctx, next) {
  let token = ctx.req.headers.accesstoken || '';
  let tokenValue = await utils.redisClient.get(token);
  if (tokenValue) {
    await next();
  } else {
    return ctx.body = {
      code: RETCODE.NEED_LOGIN,
      message: 'token失效，请重新登录'
    };
  }
};

let messageTip = async function (ctx) {
  try {
    let member_id = ctx.session.member.member_id || '';
    let options = {
      member_id: member_id
    };
    console.time('times');
    let result = await user.messageTip(options);
    console.timeEnd('times');
    if (result.length > 0) {
      return ctx.body = {
        code: RETCODE.GET_PRESENT,
        message: '你的礼物已领取'
      };
    } else {
      return ctx.body = {
        code: RETCODE.NOT_GET_PRESENT,
        message: '欢迎加入挚享会，您有一份礼品还未领取，请去个人中心填写联系信息'
      };
    }
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '消息出错'
    };

  }
};
var request = require('request');
//news code
let duanxin = async function (ctx) {
    try {
        let phone_tel = Number(ctx.request.body.phone_tel) || '';
        // var code = Math.floor((Math.random()*999999)+100000);
        var code = "";
        for(var i=0;i<6;i++){
            code += Math.floor(Math.random()*10);
        }
        var options = {
            phone_tel: phone_tel,
            code: code
        };
        // console.log(code);return;
        schema.validate(options, schema.duanxinMember);
        var url = "http://59.151.46.205:8888/sms.aspx";
        request.post({
                url: url,
                form: {
                    action: 'send',
                    userid: 339,
                    account: 'porsche89113',
                    password: 'porsche0710',
                    mobile: phone_tel,
                    content: '验证码是：' + code + ",在2分钟内有效。如非本人操作请忽略本短信。",
                    sendTime: '',
                    extno: ''
                }},
            function(error, response, body){
                if (!error && response.statusCode == 200) {
                    console.log('ok')
                }else{
                    res.end(JSON.stringify({
                        msg: '获取短信模板失败',
                        status: 102
                    }));
                }
            }
        )
        await user.duanxinMember(options);
        return ctx.body = {
            code: RETCODE.OK,
            message: 'code添加成功'
        };
    } catch (e) {
        console.log(e);
        if (e.name === 'ValidationError') {
            return ctx.body = {
                code: RETCODE.PARAM_ERROR,
                message: '参数错误'
            };
        }
    }
}


let signOut = async function (ctx) {
    ctx.session = '';
    ctx.session.member = '';
    return ctx.body = {
      code: RETCODE.OK,
      message: '退出成功'
    };
};

router
.post('/member/duanxincode', duanxin) // duanxin
  .post('/member/loginpicture', getPictures) // 登录页图片
  .post('/member/interest', getPictures) // 兴趣页图片
  .post('/member/present', getPictures) // 礼物图片
    .post('/member/tupian', getPictures) // 礼物图片
  .post('/member/interest/add', interestAdd) //兴趣爱好添加 兼容老系统
  .post('/member/signin', memberSignin) // 会员登录
  .post('/member/register', memberRegister) // 会员注册
  .post('/manager/signin', managerSignin) // 管理员登录
  .post('/manager/token', managerToken)           // token检查
  .post('/member/token', memberToken)  //
  .all('/member/*', memberCheck) // 会员检查
  .all('/manager/*', managerCheck) // 管理员检查
  .post('/member/home', getPictures) // 首页图片
  .post('/member/message/tip', messageTip)  //检查礼物是否被领取
  .post('/member/signOut',signOut);


module.exports = router;
