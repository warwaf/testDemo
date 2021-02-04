import QaModel from './qa-model'
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        curIndex: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        var list = await QaModel.getQuestionList()
        this.setData({
            list
        })
    },

    switchAnswer(e){
        var curIndex = e.currentTarget.dataset.index
        app.globalData.mta.Event.stat('c_mtq_Qa_Problem_Browse',{ 
            'name': this.data.list[curIndex].questionName,
            'wxid': app.globalData.unionid
        })
        if(curIndex === this.data.curIndex){
            this.setData({
                curIndex: false
            })
        }else{
            this.setData({
                curIndex
            })
        }
    }
})