# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.18)
# Database: pors
# Generation Time: 2017-12-28 05:39:26 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table tb_address
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_address`;
-- 地址表
CREATE TABLE `tb_address` (
  `id` int(10) NOT NULL,  
  `name` varchar(64) NOT NULL,  -- 省份或者城市名字
  `oid` varchar(64) DEFAULT NULL,  -- 显示顺序ID   
  `parent_id` int(10) DEFAULT NULL, -- 父ID
  `py` varchar(64) NOT NULL,   -- 省份或者城市名字拼音简称
  `pinyin` varchar(64) NOT NULL, -- 省份或者城市名字拼音
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_address` WRITE;
/*!40000 ALTER TABLE `tb_address` DISABLE KEYS */;



/*!40000 ALTER TABLE `tb_address` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_admin
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_admin`;
-- 管理员表
CREATE TABLE `tb_admin` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT, -- 管理员id
  `account` varchar(100) DEFAULT NULL,  -- 管理员账号名
  `salted_password` varchar(200) DEFAULT NULL,  -- 管理员密码
  `role` varchar(100) DEFAULT NULL,   -- 管理员角色
  `status` varchar(20) DEFAULT NULL,  -- 管理员状态，暂时未用到，沿用老数据库
  `created_time` bigint(20) DEFAULT NULL, -- 创建时间
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_admin` WRITE;
/*!40000 ALTER TABLE `tb_admin` DISABLE KEYS */;

INSERT INTO `tb_admin` (`id`, `account`, `salted_password`, `role`, `status`, `created_time`)
VALUES
	(1,'admin','3a0047a0c7c2eb76ea35fa1b4f247e9d8ff3f65fe7fd24e7832636a0256b4fce +)(.','管理员',NULL,NULL);

/*!40000 ALTER TABLE `tb_admin` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_advice
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_advice`; 
-- 留言表
CREATE TABLE `tb_advice` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `member_id` varchar(64) NOT NULL,  -- 会员独立ID
  `content` varchar(2048) NOT NULL,  -- 会员留言内容
  `created_time` bigint(20) NOT NULL,-- 会员留言时间
  PRIMARY KEY (`id`),
  KEY `member_id_idx` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_article
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_article`;
-- 挚享者说 挚享FM 线下活动 极致驾客 表(统称为文章)
CREATE TABLE `tb_article` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(200) DEFAULT NULL, -- 文章唯一ID
  `user_id` varchar(200) DEFAULT NULL,-- 用户ID
  `title` varchar(500) DEFAULT NULL, -- 文章标题
  `content` text,                    -- 文章内容
  `picture_path` varchar(100) DEFAULT NULL, -- 图片路径
  `start_time` bigint(20) DEFAULT NULL, -- 活动(挚享FM，线下活动)开始时间 
  `end_time` bigint(20) DEFAULT NULL,-- 活动(挚享FM，线下活动)结束时间 
  `address` varchar(200) DEFAULT NULL,-- 活动地址
  `created_time` bigint(20) DEFAULT NULL,-- 活动创建时间
  `status` varchar(20) DEFAULT NULL, -- 活动状态(REVIEW和ENABLED)
  `first_type` varchar(20) DEFAULT NULL, -- 第一大类  MEMBERSHOW(挚享者说)，FM(挚享FM)，OFFLINE(线下活动)，DRIVER(极致驾客)
  `second_type` varchar(20) DEFAULT NULL,-- 第二大类  MEMBERSHOW-PROJECTION(光影放映厅)，TRACK(燃情赛道)，MODELSTREET(911模型街)；FM-CONTENT(文章详情) REVIEW(活动回顾) ACTIVITY(活动参与)；OFFLINE-OFFLINE；DRIVER-DRIVER
  `city` varchar(50) DEFAULT NULL,-- 活动城市 
  `visit_count` int(11) DEFAULT NULL,-- 访问浏览人数
  `join_count` int(11) DEFAULT NULL,-- 参与人数
  `upvote_count` int(11) DEFAULT NULL,-- 投票(点赞，感兴趣)人数 
  `user_type` varchar(20) DEFAULT NULL,-- 用户类型--会员，管理员(MEMBER,MANAGER)
  `stay_at_top` int(0) DEFAULT '0',-- 是否置顶 1-为置顶 0-为不置顶
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_article_comment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_article_comment`;
-- 挚享者说 挚享FM 线下活动 极致驾客 评论列表(文章评论列表）
CREATE TABLE `tb_article_comment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(200) DEFAULT NULL,  -- 评论唯一ID
  `article_id` varchar(200) DEFAULT NULL, -- 文章ID
  `user_id` varchar(200) DEFAULT NULL, -- 用户ID
  `content` text,                      -- 评论内容
  `to_comment_id` varchar(200) DEFAULT NULL, -- 评论的父ID
  `created_time` bigint(20) DEFAULT NULL,-- 评论创建时间
  `picture_path` varchar(1024) DEFAULT NULL, -- 评论图片
  `type` varchar(20) DEFAULT NULL, -- 评论的文章类型(文章中的第二大类)
  `status` varchar(20) DEFAULT NULL,-- 评论状态
  `upvote_count` int(11) DEFAULT NULL,-- 评论点赞数
  `user_type` varchar(20) DEFAULT NULL, -- 用户类型--会员，管理员(MEMBER,MANAGER)
  `comment_level` varchar(20) DEFAULT NULL,-- 评论级别分为一级二级(FIRST,SECOND)
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_car
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_car`;
-- 保时捷车型
CREATE TABLE `tb_car` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,-- 保时捷车ID
  `name` varchar(50) DEFAULT NULL, -- 保时捷车名
  `status` varchar(20) DEFAULT NULL,-- 保时捷车状态
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_car` WRITE;
/*!40000 ALTER TABLE `tb_car` DISABLE KEYS */;

INSERT INTO `tb_car` (`id`, `name`, `status`)
VALUES
	(9,'Boxster','ENABLED'),
	(10,'Cayman','ENABLED'),
	(11,'911','ENABLED'),
	(12,'918 Spyder','DISABLED'),
	(13,'Panamera','ENABLED'),
	(14,'Macan','ENABLED'),
	(15,'Cayenne','ENABLED');

/*!40000 ALTER TABLE `tb_car` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_comment_upvote
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_comment_upvote`;
-- 评论点赞记录(为避免重复点赞)
CREATE TABLE `tb_comment_upvote` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `comment_id` varchar(200) DEFAULT NULL,-- 评论ID
  `member_id` varchar(200) DEFAULT NULL,-- 会员ID
  `created_time` bigint(20) DEFAULT NULL,-- 评论点赞创建时间
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_dealer
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_dealer`;
-- 经销商查询 试驾预约
CREATE TABLE `tb_dealer` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `porsche_center_id` varchar(200) DEFAULT NULL,-- 保时捷中心ID
  `member_id` varchar(200) DEFAULT NULL,-- 会员ID
  `trial_drive_time` bigint(20) DEFAULT NULL, -- 申请试驾时间
  `type` varchar(20) DEFAULT NULL,  -- 类型两类  CONTACT(经销商查询) TRIAL(预约试驾)
  `status` varchar(10) DEFAULT NULL,  -- 经销商查询 试驾预约状态
  `created_time` bigint(20) DEFAULT NULL, -- 创建时间
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


# Dump of table tb_member
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_member`;
-- 会员
CREATE TABLE `tb_member` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(200) DEFAULT NULL,  -- 会员唯一ID
  `nickname` varchar(100) DEFAULT NULL,-- 会员昵称
  `gender` varchar(10) DEFAULT NULL,-- 性别(MALE FEMALE)
  `tel` varchar(20) DEFAULT NULL,-- 电话号码
  `username` varchar(50) DEFAULT NULL,-- 会员姓名
  `province_id` varchar(20) DEFAULT NULL,-- 会员所在省份ID
  `city_id` varchar(20) DEFAULT NULL,-- 会员所在城市ID
  `district` varchar(50) DEFAULT NULL,-- 会员所在区域
  `detail_address` varchar(100) DEFAULT NULL,-- 会员详细地址
  `email` varchar(100) DEFAULT NULL,-- 会员email
  `purchase_willing` varchar(5) DEFAULT NULL,-- 会员购买意愿
  `interest` varchar(200) DEFAULT NULL,-- 会员兴趣爱好
  `present` varchar(200) DEFAULT NULL, -- 会员可以领取的礼物
  `created_time` bigint(20) DEFAULT NULL,-- 会员注册时间
  `updated_time` bigint(20) DEFAULT NULL,-- 会员信息更新时间
  `avatar` varchar(100) DEFAULT NULL, -- 会员头像地址
  `car_id` varchar(200) DEFAULT NULL,-- 偏爱的保时捷车型ID
  `purchase_willing_updated_time` bigint(20) DEFAULT NULL,-- 购买意愿更新时间
  `referral` varchar(30) DEFAULT NULL,-- 会员来源
  `have_car` varchar(10) DEFAULT NULL,-- 会员是否有座驾(N,Y两种)
  `car_brand` varchar(50) DEFAULT NULL,-- 座驾品牌
  `car_model` varchar(50) DEFAULT NULL,-- 座驾型号
  `is_received_present` varchar(10) DEFAULT NULL,-- 会员是否已领取礼物
  `status` varchar(50) DEFAULT NULL,-- 会员是否已注册(REGISTERED,UNREGISTERED)两种
  `firstname` varchar(200) DEFAULT NULL,-- 名
  `surname` varchar(200) DEFAULT NULL,-- 姓
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_member_action
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_member_action`;
-- 成员对于"文章"的行为
CREATE TABLE `tb_member_action` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` varchar(200) DEFAULT NULL,-- 文章ID
  `member_id` varchar(200) DEFAULT NULL,-- 会员ID
  `action` varchar(100) DEFAULT NULL,-- 会员的行为VISIT(浏览),UPVOTE(文章点赞),POST(打铁)
  `created_time` bigint(20) DEFAULT NULL,-- 创建时间
  `review_status` varchar(20) DEFAULT NULL,-- 审核状态(Y,N两种状态)
  `exsit_status` varchar(20) DEFAULT NULL,-- 存在状态(SEND,DELETE两种状态)
  `visit_url` varchar(300) DEFAULT NULL,-- 浏览文章的url
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_member_login_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_member_login_history`;
-- 会员登录历史记录
CREATE TABLE `tb_member_login_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `member_id` varchar(200) DEFAULT NULL, -- 会员ID
  `created_time` bigint(20) DEFAULT NULL,-- 会员登录时间
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_member_update_info_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_member_update_info_history`;
-- 会员信息更新历史记录
CREATE TABLE `tb_member_update_info_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `member_id` varchar(200) DEFAULT NULL,-- 会员ID
  `origin_data` varchar(500) DEFAULT NULL,-- 会员原始数据
  `updated_data` varchar(500) DEFAULT NULL,-- 会员更新后的数据
  `created_time` bigint(20) DEFAULT NULL,-- 创建时间
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_notification
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_notification`;
-- 管理员通知消息
CREATE TABLE `tb_notification` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(200) DEFAULT NULL,-- 通知消息ID
  `admin_id` int(11) DEFAULT NULL,-- 管理员ID
  `member_id` varchar(200) DEFAULT NULL,-- 会员ID
  `content` text,                  -- 通知消息内容
  `created_time` bigint(20) DEFAULT NULL,-- 创建时间
  `is_read` varchar(5) DEFAULT NULL, -- 会员是否阅读
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tb_picture
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_picture`;

CREATE TABLE `tb_picture` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `picture_path` varchar(200) DEFAULT NULL, -- PC端图片地址
  `picture_order` int(11) DEFAULT NULL,   -- 图片顺序
  `type` varchar(30) DEFAULT NULL,  -- 图片类型(WELCOME--欢迎页,HOME--主页,INTEREST--兴趣,PRESENT-礼物)
  `status` varchar(20) DEFAULT NULL,-- 状态
  `picture_path_app` varchar(200) DEFAULT NULL,-- APP端图片路径
  `content` varchar(100) DEFAULT NULL,-- 文字说明
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tb_picture` WRITE;
/*!40000 ALTER TABLE `tb_picture` DISABLE KEYS */;

INSERT INTO `tb_picture` (`id`, `picture_path`, `picture_order`, `type`, `status`, `picture_path_app`, `content`)
VALUES
	(1,'/welcome1.jpg',1,'WELCOME','Y','/welcomeapp1.jpg',NULL),
	(2,'/welcome2.jpg',2,'WELCOME','Y','/welcomeapp2.jpg',NULL),
	(3,'/welcome3.jpg',3,'WELCOME','Y','/welcomeapp3.jpg',NULL),
	(4,'/home1.jpg',1,'HOME','Y','/homeapp1.jpg',NULL),
	(5,'/home2.jpg',2,'HOME','Y','/homeapp2.jpg',NULL),
	(6,'/home3.jpg',3,'HOME','Y','/homeapp3.jpg',NULL),
	(9,'/01.png',1,'INTEREST','Y',NULL,'旅行摄影'),
	(10,'/02.png',2,'INTEREST','Y',NULL,'品牌故事'),
	(11,'/03.png',3,'INTEREST','Y',NULL,'选配指南'),
	(12,'/04.png',4,'INTEREST','Y',NULL,'性能测评'),
	(13,'/05.png',5,'INTEREST','Y',NULL,'赛车运动'),
	(14,'/06.png',6,'INTEREST','Y',NULL,'售后关怀'),
	(15,'/07.png',7,'INTEREST','Y',NULL,'人车生活'),
	(16,'/08.png',8,'INTEREST','Y',NULL,'驾驶体验'),
	(17,'/09.png',9,'INTEREST','Y',NULL,'前沿科技'),
	(18,'/present1.jpg',1,'PRESENT','Y',NULL,'礼物1'),
	(19,'/present2.jpg',2,'PRESENT','Y',NULL,'礼物2');

/*!40000 ALTER TABLE `tb_picture` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tb_porsche_center
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tb_porsche_center`;
-- 保时捷中心
CREATE TABLE `tb_porsche_center` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(200) DEFAULT NULL,-- 保时捷中心唯一ID
  `cn_name` varchar(200) DEFAULT NULL,-- 保时捷中心名称
  `province_id` varchar(20) DEFAULT NULL,-- 保时捷所在省份ID
  `city_id` varchar(20) DEFAULT NULL,-- 保时捷所在城市ID
  `detail_address` varchar(200) DEFAULT NULL,-- 保时捷详细地址
  `en_name` varchar(200) DEFAULT NULL,-- 保时捷中心英文名称
  `postal_code` varchar(20) DEFAULT NULL,-- 邮编
  `tel` varchar(50) DEFAULT NULL,-- 联系方式
  `email` varchar(200) DEFAULT NULL, -- 邮箱
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
