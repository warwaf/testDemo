import { Setting } from '../setting-model.js'
var settingModel = new Setting()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNo: 1,
        pageSize: 10,
        members: [],
        completedLoad: false,
        selectedArr: [],
        sessionStat: false,
        inputValue: '',
        isEmpty: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //json文件配置失效
        wx.setNavigationBarTitle({
            title: '移除相册成员'
            })

        wx.setNavigationBarColor({
            backgroundColor: '#ffffff',
            frontColor: '#000000'
        })

        this.getMembers()

    },

    getMembers(){
        if(this.data.completedLoad) return
        wx.showLoading()
        settingModel.getMembers(this.data.pageNo, this.data.pageSize).then(res => {
            var list = res.result.list, ownIndex = false
            var completedLoad = false
            if(list.length < this.data.pageSize){
                completedLoad = true
            }
            for (let index = 0; index < list.length; index++) {
                const element = list[index]
                if(this.data.selectedArr.indexOf(element.unionId) !== -1){
                    list[index].picked = true
                }
                if(element.unionId == app.globalData.activityInfo.unionId){
                    ownIndex = index
                }
            }
            ownIndex !== false && list.splice(ownIndex, 1)
            this.setData({
                members: [...this.data.members, ...list],
                pageNo: this.data.pageNo + 1,
                completedLoad
            })
            wx.hideLoading()
        })
    },

    pick(e){
        var index = e.currentTarget.dataset.index
        
        if(this.data.members[index].picked){
            this.data.selectedArr.map((item, key) => {
                if(item == this.data.members[index].unionId){
                    this.data.selectedArr.splice(key , 1)
                }
            })
        }else{
            this.data.selectedArr.push(this.data.members[index].unionId)
        }
        
        this.setData({
            ['members['+ index +'].picked'] : !this.data.members[index].picked,
            selectedArr: this.data.selectedArr
        })
    },

    inputHandler(e){
        this.setData({
            inputValue: e.detail.value
        })
    },

    /**
     * 模糊搜索
     */
    search(){
        if(!this.data.inputValue) return
        this.setData({ isEmpty: false })
        settingModel.searchMembers(this.data.inputValue).then(res => {
            if(!Boolean(res.length)){
                this.setData({ 
                    isEmpty: true,
                    members: res
                })
                return
            }
            res.forEach((item, index) => {
                if(item.unionId == app.globalData.activityInfo.unionId){
                    res.splice(index, 1)
                }
            })
            res.map((item, index) => {
                if(this.data.selectedArr.indexOf(item.unionId) !== -1){
                    res[index].picked = true
                }
            })
            this.setData({
                members: res
            })
        })
    },
    /**
     * 确认删除
     */
    excute(){
        this.setData({
            members: [],
            sessionStat: false
        })
        settingModel.removeMember(this.data.selectedArr.join(',')).then(res => {
            this.setData({
                selectedArr: []
            })
            this.data.pageNo = 1
            this.data.completedLoad = false
            this.getMembers()
            wx.showModal({
                title: '移除成功啦',
                content: '温馨提示：可以设置相册密钥保护你的隐私哦',
                showCancel: false
            })
        })
    },

    clearSearch(){
        this.setData({
            inputValue: '',
            isEmpty: false,
            members: []
        })
        this.data.completedLoad = false
        this.data.pageNo = 1
        this.getMembers()
    },

    onReachBottom(){
        this.getMembers()
    },

    none(){
        return false
    },

    showSession(){
        this.setData({
            sessionStat: true
        })
    },

    hideSession(){
        this.setData({
            sessionStat: false
        })
    }
})