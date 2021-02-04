import apiSetting from "../../../../utils/ApiSetting"

function getNowDate(param) {
	const date = param ? param : new Date();
	const y = date.getFullYear();
	let m = date.getMonth() + 1;
	let d = date.getDate();
	if (m < 10) {
		m = '0' + m
	}
	if (d < 10) d = '0' + d;
	return y + '-' + m + '-' + d;
}
const app = getApp();

Component({
	externalClasses: ['ex-class'],
	properties: {
		dateStatus: {
			type: Array,
			value: []
		},
		// 显示几个
		displayMonthNum: {
			type: Number,
			value: 1
		},
		isShow: {
			type: String
		},
		selectDate: {
			type: String
		},
		storeNo: {
			type: String
		},
		deadlineDate: {
			type: String
		}
	},
	data: {
		weekDayArr: ['日', '一', '二', '三', '四', '五', '六'],
		selectedDate: "", // 选中日期
		displayTime: new Date().toString(),
		currentMounth: new Date().getMonth() + 1,
		currnetYear: new Date().getFullYear(),
		dateList: [], // 不可选日期
		typeList: [],
		now: getNowDate(), // 当前日期
		disDay: getNowDate(new Date((new Date()).getTime() + 4 * 24 * 3600 * 1000)), // 5天后才可预约，例：当天1号，6号才可预约
		shopNo: "",
		deadline: "" // 截止日期
	},
	observers: {
		'dateStatus': function (dateStatus) {
			let date = [];
			let type = [];
			dateStatus.map(item => {
				// const dates = item.date.split('-');
				// const t = dates[0] +'-'+ Number(dates[1]) +'-'+ Number(dates[2]);
				date.push(item.date);
				type.push(item.type)
			})
			this.setData({
				dateList: date,
				typeList: type
			})
		},
		selectDate: function (selectDate) {
			this.setData({
				selectedDate: this.properties.selectDate
			})
		},
		storeNo: function (storeNo) {
			console.log("properties storeNo", storeNo)
			this.setData({
				shopNo: this.properties.storeNo
			})
		},
		deadlineDate: function (deadlineDate) {
			this.setData({
				deadline: this.properties.deadlineDate
			})
		}
	},
	lifetimes: {
    attached: function () {
			
		},
		ready: function () {
			console.log(this.properties.storeNo, this.data.shopNo)
			this.getCalendarList()
		},
  },
	methods: {
		/**
		 * 获取预约日历
		 */
		getCalendarList() {
			let y = this.data.currnetYear, m = this.data.currentMounth
			if (m < 10) m = '0' + m;
			let date = y + "-" + m
			wx.request({
				url: apiSetting.mtqFindList,
				data: {
					storeCode: this.properties.storeNo || this.data.shopNo,
					date: date,
					orderNo: app.globalData.schedulUserInfo.no ? app.globalData.schedulUserInfo.no : ""
				},
				header: {
					'content-type': 'application/json'
				},
				method: 'POST',
				dataType: 'json',
				responseType: 'text',
				success: (res) => {
					let _res = res.data
					console.log("预约日历 >>", _res)
					let list = _res.result.list, date = []
					list.forEach(item => {
						switch (item.state) {
							// 0和2不可约，1可约
							case 0:
							case 2:	
								date.push(item.reserveDate)
								break;
						
							default:
								break;
						}
					});
					this.setData({
						dateList: date,
						deadline: _res.result.dueDate
					})
					console.log("dateList >>", this.data.dateList)
				},
				fail: () => {},
				complete: () => {}
			});
		},
		/**
		 * 选择日期
		 * @param {*} e 
		 */
		onDayTap: function (e) {
			let select = e.currentTarget.dataset.date
			this.setData({
				selectedDate: select
			})
			console.log(e, select)
			if (e.currentTarget.dataset.disable == 'disable' || (e.currentTarget.dataset.disable == 'today' && this.data.dateList.length > 0)) {
				select = ""
			};

			this.triggerEvent('onDayTap', select)
		},
		/**
		 * 下一月
		 */
		next() {
			const {
				currentMounth,
				currnetYear
			} = this.data;
			let Month = currentMounth + 1;
			let Year = currnetYear;
			// deadlineYear截止日期年， deadlineMonth截止日期月
			let deadlineYear = new Date(this.data.deadline).getFullYear(), deadlineMonth = new Date(this.data.deadline).getMonth() + 1
			console.log(deadlineMonth)
			if (Month > deadlineMonth && deadlineYear <= currnetYear) {
				// 秒杀活动 && BD活动 预约功能2020年12月30日截止
				return
				Month = 1
				Year = currnetYear + 1;
			} else if (Month > 12) {
				Month = 1
				Year = currnetYear + 1;
			}
			let str = Year + '/' + Month + '/01';
			this.setData({
				currentMounth: Month,
				currnetYear: Year,
				displayTime: new Date(str).toString()
			})
			this.getCalendarList()
		},
		/**
		 * 上一月
		 */
		last(e) {
			let { changedate } = e.currentTarget.dataset
			const {
				currentMounth,
				currnetYear
			} = this.data;
			let Month = currentMounth > 1 ? currentMounth - 1 : currentMounth;
			let Year = currnetYear;
			let nowMonth = new Date().getMonth() + 1, nowYear = new Date().getFullYear()
			console.log(">> >>", changedate.year, nowYear, currentMounth)
			if (changedate.year > nowYear) {
				if (currentMounth == 1) {
					Month = 12
					Year = changedate.year - 1;
				} else {
					Month = currentMounth - 1
				}
			} else if (changedate.year == Year) {
				if (Month < nowMonth) {
					// 控制日期不能早于当前月份
					return
				} 
			}
			let str = Year + '/' + Month + '/01';
			this.setData({
				currentMounth: Month,
				currnetYear: Year,
				displayTime: new Date(str).toString()
			})
			this.getCalendarList()
		}
	}
})