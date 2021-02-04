// import { Home } from '../../album/home/home-model.js'
import { List } from './list-model.js'
import { Index } from '../index/index-model'
import { isLogin } from '../../../utils/util'
var listModel = new List()
var indexModel = new Index()
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        photo: [],
        photos: [],
        bannerUrl: '',
        manuStat: true,
        pageNum: 1,
        pageSize: 30,
        neverCreate: true,
        discoverId: 0,
        isEmpty: false,
        isSpecial: false,
        // 加载数据中
        isLoading: false,
        isShowCoupon: false,
        couponCode: null,
        isShowTools: '',
        isSearch: false,
        selectTab:1,
        searchInput:'',
        // 如果类型是 C 并且创建动态成功 这显示参加活动成功
        isCreate:false,
        shareStat:false,
        fromShare:false,
        error: false,
        userInfo: {},
        showArrangeInfo: false,
        isSignUP:false,
        isSelectType:null,
        // 发布前判断作品类型
        showTypeDialog:false,
        resUnionId:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        const res = await indexModel.getUnionid()
        if(!res){
            wx.navigateTo({
                url: '/pages/common/userinfo/userinfo?fromlist=1',
            })
            return
        }
        wx.hideShareMenu()
        const { special, type, id, fromShare } = options;
        console.log(options,'option')
        if(id){
            try {
                let lev = 1;
                if(special == 1)  lev = 2;
                const res = await indexModel.listLevel(lev,1,1,id);
                if(res.code == 200) app.globalData.discoverInfo = res.result[0];
            } catch (error) {
                wx.showToast({
                    title:'数据加载失败，请联系管理员',
                    icon: 'none'
                })
            }
        }
        const { unionid, discoverInfo } = app.globalData;
        console.log(app.globalData,'app.globaldata')
        //导航栏标题
        wx.setNavigationBarTitle({
            title: `${discoverInfo.name}`
        })
        // console.log(fromShare)
        if(fromShare){
            listModel.checkStat(unionid,'DGLG_2020').then(res=>{
                if(res.result){
                    this.setData({
                        isSignUP: true
                    })
                }
            })
        }
        if(discoverInfo.type == 'DGLG_2020'){
            listModel.checkStat(unionid,'DGLG_2020').then(res=>{
                if(res.result){
                    this.setData({
                        isSignUP: true
                    })
                }
            })
        }

        this.setData({
            bannerUrl: discoverInfo.banner,
            discoverId: discoverInfo.id,
            isSpecial: Boolean(special),
            isShowTools: discoverInfo.type,
            isCreate: type == 'DGLG' ? true : false,
            discoverInfo,
            fromShare: fromShare ? true : false
        })

        this.loadNewestData()

        // 如果已经创建过活动就不显示动画了
        if (wx.getStorageSync('firstCreateActivity')) {
            this.setData({
                neverCreate: false
            })
        }
        // 查询优惠券信息
        const { code, result } = await listModel.searchCouponInfo(discoverInfo.id, unionid);
        if(code == 200 && result.showCoupon){
            this.setData({
                isShowCoupon:true,
                couponCode:result.coupon.couponCode
            })
        }
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

    onReachBottom(){
        this.loadNewestData();
    },
    showChooseDialog(){
        this.setData({
            showTypeDialog:true
        })
    },
    hideChooseType(){
        this.setData({
            showTypeDialog:false
        })
    },
    openSy(){
        // console.log(this.data.isSelectType == null)
        if(this.data.isSelectType == null){
            wx.showToast({
                title:'请选择作品类型',
                icon: 'none'
            })
            return
        }
        if(this.data.isSelectType == 1){
            wx.navigateTo({
                url: '/pages/discovery/create-dynamics/create-dynamics?id=' + app.globalData.discoverInfo.id + '&workType=T',
            })
            this.setData({
                showTypeDialog:false
            })
        }else{
            wx.navigateTo({
                url: '/pages/discovery/create-dynamics/create-dynamics?id=' + app.globalData.discoverInfo.id + '&workType=D',
            })
            this.setData({
                showTypeDialog:false
            })
        }
        
    },
    loadNewestData(){
        this.setData({ isLoading: true })
        listModel.getNewest(
            app.globalData.discoverInfo.id, 
            this.data.pageNum, 
            this.data.pageSize
        ).then(data => {
            if (data.result.length == 0 && this.data.pageNum == 1){
                if(this.data.pageNum == 1){
                    this.setData({
                        isEmpty: true,
                        isLoading: false
                    })
                }else{
                    this.setData({
                        isLoading: false
                    })
                }
            }else{
                this.setData({
                    photo: data.result,
                    isEmpty: false,
                    isLoading: false
                })
            }
            this.data.pageNum ++
        })
    },
    async getCoupon(){
        const res = await listModel.getCoupon({unionId:app.globalData.unionid,couponCode:this.data.couponCode});
        this.setData({
            isShowCoupon: false
        })
    },
    closeCoupon(){
       this.setData({
           isShowCoupon: false,
           isCreate: false
       })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        app.globalData.fromH5 = false
        this.setData({ 
            anonymous: JSON.stringify(app.globalData.userInfo) == '{}'
        })
    },

    /**
     * 收起/打开banner
     */
    switchBannerStat: function (e) {
        var scrollTop = e.detail.scrollTop
        if (scrollTop > 200 && this.data.bannerStat) {
            this.setData({
                bannerStat: false
            })
        } else if (scrollTop <= 200 && !this.data.bannerStat) {
            this.setData({
                bannerStat: true
            })
        }
    },

    /**
     * 最热
     */
    toHotest() {
        wx.redirectTo({
            url: `/pages/discovery/hot/hot?special=${this.data.isSpecial ? 1 : ''}&type=${this.data.discoverInfo.type}`,
        })
    },

    /**
     * 最新
     */
    toNewest() {
        wx.redirectTo({
            url: `/pages/discovery/list/list?special=${this.data.isSpecial ? 1 : ''}`,
        })
    },
     /**
     * 返回
     */
    goback(e) {
        if (e.detail == 'goto') {
            wx.switchTab({
                url: '/pages/discovery/index/index',
            })
        }
    },

    onPageScroll: function (e) {
        if (e.scrollTop <= 200 && this.data.manuStat == false) {
            this.setData({
                manuStat: true
            })
        }
        if (e.scrollTop > 200 && this.data.manuStat == true) {
            this.setData({
                manuStat: false
            })
        }
    },

    /**
     * 发布动态
     */
    createDynamics: function () {
        if(this.data.anonymous){
            return this.setData({
                authorityTips: true
            })
        }
        wx.navigateTo({
            url: '/pages/discovery/create-dynamics/create-dynamics?id=' + app.globalData.discoverInfo.id,
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
        listModel.recordArrange(this.data.userInfo, this.data.discoverInfo.storeId).then(res =>{
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

    onGotUserInfo(e) {
        listModel.updateUserInfo(e).then(() => {
            this.setData({
                authorityTips: false,
                anonymous: false
            })
        })
    },

    hideAuthority(){
        this.setData({
            authorityTips: false
        })
    },
    /**
     * 点击 tools
     */
    tapTools(e){
        const info = e.currentTarget.dataset.info;
        // return
        const { mta, discoverInfo, unionid } = app.globalData;
        let event = ''
        let baseUrl = '/activity/anniversary/anniversary'
        if(this.data.isShowTools == "DGLG") baseUrl = '/activity/engineering/engineering'
        if(info == 'entry' ){
            // event = 'c_mtq_Dynamics_Banner_Competition'
            // wx.navigateTo({
            //     url:`${baseUrl}?type=${info}&id=${discoverInfo.id}`
            // })
            wx.navigateToMiniProgram({
                appId: 'wxcae7ff8c35e9304f',
                path: 'pages/common/blank-page/index?weappSharePath=packages%2Fpaidcontent%2Fcontent%2Findex%3Fkdt_id%3D44076325%26alias%3D3no4e166szt3p',
                extraData: {
                    weappSharePath: 'paidcontent%2Fcontent%2Findex%3Fkdt_id%3D44076325%26alias%3D3no4e166szt3p'
                },
                // envVersion: 'develop',
                success(res) {
                    // 打开成功
                },

                fail(err){
                    console.log(err);
                }
            })
        }else if(info == 'ranking'){
            event = 'c_mtq_Dynamics_Banner_RankingList'
            wx.navigateTo({
                url:`${baseUrl}?position=1&type=${info}&id=${discoverInfo.id}`
            })
        }else if(info == 'prize'){
            event = 'c_mtq_Dynamics_Banner_Prizes'
            wx.navigateTo({
                url:`${baseUrl}?type=${info}&id=${discoverInfo.id}`
            })
        }else if(info == 'MXQH'){
            if(__wxConfig.accountInfo.appId == 'wx059f9118f045da79'){
                wx.navigateTo({
                    url:`/pages/webview/webview?path=https://mtqcshi.hucai.com/test/activity/202003MXQH/dream.html#/&activityCode=MXQH_202003`
                })
            }else{
                wx.navigateTo({
                    url:`/pages/webview/webview?path=https://mtqcshi.hucai.com/test/activity/dream/dream.html#/&activityCode=MXQH_202003`
                })
            }
        }else if (info == 'DGLG_2020'){
            if(__wxConfig.accountInfo.appId == 'wx059f9118f045da79'){
                wx.navigateTo({
                    url:`/pages/webview/webview?path=https://mtqcshi.hucai.com/ac/activity/202010LGSY/index.html&id=${discoverInfo.id}`
                })
            }else{
                wx.navigateTo({
                    url:`/pages/webview/webview?path=https://mtqcshi.hucai.com/test/activity/202010LGSY/index.html&id=${discoverInfo.id}`
                })
            }
            // console.log(info,'info')
            // console.log(discoverInfo,'discoverInfo')
            // wx.navigateTo({
            //     url:`${baseUrl}?type=${info}&id=${discoverInfo.id}`
            // })
        }else if(info == 'search'){
            this.setData({
                isSearch:true
            })
        }else{
            // 分享
            this.setData({
                shareStat: true
            })
        }
        mta.Event.stat(event,{'activity':discoverInfo.id,count:unionid})
    },
    hideMask(){
        this.setData({
            shareStat: false
        })
    },
    downloadQrcode(){
        wx.showLoading({
            title: '下载中',
            mask: true
        })
        wx.downloadFile({
            url: "https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/20201113/dglg-qrcode.jpg",
            success: result => {
                wx.hideLoading()
                wx.saveImageToPhotosAlbum({
                    filePath: result.tempFilePath,
                    success: () => {
                        wx.showToast({
                            title: '保存成功'
                        })
                    }
                })
            }
        });
    },
    /**
     * 
     */
    tapTabs(e){
        const index = e.currentTarget.dataset.index;
        this.setData({
            selectTab: index,
            searchInput:''
        })
    },
    chooseType(e){
        const index = e.currentTarget.dataset.index;
        this.setData({
            isSelectType: index,
        })
    },
    inputConfirm(e){
        this.setData({
            searchInput:e.detail.value
        })
    },
    /**
     * 确认搜索
     */
    async popComfirm(){
        this.setData({
            isSearch:false
        })
        const { searchInput, selectTab } = this.data;
        wx.showLoading({ title: '内容检测中' });
        const res = await listModel.verifyContent(searchInput);
        if(res == false){
            this.setErrorMessage('搜索内容包含敏感词汇，请修改后重新提交')
            return
        }
        wx.hideLoading();
        let url = ''
        if(selectTab == 1) url = '/pages/discovery/list/search/search?competitionNo=' + searchInput
        if(selectTab == 2) url = '/pages/discovery/list/search/search?nickName=' + searchInput
        wx.navigateTo({url})
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
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

        const {discoverInfo ,discoverId, isSpecial} = this.data
        console.log(discoverId,'12312312')
        // 东莞理工分享
        if(discoverInfo.type == 'DGLG'){
            return {
                title:'第10届老马杯学生摄影十佳评选活动',
                path: `/pages/discovery/list/list?id=${discoverId}&fromShare=1`,
                imageUrl:"https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/333608a25de642959ec4ea9e43a667ce.png"
            }
        }

        if(discoverInfo.type == 'DGLG_2020'){
            return {
                title:'莞工摄影大赛',
                path: `/pages/discovery/list/list?id=${discoverInfo.id}&fromShare=1`,
                imageUrl:"https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/20201113/dglg-banner.png"
            }
        }
        
        // 虎彩30周年分享
        if(discoverInfo.type == 'C'){
            return {
                title:discoverInfo.name,
                path: `/pages/discovery/list/list?id=${discoverId}&fromShare=1&special=${isSpecial ? 1 : null}`,
                imageUrl:"https://hcmtq.oss-accelerate.aliyuncs.com/SystemImg/30fx.jpg"
            }
        }

        // 虎彩30周年分享
        if(discoverInfo.type == 'MXQH_202003'){
            return {
                title:'梦想起航儿童画画大赛',
                path: `/pages/discovery/list/list?id=${discoverId}&fromShare=1&special=${isSpecial ? 1 : null}`,
                imageUrl:"http://hcmtq.oss-cn-hangzhou.aliyuncs.com/Banner/sharetu/share_mxqh.jpg"
            }
        }

        // 普通分享
        return {
            title: discoverInfo.name,
            path: `/pages/discovery/list/list?id=${discoverId}&fromShare=1&special=${isSpecial ? 1 : null}`,
            imageUrl: discoverInfo.banner
        }
    },

    toMyAward(){
        wx.navigateTo({
            url: '/activity/award/award'
        })
    }


})
