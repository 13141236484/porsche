const {
  pool,
  queryFormat,
  P
} = require('./utils');

// 获取光影放映厅列表  // 获取燃情赛道 //获取911模型街
let memberShowList = async function (options) {
  let sql = queryFormat('select t1.uuid,t1.title,t1.content,t1.stay_at_top,t1.picture_path,t2.nickname,t1.upvote_count,t1.created_time from (select uuid,user_id,title,content,picture_path,upvote_count,created_time,stay_at_top from tb_article  where first_type = ? and second_type = ? and user_type = ? and status = ?) t1 left join tb_member t2 on t1.user_id = t2.uuid order by t1.stay_at_top desc, t1.created_time desc limit ?,?', ['MEMBERSHOW', options.type, 'MEMBER', 'ENABLED', parseInt(options.offset), parseInt(options.count)]);
  let result = await P(pool, 'query', sql);
  return result;
};
// 获取光影放映厅列表  // 获取燃情赛道 //获取911模型街 //gy news
let memberShowLists = async function (options) {
    let sql = queryFormat('select t1.uuid from (select uuid,user_id,title,content,picture_path,upvote_count,created_time from tb_article  where first_type = ? and second_type = ? and user_type = ? and status = ? order by stay_at_top desc, created_time desc) t1 left join tb_member t2 on t1.user_id = t2.uuid order by t1.created_time desc', ['MEMBERSHOW', options.type, 'MEMBER', 'ENABLED']);
    let result = await P(pool, 'query', sql);
    return result;
};
// 获取光影放映厅个人详情
let memberShowDetail = async function (options) {
  let sql = queryFormat('select t1.title,t1.content,t1.picture_path,t1.body_text,t2.nickname,t2.avatar,t1.upvote_count from (select uuid,user_id,title,content,picture_path,upvote_count,body_text from tb_article  where uuid = ?) t1 left join tb_member t2 on t1.user_id = t2.uuid', [options.article_id]);
  let result = await P(pool, 'query', sql);
  let upvote_status = 'N';
  let upvote_sql = queryFormat('select * from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'UPVOTE']);
  let upvote_result = await P(pool, 'query', upvote_sql);
  if (upvote_result.length > 0) upvote_status = 'Y';

  // 修改浏览数量
  let visit_sql = queryFormat('update tb_article set visit_count = visit_count + 1 where uuid = ?', [options.article_id]);
  await P(pool, 'query', visit_sql);

  return {
    article: result[0],
    upvote_status: upvote_status
  };
};
// 光影放映厅 点赞接口
let memberShowUpvote = async function (options) {
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
// 光影放映厅 评论列表
let memberShowComment = async function (options) {
  let commentList = [];
  let sql = queryFormat('select t2.avatar,t2.nickname,t1.uuid,t1.created_time,t1.user_id,t1.content,t1.picture_path,t1.upvote_count,t1.user_type from (select uuid, created_time,user_id,content,picture_path,upvote_count,user_type,stay_at_top from tb_article_comment  where article_id = ? and user_type = ? and comment_level = ? order by created_time desc) t1 left join tb_member t2 on t1.user_id = t2.uuid order by t1.stay_at_top desc,t1.created_time desc limit ?,?', [options.article_id, 'MEMBER', 'FIRST', parseInt(options.offset), parseInt(options.count)]);
  let result = await P(pool, 'query', sql);
  for (let i = 0; i < result.length; i++) {
    let comment = result[i];
    let sql_member_comment = queryFormat('select t2.avatar,t2.nickname,t1.uuid,t1.created_time,t1.user_id,t1.content,t1.picture_path,t1.user_type from (select uuid,created_time,user_id,content,picture_path,user_type from tb_article_comment where article_id = ? and to_comment_id = ? and user_type = ? and comment_level = ?) t1 left join tb_member t2 on t1.user_id = t2.uuid ', [options.article_id, comment.uuid, 'MEMBER', 'SECOND']);
    let sql_member_comment_result = await P(pool, 'query', sql_member_comment);

    let sql_manager_comment = queryFormat('select t2.role,t1.uuid,t1.created_time,t1.user_id,t1.content,t1.picture_path,t1.user_type from (select uuid,created_time,user_id,content,picture_path,user_type from tb_article_comment where article_id = ? and to_comment_id = ? and user_type = ? and comment_level = ?) t1 left join tb_admin t2 on t1.user_id = t2.id', [options.article_id, comment.uuid, 'MANAGER', 'SECOND']);
    let sql_manager_comment_result = await P(pool, 'query', sql_manager_comment);

    let sql_comment_result = sql_manager_comment_result.concat(sql_member_comment_result);

    let sql_comment_status = queryFormat('select * from tb_comment_upvote where comment_id = ? and member_id = ?', [comment.uuid, options.member_id]);
    let sql_comment_status_result = await P(pool, 'query', sql_comment_status);
    if (sql_comment_status_result.length > 0) {
      comment.upvote_status = 'Y';
    } else {
      comment.upvote_status = 'N';
    }
    comment.commentList = sql_comment_result;
    commentList.push(comment);
  }
  let query = queryFormat('select count(1) as count from tb_article_comment  where article_id = ? and user_type = ? and comment_level = ?', [options.article_id, 'MEMBER', 'FIRST']);
  let queryResult = await P(pool, 'query', query);
  return {
    rows: commentList,
    count: queryResult[0].count
  };
};

// 添加评论接口
let memberShowCommentAdd = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_article_comment set uuid = ?, article_id = ?,user_id = ?,content = ?,created_time = ?,picture_path = ?,type = ?,user_type = ?,comment_level = ?,upvote_count = ?', [options.uuid, options.article_id, options.member_id, options.content, time, options.picture_path, options.type, 'MEMBER', 'FIRST', 0]);
  await P(pool, 'query', sql);
};
// 评论weiyi接口
let memberShowCommentOnly = async function (options) {
    let sql = queryFormat('select * from tb_article_comment where article_id = ? AND user_id = ? AND content = ? AND type = ? AND user_type = ? AND comment_level = ?', [ options.article_id, options.member_id, options.content, options.type, 'MEMBER', 'FIRST']);
    let result = await P(pool, 'query', sql);
    return result;
};

// 推荐亲友成为车主页面记数
let memberDreamCountAdd = async function () {
    let numsql = queryFormat('update tb_recommend_num set count_num = count_num+1 where id=1');
    let result = await P(pool, 'query', numsql);
    return result;
};


//添加评论的评论接口
let replyComment = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_article_comment set uuid = ?, article_id = ?,user_id = ?,content = ?,to_comment_id = ?,created_time = ?,picture_path = ?,type = ?,user_type =?,comment_level = ?', [options.uuid, options.article_id, options.member_id, options.content, options.to_comment_id, time, options.picture_path, options.type, 'MEMBER', 'SECOND']);
  await P(pool, 'query', sql);
};

// 验证回复唯一接口
let replyCommentOnly = async function (options) {
    let sql = queryFormat('select * from tb_article_comment where article_id = ? AND user_id = ? AND content = ? AND to_comment_id = ? AND type = ? AND user_type = ? AND comment_level = ?', [options.article_id, options.member_id, options.content, options.to_comment_id, options.type, 'MEMBER', 'SECOND']);
    let result = await P(pool, 'query', sql);
    return result;
};

// 评论点赞
let commentUpvote = async function (options) {
  let upvote_sql = queryFormat('select * from tb_comment_upvote where comment_id = ? and member_id = ?', [options.comment_id, options.member_id]);
  let result = await P(pool, 'query', upvote_sql);
  if (result.length === 0) {
    let time = new Date().getTime();
    let sql = queryFormat('insert into tb_comment_upvote set comment_id = ?,member_id = ?,created_time = ?', [options.comment_id, options.member_id, time]);
    await P(pool, 'query', sql);
    let upvote_count_sql = queryFormat('update tb_article_comment set upvote_count = upvote_count +1 where uuid = ?', [options.comment_id]);
    await P(pool, 'query', upvote_count_sql);

    let upvote_count_sql_str = queryFormat('select upvote_count from tb_article_comment  where uuid = ? ', [options.comment_id]);
    let upvote_count_result = await P(pool, 'query', upvote_count_sql_str);
    return {
      upvote_count: upvote_count_result[0].upvote_count,
      upvote_status: 'Y'
    };
  } else {
    let sql = queryFormat('delete from tb_comment_upvote where comment_id = ? and member_id = ?', [options.comment_id, options.member_id]);
    await P(pool, 'query', sql);
    let upvote_count_sql = queryFormat('update tb_article_comment set upvote_count = upvote_count -1 where uuid = ?', [options.comment_id]);
    await P(pool, 'query', upvote_count_sql);

    let upvote_count_sql_str = queryFormat('select upvote_count from tb_article_comment  where uuid = ? ', [options.comment_id]);
    let upvote_count_result = await P(pool, 'query', upvote_count_sql_str);
    return {
      upvote_count: upvote_count_result[0].upvote_count,
      upvote_status: 'N'
    };
  }

};

// 我要分享  news ziduan

let memberShowAdd = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_article set uuid =?,user_id =?, title = ?,content = ?,picture_path = ?,created_time = ?,status = ?,first_type = ?,second_type = ?,user_type = ?,visit_count = ?,upvote_count = ?,body_text = ?', [options.uuid, options.member_id, options.title, options.content, options.picture_path, time, 'REVIEW', 'MEMBERSHOW', options.type, 'MEMBER', 0, 0, options.body_text]);
  await P(pool, 'query', sql);
  let query = queryFormat('insert into tb_member_action set article_id = ?,member_id= ?,action = ?,created_time = ?,review_status = ?,exsit_status = ?', [options.uuid, options.member_id, 'POST', time, 'N', 'SEND']);
  await P(pool, 'query', query);
};

let visitRecordAdd = async function (options) {
  let time = new Date().getTime();
  let query = queryFormat('insert into tb_member_action set article_id = ?,member_id = ?,action = ?,created_time = ?,visit_url = ?', [options.article_id, options.member_id, 'VISIT', time, options.visit_url]);
  await P(pool, 'query', query);
};


module.exports = {
  memberShowList: memberShowList,
        memberShowLists: memberShowLists,
        memberShowCommentOnly: memberShowCommentOnly,
        memberDreamCountAdd: memberDreamCountAdd,
  memberShowDetail: memberShowDetail,
  memberShowUpvote: memberShowUpvote,
  memberShowComment: memberShowComment,
  memberShowCommentAdd: memberShowCommentAdd,
  replyComment: replyComment,
  commentUpvote: commentUpvote,
  memberShowAdd: memberShowAdd,
  visitRecordAdd: visitRecordAdd,
  replyCommentOnly: replyCommentOnly
};
