import { Setting } from '../setting-model.js'
var settingModel = new Setting()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        groupArr: [],
        inputValue: '',
        curIndex: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.init()
    },

    async init(){
        var groupArr = await settingModel.getGroup()
        this.setData({ groupArr })
    },

    focusHandler(e){
        const { index } = e.target.dataset
        this.data.curIndex = index
        this.data.inputValue = this.data.groupArr[index].classification
    },

    async confirmHandler(e){
        if(this.data.curIndex === false && this.data.isLoading) return
        const curClassification = this.data.groupArr[this.data.curIndex].classification
        this.data.groupArr[this.data.curIndex].classification = e.detail.value
        wx.showLoading()
        var res = await app.verifyContent(e.detail.value)
        if(!res || e.detail.value == '') {
            return wx.showToast({
                title: '内容不符合要求，请重新输入',
                icon: 'none'
            })
        }
        var repeat = this.data.groupArr.reduce((acculator, value) => {
            if(value.classification == e.detail.value){
                acculator += 1
            }
            return acculator
        } , 0)
        if(repeat > 1){
            return wx.showToast({
                title: '组名请不要重复',
                icon: 'none'
            })
        }
        this.data.isLoading = true
        // if(curItem && curItem.classificationCount !== undefined){
        //更新
            await settingModel.saveGroup(e.detail.value, curClassification)
            this.prevPage.prevPage.updateGroups()   //更新主页面
        // }else{
        //新增
            // await settingModel.saveGroup(e.detail.value)
            // this.prevPage.prevPage.updateGroups()   //更新主页面
        // }
        this.init()
        this.data.isLoading = false
        wx.hideLoading()
    },

    async create(){
        wx.showLoading()
        await settingModel.saveGroup(`Group ${this.data.groupArr.length}`)
        this.prevPage.prevPage.updateGroups()   //更新主页面
        this.init()
        wx.hideLoading()
    },

    async romveHandler(e){
        const curIndex = e.currentTarget.dataset.index, curItem = this.data.groupArr[curIndex], groupArr = this.data.groupArr
        if(curItem && curItem.classificationCount !== undefined){
            wx.showLoading()
            await settingModel.delGroup(curItem.classification)
            this.prevPage.prevPage.updateGroups()   //更新主页面
            this.init()
            wx.hideLoading()
        }else{
            groupArr.splice(curIndex, 1)
            this.setData({ groupArr })
        }
    }
})