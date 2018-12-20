### 用户信息

####  获取所有用户信息

#### 请求地址

/account/users

#### HTTP方法

GET

#### 请求参数

| 参数名  | 类型   | 是否必须 | 示例            | 描述           |
| ---- | ---- | ---- | ------------- | ------------ |
| time | 字符串  | 是    | 1511155629093 | 该时间之后的用户数据返回 |

#### 返回示例

{

code:1001,

data:[{

user_id:'b97d5d6c-7302-46a0-945a-536ac18b9530',

name:'周佳华',

gender:'male',

mobile:'18021058521',

email:null,

province_id:31,

city_id:3101,

purchase_willing:0,

car_id:11,

address:'徐泾镇徐泾新区142号',

district:'青浦区',

status:'ENABLED',

create_time:1511155629093,

update_time:1511155659012

},{},{}...],

message:"ok"

}

### 文章信息

#### 获取所有文章

#### 请求地址

/porsche/articles

#### HTTP方法

GET

#### 请求参数

| 参数名  | 类型   | 是否必须 | 示例            | 描述           |
| ---- | ---- | ---- | ------------- | ------------ |
| time | 字符串  | 是    | 1511155629093 | 该时间之后的用户数据返回 |

#### 返回示例

{

code:1002,

data:[{

artcile_id:'7cb24e64-4341-4e1a-99a1-aafaaf505b6e',

title:'极致试驾',

content:'Porsche是一种完美的体验',

visit_count:2051

type:''

status:'ENABLED',

create_time:1511155629093,

},{},{}...],

message:"ok"

}



#### 获取用户操作文章的所有记录

#### 请求地址

/account/article/access/record

#### HTTP方法

GET

#### 请求参数

| 参数名    | 类型   | 是否必须 | 示例                        | 描述      |
| ------ | ---- | ---- | ------------------------- | ------- |
| userID | 字符串  | 是    | cb24e64-4341-4e1a-99a1aaf | 用户的唯一id |

#### 返回示例

{

code:1003,

data:[{

article_id:'7cb24e64-4341-4e1a-99a1-aafaaf505b6e',

title:'极致试驾',

content:'Porsche是一种完美的体验',

type:'visit'

operate_time:1511155629093

},{},{}...]

message:"ok"

}



#### 获取用户评论文章的所有记录

#### 请求地址

/account/article/comment/record

#### HTTP方法

GET

#### 请求参数

| 参数名    | 类型   | 是否必须 | 示例                        | 描述      |
| ------ | ---- | ---- | ------------------------- | ------- |
| userID | 字符串  | 是    | cb24e64-4341-4e1a-99a1aaf | 用户的唯一id |

#### 返回示例

{

code:1003,

data:[{

article_id:'7cb24e64-4341-4e1a-99a1-aafaaf505b6e',

title:'极致试驾',

content:'Porsche是一种完美的体验',

comment_time:1511155629093

author_id:'64-4341-4e1a-99a1-aafa'

},{},{}...]

message:"ok"

}