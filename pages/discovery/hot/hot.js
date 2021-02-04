import { Hot } from './hot-model.js'
import { async } from '../../../utils/runtime.js'
import { Index } from '../index/index-model'
var indexModel = new Index()
var hotModel = new Hot()

var app = getApp()
var columnWidth = Math.floor(wx.getSystemInfoSync().windowWidth / 2)

Page({

    /**
     * 页面的初始数据
     */
    data: {
        photo: [],
        photos: [],
        bannerUrl: '',
        manuStat: true,
        finished: false,
        pageNum: 1,
        pageSize: 10,
        isEmpty: false,
        isLoading: false,
        isCreate:false,
        shareStat:false,
        fromShare:false,
        isShowTools:false,
        isSearch: false,
        selectTab:1,
        searchInput:'',
        error: false,
        isSignUP:false,
        showTypeDialog:false,
        isSelectType:null
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
        //导航栏标题
        wx.setNavigationBarTitle({
            title: `${app.globalData.discoverInfo.name}`
        })
        const { fromShare } = options
        const { unionid , discoverInfo } = app.globalData;

        if(fromShare){
            listModel.checkStat(unionid,'DGLG_2020').then(res=>{
                if(res.result){
                    this.setData({
                        isSignUP: true
                    })
                }
            })
        }
        // 报名状态
        if(discoverInfo.type == 'DGLG_2020'){
            hotModel.checkStat(unionid,'DGLG_2020').then(res=>{
                if(res.result){
                    this.setData({
                        isSignUP: true
                    })
                }
            })
        }

        this.setData({
            bannerUrl: app.globalData.discoverInfo.banner,
            isSpecial: Boolean(options.special),
            isShowTools: options.type,
            discoverInfo: app.globalData.discoverInfo,
            isLoading: true
        })

        this.loadHotestData()
    },

    loadHotestData(){
        hotModel.getHotest(app.globalData.discoverInfo.id, this.data.pageNum, this.data.pageSize).then(data => {
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
            // this.recuriveLoad(data.result, 0)
            this.data.pageNum++
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
    chooseType(e){
        const index = e.currentTarget.dataset.index;
        this.setData({
            isSelectType: index,
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
    /**
     * 点击 tools
     */
    tapTools(e){
        const info = e.currentTarget.dataset.info;
        const { mta, discoverInfo, unionid } = app.globalData;
        let event = ''
        var baseUrl = '/activity/anniversary/anniversary'
        if(this.data.isShowTools == "DGLG") baseUrl = '/activity/engineering/engineering'
        if(info == 'entry' || info == 'ranking'){
            event = 'c_mtq_Dynamics_Banner_Competition'
            if(info == 'entry') event = 'c_mtq_Dynamics_Banner_RankingList'
            wx.navigateTo({
                url:`${baseUrl}?type=${info}&id=${discoverInfo.id}`
            })
        }else if(info == 'prize'){
            event = 'c_mtq_Dynamics_Banner_Prizes'
            wx.navigateTo({
                url:`${baseUrl}?type=${info}&id=${discoverInfo.id}`
            })
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
        }else if(info == 'search'){
            event = 'c_mtq_Dynamics_Banner_Search'
            this.setData({
                isSearch:true,
                searchInput:''
            })
        }else{
            // 分享
            this.setData({
                shareStat: true
            })
        }
        mta.Event.stat(event,{'activity':discoverInfo.id,count:unionid})
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
     * 递归加载图片
     */
    recuriveLoad: function (list, counter) {
        //图片路径为空 跳过
        if (!list[counter].url) {
            this.recuriveLoad(list, ++counter)
            return
        }
        wx.getImageInfo({
            src: list[counter].url.replace('http://','https://'),
            success: img => {
                list[counter].height = Math.floor(img.height / (img.width / columnWidth))
                list[counter].origin_height = img.height
                list[counter].origin_width = img.width
                list[counter].index = this.data.photos.length
                this.data.photos.push(list[counter])
                this.setData({
                    photo: list[counter],
                    photos: this.data.photos,
                    finished: true
                })
                if (counter < list.length - 1) {
                    this.recuriveLoad(list, ++counter)
                }
            }
        })
    },

    /**
     * 跳转到详情页
     */
    showDetail(event) {

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
            isSearch:false,
        })
        const { searchInput, selectTab } = this.data;
        wx.showLoading({ title: '内容检测中' });
        const res = await hotModel.verifyContent(searchInput);
        if(res == false){
            this.setErrorMessage('搜索内容包含敏感词汇，请修改后重新提交')
            return
        }
        wx.hideLoading();
        let url = ''
        if(selectTab == 1) url = '/pages/discovery/list/search/search?competitionNo=' + searchInput
        if(selectTab == 2) url = '/pages/discovery/list/search/search?nickName=' + searchInput
        wx.navigateTo({ url })
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
        const {discoverInfo ,discoverId} = this.data
        if(app.globalData.discoverInfo.type == 'DGLG'){
            return {
                title:'第10届老马杯学生摄影十佳评选活动',
                path: `/pages/discovery/list/list?id=${discoverId}&fromShare=1`,
                imageUrl:"https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/333608a25de642959ec4ea9e43a667ce.png"
            }
        }

        if(app.globalData.discoverInfo.type == 'DGLG_2020'){
            console.log(`/pages/discovery/list/list?id=${discoverInfo.id}&fromShare=1`)
            return {
                title:'莞工摄影大赛',
                path: `/pages/discovery/list/list?id=${discoverInfo.id}&fromShare=1`,
                imageUrl:"https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/activity/20201113/dglg-banner.png"
            }
        }
        return {
            title: discoverInfo.name,
            path: `/pages/discovery/list/list?id=${discoverId}&fromShare=1`,
            image: this.data.isShowTools == 'DGLG' ? 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/333608a25de642959ec4ea9e43a667ce.png' : ''
        }
    }
})