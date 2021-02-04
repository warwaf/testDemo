// pages/mine/confirmorder/addaddress/address.js
import { Addaddress } from './address-model.js'
var addaddressModel = new Addaddress()

const app = getApp()



Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultRadio:false,
        msg: { name: '张三', phone: '15818476911', city: '广东省东莞市', detail: '南城区'},
        edit:true,
        region: ['广东省', '广州市', '海珠区'],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //type 等于1，是增加地址，等于2是修改地址
        const { edit ,msg} = this.data
        if(options.type == '1') {
            wx.setNavigationBarTitle({ title: '新增收货地址',})
            const msg = { name: '', phone: '', city: '请选择', detail: '' }
            this.setData({ msg, edit: false, defaultRadio :false })
        }else {
            wx.setNavigationBarTitle({title: '我的收货地址',})
            this.setData({
                edit:true,
                defaultRadio:true
            })
        }
    },
    /**
     * 设为默认(true 为默认选中)
     */
    default(e){
        const defaultRadio = this.data.defaultRadio
        this.setData({
            defaultRadio: !e.currentTarget.dataset['defaultradio']
        })
    },
    /**
     * 添加新的地址
     */
    addAddress(){
        wx.navigateTo({
            url: '',
        })
    },
    /**
     * 省市区三级选择
     */
    bindRegionChange(e) {
        this.data.msg.city = e.detail.value
        this.setData({
            msg:this.data.msg
        })
        console.log(this.data.msg)
    },
    /**
     * 清除当前信息
     */
    deleteMsg(e){
        var value = e.currentTarget.dataset.index
        const { msg } = this.data
        for (let key in msg) {
            if (key == value) {
                msg[key] = ''
                this.setData({ msg: this.data.msg })
            }
        }
    },
    /**
     * 删除整条地址信息
     */
    deleteAll(){
        wx.navigateTo({
            url: '/pages/mine/confirmorder/selectaddress/selectaddress',
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