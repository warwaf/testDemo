import activityModel from '../setting-model'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tips: true,
        beginDate: '年/月/日',
        endDate: '年/月/日',
        maxTimes: 1,
        eventName: '',
        prizeRules: [
            {title: '一等奖', total: 1, prizeNameList: '', prizeLevel:1, prizeCount:1},
            {title: '二等奖', total: 1, prizeNameList: '', prizeLevel:2, prizeCount:1},
            {title: '三等奖', total: 1, prizeNameList: '', prizeLevel:3, prizeCount:1},
            {title: '安慰奖', total: 999, prizeNameList: '', prizeLevel:4, prizeCount:1}
        ],
        consolation: false,
        commentError: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    save(){
        var prompt = ''
        if(!this.data.eventName){
            prompt = '活动名称不能为空'
        }
        if(Date.parse(this.data.beginDate) == NaN || Date.parse(this.data.endDate) == NaN){
            prompt = '活动时间不能为空'
        }else{
            if(Date.parse(this.data.endDate) - Date.parse(this.data.beginDate) < 0){
                prompt = '结束时间不能早于开始时间'
            }
            if(Date.parse(this.data.beginDate) - Date.parse(new Date()) + 3600 * 24 * 1000 <= 0){
                prompt = '开始时间必须大于目前时间'
            }
        }
        if(this.data.maxTimes <= 0){
            prompt = '中奖次数不能小于1'
        }

        if(!this.data.consolation){
            this.data.prizeRules.splice(3, 1)
        }

        this.data.prizeRules.forEach(item => {
            if(Math.floor(item.total) < 1){
                prompt = '奖项数量不能小于1'
            }
            if(!item.prizeNameList){
                prompt = '奖项名称不能为空'
            }
        })

        if(prompt){
            wx.showToast({
                title: prompt,
                icon: 'none'
            })
            return
        }

        activityModel.saveAvtivity(this.data).then(res => {
            wx.navigateBack({
                delta: 1
            })
        }).catch(err => {
            this.setData({
                commentError: true
            })
        })
    },
    cancle(){
        this.setData({
            commentError: false
        })
    },

    hideTips(){
        this.setData({
            tips: false
        })
    },

    eventNameInputHandler(e){
        this.data.eventName = e.detail.value
    },

    bindBeginDateChange(e){
        this.setData({
            beginDate: e.detail.value
        })
    },

    bindEndDateChange(e){
        this.setData({
            endDate: e.detail.value
        })
    },

    switchConsolation(){
        this.setData({
            consolation: !this.data.consolation
        })
    },

    prizeNameInputHandler(e){
        var index = e.currentTarget.dataset.index
        this.data.prizeRules[index].prizeNameList = e.detail.value
    },

    prizeTotalInputHandler(e){
        var index = e.currentTarget.dataset.index
        this.data.prizeRules[index].total = e.detail.value
    },

    maxTimesInputHandler(e){
        this.data.maxTimes = e.detail.value
    }
})