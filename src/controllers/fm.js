const router = require('koa-router')();
const uuidv4 = require('uuid/v4');
const fm = require('../models/fm');
const RETCODE = require('../models/retcode');
const schema = require('../models/schema');
const KnownErrors = require('../models/error');
const utils = require('../models/utils');

let fmList = async function (ctx) {
  try {
    let startDate = ctx.request.body.startDate || '';
    let endDate = ctx.request.body.endDate || '';
    let options = {
      startDate: startDate,
      endDate: endDate
    };
    let result = await fm.getFMList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '获取挚享FM列表成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回挚享FM详情失败，请重试'
    };
  }
};

let fmMonth = async function (ctx) {
  try {
    let date = new Date();
    let nowMonth = date.getFullYear() + '-' + (date.getMonth() + 1);
    let monthArray = utils.getDateArray('2016-6', nowMonth);
    // console.log(monthArray);
    return ctx.body = {
      code: RETCODE.OK,
      data: monthArray,
      message: '返回月份成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回月份失败，请重试'
    };
  }
};



let fmDetailOne = async function (ctx) {
  try {
    var article_id = ctx.request.body.article_id || ''; //文章uuid
    let member_id = ctx.session.member.member_id || '';
    var pla_id = ctx.request.body.pla_id || '';
    // console.log(pla_id);
    let options = {
      article_id: article_id,
      member_id: member_id
    };
    schema.validate(options, schema.fmDetail);
    var result = await fm.getFmDataOne(options);
    // console.log(result);
    if(result.article.all_site_limit == ''|| result.article.all_site_limit == 'null'){
        var placeArr = [];
    }else{
      let all_site_limit = JSON.parse(result.article.all_site_limit);
      var placeArr = [];
      for(let value of Object.values(all_site_limit)){
          var start = dateTimeR(value.place_start_time);
          var end = dateTimeR(value.place_end_time);
          // console.log(start);
          // console.log(end);
          if(value.id == pla_id){
            // console.log(11111)
              var allDate = getMonthBetween(start,end);
              var manAll = [];
              for(var i = 0; i < allDate.length; i++){
                // 每天的人数
                var dayMan = await fm.getBaomNum(allDate[i],article_id);
                if(parseInt(dayMan.article.num) >= parseInt(value.place_number)){
                    var obj = {};
                    obj.id = parseInt([i])+1;
                    obj.place_date = allDate[i];
                    obj.disabled = true;
                    placeArr.push(obj);
                }else{
                    var obj = {};
                    obj.id = parseInt([i])+1;
                    obj.place_date = allDate[i];
                    obj.disabled = false;
                    placeArr.push(obj);
                }
                // console.log(dayMan.article.num);
              }
          }
      }
    }
    return ctx.body = {
      code: RETCODE.OK,
      allDate: placeArr,
      message: '获取挚享FM列表成功'
    };
  } catch (e) {
    console.log(e);
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '返回挚享FM详情失败，请重试'
    };
  }
};

function dateTimeR(times){
    var date = new Date(times);
    // 年
    var Y = date.getFullYear();
    // 月
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
    // 日
    var D = date.getDate();
    return Y+'-'+M+'-'+D;
} 
//------[获取两个日期中所有的月份中]
  function getMonthBetween(start,end){  
    var result = [];

        var beginDay = start.split("-");
        var endDay = end.split("-");
        var diffDay = new Date();
        var dateList = new Array;
        var i = 0;
        diffDay.setDate(beginDay[2]);
        diffDay.setMonth(beginDay[1]-1);
        diffDay.setFullYear(beginDay[0]);
        result.push(start);
        while(i == 0){
            var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
            diffDay.setTime(countDay);
            dateList[2] = diffDay.getDate();
            dateList[1] = diffDay.getMonth() + 1;
            dateList[0] = diffDay.getFullYear();
            if(String(dateList[1]).length == 1){dateList[1] = "0"+dateList[1]};
            if(String(dateList[2]).length == 1){dateList[2] = "0"+dateList[2]};
            result.push(dateList[0]+"-"+dateList[1]+"-"+dateList[2]);
            if(dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]){ i = 1;
            }
        };
        return result;

}
//------[获取两个日期中所有的月份中END]

let fmDetail = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || ''; //文章uuid
    let member_id = ctx.session.member.member_id || '';
    let options = {
      article_id: article_id,
      member_id: member_id
    };
    schema.validate(options, schema.fmDetail);
    var result = await fm.getFMDetail(options);
    if(result.article.second_type=='OFFLINESELF'||result.article.second_type=='OFFLINENONEED'||result.article.second_type=='OFFLINENEED'){
        result.article.active = "线下活动";
    }else if(result.article.second_type=='ONLINE'){
        result.article.active = "线上活动";
    }else{
        result.article.active = "";
    }
    // console.log(result.article.all_site_limit)
    // console.log(JSON.parse(result.article.all_site_limit))
    // let placeArr = JSON.parse(result.article.all_site_limit).map(function(modle){
    //       return modle.place_address;
    //   });
    if(result.article.all_site_limit == '' || result.article.all_site_limit == 'null'){
        var placeArr = [];
    }else{
      var all_site_limit = JSON.parse(result.article.all_site_limit);
      var placeArr = [];
      for(let value of Object.values(all_site_limit)){
        var obj = {};
        obj.id = value.id;
        obj.place_address = value.place_address;
        placeArr.push(obj);

      }
    }
    // console.log(placeArr)


    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      placeArr: placeArr,
      message: '返回挚享FM详情成功'
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
      message: '返回挚享FM详情失败，请重试'
    };
  }
};

let fmArticleUpvote = async function (ctx) {
  try {
    // console.log(1111, ctx.request.body);
    let article_id = ctx.request.body.article_id || '';
    let member_id = ctx.session.member.member_id || '';
    let visit_url = ctx.request.body.visit_url || '';
    let options = {
      article_id: article_id,
      member_id: member_id,
      visit_url: visit_url
    };
    schema.validate(options, schema.fmArticleUpvote);
    let result = await fm.fmArticleUpvote(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '感兴趣添加/取消成功'
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
      message: '感兴趣添加/取消失败，请重试'
    };
  }
};

let fmCommentList = async function (ctx) {
  try {
    let offset = ctx.request.body.offset || 0;
    let count = ctx.request.body.count || 10;
    let article_id = ctx.request.body.article_id || '';//文章uuid
    let member_id = ctx.session.member.member_id || '';
    let options = {
      article_id: article_id,
      member_id: member_id,
      offset: offset,
      count: count
    };
    schema.validate(options, schema.fmCommentList);
    let result = await fm.fmCommentList(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '返回挚享FM评论列表成功'
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
      message: '返回挚享FM评论列表失败，请重试'
    };
  }
};

// 评论添加
let fmCommentAdd = async function (ctx) {
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
      schema.validate(options, schema.fmCommentAdd);
      const pinglunData = await fm.memberFmCommentOnly(options);
      // console.log(pinglunData.length)
      if(pinglunData.length>0){
          return ctx.body = {
              code: RETCODE.PARAM_ERROR,
              message: '评论不可重复'
          };
      }

    schema.validate(options, schema.fmCommentAdd);
    await fm.fmCommentAdd(options);
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


let fmCommentUpvote = async function (ctx) {
  try {
    let member_id = ctx.session.member.member_id || '';
    let comment_id = ctx.request.body.comment_id || '';
    let options = {
      member_id: member_id,
      comment_id: comment_id
    };
    schema.validate(options, schema.fmCommentUpvote);
    await fm.fmCommentUpvote(options);
    return ctx.body = {
      code: RETCODE.OK,
      message: '评论点赞成功'
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

let fmCommentReply = async function (ctx) {
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
    schema.validate(options, schema.fmCommentReply);

    const huifuData = await fm.fmCommentReplyOnly(options);
    if(huifuData.length>0){
        return ctx.body = {
            code: RETCODE.PARAM_ERROR,
            message: '评论不可重复'
        };
    }

    await fm.fmCommentReply(options);
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


let fmApply = async function (ctx) {
  try {
    let article_id = ctx.request.body.article_id || '',
      member_id = ctx.session.member.member_id || '';
    let options = {
      article_id: article_id,
      member_id: member_id
    };
    schema.validate(options, schema.fmApply);
    let result = await fm.apply(options);
    return ctx.body = {
      code: RETCODE.OK,
      data: result,
      message: '申请参与成功'
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
        message: '已经申请过了，请不要重复申请'
      };
    }
    return ctx.body = {
      code: RETCODE.ERROR,
      message: '申请参与失败，请重试'
    };
  }
};
let fmNoApply = async function (ctx) {
    try {
        let article_id = ctx.request.body.article_id || '',
            member_id = ctx.session.member.member_id || '';
        let options = {
            article_id: article_id,
            member_id: member_id
        };
        schema.validate(options, schema.fmApply);
        let result = await fm.noapply(options);
        return ctx.body = {
            code: RETCODE.OK,
            data: result,
            message: '取消申请参与成功'
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
};

// 报名信息添加
let registrationInfoAdd = async function (ctx) {
    try {

        // 活动名称
        var active_name  = ctx.request.body.active_name || '';
        // 姓
        let surname  = ctx.request.body.surname || '';
        // 名
        let name = ctx.request.body.name || '';
        // 地点
        let place  = ctx.request.body.place || '';
        // 场次日期
        let created_time  = ctx.request.body.sessionDate || '';
        // 微信号
        let wechat_number  = ctx.request.body.wechat_number || '';
        // 手机号
        var tel_phone  = ctx.request.body.tel_phone || '';
        // 邮箱
        let email  = ctx.request.body.email || '';
        // 验证码
        let code  = ctx.request.body.code || '';
        // 协同人姓名
        let synergetic_surname  = ctx.request.body.synergetic_surname || '';
        // 协同手机号
        let sunergetic_tel  = ctx.request.body.sunergetic_tel || '';
        // 意向车型
        let interestedModels  = ctx.request.body.interestedModels || '';
        // 省份
        let province  = ctx.request.body.province || '';
        // 城市
        let city  = ctx.request.body.city || '';
        // 地址
        let detailed_address  = ctx.request.body.detailed_address || '';

        let uuid = uuidv4();
        let article_id = ctx.request.body.article_id || '';
        let member_id = ctx.session.member.member_id || '';


        let options = {
            uuid: uuid,
            article_id: article_id,
            member_id: member_id,
            surname: surname,
            name: name,

            place: place,
            created_time: created_time,
            wechat_number: wechat_number,
            tel_phone: tel_phone,
            email: email,
            synergetic_surname: synergetic_surname,
            sunergetic_tel: sunergetic_tel,
            interestedModels: interestedModels,
            province: province,
            city: city,
            detailed_address: detailed_address
        };

         // var url = "http://59.151.46.205:8888/sms.aspx";
         //    request.post({
         //            url: url,
         //            form: {
         //                action: 'send',
         //                userid: 339,
         //                account: 'porsche89113',
         //                password: 'porsche0710',
         //                mobile: tel_phone,
         //                content: '恭喜您成功预约动。您可出示该短信作为入场凭证。为了您更好的参观体验，建议您根据预约时间到达现场。感谢您对挚享汇的关注和支持。',
         //                sendTime: '',
         //                extno: ''
         //            }},
         //        function(error, response, body){
         //            if (!error && response.statusCode == 200) {
         //                console.log('ok')
         //            }else{
         //                res.end(JSON.stringify({
         //                    msg: '获取短信模板失败',
         //                    status: 102
         //                }));
         //            }
         //        }
         //    )

            // console.log(options);return;


        
        //news
        let optionsA = {
            phone_tel: tel_phone,
            code: code
        };
        // news 验证码是否过期
        schema.validate(optionsA, schema.duanxinMember);
        let codeStatus = await fm.codeOverdue(optionsA);
        // console.log(codeStatus);return;
        if(codeStatus == 2){
            return ctx.body = {
                code: RETCODE.PARAM_ERROR,
                message: '验证码已过期'
            };
        }
        //news 验证手机验证码
        let result = await fm.codeData(optionsA);
        if(result.length > 0){
            schema.validate(options, schema.fregistrationAdd);
            await fm.fregistrationAdd(options);

            return ctx.body = {
                code: RETCODE.OK,
                created_time: created_time,
                message: '报名信息添加成功'
            };

        }else{
            return ctx.body = {
                code: RETCODE.PARAM_ERROR,
                message: '验证码有误'
            };
        }
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
            message: '报名信息添加失败，请重试'
        };
    }
};

var request = require('request');
let duanxinjiekou = async function (ctx) {
    try {
       let tel_phone = ctx.request.body.tel_phone || '';
        let active_name = ctx.request.body.active_name || '';
        let date_time = ctx.request.body.date_time || '';
        
        if(date_time){
            var date_times = '您的预约时间为'+date_time+'。';
        }
        // console.log(tel_phone)
        // console.log(active_name)
        var url = "http://59.151.46.205:8888/sms.aspx";
        request.post({
                url: url,
                form: {
                    action: 'send',
                    userid: 339,
                    account: 'porsche89113',
                    password: 'porsche0710',
                    mobile: tel_phone,
                    content: '【挚享汇】恭喜您成功预约'+active_name+'活动。'+date_times+'您可出示该短信作为入场凭证。为了您更好的参观体验，建议您根据预约时间到达现场。感谢您对挚享汇的关注和支持。',
                    sendTime: '',
                    extno: ''
                }},
            function(error, response, body){
                if (!error && response.statusCode == 200) {
                    console.log('ok')
                    console.log(tel_phone)
                    console.log(active_name)
                }else{
                    res.end(JSON.stringify({
                        msg: '获取短信模板失败',
                        status: 102
                    }));
                }
            }
        )
        return ctx.body = {
            code: RETCODE.OK,
            message: '发送成功'
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

};
//news 基本的报名信息
let registrationData = async function (ctx) {
    try {
        let member_id = ctx.session.member.member_id || '';
        // console.log(member_id);return;
        let options = {
            member_id: member_id
        };
        schema.validate(options, schema.registrationMember);
        let result = await fm.registrationMemberData(options);
        return ctx.body = {
            code: RETCODE.OK,
            data: result,
            message: '报名基本信息返回成功'
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
};


//news code
let duanxin = async function (ctx) {
    try {
        let phone_tel = Number(ctx.request.body.phone_tel) || '';
        let created_time  = ctx.request.body.sessionDate || '';
        let place  = ctx.request.body.place || '';
        // var code = Math.floor((Math.random()*999999)+100000);
        var code = "";
        for(var i=0;i<6;i++){
            code += Math.floor(Math.random()*10);
        }
        var options = {
            phone_tel: phone_tel,
            code: code
        };
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
                    content: '【挚享汇】验证码是：' + code + ",在2分钟内有效。如非本人操作请忽略本短信。",
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
        await fm.duanxinMember(options);
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



router
  .post('/member/fm/list', fmList) // fm列表
  .post('/member/fm/month', fmMonth) // 返回一段时间里的所有月份
  .post('/member/fm/detail', fmDetail) //  fm详情
  .post('/member/fm/article/upvote', fmArticleUpvote) //对活动很感兴趣
  .post('/member/fm/comment/list', fmCommentList) //fm评论列表
  .post('/member/fm/comment/add', fmCommentAdd) // fm评论添加
  .post('/member/fm/comment/upvote', fmCommentUpvote) // 光影放映厅对评论进行点赞
  .post('/member/fm/comment/reply', fmCommentReply) // 回复评论
  .post('/member/fm/apply', fmApply) // 申请参与
  // new
  .post('/member/fm/fmDetailOne', fmDetailOne) // 地区时间状态
  //news
  .post('/member/fm/duanxinjiekou', duanxinjiekou) // duanxin
    .post('/member/fm/registration', registrationInfoAdd) // 报名信息
    .post('/member/fm/registrationdata', registrationData) // 基本的报名信息
    .post('/member/fm/duanxincode', duanxin) // duanxin
    
    
    .post('/member/fm/noapply', fmNoApply); // 取消申请参与


module.exports = router;
