import { Detail } from '../../detail/detail-model.js'
import { isLogin, delay } from '../../../../utils/util'
import { List } from '../../list/list-model.js'
import { Index } from '../../index/index-model'
var listModel = new List()
var detailModel = new Detail()
var indexModel = new Index()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        movementInfo: {},
        anonymous:false,
        userInfo: {},
        showArrangeInfo: false,

        newInfo: 1, // 咨询信息结果 1：填写信息 0：
        waitingTips: false, // 控制温馨提示弹窗
        isIPX: app.globalData.isIPX, // 判断iPhoneX
        arrangeTime: "", // 预约时间
        isLoading: false, // 加载中
        detailInfo: {}, // 商品明细
        partNo: "", // 商品编码
        error: false, // 敏感词提示
        statusBarHeight: app.globalData.statusBarHeight, // 获取顶部栏高度
        fromShare: "", // 通过分享进入
        navbarInitTop: 0, //导航栏初始化距顶部的距离
        isFixed: "" // 控制吸顶效果
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //或者动态详情
        // detailModel.getDetail(options.id).then(data => {
        //     if (data) {
        //         this.setData({
        //             movementInfo: data
        //         })
        //         wx.setNavigationBarTitle({
        //             title: data.nickName
        //         })
        //     } 
        // })
        console.log("options >>", options)
        this.setData({
            partNo: options.partNo ? options.partNo : "",
            storeId: options.id || options.storeId || app.globalData.discoverInfo.storeId || app.globalData.globalId || "",
            fromShare: options.fromShare || ""

        })
        // this.data.storeId = options.id || options.storeId || app.globalData.discoverInfo.storeId || app.globalData.globalId || ""
        this.getProductDetail()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (this.data.isIPX) {
            this.setData({
                statusBarHeight: this.data.statusBarHeight - 10
            })
        }
        this.setData({ 
            anonymous: JSON.stringify(app.globalData.userInfo) == '{}'
        })
    },
    /**
     * 监听页面滑动事件
     */
    onPageScroll: function(e) {
        let scrollTop = parseInt(e.scrollTop); //滚动条距离顶部高度

        //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
        let isSatisfy = scrollTop != 0 ? true : false;
        //为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等
        if (this.data.isFixed === isSatisfy) {
            return false;
        }
        this.setData({
            isFixed: isSatisfy
        });
        console.log(this.data.isFixed)
    },
    /**
     * 返回上一页
     */
    goBack () {
        console.log(this.data.fromShare)
        if (this.data.fromShare == 1) {
            wx.redirectTo({
                url: "/pages/discovery/store/store"
            })
            return
        }
        wx.navigateBack({
            delta: 1
        });
    },
    /**
     * 查询是否已咨询
     */
    checkArrange () {
        const { unionid } = app.globalData;
        let storeId = this.data.storeId ? this.data.storeId : '',
            partNo = this.data.partNo,
            unionId = unionid
        indexModel.getCheckAppoiment(storeId, partNo, unionId).then(res => {
            if (res.result != null) {
                this.setData({
                    waitingTips: true,
                    arrangeTime: res.result.createTime
                })
            } else {
                this.setData({
                    showArrangeInfo: true
                })
            }
        })
    },
    /**
     * 马上预约
     */
    toArrange(){
        if(this.data.anonymous){
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
            // showArrangeInfo: true
        })
        this.checkArrange()

        // wx.redirectTo({
        //     url: '/pages/discovery/arrange/arrange?id=' + app.globalData.discoverInfo.id,
        // })
    },
    /**
     * 检测手机号
     */
    watchMobileNo (e) {
        let val = e.detail.value,
            reg = /[^0-9]/ig
        delay(() => {
            if (reg.test(val) && val.length > 0) {
                val = val.replace(/[^0-9]/ig, "")
                this.setData({
                    'userInfo.mobileNo': val
                })
                wx.showToast({
                    title: '手机号只能是数字',
                    icon: "none"
                })
            } else {
                this.setData({
                    'userInfo.mobileNo': val
                })
            }
        }, 500)
    },
    /**
     * 检测联系人
     */
    watchName: function(e) {
        let val = e.detail.value,
            reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
        delay(() => {
            if (!reg.test(val) && val.length > 0) {
                val = val.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]/g, "")
                this.setData({
                    'userInfo.nickName': val
                })
                wx.showToast({
                    title: '联系人只能是中文、英文及数字',
                    icon: "none"
                })
            } else {
                this.setData({
                    'userInfo.nickName': val
                })
            }
        }, 500)
    },
    /**
     * 获取商品明细
     */
    getProductDetail () {
        this.setData({ isLoading: true })
        let storeId = this.data.storeId,
            partNo = this.data.partNo
        listModel.getProductDetail(storeId, partNo).then(res => {
            this.setData({ isLoading: false })
            console.log("获取商品明细", res)
            if (res.code == 200) {
                let _res = res.result
                if (_res.productInfo.productDetail) {
                    let autoWidth = wx.getSystemInfoSync()['windowWidth'] * 2
                    let newImg = `<img src="$2?x-oss-process=image/resize,w_${autoWidth}" style="max-width:100%;height:auto;">`
                    _res.productInfo.productDetail = _res.productInfo.productDetail.replace(/(<img[^>]*?src=['""]([^'""]*?)['""][^>]*?>)/g, newImg)
                  }
                this.setData({
                    detailInfo: _res.productInfo
                })
                
            }
        })
    },
    onGotUserInfo(e) {
        listModel.updateUserInfo(e).then(() => {
            this.setData({
                authorityTips: false,
                anonymous: false
            })
        })
    },

    hideArrangeInfo(){
        this.setData({ showArrangeInfo: false })
    },

    modifyUserInfo(e){
        this.data.userInfo[e.currentTarget.dataset.type] = e.detail.value
    },

    hideAuthority(){
        this.setData({
            authorityTips: false
        })
    },
    setErrorMessage(content) {
        wx.hideLoading();
        this.setData({
            error: true,
            msgText: content,
        })
    },
    cancle(){
        this.setData({
            error:false
        })
    },
    async confirmArrange(){
        let partNo = this.data.partNo ? this.data.partNo : "*",
            partName = this.data.detailInfo.productName ? this.data.detailInfo.productName : "*"
        wx.showLoading({ mask: true })
        const res = await app.verifyContent(this.data.userInfo.nickName);
        if(res == false){
            this.setErrorMessage('内容包含敏感词汇，请修改后重新提交')
            return
        }
        if (/[^a-zA-Z0-9\u4E00-\u9FA5]/g.test(this.data.userInfo.nickName) && this.data.userInfo.nickName.length > 0) {
            wx.showToast({
                title: "联系人只能是中文、英文及数字",
                icon: "none"
            })
            return
        }
        if (!(/(^[1][0-9][0-9]{9}$)/g.test(this.data.userInfo.mobileNo))) {
            wx.showToast({
                title: "请输入正确的手机号",
                icon: "none"
            })
            return
        }
        if (this.data.userInfo.nickName == "") {
            wx.showToast({
                title: "联系人不能为空",
                icon: "none"
            })
            return
        }
        if (this.data.userInfo.mobileNo == "") {
            wx.showToast({
                title: "手机号不能为空",
                icon: "none"
            })
        }
        listModel.recordArrange(this.data.userInfo, this.data.storeId, partNo, partName).then(res =>{
            wx.hideLoading()
            if(res.code == 201){
                // return wx.showToast({
                //     title: '您已预约过，请耐心等待',
                //     icon: 'none',
                //     duration: 1500
                // })
                this.setData({
                    waitingTips: true,
                    showArrangeInfo: false
                })
                return
            }
            // this.setData({ showArrangeInfo: false })
            // wx.showToast({
            //     title: '预约成功',
            //     duration: 3000
            // })
            this.setData({
                newInfo: 0
            })
        })
    },
    // 关闭提示弹窗
    closeWaiting () {
        this.setData({ waitingTips: false })
    },
    // 控制咨询弹窗
    controlCallPop (e) {
        console.log(e)
        let data = e.currentTarget.dataset
        if (data.code == '0') {
            this.setData({
                isCall: false
            })
            return
        }
        this.setData({
            isCall: true
        })
    },
    /**
     * 返回
     */
    goHome(e) {
        app.globalData.fromShare = false
        wx.switchTab({
            url: '/pages/album/checkin/checkin',
        })
    },

    onShareAppMessage: function() {
        console.log(`/pages/discovery/store/detail/detail?id=${this.data.storeId}&discoverId=${app.globalData.globalStoreId}&storeId=${this.data.storeId}&partNo=${this.data.detailInfo.partNo}&fromShare=1`);
        
        return {
            title: this.data.detailInfo.productName,
            path: `/pages/discovery/store/detail/detail?id=${this.data.storeId}&discoverId=${app.globalData.globalStoreId}&storeId=${this.data.storeId}&partNo=${this.data.detailInfo.partNo}&fromShare=1`,
            imageUrl: this.data.detailInfo.mAlbumBinaryPathList[0] + '?x-oss-process=image/resize,w_600'
        }
    },

    stop(){
        return false
    }
})