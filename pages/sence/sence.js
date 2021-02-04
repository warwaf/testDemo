//index.js
//获取应用实例
var app = getApp()
var userinfo = app.globalData.userinfo
Page({
  data: {   
    SceneDetails: [],//场景详情    
    detialsIndex: 0// 当前显示详情的下标
  },
  onLoad: function (options) {
    this.getSceneDetails() 
  },
  onShow: function () {
  },
  changeScene: function(e) {
    var _query=this.data
    console.log(e)  
    if (e.detail.value == undefined) {      
      app.globalData.options.scene_name = _query.SceneDetails[_query.detialsIndex].name
      app.globalData.options.channel_id = _query.SceneDetails[_query.detialsIndex].channel_id
    } else {
       
      for (var i = 0; i < _query.SceneDetails.length; i++) {
        if (e.detail.value === _query.SceneDetails[i].key) {
         
          this.setData({
            detialsIndex: i,
          })
          app.globalData.options.channel_id = _query.SceneDetails[i].channel_id
          app.globalData.options.scene_name = _query.SceneDetails[i].name
        }

      }
    }
  },
  gotoUpload: function(){
    var _query = app.globalData.options
    var flag = _query.access_key !== undefined && _query.store_id !== undefined
      && _query.branch_id !== undefined && _query.customer_name !== undefined
      && _query.customer_phone !== undefined && _query.customer_phone !== '' && _query.scene_name !== undefined
      && _query.product_sku !== undefined && _query.if_correct !== undefined
      && _query.channel_id !== undefined
    if (flag){
          wx.navigateTo({
          url: '/pages/image/image'
        })
      }
  },
  getSceneDetails:function(loadrul) {
    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading',
      duration: 60000
    });
    var _this = this;
    var _url = loadrul == undefined ? app.globalData.hucaiApi + 'persent/' + app.globalData.options.store_id + '_' + app.globalData.options.branch_id + '.json' : loadrul
    wx.request({
      url: _url,
      data: {},
      success: function (res) {   
        wx.hideToast();
      if (res.statusCode==200){
        var lis = res.data
        var _SceneDetails=[]                 
        for (var i = 0; i < lis.length; i++) {  
          var item = lis[i]
          item.image = app.globalData.hucaiApi + lis[i].image
            _SceneDetails.push(lis[i])
            if (i == 0) {
              _SceneDetails[i].checked=true
            }
         
        } 
        _this.setData({         
          SceneDetails: _SceneDetails,          
        })
    app.globalData.options.scene_name = _SceneDetails[_this.data.detialsIndex].name
    app.globalData.options.channel_id = _SceneDetails[_this.data.detialsIndex].channel_id 
       

      }else{
        var err=''
        if (res.statusCode == 502) {
          //err = '缺少配置'+app.globalData.options.store_id + '_' + app.globalData.options.branch_id + '.json'+'文件'
          var newurl = app.globalData.hucaiApi + 'persent/C1509_C1509-1.json'
          _this.getSceneDetails(newurl)
        }else{
          err = '获取场景数据失败'
          wx.showModal({
            title: '提示',
            content: err,
            showCancel: false
          }) 
        }
       
      }
      },
    fail: function (res) {
        console.log('rrr',res)
      }
    }) 
  }
})