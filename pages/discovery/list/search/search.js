import { List } from '../list-model.js'

var listModel = new List()

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
        isShowTools: false,
        isSearch: false,
        selectTab:1,
        competitionNo:null,
        nickName:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        const {unionid, discoverInfo} = app.globalData;
        const { competitionNo, nickName } = options;
        wx.setNavigationBarTitle({
            title:'搜索'
        })

        //导航栏标题
        wx.setNavigationBarColor({
            backgroundColor: '#fff',
            frontColor:'#000000'
        })

        this.setData({
            bannerUrl: discoverInfo.banner,
            discoverId: discoverInfo.id,
            isSpecial: Boolean(options.special),
            competitionNo:competitionNo ? competitionNo : null,
            nickName: nickName ? nickName : null
        })

        this.loadNewestData()
       
    },
    onReachBottom(){
        this.loadNewestData();
    },
    loadNewestData(){
        this.setData({ isLoading: true })
        const { competitionNo, nickName } = this.data;
        listModel.getNewest(
            app.globalData.discoverInfo.id, 
            this.data.pageNum, 
            this.data.pageSize, competitionNo, nickName
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
           isShowCoupon: false
       })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
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
            url: `/pages/discovery/hot/hot?special=${this.data.isSpecial ? 1 : ''}`,
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
            console.log(e.detail)
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
        wx.redirectTo({
            url: '/pages/discovery/arrange/arrange?id=' + app.globalData.discoverInfo.id,
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
        if(info == 'entry' || info == 'ranking'){
            wx.navigateTo({
                url:'/activity/anniversary/anniversary'
            })
        }else if(info == 'prize'){
            wx.navigateTo({
                url:'/activity/anniversary/anniversary'
            })
        }else{
            this.setData({
                isSearch:true
            })
        }
    },
    /**
     * 
     */
    tapTabs(e){
        const index = e.currentTarget.dataset.index;
        this.setData({
            selectTab: index
        })
    },
    /**
     * 确认搜索
     */
    popComfirm(){
        this.setData({
            isSearch:false
        })
    }
})