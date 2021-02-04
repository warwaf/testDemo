// pages/mine/dynamic/dynamic.js
var px2rpx = 2, windowWidth = 375;
import { Dynamic } from './dynamic-model.js'
var dynamicModel = new Dynamic()

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        msgList: [{ value: '11', msg: '粉丝' }, { value: '11', msg: '关注' }, { value: '11', msg: '信息' }],
        albumList: [],
        imgSize: [],
        heightContent: 0,
        //顶部部分信息隐藏
        topHide: true,
        positionTop: true,
        lenList: [],
        height: 0,
        top: 0,
        scrollTop: 0,
        pageSize:100,
        pageNum:1,
        pagePrev:0,
        show:false,
        msg:true,
        isLoading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        this.setData({ isLoading: true  })
        //获取手机屏幕的高度
        wx.getSystemInfo({
            success: function (res) {
                windowWidth = res.windowWidth;
                px2rpx = 750 / windowWidth;
                _this.setData({
                    height: res.windowHeight
                })
            }
        })
        dynamicModel.listByUnionId(app.globalData.unionid,_this.data.pageNum, _this.data.pageSize).then(res => {
            var albumList = _this.data.albumList
            if (res.result.length != 0){
                _this.setData({
                    albumList: res.result,
                })
            }
            this.setData({
                isLoading: false
            })
        })
    
    },
    /**
  * 图片的宽度、高度不能超过规定的最大值
  */
    imgLoad: function (e) {
        var left = e.target.dataset.left,
            right = e.target.dataset.right,
            width = e.detail.width * px2rpx,
            height = e.detail.height * px2rpx,
            ratio = width / height;
        var viewWidth = 380, viewHeight = 380, viewRatio = viewWidth / viewHeight;
        if (ratio >= viewRatio) {
            if (width >= viewWidth) {
                viewHeight = 380 / ratio
            } else {
                viewWidth = viewWidth
                viewHeight = 380 / ratio
            }
        } else {
            if (height >= viewHeight) {
                viewWidth = 380 * ratio
                viewHeight = viewHeight

            } else {
                viewWidth = 380 * ratio
                viewHeight = viewHeight
            }
        }
        var img = this.data.imgSize;
        img.push(
            {
                name: left + '-' + right,
                width: viewWidth,
                height: viewHeight
            }
        )
        this.setData({
            imgSize: img
        })
    },
    /**
     * 滚动
     */
    onPageScroll(event) {
        this.setData({
            scrollTop: event.scrollTop
        })
    },
    /**
    * 详情页
    */
    detail(e){
        var unionid = e.currentTarget.dataset.unionid
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/discovery/detail/detail?unionId=${unionid}&id=${id}`,
        })
    },
    /**
    * 返回
    */
    goback(e) {
        if (e.detail == 'goto') {
            wx.switchTab({
                url: '/pages/mine/home/mine',
            })
        }
    },
    /**
     * 发布动态页面
     */
    goTo: function () {
        wx.navigateTo({
            url: '/pages/discovery/create-dynamics/create-dynamics?id=0',
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})