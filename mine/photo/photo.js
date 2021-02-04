import { Photo } from './photo-model.js'
import { Home } from '../../pages/album/home/home-model.js'
var photoModel = new Photo()
var homeModel = new Home()

const app = getApp()
var collectionArr = []
var relativeArr = []

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // tab切换
        currentTab: 0,
        collectionNum: 0,
        uploadNum:0,
        uploadList:[],
        collectionList:[],
        collextionNone:false,
        uploadNone:true,
        isLoading:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        if(app.globalData.unionid){
            this.loadCollectionList()
            this.loadImageList()
        }

    },

    /**
     * 点击tab切换
     */
    swichNav: function (e) {
        this.setData({
            currentTab: e.currentTarget.dataset.current
        })
    },
    /**
     * 加载上传图片列表
     */
    loadImageList(){
        this.setData({isLoading: true})
        var counter = 0;
        photoModel.getImageList().then(res => {
            //解析成指定格式
            var arr = []
            res.result.forEach((sortByDate, i) => {
                counter += sortByDate.imageDetails.length
                sortByDate.imageDetails.forEach((sortByActivityName, j) => {
                    var index = false
                    arr.forEach((item, k) => {
                        if (item.date == sortByDate.date && item.activityName == sortByActivityName.activityName){
                            index = k
                        }
                    })
                    sortByActivityName.index = relativeArr.length
                    relativeArr.push(sortByActivityName)
                    if (index === false){
                        arr.push({
                            date: sortByDate.date,
                            activityName: sortByActivityName.activityName,
                            data: [sortByActivityName]
                        }) 
                    } else {
                        arr[index].data.push(sortByActivityName)
                    }
                })
            })
            this.setData({
                uploadList: arr,
                uploadNum: counter,
                isLoading: false
            })
        })
    },

    /**
     * 加载收藏列表
     */
    loadCollectionList(){
        photoModel.getCollectionList().then(res => {
            if(res.code == 200){
                var list = []
                //解析成指定格式
                res.result.forEach((item, index) => { 
                    var notExist = true
                    var date1 = new Date(item.createTime.split(' ')[0]).getTime()
                    item.index = index
                    list.forEach((value, key) => {
                        var date2 = new Date(value.createTime.split(' ')[0]).getTime()
                        if (value.activityName == item.activityName && date1 == date2){
                            list[key].imgList.push(item)
                            notExist = false
                        }
                    })
                    if (notExist === true){
                        var obj = {
                            activityName: item.activityName,
                            createTime: item.createTime.split(' ')[0],
                            imgList: [item]
                        }
                        list.push(obj)
                    }
                    
                })
                collectionArr = res.result
                this.setData({
                    collectionList: list,
                    collectionNum: res.result.length
                })
                
            }
        })
    },
    /**
     * 收藏跳转到图片详情
     */
    toDetail(e){
        app.globalData.photoArr = collectionArr
        app.globalData.roomInfo.room_no = e.currentTarget.dataset.item.activityId
        wx.navigateTo({
            url: `/pages/album/detail/detail?index=${e.currentTarget.dataset.item.index}`
        })
    },
    /**
     * 上传跳转到图片详情
     */
    jump(e) {
        app.globalData.photoArr = relativeArr
        app.globalData.roomInfo.room_no = e.currentTarget.dataset.item.activityId
        wx.navigateTo({
            url: `/pages/album/detail/detail?index=${e.currentTarget.dataset.item.index}`
        })
    },
})

