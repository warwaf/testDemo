// pages/album/detail/detail.js
import { isLogin, safeBtoa, isExpired, downloadImage,formatTime1,sharePyq } from '../../../utils/util.js'
import { Detail } from './detail-model.js'
import apiSettings from '../../../utils/ApiSetting'

var detailModel = new Detail()

var deviceInfo = wx.getSystemInfoSync()
const app = getApp()

var start = 0, end = 0, trunPageable = true

Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: (new Date(formatTime1(new Date()))).getTime(),
        data: [],
        currentIndex: 0,
        authorInfo: {},
        commentArr: [],
        commentCount: 0,
        faceInfo: false,
        height: '100vh',
        praiseArr: 0,
        praiseBtnStat: 0, 
        starBtnStat: 0, 
        commentContent: '',
        follow: [],
        sessionStat: false,
        placeholder: '来了怎么能不回复',
        btnText: '关注',
        isDelete: false,
        replyTo: 0,
        commentError: false,
        isAuthor: false,
        deleteComfirm: false,
        waterMark: '',
        entrys: [],
        swiperStat: false,
        commentPageNo: 2,
        isLoading: false,
        guidance: false,
        isSuperAdmin: false,
        showOrigin: false,
        isEmpty: true,
        userInfo: {
            mobileNo: ""
        },
        showStorePng: false,
        // 2020-12 新活动
        newActivity: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // sharePyq()//朋友圈
        wx.hideShareMenu({})
        this.setData({
            isSuperAdmin: app.globalData.activityInfo.unionId == app.globalData.userInfo.unionId,
            waterMark: safeBtoa(app.globalData.waterMark + '?x-oss-process=image/resize,P_15'),
            userInfo: app.globalData.userInfo
        })
        this.turnPage(parseInt(options.index))
        //获取快速回复词条
        detailModel.getEntry().then(list => {
            this.setData({
                entrys: list
            })
        })

        //2020-12 新活动
        console.log(options, 'newActivity');
        if(options.newActivity && options.newActivity == 1) {
            this.setData({
                newActivity: false
            })
        }

        // this.initImageInfo()
        for (let index = 0; index < app.globalData.photoArr.length; index++) {
            app.globalData.photoArr[index].index = index
        }
        //新手指引
        if(!wx.getStorageSync('guidance-detail')){
            this.setData({
                guidance: 1
            })
            wx.setStorageSync('guidance-detail', 1)
        }
    },

    /**
     * 翻页
    */
    turnPage(currentPosition){
        console.log(currentPosition,'currentPosition')
        var photoArr = app.globalData.photoArr

        console.log(photoArr, 'photoArr');

        start = currentPosition - 10 < 0 ? 0 : currentPosition - 10
        end = currentPosition + 10 >= photoArr.length ? photoArr.length : currentPosition + 10
        var data = photoArr.slice(start, end)
        
        let reg = new RegExp('rough');

        data.forEach(item => {
           item.originImg = item.picUrl.replace(reg, 'origin');
           item.originImgUrl12 = item.thumbnailUrl2.replace(reg, 'origin')
        })
        
        console.log(data, 'photoArrA');
        this.setData({
            swiperStat: true,
            data,
            currentIndex: start == 0 ? currentPosition : 10
        })
        this.initImageInfo()
        //图片懒加载
        data.forEach((item, index) => {
            let _observer = wx.createIntersectionObserver(this).relativeToViewport({ left: 100, right: 100})
            _observer.observe(`.img-${index}`, res => {
                this.setData({
                    ['data[' + index + '].imgShow']: true
                }, () => {
                    //停止监听， 销毁对象
                    _observer.disconnect()
                    _observer = null
                })
            })
        })
    },

    /**
     * 加载下一页
     */
    loadPrevPage(){
        var currentPosition = this.data.data[this.data.currentIndex].index
        if (currentPosition == 0){
            wx.showToast({
                title: '已经是第一张了',
                icon: 'none'
            })
            return
        }
        this.setData({
            //强制刷新Swiper组件
            swiperStat: false,
            prevBtn: false
        })
        this.turnPage(currentPosition - 1)
    },
    /**
     * 加载上一页
     */
    loadNextPage(){
        var currentPosition = this.data.data[this.data.currentIndex].index
        if (currentPosition == app.globalData.photoArr.length - 1) {
            wx.showToast({
                title: '已经是最后一张了',
                icon: 'none'
            })
            return
        }
        this.setData({
            //强制刷新Swiper组件
            swiperStat: false,
            nextBtn: false
        })
        this.turnPage(currentPosition + 1)
    },

    /**
     * 左右滑动
     */
    intervalChange(e){
        var photoArr = app.globalData.photoArr
        var currentIndex = e.detail.current
        if (currentIndex >= app.globalData.photoArr.length - 1 || currentIndex <= 0 ) return
        this.setData({
            currentIndex
        })
        this.initImageInfo()
    },

    /**
     * 当处于最前/后一张时继续滑动触发加载
     */
    animationfinish(e){
        //往后翻页
        if (e.detail.dx < 100 && e.detail.dx > 50 && this.data.currentIndex == this.data.data.length - 1 && trunPageable){
            this.loadNextPage()
            //防抖
            trunPageable = false
            setTimeout(function(){
                trunPageable = true
            },3000)
        }
        //往前翻页
        if (e.detail.dx > -100 && e.detail.dx < -50 && this.data.currentIndex == 0 && trunPageable){
            this.loadPrevPage()
            //防抖
            trunPageable = false
            setTimeout(function () {
                trunPageable = true
            }, 3000)
        }
    },
    /**
     * 获取门店信息
     */
    getStoreInfo (jobId) {
        detailModel.getStoreInfo(jobId).then(res => {
            console.log("获取门店信息 >>", res)
            let isStore = false
            if (res.result == "") {
                isStore = false
            } else {
                isStore = true                
            }
            this.setData({
                showStorePng: isStore,
                storeInfo: res.result
            })
        })
    },
    toStorePage () {
        wx.navigateTo({
            url: `/pages/discovery/store/store?special=1&id=${this.data.storeInfo.code}`
        });
    },
    /**
     * 初始化图片信息
     */
    initImageInfo(){  
        var height = Math.floor(deviceInfo.windowWidth / this.data.data[this.data.currentIndex].picWidth * this.data.data[this.data.currentIndex].picHeight) + 46 + 'px'

        //重置信息
        this.setData({
            height,
            commentContent: '',
            praiseBtnStat: 0,
            starBtnStat: 0,
            authorInfo: {},
            praiseArr: [],
            faceInfo: false,
            isAuthor: false,
            btnText: '关注',
            isDelete: false,
            isLoading: false,
            commentPageNo: 2
        })

        var pic_id = this.data.data[this.data.currentIndex].picId

        var storagePraiseArr = wx.getStorageSync('praiseArr').split(',')
        if (storagePraiseArr.indexOf(pic_id) !== -1) {
            this.setData({
                praiseBtnStat: 2
            })
        }
        console.log(pic_id,'pic_idpic_idpic_idpic_id')
        //获取图片收藏状态、点赞列表、评论列表第一页、上传者信息
        detailModel.getImageInfo(pic_id).then(res => {
            if (res.imageDetail.picId !== pic_id) return
            let jobId = res.imageDetail.jobId
            this.getStoreInfo(jobId)
            this.setData({
                starBtnStat: res.imageCollection == 1 ? 2 : 0,
                praiseArr: res.userLoginInfo,
                authorInfo: res.imageDetail,
                commentArr: res.comment,
                commentCount: res.commentCount
            })
            //判断当前用户是否为上传者
            if (res.imageDetail && res.imageDetail.unionId == app.globalData.unionid){
                var deleteList = wx.getStorageSync('deleteList').split(',')
                if (deleteList.indexOf(pic_id) !== -1) {
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
        })


        // 根据图片地址获取人脸信息
        detailModel.getFaceInfo(pic_id).then(res => {
            if (res.code == 200 && res.pic_id == pic_id){
                var data = res.result
                data && data.forEach((item,index) => {
                    if(item.groupFaceId == 0){
                        res.result.splice(index,1)
                    }
                })
                if (data && data.length > 0) {
                    this.setData({
                        faceInfo: data
                    })
                }else{
                    this.setData({
                        faceInfo: false
                    })
                }
            }else{
                this.setData({
                    faceInfo: false
                })
            }
        })
    },

    /**
     * 展示大图
     */
    showBig(){
        app.globalData.mta.Event.stat('c_mtq_album_pic_popularlyclick',{
            'action': '图片放大'
        })
        // if (!isLogin()) return
        var url = this.data.data[this.data.currentIndex].showOrigin ? this.data.data[this.data.currentIndex].picUrl : this.data.data[this.data.currentIndex].thumbnailUrl2
        wx.previewImage({
            urls: [url],
        })
    },

    /**
     * 下载原图
     */
    download() {
        if (!isLogin()) return
        // var waterMark = safeBtoa(getApp().globalData.waterMark + '?x-oss-process=image/resize,P_16')
        // var url = this.data.data[this.data.currentIndex].picUrl.replace('http://', 'https://') + '?x-oss-process=image/watermark,image_' + waterMark + ',t_80,g_se,x_10,y_10'
        var url = this.data.data[this.data.currentIndex].picUrl.replace('http://', 'https://')
        app.globalData.mta.Event.stat("c_mtq_album_pic_download",{})
        app.globalData.mta.Event.stat('c_mtq_album_pic_popularlyclick',{
            'action': '图片下载'
        })
        downloadImage(url)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var photoInfo = this.data.data[this.data.currentIndex]
        detailModel.addPicHot(photoInfo.picId, 10)
        var browseCount = photoInfo.browseCount
        if(browseCount > 9999){
            browseCount = '9999+'
        }else if(browseCount > 999){
            browseCount = '999+'
        }
        app.globalData.mta.Event.stat('c_mtq_album_pic_popularlyclick',{
            'action': '图片分享'
        })
        console.log(`/pages/album/share/share?image=${photoInfo.picId}&room_no=${app.globalData.roomInfo.room_no}&discoverId=${app.globalData.globalStoreId}`);
        
        return {
            title: `【分享照片】 已有${browseCount}次浏览`,
            path: `/pages/album/share/share?image=${photoInfo.picId}&room_no=${app.globalData.roomInfo.room_no}&discoverId=${app.globalData.globalStoreId}`,
            imageUrl: photoInfo.thumbnailUrl
        }
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
        // if (!this.data.isLoading && this.data.commentCount > this.data.commentArr.length){
        //     this.setData({
        //         isLoading: true
        //     })
        //     let currentPic = this.data.data[this.data.currentIndex]
        //     detailModel.getComment(currentPic.picId, this.data.commentPageNo).then(res => {
        //         this.setData({
        //             isLoading: false
        //         })
        //         //防止加载途中用户切换了图片
        //         if (res.result[0].topicId == currentPic.picId){
        //             this.setData({
        //                 commentPageNo: this.data.commentPageNo + 1,
        //                 commentArr: this.data.commentArr.concat(res.result)
        //             })
        //         }
        //     })
        // }
    },

    /**
     * 点赞
     */
    praise(){
        app.globalData.mta.Event.stat('c_mtq_album_pic_popularlyclick',{
            'action': '图片点赞'
        })
        if (!isLogin()) return
        if (this.data.praiseBtnStat !== 0){
            wx.showToast({
                icon: 'none',
                title: '您已点赞'
            })
            return            
        }
        var imageInfo = this.data.data[this.data.currentIndex]
        detailModel.updatePrise(imageInfo.picId, imageInfo.picUrl).then(res => {
            if(res.code == 200){
                var pic = wx.getStorageSync('praiseArr')
                var picArr = pic ? pic.split(',') : []
                picArr.push(imageInfo.picId)
                wx.setStorageSync('praiseArr', picArr.join(','))
                this.data.praiseArr.push(app.globalData.userInfo)
                this.setData({
                    praiseBtnStat: 1,
                    praiseArr: this.data.praiseArr
                })
                setTimeout(()=>{
                    this.setData({
                        praiseBtnStat: 2
                    })
                },700)
            }else{
                this.setData({
                    praiseBtnStat: 2
                })
                wx.showToast({
                    icon: 'none',
                    title: res.message
                })
            }
        })
    },

    bindCommentInput(e){
        this.data.commentContent = e.detail.value
    },

    /**
     * 收藏
     */
    collect(){
        app.globalData.mta.Event.stat("c_mtq_album_pic_collect",{})
        app.globalData.mta.Event.stat('c_mtq_album_pic_popularlyclick',{
            'action': '图片收藏'
        })
        var imageInfo = this.data.data[this.data.currentIndex]
        //已经收藏
        if (this.data.starBtnStat == 2){
            detailModel.cancleCollection(imageInfo.picId, imageInfo.picUrl).then(result => {
                this.setData({
                    starBtnStat: 0
                })
            })
        //还没收藏
        }else{
            detailModel.saveCollection(imageInfo.picId, imageInfo.picUrl).then(result => {
                if (result.code == 200) {
                    this.setData({
                        starBtnStat: 1,
                        collectDiolog: false
                    })
                    setTimeout(() => {
                        this.setData({
                            starBtnStat: 2
                        })
                    }, 700)
                }
            })
        }
    },

    closeCollectDiolog(){
        this.setData({
            collectDiolog: false
        })
    },

    goDiy(){
        wx.navigateTo({
            url: `/pages/album/diy/diy`
        })
    },

    /**
     * 提交评论
     */
    submitComment(e){
        app.globalData.mta.Event.stat('c_mtq_album_pic_popularlyclick',{
            'action': '图片评论'
        })
        var pic_id = this.data.data[this.data.currentIndex].picId
        if (e.currentTarget.dataset.text){
            this.data.commentContent = e.currentTarget.dataset.text
        }
        if (this.data.commentContent.length == 0){
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
            this.setData({
                sessionStat: false
            })
            if(res.code == 200){
                this.data.commentPageNo = 2
                //提交评论后刷新评论列表
                detailModel.getComment(pic_id, 1).then(res => {
                    this.setData({
                        commentArr: res.result
                    })
                })
                wx.showToast({
                    title: '评论成功',
                    icon: 'none'
                })
                //用于判断是否展示抽奖弹窗
                wx.setStorageSync('comment-' + app.globalData.activityInfo.activityId, 1)
            }else if(res.code == 500){
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
    showSession(){
        wx.pageScrollTo({
            scrollTop: 3000,
            duration: 0,
            success: () => {
                this.setData({
                    sessionStat: true,
                    replyTo: 0,
                    commentContent: '',
                    placeholder: ''
                })
            }
        })
    },

    /**
     * 隐藏对话框
     */
    hideSession(){
        this.setData({
            sessionStat: false
        })
    },

    /**
     * 回复
     */
    toReply(e){
        console.log(e.currentTarget.dataset.id)
        this.setData({
            sessionStat: true,
            replyTo: e.currentTarget.dataset.id,
            placeholder: `@${e.currentTarget.dataset.nickname}`
        })
    },

    /**
     * 跳转到他的个人首页
     */
    toPersonal(e){
        wx.navigateTo({
            url: '/pages/discovery/hishomepage/hishomepage?unionId=' + e.currentTarget.dataset.id
        })
    },

    /**
     *  查找某个人的照片
     */
    searchwho: function (e) {
        var index = e.currentTarget.dataset.index
        app.globalData.searchInfo = this.data.faceInfo
        app.globalData.searchInfo.groupFaceId = this.data.faceInfo[index].groupFaceId
        app.globalData.searchInfo.persistedFaceId = this.data.faceInfo[index].persistedFaceId
        wx.navigateTo({
            url: `/pages/album/search/searchresult/searchresult?activityId=${app.globalData.roomInfo.room_no}&groupFaceId=${e.currentTarget.dataset.id}`,
        })
    },

    /**
     * 关注
     */
    toFollow(){
        if (!this.data.authorInfo.unionId || !app.globalData.userInfo.unionId) {
            return
        }

        if (this.data.btnText == '已关注'){
            detailModel.cancleFollow(this.data.authorInfo.unionId).then(res => {
                wx.showToast({
                    title: '取消关注成功',
                    icon: 'none'
                })
                this.setData({
                    btnText: '关注'
                })
            })
        }else{
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

    /**
     * 删除
     */
    toDelete(){
        this.setData({
            deleteComfirm: true
        })
    },

    delete(){
        app.globalData.mta.Event.stat('c_mtq_album_pic_popularlyclick',{
            'action': '图片删除'
        })
        var fileName = this.data.data[this.data.currentIndex].picId
        wx.showLoading()
        detailModel.getAccessToken().then(() => {
            //内部删除图片
            detailModel.deleteImageInfo(fileName).then(() => {
                // var deleteList = wx.getStorageSync('deleteList').split(',')
                // deleteList.push(fileName)
                // wx.setStorageSync('deleteList', deleteList.join(','))
                // this.setData({
                //     btnText: '已删除',
                //     isDelete: true,
                //     deleteComfirm: false
                // })
                wx.hideLoading()
                app.globalData.fromDetail = true
                wx.navigateBack({
                    delta: 1
                })
            })
        })
        
    },

    cancle(){
        this.setData({
            commentError: false
        })
    },

    cancleDelete(){
        this.setData({
            deleteComfirm: false
        })
    },

    stop(){
        return
    },

    /**
     * 新手指导  下一步
     */
    nextStep(){
        this.setData({
            guidance: false
        })
    },

    changeQuality(e){
        this.setData({
            ['data[' + e.currentTarget.dataset.index  + '].showOrigin']: e.currentTarget.dataset.origin
        })
    },


})