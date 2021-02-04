import activity from './thanksgiving-model'
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        path: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        var baseUrl = __wxConfig.accountInfo.appId == 'wx059f9118f045da79' ? 'https://mtqact.hucai.com/activity/201911GEJ/' : 'https://mtqcshi.hucai.com/test/activity/201911GEJ'
        try {
            const res = await activity.getUnionid()
            if(res == false){
                wx.navigateTo({
                    url: '/pages/common/userinfo/userinfo',
                })
             }else{
                var path
                if(options.fromShare){
                    path = decodeURIComponent(options.path) + `&unionid=${app.globalData.unionid}`
                }else{
                    if(this.prevPage.route == "pages/album/checkin/checkin"){
                        path = `${baseUrl}/index.html?selectUrl=${options.thanksgivingPhotoUrl || ''}&unionid=${app.globalData.unionid}`
                    }else{
                        if(app.globalData.cardType){
                            path = `${baseUrl}/edit.html?cardType=${app.globalData.cardType}&selectUrl=${options.thanksgivingPhotoUrl || ''}&unionid=${app.globalData.unionid}`
                        }else{
                            path = `${baseUrl}/entry.html?selectUrl=${options.thanksgivingPhotoUrl || ''}&unionid=${app.globalData.unionid}`
                        }
                    }
                }
                console.log(path);
                this.setData({
                    path
                })
             }
        } catch (error) {
            wx.navigateTo({
                url: '/pages/common/userinfo/userinfo',
            })
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {

    },

    /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function () {
        return {
            title: this.data.shareConfig.title,
            path: `/activity/thanksgiving/thanksgiving?path=${encodeURIComponent(this.data.shareConfig.url)}&fromShare=1`,
            imageUrl:"https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/cbff007e946446b49edecdc42b49b47a.png"
        }
    },


    messageReciveHandler(e){
        console.log(`/activity/thanksgiving/thanksgiving?path=${encodeURIComponent(e.detail.data[0].url)}&fromShare=1`);
        this.data.shareConfig = e.detail.data[0] ? e.detail.data[0] : {}
    }
})