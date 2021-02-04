// pages/album/detail/detail.js
import { queryObject, safeBtoa, isRegistered, parseQueryString } from '../../../utils/util.js'
import { Detail } from './detail-model.js'
import { Detail as AlbumDetail } from '../../album/detail/detail-model.js'
import { isLogin } from '../../../utils/util'
import { List } from '../list/list-model'
import { async } from '../../../utils/runtime.js'
import { Index } from '../index/index-model'
var indexModel = new Index()

var listModel = new List()
var detailModel = new Detail()
var albumDetailModel = new AlbumDetail()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        movementInfo: {},
        authorInfo: {},
        currentIndex: 0,
        height: '100vh',
        follow: [],
        commentArr: [],
        commentCount: 0,
        deleteDetail: false,
        tipBox: false,
        praiseArr: 0,
        praiseBtnStat: 0,
        starBtnStat: 0,
        commentContent: '',
        sessionStat: false,
        placeholder: '来了怎么能不回复',
        replyTo: 0,
        commentError: false,
        fromShare: false,
        waterMark: safeBtoa(getApp().globalData.waterMark + '?x-oss-process=image/resize,P_10'),
        id: null,
        isEmpty: false,
        btnText: '关注',
        isLoading: false,
        entrys: [],
        commentPageNo: 2,
        isShowTools: false,
        userInfo: {},
        showArrangeInfo: false,
        showVouches: false,
        MXQH_btn: false,
        isAppointment:false,
        resUnionId:''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
        // 
        console.log(options,'我跳回来了!!!')
        // if(!this.prevPage) this.setData({ fromShare: true })

        const res = await listModel.getUnionid()
        if(!res){
            wx.navigateTo({
                url: '/pages/common/userinfo/userinfo?fromlist=1',
            })
            return
        }
        wx.hideShareMenu()
        if(options.scene){
            options = parseQueryString(decodeURIComponent(decodeURIComponent(options.scene)))
        }
        if(options.discoverId){
            try {
                let lev = 1;
                const res = await indexModel.listLevel(lev,1,1,options.discoverId);
                if(res.code == 200) app.globalData.discoverInfo = res.result[0];
            } catch (error) {
                console.log(error)
                wx.showToast({
                    title:'数据加载失败，请联系管理员',
                    icon: 'none'
                })
            }
        }


        // let id = null;
        // if(!options.id){
            //     id = queryObject(scene).id
            // }else{
                //     id = options.id
                // }
        if (options.fromShare || options.discoverId) {
            this.setData({
                fromShare: true
            })
        }
        this.initImageInfo(options.id)
        this.friends = wx.createCanvasContext('friends', this);
        const { discoverInfo } = app.globalData;
        this.data.type = options.type ? options.type : (discoverInfo ? discoverInfo.type : '')
        console.log(this.data.type ,'type')
        // this.data.discoverId = options.discoverId ? options.discoverId : discoverInfo.id
        this.setData({
            id: options.id,
            praiseCount: options.praiseCount ? options.praiseCount : 0,
            // isShowTools: discoverInfo && discoverInfo.type === 'C' || false
            isShowTools: (this.data.type === 'C' || this.data.type === 'DGLG') || false,
            MXQH_btn: (this.data.type == 'DGLG_2020' || this.data.fromShare) || false
        })

        albumDetailModel.getEntry().then(list => {
            this.setData({
                entrys: list
            })
        })

        

        albumDetailModel.isFollow(options.unionId).then(res => {
            this.setData({
                btnText: res.result ? '已关注' : '关注'
            })
        })
    },

    onShow(){
        if(app.globalData.fromH5){
            if(!wx.getStorageSync('gotVouchers1')){
                app.globalData.mta.Event.stat("c_mtq_Dynamics_mxqh_partakedetails",{})
                this.setData({ showVouches: true })
                wx.setStorageSync('gotVouchers1', '1')
            }
            app.globalData.fromH5 = false
        }
        detailModel.getAppointmentStat('MXQH_202003').then(res =>{
            this.setData({ isAppointment: res })
        })
    },

    hideVouches(){
        this.setData({ showVouches: false })
    },


    initImageInfo(movementId) {
        //或者动态详情
        detailModel.getDetail(movementId).then(data => {
            this.data.discoverId = data.discoverId
            if (data) {
                this.setData({
                    movementInfo: data
                })
            } else {
                this.setData({
                    isEmpty: true
                })
            }

            //获得作者信息
            detailModel.getAuthorInfo(data.unionId).then(res => {
                let deleteDetail = false
                if (res.result.unionId == getApp().globalData.unionid) {
                    deleteDetail = true;
                }
                this.setData({
                    authorInfo: res.result,
                    deleteDetail
                })
            })
        })

        // 获取点赞
        detailModel.getPraise(movementId).then(res => {
            if (res.code == 200) {
                this.setData({
                    praiseArr: res.result
                })
            }
            var movementIds = wx.getStorageSync('movementPraiseArr')
            var movementIdArr = movementIds ? movementIds.split(',') : []
            if (movementIdArr.indexOf(movementId) !== -1) {
                this.setData({
                    praiseBtnStat: 2
                })
            }
        })

        //获取评论列表
        albumDetailModel.getComment(movementId, 1, 2).then(res => {
                if (res.code == 200) {
                    this.setData({
                        commentArr: res.result
                    })
                }
            })
            //获取评论总数
        albumDetailModel.getComment(movementId, 1, 2, 9999).then(res => {
            if (res.code == 200) {
                this.setData({
                    commentCount: res.result.length
                })
            }
        })
    },

    /**
     * 删除详情
     */
    deleteDetail() {
        this.setData({
            tipBox: true
        })
    },
    /**
     * “取消”
     */
    closeDynamics() {
        this.setData({
            tipBox: false
        })
    },
    /**
     *  “删除”
     */
    deleteDynamics() {
        const movementId = this.data.id;
        detailModel.delect(movementId).then(res => {
            wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
            })
        })
        wx.switchTab({
            url: `/pages/discovery/index/index`,
        })
    },

    bindCommentInput(e) {
        this.data.commentContent = e.detail.value
    },

    /**
     * 显示对话框
     */
    showSession() {
        isRegistered().then(() => {
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
        }).catch(err => {
            this.setData({
                authorityTips: true
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
        this.setData({
            sessionStat: true,
            replyTo: e.currentTarget.dataset.id,
            placeholder: `@${e.currentTarget.dataset.nickname}`
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
            title: '提交中',
            mask: true
        })
        albumDetailModel.collectFormId(e.detail.formId)

        albumDetailModel.saveCommnet(this.data.movementInfo.id, this.data.commentContent, this.data.replyTo, this.data.movementInfo.unionId, 2).then(res => {
            wx.hideLoading()
            if (res.code == 200) {
                this.setData({
                    sessionStat: false
                })
                this.setData({
                        commentPageNo: 2
                    })
                    //重新拉去评论数
                albumDetailModel.getComment(this.data.movementInfo.id, 1, 2).then(res => {
                    if (res.code == 200) {
                        this.setData({
                            commentArr: res.result,
                            commentCount: this.data.commentCount + 1
                        })
                    }
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

    praise() {
        isRegistered().then(() => {
            // if (this.data.praiseBtnStat !== 0) {
            //     wx.showToast({
            //         icon: 'none',
            //         title: '您已点赞'
            //     })
            //     return
            // }
            detailModel.praise(this.data.movementInfo.discoverId, this.data.movementInfo.id).then(res => {
                if (res.code == 200) {
                    var movementIds = wx.getStorageSync('movementPraiseArr')
                    var movementIdArr = movementIds ? movementIds.split(',') : []
                    movementIdArr.push(this.data.movementInfo.id)
                    wx.setStorageSync('movementPraiseArr', movementIdArr.join(','))
    
                    this.setData({
                        praiseBtnStat: 1,
                        praiseArr: this.data.praiseArr.concat(getApp().globalData.userInfo)
                    })
                    setTimeout(() => {
                        this.setData({
                            praiseBtnStat: 2
                        })
                    }, 700)
                    wx.showToast({
                        icon: 'none',
                        title: res.message
                    })
                    // 点赞 埋点
                    if(app.globalData.activity_channel){
                        app.globalData.mta.Event.stat('c_mtq_Dynamics_Banner_Like',{
                            'count':app.globalData.unionid,
                            'channel': app.globalData.activity_channel
                        })
                    }

                    // if(!wx.getStorageSync('gotVouchers2') && this.data.MXQH_btn){
                    //     app.globalData.mta.Event.stat("c_mtq_Dynamics_mxqh_likeddetails",{})
                    //     wx.setStorageSync('gotVouchers2', 1);
                    //     this.setData({ showVouches: true })
                    // }
                }else{
                    wx.showToast({
                        icon: 'none',
                        title: res.message 
                    })
                }
            })
        }).catch(err => {
            this.setData({
                authorityTips: true
            })
        })


    },

    toPersonal(e) {
        wx.navigateTo({
            url: '/pages/discovery/hishomepage/hishomepage?unionId=' + e.currentTarget.dataset.id,
        })
    },

    cancle() {
        this.setData({
            commentError: false
        })
    },

    onReachBottom: function() {
        //获取更多评论
        if (!this.data.isLoading && this.data.commentCount > this.data.commentArr.length) {
            this.setData({
                isLoading: true
            })
            albumDetailModel.getComment(this.data.id, this.data.commentPageNo, 2).then(res => {
                this.setData({
                    isLoading: false
                })
                this.setData({
                    commentPageNo: this.data.commentPageNo + 1,
                    commentArr: this.data.commentArr.concat(res.result)
                })
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        
        detailModel.addMovementHot(this.data.movementInfo.discoverId, this.data.movementInfo.id, 10)
        var path = `/pages/discovery/detail/detail?id=${this.data.movementInfo.id}&unionId=${this.data.authorInfo.unionId}&fromShare=${1}&discoverId=${this.data.movementInfo.discoverId}&type=${this.data.type}`
        console.log(path);
        
        return {
            title: this.data.authorInfo.nickName + '的动态',
            path,
            imageUrl: this.data.movementInfo.imgUrlsList[0]
        }
    },

    toHome() {
        // wx.navigateTo({
        //     url: '/pages/webview/webview?path=MXQH'
        // })
        // const info = 'DGLG_2020'
        const { discoverInfo } = app.globalData;
        console.log(discoverInfo)
        // // const baseUrl = '/activity/engineering/engineering'
        // wx.navigateTo({
        //     url:`${baseUrl}?type=${info}&id=${discoverInfo.id}`
        // })
        if(__wxConfig.accountInfo.appId == 'wx059f9118f045da79'){
            wx.reLaunch({
                url:`/pages/webview/webview?path=https://mtqcshi.hucai.com/ac/activity/202010LGSY/index.html&id=${discoverInfo.id}`
            })
        }else{
            wx.reLaunch({
                url:`/pages/webview/webview?path=https://mtqcshi.hucai.com/test/activity/202010LGSY/index.html&id=${discoverInfo.id}`
            })
        }
    },

    toPerson() {
        wx.navigateTo({
            url: '/pages/discovery/hishomepage/hishomepage?unionId=' + this.data.authorInfo.unionId,
        })
    },

    toFollow(e) {
        isRegistered().then(() => {
            if (this.data.btnText == '关注') {
                albumDetailModel.addFollow(e.currentTarget.dataset.id).then(res => {
                    wx.showToast({
                        title: '关注成功',
                        icon: 'none'
                    })
                    this.setData({
                        btnText: '已关注'
                    })
                })
            } else {
                albumDetailModel.cancleFollow().then(res => {
                    wx.showToast({
                        title: '取消关注成功',
                        icon: 'none'
                    })
                    this.setData({
                        btnText: '关注'
                    })
                })
            }
        }).catch(err => {
            this.setData({
                authorityTips: true
            })
        })
    },

    onGotUserInfo(e){
        detailModel.updateUserInfo(e).then(() => {
            this.setData({
                authorityTips: false
            })
        })
    },

    hideAuthority(){
        this.setData({
            authorityTips: false
        })
    },

    stop() {
        return
    },
    tapTools(e){
        const info = e.currentTarget.dataset.info;
        const { mta, discoverInfo, unionid } = app.globalData;
        let event = ''
        if(info == 'entry' ){
            event = 'c_mtq_Dynamics_Banner_Competition'
            if(this.data.type == 'C'){
                wx.navigateTo({
                    url:`/activity/anniversary/anniversary?type=${info}&id=${this.data.discoverId}`
                })
            }else if(this.data.type == 'DGLG'){
                wx.navigateTo({
                    url:`/activity/engineering/engineering?type=${info}&id=${this.data.discoverId}`
                })
            }
        }
        mta.Event.stat(event,{'activity':this.data.discoverId,count:unionid})
    },
    // 合成图片 并下载到朋友圈
    async compoessFriendsImage(){
        wx.showLoading({
            title:'加载数据中',
            icon: 'none'
        })
        const { movementInfo } = this.data;
        const image = await app.getImageInfo(movementInfo.imgUrlsList[0].picUrl);
        const codeImg = await app.getImageInfo(movementInfo.codeImg)
        const header = await app.getImageInfo('https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/20201113/share-banner.jpg')
        const h = 375/image.width*image.height + 52
        this.friends.drawImage(header.path, 0, 0, 375, 52)
        this.friends.drawImage(image.path,0,52,375,h)
        this.friends.rect(0, h-80, 375, 80)
        this.friends.setGlobalAlpha(0.9)
        this.friends.setFillStyle('#FFFFFF')
        this.friends.fill()
        this.friends.drawImage(codeImg.path,296,h - 74,66,66);
        this.friends.setFontSize(14);
        this.friends.setFillStyle('#231815');
        this.friends.fillText(`长按识别二维码`, 14, h - 42);
        this.friends.fillText(`给${movementInfo.nickName}的作品点赞`, 14, h - 16);
        this.friends.draw();
        wx.hideLoading();
        setTimeout(async () => {
            const path = await app.canvasToTempFilePath('friends',{width:375,height:h});
            const isSave = await app.saveImageToPhotosAlbum(path);
            app.globalData.downShareDetailsImage = path;
            if(isSave){
                wx.navigateTo({
                    url:'/pages/discovery/friends/friends'
                })
            }
        }, 100);
    },

    /**
     * 马上预约
     */
    async toArrange(){
        try {
            await isRegistered()
        } catch (error) {
            return this.setData({
                authorityTips: true
            })
        }

        if(!isLogin()){
            return wx.navigateTo({
                url: '/pages/common/userPhone/userPhone'
            })
        }

        this.setData({
            userInfo: {...app.globalData.userInfo},
            showArrangeInfo: true
        })

        // wx.redirectTo({
        //     url: '/pages/discovery/arrange/arrange?id=' + app.globalData.discoverInfo.id,
        // })
    },

    hideArrangeInfo(){
        this.setData({ showArrangeInfo: false })
    },

    modifyUserInfo(e){
        this.data.userInfo[e.currentTarget.dataset.type] = e.detail.value
    },

    confirmArrange(){
        wx.showLoading({ mask: true })
        listModel.recordArrange(this.data.userInfo, app.globalData.discoverInfo.storeId).then(res =>{
            wx.hideLoading()
            if(res.code == 201){
                return wx.showToast({
                    title: '您已预约过，请耐心等待',
                    icon: 'none',
                    duration: 1500
                })
            }
            this.setData({ showArrangeInfo: false })
            wx.showToast({
                title: '预约成功',
                duration: 3000
            })
        })
    },

    jumpApp(){
        // wx.navigateToMiniProgram({
        //     appId: 'wxbf9f2e9fde7a772d',
        //     path: 'pages/goodsDetail/goodsDetail?goodsId=DSGW160&productId=1009858',
        //     extraData: {
        //         goodsId: 'DSGW160',
        //         productId: '1009858'
        //     }
        // })
        wx.navigateTo({
            url: '/pages/common/summary/summary'
        });
    },

    jumpApp1(){
        app.globalData.mta.Event.stat("c_mtq_Dynamics_mxqh_use",{})
        wx.navigateToMiniProgram({
            appId: 'wxbf9f2e9fde7a772d',
            path: 'pages/goodsDetail/goodsDetail?goodsId=DSGW160&productId=1009858',
            extraData: {
                goodsId: 'DSGW160',
                productId: '1009858'
            }
        })
    },

    toActivityHome(){
        console.log(app.globalData,'112123')
        const { discoverInfo } = app.globalData;
        // if(discoverInfo.type == 'MXQH_202003'){
        //     if(__wxConfig.accountInfo.appId == 'wx059f9118f045da79'){
        //         wx.navigateTo({
        //             url:`/pages/webview/webview?path=https://mtqcshi.hucai.com/test/activity/202003MXQH/dream.html#/&activityCode=MXQH_202003`
        //         })
        //     }else{
        //         wx.navigateTo({
        //             url:`/pages/webview/webview?path=https://mtqcshi.hucai.com/test/activity/dream/dream.html#/&activityCode=MXQH_202003`
        //         })
        //     }
        // }else{
            if(__wxConfig.accountInfo.appId == 'wx059f9118f045da79'){
                wx.reLaunch({
                    url:`/pages/webview/webview?path=https://mtqcshi.hucai.com/ac/activity/202010LGSY/index.html&id=${discoverInfo.id}`
                })
            }else{
                wx.reLaunch({
                    url:`/pages/webview/webview?path=https://mtqcshi.hucai.com/test/activity/202010LGSY/index.html&id=${discoverInfo.id}`
                })
            }
        // }

        // return
        
    }
   
})