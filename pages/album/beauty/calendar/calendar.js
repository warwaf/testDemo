var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isCalendarShow: 'block',
        dateStatus:[],
        selectedDate:null,
        showDate:null,
        type: 0
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.type)
         this.setData({
             type: options.type
         })
    },
    /**
     * 跳转
     */
    jump(){
        const { type, selectedDate } = this.data;
        if(!selectedDate){
            wx.showToast({
                title: '请选择时间！',
                icon: 'none'
            })
            return;
        }
        let url = `/pages/album/beauty/calendar/date/date?date=${selectedDate}`
        if(type == 1) {
            url = `/pages/album/subscribe/index?type=1&time=${selectedDate}`;
            wx.redirectTo({
                url
            })
        }else{
            wx.navigateTo({
                url
            })
        }
    },
    /**
     * 过滤时间
     * @param {*} date 
     */
    filterDate(date){
      const t = date.split('-');
      return t[1] + '月' + t[2] + '号'
    },
    /**
     * 选择时间
     * @param {*} e 
     */
    onCalendarDayTap(e){
        this.setData({
            selectedDate: e.detail,
            showDate: this.filterDate(e.detail)
        })
    }
})