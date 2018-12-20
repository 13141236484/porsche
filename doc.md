[TOC]

| code | message   |
| ---- | --------- |
| 1009 | 你没有权限进行登录 |
| 1003 | 参数错误      |
| 1011 | 请先注册      |
| 1001 | ok        |
| 1002 | err       |
|      |           |

错误   1009

### 首页内容

#### 登录页图片

获取登录页的图片

##### 请求地址

​	```/member/loginpicture```

##### HTTP方法

```		POST```

##### 请求参数

{

```type:type```//type类型为REGISTER

}

##### 返回示例

正确

{

    code: RETCODE.OK,
    data: [
            {
                "picture_path": "/1.jpg",
                "picture_path_app": "/1.jpg"
            },
            {
                "picture_path": "/2.jpg",
                "picture_path_app": "/2.jpg"
            },
            {
                "picture_path": "/3.jpg",
                "picture_path_app": "/3.jpg"
            }
        ],      
    message: '获取图片成功'
}

#### 兴趣页图片

##### 请求地址

/member/interest

##### HTTP方法

POST

##### 请求参数

{

```type:type``` //type类型为INTEREST

}

##### 返回示例

正确

{

```
code: RETCODE.OK,
data:[
        {
            "picture_path": "/1.jpg",
            "picture_path_app": "/1.jpg"
        },
        {
            "picture_path": "/2.jpg",
            "picture_path_app": "/2.jpg"
        },
        {
            "picture_path": "/3.jpg",
            "picture_path_app": "/3.jpg"
        }
    ],
message: '获取图片成功'
```

}



#### 礼物图片

##### 请求地址

/member/present

##### HTTP方法

POST

##### 请求参数

{

```type:type```// type类型为PRESENT

}

##### 返回示例

正确

{

```
code: RETCODE.OK,
data: [
        {
            "picture_path": "/1.jpg",
            "picture_path_app": "/1.jpg"
        },
        {
            "picture_path": "/2.jpg",
            "picture_path_app": "/2.jpg"
        },
        {
            "picture_path": "/3.jpg",
            "picture_path_app": "/3.jpg"
        }
    ],  
message: '获取图片成功'
```

}



#### 首页图片

##### 请求地址

/member/home

##### HTTP方法

POST

##### 请求参数

{

```type:type```  //type 类型为HOME

}

##### 返回示例

正确

{

```
code: RETCODE.OK,
data: [
        {
            "picture_path": "/1.jpg",
            "picture_path_app": "/1.jpg"
        },
        {
            "picture_path": "/2.jpg",
            "picture_path_app": "/2.jpg"
        },
        {
            "picture_path": "/3.jpg",
            "picture_path_app": "/3.jpg"
        }
    ],  
message: '获取图片成功'
```

}



#### 会员登录

##### 请求地址

/member/signin

##### HTTP方法

POST

##### 请求参数

{

```tel:'18762671234'```

}

##### 返回示例

正确

{

```
code: 1001,
message: '登录成功'
```

}

错误

{

```
code: 1011,
message: '请先注册'
```

}

{

```
code: 1003,
message: '参数错误'
```

}

{

```
 code: 1009,   
 message: '你没有权限进行登录'
```

}

{

```
 code: 1002,  
 message: '登录失败，请重试'
```

}



#### 会员注册

##### 请求地址

/member/register

##### HTTP方法

POST

##### 请求参数

{

      tel: tel,
      gender: gender,// FEMALE  或者 MALE
      nickname: nickname,
      interest: interest,//兴趣
      present: present //礼物
}

##### 返回示例

正确

{

```
code: 1001,
message: '注册成功'
```

}

错误

{

```
code: 1003,
message: '参数错误'
```

}

{

```
 code: 1010,  
 message: '该用户已经注册'
```

}

{

```
 code: 1009,  
 message: '你没有权限进行注册'
```

}

{

```
 code: 1002,  
 message: '注册失败，请重试'
```

}

### 挚享者说

#### 上传图片文件

/fileupload

请求参数 无

返回实例

{

picture_path:picture_path

}

#### 挚享者说列表

返回挚享者说列表

##### 请求地址

/member/show/list

##### HTTP方法

POST

##### 请求参数

{

```type:type``` //类型为PROJECTION TRACK MODELSTREET

}

##### 返回示例

正确

{

```
code: RETCODE.OK,
data: [
        {
            "uuid": "4f905ee0-07d9-4200-9295-8e3892b9188c",
            "title": "title",
            "content": "content",
            "picture_path": "/picture_path.jpg",
            "nickname": "eric",
            "upvote_count": 0
        }
    ],
message: '返回挚享者说列表成功'
```

}

错误



#### 挚享者说个人详细信息

##### 请求地址

/member/show/detail

##### HTTP方法

POST

##### 请求参数

{

      article_id: article_id,
      member_id: member_id

}

##### 返回示例

正确

{

```
code: RETCODE.OK,
data: {
        "article": {
            "title": "title",
            "content": "content",
            "picture_path": "/picture_path.jpg",
            "nickname": "eric",
            "upvote_count": 0
        },
        "upvote_status": "N"
    },
message: '返回挚享者说详情成功'
```

}

#### 挚享者说文章点赞

##### 请求地址

/member/show/article/upvote

##### HTTP方法

POST

##### 请求参数

{

    article_id: article_id
}

##### 返回示例

正确

{

```
code: RETCODE.OK,
data: {
        "upvote_count": 1,
        "upvotes_tatus": "Y"
    },
message: '挚享者说点赞成功'
```

}

#### 挚享者说评论点赞

##### 请求地址

/member/show/comment/upvote

##### HTTP方法

POST

##### 请求参数

{

      comment_id: comment_id
}

##### 返回示例

正确

{

```
code: 1001,
message: '挚享者说评论点赞成功'
```

}

#### 挚享者说评论回复

##### 请求地址

/member/show/reply/comment

##### HTTP方法

POST

##### 请求参数

{

```
  article_id:article_id
  to_comment_id: to_comment_id,
  content:content,
  picture_path:picture_path,
  type:type// type 为 MEMBERSHOW
```

}

##### 返回示例

正确

{

```
code: 1001,
message: '挚享者说评论回复成功'
```

}

#### 挚享者说评论列表

##### 请求地址

/member/show/comment/list

##### HTTP方法

POST

##### 请求参数

{

```article_id: article_id```

}

##### 返回示例

正确

{

```
code: RETCODE.OK,
data: [
        {
            "avatar": null,
            "nickname": "eric",
            "uuid": "d3bfc165-081b-4fad-a492-aa3feca9a542",
            "created_time": 1513521374775,
            "user_id": "a8fbbc2c-27f0-4be7-9813-7948894c3eef",
            "content": "content",
            "picture_path": "/picture_path.jpg",
            "upvote_count": 2,
            "user_type": "MEMBER",
            "commentList": [
                {
                    "role": null,
                    "uuid": "9213368a-554e-48cd-8cc1-61bf273e963d",
                    "created_time": 1513527645774,
                    "user_id": "a8fbbc2c-27f0-4be7-9813-7948894c3eef",
                    "content": "content",
                    "picture_path": "/picture_path",
                    "user_type": "MANAGER"
                },
                {
                    "avatar": null,
                    "nickname": "eric",
                    "uuid": "bdfa58f9-7d63-4746-99ad-c205dbd1b861",
                    "created_time": 1513525765371,
                    "user_id": "a8fbbc2c-27f0-4be7-9813-7948894c3eef",
                    "content": "content",
                    "picture_path": "/picture_path",
                    "user_type": "MEMBER"
                }
            ]
        }
    ],
message: '返回挚享者说评论列表成功'
```

}



#### 挚享者说添加评论

##### 请求地址

/member/show/comment/add

##### HTTP方法

POST

##### 请求参数

{

      article_id: article_id,
      content: content,
      picture_path: picture_path,
      type: type //类型为MEMBERSHOW
}

##### 返回示例

正确

{

```
code: RETCODE.OK,
message: '评论添加成功'
```

}

#### 我要分享

##### 请求地址

/member/show/share/add

##### HTTP方法

POST

##### 请求参数

{

      title: title,
      content: content,
      picture_path: picture_path,
      type:type  //type为PROJECTION  TRACK MODELSTREET
}

##### 返回示例

正确

{

```
code: 1001,
message: '分享成功'
```

}

### 挚享FM

#### fm列表

##### 请求地址

/member/fm/list

##### HTTP方法

POST

##### 请求参数

无

##### 返回示例

正确

{

```
code: RETCODE.OK,

data:  [
        {
            "uuid": "3bd99144-eedd-4c00-94ef-1c04a7c62ba8",
            "start_time": 1512921600000,
            "end_time": 1514649600000,
            "title": "年度新车大赏 | 成就卓越非凡，驭见美好愿景",
            "second_type": "ACTIVITY",
            "address": "全国",
            "visit_count": 12,
            "join_count": null,
            "picture_path": "/backend/images/20170908/NORMAL/204866e7-b1d3-4493-9978-49d30fabfb9e@2x.jpeg",
            "created_time": 1512955705000
        }
        ],

message: '获取挚享FM列表成功'
```

}

#### fm详情

##### 请求地址

/member/fm/detail

##### HTTP方法

POST

##### 请求参数

{

```article_id:article_id```

}

##### 返回示例

正确

{

```
code: 1001,
data: {
        "uuid": "3bd99144-eedd-4c00-94ef-1c04a7c62ba8",
        "start_time": 1512921600000,
        "end_time": 1514649600000,
        "title": "年度新车大赏 | 成就卓越非凡，驭见美好愿景",
        "content": "<p><img alt=\"_2017年度新车长图文1120.jpg\" src=\"/backend/images/20170908/NORMAL/fce6f936-6e78-443b-b24f-167518c8dd4b@2x.jpg\" width=\"1000\" height=\"6936\"><br></p><p>活动：</p><p>动感设计语言是全球跑车车迷都懂的语言</p><p>也是长久以来保时捷品牌文化底蕴的潜移默化</p><p>守候相见未晚的初心是给未来留存的最珍贵的惊喜</p><p>这适用于一腔情怀和一份梦想的生长周期</p><p>保时捷的哪一款车型</p><p>是你乍见之欢，久看不厌，相见未晚的挚爱？</p><p>即刻在评论区留下你的渴望</p><p>同时前往<a href=\"http://www.porsche-fan.com/agency-trial.html\">http://www.porsche-fan.com/agency-trial.html</a></p><p>预约试驾心仪车型</p><p>挚享汇将从前 2000 位成功预约者中抽选幸运会员</p><p>寄送保时捷官方限量新年礼品</p><p>跑车之梦，我们一起实现！</p>",
        "second_type": "ACTIVITY",
        "address": "全国",
        "visit_count": 12,
        "join_count": null,
        "picture_path": "/backend/images/20170908/NORMAL/204866e7-b1d3-4493-9978-49d30fabfb9e@2x.jpeg",
        "created_time": 1512955705000
    },
message: '获取挚享FM详情成功'
```

}

#### fm对活动感兴趣

##### 请求地址

/member/fm/article/upvote

##### HTTP方法

POST

##### 请求参数

{

```article_id:article_id```

}

##### 返回示例

正确

{

```
code: RETCODE.OK,
data: {
        "upvote_count": 0,
        "upvotes_tatus": "Y"
    },
message: '获取挚享FM详情成功'
```

}

#### fm评论列表

##### 请求地址

/member/fm/comment/list

##### HTTP方法

POST

##### 请求参数

{

```article_id:article_id```

}

##### 返回示例

正确

{

```
{
    "code": "1001",
    "data": [
        {
            "avatar": null,
            "nickname": "小何",
            "uuid": "f40fff4a-4726-45c9-9714-83db23707ab2",
            "created_time": 1466403899000,
            "user_id": "262a0452-a116-4193-b3d4-a4cc2191cb0d",
            "content": "有保时捷的地方，随处都是风景线～\n          -------------来自 iPhone6s Plus ",
            "picture_path": "/backend/images/20160620/NORMAL/ca520868-1f68-4f1d-b603-fd54f36db282@2x.JPG",
            "upvote_count": null,
            "commentList": [
                {
                    "avatar": null,
                    "nickname": "eric",
                    "uuid": "6d1e6ec3-055a-4057-9677-b4c6f1d35b57",
                    "created_time": 1513530934713,
                    "user_id": "a8fbbc2c-27f0-4be7-9813-7948894c3eef",
                    "content": "content",
                    "picture_path": "/picture_path"
                }
            ]
        }
    ],
    "message": "返回挚享FM评论列表成功"
}
```

}



#### fm评论添加

##### 请求地址

/member/fm/comment/add

#####HTTP方法

POST

##### 请求参数

{

      article_id: article_id,
      content: content,
      picture_path: picture_path,//可为空
      type: type //type 为FM
}

##### 返回示例

正确

{

```
code: 1001,
message: '评论添加成功'
```

}

#### fm评论点赞

##### 请求地址

/member/fm/comment/upvote

##### HTTP方法

POST

##### 请求参数

{

```
  comment_id: comment_id
```

}

##### 返回示例

正确

{

```
code: 1001,
message: '评论点赞成功'
```

}

#### fm评论回复

##### 请求地址

/member/fm/comment/reply

##### HTTP方法

POST

##### 请求参数

{

```
  article_id:article_id
  to_comment_id: to_comment_id,
  content:content,
  picture_path:picture_path,
  type:type// type 为 FM
```

}

##### 返回示例

正确

{

```
code: 1001,
message: '评论回复成功'
```

}

#### 

#### fm申请参与

##### 请求地址

/member/fm/apply

##### HTTP方法

POST

##### 请求参数

{

     article_id: article_id
}

##### 返回示例

正确

{

```
code: 1001,
message: '申请参与成功'
```

}

### 线下活动

#### 线下活动列表

##### 请求地址

/member/offline/list

##### HTTP方法

POST

##### 请求参数

无

##### 返回示例

正确

{

```
{
    "code": "1001",
    "data": [
        {
            "uuid": "7cb24e64-4341-4e1a-99a1-aafaaf505b6e",
            "start_time": 1466352000000,
            "end_time": 1469808000000,
            "title": "挚享活动 | 秀出镜头里的保时捷",
            "second_type": "ACTIVITY",
            "address": "-",
            "visit_count": 2058,
            "join_count": null,
            "picture_path": "/backend/images/20160823/NORMAL/801e2463-a718-43a6-9cb4-4a95c70cb725@2x.jpg",
            "created_time": 1466347189000
        }
    ],
    "message": "返回线下活动列表成功"
}
```

}

#### 线下活动详情

##### 请求地址

/member/offline/detail

##### HTTP方法

POST

##### 请求参数

{

```article_id:article_id```

}

##### 返回示例

正确

{

```
    "code": "1001",
    "data": {
        "uuid": "7cb24e64-4341-4e1a-99a1-aafaaf505b6e",
        "start_time": 1466352000000,
        "end_time": 1469808000000,
        "title": "挚享活动 | 秀出镜头里的保时捷",
        "content": "<p>保时捷的哪一款车型是你的最爱？    <br></p><p>    <br></p><p>是延续了时代辉煌，糅合赛道运动感的双门双座超跑——保时捷 718 Cayman &amp; Boxster ？</p><p>    <br></p><p style=\"text-align: center;\"><img alt=\"2.jpg\" src=\"/backend/images/20160709/NORMAL/4543d5e7-67a6-40f9-b0aa-30abe04bd2be@2x.jpg\" width=\"1600\" height=\"900\">    <br></p><p style=\"text-align: center;\">    <br></p><p>是向保时捷 917 赛车致敬，被赋予现代智能科技与尖端混合动力技术的保时捷跑车 —— 保时捷 918 ？</p><p>    <br></p><p style=\"text-align: center;\"><img alt=\"3.jpg\" src=\"/backend/images/20160709/NORMAL/b590ed84-bb3e-41aa-bdb2-fbf50778a008@2x.jpg\" width=\"1600\" height=\"1200\">    <br></p><p>    <br></p><p>是秉承保时捷典型设计风格，专为驾驶乐趣和长途行驶而设计的保时捷跑车 —— 保时捷 Panamera ？    <br></p><p>    <br></p><p style=\"text-align: center;\"><img alt=\"4.jpg\" src=\"/backend/images/20160709/NORMAL/f11cf7c4-65ba-4b38-8876-11ece7df8929@2x.jpg\" width=\"1600\" height=\"900\">    <br></p><p>    <br></p><p>是传承保时捷跑车血脉，在流畅线条之下驰骋于道路间的城市 SUV —— 保时捷 Cayenne ？    <br></p><p>    <br></p><p style=\"text-align: center;\"><img alt=\"5.jpg\" src=\"/backend/images/20160709/NORMAL/8ef6b199-5c4d-4ab7-b8cc-529d4b20ef6d@2x.jpg\" width=\"1600\" height=\"900\">    <br></p><p>    <br></p><p>是彰显保时捷家族的跑车基因，融合日常实用性与赛道性能的全轮驱动式紧凑型 SUV —— 保时捷 Macan ？    <br></p><p>    <br></p><p style=\"text-align: center;\"><img alt=\"6.jpg\" src=\"/backend/images/20160709/NORMAL/4b37afae-838d-467a-b46f-5a74341f7aba@2x.jpg\" width=\"1600\" height=\"900\">    <br></p><p>    <br></p><p>还是拥有延续数十年经典外观设计，拥有辉煌赛道战绩的保时捷超跑 —— 保时捷 911 ？    <br></p><p>    <br></p><p style=\"text-align: center;\"><img alt=\"7.jpg\" src=\"/backend/images/20160709/NORMAL/b9205e85-b434-4042-9c68-ed589b5f3591@2x.jpg\" width=\"1600\" height=\"900\">    <br></p><p>    <br></p><p>    <br></p><p>保时捷挚享汇首发“挚享活动”火热开启，与保时捷一起秀出你的爱。</p><p>    <br></p><p>无论是在路边、在 4s 店，亦或者在网页上，</p><p>只要选择你最爱的保时捷车型，用最酷炫的角度与方式拍下，</p><p>上传留言区并留下一句话来形容它，</p><p>就有机会获得保时捷原装限量版 iPhone 手机保护壳，</p><p>感受卓越，发现精彩，你与保时捷超跑的缘分就此开启。</p><p>    <br></p><p>活动时间：2016 年 6 月 20 日 - 2016 年 7 月 30 日</p><p>注意事项：留言时候请注明手机型号为（ &nbsp;iPhone 6 &nbsp;、 iPhone 6 Plus 、 iPhone 6s &nbsp;、 &nbsp;iPhone 6s Plus &nbsp;），以便我们送上合适你手机的保时捷原装限量版 iPhone 手机保护壳。</p>",
        "second_type": "ACTIVITY",
        "address": "-",
        "visit_count": 2058,
        "join_count": null,
        "picture_path": "/backend/images/20160823/NORMAL/801e2463-a718-43a6-9cb4-4a95c70cb725@2x.jpg",
        "created_time": 1466347189000
    },
    "message": "返回线下活动详情成功"
```

}



#### 线下活动申请参与

##### 请求地址

/member/offline/apply

##### HTTP方法

POST

##### 请求参数

{

     article_id: article_id
}

##### 返回示例

正确

{

```
code: 1001,
message: '线下活动申请成功'
```

}

#### 返回地区接口

##### 请求地址

/member/offline/area

##### HTTP方法

POST

##### 请求参数

无

##### 返回示例

正确

{

```
code: 1001,
data:[
        {
            "pronvince_id": 11,
            "name": "北京"
        },
        {
            "pronvince_id": 12,
            "name": "天津"
        },
        {
            "pronvince_id": 13,
            "name": "河北"
        },
        {
            "pronvince_id": 14,
            "name": "山西"
        },
        {
            "pronvince_id": 15,
            "name": "内蒙古"
        },
        {
            "pronvince_id": 21,
            "name": "辽宁"
        },
        {
            "pronvince_id": 22,
            "name": "吉林"
        }
        ],
message: '返回地区接口成功'
```

}

#### 返回保时捷中心

##### 请求地址

/member/offline/center

##### HTTP方法

POST

##### 请求参数

{

```province_id:province_id```

}

##### 返回示例

正确

{

```
    "code": "1001",
    "data": [
        {
            "uuid": "c2e55ed8-f127-4f86-aadf-cb26a2aaeb2c",
            "cn_name": "北京长安保时捷中心"
        },
        {
            "uuid": "ac7821e8-f0f0-4fff-8af9-22b36301c8e7",
            "cn_name": "北京金港保时捷中心"
        },
        {
            "uuid": "72648cb0-f871-4338-b2d7-bcca63e8d178",
            "cn_name": "北京海淀保时捷中心"
        },
        {
            "uuid": "becea7a5-a457-4ab3-bfc5-51693f4abd16",
            "cn_name": "北京石景山保时捷中心"
        },
        {
            "uuid": "83c0032d-c0ae-459c-b507-d23f51ba2968",
            "cn_name": "北京亦庄保时捷中心"
        }
    ],
    "message": "返回保时捷中心接口成功"
```

}



#### 返回保时捷中心地址

##### 请求地址

/member/offline/porscheaddr

##### HTTP方法

POST

##### 请求参数

{

```porsche_center_id:porsche_center_id```

}

##### 返回实例

{

    "code": "1001",
    "data": {
        "detail_address": "北京市东城区东长安街10号长安俱乐部首层"
    },
    "message": "返回保时捷中心地址接口成功"
}



#### 经销商查询申请

##### 请求地址

/member/offline/dealer

##### HTTP方法

POST

##### 请求参数

{

      porsche_center_id: porsche_center_id
}

##### 返回示例

正确

{

```
code: 1001,
message: '返回经销商查询申请成功'
```

}



#### 试驾申请

##### 请求地址

/member/offline/drive

##### HTTP方法

POST

##### 请求参数

{

     porsche_center_id: porsche_center_id,
     trial_drive_time: trial_drive_time
}

##### 返回示例

正确

{

```
 "code": "1001",
 "message": "返回试驾申请成功"
```

}



### 极致驾客

#### 极致驾客列表

##### 请求地址

/member/driver/list

##### HTTP方法

POST

##### 请求参数

无

##### 返回示例

正确

{

```
{
    "code": "1001",
    "data": [
        {
            "uuid": "590a2726-7322-4174-8e9b-0919da082517",
            "picture_path": null,
            "resume": null,
            "nickname": "eric",
            "avatar": null
        }
    ],
    "message": "返回极致驾客列表成功"
}
```

}



#### 极致驾客详情

##### 请求地址

/member/driver/detail

##### HTTP方法

POST

##### 请求参数

无

##### 返回示例

正确

{

```
    "code": "1001",
    "data": {
        "uuid": "590a2726-7322-4174-8e9b-0919da082517",
        "member_id": "a8fbbc2c-27f0-4be7-9813-7948894c3eef",
        "picture_path": null,
        "resume": null,
        "interview_detail": null,
        "nickname": "eric",
        "avatar": null
    },
    "message": "返回极致驾客详情成功"
```

}



#### 极致驾客申请参与

##### 请求地址

/member/driver/apply

##### HTTP方法

POST

#####请求参数

无

##### 返回示例

正确

{

```
"code": "1001",
"message": "申请极致驾客已提交，请等待审核"
```

}





### 个人中心

#### 返回用户信息

##### 请求地址

/member/user/info

##### HTTP方法

POST

##### 请求参数:无

##### 返回示例

正确

{

```
    "code": "1001",
    "data": {
        "uuid": "a8fbbc2c-27f0-4be7-9813-7948894c3eef",
        "nickname": "eric",
        "username": "",
        "gender": "",
        "tel": "13964334432",
        "province": null,
        "city": null,
        "district": "",
        "detail_address": "",
        "email": "",
        "purchase_willing": "",
        "interest": "",
        "avatar": null,
        "car_name": null,
        "have_car": "",
        "car_brand": "",
        "car_model": ""
    },
    "message": "返回用户信息成功"

```

}



#### 返回省份信息

##### 请求地址

/member/user/province

##### HTTP方法

POST

##### 请求参数：无

##### 返回示例

正确

{

```
code: RETCODE.OK,
data: [
        {
            "pronvince_id": 11,
            "province_name": "北京"
        },
        {
            "pronvince_id": 12,
            "province_name": "天津"
        }
        ],
message: '返回省份信息成功'
```

}

#### 返回城市信息

##### 请求地址

/member/user/city

##### HTTP方法

POST

##### 请求参数：

{

province_id:province_id

}

##### 返回示例

正确

{

```
    "code": "1001",
    "data": [
        {
            "city_id": 1101,
            "city_name": "北京"
        }
    ],
    "message": "返回城市信息成功"
```

}



#### 返回偏爱的保时捷类型信息

##### 请求地址

/member/user/car

##### HTTP方法

POST

##### 请求参数：无

##### 返回示例

正确

{

```
    "code": "1001",
    "data": [
        {
            "car_id": 9,
            "car_name": "Boxster"
        },
        {
            "car_id": 10,
            "car_name": "Cayman"
        },
        {
            "car_id": 11,
            "car_name": "911"
        },
        {
            "car_id": 12,
            "car_name": "918 Spyder"
        },
        {
            "car_id": 13,
            "car_name": "Panamera"
        },
        {
            "car_id": 14,
            "car_name": "Macan"
        },
        {
            "car_id": 15,
            "car_name": "Cayenne"
        }
    ],
    "message": "返回保时捷车型信息成功"
```

}

#### 修改用户信息

##### 请求地址

/member/user/info/update

##### HTTP方法

POST

##### 请求参数

{

```
  nickname: nickname,
  gender: gender,
  username: username,
  province_id: province_id,
  city_id: city_id,
  district: district,
  detail_address: detail_address,
  email: email,
  purchase_willing: purchase_willing,
  car_id:car_id,
  have_car: have_car,
  car_brand:car_brand,
  car_model:car_model,
  interest:interest,
```

}

##### 返回示例

正确

{

```
code: 1001,
message: '更新个人信息成功'
```

}



#### 返回用户浏览记录

##### 请求地址

/member/user/browse

##### HTTP方法

POST

##### 请求参数:无

##### 返回示例

正确

{

```

    "code": "1001",
    "data": [
        {
            "id": 36797,
            "article_id": "afdeafcb-a193-4fef-a1b7-2b260761564a",
            "title": "荣耀卫冕，保时捷揽勒芒第 18 冠",
            "created_time": 1499675285000
        }
    ],
    "message": "获取浏览列表成功"

```

}



#### 删除浏览记录

##### 请求地址

/member/user/browse/delete

##### HTTP方法

POST

##### 请求参数

{

```
  id: id
```

}

##### 返回示例

正确

{

```
code:'1001'
message: '删除浏览记录成功'
```

}



#### 参与活动列表

##### 请求地址

/member/user/activity/list

##### HTTP方法

POST

##### 请求参数：无

##### 返回示例

正确

{

```

    "code": "1001",
    "data": [
        {
            "article_id": "7cb24e64-4341-4e1a-99a1-aafaaf505b6e",
            "title": "挚享祝福｜贺中秋月满，愿阖家团圆",
            "created_time": 1513531078593
        },
        {
            "article_id": "7cb24e64-4341-4e1a-99a1-aafaaf505b6e",
            "title": "挚享祝福｜贺中秋月满，愿阖家团圆",
            "created_time": 1513531403978
        }
    ],
    "message": "获取参与活动列表成功"

```

}



#### 返回消息列表

##### 请求地址

/member/user/notification/list

##### HTTP方法

POST

##### 请求参数：无

##### 返回示例

正确

{

```

    "code": "1001",
    "data": [
        {
            "uuid": "3c0f40a7-e9c6-4f24-bd77-a7ebe17b9123",
            "content": "欢迎加入保时捷挚享汇，开启前所未有的保时捷梦想之旅。\n点击  <a href=\" \" onclick=\"javascript:window.location.href='http://www.porsche-fan.com/welcome.html'\">www.porsche-fan.com/welcome.html</a > 了解详情，并完善个人信息，即可获得由保时捷为你定制的挚爱礼品。\n从此以梦为马，驭风而行！",
            "created_time": 1466346838000
        }
    ],
    "message": "获取通知信息列表成功"

```

}



#### 删除消息

##### 请求地址

/member/user/notification/delete

##### HTTP方法

POST

##### 请求参数

{

notification_id:notification_id

}

##### 返回示例

正确

{

```
code: RETCODE.OK,
message: '删除通知成功'
```

}



#### 留言回复

##### 请求地址

/member/user/notification/reply

##### HTTP方法

POST

##### 请求参数

{

```
  content: content
```

}

##### 返回示例

正确

{

```

    "code": "1001",
    "message": "留言成功"

```

}



#### 发帖列表

##### 请求地址

/member/user/post/list

##### HTTP方法

POST

##### 请求参数：无

##### 返回示例

正确

{

```

    "code": "1001",
    "data": {
        "send": [],
        "delete": []
    },
    "message": "获取帖子列表成功"
```

}

#### 删除发帖

##### 请求地址

/member/user/post/delete

##### HTTP方法

POST

##### 请求参数

{

```
  post_id: post_id
```

}

##### 返回示例

正确

{

```
code: 1001,
message: '删除帖子成功'
```

}





