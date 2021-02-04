var app = getApp()
import { Beauty } from '../beauty-model.js'
var beautyModel = new Beauty()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        urls:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        beautyModel.getScene().then(res=>{
            if(res.code == 200){
                this.setData({
                    urls:res.result
                })
            }else{
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 1000
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    goBack(){
        wx.navigateBack({
            delta:1
        })
    }
})