import { Detail } from '../../detail/detail-model.js'
import { isLogin } from '../../../../utils/util'
import { List } from '../list-model.js'
var listModel = new List()
var detailModel = new Detail()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        movementInfo: {},
        anonymous:false,
        userInfo: {},
        showArrangeInfo: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //或者动态详情
        detailModel.getDetail(options.id).then(data => {
            if (data) {
                this.setData({
                    movementInfo: data
                })
                wx.setNavigationBarTitle({
                    title: data.nickName
                })
            } 
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({ 
            anonymous: JSON.stringify(app.globalData.userInfo) == '{}'
        })
    },

        /**
     * 马上预约
     */
    toArrange(){
        if(this.data.anonymous){
            return this.setData({
                authorityTips: true
            })
        }

        if(!isLogin()){
            return wx.navigateTo({
                url: '/pages/common/userPhone/userPhone'
            })
        }

        this.setData({
            userInfo: {...app.globalData.userInfo},
            showArrangeInfo: true
        })

        // wx.redirectTo({
        //     url: '/pages/discovery/arrange/arrange?id=' + app.globalData.discoverInfo.id,
        // })
    },

    onGotUserInfo(e) {
        listModel.updateUserInfo(e).then(() => {
            this.setData({
                authorityTips: false,
                anonymous: false
            })
        })
    },

    hideArrangeInfo(){
        this.setData({ showArrangeInfo: false })
    },

    modifyUserInfo(e){
        this.data.userInfo[e.currentTarget.dataset.type] = e.detail.value
    },

    hideAuthority(){
        this.setData({
            authorityTips: false
        })
    },

    confirmArrange(){
        wx.showLoading({ mask: true })
        listModel.recordArrange(this.data.userInfo, this.data.discoverInfo.storeId).then(res =>{
            wx.hideLoading()
            if(res.code == 201){
                return wx.showToast({
                    title: '您已预约过，请耐心等待',
                    icon: 'none',
                    duration: 1500
                })
            }
            this.setData({ showArrangeInfo: false })
            wx.showToast({
                title: '预约成功',
                duration: 3000
            })
        })
    },

    onShareAppMessage: function() {
        return {
            title: this.data.movementInfo.nickName,
            path: `/pages/discovery/list/detail/detail?id=${this.data.movementInfo.id}`,
            imageUrl: this.data.movementInfo.imgUrlsList[0].picUrl + '?x-oss-process=image/resize,w_600'
        }
    }
})