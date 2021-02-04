import { Base } from '../../../utils/base.js'
import apiSettings from '../../../utils/ApiSetting';

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hotList: [
            {name:'北京', latitude: 39.90, longitude: 116.40 },
            {name:'广州', latitude: 23.13, longitude: 113.27 },
            {name:'上海', latitude: 31.23, longitude: 121.47  },
            {name:'深圳', latitude: 22.55, longitude: 114.05 },
            {name:'东莞', latitude: 23.05, longitude: 113.75 },
            {name:'泰安', latitude: 36.20, longitude: 117.08 },
            {name:'合肥', latitude: 31.82057, longitude: 117.22901 },
            {name:'金华', latitude: 29.07812, longitude: 119.64759 }
        ],
        cityList: [],
        currentCity: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            currentCity: options.city
        })
        wx.request({
            // url: 'https://mtqcshi.hucai.com/test/mtq-store.json',
            url: apiSettings.Host + '/discover/areasList',
            method: 'POST',
            success: res => {
                let _res = res.data
                this.setData({ cityList: _res.result })
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    selectHandler(e){
        app.globalData.currentCity = e.currentTarget.dataset.city
        wx.navigateBack({
            delta: 1
        })
    }
})