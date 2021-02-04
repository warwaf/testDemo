var app = getApp()
import { Beauty } from '../../beauty-model';
const beauty = new Beauty();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 上午时间列表
        amList:['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30'],
        //  下午时间列表
        pmList:['12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30'],
        // 选中的时间
        selected:'8:00',
        // 日期
        date: null,
        // 
        currentDate: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.date){
            this.setData({
                date: this.filterDate(options.date),
                currentDate: options.date
            })
        }
    },

    /**
     * 重新选择日期
     */
    changeDate(){
        wx.redirectTo({
            url:'/pages/album/beauty/calendar/calendar?type=0'
        })
    },
    /**
     * 过滤时间格式
     * @param {*} date 
     */
    filterDate(date){
       const t = date.split('-');
       return t[0]+ '年' + t[1] + '月' + t[2] + '日'
    },
    /**
     * 选择时间
     * @param {*} e 
     */
    selectDate(e){
        this.setData({
            selected: e.currentTarget.dataset.value
        })
    },

    /**
     * 提交
     */
    submit(){
        // todo
        const { currentDate, selected } = this.data;
        beauty.createReservate(currentDate+' '+ selected +':00').then(res=>{
            if(res.meta.code == 0){
                wx.redirectTo({
                    url: '/pages/album/beauty/home',
                })
                wx.showToast({
                    title: '预约成功',
                    icon: 'none',
                    duration: 2000
                })
            }else{
                wx.showToast({
                    title: '预约失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    }
})