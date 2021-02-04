function getNowDate(){
	const date = new Date();
	const y = date.getFullYear();
	let m = date.getMonth() + 1 ;
	let d = date.getDate();
	if(m < 10) {
		m = '0' + m
	}
	if(d< 10) d = '0' + d;
	return y+ '-' + m + '-' + d;
}
Component({
	externalClasses: ['ex-class'],
	properties: {
		dateStatus:{
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
		}
	},
	data: {
		weekDayArr: ['日', '一', '二', '三', '四', '五', '六'],
		selectedDate:'',
		displayTime:new Date().toString(),
		currentMounth: new Date().getMonth() + 1,
		currnetYear: new Date().getFullYear(),
		dateList:[],
		typeList:[],
		now: getNowDate()
	},
	observers:{
			'dateStatus': function(dateStatus) {
				let date = [];
				let type = [];
				dateStatus.map(item=>{
					// const dates = item.date.split('-');
					// const t = dates[0] +'-'+ Number(dates[1]) +'-'+ Number(dates[2]);
					date.push(item.date);
					type.push(item.type)
				})
				this.setData({
					dateList: date,
					typeList: type
				})
			}
	},
	methods: {
		
		onDayTap: function (e) {
			this.setData({
				selectedDate: e.currentTarget.dataset.date
			})
			if(e.currentTarget.dataset.disable == 'disable') return;

			this.triggerEvent('onDayTap', e.currentTarget.dataset.date)
		},
		next(){
			const { currentMounth, currnetYear} = this.data;
			let Month = currentMounth+1;
			let Year = currnetYear;
			if(Month > 12 ){
				Month = 1
				Year = currnetYear + 1;
			}
			let str = Year+ '/'+ Month+'/01';
			this.setData({
				currentMounth: Month,
				currnetYear: Year,
				displayTime: new Date(str).toString()
			})
		},
		last(){
			const { currentMounth, currnetYear} = this.data;
			let Month = currentMounth - 1;
			let Year = currnetYear;
			if(Month < 1 ){
				Month = 12
				Year = currnetYear - 1;
			}
			let str = Year+ '/'+ Month + '/01';
			this.setData({
				currentMounth: Month,
				currnetYear: Year,
				displayTime: new Date(str).toString()
			})
		}
	}
})