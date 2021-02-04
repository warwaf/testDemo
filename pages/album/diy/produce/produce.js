import { Diy } from '../diy-model'

var diyModel = new Diy()
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        diyModel.createDiy().then(url => {
            console.log(url);

            this.setData({
                url: url.replace('http://','https://')
            })
        })
    },

    completed(){

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
})