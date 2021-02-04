import ActivityModel from '../activity-model'

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        rooms:[],
        authorityTips: false,
        anonymous: false,
        showTools: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        var res = await ActivityModel.getRooms('https://mtqcshi.hucai.com/test/tp-rooms.json')
        this.setData({
            rooms: res.rooms
        })
        
        //获取unionId
        try {
            await ActivityModel.getUnionid()
        } catch (error) {
            this.setData({
                anonymous: true
            })
        }
    },

    onGotUserInfo(e) {
        ActivityModel.updateUserInfo(e).then(() => {
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

    toHome(){
        if(this.data.anonymous){
            return this.setData({
                authorityTips: true
            })
        }
        wx.switchTab({
            url: '/pages/album/checkin/checkin'
        })
    },

    toAr(){
        wx.navigateTo({
            url: '/pages/common/ar/ar'
        })
    },

    toRoom(e){
        wx.navigateTo({
            url: `/pages/album/home/home?room_no=${e.currentTarget.dataset.id}`
        })
    },

    onPageScroll(){
        if(this.data.showTools){
            this.setData({
                showTools: false
            })
        }
        if(this.scrollTimer){
            clearTimeout(this.scrollTimer)
        }
        this.scrollTimer = setTimeout(() => {
            this.setData({
                showTools: true
            })
        }, 500);
    },

    showDesc(){
        wx.navigateTo({
            url: './detail/detail'
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: '跨界而变 领鲜未来',
            path: '/activity/tpLive/live',
            imageUrl: 'https://hcmtq.oss-cn-hangzhou.aliyuncs.com/resource2020/v1.9.2/share.jpg'
        }
    },
})