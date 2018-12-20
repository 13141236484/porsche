const {
  pool,
  queryFormat,
  P
} = require('./utils');

// 图片列表
let pictureList = async function (options) {
  let sql = queryFormat('select * from  tb_picture  order by type limit ?,?', [parseInt(options.offset), parseInt(options.count)]);
  let rows = await P(pool, 'query', sql);
  let query = queryFormat('select count(1) as count from  tb_picture');
  let result = await P(pool, 'query', query);
  return {
    rows: rows,
    count: result[0].count
  };
};

let pictureDetail = async function (options) {
  let sql = queryFormat('select * from tb_picture where id = ?', [options.id]);
  let result = await P(pool, 'query', sql);
  return result[0];
};

// 图片修改
let pictureUpdate = async function (options) {
  let sql = queryFormat('update tb_picture set picture_path = ?,picture_order = ?,type = ?, status = ?,picture_path_app = ?,content = ? where id = ?', [options.picture_path, options.picture_order, options.type, options.status, options.picture_path_app, options.content, options.id]);
  await P(pool, 'query', sql);
};

// 图片添加
let pictureAdd = async function (options) {
  let sql = queryFormat('insert tb_picture set picture_path = ?,picture_order = ?,type = ?, status = ?,picture_path_app = ?,content = ?', [options.picture_path, options.picture_order, options.type, options.status, options.picture_path_app, options.content]);
  await P(pool, 'query', sql);
};


module.exports = {
  pictureList: pictureList,
  pictureDetail: pictureDetail,
  pictureUpdate: pictureUpdate,
  pictureAdd: pictureAdd
};
