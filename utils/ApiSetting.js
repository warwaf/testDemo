const baseAddr = 'https://mtq.hucai.com/base'
const basediyUrl = 'https://mtq.hucai.com/diy'
// const videoHucai = 'https://video.hucai.com/'
const videoHucai = 'https://image.hucai.com/'

// 云相册UAT环境 ↓
var Host = 'https://mtquat.hucai.com:9233', 
    mmdHost = "http://192.172.9.26:8582 ",
    saasHost = "http://192.172.62.232:8098",
    localHost = ""
// 云相册UAT环境 ↑

// 云相册正式环境 ↓
// var Host = 'https://mtq2.hucai.com', 
//     mmdHost = "https://d.api.xm520.com",
//     localHost = "http://192.172.50.44:8582",
//     saasHost = "http://120.55.243.5:8182"
// 云相册正式环境 ↑

if (__wxConfig.accountInfo.appId == 'wx5030c4b2c3c30e86') {
    Host = 'https://mtqcshi.hucai.com'
    //Host = 'http://192.172.50.44'
    // Host = 'http://192.172.50.63:8181'
    // Host = 'http://192.172.50.92:8181'
    // Host = 'http://192.172.50.115:8181'
    // Host = 'http://192.172.50.32:8181'
    // Host = 'http://192.172.50.44:8181'
    mmdHost = "https://mtqcshi.hucai.com" // "http://192.172.9.88:8582"
    localHost = "http://192.172.50.44:8582"
    saasHost = "http://192.172.9.21:8181"
}
const apiSettings = {}


apiSettings.Host = Host
// 获取元旦活动点赞
apiSettings.GetActivityLikeInfo = `${Host}/activity/ar/arLikesInfo/`
// 根据活动id查询视频信息
apiSettings.getVideoInfoById = `${Host}/activity/ar/getArLikesByArId`

//获取活动报名状态
apiSettings.GetSignUp = `${Host}/discover/ActivityAppointment/checkState`
//集福-获取
apiSettings.GetBlessCount = 'https://ar.hucai.com/room/bless/read'
//集福-修改
apiSettings.ModifyBlessCount = 'https://ar.hucai.com/room/bless/write'

//2020-12 -- 活动海报配置
apiSettings.ActivityBanenr = `/iot/venue/config/get`
// 2020-12 -- 会场图片列表 http://192.172.50.44:8181
apiSettings.ScenesList = `${{Host}}/iot/image/list`


//获得sessionKey
// apiSettings.GetSessionKey = 'https://ar.hucai.com/room/login/login'
//解码
// apiSettings.GetUserPhone = 'https://ar.hucai.com/room/login/decrypt'

//获取user_id
apiSettings.GetUser = `${basediyUrl}/wechat/Login/get_user_by_openid`
//修改红包金额
// apiSettings.ModifyRedPacket = `${baseAddr}/api/MobileIoT/CustomerRedPacketAdd`
apiSettings.ModifyRedPacket = `/balance/getRedPacket`
//查询红包金额
apiSettings.GetRedPacket = `/wfa/user/balance/get`
// apiSettings.GetRedPacket = `${baseAddr}/api/MobileIoT/getCustomerRed`

//获得首页照片
apiSettings.GetCRoomPhotos = `${videoHucai}/api/fileapi/GetCRoomPhotos`
//获得图片数量总和
apiSettings.GetCRoomPhotosTotal = `${videoHucai}/api/fileapi/GetCRoomPhotosTotal`
//删除图片
apiSettings.DeleteCPhotos = `${videoHucai}/api/fileapi/DeleteCPhotos`
//获得服务器令牌
apiSettings.GetCAccessToken = `${videoHucai}/api/fileapi/GetCAccessToken`

//用户自己的头像
apiSettings.GetFaceByGroupFaceId = `/faceInfo/getFaceByGroupFaceId`
//人脸识别--万人迷
apiSettings.ListMostAttrative = `/faceInfo/listMostAttrative`
//人脸识别--全部的
apiSettings.Getfacelist = `/faceInfo/listAllByActivityId`
//人脸识别--推荐人员列表
apiSettings.ListRecommendationByActivityIdAndGroupFaceId = `/faceInfo/listRecommendationByActivityIdAndGroupFaceId`
//人脸识别--其他图片列表/faceInfo/listOthersImageByActivityId
apiSettings.ListOthersImageByActivityId = `/faceInfo/listOthersImageByActivityId`
//人脸识别--根据groupFaceId 列出相关图片
// apiSettings.ListImageByGroupFaceId = `/faceInfo/listImageDetailByFaceId`
apiSettings.ListImageByGroupFaceId = `/wfa/faceInfo/listImageDetailByPersistedFaceId`
//人脸识别--根据图片地址获取头像(faceid）
apiSettings.Getfaceid = `/faceInfo/listFaceAnalysicInfoByImgUrl`

//活动--列出活动默认标签
apiSettings.ListDefaultTags = `/discover/listDefaultTags`
//活动--根据等级列出发现活动
apiSettings.ListLevel = `/discover/listLevel`
//活动--列出二级专题
apiSettings.ListSecondLevel = '/discover/listSecondLevel'
//活动--根据 discoverID 获得动态
apiSettings.GetMovement = '/movement/list'
//活动--获取全部动态
apiSettings.GetAllMovement = '/movement/listAll'
//活动--删除动态
apiSettings.DiscoveryDelect = '/movement/delete'
//活动--获取发现最热列表
apiSettings.GetMovementByPraise = '/movement/getHot'
//活动--新增动态
apiSettings.MovementAdd = `/movement/add`
//活动--获得动态详情
apiSettings.GetMovementDetail = '/movement/getMovementDetail'
//活动--动态点赞
apiSettings.MovementPraise = '/movement/praise'
//活动--获取动态点赞数
apiSettings.GetMovementPraise = '/movement/praisList'
//活动--增加动态
apiSettings.AddMovementHot = '/moveMentHot'
//活动 -- 获取预约历史记录
apiSettings.GetRecord = '/wfa/order/getStore'
//活动 -- 抽奖 -- 当前中将人员
apiSettings.GetWinnerList = '/wfa/prizeDraw/getPrizeDerail'
//活动 -- 抽奖 -- 获取所有符合资格抽奖的人员
apiSettings.GetAllAttend = '/wfa/prizeDraw/getAccordUserList'
//活动 -- 抽奖 -- 开奖
apiSettings.ExcuteLottery = '/wfa/prizeDraw/getPrizeDraw'
//活动 -- 抽奖 -- 查看个人抽奖历史记录
apiSettings.GetLotteryRecord = '/wfa/prizeDraw/getHistory'
//活动 -- 抽奖 -- 查看房间活动历史记录
apiSettings.GetRoomActivityRecord = '/wfa/prizeDraw/getMongDBEventHistory'
//活动 -- 抽奖 -- 保存活动
apiSettings.SaveActivityRule = '/admin/event/save'
//活动 -- 抽奖 -- 获取个人中奖记录
apiSettings.GetPersonalRecord = '/wfa/prizeDraw/getHistory'
//活动 -- 抽奖 -- 获取单次活动中奖信息
apiSettings.GetSingleActivityRecord = '/wfa/prizeDraw/getEventHistory'
//活动 -- 抽奖 -- 获取相关活动列表
apiSettings.GetRelatedActivity = '/wfa/prizeDraw/getEventIng'
//活动 -- 抽奖 -- 开始/结束活动
apiSettings.ChangeActivityState = '/wfa/prizeDraw/endPrize'
//活动 -- 拉新 -- 保存
apiSettings.SaveInviteInfo = '/admin/user/refresh/save'
//活动 -- 请柬 -- 列表
apiSettings.GetInvitationList = '/wfa/event/invitation/getTemplateDetail'
//活动 -- 请柬 -- 创建记录
apiSettings.GetInvitationRecord = '/wfa/event/invitation/getInvitationHistory'
//活动 -- 首页 -- 风格列表
apiSettings.getStyleList = '/discover/listStyle'
//活动 -- 列表 -- 预约
apiSettings.RecordArrange = '/discover/cloudAlbumAppointment/save'

apiSettings.getDiscoverDetail = '/discover/listDetail'

//照片房间 -- 首页广告
apiSettings.GetAds = '/wfa/event/listValid'
//照片房间 -- 创建活动房间
apiSettings.CreateActivityRoom = '/activityRoom/save'
//照片房间 -- 登录房间记录插入
apiSettings.SaveHistory = '/activityRoom/saveBrowingHistory'
//照片房间 -- 获得房间配置项
apiSettings.GetRoomConfig = 'https://ar.hucai.com/room/configuration/getConfig'
//照片房间 -- 获取历史记录
apiSettings.GetUseEventHistroy = '/activityRoom/list'
//照片房间 -- 获取我的相册列表
apiSettings.GetSelfEventHistroy = '/activityRoom/selfList'
//照片房间 -- 获取共享相册列表
apiSettings.GetShareEventHistroy = '/activityRoom/shareList'
apiSettings.updateActivityInfo = '/activityRoom/update'
//照片房间 -- 获得房间信息（水印信息、活动时间、房间号等）
apiSettings.GetCouponActivity = '/activityRoom/getByActivityId'
//照片房间 -- 瀑布流
apiSettings.GetPhotos = '/activityRoom/gePhotosByActivityId'
//照片房间 -- 最热
apiSettings.GetPraiseRank = '/praise/rank2'
//照片房间 -- 增加热度
apiSettings.AddPicHot = '/picHot'
//照片房间 -- 查看进入过当前房间的所有人信息
apiSettings.GetUserByRoom = '/user/getUserListByActivityId'
//照片房间 -- 判断房间号是否存在于改用户历史记录中
apiSettings.JudgePermission = '/user/decide'
//照片房间 -- 校验密码
apiSettings.VerifyPassword = '/activityRoom/decidePower'
//照片房间 -- 获取时间轴列表
apiSettings.GetPhotosGroupByDate = '/activityRoom/axisImageDetail'
//照片房间 -- 获取指定某一天的图片
apiSettings.GetPhotosByDate = '/activityRoom/getAxisImageDetail'
//照片房间 -- 获取配置信息
apiSettings.GetToolsConfig = '/wfa/styleConfig/get'
//照片房间 -- 模糊查询成员
apiSettings.SearchMember = '/wfa/activityRoom/fuzzyQueryUser'
//照片房间 -- 踢出成员
apiSettings.DeleteMember = '/wfa/activityRoom/deleteUser'
//照片房间 -- 保存海报信息
apiSettings.savePosterInfo = '/wfa/fun/activityRoom/savePosterDetail'
//分组 -- 保存分组
apiSettings.saveGroup = '/imageDetail/classification/save'
//分组 -- 删除分组
apiSettings.deleteGroup = '/imageDetail/classification/delete'
//分组 -- 查询分组
apiSettings.getGroup = '/imageDetail/classification/get'
//分组 -- 更新分组
apiSettings.updateGroup = '/imageDetail/classification/update'
//照片房间 -- 查询是否展示订阅
apiSettings.getSubscribeStatus = '/mtq/api/activityRoom/newphotoPush'

//上传 -- 保存上传图片信息
apiSettings.SaveImageDetail = '/imageDetail/save'
//上传 -- 内容校验
apiSettings.ContentVerify = '/audit/content'
//上传 -- 图片校验
apiSettings.ImageVerify = '/audit/pic'
//上传 -- 图片校验2
apiSettings.Pics = '/audit/pics'

//照片详情 -- 获取图片点赞、标签信息
apiSettings.GetImageInfo = '/imageDetail/getAllImageDetailObeject'
//照片详情 -- 点赞
apiSettings.ModifyPraise = '/praise/option'
//照片详情 -- 获取点赞
apiSettings.GetPraise = '/praise/list'
//照片详情 -- 分页查询评论
apiSettings.GetComment = '/comment/list'
//照片详情 -- 提交评论
apiSettings.SaveComment = '/comment/save'
//照片详情 -- 收藏
apiSettings.SaveCollection = '/imageCollection/save'
//照片详情 -- 取消收藏
apiSettings.CancleCollection = '/imageCollection/cancle'
//照片详情 -- 查看收藏
apiSettings.GetCollection = '/imageCollection/list'
//照片详情 -- 删除上传图片信息
apiSettings.DeleteImageDetail = '/imageDetail/delete'
//照片详情 -- 获得图片上传者信息
apiSettings.GetUploderInfo = '/imageDetail/list'

//用户 -- 根据unionid查询手机号
apiSettings.GetUserPhoneByUnionId = '/user/get'
//用户 -- 根据UnionId获取用户上传图片
apiSettings.GetImageList = '/imageDetail/listAllByUnionId'
//用户 -- 保存用户信息
apiSettings.Updatauser = `${Host}/user/update`
//用户 -- 获取SessionKey
apiSettings.GetSessionKey = '/wxApp/getSecretKey'
//用户 -- 解码
apiSettings.GetUserPhone = '/wxApp/decrypt'
//用户 -- 获得哪些人关注了我
apiSettings.GetFans = '/follows/list'
//用户 -- 根据unionid列出动态
apiSettings.ListByUnionId = '/movement/listByUnionId'
//用户 -- 关注
apiSettings.AddFollows = '/follows/add'
//用户 -- 判断是否关注
apiSettings.JudgeFollow = '/follows/judge'
//用户 -- 获取我关注了哪些人
apiSettings.GetFollows = '/follows/list'
//用户 -- 取消关注
apiSettings.CancleFollow = '/follows/remove'
//用户 -- 获取当前用户在当前房间下的faceId
apiSettings.GetFaceIdByActivityId = '/wfa/userFace/get'
//用户 -- 退出房间
apiSettings.QuitAlbum = '/activityRoom/secedeActivityRoom'

//注册 -- 用于红包
apiSettings.Registered = `${baseAddr}/api/MobileIoT/CustomerRegister`
//注册 -- 发送手机验证码
apiSettings.SendMessage = `${baseAddr}/api/MobileIoT/SendMessage`

//看美照 -- 获取首页列表
// apiSettings.GetListByphomeNo = '/maggieAblum/getRoomListByphoneNo'
apiSettings.GetListByphomeNo = '/maggieAblum/getWaterfallByActivityId'
//看美照 -- 保存评论
apiSettings.SaveEvaluate = '/maggieAblum/save'
//看美照 -- 获取列表
apiSettings.GetOrderList = '/maggieAblum/getFilmListByPhoneNo'
//看美照 -- 获取房间所有点赞者头像
apiSettings.GetParticipant = '/praise/listAllWithActivityId'
//看美照 -- 根据点赞者筛选
apiSettings.GetImagesViaUnionId = '/praise/listImageDetail'
//看美照 -- 吐槽，获取默认标签
apiSettings.GetBeautyTags = '/wfa/discover/getDefaultProperties'
//看美照 -- 获取吐槽数据
apiSettings.GetBeautyComment = '/wfa/discover/getMaggieCountDetail'
//看美照 -- 保存吐槽
apiSettings.SaveBeautyComment = '/wfa/discover/saveMaggieCountDetail'
//看美照 -- 获取产品列表
apiSettings.GetBeautyProducts = '/wfa/beauty/product/get'
//看美照 -- 获取产品详情
apiSettings.GetBeautyProduct = '/wfa/beuaty/productDetail/get'
//看美照 -- 评论产品
apiSettings.SaveBeautyEvaluate = '/wfa/beuaty/pic/evaluate'


//智慧相册 -- 选片
apiSettings.pickBeautyProduct = '/wfa/beuaty/pic/pick'
//智慧相册 -- 获取套版片
apiSettings.GetSpecialImage = '/maggieAblum/getImages'
//智慧相册 -- 放入回收站
apiSettings.InRecycle = '/wfa/smart/pic/pick'
//智慧相册 -- 完成太片
apiSettings.ComfirmPick = '/wfa/smart/pic/comfirmPick'
//智慧相册 -- 检查是否提交
apiSettings.CheckComfirmStatus = '/wfa/smart/pic/comfirmPickStatus'
//智慧相册 -- 根据房间号获取门店信息
apiSettings.getStoreByActivityId = '/movement/getStoreByActivityId'
//智慧相册
apiSettings.checkUserPhone1 = '/activityRoom/createSmartActivityRoom'


//地址管理 -- 获取地址 
apiSettings.GetAddress = '/wfa/order/address/get' 
// apiSettings.GetAddress = '/userAddress/get'
// 地址管理 --  新增地址
apiSettings.AddAddress = '/wfa/order/address/add'
// 地址管理 -- 编辑地址 
apiSettings.EditAddress = '/wfa/order/address/edit'
// 地址管理 -- 设置默认地址
apiSettings.SetDefaultAddress = '/wfa/order/address/setDefault'

//地址管理 -- 保存地址
apiSettings.SaveAddress = '/userAddress/save'
//地址管理 -- 删除地址
apiSettings.DeleteAddress = '/userAddress/delete'

// 消息列表
apiSettings.newsList = '/wfa/photosManage/getNews'
// 消息状态更新
apiSettings.updateNews = '/wfa/photosManage/updateNews'
//消息管理 -- 收集formId
apiSettings.collectFormId = '/admin/photosManage/saveFromId'

//DIY -- 创建DIY
apiSettings.CreateDiy = 'https://diy.hucai.com/MobileDIY/GoMtqCreate'
//DIY -- 获取商品列表
apiSettings.GetProductList = `${videoHucai}/api/TemplateApi/GetCombineTemplates`
//DIY -- 获取DIY列表
apiSettings.GetWorkList = `${videoHucai}/api/diyapi/GetWorkList`
//DIY -- 获取DIY订单详情 
apiSettings.GetDiyInfo = '/wfa/order/getPartInfo'
// apiSettings.GetDiyInfo = '/wfa/diy/order/getPartInfo'
//DIY -- 查询运费/价格
apiSettings.CalcCost = `/wfa/order/shippingFee/get`
// apiSettings.CalcCost = `${baseAddr}/api/WechatPhoto/CalcOrderAmt`
//DIY -- 领取优惠券
apiSettings.GetCoupon = `${baseAddr}/api/MobileIoT/GetRedPacket`
//DIY -- 查询优惠券
apiSettings.QueryCoupon = `${baseAddr}/api/WechatPhoto/GetVoucherList`
//DIY -- 冲印房间创建
apiSettings.CreateRoomForCy = '/wfa/fun/activityRoom/save'

//订单 -- 创建订单 
apiSettings.CreateOrder = `/wfa/order/diy/create`
// apiSettings.CreateOrder = `${baseAddr}/api/WechatPhoto/CreatedOrder`
//订单 -- 获取订单列表
apiSettings.GetSelfOrderList = `/wfa/order/getList`
// apiSettings.GetSelfOrderList = `${baseAddr}/api/OrderRelated/GetOrderStatus`
//订单 -- 获取订单详情
apiSettings.GetOrderDetail = `/wfa/order/detail`
// apiSettings.GetOrderDetail = `${baseAddr}/api/OrderRelated/TrackOrder`

//订单 -- 获取订单详情中单条商品信息
apiSettings.GetGoosDetail = `${baseAddr}/api/WechatPhoto/GetCustomerPartList`
//订单 -- 提交评论
apiSettings.UpdateEvaluate = `${baseAddr}/api/Evaluate/PhotographicScoreInfo`
//订单 -- 保存订单号
apiSettings.SaveOrderNo = '/wfa/diy/saveInternalOrder'
//订单 -- 看美照订单 查询场景
apiSettings.GetScenes = '/wfa/appointment/list'

//预约摄影师 -- 保存信息
apiSettings.SaveAdvancePhotos = '/photoGrapher/saveAdvancePhotos'
//预约摄影师 -- 读取
apiSettings.GetAdvancePhotos = '/photoGrapher/getAdvancePhotos'
apiSettings.GetAdvancePhotosCount = '/photoGrapher/getAdvancePhotosCount'
//预约摄影师 -- 读取摄影师列表
apiSettings.GetPhotographer = `${baseAddr}/api/Evaluate/SelectPhotographer`

//消息推送 -- 收集formId

// diy - 通过workid 获取sku
apiSettings.GetPartInfo = `/wfa/diy/order/getPartInfo`

// 新接口 - 领取优惠券
apiSettings.GetConpon = `/wfa/order/coupon/gain`;
// 新接口 - 优惠券列表
apiSettings.ConponList = `/wfa/order/coupon/getList`;
// 回去微信token
apiSettings.GetAccessToken = '/wfa/wxApp/getAccessToken'

apiSettings.getQaList = '/wfa/fun/answerQuestions/getAnswerQuestionsService'
//提现
apiSettings.withdraw = '/wxApp/withdraw'

//电商相册
apiSettings.checkUserPhone = '/wfa/activityRoom/mall/authority'
//保存渠道
apiSettings.saveUserChannel = '/wfa/visitHistory/save'

// 获取门店列表
apiSettings.getStoreList = '/discover/getShopList'
// 获取咨询状态
apiSettings.getCheckAppoiment = '/discover/cloudAlbumAppointment/checkAppoiment'
// 获取商品列表
apiSettings.getProductsList = '/discover/getProductsList'
// 获取商品明细
apiSettings.getProductDetail = '/discover/getProductDetail'
// 获取地区列表
apiSettings.getAreasList = "/discover/areasList"
// 获取风格类型列表
apiSettings.getCommonProperties = "/discover/getCommonProperties"

apiSettings.getRoomQrCode = '/wxApp/getQrcode'

// 调用中台获奖信息-生产
apiSettings.GainActivityCouponInfoList = 'https://api.xm520.com/API/OffcialWebActivity/GainActivityCouponInfoList'
// 调用中台获奖信息-测试
// apiSettings.GainActivityCouponInfoList = 'http://192.172.9.33:8188/API/OffcialWebActivity/GainActivityCouponInfoList'

// 梦想起航活动-查询是否获一等奖
apiSettings.getAdwardsList = "/discover/getAdwardsList"

apiSettings.getSign = '/mtq/api/getSign'

apiSettings.getAppointmentStat = '/discover/ActivityAppointment/checkState'

// 鲜檬会员-创建订单
apiSettings.createPOrder = '/member/order/create'
// 鲜檬会员-卡券发放(获取卡券数据)
apiSettings.getWxCardParam = "/wxCard/genAddCardParam"
// 鲜檬会员-记录卡券领券
apiSettings.updateWxCard = "/wxCard/updateWxCardStatus"

// 硬订单-套版片确认
apiSettings.filmStateConfirm = "/wfa/layout/confirm"

// 销售订单-查询支付方式接口
apiSettings.queryPaymentMethod = `${mmdHost}/order/queryPaymentMethod`
// 修改支付金额或方式
apiSettings.updatePaymentMethod = `${mmdHost}/order/updatePaymentMethod`

// 龙存管-二维码支付
apiSettings.lcg_singlePay = `${mmdHost}/payment/lcg/singlePay`
// 龙存管-多次支付
apiSettings.lcg_multiPay = `${mmdHost}/payment/lcg/multiPay`

// 会员兑换
apiSettings.verification = `${Host}/coupon/verification`

// 获取门店信息
apiSettings.getStoreInfo = `${Host}/store/getStoreByJobId`

// 秒杀页面初始化
apiSettings.getActivityInit = `${Host}/activity/ms/init`

// 秒杀提交
apiSettings.getActivitysmt = `${Host}/activity/ms/submit`

// 秒杀提交
apiSettings.getActivityQuery = `${Host}/activity/ms/query`

// 秒杀活动 - 用户报名状态查询
apiSettings.getActivityMsState = `${Host}/activityMs/getActivityMsState`
// 秒杀活动 - 保存用户报名信息
apiSettings.saveActivityMsRegistration = `${Host}/activityMs/saveActivityMsRegistration`
// 查询秒杀成功者资料
apiSettings.queryInfoData = `${Host}/activityMs/getActivityMsResultInfo`
// 秒杀成功完善资料
apiSettings.getImproveInfo = `${Host}/activityMs/improveInfo`
// 获取点赞总数
apiSettings.getLikedSumNum = `${Host}/activityMs/getLikedSumNum`
// 点赞
apiSettings.getLiked = `${Host}/activityMs/liked`

// BD活动 - 报名
apiSettings.bdSignup = `${Host}/activity/bd/reg`
// BD活动 - 券是否可用
apiSettings.bdCheckCoupon = `${Host}/activity/bd/code`
// 秒杀 & BD - 查询报名信息
apiSettings.getSignupInfo = `${Host}/activityMs/getActivityMsRegistration`
// 查询预约是否已保存-跳转
apiSettings.getActivityMsOrder = `${Host}/activityMs/getActivityMsOrder`
// 预约详情-跳转
apiSettings.getMsReservations = `${Host}/activityMs/getMsReservations`
// 取消预约
apiSettings.getCalendarCancel = `${saasHost}/calendar/record/cancel`
// 预约详情
apiSettings.getCalendarDetail = `${saasHost}/calendar/record/find`
// 修改预约
apiSettings.getModifyCalendar = `${saasHost}/calendar/record/update`
// 是否可预约
apiSettings.getCanBeReservations = `${Host}/activityMs/canBeReservations`

// ID 换取 房间号
apiSettings.getActivityId = `/trasfer/getActivityId`

// 预约信息-获取报名信息
apiSettings.getReservations = `${Host}/activityMs/getReservations`
// 预约信息-预约日历
apiSettings.mtqFindList = `${Host}/activityMs/mtqFindList`
// 预约信息-保存
apiSettings.saveReservations = `${Host}/activityMs/reservationsUpdate`

// 套版片 - 备注
apiSettings.addRemarkByFileId = `${Host}/photograph/addRemarkByFileId`
apiSettings.addGlobalRemark = `${Host}/wfa/remark/workId/add`

//ar活动详情
apiSettings.ARLIKESVIDEO = `${Host}/activity/ar/getArLikesVideo`
//创建ar活动
apiSettings.saveArLikes = `${Host}/activity/ar/saveArLikes`
//用户点赞
apiSettings.addArLikesThumb = `${Host}/activity/ar/addArLikesThumb`
//用户扫描分享二维码
apiSettings.getArLikesByArId = `${Host}/activity/ar/getArLikesByArId`
// 生成二维码海报
apiSettings.getQrcode = `${Host}/wxApp/getQrcode`
// 查询活动是否结束
apiSettings.getEndFlag = `${Host}/activity/ar/getEndFlag`
// 领券是否弹窗
apiSettings.getActivityCoupon = `${Host}/activity/ta/getActivityCoupon`
// 领取优惠券
apiSettings.takeActivityTaCoupon = `${Host}/activity/ta/takeActivityTaCoupon`
export default apiSettings