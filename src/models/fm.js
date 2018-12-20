const {
  pool,
  queryFormat,
  P
} = require('./utils');
const KnownErrors = require('./error');

// 返回挚享fm列表
let getFMList = async function (options) {
  let wherestr = '';
  if (options.startDate && options.startDate) {
    wherestr += queryFormat(' and ((start_time > ? and start_time  < ?) or (end_time > ? and end_time < ?))', [options.startDate, options.endDate, options.startDate, options.endDate]);
  }
  // let sql = queryFormat('select uuid, start_time,end_time,title,second_type,address,city,visit_count,join_count,picture_path,created_time,stay_at_top from  tb_article  where first_type = ? and user_type = ?' + wherestr + ' order by stay_at_top desc,start_time desc,created_time desc', ['FM', 'MANAGER']);
  let sql = queryFormat('select uuid, start_time,end_time,title,second_type,address,city,visit_count,join_count,picture_path,created_time,stay_at_top from  tb_article  where is_show = 1 and first_type = ? and user_type = ?' + wherestr + ' order by stay_at_top desc,start_time desc,created_time desc', ['FM', 'MANAGER']);
  let result = await P(pool, 'query', sql);
  return result;
};


//获取单条活动详情
let getFmDataOne = async function (options) {
  let sql = queryFormat('select all_site_limit,uuid,maximum from tb_article where uuid=?', [options.article_id]);
  let result = await P(pool, 'query', sql);
  return {
    article: result[0],
  };
}
//获取某个时间的所有条数
let getBaomNum = async function (date_time,article_id) {
  let sql = queryFormat("select count(*) as num from tb_registration_infomation where ( datediff ( FROM_UNIXTIME(created_time/1000,'%Y-%m-%d') , ? ) = 0 ) and article_id=?", [date_time,article_id]);
  let result = await P(pool, 'query', sql);
  return {
    article: result[0],
  };
}


// 获取资讯详情  //获取活动详情
let getFMDetail = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('select t1.id,t1.title,t1.content,t1.picture_path,t2.nickname,t1.upvote_count,t1.visit_count,t1.popup_status,t1.start_time,t1.end_time,t1.address,t1.city,t1.join_count,t1.second_type,t1.maximum,t1.small_title,t1.start_registration_time,t1.end_registration_time,t1.notes,t1.set_join_count,t1.set_maximum,'+
    't1.is_start_signup,t1.sign_tips,t1.allurban_data,t1.place,t1.field_date,t1.wechat_number,t1.email,t1.mailing_address,t1.personnel_surname,t1.intentional_vehicle,t1.all_site_limit from (select id,uuid,user_id,title,content,picture_path,upvote_count,start_time,end_time,address,city,notes,join_count,second_type,maximum,small_title,start_registration_time,end_registration_time,visit_count,popup_status,set_join_count,set_maximum'+
    ',is_start_signup,sign_tips,allurban_data,place,field_date,wechat_number,email,mailing_address,personnel_surname,intentional_vehicle,all_site_limit'+' from tb_article  where uuid = ?) t1 left join tb_member t2 on t1.user_id = t2.uuid', [options.article_id]);
  let result = await P(pool, 'query', sql);
  let upvote_status = 'N';
  let upvote_sql = queryFormat('select * from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'UPVOTE']);
  let upvote_result = await P(pool, 'query', upvote_sql);
  if (upvote_result.length > 0) upvote_status = 'Y';

  //news 报名未开始
  if(Number(time) < result[0].start_registration_time){
      var registration = '报名未开始';
  }
  //news
  let join_sql = queryFormat('select * from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'JOIN']);
  let join_result = await P(pool, 'query', join_sql);
  if (join_result.length > 0){
      if(Number(time) >= result[0].start_registration_time && Number(time) <= result[0].end_registration_time){
          var registration = '取消报名';
      }
      //news 报名已结束
      if(Number(time) > result[0].end_registration_time){
          var registration = '报名已结束';
      }
  }else{
      //news 感兴趣
      if(result[0].join_count >= result[0].maximum){
          var registration = '感兴趣';
      }
      //news 申请报名
      if(result[0].join_count < result[0].maximum && Number(time) >= result[0].start_registration_time && Number(time) <= result[0].end_registration_time){
          var registration = '正在报名';
      }
  }
  //news 报名结束
  if(Number(time) > result[0].end_registration_time){
      var registration = '报名已结束';
  }
  //news 活动结束
  if(Number(time) > result[0].end_time){
      var registration = '活动已结束';
  }
    // //报名未开始或者报名已结束显示感兴趣
    // if(Number(time) > result[0].end_registration_time || Number(time) < result[0].end_registration_time){
    //     var registration = '感兴趣';
    // }
  // 精彩集锦
  let sqls = queryFormat('select uuid from tb_article  where second_type = ? and user_type = ? and first_type = ? and small_title = ?', ['SPLENDID', 'MANAGER', 'OFFLINE',result[0].small_title]);
  let jingcai = await P(pool, 'query', sqls);
  if (jingcai.length > 0 && Number(time) >= result[0].end_time){
      var registration = '精彩回顾';
  }


  // let join_status = 'N';
  // let join_sql = queryFormat('select * from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'JOIN']);
  // let join_result = await P(pool, 'query', join_sql);
  // if (join_result.length > 0) join_status = 'Y';

  // let activity_is_end = 'N';
  // if (Number(result[0].end_time) < Number(time)) activity_is_end = 'Y';

  // 修改浏览数量
  let visit_sql = queryFormat('update tb_article set visit_count = visit_count + 1 where uuid = ?', [options.article_id]);
  await P(pool, 'query', visit_sql);

  return {
    article: result[0],
    upvote_status: upvote_status,
    //news
    registration:registration,
      jingcai: jingcai[0],
    // join_status: join_status
    // activity_is_end: activity_is_end
  };
};

// 获取评论列表
let fmCommentList = async function (options) {
  let commentList = [];
  //取出针对当前文章的所有评论
  let sql = queryFormat('select' +
          ' t2.avatar,t2.nickname,t1.uuid,t1.created_time,t1.user_id,t1.content,t1.picture_path,t1.upvote_count from' +
          ' (select uuid, created_time,user_id,content,picture_path,upvote_count,stay_at_top from tb_article_comment  where' +
          ' article_id = ? and user_type = ? and comment_level = ? ) t1' +
          ' left' +
          ' join tb_member t2 on t1.user_id =' +
          ' t2.uuid order by t1.stay_at_top desc,t1.created_time desc' +
          ' limit ?,? ', [options.article_id, 'MEMBER', 'FIRST', parseInt(options.offset), parseInt(options.count)]);
  let result = await P(pool, 'query', sql);
  
  for (let i = 0; i < result.length; i++) {
    //当前评论
    let comment = result[i];
    //取出针对当前文章评论的所有评论
    let sql_member_comment = queryFormat('select' +
            ' t2.avatar,t2.nickname,t1.uuid,t1.created_time,t1.user_id,t1.content,t1.picture_path,t1.user_type from' +
            ' (select uuid,created_time,user_id,content,picture_path,user_type from tb_article_comment where article_id = ? and to_comment_id = ? and user_type = ? and comment_level = ? ) t1 left join tb_member t2 on t1.user_id = t2.uuid', [options.article_id, comment.uuid, 'MEMBER', 'SECOND']);
    let sql_member_comment_result = await P(pool, 'query', sql_member_comment);
    //取出管理员针对当前评论的所有评论
    let sql_manager_comment = queryFormat('select t2.role,t1.uuid,t2.account as' +
            ' nickname,t1.created_time,t1.user_id,t1.content,t1.picture_path,t1.user_type from (select' +
            ' uuid,created_time,user_id,content,picture_path,user_type from tb_article_comment where article_id = ? and to_comment_id = ? and user_type = ? and comment_level = ? ) t1 left join tb_admin t2 on t1.user_id = t2.id', [options.article_id, comment.uuid, 'MANAGER', 'SECOND']);
    let sql_manager_comment_result = await P(pool, 'query', sql_manager_comment);
    //会员与管理员评论合并
    let sql_comment_result = sql_manager_comment_result.concat(sql_member_comment_result);
    //针对当前评论的所有评论
    comment.commentList = sql_comment_result;
    //取出点赞总数
    let sql_comment_status = queryFormat('select * from tb_comment_upvote where comment_id = ? and member_id = ?', [comment.uuid, options.member_id]);
    let sql_comment_status_result = await P(pool, 'query', sql_comment_status);
    if (sql_comment_status_result.length > 0) {
      comment.upvote_status = 'Y';
    } else {
      comment.upvote_status = 'N';
    }

    commentList.push(comment);
  }
  let query = queryFormat('select count(1) as count from tb_article_comment  where article_id = ? and user_type = ? and comment_level = ?', [options.article_id, 'MEMBER', 'FIRST']);
  let queryResult = await P(pool, 'query', query);
  
  return {
    rows: commentList,
    count: queryResult[0].count
  };
};

// 对活动感兴趣
let fmArticleUpvote = async function (options) {
  let upvote_sql = queryFormat('select * from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'UPVOTE']);
  let upvote_result = await P(pool, 'query', upvote_sql);
  if (upvote_result.length === 0) {
    let time = new Date().getTime();
    let sql = queryFormat('insert into tb_member_action set article_id = ?,member_id = ?,action = ?,created_time = ?,visit_url = ?', [options.article_id, options.member_id, 'UPVOTE', time, options.visit_url]);
    await P(pool, 'query', sql);
    //更新文章中点赞数
    let article_sql = queryFormat('update tb_article set upvote_count = upvote_count +1 where uuid = ? ', [options.article_id]);
    await P(pool, 'query', article_sql);
    let upvote_count_sql = queryFormat('select upvote_count from tb_article  where uuid = ? ', [options.article_id]);
    let upvote_count_result = await P(pool, 'query', upvote_count_sql);
    return {
      upvote_count: upvote_count_result[0].upvote_count,
      upvote_status: 'Y'
    };
  } else {
    let sql = queryFormat('delete from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'UPVOTE']);
    await P(pool, 'query', sql);
    let article_sql = queryFormat('update tb_article set upvote_count = upvote_count-1 where uuid = ? ', [options.article_id]);
    await P(pool, 'query', article_sql);
    let upvote_count_sql = queryFormat('select upvote_count from tb_article  where uuid = ? ', [options.article_id]);
    let upvote_count_result = await P(pool, 'query', upvote_count_sql);
    return {
      upvote_count: upvote_count_result[0].upvote_count,
      upvote_status: 'N'
    };
  }

};

// 添加评论接口
let fmCommentAdd = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_article_comment set uuid = ?, article_id = ?,user_id = ?,content = ?,created_time = ?,picture_path = ?,type = ?,user_type = ?,comment_level = ?,upvote_count = ?', [options.uuid, options.article_id, options.member_id, options.content, time, options.picture_path, options.type, 'MEMBER', 'FIRST', 0]);
  await P(pool, 'query', sql);
};
// 评论weiyi接口
let memberFmCommentOnly = async function (options) {
    let sql = queryFormat('select * from tb_article_comment where article_id = ? AND user_id = ? AND content = ? AND type = ? AND user_type = ? AND comment_level = ?', [ options.article_id, options.member_id, options.content, options.type, 'MEMBER', 'FIRST']);
    let result = await P(pool, 'query', sql);
    return result;
};


//回复评论的评论接口

let fmCommentReply = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_article_comment set uuid = ?, article_id = ?,user_id = ?,content = ?,to_comment_id = ?,created_time = ?,picture_path = ?,type = ?,user_type =?,comment_level = ?', [options.uuid, options.article_id, options.member_id, options.content, options.to_comment_id, time, options.picture_path, options.type, 'MEMBER', 'SECOND']);
  await P(pool, 'query', sql);
};

// 回复评论唯一接口
let fmCommentReplyOnly = async function (options) {
  let sql = queryFormat('select * from tb_article_comment where article_id = ? AND user_id = ? AND content = ? AND to_comment_id = ? AND type = ? AND user_type = ? AND comment_level = ?', [options.article_id, options.member_id, options.content, options.to_comment_id, options.type, 'MEMBER', 'SECOND']);
    let result = await P(pool, 'query', sql);
    return result;
};

// 评论点赞
let fmCommentUpvote = async function (options) {
  let upvote_sql = queryFormat('select * from tb_comment_upvote where comment_id = ? and member_id = ?', [options.comment_id, options.member_id]);
  let result = await P(pool, 'query', upvote_sql);
  if (result.length === 0) {
    let time = new Date().getTime();
    let sql = queryFormat('insert into tb_comment_upvote set comment_id = ?,member_id = ?,created_time = ?', [options.comment_id, options.member_id, time]);
    await P(pool, 'query', sql);
    let upvote_count_sql = queryFormat('update tb_article_comment set upvote_count = upvote_count +1 where uuid = ?', [options.comment_id]);
    await P(pool, 'query', upvote_count_sql);
  } else {
    let sql = queryFormat('delete from tb_comment_upvote where comment_id = ? and member_id = ?', [options.comment_id, options.member_id]);
    await P(pool, 'query', sql);
    let upvote_count_sql = queryFormat('update tb_article_comment set upvote_count = upvote_count -1 where uuid = ?', [options.comment_id]);
    await P(pool, 'query', upvote_count_sql);
  }

};

// news 取消报名
let noapply = async function (options) {
  let query = queryFormat('select * from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'JOIN']);
  let result = await P(pool, 'query', query);
  if (result.length > 0) {
      // let time = new Date().getTime();
      let sql = queryFormat('delete from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'JOIN']);
      await P(pool, 'query', sql);
      let join_count_sql = queryFormat('select join_count from tb_article  where uuid = ? ', [options.article_id]);
      var count_result = await P(pool, 'query', join_count_sql);
      if(count_result[0].join_count>0){
          let join_count_sql = queryFormat('update tb_article set join_count = join_count -1 where uuid = ?', [options.article_id]);
          await P(pool, 'query', join_count_sql);
      }
      let article_join_count_sql = queryFormat('select join_count from tb_article  where uuid = ? ', [options.article_id]);
      var article_join_count_result = await P(pool, 'query', article_join_count_sql);
  }
  //news  baomingzhuangtai
    let sql = queryFormat('select id from tb_registration_infomation where member_id = ? order by created_time desc limit 1', [ options.member_id]);
    let results = await P(pool, 'query', sql);
    if(results.length > 0){
        let sql = queryFormat('update tb_registration_infomation set status = ? where member_id = ? and id = ?', ['N',options.member_id,results[0].id]);
        await P(pool, 'query', sql);
    }
  return {
    join_count: article_join_count_result[0].join_count
  };
};

//  申请参与
let apply = async function (options) {
    let query = queryFormat('select * from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'JOIN']);
    let result = await P(pool, 'query', query);
    if (result.length > 0) throw new KnownErrors.ErrorAlreadyExist();
    let time = new Date().getTime();
    let sql = queryFormat('insert into tb_member_action set article_id = ?,member_id = ?,action = ?,created_time =?', [options.article_id, options.member_id, 'JOIN', time]);
    await P(pool, 'query', sql);
    let join_count_sql = queryFormat('update tb_article set join_count = join_count +1 where uuid = ?', [options.article_id]);
    await P(pool, 'query', join_count_sql);

    let article_join_count_sql = queryFormat('select join_count from tb_article  where uuid = ? ', [options.article_id]);
    let article_join_count_result = await P(pool, 'query', article_join_count_sql);
    return {
        join_count: article_join_count_result[0].join_count
    };
};
//news 报名信息添加
let fregistrationAdd = async function (options) {
    let time = new Date().getTime();
    let sql = queryFormat('select id from tb_registration_infomation where member_id = ? order by created_time desc limit 1', [ options.member_id]);
    let result = await P(pool, 'query', sql);
    if(result.length > 0){
        let sql = queryFormat('update tb_registration_infomation set '+
          'surname = ?, name = ?,place = ?,created_time = ?,wechat_number = ?,tel_phone = ?,email = ?,'+
          'synergetic_surname = ?,sunergetic_tel = ?,interestedModels = ?,province = ?, city = ? ,detailed_address = ?, '+
          'uuid = ?, article_id = ?, member_id= ?'+
          ', status = ? where member_id = ? and id = ?', 
          [options.surname, options.name, options.place, options.created_time, options.wechat_number
          , options.tel_phone, options.email, options.synergetic_surname, options.sunergetic_tel,
           options.interestedModels, options.province, options.city, options.detailed_address, options.uuid, 
           options.article_id, options.member_id
          ,'Y',options.member_id,result[0].id]);
        await P(pool, 'query', sql);
    }else{
        let sql = queryFormat('insert into tb_registration_infomation set '+
          'surname = ?, name = ?,place = ?,created_time = ?,wechat_number = ?,tel_phone = ?,email = ?,'+
          'synergetic_surname = ?,sunergetic_tel = ?,interestedModels = ?,province = ?, city = ? ,detailed_address = ?, '+
          'uuid = ?, article_id = ?, member_id= ?, status = ?', [options.surname, options.name, options.place, options.created_time, options.wechat_number
          , options.tel_phone, options.email, options.synergetic_surname, options.sunergetic_tel,
           options.interestedModels, options.province, options.city, options.detailed_address, options.uuid, 
           options.article_id, options.member_id,'Y']);
        await P(pool, 'query', sql);
    }
};
//news 基本的报名信息
let registrationMemberData = async function (options) {
    let sql = queryFormat('select firstname,surname,tel,email from tb_member where uuid = ?', [ options.member_id]);
    let result = await P(pool, 'query', sql);
    return result[0];
};
//news 基本的报名信息
let duanxinMember = async function (options) {
    let time = new Date().getTime();
    let sql = queryFormat('insert into tb_tel_code set code = ?, tel = ?, status = ?, creade_time = ?', [options.code, options.phone_tel, 1, time]);
    await P(pool, 'query', sql);
}
//news 验证手机验证码
let codeData = async function (options) {
    let sql = queryFormat('select tel,code,status,id from tb_tel_code where tel = ? and code = ? and status = ? limit 1', [ options.phone_tel,options.code,1]);
    var result = await P(pool, 'query', sql);
    if(result.length > 0){
        let status_sql = queryFormat('update tb_tel_code set status = 2 where tel = ? and code = ? and status = ?', [options.phone_tel,options.code,1]);
        await P(pool, 'query', status_sql);
    }
    return result;
}
//news 验证码是否过期
let codeOverdue = async function (options) {
    //当前时间戳
    let time = new Date().getTime();
    let sql = queryFormat('select tel,code,status,creade_time from tb_tel_code where tel = ? and code = ? and status = ? order by creade_time desc limit 1', [ options.phone_tel,options.code,1]);
    var result = await P(pool, 'query', sql);
    if(result.length > 0){
        let start = result[0].creade_time;
        let end = new Date().getTime();
        let utc = Number(end)-Number(start);
        let minute_number = (utc/(60*1000)).toFixed(2);
        // console.log(minute_number);
        if(minute_number>2){
            return 2;
        }else{
            return 1;
        }
    }
}

module.exports = {
  getFMList: getFMList,
    memberFmCommentOnly:memberFmCommentOnly,
  getFMDetail: getFMDetail,
  fmCommentList: fmCommentList,
  fmArticleUpvote: fmArticleUpvote,
  fmCommentAdd: fmCommentAdd,
  fmCommentReply: fmCommentReply,
  fmCommentUpvote: fmCommentUpvote,
  apply: apply,
    //news
    noapply: noapply,
    fregistrationAdd: fregistrationAdd,
    registrationMemberData: registrationMemberData,
    duanxinMember: duanxinMember,
    codeData: codeData,
    codeOverdue: codeOverdue,
    fmCommentReplyOnly: fmCommentReplyOnly,
    getFmDataOne: getFmDataOne,
    getBaomNum: getBaomNum
};
