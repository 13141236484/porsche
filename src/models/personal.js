const {
  pool,
  queryFormat,
  P
} = require('./utils');

// 返回用户信息
let userInfo = async function (options) {
  // let sql = queryFormat('select t1.uuid,t1.nickname,concat(t1.surname,t1.firstname) as username,t1.firstname,t1.surname,t1.gender,t1.tel,t1.province_id,t2.name as province,t1.city_id,t3.name as city,t1.district,t1.detail_address,t1.email,t1.purchase_willing,t1.interest,t1.avatar,t1.car_id,t1.have_car,t1.car_brand,t1.car_model from (select uuid,nickname,firstname,surname,gender,tel,province_id,city_id,district,detail_address,email,purchase_willing,interest,avatar,car_id,have_car,car_brand,car_model from tb_member where uuid = ?) t1 left join tb_address t2 on t1.province_id = t2.id left join tb_address t3 on t1.city_id = t3.id ', [options.member_id]);
  // 
  let sql = queryFormat('select t1.uuid,t1.nickname,concat(t1.surname,t1.firstname) as username,t1.firstname,t1.surname,t1.gender,t1.tel,t1.province_id,t2.name as province,t1.city_id,t3.name as city,t1.district,t1.detail_address,t1.email,t1.purchase_willing,t1.interest,t1.avatar,t1.car_id,t1.have_car,t1.brand_model from (select uuid,nickname,firstname,surname,gender,tel,province_id,city_id,district,detail_address,email,purchase_willing,interest,avatar,car_id,have_car,brand_model from tb_member where uuid = ?) t1 left join tb_address t2 on t1.province_id = t2.id left join tb_address t3 on t1.city_id = t3.id ', [options.member_id]);
  let result = await P(pool, 'query', sql);
  let user = result[0];

  //获取car_id
  let car_id = user.car_id;
  if (car_id) {
    user.car = car_id.split(',');
  }

  let interest = user.interest;
  console.log('interest', interest);
  if (interest) {
    let interestArray = interest.split(',');
    let interestInfo = [];
    for (let i = 0; i < interestArray.length; i++) {
      let query = queryFormat('select  picture_path from tb_picture where id = ?', [interestArray[i]]);
      let queryResult = await P(pool, 'query', query);
      console.log('queryResult', queryResult);
      if (queryResult.length > 0) {
        interestInfo.push(queryResult[0].picture_path);
      }
      console.log('interestInfo2', interestInfo);
    }
    user.interest_pic = interestInfo;
    console.log(333, interestInfo);
  } else {
    console.log('interestInfo3');
    user.interest_pic = [];
  }

  let brand_model = user.brand_model;
  if(brand_model){
    user.brand_model = brand_model.split(',');
  }
  return user;
};

// 返回省份接口
let province = async function () {
  let sql = queryFormat('select id as pronvince_id,name as province_name  from tb_address where id < 100');
  let result = await P(pool, 'query', sql);
  return result;
};

// 返回城市接口
let city = async function (options) {
  let sql = queryFormat('select id as city_id,name as city_name from tb_address where parent_id = ?', [options.province_id]);
  let result = await P(pool, 'query', sql);
  return result;
};
//返回偏爱的保时捷车型
let porscheCar = async function (options) {
  let sql = queryFormat('select id as car_id,name as car_name from tb_car');
  let result = await P(pool, 'query', sql);
  return result;
};

// 修改用户信息
let infoChange = async function (options) {
  let updatestr = '';
  let willing_sql = queryFormat('select purchase_willing from tb_member where uuid = ? and purchase_willing = ?', [options.member_id, 'N']);
  let willing_result = await P(pool, 'query', willing_sql);
  if (willing_result.length > 0) {
    if (options.purchase_willing === 'Y') {
      let time = new Date().getTime();
      updatestr += queryFormat(',updated_time = ? ', [time]);
    }
  }
  // let sql = queryFormat('update tb_member set firstname = ?,surname = ?, interest = ?, avatar = ?, nickname = ?,gender = ?,province_id = ?,city_id = ?,district = ?,detail_address = ?,email = ?,purchase_willing = ?,car_id = ?,have_car = ?,car_brand = ?,car_model = ?' + updatestr + 'where uuid = ?', [options.firstname, options.surname, options.interest, options.avatar, options.nickname, options.gender, options.province_id, options.city_id, options.district, options.detail_address, options.email, options.purchase_willing, options.car_id, options.have_car, options.car_brand, options.car_model, options.member_id]);
  let sql = queryFormat('update tb_member set firstname = ?,surname = ?, interest = ?, avatar = ?, nickname = ?,gender = ?,province_id = ?,city_id = ?,district = ?,detail_address = ?,email = ?,purchase_willing = ?,car_id = ?,have_car = ?,brand_model = ?' + updatestr + 'where uuid = ?', [options.firstname, options.surname, options.interest, options.avatar, options.nickname, options.gender, options.province_id, options.city_id, options.district, options.detail_address, options.email, options.purchase_willing, options.car_id, options.have_car, options.brand_model, options.member_id]);
  await P(pool, 'query', sql);
};

// 返回用户浏览记录
let browse = async function (options) {
  let sql_visit = queryFormat('select t1.id,t1.article_id,t2.title,t1.created_time,t1.visit_url from (select id, article_id,member_id,action,created_time,visit_url from tb_member_action where member_id = ? and action = ? order by created_time desc) t1 left join tb_article t2 on t1.article_id = t2.uuid ', [options.member_id, 'VISIT']);
  let result_visit = await P(pool, 'query', sql_visit);

  let sql_upvote = queryFormat('select t1.id,t1.article_id,t2.title,t1.created_time,t1.visit_url from (select id, article_id,member_id,action,created_time,visit_url from tb_member_action where member_id = ? and action = ?  order by created_time desc) t1 left join tb_article t2 on t1.article_id = t2.uuid ', [options.member_id, 'UPVOTE']);
  let result_upvote = await P(pool, 'query', sql_upvote);
  return {
    visit: result_visit,
    upvote: result_upvote
  };
};

//  删除浏览记录
let browseDelete = async function (options) {
  let sql = queryFormat('delete from tb_member_action where id = ?', [options.id]);
  await P(pool, 'query', sql);
};
// 参与活动列表
let activityList = async function (options) {
  let sql = queryFormat('select t1.article_id,t2.title,t1.created_time from (select * from tb_member_action where member_id = ? and action = ?) t1 left join tb_article t2 on t1.article_id = t2.uuid', [options.member_id, 'JOIN']);
  let result = await P(pool, 'query', sql);
  return result;
};

// 返回消息列表
let notificationList = async function (options) {
  let sql = queryFormat('select uuid,content,created_time,is_read from tb_notification where member_id = ? order by created_time desc', [options.member_id]);
  let result = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from tb_notification where member_id = ? and is_read = ?', [options.member_id, 'N']);
  let queryResult = await P(pool, 'query', query);
  return {
    rows: result,
    count: queryResult[0].count
  };
};

//  删除消息
let notificationDelete = async function (options) {
  let sql = queryFormat('delete from tb_notification where uuid = ?', [options.notification_id]);
  await P(pool, 'query', sql);
};

let notificationRead = async function (options) {
  let sql = queryFormat('update tb_notification set is_read = ? where uuid = ?', ['Y', options.notification_id]);
  await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from tb_notification where is_read = ? and member_id = ?', ['N', options.member_id]);
  let result = await P(pool, 'query', query);
  return result[0].count;
};
// 留言回复
let notificationReply = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_advice set member_id = ?,content = ?,created_time = ?', [options.member_id, options.content, time]);
  await P(pool, 'query', sql);
};
//  发帖列表
let postList = async function (options) {
  let send_sql = queryFormat('select t1.article_id,t2.title,t1.created_time,t1.review_status from (select article_id,created_time,review_status from tb_member_action where member_id = ? and action = ? and exsit_status = ? order by created_time desc) t1 left join tb_article t2 on t1.article_id = t2.uuid', [options.member_id, 'POST', 'SEND']);
  let send_result = await P(pool, 'query', send_sql);
  let delete_sql = queryFormat('select t1.article_id,t2.title,t1.created_time,t1.review_status from (select article_id,created_time,review_status from tb_member_action where member_id = ? and action = ? and exsit_status = ?) t1 left join tb_article t2 on t1.article_id = t2.uuid', [options.member_id, 'POST', 'DELETE']);
  let delete_result = await P(pool, 'query', delete_sql);
  return {
    send: send_result,
    delete: delete_result
  };
};
//  删除发帖
let postDelete = async function (options) {
  let sql = queryFormat('update tb_member_action set exsit_status = ? where article_id = ?', ['DELETE', options.post_id]);
  await P(pool, 'query', sql);
};

let postRecover = async function (options) {
  let sql = queryFormat('update tb_member_action set exsit_status = ? where article_id = ?', ['SEND', options.post_id]);
  await P(pool, 'query', sql);
};

let userMessage = async function (options) {
  let query = queryFormat('select count(1) as count from tb_notification where member_id = ? and is_read = ?', [options.member_id, 'N']);
  let queryResult = await P(pool, 'query', query);
  return queryResult[0].count;
};

// 座驾品牌
let carBrand = async function (options) {
  // let sql = queryFormat('select id as brand_id,pid,brand_name from car_brand');

  let sql = queryFormat('select id,brand_name as letter from car_brand where pid = 0');
  let result = await P(pool, 'query', sql);

  for (let i = 0; i < result.length; i++) {
     let sql1 = queryFormat('select id as brand_id,brand_name from car_brand where pid = ?',[result[i].id]);
     let res = await P(pool, 'query', sql1);
     result[i].brands = res;

     // result.splice(result[i].id,1);
  }
  return result;
};

// 座驾型号
let carType = async function(options){
  let sql = queryFormat('select brand_name,model_name from car_model left join car_brand on car_model.bid = car_brand.id where car_model.bid = ?', [options.brand_id]);
  let result = await P(pool, 'query', sql);
  return result;
}

// 品牌模糊查询
let findBrand = async function(options){
  let sql = queryFormat('select brand_name from car_brand where brand_name like "%'+options.brand_name+'%"');
  let result = await P(pool, 'query', sql);
  return result;
}

module.exports = {
  userInfo: userInfo,
  province: province,
  city: city,
  porscheCar: porscheCar,
  infoChange: infoChange,
  browse: browse,
  browseDelete: browseDelete,
  activityList: activityList,
  notificationList: notificationList,
  notificationRead: notificationRead,
  notificationDelete: notificationDelete,
  notificationReply: notificationReply,
  postList: postList,
  postDelete: postDelete,
  postRecover: postRecover,
  userMessage: userMessage,
    // gzq
    carBrand: carBrand,
    carType: carType,
    findBrand: findBrand
};
