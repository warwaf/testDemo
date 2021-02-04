// pages/discovery/hishomepage/hishomepage.js
var px2rpx = 2,
    windowWidth = 375;

import {
    Hishomepage
} from './hishomepage-model.js'
var hishomepageModel = new Hishomepage()

import {
    Detail
} from '../../album/detail/detail-model.js'
var detailModel = new Detail()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        msgList: [{
            value: '11',
            msg: '粉丝'
        }, {
            value: '11',
            msg: '关注'
        }],
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
        pageNum: 1,
        pageSize: 40,
        isFollow: false,
        isSelf: false
    },
    onPageScroll(event) {
        //导航栏文字跟背景色的变化
        if (event.scrollTop >= 50) {
            //   wx.setNavigationBarTitle({
            //     title: this.data.hhpMsg,
            //   })
            //   wx.setNavigationBarColor({
            //     frontColor: '#000000',
            //     backgroundColor: '#ffffff',
            //   })
            this.setData({
                //topHide:false,
                // positionTop:false
            })
        } else {
            wx.setNavigationBarTitle({
                title: '',
            })
            wx.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#FFE300',
            })
            this.setData({
                //topHide: true,
                // positionTop: true
            })
        }
        this.setData({
            scrollTop: event.scrollTop
        })
    },
    onLoad: function(options) {
        console.log(options.unionId == getApp().globalData.userInfo.unionId)
        var that = this
        //获取手机屏幕的高度
        wx.getSystemInfo({
            success: function(res) {
                windowWidth = res.windowWidth;
                px2rpx = 750 / windowWidth;
                that.setData({
                    height: res.windowHeight
                })
            }
        })
        hishomepageModel.listByUnionId(options.unionId, this.data.pageNum, this.data.pageSize).then(res => {
            var albumList = this.data.albumList
            this.setData({
                albumList: res.result,
                isSelf: options.unionId == getApp().globalData.userInfo.unionId
            })
        })
        //获取用户的基本信息
        hishomepageModel.getUserPhoneByUnionId(options.unionId).then((res) => {
            this.setData({
                userInfo: res.result,
            })
        })

        detailModel.isFollow(options.unionId).then(res => {
            this.setData({
                isFollow: res.result
            })
        })

    },
    /**
     * 图片的宽度、高度不能超过规定的最大值
     */
    imgLoad: function(e) {
        var left = e.target.dataset.left,
            right = e.target.dataset.right,
            width = e.detail.width * px2rpx,
            height = e.detail.height * px2rpx,
            ratio = width / height;
        var viewWidth = 380,
            viewHeight = 380,
            viewRatio = viewWidth / viewHeight;
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
        img.push({
            name: left + '-' + right,
            width: viewWidth,
            height: viewHeight
        })
        this.setData({
            imgSize: img
        })
    },
    /**
     * 详情页
     */
    detail(e) {
        var unionid = e.currentTarget.dataset.unionid
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/discovery/detail/detail?unionId=${unionid}&id=${id}`,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    //监听屏幕滚动 判断上下滚动
    // onPageScroll: function (ev) {
    //     var top = ev.scrollTop
    // },
    onReady: function() {
        // wx.getImageInfo({
        //   src: this.data.tempFilePaths, 
        //   success: function (res) { 
        //     var list = this.data.albumList
        //     var aa
        //     list.forEach((list, index) => {
        //       aa = this.data.albumList[index].imgList
        //       aa.forEach((item, index) => {
        //         var img = item.img[0]
        //       })
        //     })
        //    }
        // })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        if (this._observerHeader) this._observerHeader.disconnect()
        if (this._observerFooter) this._observerFooter.disconnect()
    },

    toFollow() {
        if(JSON.stringify(getApp().globalData.userInfo) == '{}'){
            return this.setData({
                authorityTips: true
            })
        }
        if(this.data.isFollow){
            detailModel.cancleFollow(this.data.userInfo.unionId).then(res => {
                wx.showToast({
                    title: '取消关注成功',
                    icon: 'none'
                })
                this.setData({
                    isFollow: false
                })
            })
        }else{
            detailModel.addFollow(this.data.userInfo.unionId).then(res => {
                wx.showToast({
                    title: '关注成功',
                    icon: 'none'
                })
                this.setData({
                    isFollow: true
                })
            })
        }
    },

    onGotUserInfo(e) {
        detailModel.updateUserInfo(e).then(() => {
            this.setData({
                authorityTips: false
            })
        })
    },

    hideAuthority(){
        this.setData({
            authorityTips: false
        })
    }
})