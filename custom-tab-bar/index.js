import { Base } from '../utils/base'
var BaseModel = new Base()
const app = getApp();
Component({
	data: {
		selected: 0,
		color: "#7A7E83",
		selectedColor: "#222222",
		animation: '',
		height: '0',
		list: [{
			"pagePath": "/pages/album/checkin/checkin",
			"iconPath": "/resources/tab/tab_0_1.png",
			"selectedIconPath": "/resources/tab/tab_0_2.png",
			"text": "相 册"
		},
		{
			"pagePath": "/pages/discovery/index/index",
			"iconPath": "/resources/tab/tab_1_1.png",
			"selectedIconPath": "/resources/tab/tab_1_2.png",
			"text": "门 店"
		},
		{
			"pagePath": "/pages/mine/mine",
			"iconPath": "/resources/tab/tab_2_1.png",
			"selectedIconPath": "/resources/tab/tab_2_2.png",
			"text": "我 的"
		}]
	},
	attached() {
	},
	ready() {
		this.animation = wx.createAnimation({
			duration: 1000,
			timingFunction: 'ease',
			delay: 100,
		})
		this.setData({
			height: app.globalData.isIPX ? 30 : 0
		})
	},
	methods: {
		switchTab(e) {

			// BaseModel.collectFormId(e.detail.formId)
			const data = e.currentTarget.dataset
			const url = data.path
			
			this.setData({
				selected: data.index
			})
			
			wx.switchTab({ url })
		},
		show() {
			this.animation.translateY(0).step();
			this.setData({
				//输出动画
				animation: this.animation.export()
			})
		},
		hide() {
			const t = app.globalData.isIPX ? 78 : 48;
			this.animation.translateY(t).step()
			this.setData({
				//输出动画
				animation: this.animation.export()
			})
		}
	}
})