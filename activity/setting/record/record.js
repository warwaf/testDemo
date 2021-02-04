import activityModel from '../setting-model'
import lotteryModel from '../../lottery/lottery-model'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        sessionStat: false,
        selectIndex: 0,
        prizeRules: [],
        quantity: '',
        prize: '',
        lotteryResult: [],
        resultStat: false,
        dialogStat: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },

    onShow(){
        this.init()
    },

    init(){
        activityModel.getRoomRecord().then(list => {
            var arr = []
            for (let index = 0; index < list.length; index++) {
                const element = list[index]
                if(element.state !== -1){
                    arr.push(element)
                }
            }
            this.setData({
                list: arr
            })
        })
    },

    switchTab(e){
        var list = this.data.list
        list.map((item, index) => {
            if(index == e.currentTarget.dataset.index){
                item.status = !item.status
            }else{
                item.status = false
            }
            return item
        })
        this.setData({
            list
        })
    },

    switchActivityState(e){
        this.data.curIndex = e.currentTarget.dataset.index
        this.setData({
            dialogStat: true,
            ['list['+ e.currentTarget.dataset.index +'].state']: 0
        })
    },

    disagree(){
        this.setData({
            dialogStat: false
        })
    },

    agree(){
        activityModel.changeState(this.data.list[this.data.curIndex].eventId, 2).then(res => {
            this.init()
            this.setData({
                dialogStat: false
            })
        })
    },

    createActivity(){
        wx.navigateTo({
            url: '../create/create'
        })
    },

    switchItem(e){
        var curIndex = e.currentTarget.dataset.index
        console.log(curIndex);
        
        console.log(this.data.curIndex);
        
        if(this.data.list[this.data.curIndex].event.signInRule.prizeRules[curIndex].prizeLevel == 4) return
        this.setData({
            selectIndex: curIndex,
            quantity: this.data.list[this.data.curIndex].event.signInRule.prizeRules[curIndex].total,
            prize: this.data.list[this.data.curIndex].event.signInRule.prizeRules[curIndex].prizeNameList
        })
    },

    toExcute(e){
        var curIndex = e.currentTarget.dataset.index
        this.data.curIndex = curIndex
        this.setData({
            sessionStat: true,
            lotteryInfo: this.data.list[curIndex],
            selectIndex: 0,
            quantity: this.data.list[curIndex].event.signInRule.prizeRules[0].total,
            prize: this.data.list[curIndex].event.signInRule.prizeRules[0].prizeNameList
        })
    },



    excute(){
        var prizeLevel = this.data.lotteryInfo.event.signInRule.prizeRules[this.data.selectIndex].prizeLevel
        lotteryModel.excuteLottery(prizeLevel, this.data.lotteryInfo.eventId).then(res => {
            this.setData({
                lotteryResult: res,
                resultStat: 1,
                sessionStat: false,
                selectLevel: prizeLevel
            })
            setTimeout(() => {
                this.setData({
                    resultStat: 2
                })
            }, 2000)
        })
    },

    hideSession(){
        this.setData({
            sessionStat: false
        })
    },

    hideResult(){
        this.init()
        this.setData({
            resultStat: false
        })
    },

    stop(){
        return false
    }
})