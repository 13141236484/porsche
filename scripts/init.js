require('dotenv').config();
const { pool, queryFormat } = require('../src/models/utils');
const crypto = require('crypto');
// 生成密码
let genPassword = function (password) {
  const saltSeed = '~!@#$%^&*()_+[]{}|;:,./<>?';
  let salt = '';
  for (let i = 0; i < 4; i++) {
    let randNum = Math.floor(Math.random() * saltSeed.length);
    salt += saltSeed[randNum];
  }
  return crypto.createHash('sha256').update(password + salt).digest('hex') + ' ' + salt;
};
(async function () {
  let insertQuery = queryFormat('insert into tb_admin set account = ?,salted_password = ?', ['Porsche China', genPassword('porscheadmin')]);
  await new Promise(function (resolve, reject) {
    pool.query(insertQuery, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
})().then(function () {
  console.log('插入完成！');
  process.exit();
}).catch(function (e) {
  console.log('插入失败', e);
  process.exit();
});
