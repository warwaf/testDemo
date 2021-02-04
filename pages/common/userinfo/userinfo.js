import { Base } from '../../../utils/base.js'
const baseModel = new Base()
var app = getApp()
Page({


	/**
	 * 页面的初始数据
	 */
	data: {
		_path: '',
		fromlist:false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { fromlist } = options
		if(fromlist){
			this.setData({
				fromlist:true
			})
		}
		var obj = getCurrentPages().slice(-2)[0], url = '/'
		if(JSON.stringify(obj.options) !== '{}'){
			url += obj.route + '?'
			for(var k in obj.options){
				url += `${k}=${obj.options[k]}&`
			}
		}else{
			url += obj.route
		}
	
		this.setData({
			_path: decodeURIComponent(options.path),
			url
		})
	},

	onGotUserInfo: function (e) {
		app.globalData.userInfo = e.detail.userInfo
		app.globalData.options.customer_name = e.detail.userInfo.nickName

		baseModel.getUnionid().then(() => {
			wx.request({
				url: baseModel.apiSettings.Updatauser,
				data: {
					unionId:  app.globalData.unionid,
					openId: app.globalData.openid,
					nickName: app.globalData.userInfo.nickName,
					avatarUrl: app.globalData.userInfo.avatarUrl,
					gender:app.globalData.userInfo.gender,
					country: app.globalData.userInfo.country,
					province: app.globalData.userInfo.province,
					city: app.globalData.userInfo.city,
					language: app.globalData.userInfo.language,
					remarks1: '小程序',
					activityId: app.globalData.fromShare ? app.globalData.roomInfo.room_no : ''
				},
				header: {
					"Content-Type": "application/json",
					accessToken: app.globalData.mtq_token
				},
				method: 'POST',
				success: data => {
					// wx.navigateBack({
					// 	delta: 0
					// })
					if(this.data.url.indexOf('checkin') != -1 || this.data.url.indexOf('discovery') != -1){
						console.log('switchTab')
						if(this.data.fromlist){
							wx.redirectTo({
								url: this.data.url
							})
						}else{
							wx.switchTab({
								url: this.data.url
							})
						}
						
					}else{
						console.log(this.data.url);
						wx.redirectTo({
							url: this.data.url
						})
					}
				}
			})
		})

	},
})