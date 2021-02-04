// pages/discovery/search/search.js
import { Search } from './search-model.js'
const searchModel = new Search()

// import { Checkin } from '../checkin/checkin-model.js'
// const checkinModel = new Checkin()

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        empty: true,
        list:[],
        // relative: [],
        // allList: [],
        // otherList: [],
        // first: false,
        canvas_width: 136,
        canvas_height: 136,
        // navigationHeight: app.globalData.navigationHeight,
        move: 'up',
        navigateText: 'true',
        activityId: 0,
        groupFaceId: '',
        facerelative: false,
        faceid: '',
        remImg: {},
        mineImg: {},
        noWrm: false,
        isLoading: false,
        pageNo: 1,
        pageSize: 40
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function() {

    },
    async onShow() {
        // app.globalData.roomInfo.room_no='hc-f-860864'
        // app.globalData.userInfo.unionId="oYnHqs51rx8cCNdCZVYUdC_yMjbs"
        this.setData({
            activityId: app.globalData.roomInfo.room_no,
            faceid: app.globalData.userInfo.groupFaceId ? app.globalData.userInfo.groupFaceId : '',
            isLoading: true
        })
        // const res = await searchModel.getAllClassByRoom(app.globalData.roomInfo.room_no)
        // const arr = []
        // for(var key in res.result){
        //     arr.push({
        //         name: key,
        //         child: res.result[key]
        //     })
        // }

        this.loadData()

        const res1 = await searchModel.getAnalysicInfoByGroup();
        const { all, others, recommendation, mostAttrative, myself } = res1.result;
        // arr.push({
        //     name: '全部',
        //     child: all
        // })
        this.setData({
            // allList: all,
            // otherList: others,
            remImg: mostAttrative,
            // relative: recommendation,
            mineImg: myself,
            // list: arr,
            isLoading:false
        })
        if(myself.picUrl){
            wx.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#FFE329'
            })
        }else{
            wx.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#FFFFFF'
            })
        }
    },
    /**
     * 加载人脸数据
     */
    async loadData(){
        wx.showLoading()
        var res = await searchModel.listAll({ 
            activityId: app.globalData.roomInfo.room_no,
            pageSize: this.data.pageSize,
            pageNo: this.data.pageNo
        })
        var list = this.data.list.concat(res.result.list)
        this.setData({
            list,
            pageNo: this.data.pageNo + 1
        })
        wx.hideLoading()
    },
    /**
     *  暂无“万人迷”页面
     */
    noWrm() {
        wx.navigateTo({
            url: `/pages/album/search/macdaddy/macdaddy`,
        })
    },
    /**
     *  查找自己的照片
     */
    searchmine: function() {
        wx.navigateTo({
            url: `/pages/album/search/searchmine/searchmine?activityId=${this.data.activityId}`,
        })
    },
    searchResult(e){
        const { info } = e.currentTarget.dataset;
        if(info.tag){
            wx.navigateTo({
                url: `/pages/album/search/result/result?classType=${info.classType}`,
            })
        }else{
            app.globalData.searchInfo = info
            wx.navigateTo({
                url: `/pages/album/search/searchresult/searchresult`,
            })
        }
    },
    /**
     *  查找某个人的照片
     */
    searchwho: function(e) {
        const { info, from } = e.currentTarget.dataset;
        app.globalData.searchInfo = info;
        wx.navigateTo({
            url: `/pages/album/search/searchresult/searchresult?from=${from}`,
        })
    },
    jumpAll(){
        wx.navigateTo({
            url: `/pages/album/search/allResult/allResult`,
        })
    }
})