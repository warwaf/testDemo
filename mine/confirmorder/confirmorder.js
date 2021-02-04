// pages/mine/confirmorder/confirmorder.js
import { Confirmorder } from './confirmorder-model.js'
var confirmModel = new Confirmorder()

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        diylist: [
            { img: 'https://img.alicdn.com/tps/i4/TB1TQ7NN9rqK1RjSZK9SutyypXa.jpg_310x310q100.jpg_.webp', real: '11', assess: '222', title: '商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称', size: '179*149mm', color: '玫瑰色', apply: '场景' }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { diylist } = this.data
        diylist.map((item, i) => {
            item.title = item.title.length > 13 ? item.title.substr(0, 13) + '...' : item.title
        })
        this.setData({
            diylist
        })
    },
    /**
     * 编辑地址
     */
    editAddress(){
        wx.navigateTo({
            url: '/pages/mine/editaddress/editaddress',
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

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