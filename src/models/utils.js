const redis = require('ioredis');
const mysql = require('mysql');
const crypto = require('crypto');
const redisClient = new redis(process.env.REDIS_PORT, process.env.REDIS_HOST, {
  dropBufferSupport: true
});
const pool = mysql.createPool({
  connectionLimit: 10,
  socketPath: process.env.DB_SOCK,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: 'UTF8_GENERAL_CI',
  debug: false,
  supportBigNumbers: true
});

const queryFormat = mysql.format;

let P = function () {
  let that = arguments[0];
  let fn = arguments[1];
  let args = Array.prototype.slice.call(arguments, 2);
  return new Promise(function (resolve, reject) {
    let callback = function () {
      if (arguments[0] instanceof Error) {
        return reject(arguments[0]);
      } else if (arguments.length < 2) {
        resolve(arguments[0]);
      } else {
        if (arguments[0]) {
          reject(arguments[0]);
        } else {
          resolve(arguments[1]);
        }
      }
    };
    args.push(callback);
    if (fn === 'query') {
      let queryString;
      if (typeof args[1] === 'function') {
        queryString = args[0];
      } else {
        queryString = mysql.format(args[0], args[1]);
      }
      console.log(`[MYSQL] ${queryString}`);
    }
    that[fn].apply(that, args);
  });
};

// 获取图片路径
let getPicture = async function (options) {
  let sql = queryFormat('select id, picture_path,picture_path_app,content from tb_picture where type =? and status = ?  order by picture_order asc', [options.type, 'Y']);
  let result = await P(pool, 'query', sql);
  return result;
};
// 获取最新消息
let notificat = async function (uuid) {
  let sql = queryFormat('select * from tb_notification where member_id =? and is_read = ?  order by created_time desc limit 1', [uuid, 'N']);
  let result = await P(pool, 'query', sql);
  return result;
};

// 生成密码
// let genPassword = function(password){
//   const saltSeed = '~!@#$%^&*()_+[]{}|;:,./<>?';
//   let salt = '';
//   for (let i = 0; i < 4; i++) {
//     let randNum = Math.floor(Math.random() * saltSeed.length);
//     salt += saltSeed[randNum];
//   }
//   return crypto.createHash('sha256').update(password + salt).digest('hex') + ' ' + salt;
// };
//验证密码
let verifyPassword = function (password, secret) {
  let split_password = secret.split(' ');
  return (crypto.createHash('sha256').update(password + split_password[1]).digest('hex') === split_password[0]);
};

//获取月份值
let getDateArray = function (d1, d2) {
  // var d1 = '2016-02-01';
  // var d2 = '2016-12-30';
  var dateArray = new Array();
  var s1 = d1.split("-");
  var s2 = d2.split("-");
  var mCount = 0;
  if (parseInt(s1[0]) < parseInt(s2[0])) {
    mCount = (parseInt(s2[0]) - parseInt(s1[0])) * 12 + parseInt(s2[1]) - parseInt(s1[1]) + 1;
  } else {
    mCount = parseInt(s2[1]) - parseInt(s1[1]) + 1;
  }
  if (mCount > 0) {
    var startM = parseInt(s1[1]);
    var startY = parseInt(s1[0]);
    for (var i = 0; i < mCount; i++) {
      if (startM < 12) {
        dateArray[i] = new Date(startY + "-" + (startM > 9 ? startM : "0" + startM)).getTime();
        startM += 1;
      } else {
        dateArray[i] = new Date(startY + "-" + (startM > 9 ? startM : "0" + startM)).getTime();
        startM = 1;
        startY += 1;
      }
    }
  }
  return dateArray;
};



module.exports = {
  redisClient: redisClient,
  P: P,
  pool: pool,
  queryFormat: queryFormat,
  getPicture: getPicture,
  notificat: notificat,
  verifyPassword: verifyPassword,
  getDateArray: getDateArray
};
