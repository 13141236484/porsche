const {
  pool,
  queryFormat,
  P
} = require('./utils');
const KnownErrors = require('./error');

// 返回极致驾客列表
let getDriveStarList = async function () {
  let sql = queryFormat('select t1.uuid,t1.picture_path,t1.title,t2.nickname,t2.created_time,t2.avatar from tb_article t1 left join tb_member t2 on t1.user_id = t2.uuid where t1.status = ? and first_type = ? and second_type = ? order by t2.created_time desc', ['ENABLED', 'DRIVER', 'DRIVER']);
  let result = await P(pool, 'query', sql);
  return result;
};

// 获取极致驾客详细信息
let getDriveStarDetail = async function (options) {
  let sql = queryFormat('select t1.uuid,t1.user_id,t1.picture_path,t1.title,t1.content,t2.nickname,t2.avatar from (select uuid,user_id,picture_path,title,content from tb_article where uuid = ?) t1 left join tb_member t2 on t1.user_id = t2.uuid', [options.article_id]);
  let result = await P(pool, 'query', sql);

  // 修改浏览数量
  let visit_sql = queryFormat('update tb_article set visit_count = visit_count + 1 where uuid = ?', [options.article_id]);
  await P(pool, 'query', visit_sql);

  return result[0];
};

// 极致驾客 评论列表
let driverComment = async function (options) {
  let commentList = [];
  let sql = queryFormat('select t2.avatar,t2.nickname,t1.uuid,t1.created_time,t1.user_id,t1.content,t1.picture_path,t1.upvote_count,t1.stay_at_top from (select uuid, created_time,user_id,content,picture_path,upvote_count,stay_at_top from tb_article_comment  where article_id = ? and user_type = ? and comment_level = ?) t1 left join tb_member t2 on t1.user_id = t2.uuid order by t1.stay_at_top desc,t1.created_time desc limit ?,?', [options.article_id, 'MEMBER', 'FIRST', parseInt(options.offset), parseInt(options.count)]);
  let result = await P(pool, 'query', sql);
  for (let i = 0; i < result.length; i++) {
    let comment = result[i];
    let sql_member_comment = queryFormat('select t2.avatar,t2.nickname,t1.uuid,t1.created_time,t1.user_id,t1.content,t1.picture_path,t1.user_type from (select uuid,created_time,user_id,content,picture_path,user_type from tb_article_comment where article_id = ? and to_comment_id = ? and user_type = ? and comment_level = ?) t1 left join tb_member t2 on t1.user_id = t2.uuid', [options.article_id, comment.uuid, 'MEMBER', 'SECOND']);
    let sql_member_comment_result = await P(pool, 'query', sql_member_comment);

    let sql_manager_comment = queryFormat('select t2.role,t1.uuid,t2.account as nickname,t1.created_time,t1.user_id,t1.content,t1.picture_path,t1.user_type from (select uuid,created_time,user_id,content,picture_path,user_type from tb_article_comment where article_id = ? and to_comment_id = ? and user_type = ? and comment_level = ?) t1 left join tb_admin t2 on t1.user_id = t2.id', [options.article_id, comment.uuid, 'MANAGER', 'SECOND']);
    let sql_manager_comment_result = await P(pool, 'query', sql_manager_comment);
    let sql_comment_result = sql_manager_comment_result.concat(sql_member_comment_result);
    comment.commentList = sql_comment_result;
    
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

// 添加评论接口

let driverCommentAdd = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_article_comment set uuid = ?, article_id = ?,user_id = ?,content = ?,created_time = ?,picture_path = ?,type = ?,user_type = ?,comment_level = ?,upvote_count = ?', [options.uuid, options.article_id, options.member_id, options.content, time, options.picture_path, options.type, 'MEMBER', 'FIRST', 0]);
  await P(pool, 'query', sql);
};
// 评论weiyi接口
let memberDriverCommentOnly = async function (options) {
    let sql = queryFormat('select * from tb_article_comment where article_id = ? AND user_id = ? AND content = ? AND type = ? AND user_type = ? AND comment_level = ?', [ options.article_id, options.member_id, options.content, options.type, 'MEMBER', 'FIRST']);
    let result = await P(pool, 'query', sql);
    return result;
};

//添加评论的评论接口

let driverReplyComment = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_article_comment set uuid = ?, article_id = ?,user_id = ?,content = ?,to_comment_id = ?,created_time = ?,picture_path = ?,type = ?,user_type =?,comment_level = ?', [options.uuid, options.article_id, options.member_id, options.content, options.to_comment_id, time, options.picture_path, options.type, 'MEMBER', 'SECOND']);
  await P(pool, 'query', sql);
};

// 评论点赞
let driverCommentUpvote = async function (options) {
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



//  申请加入
let apply = async function (options) {
  let sqlquery = queryFormat('select * from tb_article where user_id = ? and first_type = ? and second_type = ?', [options.member_id, 'DRIVER', 'DRIVER']);
  let sqlqueryresult = await P(pool, 'query', sqlquery);
  if (sqlqueryresult.length > 0) throw new KnownErrors.ErrorAlreadyExist();
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_article set uuid =?,user_id =?, title = ?,content = ?,picture_path = ?,created_time = ?,status = ?,first_type = ?,second_type = ?,user_type = ?,visit_count = ?,upvote_count = ?', [options.uuid, options.member_id, options.title, options.content, options.picture_path, time, 'REVIEW', 'DRIVER', 'DRIVER', 'MEMBER', 0, 0]);
  await P(pool, 'query', sql);
  let query = queryFormat('insert into tb_member_action set article_id = ?,member_id= ?,action = ?,created_time = ?,review_status = ?,exsit_status = ?', [options.uuid, options.member_id, 'POST', time, 'N', 'OTHER']);
  await P(pool, 'query', query);
};

module.exports = {
  getDriveStarList: getDriveStarList,
    memberDriverCommentOnly:memberDriverCommentOnly,
  getDriveStarDetail: getDriveStarDetail,
  driverComment: driverComment,
  driverCommentAdd: driverCommentAdd,
  driverReplyComment: driverReplyComment,
  driverCommentUpvote: driverCommentUpvote,
  apply: apply
};
