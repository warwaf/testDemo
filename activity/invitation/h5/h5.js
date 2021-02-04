var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        webUrl: '',
        template_id: '',
        cover: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var webUrl =  `https://mtqcshi.hucai.com/test/activity/invitation/index.html#/display?template_id=${options.templateId}&activity_id=${app.globalData.activityInfo.activityId}&union_id=${app.globalData.userInfo.unionId}&timestamp=${new Date().getTime()}&is_preview=${options.isPreview}`
        console.log(webUrl)
        this.setData({
            webUrl
        })
    },

    messageReciveHandler(e){
        console.log('messageReciveHandler', e.detail.data[0]);
        this.data.template_id = e.detail.data[0].id
        this.data.cover = e.detail.data[0].cover
        this.data.bride = e.detail.data[0].bride
        this.data.bridegRoom = e.detail.data[0].bridegRoom
    },

    onShareAppMessage: function(){
        console.log(`/activity/invitation/share/share?template_id=${this.data.template_id}&timestamp=${new Date().getTime()}`);
        return {
            title: `${this.data.bride}&${this.data.bridegRoom}的婚礼邀请`,
            path: `/activity/invitation/share/share?template_id=${this.data.template_id}&timestamp=${new Date().getTime()}`,
            // imageUrl: this.data.cover,
            imageUrl: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/1b7a6048a3ca42599357bbad57b93e78.png'
        }
    }
})