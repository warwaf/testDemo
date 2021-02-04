import {
  Index
} from '../../../discovery/index/index-model.js'
import {
  getCoordinate,
  getLocaltionByCoordinate
} from '../../../../utils/util'

var indexModel = new Index()
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    discoverList: [],
    discoverLoading: false,
    isLoading: true,
    city: "",
    shopName: ""
  },
  onLoad: function (options) {
    this.setData({
      shopName: options.shopName ? options.shopName : "",
      city: options.city ? options.city : ""
    })
    console.log(">>>", options)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    this.loadList()
  },
  /**
   * 获取门店列表
   */
  async loadList() {
    var coordinate = {
      latitude: '',
      longitude: ''
    }

    try {
      coordinate = await getCoordinate()
      this.setData({
        authorize: true
      })
  } catch (error) {
      this.setData({
        authorize: false
      })
    }

    if(this.data.city){
      coordinate.name = this.data.city
      this.setData({
        city: coordinate.name
      })
    }else{
      try {
        var city = await getLocaltionByCoordinate(coordinate.latitude, coordinate.longitude)
        coordinate.name = city.replace('市','')
        this.setData({
          city: city.replace('市','')
        })
      } catch (error) {
        coordinate.name = '深圳'
        this.setData({
          city: '未知'
        })
      }
    }
    let unionid = app.globalData.unionid ? app.globalData.unionid : ""
    indexModel.getStoreList(coordinate.latitude, coordinate.longitude, unionid, "", this.data.city, "", this.data.shopName).then(result => {
      this.setData({
        discoverList: result.result,
        discoverLoading: true,
        isLoading: false
      })
    })
  },
  /**
   * 进入门店
   */
  goStore: function (e) {
    var discoverInfo = e.currentTarget.dataset['info']
    app.globalData.discoverInfo = discoverInfo
    wx.navigateTo({
      url: `/pages/discovery/store/store?special=1&style=${this.data.curStyle}`,
    })
  },
})
