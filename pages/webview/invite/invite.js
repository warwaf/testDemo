import { Checkin } from '../../album/checkin/checkin-model'
import { isRegistered } from '../../../utils/util'
var checkinModel = new Checkin()
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        path: '',
        initiator: '',
        curUnionId: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad (options) {
        app.globalData.returnUrl = '/pages/webview/invite/invite'
        var timestamp = (new Date()).getTime()
        if(options.initiator){
            this.data.initiator = options.initiator
            app.globalData.returnUrl = `/pages/webview/invite/invite?initiator=${options.initiator}`
            try {
                await checkinModel.getUnionid()
                app.saveUserChannel(`拉新活动`)
                await isRegistered()
            } catch (error) {
                return this.setData({
                    path: `https://mtqcshi.hucai.com/test/activity/hphy/?unionId=${options.initiator}&isRegister=0&timestamp=${timestamp}`
                    // path: `http://laxin.com/activity/hphy/?unionId=${options.initiator}&isRegister=0`
                })
            }
            var message = await checkinModel.saveInviteRecord(app.globalData.unionid, options.initiator, '普通')
            message != '操作成功' && wx.showToast({
                title: message,
                icon: 'none'
            })
            this.setData({
                path: `https://mtqcshi.hucai.com/test/activity/hphy/?unionId=${options.initiator}&selfUnionId=${app.globalData.unionid}&isRegister=1&timestamp=${timestamp}`
                // path: `http://laxin.com/activity/hphy/?unionId=${options.initiator}&selfUnionId=${app.globalData.unionid}&isRegister=1`
            })
        }else{
            this.data.initiator = app.globalData.unionid
            try {
                await checkinModel.getUnionid()
                app.saveUserChannel(`拉新活动`)
                await isRegistered()
                this.setData({
                    path: `https://mtqcshi.hucai.com/test/activity/hphy/?unionId=${app.globalData.unionid}&selfUnionId=${app.globalData.unionid}&isRegister=1&timestamp=${timestamp}`
                    // path: `http://laxin.com/activity/hphy/?selfUnionId=${app.globalData.unionid}&isRegister=1`
                })
            } catch (error) {
                this.setData({
                    path: `https://mtqcshi.hucai.com/test/activity/hphy/?isRegister=0&timestamp=${timestamp}`
                    // path: `http://laxin.com/activity/hphy/?isRegister=0`
                })
            }

        }

    },

    onShareAppMessage: function(){
        console.log(this.data.curUnionId);
        return {
            title: '帮我点一下吧，免费领冲印券！',
            path: `/pages/webview/invite/invite?initiator=${this.data.curUnionId}`,
            imageUrl: 'http://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190816/C0187910920190816/origin/d8d794ddb1d14553b1399e35b480598d.png'
        }
    },

    messageReciveHandler(e){
        console.log(e.detail.data);
        if(e.detail.data[e.detail.data.length - 1] == 1){
            this.data.curUnionId = this.data.initiator
        }else{
            this.data.curUnionId = app.globalData.unionid
        }
    }
})