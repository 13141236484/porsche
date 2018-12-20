const {
  pool,
  queryFormat,
  P,
  verifyPassword
} = require('./utils');
const KnownErrors = require('./error');
const uuidv4 = require('uuid/v4');

//登录

let checkUser = async function (tel) {
  let sql = queryFormat('select * from tb_member  where tel = ?', [tel]);
  let result = await P(pool, 'query', sql);
  return result;
};


let register = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('update tb_member set uuid =?,gender = ?,nickname = ?,interest = ?,present =?,created_time = ?,status = ?,is_received_present = ?,firstname = ?,surname = ?,referral = ? where tel = ?', [options.uuid, options.gender, options.nickname, options.interest, options.present, time, 'REGISTERED', 'N', options.firstname, options.surname,options.referral, options.tel]);
  await P(pool, 'query', sql);
  let notification_sql = queryFormat('insert into tb_notification set uuid = ?,admin_id = ?,member_id = ?,content = ?,created_time = ?,is_read = ?',[uuidv4(),1,options.uuid,'<p>欢迎加入保时捷挚享汇，点击 <a href=" " onclick="javascript:window.location.href="\'http://www.porsche-fan.com/#/personal/personalcenter\'">www.porsche-fan.com/#/personal/personalcenter</a >  完善个人信息，即可获得由挚享汇为您定制的精美礼品。 体验精彩活动，发表你的声音，深度活跃会员有机会获赠额外礼遇。愿挚享汇与您一路相伴，从此以梦为马，驭风而行！<p>',new Date().getTime(),'N']);
  await P(pool,'query',notification_sql);
};

let managerLogin = async function (options) {
  let sql = queryFormat('select * from tb_admin where account = ?', [options.account]);
  let result = await P(pool, 'query', sql);
  if (result.length === 0) throw new KnownErrors.ErrorNotFound();
  else if (!verifyPassword(options.password, result[0].salted_password)) throw new KnownErrors.ErrorInvalidPwd();
  return result[0];
};

let notificationCount = async function (options) {
  let sql = queryFormat('select count(1) from tb_notification where to_user_id = ？ and status = ?', [options.to_user_id, 'unread']);
  await P(pool, 'query', sql);
};

let messageTip = async function (options) {
  // let sql = queryFormat('select * from tb_member where uuid = ? and (nickname is not null and length(nickname)<>0) and (gender is not null and length(gender)<>0) and (tel is not null and length(tel)<>0) and  (username is not null and length(username)<>0) and (province_id is not null and length(province_id)<>0) and (city_id is not null and length(city_id)<>0) and (district is not null and length(district)<>0) and (detail_address is not null and length(detail_address)<>0)  and (email is not null and length(email)<>0) and (avatar is not null and length(avatar)<>0) and (have_car is not null and length(have_car)<>0) and (purchase_willing is not null and length(purchase_willing)<>0) and (interest is not null and length(interest)<>0)', [options.member_id]);
  let sql = queryFormat('select * from tb_member where uuid = ? and (nickname is not null and length(nickname)<>0) and (gender is not null and length(gender)<>0) and (tel is not null and length(tel)<>0) and  (username is not null and length(username)<>0) and (province_id is not null and length(province_id)<>0) and (city_id is not null and length(city_id)<>0) and (district is not null and length(district)<>0) and (detail_address is not null and length(detail_address)<>0)  and (email is not null and length(email)<>0) and (have_car is not null and length(have_car)<>0) and (purchase_willing is not null and length(purchase_willing)<>0) and (interest is not null and length(interest)<>0)', [options.member_id]);
  let result = await P(pool, 'query', sql);
  return result;
};

let loginHistory = async function (options) {
  if(options.url){
    let time = new Date().getTime();
    let sql = queryFormat('insert into tb_member_login_history set member_id = ?,url = ?,created_time = ?', [options.member_id,options.url, time]);
    await P(pool, 'query', sql);
  }
};

let interestAdd = async function (options) {
  let sql = queryFormat('update tb_member set interest = ? where tel = ?', [options.interest, options.tel]);
  await P(pool, 'query', sql);
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
  checkUser: checkUser,
  register: register,
  managerLogin: managerLogin,
  notificationCount: notificationCount,
  messageTip: messageTip,
  loginHistory: loginHistory,
  interestAdd: interestAdd,
  codeData: codeData,
    codeOverdue: codeOverdue,
  duanxinMember: duanxinMember
};
