import { isLogin, safeBtoa, isExpired, isRegistered,downloadImage } from '../../../utils/util.js'
import { Detail } from '../detail/detail-model.js'
import { Home } from '../home/home-model.js'
import { Checkin } from '../checkin/checkin-model.js'
import apiSettings from '../../../utils/ApiSetting'

var detailModel = new Detail()
var homeModel = new Home()

var app = getApp()
var deviceInfo = wx.getSystemInfoSync()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        picId: '',
        data: [],
        currentIndex: 0,
        authorInfo: {},
        commentArr: [],
        faceInfo: false,
        height: '100vh',
        praiseArr: 0,
        praiseBtnStat: 0,
        starBtnStat: 0,
        commentContent: '',
        commentCount: 0,
        follow: [],
        sessionStat: false,
        placeholder: '来了怎么能不回复',
        replyTo: 0,
        follow: [],
        commentError: false,
        isEmpty: false,
        entrys: [],
        waterMark: '',
        commentPageNo: 2,
        isLoading: false,
        passwordSession: false,
        password:'',
        guidance: false,
        anonymous: false,
        userInfo: {
            mobileNo: ""
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.data.picId = options.image
        app.globalData.roomInfo.room_no = options.room_no

        try {
            await homeModel.getUnionid()
            app.saveUserChannel(`相册分享`)
        } catch (error) {
            return this.setData({
                anonymous: true
            })
        }
        
        try {
            const res = await homeModel.getUserInfoByUnionId()
            const _res = res ? res.result : {}
            console.log("try getUserPhoneByUnionId >>", _res, "globalData: ", app.globalData)
            let globalData = app.globalData
            console.log("uninonid: ", (!globalData.unionid || (globalData.unionid && globalData.unionid == "")))
            console.log("nickName: ", (!_res.nickName || (_res.nickName && _res.nickName == "")))
            console.log("avatarUrl: ", (!_res.avatarUrl || (_res.avatarUrl && _res.avatarUrl == "")))
            if (
                (!globalData.unionid || (globalData.unionid && globalData.unionid == "")) || 
                (!_res.nickName || (_res.nickName && _res.nickName == "")) || 
                (!_res.avatarUrl || (_res.avatarUrl && _res.avatarUrl == ""))
            ) {
                wx.redirectTo({
                    url: '/pages/common/userinfo/userinfo',
                })
                return
            }
        } catch (error) {
            console.log("getUserInfoByUnionId error>>", error)
            wx.redirectTo({
                url: '/pages/common/userinfo/userinfo',
            })
            return this.setData({
                anonymous: true
            })
        }
        this.initPage()
    },

    async initPage(){
        var data = await homeModel.getActivityInfo(app.globalData.roomInfo.room_no)
        //设置水印
        console.log(data.watermarkImg, 'data.watermarkImg')
        if(data.watermarkImg){
            // app.globalData.waterMark = data.watermarkImg.slice(data.watermarkImg.indexOf('mtq'))
            let str = data.watermarkImg.substring(0,5)
            if (str=='https') {
                app.globalData.waterMark = data.watermarkImg.replace('https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/', '')
            } else {
                app.globalData.waterMark = data.watermarkImg.replace('http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/', '')
            }
            console.log(app.globalData.waterMark, 'app.globalData.waterMark')
        }
        this.setData({
            waterMark: safeBtoa(app.globalData.waterMark + '?x-oss-process=image/resize,P_12')
        })
        //密码不为空情况下校验权限
        if(data.password){
            homeModel.judgePermission().then(res => {
                if(!res){
                    //权限通过，不校验密码
                    this.setData({
                        passwordSession: true
                    })
                }else{
                    homeModel.addRecord()
                    //新手指引
                    if(!wx.getStorageSync('guidance-detail')){
                        this.setData({
                            guidance: 1
                        })
                        wx.setStorageSync('guidance-detail', 1)
                    }
                }
            })
        }
        
        //获取图片收藏状态、点赞列表、评论列表第一页、上传者信息
        detailModel.getImageInfo(this.data.picId).then(res => {

            if (res.imageDetail.picUrl == undefined){
                this.setData({
                    isEmpty: true
                })
                return
            }

            var height = Math.floor(deviceInfo.windowWidth / res.imageDetail.picWidth * res.imageDetail.picHeight) + 46 + 'px'

            this.setData({
                height,
                data: [res.imageDetail],
                starBtnStat: res.imageCollection == 1 ? 2 : 0,
                praiseArr: res.userLoginInfo,
                authorInfo: res.imageDetail,
                commentArr: res.comment,
                commentCount: res.commentCount
            })
            //判断当前用户是否为上传者
            if (res.imageDetail && res.imageDetail.unionId == app.globalData.unionid) {
                var deleteList = wx.getStorageSync('deleteList').split(',')
                if (deleteList.indexOf(this.data.picId) !== -1) {
                    this.setData({
                        isAuthor: true,
                        isDelete: true
                    })
                } else {
                    this.setData({
                        isAuthor: true,
                    })
                }
            } else {
                detailModel.isFollow(res.imageDetail.unionId).then(res => {
                    this.setData({
                        btnText: res.result ? '已关注' : '关注'
                    })
                })
            }
            if (!app.globalData.userInfo.mobileNo) {
                app.globalData.userInfo.mobileNo = ""
            }
            this.setData({
                userInfo: app.globalData.userInfo
            })
        })

        detailModel.getEntry().then(list => {
            this.setData({
                entrys: list
            })
        })
        

        /**
         * 根据图片地址获取人脸信息
         */
        detailModel.getFaceInfo(this.data.picId).then(res => {
            if (res.code == 200 && res.pic_id == this.data.picId) {
                var data = res.result
                data.forEach((item,index) => {
                    if(item.groupFaceId == 0){
                        res.result.splice(index,1)
                    }
                })
                if (data.length > 0) {
                    this.setData({
                        faceInfo: data
                    })
                } else {
                    this.setData({
                        faceInfo: false
                    })
                }
            } else {
                this.setData({
                    faceInfo: false
                })
            }
        })
    },
    getPhoneNumber: function(e){
        detailModel.getUnionid().then(() => {
            wx.request({
                url: apiSettings.Host + apiSettings.GetUserPhone,
                method: 'POST',
                data: {
                    encryptedDataStr: e.detail.encryptedData,
                    ivStr: e.detail.iv,
                    keyBytesStr: app.globalData.session_key
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: res => {
                    if (res.data.code !== 200 || !res.data.result.phoneNumber){
                        wx.showToast({
                            title: '获取手机号失败，请重试',
                            icon: 'none'
                        })
                        return
                    }
                    app.globalData.userInfo.mobileNo = res.data.result.phoneNumber
                    wx.request({
                        url: apiSettings.Updatauser,
                        data: {
                            unionId: app.globalData.unionid,
                            mobileNo: res.data.result.phoneNumber
                        },
                        header: {
                            "Content-Type": "application/json",
                            accessToken: app.globalData.mtq_token
                        },
                        method: 'POST',
                        success: data => {
                            wx.request({
                                url: apiSettings.Host + apiSettings.GetUserPhoneByUnionId,
                                method: 'POST',
                                header: { "Content-Type": "application/x-www-form-urlencoded" },
                                data: {
                                    openid: app.globalData.unionid
                                },
                                success: userinfo => {
                                    if (userinfo.result) {
                                        app.globalData.userInfo = userinfo.result
                                    } 
                                    this.triggerEvent('confirmEvent', {})
                                }
                            })
                        }
                    })
                    this.setData({
                        userInfo: app.globalData.userInfo
                    })
                }
            })
        })
    },
    onReachBottom: function () {
        //获取更多评论
        if (!this.data.isLoading && this.data.commentCount > this.data.commentArr.length) {
            this.setData({
                isLoading: true
            })
            let currentPic = this.data.data[this.data.currentIndex]
            detailModel.getComment(currentPic.picId, this.data.commentPageNo).then(res => {
                this.setData({
                    isLoading: false
                })
                //防止加载途中用户切换了图片
                if (res.result[0].topicId == currentPic.picId) {
                    this.setData({
                        commentPageNo: this.data.commentPageNo + 1,
                        commentArr: this.data.commentArr.concat(res.result)
                    })
                }
            })
        }
    },

    /**
     * 展示大图
     */
    showBig() {
        // if (!isLogin()) return
        var url = this.data.data[this.data.currentIndex].picUrl + '?x-oss-process=image/resize,h_1600,limit_0'
        wx.previewImage({
            urls: [url],
        })
    },

    /**
     * 下载原图
     */
    download() {
        isRegistered().then(res => {
            if(!res) return 
            if (!isLogin()) return
            // var url = this.data.data[this.data.currentIndex].picUrl.replace('http://', 'https://') + '?x-oss-process=image/watermark,image_' + this.data.waterMark + ',t_80,g_se,x_10,y_10'
            var url = this.data.data[this.data.currentIndex].picUrl.replace('http://', 'https://')
            downloadImage(url)
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var photoInfo = this.data.data[this.data.currentIndex]
        detailModel.addPicHot(photoInfo.picId, 10)
        console.log("button share >>", getApp())
        return {
            title: getApp().globalData.activityInfo.activity_name || `【分享照片】 已有${getApp().globalData.activityInfo.browseCount}次浏览`,
            path: `/pages/album/share/share?image=${photoInfo.picId}&room_no=${app.globalData.roomInfo.room_no}&discoverId=${app.globalData.globalStoreId}`,
            imageUrl: photoInfo.thumbnailUrl
        }
    },

    /**
     * 点赞
     */
    praise() { 
        isRegistered().then(res => {
            if (this.data.praiseBtnStat !== 0) {
                wx.showToast({
                    icon: 'none',
                    title: '您已点赞'
                })
                return
            }
            var imageInfo = this.data.data[this.data.currentIndex]
            detailModel.updatePrise(imageInfo.picId, imageInfo.picUrl).then(res => {
                if (res.code == 200) {
                    var pic = wx.getStorageSync('praiseArr')
                    var picArr = pic ? pic.split(',') : []
                    picArr.push(imageInfo.picId)
                    wx.setStorageSync('praiseArr', picArr.join(','))
                    this.data.praiseArr.push(app.globalData.userInfo)
                    this.setData({
                        praiseBtnStat: 1,
                        praiseArr: this.data.praiseArr
                    })
                    setTimeout(() => {
                        this.setData({
                            praiseBtnStat: 2
                        })
                    }, 700)
                } else {
                    this.setData({
                        praiseBtnStat: 2
                    })
                    wx.showToast({
                        icon: 'none',
                        title: res.message
                    })
                }
            })
        })
    },

    bindCommentInput(e) {
        this.data.commentContent = e.detail.value
    },

    /**
     * 收藏
     */
    collect() {
        isRegistered().then(res => {
            if (!res) return
            var imageInfo = this.data.data[this.data.currentIndex]
            detailModel.saveCollection(imageInfo.picId, imageInfo.thumbnailUrl).then(res => {
                if (res.code == 200) {
                    var pic = wx.getStorageSync('collectionArr')
                    var picArr = pic ? pic.split(',') : []
                    picArr.push(imageInfo.picId)
                    wx.setStorageSync('collectionArr', picArr.join(','))

                    this.setData({
                        starBtnStat: 1
                    })

                    setTimeout(() => {
                        this.setData({
                            starBtnStat: 2
                        })
                    }, 700)
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '添加收藏失败'
                    })
                }
            })
        })

    },

    /**
     * 提交评论
     */
    submitComment(e) {
        if (e.currentTarget.dataset.text) {
            this.data.commentContent = e.currentTarget.dataset.text
        }
        if (this.data.commentContent.length == 0) {
            wx.showToast({
                title: '请输入评论内容',
                icon: 'none'
            })
            return
        }
        wx.showLoading({
            title: '提交中'
        })
        detailModel.collectFormId(e.detail.formId)
        var imageInfo = this.data.data[this.data.currentIndex]
        detailModel.saveCommnet(imageInfo.picId, this.data.commentContent, this.data.replyTo, imageInfo.unionId).then(res => {
            wx.hideLoading()
            if (res.code == 200) {
                this.data.commentPageNo = 2
                detailModel.getComment(this.data.picId, 1).then(res => {
                    this.setData({
                        commentArr: res.result
                    })
                })
                this.setData({
                    sessionStat: false
                })
                wx.showToast({
                    title: '评论成功',
                    icon: 'none'
                })
            } else if (res.code == 500) {
                this.setData({
                    commentError: true,
                    sessionStat: false
                })
            }

        })
    },

    /**
     * 显示对话框
     */
    showSession() {
        isRegistered().then(res => {
            if(!res) return
            wx.pageScrollTo({
                scrollTop: 3000,
                duration: 0,
                success: () => {
                    this.setData({
                        sessionStat: true,
                        replyTo: 0,
                        commentContent: ''
                    })
                }
            })          
        })

    },

    /**
     * 隐藏对话框
     */
    hideSession() {
        this.setData({
            sessionStat: false
        })
    },

    /**
     * 回复
     */
    toReply(e) {
        isRegistered().then(res => {
            if (!res) return
            this.setData({
                sessionStat: true,
                replyTo: e.currentTarget.dataset.id,
                placeholder: `@${e.currentTarget.dataset.nickname}`
            })
        })
    },

    cancle() {
        this.setData({
            commentError: false
        })
    },

    toHome(e){
        detailModel.collectFormId(e.detail.formId)
        wx.redirectTo({
            url: `/pages/album/home/home?room_no=${app.globalData.roomInfo.room_no}`
        })
    },

    /**
     *  查找某个人的照片
     */
    searchwho: function (e) {
        app.globalData.searchInfo = this.data.faceInfo
        app.globalData.searchInfo.groupFaceId = e.currentTarget.dataset.id
        wx.redirectTo({
            url: `/pages/album/search/searchresult/searchresult?activityId=${app.globalData.roomInfo.room_no}&groupFaceId=${e.currentTarget.dataset.groupfaceid}`,
        })
    },

    /**
     * 关注
     */
    toFollow() {
        if (!this.data.authorInfo.unionId || !app.globalData.unionid) {
            return
        }

        if (this.data.btnText == '已关注') {
            detailModel.cancleFollow(this.data.authorInfo.unionId).then(res => {
                wx.showToast({
                    title: '取消关注成功',
                    icon: 'none'
                })
                this.setData({
                    btnText: '关注'
                })
            })
        } else {
            detailModel.addFollow(this.data.authorInfo.unionId).then(res => {
                wx.showToast({
                    title: '关注成功',
                    icon: 'none'
                })
                this.setData({
                    btnText: '已关注'
                })
            })
        }
    },

    stop(){
        return
    },

    /**
     * 删除
     */
    toDelete() {
        this.setData({
            deleteComfirm: true
        })
    },

    delete() {
        var fileName = this.data.data[this.data.currentIndex].picId
        detailModel.getAccessToken().then(() => {
            //外部删除图片
            detailModel.deletePhoto(fileName).then(() => {
                var deleteList = wx.getStorageSync('deleteList').split(',')
                deleteList.push(fileName)
                wx.setStorageSync('deleteList', deleteList.join(','))
                //内部删除图片
                detailModel.deleteImageInfo(fileName).then(() => {
                    this.setData({
                        btnText: '已删除',
                        isDelete: true,
                        deleteComfirm: false
                    })
                })
            })
        })

    },

    cancleDelete() {
        this.setData({
            deleteComfirm: false
        })
    },

    bindKeyInput(e){
        this.data.password = e.detail.value
    },

    closePasswordSession(){
        wx.switchTab({
            url: '/pages/album/checkin/checkin'
        })
    },
    completeChange(){
        //校验密码
        homeModel.verifyPassword(this.data.password).then(result => {
            if(result){
                //插入历史记录
                homeModel.addRecord()
                //新手指引
                if(!wx.getStorageSync('guidance-detail')){
                    this.setData({
                        guidance: 1
                    })
                    wx.setStorageSync('guidance-detail', 1)
                }
                this.setData({
                    passwordSession: false
                })
            } else {
                wx.showToast({
                    title: '密码错误,请重新输入',
                    icon: 'none'
                })
            }
        })
    },
    /**
     * 新手指导  下一步
     */
    nextStep(){
        this.setData({
            guidance: false
        })
    },

    userInfoEvent(){
        this.setData({
            anonymous: false
        })
        this.initPage()
    }
})