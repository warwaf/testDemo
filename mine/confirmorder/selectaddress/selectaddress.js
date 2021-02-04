// pages/mine/confirmorder/selectaddress/selectaddress.js
import { Selectaddress } from './selectaddress-model.js'
var selectaddressModel = new Selectaddress()

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addresslist:[
            { name: '张三', phone: '136***2343', address:'广东省东莞市南城区胜和广场广东省东莞市南城区胜和广场'},
            { name: '张三', phone: '136***2343', address: '广东省东莞市南城区胜和广场' }
        ],
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { addresslist } = this.data
        addresslist.map((item,index) => {
            item.select = 'false'
            item.id = index
        })
        this.setData({
            addresslist
        })
    },
    /**
     * 选择某个地址
     */
    select(e){
        const { addresslist } = this.data
        let id = e.currentTarget.dataset['index']
        addresslist.map((item,index) => {
            if (id == item.id) item.select = 'true'
            else item.select = 'false'
        })
        this.setData({
            addresslist
        })
    },
    /**
     * 新增地址
     */
    addAddress(){
        wx.navigateTo({
            url: '/pages/mine/confirmorder/addaddress/address?type=1',
        })
    },
    /**
     * 编辑地址
     */
    editAddress(){
        wx.navigateTo({
            url: `/pages/mine/confirmorder/addaddress/address?type=2`,
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