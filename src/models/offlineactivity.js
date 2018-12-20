const {
  pool,
  queryFormat,
  P
} = require('./utils');

// 返回线下活动进行列表
// let offlineProcessList = async function () {
//   let time = new Date().getTime();
//   let sql = queryFormat('select uuid, start_time,end_time,title,second_type,address,city,visit_count,join_count,picture_path,created_time from  tb_article  where first_type = ? and user_type = ? and end_time > ? order by created_time desc', ['OFFLINE', 'MANAGER', time]);
//   let result = await P(pool, 'query', sql);
//   return result;
// };
// 活动招募
let offlineProcessList = async function (options) {
    let time = new Date().getTime();
    // let sql = "select uuid, start_time,end_time,title,second_type,address,city,visit_count,upvote_count,join_count,picture_path,created_time,small_title,sponsor,maximum,start_registration_time,end_registration_time from  tb_article  where (second_type = ? or second_type = ? or second_type = ? or second_type = ?) and user_type = ? and first_type = ? ";
    let sql = "select uuid, start_time,end_time,title,second_type,address,city,visit_count,upvote_count,join_count,picture_path,created_time,small_title,sponsor,maximum,start_registration_time,end_registration_time from  tb_article  where (second_type = ? or second_type = ? or second_type = ? or second_type = ?) and user_type = ? and first_type = ? and is_show = 1";
    sql += " AND (start_registration_time <= "+Number(time)+") ";
    //news 日期
    // sql += options.date_time ? " AND (start_time >= "+options.date_time+" AND end_time <= "+options.date_time+") " : "";
    if(options.date_time){
        sql += " AND (start_time <="+options.date_time+" AND end_time >= "+options.date_time+") ";
    }
    //news 城市
    sql += options.city_name ? " AND city LIKE '%"+options.city_name+"%' " : "";
    //news 活动类型
    sql += options.active_type=='allactive' ? " AND 1=1 " : "";
    sql += options.active_type=='offlineactive' ? " AND (second_type='OFFLINESELF' or second_type='OFFLINENONEED' or second_type='OFFLINENEED') " : "";
    sql += options.active_type=='onlineactive' ? " AND (second_type='ONLINE') " : "";
    //news 正在进行de活动
    if(options.active_type=='onapplyactive'){
        sql += " AND start_registration_time <= "+Number(time)+" AND end_registration_time >= "+Number(time);
    }
    sql += " order by end_registration_time desc,start_registration_time desc limit ?,? ";
    var sqls = queryFormat(sql, ['OFFLINESELF', 'OFFLINENONEED', 'OFFLINENEED', 'ONLINE', 'MANAGER', 'OFFLINE', parseInt(options.offset), parseInt(options.count) ]);

    let result = await P(pool, 'query', sqls);
    for(let value of Object.values(result)){
        //news 报名未开始
        if(Number(time) < value.start_registration_time){
            value.registration = '报名未开始';
        }
        //news 正在报名
        if(Number(time) >= value.start_registration_time && Number(time) <= value.end_registration_time){
            value.registration = '正在报名';
        }
        //news 感兴趣
        // if(result[0].join_count >= result[0].maximum){
        //     value.registration = '感兴趣';
        // }
        //news 报名已结束
        if(Number(time) >= value.end_registration_time){
            value.registration = '报名已结束';
        }
    }
    return result;
};
//offlineProcessListCount
let offlineProcessListCount = async function (options) {
    let time = new Date().getTime();
    // let sql = "select count(id) as count from tb_article  where (second_type = ? or second_type = ? or second_type = ? or second_type = ?) and user_type = ? and first_type = ? ";
    let sql = "select count(id) as count from tb_article  where (second_type = ? or second_type = ? or second_type = ? or second_type = ?) and user_type = ? and first_type = ? and is_show = 1";
    sql += " AND (start_registration_time <= "+Number(time)+") ";
    //news 日期
    // sql += options.date_time ? " AND (start_time >= "+options.date_time+" AND end_time <= "+options.date_time+") " : "";
    if(options.date_time){
        sql += " AND (start_time <="+options.date_time+" AND end_time >= "+options.date_time+") ";
    }
    //news 城市
    sql += options.city_name ? " AND city LIKE '%"+options.city_name+"%' " : "";
    //news 活动类型
    sql += options.active_type=='allactive' ? " AND 1=1 " : "";
    sql += options.active_type=='offlineactive' ? " AND (second_type='OFFLINESELF' or second_type='OFFLINENONEED' or second_type='OFFLINENEED') " : "";
    sql += options.active_type=='onlineactive' ? " AND (second_type='ONLINE') " : "";
    //news 正在进行de活动
    if(options.active_type=='onapplyactive'){
        sql += " AND start_registration_time <= "+Number(time)+" AND end_registration_time >= "+Number(time);
    }

    var sqls = queryFormat(sql, ['OFFLINESELF', 'OFFLINENONEED', 'OFFLINENEED', 'ONLINE', 'MANAGER', 'OFFLINE']);
    let result = await P(pool, 'query', sqls);
    return {
        count: result[0].count
    }
};
// 活动招募 ri li
let offlineProcessRili = async function () {
    let time = new Date().getTime();
    // let sql = "select start_time,city from  tb_article  where (second_type = ? or second_type = ? or second_type = ? or second_type = ?) and user_type = ? and first_type = ? ";
    let sql = "select start_time,city from  tb_article  where (second_type = ? or second_type = ? or second_type = ? or second_type = ?) and user_type = ? and first_type = ? and is_show = 1";
    sql += " AND (start_registration_time <= "+Number(time)+") ";
    var sqls = queryFormat(sql, ['OFFLINESELF', 'OFFLINENONEED', 'OFFLINENEED', 'ONLINE', 'MANAGER', 'OFFLINE' ]);
    let result = await P(pool, 'query', sqls);
    return result;
};


// 返回线下活动历史列表
// let offlineHistoryList = async function () {
//   let time = new Date().getTime();
//   let sql = queryFormat('select uuid, start_time,end_time,title,second_type,address,city,visit_count,join_count,picture_path,created_time from  tb_article  where first_type = ? and user_type = ? and end_time < ? order by created_time desc', ['OFFLINE', 'MANAGER', time]);
//   let result = await P(pool, 'query', sql);
//   return result;
// };

// 精彩集锦总条数
let offlineHistoryListCount = async function () {
    // let time = new Date().getTime();
    // let sql = queryFormat('select count(id) as count from tb_article  where second_type = ? and user_type = ? and first_type = ? order by created_time desc ', ['SPLENDID', 'MANAGER', 'OFFLINE']);
    let sql = queryFormat('select count(id) as count from tb_article  where second_type = ? and user_type = ? and first_type = ? and is_show = 1 order by created_time desc ', ['SPLENDID', 'MANAGER', 'OFFLINE']);
    let result = await P(pool, 'query', sql);
    return {
        count: result[0].count
    }
};
// 精彩集锦
let offlineHistoryList = async function (options) {
    let time = new Date().getTime();
    // let sql = queryFormat('select uuid, start_time,end_time,title,second_type,address,city,visit_count,upvote_count,join_count,picture_path,created_time,small_title,sponsor,maximum,start_registration_time,end_registration_time from tb_article  where second_type = ? and user_type = ? and first_type = ? order by start_time desc,created_time desc limit ?,? ', ['SPLENDID', 'MANAGER', 'OFFLINE', parseInt(options.offset), parseInt(options.count) ]);
    let sql = queryFormat('select uuid, start_time,end_time,title,second_type,address,city,visit_count,upvote_count,join_count,picture_path,created_time,small_title,sponsor,maximum,start_registration_time,end_registration_time from tb_article  where second_type = ? and user_type = ? and first_type = ? and is_show = 1 order by start_time desc,created_time desc limit ?,? ', ['SPLENDID', 'MANAGER', 'OFFLINE', parseInt(options.offset), parseInt(options.count) ]);
    let result = await P(pool, 'query', sql);
    return result;
};

//获取线下活动详情
let getOfflineDetail = async function (options) {
  let sql = queryFormat('select uuid, start_time,end_time,title,content,second_type,address,city,visit_count,join_count,picture_path,created_time from  tb_article where uuid = ?', [options.article_id]);
  let result = await P(pool, 'query', sql);
  // 修改浏览数量
  let visit_sql = queryFormat('update tb_article set visit_count = visit_count + 1 where uuid = ?', [options.article_id]);
  await P(pool, 'query', visit_sql);

  return result[0];
};

//  申请参与
let apply = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_member_action set article_id = ?,member_id = ?,action = ?,created_time =?', [options.article_id, options.member_id, 'JOIN', time]);
  await P(pool, 'query', sql);
  let join_count_sql = queryFormat('update tb_article set join_count = join_count +1 where uuid = ?', [options.article_id]);
  await P(pool, 'query', join_count_sql);
};

// 经销商查询 地区接口
let getArea = async function (options) {
  let sql = queryFormat('select id as pronvince_id,name from tb_address where id < 100');
  let result = await P(pool, 'query', sql);
  return result;
};
// 查询保时捷中心
let getPorscheCenter = async function (options) {
  let sql = queryFormat('select uuid,cn_name from tb_porsche_center where province_id = ?', [options.province_id]);
  let result = await P(pool, 'query', sql);
  return result;
};
//查询保时捷中心地址
let getPorscheAddr = async function (options) {
  let sql = queryFormat('select detail_address from tb_porsche_center where uuid = ?', [options.porsche_center_id]);
  let result = await P(pool, 'query', sql);
  return result[0];
};

// 经销商查询添加

let dealer = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_dealer set porsche_center_id = ?,member_id = ?,type = ?,created_time = ?', [options.porsche_center_id, options.member_id, 'CONTACT', time]);
  await P(pool, 'query', sql);
};

// 试驾申请
let driveApply = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_dealer set porsche_center_id = ?,member_id = ?,trial_drive_time = ?,type = ?,created_time = ?', [options.porsche_center_id, options.member_id, options.trial_drive_time, 'DRIVE', time]);
  await P(pool, 'query', sql);
};



module.exports = {
  offlineProcessList: offlineProcessList,
  offlineHistoryList: offlineHistoryList,
  getOfflineDetail: getOfflineDetail,
  apply: apply,
  getArea: getArea,
  getPorscheCenter: getPorscheCenter,
  getPorscheAddr: getPorscheAddr,
  dealer: dealer,
  driveApply: driveApply,
    //news
    offlineProcessRili: offlineProcessRili,
    offlineProcessListCount: offlineProcessListCount,
    offlineHistoryListCount: offlineHistoryListCount,
};
