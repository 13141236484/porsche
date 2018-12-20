const {
  pool,
  queryFormat,
  P
} = require('./utils');


// 经销商查询 地区接口
let getArea = async function (options) {
  let sql = queryFormat('select id as province_id,name from tb_address where id < 100');
  let result = await P(pool, 'query', sql);
  return result;
};
// 查询保时捷中心
let getPorscheCenter = async function (options) {
  let sql = queryFormat('select uuid,cn_name from tb_porsche_center where province_id = ?', [options.province_id]);
  let result = await P(pool, 'query', sql);
  return result;
};

// 经销商查询列表
let dealerQueryUserList = async function (options) {
  let wherestr = '';
  if (options.start_time) {
    wherestr += queryFormat(' and created_time >= ?', [options.start_time]);
  }
  if (options.end_time) {
    wherestr += queryFormat(' and created_time <= ?', [options.end_time]);
  }
  let center = '';
  if (options.porsche_center_id) {
    center += queryFormat(' and t3.uuid = ?', [options.porsche_center_id]);
  }
  let sql = queryFormat('select t3.cn_name as porsche_center_name,t1.member_id,t2.username as member,t2.gender,t2.tel,t1.created_time from (select porsche_center_id,member_id,created_time from tb_dealer where type=?' + wherestr + ' ) t1  left join tb_member t2 on t1.member_id = t2.uuid  left join tb_porsche_center t3 on t1.porsche_center_id = t3.uuid where 1=1' + center + ' limit ?,?', ['CONTACT', parseInt(options.offset), parseInt(options.count)]);
  let rows = await P(pool, 'query', sql);
  let result = [];
  if (options.start_time || options.end_time || options.porsche_center_id) {
    let query = queryFormat('select count(1) as count from (select porsche_center_id,member_id,created_time from tb_dealer where type=?' + wherestr + ') t1  left join tb_member t2 on t1.member_id = t2.uuid  left join tb_porsche_center t3 on t1.porsche_center_id = t3.uuid where 1=1' + center, ['CONTACT']);
    result = await P(pool, 'query', query);
  } else {
    let query = queryFormat('select count(1) as count from  tb_dealer where type = ?', ['CONTACT']);
    result = await P(pool, 'query', query);
  }

  return {
    rows: rows,
    count: result[0].count
  };
};

//经销商查询用户信息
let dealerQueryUserDetail = async function (options) {
  let sql = queryFormat('select t1.uuid,t1.nickname,t1.username,t1.gender,t1.tel,t2.name as province,t3.name as city,t1.district,t1.detail_address,t1.email,t1.purchase_willing,t1.interest,t1.avatar,t4.name as car_name,t1.have_car,t1.car_brand,t1.car_model from (select uuid,nickname,username,gender,tel,province_id,city_id,district,detail_address,email,purchase_willing,interest,avatar,car_id,have_car,car_brand,car_model from tb_member where uuid = ?) t1 left join tb_address t2 on t1.province_id = t2.id left join tb_address t3 on t1.city_id = t3.id left join tb_car t4 on t1.car_id= t4.id', [options.member_id]);
  let result = await P(pool, 'query', sql);
  return result[0];
};

//经销商查询推送列表
let dealerQueryPushList = async function (options) {
  let sql = queryFormat('select t2.account as author,t1.content,t1.is_read,t1.created_time from (select admin_id,content,created_time,is_read from tb_notification  where member_id = ? limit ?,?) t1 left join tb_admin t2 on t1.admin_id = t2.id', [options.member_id, parseInt(options.offset), parseInt(options.count)]);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from tb_notification where member_id = ?', [options.member_id]);
  let result = await P(pool, 'query', query);
  return {
    rows: rows,
    count: result[0].count
  };
};

//经销商查询推送消息
let dealerQueryPushMsg = async function (options) {
  let time = new Date().getTime();
  let query = queryFormat('insert into tb_notification set uuid = ?,admin_id= ?,member_id=?,content =?,created_time = ?,is_read = ? ', [options.uuid, options.mamager_id, options.member_id, options.content, time, 'N']);
  await P(pool, 'query', query);
};

//申请试驾列表
let applyDriveList = async function (options) {
  let wherestr = '';
  if (options.start_time) {
    wherestr += queryFormat(' and created_time >= ?', [options.start_time]);
  }
  if (options.end_time) {
    wherestr += queryFormat(' and created_time <= ?', [options.end_time]);
  }
  if (options.trial_drive_start_time) {
    wherestr += queryFormat(' and trial_drive_time >= ?', [options.trial_drive_start_time]);
  }
  if (options.trial_drive_end_time) {
    wherestr += queryFormat(' and trial_drive_time <= ?', [options.trial_drive_end_time]);
  }
  let center = '';
  if (options.porsche_center_id) {
    center += queryFormat(' and t3.uuid = ?', [options.porsche_center_id]);
  }
  let sql = queryFormat('select t1.porsche_center_id,t1.member_id,t3.cn_name as porsche_center_name,t2.username as member,t2.gender,t2.tel,t1.created_time,t1.trial_drive_time from (select porsche_center_id, member_id,trial_drive_time,created_time from tb_dealer where type=?' + wherestr + ') t1 left join tb_member t2 on t1.member_id = t2.uuid  left join tb_porsche_center t3 on t1.porsche_center_id = t3.uuid where 1=1' + center + ' limit ?,?', ['TRIAL', parseInt(options.offset), parseInt(options.count)]);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from (select porsche_center_id,member_id,created_time from tb_dealer where type=?' + wherestr + ') t1  left join tb_member t2 on t1.member_id = t2.uuid  left join tb_porsche_center t3 on t1.porsche_center_id = t3.uuid where 1=1' + center, ['TRIAL']);
  let result = await P(pool, 'query', query);
  return {
    rows: rows,
    count: result[0].count
  };
};


//申请试驾用户信息
let applyDriveUser = async function (options) {
  let sql = queryFormat('select t1.uuid,t1.nickname,t1.username,t1.gender,t1.tel,t2.name as province,t3.name as city,t1.district,t1.detail_address,t1.email,t1.purchase_willing,t1.interest,t1.avatar,t4.name as car_name,t1.have_car,t1.car_brand,t1.car_model,t1.referral,t1.created_time from (select uuid,nickname,username,gender,tel,province_id,city_id,district,detail_address,email,purchase_willing,interest,avatar,car_id,have_car,car_brand,car_model,referral,created_time from tb_member where uuid = ?) t1 left join tb_address t2 on t1.province_id = t2.id left join tb_address t3 on t1.city_id = t3.id left join tb_car t4 on t1.car_id= t4.id', [options.member_id]);
  let result = await P(pool, 'query', sql);
  return result[0];
};

//申请试驾推送消息列表
let applyDrivePushList = async function (options) {
  let sql = queryFormat('select t2.account as author,t1.content,t1.is_read,t1.created_time from (select admin_id,content,created_time,is_read from tb_notification  where member_id = ? limit ?,?) t1 left join tb_admin t2 on t1.admin_id = t2.id', [options.member_id, parseInt(options.offset), parseInt(options.count)]);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from tb_notification where member_id = ? ', [options.member_id]);
  let result = await P(pool, 'query', query);
  return {
    rows: rows,
    count: result[0].count
  };
};

//申请试驾推送消息
let applyDrivePushMsg = async function (options) {
  let time = new Date().getTime();
  let query = queryFormat('insert into tb_notification set uuid = ?,admin_id = ?,member_id = ?,content =?,created_time = ?,is_read = ? ', [options.uuid, options.manager_id, options.member_id, options.content, time, 'N']);
  await P(pool, 'query', query);
};

let dealerQueryListExport = async function (options) {
  let wherestr = '';
  if (options.start_time) {
    wherestr += queryFormat(' and created_time >= ?', [options.start_time]);
  }
  if (options.end_time) {
    wherestr += queryFormat(' and created_time <= ?', [options.end_time]);
  }
  let center = '';
  if (options.porsche_center_id) {
    center += queryFormat(' and t3.uuid = ?', [options.porsche_center_id]);
  }
  let sql = queryFormat('select t3.cn_name as porsche_center_name,t1.member_id,t2.nickname,t2.firstname as firstname,t2.surname as surname,t2.gender,t2.tel,t2.purchase_willing,t2.car_id, t1.created_time from (select porsche_center_id,member_id,created_time from tb_dealer where type=?' + wherestr + ' ) t1  left join tb_member t2 on t1.member_id = t2.uuid  left join tb_porsche_center t3 on t1.porsche_center_id = t3.uuid where 1=1' + center, ['CONTACT']);
  let result = await P(pool, 'query', sql);
  let car = queryFormat('select id,name from tb_car');
  let car_result = await P(pool, 'query', car);
  let car_v = {};
  for (let c of car_result) {
    car_v[c.id] = c.name;
  }
  console.log(car_v);
  for (let i = 0; i < result.length; i++) {
    console.log(result[i]);
    if (result[i].car_id) {
      let car = result[i].car_id.split(',');
      console.log(1111, car);
      let value = '';
      for (let j = 0; j < car.length; j++) {
        value += car_v[car[j]] + '     ';
        console.log(1121, value);
      }
      result[i].car_id = value;
    }

  }
  return result;
};

let dealerTrialListExport = async function (options) {
  let wherestr = '';
  if (options.start_time) {
    wherestr += queryFormat(' and created_time >= ?', [options.start_time]);
  }
  if (options.end_time) {
    wherestr += queryFormat(' and created_time <= ?', [options.end_time]);
  }
  let center = '';
  if (options.porsche_center_id) {
    center += queryFormat(' and t3.uuid = ?', [options.porsche_center_id]);
  }
  let sql = queryFormat('select t3.cn_name as porsche_center_name,t1.member_id,t2.nickname,t2.firstname as firstname,t2.surname as surname,t2.gender,t2.tel,t2.purchase_willing,t2.car_id, t1.created_time,t1.trial_drive_time from (select porsche_center_id,member_id,trial_drive_time,created_time from tb_dealer where type=?' + wherestr + ' ) t1  left join tb_member t2 on t1.member_id = t2.uuid left join tb_porsche_center t3 on t1.porsche_center_id = t3.uuid where 1=1' + center, ['TRIAL']);
  let result = await P(pool, 'query', sql);
  let car = queryFormat('select id,name from tb_car');
  let car_result = await P(pool, 'query', car);
  let car_v = {};
  for (let c of car_result) {
    car_v[c.id] = c.name;
  }
  console.log(car_v);
  for (let i = 0; i < result.length; i++) {
    console.log(result[i]);
    if (result[i].car_id) {
      let car = result[i].car_id.split(',');
      console.log(1111, car);
      let value = '';
      for (let j = 0; j < car.length; j++) {
        value += car_v[car[j]] + '     ';
        console.log(1121, value);
      }
      result[i].car_id = value;
    }

  }
  return result;
};

module.exports = {
  getArea: getArea,
  getPorscheCenter: getPorscheCenter,
  dealerQueryUserList: dealerQueryUserList,
  dealerQueryUserDetail: dealerQueryUserDetail,
  dealerQueryPushList: dealerQueryPushList,
  dealerQueryPushMsg: dealerQueryPushMsg,
  applyDriveList: applyDriveList,
  applyDriveUser: applyDriveUser,
  applyDrivePushList: applyDrivePushList,
  applyDrivePushMsg: applyDrivePushMsg,
  dealerQueryListExport: dealerQueryListExport,
  dealerTrialListExport: dealerTrialListExport
};
