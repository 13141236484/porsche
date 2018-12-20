const {
  pool,
  queryFormat,
  P
} = require('./utils');
const KnownErrors = require('./error');

// 获取注册用户人数
let personCount = async function () {
  let sql = queryFormat('select count(1) as registercount from tb_member where status = ?', ['REGISTERED']);
  let result = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as completecount from tb_member where status = ? and (nickname is not null and length(nickname)<>0) and (gender is not null and length(gender)<>0) and (tel is not null and length(tel)<>0) and  (username is not null and length(username)<>0) and (province_id is not null and length(province_id)<>0) and (city_id is not null and length(city_id)<>0) and (district is not null and length(district)<>0) and (detail_address is not null and length(detail_address)<>0)  and (email is not null and length(email)<>0) and (avatar is not null and length(avatar)<>0) and (have_car is not null and length(have_car)<>0) and (purchase_willing is not null and length(purchase_willing)<>0) and (interest is not null and length(interest)<>0)', ['REGISTERED']);
  let queryResult = await P(pool, 'query', query);
  return {
    registercount: result[0].registercount,
    completecount: queryResult[0].completecount
  };
};

//返回偏爱的保时捷车型
let porscheCar = async function (options) {
  let sql = queryFormat('select id as car_id,name as car_name from tb_car');
  let result = await P(pool, 'query', sql);
  return result;
};

//注册用户管理
//注册用户列表
let registerUserList = async function (options) {
  let wherestr = '';
  if (options.nickname) {
    let key = '%' + options.nickname + '%';
    wherestr += queryFormat(' and nickname like ? ', [key]);
  }
  if (options.tel) {
    wherestr += queryFormat(' and tel = ?', [options.tel]);
  }

  if (options.complete) {
    if (options.complete === 'Y')
      wherestr += queryFormat(' and (nickname is not null and length(nickname)<>0) and (gender is not null and length(gender)<>0) and (tel is not null and length(tel)<>0) and  (firstname is not null and length(firstname)<>0) and (surname is not null and length(surname)<>0) and (province_id is not null and length(province_id)<>0) and (city_id is not null and length(city_id)<>0) and (district is not null and length(district)<>0) and (detail_address is not null and length(detail_address)<>0)  and (email is not null and length(email)<>0) and (avatar is not null and length(avatar)<>0) and (have_car is not null and length(have_car)<>0) and (purchase_willing is not null and length(purchase_willing)<>0) and (interest is not null and length(interest)<>0)');
    else if (options.complete === 'N') wherestr += queryFormat(' and ((nickname is  null or length(nickname)=0) or (gender is null or length(gender)=0) or (tel is  null or length(tel)=0) or  (firstname is  null or length(firstname)=0) or (surname is  null or length(surname)=0) or (province_id is  null or length(province_id)=0) or (city_id is null or length(city_id)=0) or (district is  null or length(district)=0) or (detail_address is  null or length(detail_address)=0)  or (email is  null or length(email)=0) or (avatar is null or length(avatar)=0) or (have_car is  null or length(have_car)=0) or (purchase_willing is null or length(purchase_willing)=0) or (interest is null or length(interest)=0))');
  }
  // 一年内有购车意愿发生改变  //事实上是所有的
  if (options.purchase_willing) {
    wherestr += queryFormat(' and purchase_willing = ?', [options.purchase_willing]);
    // let time = new Date().getTime();
    // wherestr += queryFormat(' and purchase_willing = ? and purchase_willing_updated_time <=? and purchase_willing_updated_time >= ? ', [options.purchase_willing, time, time - 31536000000]);
  }
  if (options.car_id) {
    wherestr += queryFormat(' and car_id like "%?%" ', [options.car_id]);
  }
  if (options.willing_change_start_time) {
    wherestr += queryFormat(' and purchase_willing_updated_time >= ?', [options.willing_change_start_time]);
  }
  if (options.willing_change_end_time) {
    wherestr += queryFormat(' and purchase_willing_updated_time <= ?', [options.willing_change_end_time]);
  }
  if (options.interest_id) {
    wherestr += queryFormat(' and interest like "%?%"', [options.interest_id]);
  }

  let sql = queryFormat('select t1.uuid,t1.avatar,t1.nickname,t1.firstname,t1.surname,t1.gender,t1.tel,t3.name as province,t4.name as city,t1.district,t1.created_time,t5.login_time,t1.referral,t1.is_received_present from (select uuid,avatar, nickname,firstname,surname,gender,tel,province_id,city_id,district,car_id,created_time,referral,is_received_present from tb_member  where status = ? ' + wherestr + ' limit ?,?) t1  left join tb_address t3 on t1.province_id = t3.id left join tb_address t4 on t1.city_id = t4.id left join (select member_id,count(member_id) as login_time from tb_member_login_history group by member_id) t5 on t1.uuid = t5.member_id', ['REGISTERED', parseInt(options.offset), parseInt(options.count)]);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from tb_member where status = ? ' + wherestr, ['REGISTERED']);
  let result = await P(pool, 'query', query);
  return {
    rows: rows,
    count: result[0].count
  };
};

let userAllListExport = async function () {
  let sql = queryFormat('select username,tel,status,referral from tb_member');
  let result = await P(pool, 'query', sql);
  return result;
};


let userListExport = async function (options) {
  let wherestr = '';
  if (options.nickname) {
    let key = '%' + options.nickname + '%';
    wherestr += queryFormat(' and nickname like ? ', [key]);
  }
  if (options.tel) {
    wherestr += queryFormat(' and tel = ?', [options.tel]);
  }

  if (options.complete) {
    if (options.complete === 'Y')
      wherestr += queryFormat(' and (nickname is not null and length(nickname)<>0) and (gender is not null and length(gender)<>0) and (tel is not null and length(tel)<>0) and  (firstname is not null and length(firstname)<>0) and (surname is not null and length(surname)<>0) and (province_id is not null and length(province_id)<>0) and (city_id is not null and length(city_id)<>0) and (district is not null and length(district)<>0) and (detail_address is not null and length(detail_address)<>0)  and (email is not null and length(email)<>0) and (avatar is not null and length(avatar)<>0) and (have_car is not null and length(have_car)<>0) and (purchase_willing is not null and length(purchase_willing)<>0) and (interest is not null and length(interest)<>0)');
    else if (options.complete === 'N') wherestr += queryFormat(' and ((nickname is  null or length(nickname)=0) or (gender is null or length(gender)=0) or (tel is  null or length(tel)=0) or  (firstname is  null or length(firstname)=0) or (surname is  null or length(surname)=0) or (province_id is  null or length(province_id)=0) or (city_id is null or length(city_id)=0) or (district is  null or length(district)=0) or (detail_address is  null or length(detail_address)=0)  or (email is  null or length(email)=0) or (avatar is null or length(avatar)=0) or (have_car is  null or length(have_car)=0) or (purchase_willing is null or length(purchase_willing)=0) or (interest is null or length(interest)=0))');
  }
  // let time = new Date().getTime();
  // 一年内有购车意愿发生改变
  if (options.purchase_willing) {
    wherestr += queryFormat(' and purchase_willing = ?', [options.purchase_willing]);
    // wherestr += queryFormat(' and purchase_willing = ? and purchase_willing_updated_time <=? and purchase_willing_updated_time >= ? ', [options.purchase_willing, time, time - 31536000000]);
  }
  if (options.car_id) {
    wherestr += queryFormat(' and car_id like "%?%" ', [options.car_id]);
  }
  if (options.willing_change_start_time) {
    wherestr += queryFormat(' and purchase_willing_updated_time >= ?', [options.willing_change_start_time]);
  }
  if (options.willing_change_end_time) {
    wherestr += queryFormat(' and purchase_willing_updated_time <= ?', [options.willing_change_end_time]);
  }
  if (options.interest_id) {
    wherestr += queryFormat(' and interest like "%?%"', [parseInt(options.interest_id)]);
  }
  let sql = queryFormat('select t1.uuid,t1.avatar,t1.nickname,t1.firstname,t1.surname,t1.gender,t1.email,t1.tel,t3.name as province,t4.name as city,t1.district,t1.detail_address,t1.created_time,t5.login_time,t1.referral,t1.car_id,t1.have_car,t1.car_brand,t1.car_model,t1.purchase_willing from (select uuid,avatar, nickname,firstname,surname,email,gender,tel,province_id,city_id,district,detail_address,car_id,created_time,referral,CASE WHEN purchase_willing = ?  THEN  ? else ?  END as purchase_willing,have_car,car_brand,car_model  from tb_member  where status = ? ' + wherestr + ') t1  left join tb_address t3 on t1.province_id = t3.id left join tb_address t4 on t1.city_id = t4.id left join (select member_id,count(member_id) as login_time from tb_member_login_history group by member_id) t5 on t1.uuid = t5.member_id', ['Y', '是', '否', 'REGISTERED']);
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

// 注册用户详细信息
let registerUserDetail = async function (options) {
  let sql = queryFormat('select t1.avatar,t1.nickname,t1.username,t1.gender,t1.tel,t1.email,t1.detail_address,t2.name as car_name,t1.referral,t3.name as province,t4.name as city,t1.district,t1.created_time,t1.purchase_willing,t1.have_car from (select uuid,avatar, nickname,username,gender,tel,email,province_id,city_id,district,detail_address,referral,car_id,created_time,have_car,purchase_willing from tb_member  where uuid = ?) t1 left join tb_car t2 on t1.car_id = t2.id left join tb_address t3 on t1.province_id = t3.id left join tb_address t4 on t1.city_id = t4.id', [options.member_id]);
  let rows = await P(pool, 'query', sql);
  return rows[0];
};

// 推送消息消息列表
let notificationList = async function (options) {
  let sql = queryFormat('select t2.role as author,t1.content,t1.is_read,t1.created_time from (select uuid,admin_id,content,is_read,created_time from tb_notification where member_id = ? order by created_time desc limit ?,?) t1 left join tb_admin t2 on t1.admin_id = t2.id ', [options.member_id, parseInt(options.offset), parseInt(options.count)]);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from tb_notification where member_id = ?', [options.member_id]);
  let result = await P(pool, 'query', query);
  return {
    rows: rows,
    count: result[0].count
  };
};

// 推送消息
let notificationPush = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_notification set uuid = ?, admin_id = ?, member_id = ?,content = ?,created_time = ?,is_read = ?', [options.uuid, options.manager_id, options.member_id, options.content, time, 'N']);
  await P(pool, 'query', sql);
};

//全部用户管理
let invitedUserList = async function (options) {
  let wherestr = '';
  if (options.tel) {
    wherestr += queryFormat(' and tel = ?', [options.tel]);
  }
  let sql = queryFormat('select username,tel,referral,status from tb_member  where 1=1 ' + wherestr + 'limit ?,?', [parseInt(options.offset), parseInt(options.count)]);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from tb_member where 1=1 ' + wherestr);
  let result = await P(pool, 'query', query);
  return {
    rows: rows,
    count: result[0].count
  };
};
//邀请用户
let invitedUserAdd = async function (options) {
  let query_sql = queryFormat('select * from tb_member where tel = ?', [options.tel]);
  let query_result = await P(pool, 'query', query_sql);
  if (query_result.length > 0) throw new KnownErrors.ErrorAlreadyExist();
  let sql = queryFormat('insert into tb_member set username = ?,tel =?,referral = ?,status = ?', [options.username, options.tel, options.referral, 'UNREGISTERED']);
  await P(pool, 'query', sql);
};

//邀请用户excel上传
let excelUserAdd = async function (data) {
  for (let i = 0; i < data.length; i++) {
    let query_sql = queryFormat('select * from tb_member where tel = ?', [data[i][1]]);
    let query_result = await P(pool, 'query', query_sql);
    if (query_result.length === 0) {
      let t = data[i][2];
      if (!t) t = null;
      let sql = queryFormat('insert into tb_member set username = ?,tel =?,referral = ?,status = ?', [data[i][0], data[i][1], t, 'UNREGISTERED']);
      await P(pool, 'query', sql);
    }
  }
};
//更新信息记录

//更新列表
let userUpdateList = async function (options) {
  let wherestr = '';
  if (options.nickname) {
    let key = '%' + options.nickname + '%';
    wherestr += queryFormat(' and t2.nickname like ? ', [key]);
  }
  if (options.tel) {
    wherestr += queryFormat(' and t2.tel = ?', [options.tel]);
  }
  let sql = queryFormat('select t1.id,t1.member_id,t1.created_time,t2.nickname,t2.tel from (select id,member_id,created_time from tb_member_update_info_history) t1 left join tb_member t2 on t1.member_id = t2.uuid where 1=1 ' + wherestr + ' limit ?,?', [parseInt(options.offset), parseInt(options.count)]);
  let rows = await P(pool, 'query', sql);
  let result = [];
  if (options.nickname || options.tel) {
    let query = queryFormat('select count(1) as count from (select id,member_id,created_time from tb_member_update_info_history) t1 left join tb_member t2 on t1.member_id = t2.uuid where 1=1 ' + wherestr);
    result = await P(pool, 'query', query);
  } else {
    let query = queryFormat('select count(1) as count from  tb_member_update_info_history');
    result = await P(pool, 'query', query);
  }

  return {
    rows: rows,
    count: result[0].count
  };
};

//更新详情
let userUpdateDetail = async function (options) {
  let sql = queryFormat('select origin_data,updated_data from tb_member_update_info_history  where id = ?', [options.id]);
  let result = await P(pool, 'query', sql);
  return result[0];
};

let present = async function (options) {
  let sql = queryFormat('update tb_member set is_received_present = ? where uuid = ?', ['Y', options.member_id]);
  await P(pool, 'query', sql);
};

//返回偏爱的保时捷车型
let interest = async function (options) {
  let sql = queryFormat('select id as interest_id,content from tb_picture where type = ?', ['INTEREST']);
  let result = await P(pool, 'query', sql);
  return result;
};

module.exports = {
  personCount: personCount,
  porscheCar: porscheCar,
  registerUserList: registerUserList,
  userListExport: userListExport,
  userAllListExport: userAllListExport,
  registerUserDetail: registerUserDetail,
  notificationList: notificationList,
  notificationPush: notificationPush,
  invitedUserList: invitedUserList,
  invitedUserAdd: invitedUserAdd,
  excelUserAdd: excelUserAdd,
  userUpdateList: userUpdateList,
  userUpdateDetail: userUpdateDetail,
  present: present,
  interest: interest
};
