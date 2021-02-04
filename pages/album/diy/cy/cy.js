import { Home } from '../../home/home-model'
import { Diy } from '../diy-model'
import regeneratorRuntime from '../../../../utils/runtime.js'
import { getLocaltion } from '../../../../utils/util.js'

var homeModel = new Home()
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
     * customerNo=渠道号  activityType= 活动类型 2001 (冲印活动-泰安自提) 2002(冲印活动-全国邮寄)
     */
    onLoad: async function(options) {
        
        let { activityType, customerNo, url } = options;
        if(app.globalData.activityType) activityType = app.globalData.activityType
        app.globalData.activityType = activityType;
        app.globalData.isCy = true;
        this.data.customerNo = customerNo;
        this.data.activityType = activityType;
        let baseUrl = url ? url : 'https://m.xm520.com/activity/guafen1/index.html';
        let urlTemp = ''
        try {
            await homeModel.getUnionid()
            await homeModel.getUserPhoneByUnionId()
            var city = await getLocaltion()
            var activity_id = await diyModel.createRoom(city, customerNo ? customerNo : '')
            var activityInfo = await homeModel.getActivityInfo(activity_id);
            // 默认活动地址  如果 activityType 不存在
            if(activityType == 2001) {
                baseUrl = url ? url :'https://m.xm520.com/activity/guafen1/index.html';
                app.globalData.returnUrl = '/pages/album/diy/cy/cy?activityType=2001&customerNo='+customerNo
            }
            if(activityType == 2002) {
                baseUrl = url ? url :'https://m.xm520.com/activity/SNQS/index.html'
                app.globalData.returnUrl = '/pages/album/diy/cy/cy?activityType=2002&customerNo='+customerNo
            }
            urlTemp = `${baseUrl}?activity_id=${activityInfo.deployRoom[0].voucherId}&event_id=${activity_id}&customer_no=${app.globalData.userInfo.memberId}&returnUrl=${encodeURIComponent('/pages/album/home/home?room_no=' + activity_id)}&city=${city}&time=${new Date().getTime()}`

        } catch (error) {
            if(activityType == 2001) {
                baseUrl = url ? url : 'https://m.xm520.com/activity/guafen1/index.html';
                app.globalData.returnUrl = '/pages/album/diy/cy/cy?activityType=2001'
            }
            if(activityType == 2002) {
                baseUrl = url ? url : 'https://m.xm520.com/activity/SNQS/index.html'
                app.globalData.returnUrl = '/pages/album/diy/cy/cy?activityType=2002'
            }
            urlTemp = baseUrl
        }
        console.log(url);
        this.setData({
            url:urlTemp
        })
        console.log(this.data.url);
        
    },

    
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        const {customerNo,activityType} = this.data;
        return {
            title: '一起瓜分冲印券',
            path: `/pages/album/diy/cy/cy?customerNo=${customerNo}&activityType=${activityType}`,
            imageUrl: 'https://hcmtq.oss-accelerate.aliyuncs.com/linshi/fxinag.png'
        }
    }
})