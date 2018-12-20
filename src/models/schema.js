const Joi = require('joi');

let validate = function (input, schema) {
  let result = Joi.validate(input, schema);
  if (result.error) {
    throw result.error;
  }
};

let getPicture = Joi.object().keys({
  type: Joi.string().required()
});

let memberSignin = Joi.object().keys({
  tel: Joi.string().required().regex(/^(13|15|17|18|14|16|19)[0-9]{9}$/)
});

let memberRegister = Joi.object().keys({
  uuid: Joi.string().required(),
  tel: Joi.string().required().regex(/^(13|15|17|18|14|16|19)[0-9]{9}$/),
  gender: Joi.string().required(),
  nickname: Joi.string().required(),
  interest: Joi.string().required(),
  present: Joi.string().required(),
  firstname: Joi.string().required(),
  surname: Joi.string().required(),
  referral: Joi.string().allow('')
});

let managerSignin = Joi.object().keys({
  account: Joi.string().required(),
  password: Joi.string().required()
});

let showList = Joi.object().keys({
  type: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let showDetail = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required()
});


let showArticleUpvote = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  visit_url: Joi.string().required()
});

let showCommentUpvote = Joi.object().keys({
  member_id: Joi.string().required(),
  comment_id: Joi.string().required()
});
let showCommentList = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});
let showCommentAdd = Joi.object().keys({
  uuid: Joi.string().required(),
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});

let showReplyComment = Joi.object().keys({
  uuid: Joi.string().required(),
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  to_comment_id: Joi.string().required(),
  content: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});

let showShareAdd = Joi.object().keys({
  uuid: Joi.string().required(),
  member_id: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required(),
    //news 正文
    body_text: Joi.string().allow(''),
});

let driverDetail = Joi.object().keys({
  article_id: Joi.string().required()
});

let driverCommentUpvote = Joi.object().keys({
  member_id: Joi.string().required(),
  comment_id: Joi.string().required()
});

let driverReplyComment = Joi.object().keys({
  uuid: Joi.string().required(),
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  to_comment_id: Joi.string().required(),
  content: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});

let driverCommentList = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  offset: Joi.number().integer().required().allow(0),
  count: Joi.number().positive().integer().required()
});

let driverCommentAdd = Joi.object().keys({
  uuid: Joi.string().required(),
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});

let driverApply = Joi.object().keys({
  uuid: Joi.string().required(),
  member_id: Joi.string().required()
});

let fmDetail = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required()
});
let fmArticleUpvote = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  visit_url: Joi.string().required()
});

let fmCommentList = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  offset: Joi.number().integer().required().allow(0),
  count: Joi.number().positive().integer().allow(0)
});

let fmCommentAdd = Joi.object().keys({
  uuid: Joi.string().required(),
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});

let fmCommentReply = Joi.object().keys({
  uuid: Joi.string().required(),
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required(),
  to_comment_id: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});
let fmCommentUpvote = Joi.object().keys({
  member_id: Joi.string().required(),
  comment_id: Joi.string().required()
});

let fmApply = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required()
});

let offlineDetail = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required()
});

let offlineApply = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required()
});

let offlineCenter = Joi.object().keys({
  province_id: Joi.string().required()
});

let offlinePorscheAddr = Joi.object().keys({
  porsche_center_id: Joi.string().required()
});

let offlineDealer = Joi.object().keys({
  porsche_center_id: Joi.string().required(),
  member_id: Joi.string().required()
});

let offlineDrive = Joi.object().keys({
  porsche_center_id: Joi.string().required(),
  member_id: Joi.string().required(),
  trial_drive_time: Joi.string().required()
});


// 个人中心
let personalUserInfo = Joi.object().keys({
  member_id: Joi.string().required()
});

let personalCity = Joi.object().keys({
  province_id: Joi.string().required()
});

let personalBrowse = Joi.object().keys({
  member_id: Joi.string().required()
});
let personalBrowseDelete = Joi.object().keys({
  id: Joi.number().positive().integer().required()
});
let personalActivityList = Joi.object().keys({
  member_id: Joi.string().required()
});
let notificationList = Joi.object().keys({
  member_id: Joi.string().required()
});
let notificationRead = Joi.object().keys({
  notification_id: Joi.string().required(),
  member_id: Joi.string().required()
});
let notificationDelete = Joi.object().keys({
  notification_id: Joi.string().required()
});
let notificationReply = Joi.object().keys({
  member_id: Joi.string().required(),
  content: Joi.string().required()
});
let postList = Joi.object().keys({
  member_id: Joi.string().required()
});
let postDelete = Joi.object().keys({
  post_id: Joi.string().required()
});



//用户管理
let registerUserList = Joi.object().keys({
  nickname: Joi.string().allow(''),
  tel: Joi.string().allow(''),
  complete: Joi.string().allow(''),
  purchase_willing: Joi.string().allow(''),
  car_id: Joi.number().positive().integer().allow(''),
  willing_change_start_time: Joi.string().allow(''),
  willing_change_end_time: Joi.string().allow(''),
  interest_id: Joi.number().positive().integer().allow(''),
  offset: Joi.number().integer().required().allow(0),
  count: Joi.number().positive().integer().required()
});

let registerUserDetail = Joi.object().keys({
  member_id: Joi.string().required()
});

let userNotificationList = Joi.object().keys({
  member_id: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});
let userNotificationPush = Joi.object().keys({
  uuid: Joi.string().required(),
  manager_id: Joi.number().positive().integer().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required()
});

let invitedUserList = Joi.object().keys({
  tel: Joi.string().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let invitedUserAdd = Joi.object().keys({
  username: Joi.string().required(),
  tel: Joi.string().required(),
  referral: Joi.string().required().allow('')
});

let userUpdateList = Joi.object().keys({
  nickname: Joi.string().allow(''),
  tel: Joi.string().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let userUpdateDetail = Joi.object().keys({
  id: Joi.number().positive().integer().required()
});
let activityCreate = Joi.object().keys({
  uuid: Joi.string().required(),
  user_id: Joi.number().positive().integer().required(),
  first_type: Joi.string().required(),
  second_type: Joi.string().required(),
  title: Joi.string().required(),
  picture_path: Joi.string().required(),
  content: Joi.string().required(),
  // address: Joi.string().required(),
  start_time: Joi.string().required(),
  end_time: Joi.string().required(),
  city: Joi.string().required(),
    //news
    small_title: Joi.string().allow(''),
    sponsor: Joi.string().allow(''),
    maximum: Joi.number().positive().integer().allow(0),
    start_registration_time: Joi.string().allow(0),
    end_registration_time: Joi.string().allow(0),
    notes: Joi.string().allow(''),
    popup_status: Joi.string().allow(''),
    present : Joi.number().positive().integer().allow(0),
    // gzq
    set_join_count: Joi.number().allow(0),
    set_maximum: Joi.number().allow(0),

    is_start_signup: Joi.string().allow(''),
    sign_tips: Joi.string().allow(''),
    allurban_data: Joi.string().allow(''),

    place: Joi.number().allow(0),
    field_date: Joi.number().allow(0),
    wechat_number: Joi.number().allow(0),
    email: Joi.number().allow(0),
    mailing_address: Joi.number().allow(0),
    personnel_surname: Joi.number().allow(0),
    // personnel_name: Joi.number().allow(0),
    // personnel_phone: Joi.number().allow(0),
    intentional_vehicle: Joi.number().allow(0),

    all_site_limit: Joi.string().allow(''),
});

let activityList = Joi.object().keys({
  first_type: Joi.string().allow(''),
  second_type: Joi.string().allow(''),
  title: Joi.string().allow(''),
  city: Joi.string().allow(''),
  start_time: Joi.string().allow(''),
  end_time: Joi.string().allow(''),
  stay_at_top: Joi.number().allow(''),
  is_show: Joi.number().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let activityUserList = Joi.object().keys({
  article_id: Joi.string().required(),
  nickname: Joi.string().allow(''),
  tel: Joi.string().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let activityCommentList = Joi.object().keys({
  article_id: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let activityEdit = Joi.object().keys({
    article_id: Joi.string().required(),
    user_id: Joi.number().positive().integer().required(),
    first_type: Joi.string().required(),
    second_type: Joi.string().required(),
    title: Joi.string().required(),
    picture_path: Joi.string().required(),
    content: Joi.string().required(),
    // address: Joi.string().required(),
    start_time: Joi.string().required(),
    end_time: Joi.string().required(),
    city: Joi.string().required(),
    //news
    small_title: Joi.string().allow(''),
    sponsor: Joi.string().allow(''),
    maximum: Joi.number().positive().integer().allow(0),
    start_registration_time: Joi.string().allow(0),
    end_registration_time: Joi.string().allow(0),
    notes: Joi.string().allow(''),
    popup_status: Joi.string().allow(''),
    present: Joi.number().positive().integer().allow(0),
    // gzq
    set_join_count: Joi.number().allow(0),
    set_maximum: Joi.number().allow(0),

    is_start_signup: Joi.string().allow(''),
    sign_tips: Joi.string().allow(''),
    allurban_data: Joi.string().allow(''),
    // status
    place: Joi.number().allow(0),
    field_date: Joi.number().allow(0),
    wechat_number: Joi.number().allow(0),
    email: Joi.number().allow(0),
    mailing_address: Joi.number().allow(0),
    personnel_surname: Joi.number().allow(0),
    // personnel_name: Joi.number().allow(0),
    // personnel_phone: Joi.number().allow(0),
    intentional_vehicle: Joi.number().allow(0),

    all_site_limit: Joi.string().allow(''),
});

let activityDelete = Joi.object().keys({
  article_id: Joi.string().required()
});

let reviewArticle = Joi.object().keys({
  article_id: Joi.string().required()
});

let dealerCenter = Joi.object().keys({
  province_id: Joi.number().positive().integer().required()
});

let dealerQueryUserList = Joi.object().keys({
  start_time: Joi.string().allow(''),
  end_time: Joi.string().allow(''),
  porsche_center_id: Joi.string().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let dealerQueryUserDetail = Joi.object().keys({
  member_id: Joi.string().required()
});

let dealerQueryMsgList = Joi.object().keys({
  member_id: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let dealerQueryMsgPush = Joi.object().keys({
  uuid: Joi.string().required(),
  manager_id: Joi.number().positive().integer().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required()
});

let driveUserList = Joi.object().keys({
  start_time: Joi.string().allow(''),
  end_time: Joi.string().allow(''),
  trial_drive_start_time: Joi.string().allow(''),
  trial_drive_end_time: Joi.string().allow(''),
  porsche_center_id: Joi.string().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let driveUserDetail = Joi.object().keys({
  member_id: Joi.string().required()
});

let driveMsgList = Joi.object().keys({
  member_id: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let driveMsgPush = Joi.object().keys({
  uuid: Joi.string().required(),
  manager_id: Joi.number().positive().integer().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required()
});

let notificationPush = Joi.object().keys({
  manager_id: Joi.number().positive().integer(),
  content: Joi.string().required()
});

let feedbackMsgList = Joi.object().keys({
  start_time: Joi.string().allow(''),
  end_time: Joi.string().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let replyMsg = Joi.object().keys({
  uuid: Joi.string().required(),
  manager_id: Joi.number().positive().integer().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required()
});

let pushMsgList = Joi.object().keys({
  member_id: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let userDetail = Joi.object().keys({
  member_id: Joi.string().required()
});
//news
let fregistrationAdd = Joi.object().keys({
    uuid: Joi.string().required(),
    member_id: Joi.string().required(),
    article_id: Joi.string().required(),
    surname: Joi.string().required(),
    name: Joi.string().required(),

    place: Joi.string().allow(''),
    created_time: Joi.string().allow(''),
    wechat_number: Joi.string().allow(''),
    tel_phone: Joi.string().allow(''),
    email: Joi.string().allow(''),
    synergetic_surname: Joi.string().allow(''),
    sunergetic_tel: Joi.string().allow(''),
    interestedModels: Joi.string().allow(''),
    province: Joi.string().allow(''),
    city: Joi.string().allow(''),
    detailed_address: Joi.string().allow('')
    
});
let registrationMember = Joi.object().keys({
    member_id: Joi.string().required(),
});

let duanxinMember = Joi.object().keys({
    phone_tel: Joi.number().required(),
    code: Joi.string().required()
});

// gzq
let checkBrand = Joi.object().keys({
  brand_name: Joi.string().required()
});

let showOrHide = Joi.object().keys({
  article_id: Joi.string().required()
});

let reviewShowList = Joi.object().keys({
  second_type: Joi.string().allow(''),
  nickname: Joi.string().allow(''),
  title: Joi.string().allow(''),
  stay_at_top: Joi.number().allow(''),
  start_time: Joi.string().allow(''),
  end_time: Joi.string().allow(''),
  status: Joi.string().allow(''),
  offset: Joi.number().required(),
  count: Joi.number().required()
});

let recordUrl = Joi.object().keys({
  url: Joi.string().required(),
  source: Joi.string().required(),
  member_id: Joi.string().required()
});



module.exports = {
  validate: validate,
  getPicture: getPicture,
  memberSignin: memberSignin,
  memberRegister: memberRegister,
  managerSignin: managerSignin,
  showList: showList,
  showDetail: showDetail,
  showArticleUpvote: showArticleUpvote,
  showCommentUpvote: showCommentUpvote,
  showCommentList: showCommentList,
  showCommentAdd: showCommentAdd,
  showReplyComment: showReplyComment,
  showShareAdd: showShareAdd,
  driverDetail: driverDetail,
  driverCommentUpvote: driverCommentUpvote,
  driverReplyComment: driverReplyComment,
  driverCommentList: driverCommentList,
  driverCommentAdd: driverCommentAdd,
  driverApply: driverApply,
  fmDetail: fmDetail,
  fmArticleUpvote: fmArticleUpvote,
  fmCommentList: fmCommentList,
  fmCommentAdd: fmCommentAdd,
  fmCommentReply: fmCommentReply,
  fmCommentUpvote: fmCommentUpvote,
  fmApply: fmApply,
  offlineDetail: offlineDetail,
  offlineApply: offlineApply,
  offlineCenter: offlineCenter,
  offlinePorscheAddr: offlinePorscheAddr,
  offlineDealer: offlineDealer,
  offlineDrive: offlineDrive,
  personalUserInfo: personalUserInfo,
  personalCity: personalCity,
  personalBrowse: personalBrowse,
  personalBrowseDelete: personalBrowseDelete,
  personalActivityList: personalActivityList,
  notificationList: notificationList,
  notificationRead: notificationRead,
  notificationDelete: notificationDelete,
  notificationReply: notificationReply,
  postList: postList,
  postDelete: postDelete,
  registerUserList: registerUserList,
  registerUserDetail: registerUserDetail,
  userNotificationList: userNotificationList,
  userNotificationPush: userNotificationPush,
  invitedUserList: invitedUserList,
  invitedUserAdd: invitedUserAdd,
  userUpdateList: userUpdateList,
  userUpdateDetail: userUpdateDetail,
  activityCreate: activityCreate,
  activityList: activityList,
  activityUserList: activityUserList,
  activityCommentList: activityCommentList,
  activityEdit: activityEdit,
  activityDelete: activityDelete,
  reviewArticle: reviewArticle,
  dealerCenter: dealerCenter,
  dealerQueryUserList: dealerQueryUserList,
  dealerQueryUserDetail: dealerQueryUserDetail,
  dealerQueryMsgList: dealerQueryMsgList,
  dealerQueryMsgPush: dealerQueryMsgPush,
  driveUserList: driveUserList,
  driveUserDetail: driveUserDetail,
  driveMsgList: driveMsgList,
  driveMsgPush: driveMsgPush,
  notificationPush: notificationPush,
  feedbackMsgList: feedbackMsgList,
  replyMsg: replyMsg,
  pushMsgList: pushMsgList,
  userDetail: userDetail,
    //news
    fregistrationAdd: fregistrationAdd,
    registrationMember: registrationMember,
    duanxinMember: duanxinMember,
    //gzq
    checkBrand: checkBrand,
    showOrHide: showOrHide,
    reviewShowList: reviewShowList,
    recordUrl: recordUrl
};
