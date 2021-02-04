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
        app.globalData.returnUrl = '/pages/webview/zq/zq'
        if(options.initiator){
            this.data.initiator = options.initiator
            app.globalData.returnUrl = `/pages/webview/zq/zq?initiator=${options.initiator}`
            try {
                console.log('with initiator')
                await checkinModel.getUnionid()
                await isRegistered()
                await checkinModel.saveInviteRecord(app.globalData.unionid, options.initiator, '中秋')
                wx.showToast({
                    title: '您已助力成功哦!',
                    icon: 'none'
                })
                console.log('registed ！')
                this.setData({
                    path: `https://mtqcshi.hucai.com/test/activity/zq/?unionId=${options.initiator}&selfUnionId=${app.globalData.unionid}&isRegister=1`
                })
            } catch (error) {
                console.log('unregisted ！')
                this.setData({
                    path: `https://mtqcshi.hucai.com/test/activity/zq/?unionId=${options.initiator}&isRegister=0`
                })
            }
        }else{
            this.data.initiator = app.globalData.unionid
            try {
                console.log('without initiator');
                await checkinModel.getUnionid()
                await isRegistered()
                console.log('registed ！');
                this.setData({
                    path: `https://mtqcshi.hucai.com/test/activity/zq/?unionId=${app.globalData.unionid}&selfUnionId=${app.globalData.unionid}&isRegister=1`
                })
            } catch (error) {
                console.log('unregisted ！');
                console.log(`https://mtqcshi.hucai.com/test/activity/zq/?isRegister=0`);
                
                this.setData({
                    path: `https://mtqcshi.hucai.com/test/activity/zq/?isRegister=0`
                })
            }

        }

    },

    onShareAppMessage: function(){
        console.log(this.data.curUnionId);
        return {
            title: '中秋大礼免费领，点击领取！',
            path: `/pages/webview/zq/zq?initiator=${this.data.curUnionId}`,
            imageUrl: 'https://hcmtq.oss-accelerate.aliyuncs.com/SystemImg/zqhd.jpg'
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