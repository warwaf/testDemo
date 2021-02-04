var app = getApp();
import regeneratorRuntime from '../../../../utils/runtime';
import { Search } from '../search-model.js'
const searchModel = new Search();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarList: [],
        pageNo: 1,
        pageSize: 30,
        total: null,
        pages: null,
        isLoading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //json文件配置失效
        wx.setNavigationBarTitle({
            title: '照片搜索'
        })

        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff'
        })
        
        this.getAll();
    },
    async getAll() {
        const { pageNo, pageSize, avatarList } = this.data;
        const activityId = app.globalData.activityInfo.activityId;
        this.setData({ isLoading: true })
        const res = await searchModel.listAll({ activityId, pageNo, pageSize });
        if (res.code == 200) {
            const { list, pages, total } = res.result;
            const temp = avatarList.concat(list)
            this.setData({
                avatarList: temp,
                pages,
                total,
                isLoading: false
            })
        } else {
            // todo 跳转到失败
            this.setData({ isLoading: false })
        }

    },
    addPages() {
        const pageNo = this.data.pageNo;
        this.setData({
            pageNo: pageNo + 1
        });
        this.getAll();
    },
    /**
     *  查找某个人的照片
     */
    searchwho: function(e) {
        const { info } = e.currentTarget.dataset;
        app.globalData.searchInfo = info
        wx.redirectTo({
            url: `/pages/album/search/searchresult/searchresult`,
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
})