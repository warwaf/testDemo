import { Home } from '../home/home-model.js'

var homeModel = new Home()

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        result: '除夕',
        resultList: [],
        //搜索联动
        resultChange: false,
        //搜索到的结果
        resultMsg: false,
        //搜索不到的结果
        resultNone: false,
        inputValue: '',
        isLoding: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    /**
     * 监听input输入框
     */
    watchMsg: function(e) {
        var _this = this
        var msg = e.detail.value
        if (msg != null || msg != undefined) {
            var reg = /^[0-9a-zA-Z]*$/g
            if (!reg.test(msg)) {
                wx.showModal({
                    title: '只能输入英文跟数字',
                    showCancel: false,
                    success: function(res) {
                        _this.setData({
                            inputValue: '',
                            result: ''
                        })
                    }
                })

            }
            this.setData({
                resultChange: true,
                result: msg,
            })
        }
    },
    /**
     * 重新查找
     */
    secondSearch: function() {
        this.setData({
            resultChange: false,
            resultMsg: false,
            resultNone: false,
            inputValue: ''
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    /**
     * 搜索结果(联动)
     */
    result: async function(e) {
        if (this.data.result == '') {
            this.setData({
                resultNone: true
            })
        } else {
            this.setData({
                isLoding: true
            })
            homeModel.getActivityInfo('HC-F-' + this.data.result).then(res => {
                this.setData({
                    isLoding: false
                })
                if (res === undefined || res.length == 0) {
                    this.setData({
                        resultNone: true
                    })
                } else {
                    this.setData({
                        resultList: res,
                        resultNone: false,
                        resultMsg: true
                    })
                }

            })
        }

    },
    /**
     * 删除输入的数据
     */
    close: function() {
        this.setData({
            resultMsg: false,
            resultNone: false,
            resultChange: false,
            inputValue: '',
            result: ''
        })

    },
    /**
     * 返回
     */
    goback(e) {
        wx.switchTab({
            url: '/pages/album/checkin/checkin',
        })
    },

    jump(event) {
        // if(event.currentTarget.dataset['type'] == 0){
        //     wx.navigateTo({
        //         url: `/pages/album/home/home?room_no=${event.currentTarget.dataset['index']}`,
        //     })
        // } else 

        if (event.currentTarget.dataset['type'] == 1) {
            wx.navigateTo({
                url: `/pages/album/beauty/home?room_no=${event.currentTarget.dataset['index']}`,
            })
        } else if(event.currentTarget.dataset['type'] == 10){
            wx.navigateTo({
                url: `/pages/album/beauty2/beauty2?room_no=${event.currentTarget.dataset['index']}`,
            })
        } else if(event.currentTarget.dataset['type'] == 11 || event.currentTarget.dataset['type'] == 12){
            // @param {Number} typeId 11：软订单  12：硬订单
            wx.navigateTo({
                url: `/pages/album/newBeauty/newBeauty?room_no=${event.currentTarget.dataset['index']}&typeId=${event.currentTarget.dataset['type']}`,
            })
        }  else {
            wx.navigateTo({
                url: `/pages/album/home/home?room_no=${event.currentTarget.dataset['index']}`,
            })
        }
    }
})