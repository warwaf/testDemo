// pages/discovery/index.js
import { Index } from './index-model.js'
import { List } from '../list/list-model.js'
import { getCoordinate, getLocaltionByCoordinate } from '../../../utils/util'

var indexModel = new Index()
var app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        isIPX: app.globalData.isIPX,
        imgUrls: [],
        discoverList: [],
        discoverLoading: false,
        movementList: [],
        scrollTop: 0,
        pageNum: 1,
        pageSize: 5,
        pageFlag: 0,    //与页数做比较的标志
        neverCreate: true,
        btnStat: false,
        isLoading: false,
        refreshing: false,
        showList: true,
        authorize: true,    //地址授权
        anonymous: false,   //用户信息为空
        city: '',
        //风格
        showStyleList: false,
        curStyle: '',
        styleList: [],
        curSelectStyle: {},

        isSearch: false, // 控制门店搜索弹窗
        shopName: "", // 门店名称
        resUnionId: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
        this.loadStyleList(options.styleKey)
        // if (options._mta_ref_id) {
        const res = await indexModel.getUnionid()
        if(!res){
            wx.navigateTo({
                url: '/pages/common/userinfo/userinfo',
            })
            return
        } else {
            app.globalData.unionid = res.unionid
            this.setData({
                resUnionId: res.unionid
            })
        }
        // }
        if(app.globalData.globalStoreId && app.globalData.globalStoreId != 0){
            wx.redirectTo({
                url: `/pages/discovery/store/store?special=1&id=${app.globalData.globalStoreId}`
            })
            return
        }
        this.data.pageNum = 1
        this.setData({
            movementList: [],
            showStyleList: Boolean(options.type == '1')
        })
        // this.loadMovement()
            //如果已经创建过活动就不显示动画了
        if (wx.getStorageSync('firstCreateActivity')) {
            this.setData({
                neverCreate: false
            })
        }
        app.globalData.mta.Event.stat('c_mtq_Dynamics_Banner_channel',{ 
            'count': app.globalData.unionid,
            'channel': options._mta_ref_id
        })
    },

    onShow: function() {
        if (app.globalData.styleKey) {
            this.loadStyleList(app.globalData.styleKey)
        }
        if(app.globalData.globalStoreId && app.globalData.globalStoreId != 0) return
        indexModel.listLevel(1, 1, 10).then(res => {
            this.setData({
                imgUrls: res.result
            })
        })
        this.setData({ 
            isLoading: true,
            anonymous: !(Boolean(app.globalData.userInfo) && JSON.stringify(app.globalData.userInfo) != '{}')
        })
        this.loadList()
    },
    watchInput (e) {
        console.log("input", e)
        let val = e.detail.value
        this.setData({
            shopName: val
        })
    },
    /**
     * 门店搜索-确认按钮
     */
    confirmSearch () {
        console.log(this.data.shopName)
        if (this.data.shopName == "") {
            wx.showToast({
                title: "请输入门店名称",
                icon: "none"
            })
            return
        }
        wx.navigateTo({
            url: `/pages/discovery/store/storeSearch/storeSearch?shopName=${this.data.shopName}&city=${this.data.city}`
        })
        this.setData({
            isSearch: false,
            shopName: ""
        })
        this.getTabBar().show()
    },
    /**
     * 关闭门店搜索弹窗
     */
    closeShowSearch () {
        this.setData({
            isSearch: false,
            shopName: ""
        })
        this.getTabBar().show()
    },
    /**
     * 展示门店搜索弹窗
     */
    showSearch () {
        // setTimeout(() => {
        this.setData({
            isSearch: true
        })
        // }, 150)
        this.getTabBar().hide()
    },
    async loadList(){
            var coordinate = {
                latitude: '',
                longitude: ''
            }
            try {
                coordinate = await getCoordinate()
                this.setData({
                    authorize: true
                })
            } catch (error) {
                this.setData({
                    authorize: false
                })
            }

            if(app.globalData.currentCity){
                coordinate.name = app.globalData.currentCity
                this.setData({
                    city: coordinate.name
                })
            }else{
                try {
                    var city = await getLocaltionByCoordinate(coordinate.latitude, coordinate.longitude)
                    coordinate.name = city.replace('市','')
                    this.setData({
                        city: city.replace('市','')
                    })
                } catch (error) {
                    coordinate.name = '深圳'
                    this.setData({
                        city: '未知'
                    })
                }
            }
            // indexModel.listSpecial(coordinate.latitude, coordinate.longitude, coordinate.name, this.data.curStyle).then(result => {
            //     this.setData({
            //         discoverList: result.result,
            //         discoverLoading: true,
            //         isLoading: false
            //     })
            // })      
            let unionid = app.globalData.unionid ? app.globalData.unionid : this.data.resUnionId ? this.data.resUnionId : "",
                curStyleKey = this.data.curSelectStyle.theKey ? this.data.curSelectStyle.theKey : ""
            indexModel.getStoreList(coordinate.latitude, coordinate.longitude, unionid, "", coordinate.name, curStyleKey, "").then(result => {
                this.setData({
                    discoverList: result.result,
                    discoverLoading: true,
                    isLoading: false
                })
            })        
    },
    /**
     * 加载风格列表
     */
    async loadStyleList(styleKey){
        // var res = await indexModel.getStyleList()
        // this.setData({ styleList: res.result })
        let res = await indexModel.getCommonProperties(),
            list = res.result
        this.setData({ styleList: list })
        if (styleKey) {
            let curStyle = list.find(item => {
                return item.theKey == styleKey
            })
            console.log(">>>", curStyle)
            return this.setData({
                "curSelectStyle.theKey": curStyle.theKey,
                "curSelectStyle.theValue": curStyle.theValue,
                curStyle: curStyle.theValue
            })
        }
        list.forEach(item => {
            if (item.defaultFlag) {
                this.setData({
                    "curSelectStyle.theKey": item.theKey,
                    "curSelectStyle.theValue": item.theValue,
                    curStyle: item.theValue
                })
            }
        })
    },
    /**
     * 加载动态(弃用)
     */
    loadMovement() {
        this.setData({ isLoading: true })
        indexModel.getAllMovement(this.data.pageNum, this.data.pageSize).then(res => {
            if (res.result.length == 0) {
                wx.showToast({
                        title: '没有更多的动态了',
                        icon: 'none'
                    })
                return
            }
            this.setData({
                movementList: this.data.movementList.concat(res.result),
                pageNum: this.data.pageNum + 1,
                showList: true,
                isLoading: false
            })
            wx.stopPullDownRefresh();
            var count = 0
                //获取每张图片宽高，宽高比不同的图片用不同定比展示
            res.result.forEach((item, index) => {
                res.result[index].scrollDistance = 0
                if (!item.cover) {
                    if (++count == res.result.length) {
                        // wx.hideLoading()
                        this.setData({ isLoading: false })
                        return
                    }
                }
                wx.request({
                    url: item.cover.replace('http://', 'https://') + '?x-oss-process=image/info',
                    success: result => {
                        let position = (this.data.pageNum - 2) * this.data.pageSize + index
                        var ratio = parseInt(result.data.ImageWidth.value) / parseInt(result.data.ImageHeight.value)
                        this.setData({
                                ['movementList[' + position + '].type']: parseInt(result.data.ImageWidth.value) >= parseInt(result.data.ImageHeight.value),
                                ['movementList[' + position + '].special']: ratio > 1.7
                            })
                            //此次所有图片信息获取完毕
                        if (++count == res.result.length) {
                            // this.data.isLoading = false
                            wx.hideLoading()
                            this.setData({ isLoading: false })
                        }
                    }
                })
            })
        })
    },

    // onPullDownRefresh() {
    //     this.setData({
    //         showList: false,
    //         movementList: []
    //     })
    //     this.data.pageNum = 1
    //     this.loadList();
    //     this.loadMovement();
    // },

    /**
     * 下拉刷新
     */
    // onReachBottom() {
        // this.loadMovement()
    // },

    /**
     * 监听屏幕滚动 判断上下滚动
     */
    onPageScroll: function(e) {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(function() {
            this.getTabBar().show();
            delete this.timeoutId;
        }.bind(this), 500);
        var top = e.scrollTop //当前页面被卷去的高度
        var curIndex = 1,
            curMovement, smallItemHeight = 270,
            bigItemHeight = 370,
            bannerHeight = 172
            //获取当前视口中展示的 movementList 的索引
        var distanceToTop = bannerHeight + 236 * this.data.discoverList.length //循环存放元素到顶部的距离
        for (let i = 0; i < this.data.movementList.length; i++) {
            if (Math.abs(top - distanceToTop) > 80 && Math.abs(top - distanceToTop) < 220) {
                curIndex = i
                curMovement = this.data.movementList[i]
            }
            // if (curHeight- top >= -1 * smallItemHeight && curHeight - top < 2 * smallItemHeight) {
            //     curIndex = i
            // curMovement = this.data.movementList[i]
            // }
            distanceToTop += this.data.movementList[i].type ? smallItemHeight : bigItemHeight
        }

        if (!curMovement) {
            return
        }

        var realHeight = Math.floor((335 / curMovement.width) * curMovement.height)

        if (e.scrollTop > this.data.scrollTop || e.scrollTop == wx.getSystemInfoSync().windowHeight) {
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                this.getTabBar().hide()
            }
            // this.setData({
            //     move: 'up'
            // })
            if (curMovement.type) {
                if (realHeight > 200 && curMovement.scrollDistance >= 0) {
                    this.setData({
                        ["movementList[" + curIndex + "].scrollDistance"]: Math.abs(200 - realHeight) > 50 ? -50 : (200 - realHeight)
                    })
                }
            } else {
                if (realHeight > 300 && curMovement.scrollDistance >= 0) {
                    this.setData({
                        ["movementList[" + curIndex + "].scrollDistance"]: Math.abs(300 - realHeight) > 50 ? -50 : (300 - realHeight)
                    })
                }
            }
        } else {
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                this.getTabBar().show()
            }
            // this.setData({
            //     move: 'down'
            // })

            if (curMovement.scrollDistance <= 0) {
                this.setData({
                    ["movementList[" + curIndex + "].scrollDistance"]: 0
                })
            }
        }
        this.setData({
            scrollTop: e.scrollTop,
        })

    },
    /**
     * 单个公共相册列表
     */
    list: function(e) {
        var discoverInfo = e.currentTarget.dataset['info']
        app.globalData.discoverInfo = discoverInfo
        wx.navigateTo({
            url: `/pages/discovery/store/store?special=1&id=${discoverInfo.storeId}`,
        })
    },
    /**
     * 动态详情
     */
    detail: function(e) {
        var movementInfo = e.currentTarget.dataset['info']
        indexModel.addMovementHot(0, movementInfo.id, 1)
        app.globalData.discoverInfo = {};
        wx.navigateTo({
            url: `/pages/discovery/detail/detail?id=${movementInfo.id}&unionId=${movementInfo.unionId}`,
        })
    },
    /**
     * 单个公共相册列表
     */
    jump: function(e) {
        app.globalData.discoverInfo = e.detail
        wx.navigateTo({
            url: `/pages/discovery/list/list`,
        })
    },
    /**
     * 他的个人中心
     */
    hishomepage: function(e) {
        wx.navigateTo({
            url: '/pages/discovery/hishomepage/hishomepage?unionId=' + e.currentTarget.dataset.id,
        })
    },

    /**
     * 发布动态
     */
    createDynamics: function() {
        if(this.data.anonymous){
            this.getTabBar().hide()
            return this.setData({
                authorityTips: true
            })
        }
        wx.setStorageSync('firstCreateActivity', true)
        wx.navigateTo({
            url: '/pages/discovery/create-dynamics/create-dynamics?id=0',
        })
    },

    /**
     * 返回顶部
     */
    backTop: function() {
        wx.pageScrollTo({
            scrollTop: 0,
        })
    },
    /**
     * 图片渲染完成
     */
    imgLoadEvent(e) {
        var curIndex = e.currentTarget.dataset.index
        this.data.movementList[curIndex].width = e.detail.width
        this.data.movementList[curIndex].height = e.detail.height

        // this.setData({
        //     ["movementList[" + curIndex + "].width"]: e.detail.width,
        //     ["movementList[" + curIndex + "].height"]: e.detail.height
        // })
    },
    /**
     * 重新授权
     */
    toAuthorize(){
        wx.openSetting({
            success (res) {
                console.log(res.authSetting)
            }
        })
    },

    onGotUserInfo(e) {
        indexModel.updateUserInfo(e).then(() => {
            this.setData({
                authorityTips: false,
                anonymous: false
            })
        })
    },

    hideAuthority(){
        this.getTabBar().show()
        this.setData({
            authorityTips: false
        })
    },

    changeCity(){
        wx.navigateTo({
            url: `/pages/discovery/citySelector/citySelector?city=${this.data.city}`,
        })
    },

    styleItemTapHandler(e){
        let data = e.currentTarget.dataset,
            item = data.item
        this.setData({ curSelectStyle: item ? item : {} })
    },

    confirmStyle(){
        wx.showLoading()
        this.setData({ curStyle: this.data.curSelectStyle.theValue || '', showStyleList: false }, this.loadList)
        wx.hideLoading()
        console.log(this.data.curStyle, this.data.curSelectStyle)
    },

    switchStyleListVisiable(){
        this.setData({ showStyleList: !this.data.showStyleList })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        // const { isSpecial } = this.data

        // 普通分享
        // console.log(`/pages/discovery/index/index?fromShare=1&special=${isSpecial ? 1 : null}&discoverId=${app.globalData.globalStoreId}`);
        
        // return {
        //     title: discoverInfo.name,
        //     path: `/pages/discovery/index/index?fromShare=1&special=${isSpecial ? 1 : null}&discoverId=${app.globalData.globalStoreId}`,
        //     imageUrl: discoverInfo.banner
        // }
    },
})
