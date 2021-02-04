// pages/mine/follow/follow.js
import { Mine } from '../../pages/mine/mine-model.js'
import { Detail } from '../../pages/album/detail/detail-model.js'

var mineModel = new Mine()
var detailModel = new Detail()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        followStat: false,
        fans: [],
        follows: [],
        recommendation: [],
        isLoading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            followStat: options.id == 1
        })
        wx.setNavigationBarTitle({
            title: options.id == 1 ? '关注' : '粉丝'
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({ isLoading: true })
        mineModel.getFllows().then(res => {
            res.result.fans.forEach((fans, index) => {
                detailModel.isFollow(fans.unionId).then(res => {
                    this.setData({
                        ['fans[' + index + '].isFollow']: res.result
                    })
                })
            })
            this.setData({
                follows: res.result.follows,
                fans: res.result.fans,
                isLoading: false
            })
        })
    },

    switchTab(e) {
        this.setData({
            followStat: Boolean(e.currentTarget.dataset.id)
        })
        wx.setNavigationBarTitle({
            title: e.currentTarget.dataset.id == 1 ? '关注' : '粉丝'
        })
    },

    toCreate() {
        wx.navigateTo({
            url: '/pages/discovery/create-dynamics/create-dynamics?id=0',
        })
    },

    toPersonal(e) {
        wx.navigateTo({
            url: '/pages/discovery/hishomepage/hishomepage?unionId=' + e.currentTarget.dataset.id
        })
    },

    /**
     * 粉丝 --> 关注/取消
     */
    toFollow(e) {
        if (!this.data.fans[e.currentTarget.dataset.index].isFollow) {
            detailModel.addFollow(e.currentTarget.dataset.item.unionId).then(res => {
                wx.showToast({
                    title: '关注成功',
                    icon: 'none'
                })
                this.setData({
                    ['fans[' + e.currentTarget.dataset.index + '].isFollow']: true,
                    follows: this.data.follows.concat(e.currentTarget.dataset.item)
                })
            })
        } else {
            detailModel.cancleFollow(e.currentTarget.dataset.item.unionId).then(res => {
                wx.showToast({
                    title: '取消关注成功',
                    icon: 'none'
                })
                this.setData({
                    ['fans[' + e.currentTarget.dataset.index + '].isFollow']: false
                })
                this.data.follows.forEach((item, index) => {
                    if (item.unionId == e.currentTarget.dataset.item.unionId) {
                        this.data.follows.splice(index, 1)
                        this.setData({
                            follows: this.data.follows
                        })
                    }
                })
            })
        }
    },
    /**
     * 关注 --> 取消关注
     */
    cancleFollow(e) {
        detailModel.cancleFollow(e.currentTarget.dataset.item.unionId).then(res => {
            this.data.follows.splice(e.currentTarget.dataset.index, 1)
            this.setData({
                follows: this.data.follows
            })
            wx.showToast({
                title: '取消关注成功',
                icon: 'none'
            })
            this.data.fans.forEach((item, index) => {
                if (item.unionId == e.currentTarget.dataset.item.unionId) {
                    this.setData({
                        ['fans[' + index + '].isFollow']: false
                    })
                }
            })
        })
    }
})