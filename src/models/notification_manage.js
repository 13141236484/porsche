const {
  pool,
  queryFormat,
  P
} = require('./utils');
const uuidv4 = require('uuid/v4');


// 推送消息
let notificationPush = async function (options) {
  let time = new Date().getTime();
  let query = queryFormat('select uuid from tb_member where status = ?', ['REGISTERED']);
  let result = await P(pool, 'query', query);
  for (let i = 0; i < result.length; i++) {
    let uuid = uuidv4();
    let sql = queryFormat('insert into tb_notification set uuid = ?,admin_id = ?,member_id = ?,content = ?,created_time = ?,is_read = ?', [uuid, options.manager_id, result[i].uuid, options.content, time, 'N']);
    await P(pool, 'query', sql);
  }
};

//反馈消息列表
let feedbackMsgList = async function (options) {
  let wherestr = '';
  if (options.start_time) {
    wherestr += queryFormat(' and created_time >= ?', [options.start_time]);
  }
  if (options.end_time) {
    wherestr += queryFormat(' and created_time <= ?', [options.end_time]);
  }
  let sql = queryFormat('select t1.member_id,t2.nickname,t1.content,t1.created_time from (select member_id,content,created_time from tb_advice where 1=1 '+ wherestr + ' limit ?,?) t1 left join tb_member t2 on t1.member_id = t2.uuid', [parseInt(options.offset), parseInt(options.count)]);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from tb_advice where 1=1 ' + wherestr);
  let result = await P(pool, 'query', query);
  return {
    rows: rows,
    count: result[0].count
  };
};

// 推送消息消息列表
let notificationList = async function (options) {
  let sql = queryFormat('select t2.role as author,t1.content,t1.is_read,t1.created_time from (select uuid,admin_id,content,is_read,created_time from tb_notification where member_id = ? limit ?,?) t1 left join tb_admin t2 on t1.admin_id = t2.id', [options.member_id, parseInt(options.offset), parseInt(options.count)]);
  let result = await P(pool, 'query', sql);
  return result;
};

//回复消息
let replyMsg = async function (options) {
  let time = new Date().getTime();
  let query = queryFormat('insert into tb_notification set uuid = ?,admin_id,member_id,content =?,created_time = ?,is_read = ? ',[options.uuid,options.mamager_id,options.member_id,options.content,time,'N']);
  await P(pool, 'query', query);
};
// 用户信息
let userDetail = async function (options) {
  let sql = queryFormat('select t1.avatar,t1.nickname,t1.username,t1.gender,t1.tel,t1.email,t1.detail_address,t2.name as car_name,t1.referral,t3.name as province,t4.name as city,t1.district,t1.created_time,t1.purchase_willing from (select uuid,avatar, nickname,username,gender,tel,email,province_id,city_id,district,detail_address,referral,car_id,created_time,purchase_willing from tb_member  where uuid = ?) t1 left join tb_car t2 on t1.car_id = t2.id left join tb_address t3 on t1.province_id = t3.id left join tb_address t4 on t1.city_id = t4.id', [options.member_id]);
  let rows = await P(pool, 'query', sql);
  return rows[0];
};

module.exports = {
  notificationPush: notificationPush,
  notificationList:notificationList,
  feedbackMsgList: feedbackMsgList,
  replyMsg: replyMsg,
  userDetail: userDetail
};
