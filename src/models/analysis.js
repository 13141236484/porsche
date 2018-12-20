const {
  pool,
  queryFormat,
  P
} = require('./utils');

// 获取所有用户信息，返回该时间点之后的所有信息
let getUsers = async function (options) {
  let wherestr = '';
  if (options.time) {
    wherestr += queryFormat(' and (updated_time > ? or created_time > ?)', [Number(options.time), Number(options.time)]);
  }
  let sql = queryFormat('select * from tb_member where status = ?' + wherestr, ['REGISTERED']);
  let result = await P(pool, 'query', sql);
  return result;
};

// 获取所有文章信息，返回该时间点之后的所有信息
let getArticles = async function (options) {
  let wherestr = '';
  if (options.time) {
    wherestr += queryFormat(' and created_time > ? ', [Number(options.time)]);
  }
  let sql = queryFormat('select * from tb_article where 1=1' + wherestr);
  let result = await P(pool, 'query', sql);
  return result;
};

//获取用户操作文章的所有记录
let getOperateRecord = async function (options) {
  let wherestr = '';
  if (options.userID) {
    wherestr += queryFormat(' and member_id =  ? ', [options.userID]);
  }
  if (options.action) {
    wherestr += queryFormat(' and action =  ? ', [options.action]);
  }
  if (options.time) {
    wherestr += queryFormat(' and created_time > ? ', [Number(options.time)]);
  }
  let sql = queryFormat('select * from tb_member_action where  1 = 1' + wherestr);
  let result = await P(pool, 'query', sql);
  return result;
};

// 获取用户评论文章的所有记录

let getCommentRecord = async function (options) {
  let wherestr = '';
  if (options.userID) {
    wherestr += queryFormat(' and user_id =  ? ', [options.userID]);
  }
  if (options.time) {
    wherestr += queryFormat(' and created_time > ? ', [Number(options.time)]);
  }
  let sql = queryFormat('select * from tb_article_comment where 1=1' + wherestr);
  let result = await P(pool, 'query', sql);
  return result;
};

// 获取站内信信息是否已读

let getMessage = async function (options) {
  let wherestr = '';
  if (options.time) {
    wherestr += queryFormat(' and created_time > ?', [Number(options.time)]);
  }
  let sql = queryFormat('select member_id,content,created_time,is_read from tb_notification where 1=1 ' + wherestr);
  let result = await P(pool, 'query', sql);
  return result;
};

module.exports = {
  getUsers: getUsers,
  getArticles: getArticles,
  getOperateRecord: getOperateRecord,
  getCommentRecord: getCommentRecord,
  getMessage: getMessage
};
