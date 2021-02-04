var app = getApp()
import regeneratorRuntime from '../../../../utils/runtime';
import { Search } from '../search-model.js'
const searchModel = new Search()
import { Home } from '../../home/home-model.js'
var homeModel = new Home()
var photoArr = []
Page({

    /**
     * 页面的初始数据
     */
    data: {
        infoList: [],
        photo: [],
        type: '',
        isShow: true,
        isLoading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.setData({
            type: options.classType
        })

        this.photosByClass();
        this.listAllByActivityId(options.classType);
    },

    async photosByClass(groupFaceId) {
        this.setData({
            isShow: false,
            isLoading: true
        })

        // wx.showLoading({
        //     title: '加载中。。。',
        // })
        const data = {
            activityId: app.globalData.activityInfo.activityId,
            pageNo: 1,
            pageSize: 100,
            type: this.data.type
        }
        if (groupFaceId) data['groupFaceId'] = groupFaceId;
        const res = await searchModel.getPhotosByClass(data);
        photoArr = res.result.list;
        this.setData({
            isShow: true,
            isLoading: false
        })

        // wx.hideLoading();
        var columnWidth = Math.floor((wx.getSystemInfoSync().windowWidth - 32) / 2)
        for (let i = 0; i < photoArr.length; i++) {
            if (photoArr[i]) {
                photoArr[i].index = i
                photoArr[i].height = Math.floor(photoArr[i].picHeight / (photoArr[i].picWidth / columnWidth))
                this.setData({
                    photo: photoArr[i]
                })
            }
        }
    },

    async listAllByActivityId(type) {
        // wx.showLoading({
        //     title: '加载中。。。',
        // })
        this.setData({ isLoading: true })
        const res = await searchModel.listAllByActivityId(app.globalData.activityInfo.activityId, type);
        const arr = [];
        // wx.hideLoading();
        let temp = [{ id: 'hc-1', type: 'all', selected: true }];
        console.log(res);

        res.map((item, index) => {
            temp.push(item);
            if (index % 2 == 0) {
                arr.push(temp)
                temp = []
            } else {
                if (res.length - 1 == index) {
                    temp.push({ id: 'hc-2', type: 'last' })
                    arr.push(temp)
                }
            }
        })
        this.setData({
            infoList: arr,
            isLoading: false
        })
    },
    selectItem(e) {
        const { id, type, groupFaceId } = e.currentTarget.dataset.info;
        const { infoList } = this.data;
        if (type === 'last') return;
        const arr = [];
        infoList.map(item => {
            const temp = []
            item.map(items => {
                if (items.id == id) {
                    items.selected = true;
                } else {
                    items.selected = false;
                }
                // if(type && type == 'all') items.selected = true;
                temp.push(items)
            })
            arr.push(temp)
        })
        if (type == 'all') {
            this.photosByClass();
        } else {
            this.photosByClass(groupFaceId);
        }
        this.setData({
            infoList: arr
        })
    },
    /**
     * 跳转到详情页
     */
    showDetail: function(event) {
        var currentIndex = event.detail.index === undefined ? event.currentTarget.dataset.index : event.detail.index
        app.globalData.photoArr = photoArr

        homeModel.addPicHot(photoArr[currentIndex].picId, 1)
        wx.navigateTo({
            url: `/pages/album/detail/detail?index=${currentIndex}&room_no=${app.globalData.roomInfo.room_no}`
        })
    },

    toDiy(){
        app.globalData.diyData = photoArr
        wx.navigateTo({
            url: '/pages/album/diy/diy'
        })
    },
    
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
})