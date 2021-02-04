// pages/album/beauty/filterResult/filterResult.js
var praiseArr = []

Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: {
            name: ''
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var data = getApp().globalData.filterResult;
        console.log(data)
        data.pics.forEach((item, index) => {
            data.pics[index].index = index
        })
        this.setData({
            data
        })
    },

    toDetail(event) {
        var currentIndex = event.detail.index
        getApp().globalData.photoArr = this.data.data.pics
        console.log(event.detail.position)
        wx.navigateTo({
            url: '/pages/album/beauty/detail/detail?index=' + event.detail.position,
        })

    },

    praise(picId, praiseCount) {
        praiseArr.push({
            picId,
            praiseCount
        })
    },

    onShow() {
        if (praiseArr.length > 0) {
            this.setData({
                praiseArr
            })
        }
        praiseArr = []
    },
})