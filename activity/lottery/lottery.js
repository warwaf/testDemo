const app = getApp().globalData

import lotteryModel from './lottery-model'
import activityModel from '../setting/setting-model'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        lotteryMap: [],
        headerUrl: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/a4f7987945a24d6ea22ac3d1d1ec8a9a.png',
        footerUrl: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/f1219f88f91c4616ba0a2fc3cafe3175.png',
        bgUrl: 'https://hucai-simoo.oss-cn-hangzhou.aliyuncs.com/p1.hucai.com/20190326/C0002928120190326/origin/1186725977744ec0923738bf961dd76e.png',
        bgColor: '#FFE2F1',
        partners: [],   //参与者列表
        lotteryInfo: {},
        isOwner: true,  //是否为房间主人
        sessionStat: false,
        selectIndex: 0,
        quantity: 1,
        prize: '',
        lotteryResult: [],
        resultStat: false,
        dialogStat: false,
        isEnd: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            isOwner: app.unionid == app.activityInfo.unionId
        })

        this.init()

        lotteryModel.getAllAttend().then(res => {
            this.setData({
                partners: res
            })
        })
    },

    init(){
        lotteryModel.getLotteryInfo().then(res => {
            //过滤奖项为空的
            if(res.prizeRuleList){
                for (let index = 0; index < res.prizeRuleList.length; index++) {
                    const element = res.prizeRuleList[index];
                    if(!element.prizeNameList){
                        res.prizeRuleList.splice(index)
                    }
                }
            }

            this.setData({
                lotteryInfo: res
            })
        })
    },

    toExcute(){
        if(this.data.partners.length <= 1) return
        //进行中需要先结束活动
        if(app.activityInfo.activityPrize.state == 0 && this.data.isEnd === false){
            this.setData({
                dialogStat: true
            })
            return
        }
        else{
            for (let index = 0; index < this.data.lotteryInfo.prizeRuleList.length; index++) {
                const element = this.data.lotteryInfo.prizeRuleList[index]
                if(element.state == null){
                    this.setData({
                        selectIndex: index,
                        quantity: element.total,
                        prize: element.prizeNameList
                    })
                    break
                }
            }
            this.setData({
                sessionStat: !this.data.sessionStat
            })
        }
    },

    disagree(){
        this.setData({
            dialogStat: false
        })
    },

    agree(){
        activityModel.changeState(app.activityInfo.activityPrize.eventId, 2).then(res => {
            this.setData({
                dialogStat: false,
                isEnd: true
            })
            this.toExcute()
        })
    },

    hideSession(){
        this.setData({
            sessionStat: false
        })
    },

    excute(){
        var prizeLevel = this.data.lotteryInfo.prizeRuleList[this.data.selectIndex].prizeLevel
        if(this.data.lotteryInfo.lotteryList){
            if(this.data.lotteryInfo.lotteryList.reduce((acc, item) => acc || item.prizeLevel == prizeLevel, false)){
                wx.showToast({
                    title: '该奖项已开',
                    icon: 'none'
                })
                return
            }
        }
        lotteryModel.excuteLottery(prizeLevel).then(res => {
            this.setData({
                lotteryResult: res,
                resultStat: 1,
                sessionStat: true
            })
            setTimeout(() => {
                this.setData({
                    resultStat: 2
                })
            }, 2000)
        })
    },

    switchItem(e){
        var curIndex = e.currentTarget.dataset.index
        if(curIndex == 3) return
        if(this.data.lotteryInfo.prizeRuleList[curIndex].state == 1)return
        this.setData({
            selectIndex: curIndex,
            quantity: this.data.lotteryInfo.prizeRuleList[curIndex].prizeCount,
            prize: this.data.lotteryInfo.prizeRuleList[curIndex].prizeNameList
        })
    },
    
    stop(){
        return false
    },

    hideResult(){
        this.init()
        this.setData({
            resultStat: false
        })
    }
    
})